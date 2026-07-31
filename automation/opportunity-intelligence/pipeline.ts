import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validateOpportunityReport } from '../../src/features/opportunity-intelligence/reportSchema';
import { rankCards } from '../../src/features/opportunity-intelligence/scoring';
import type {
  OpportunityInsight,
  OpportunityReport,
  OpportunitySource,
  RadarKind,
} from '../../src/features/opportunity-intelligence/types';
import {
  canonicalizeUrl,
  classifyEvidenceSource,
  deduplicateEvidence,
  normalizeSearchResults,
  type SearchResult,
} from './evidence';
import {
  getQueryPack,
  resolveCollectionLimits,
  type CollectionLimits,
  type QueryKind,
  type SearchQuery,
} from './queryPacks';
import {
  resolveXaiModel,
  type ProviderTokenUsage,
  type SynthesisProviderResult,
} from './grok';

export interface SynthesisEvidenceRecord {
  id: string;
  radar: RadarKind;
  topic: string;
  title: string;
  url: string;
  publishedAt: string;
  tier: 1 | 2 | 3;
  primary: boolean;
  factualStatement: string;
}

export interface SynthesisInput {
  kind: QueryKind;
  model?: string;
  generatedAt: string;
  windowStart: string;
  windowEnd: string;
  evidence: SynthesisEvidenceRecord[];
  repairErrors: string[];
}

export type OpportunitySearch = (
  query: string,
  options: {
    days: number;
    maxResults: number;
    startDate: string;
    endDate: string;
    signal?: AbortSignal;
  },
) => Promise<SearchResult[]>;

export type OpportunitySynthesizer = (
  input: SynthesisInput,
) => Promise<unknown | SynthesisProviderResult>;

export interface RunOpportunityPipelineOptions {
  kind: QueryKind;
  dryRun: boolean;
  now: Date;
  search: OpportunitySearch;
  synthesize: OpportunitySynthesizer;
  outputDir: string;
  env?: Record<string, string | undefined>;
  collectionLimits?: CollectionLimits;
  model?: string;
  debugLog?: (message: string) => void;
}

export interface OpportunityPipelineSummary {
  status: 'published' | 'dry-run' | 'no-signal';
  kind: QueryKind;
  itemCount: number;
  laneCounts: Record<RadarKind, number>;
  evidenceCount: number;
  searchFailures: number;
  synthesisRequests: number;
  tokenUsage: ProviderTokenUsage;
  elapsedMs: number;
}

interface CollectedSearchResult {
  query: SearchQuery;
  results?: SearchResult[];
  error?: unknown;
}

type UnknownRecord = Record<string, unknown>;

const dailyModelDraftFields = ['items'] as const;
const weeklyModelDraftFields = ['items', 'thesis', 'watchNext'] as const;
const modelItemFields = [
  'id',
  'lane',
  'title',
  'verifiedFacts',
  'inference',
  'whyItMatters',
  'recommendedAction',
  'confidence',
  'scores',
  'sourceIds',
  'topics',
] as const;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizedTokenCount(value: unknown): number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function isSynthesisProviderResult(value: unknown): value is SynthesisProviderResult {
  return isRecord(value)
    && Object.prototype.hasOwnProperty.call(value, 'value')
    && isRecord(value.usage)
    && typeof value.usage.promptTokens === 'number'
    && typeof value.usage.completionTokens === 'number'
    && typeof value.usage.totalTokens === 'number';
}

function sanitizeError(error: unknown): Error {
  let message = error instanceof Error ? error.message : String(error);
  const secrets = [process.env.TAVILY_API_KEY, process.env.XAI_API_KEY]
    .filter((secret): secret is string => typeof secret === 'string' && secret.length > 0);
  for (const secret of secrets) message = message.split(secret).join('[REDACTED]');
  message = message
    .replace(/bearer\s+[^\s",}]+/gi, 'Bearer [REDACTED]')
    .replace(/("?(?:api[_-]?key|authorization)"?\s*[:=]\s*"?)([^",\s}]+)/gi, '$1[REDACTED]')
    .replace(/\s+/g, ' ')
    .slice(0, 1_000);
  return new Error(message);
}

function emitDebugLine(
  debugLog: RunOpportunityPipelineOptions['debugLog'],
  value: UnknownRecord,
  env: Record<string, string | undefined> | undefined,
): void {
  if (!debugLog) return;
  let line = JSON.stringify(value);
  const secrets = [env?.TAVILY_API_KEY, env?.GEMINI_API_KEY, env?.XAI_API_KEY]
    .filter((secret): secret is string => typeof secret === 'string' && secret.length > 0);
  for (const secret of secrets) line = line.split(secret).join('[REDACTED]');
  try {
    debugLog(line);
  } catch {
    // Diagnostics must never change collection or publishing behavior.
  }
}

function emitEvidenceDiagnostics(
  options: RunOpportunityPipelineOptions,
  collected: CollectedSearchResult[],
  evidence: SynthesisEvidenceRecord[],
): void {
  if (!options.debugLog) return;
  const failedSearches = collected.filter((entry) => entry.error !== undefined).length;
  emitDebugLine(options.debugLog, {
    type: 'opportunity-debug-summary',
    queryFamilies: collected.length,
    successfulSearches: collected.length - failedSearches,
    failedSearches,
    rawResults: collected.reduce((total, entry) => total + (entry.results?.length ?? 0), 0),
    normalizedEvidence: evidence.length,
    qualifyingPrimary: evidence.filter((record) => record.primary && record.tier <= 2).length,
  }, options.env);
  evidence.forEach((record) => emitDebugLine(options.debugLog, {
    type: 'opportunity-debug-evidence',
    id: record.id,
    lane: record.radar,
    topic: record.topic,
    title: record.title,
    url: record.url,
    domain: new URL(record.url).hostname.toLowerCase().replace(/^www\./, ''),
    publishedAt: record.publishedAt,
    tier: record.tier,
    primary: record.primary,
    excerpt: record.factualStatement.trim().replace(/\s+/g, ' ').slice(0, 200),
  }, options.env));
}

async function collectSearches(
  queries: SearchQuery[],
  search: OpportunitySearch,
  now: Date,
): Promise<CollectedSearchResult[]> {
  const collected: CollectedSearchResult[] = new Array(queries.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < queries.length) {
      const index = nextIndex;
      nextIndex += 1;
      const query = queries[index];
      try {
        collected[index] = {
          query,
          results: await search(query.query, {
            days: query.days,
            maxResults: query.maxResults,
            startDate: new Date(now.getTime() - query.days * 24 * 60 * 60 * 1_000)
              .toISOString()
              .slice(0, 10),
            endDate: new Date(now.getTime() + 24 * 60 * 60 * 1_000)
              .toISOString()
              .slice(0, 10),
          }),
        };
      } catch (error) {
        collected[index] = { query, error };
      }
    }
  }

  await Promise.all(Array.from(
    { length: Math.min(3, queries.length) },
    () => worker(),
  ));
  return collected;
}

function compactStatement(value: unknown, fallback: string): string {
  const statement = typeof value === 'string' ? value : fallback;
  return statement.trim().replace(/\s+/g, ' ').slice(0, 500);
}

function buildSynthesisEvidence(
  collected: CollectedSearchResult[],
  now: Date,
): SynthesisEvidenceRecord[] {
  const byUrl = new Map<string, Omit<SynthesisEvidenceRecord, 'id'>>();

  for (const entry of collected) {
    if (!entry.results) continue;
    const rawByUrl = new Map(
      entry.results.flatMap((result) => {
        const canonicalUrl = typeof result.url === 'string' ? canonicalizeUrl(result.url) : null;
        return canonicalUrl ? [[canonicalUrl, result] as const] : [];
      }),
    );
    const normalized = normalizeSearchResults(
      entry.results.map((result) => ({ ...result, days: entry.query.days })),
      now,
    );
    for (const source of normalized) {
      if (byUrl.has(source.url)) continue;
      const original = rawByUrl.get(source.url);
      byUrl.set(source.url, {
        radar: entry.query.radar,
        topic: entry.query.topic,
        title: source.title,
        url: source.url,
        publishedAt: source.publishedAt,
        tier: source.tier,
        primary: source.primary,
        factualStatement: compactStatement(original?.content, source.title),
      });
    }
  }

  const deduplicated = deduplicateEvidence([...byUrl.values()].map((record) => ({
    url: record.url,
    title: record.title,
    domain: new URL(record.url).hostname.toLowerCase().replace(/^www\./, ''),
    publishedAt: record.publishedAt,
    tier: record.tier,
    primary: record.primary,
  })));

  return deduplicated
    .map((source) => byUrl.get(source.url))
    .filter((record): record is Omit<SynthesisEvidenceRecord, 'id'> => record !== undefined)
    .sort((left, right) => left.url.localeCompare(right.url))
    .map((record, index) => ({
      id: `evidence-${String(index + 1).padStart(3, '0')}`,
      ...record,
    }));
}

function sourceFromEvidence(record: SynthesisEvidenceRecord): OpportunitySource {
  return {
    url: record.url,
    title: record.title,
    domain: new URL(record.url).hostname.toLowerCase().replace(/^www\./, ''),
    publishedAt: record.publishedAt,
    tier: record.tier,
    primary: record.primary,
  };
}

function parseModelResponse(value: unknown): { value?: UnknownRecord; errors: string[] } {
  let parsed = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return { errors: ['Model response was not valid JSON'] };
    }
  }
  if (!isRecord(parsed)) return { errors: ['Model response: expected a JSON object'] };
  return { value: parsed, errors: [] };
}

function resolveAndValidateDraft(
  candidate: unknown,
  input: SynthesisInput,
): { report?: OpportunityReport; errors: string[] } {
  const parsed = parseModelResponse(candidate);
  if (!parsed.value) return { errors: parsed.errors };
  const draft = parsed.value;
  const errors = [...parsed.errors];
  const allowedDraftFields: readonly string[] = input.kind === 'daily'
    ? dailyModelDraftFields
    : weeklyModelDraftFields;

  Object.keys(draft).forEach((field) => {
    if (!allowedDraftFields.includes(field)) {
      errors.push(`${field}: unknown model field`);
    }
  });
  if (input.kind === 'weekly') {
    if (draft.thesis !== undefined
      && (typeof draft.thesis !== 'string' || draft.thesis.trim().length === 0)) {
      errors.push('thesis: expected a non-empty string');
    }
    if (draft.watchNext !== undefined) {
      if (!Array.isArray(draft.watchNext)) {
        errors.push('watchNext: expected an array of strings');
      } else {
        draft.watchNext.forEach((entry, index) => {
          if (typeof entry !== 'string' || entry.trim().length === 0) {
            errors.push(`watchNext[${index}]: expected a non-empty string`);
          }
        });
      }
    }
  }
  if (!Array.isArray(draft.items)) {
    errors.push('items: expected an array');
    return { errors };
  }

  const evidenceById = new Map(input.evidence.map((record) => [record.id, record]));
  const resolvedItems: unknown[] = draft.items.map((item, index) => {
    if (!isRecord(item)) {
      errors.push(`items[${index}]: expected an object`);
      return item;
    }
    Object.keys(item).forEach((field) => {
      if (!modelItemFields.includes(field as typeof modelItemFields[number])) {
        errors.push(`items[${index}].${field}: unknown model field`);
      }
    });
    if (!Array.isArray(item.sourceIds) || item.sourceIds.length === 0) {
      errors.push(`items[${index}].sourceIds: expected a non-empty evidence ID array`);
    }
    if (!isRecord(item.scores)) {
      errors.push(`items[${index}].scores: expected an object`);
    }

    const sourceIds = Array.isArray(item.sourceIds) ? item.sourceIds : [];
    const sources = sourceIds.flatMap((sourceId, sourceIndex) => {
      if (typeof sourceId !== 'string') {
        errors.push(`items[${index}].sourceIds[${sourceIndex}]: expected an evidence ID`);
        return [];
      }
      const evidence = evidenceById.get(sourceId);
      if (!evidence) {
        errors.push(`items[${index}].sourceIds[${sourceIndex}]: unknown evidence ID`);
        return [];
      }
      if (evidence.tier === 3) {
        errors.push(`items[${index}].sourceIds[${sourceIndex}]: tier-3 evidence cannot support a claim`);
        return [];
      }
      return [sourceFromEvidence(evidence)];
    });

    const { sourceIds: _sourceIds, ...reportItem } = item;
    return { ...reportItem, sources };
  });

  if (errors.length > 0) return { errors };

  const normalizedTitles = new Set<string>();
  resolvedItems.forEach((item, index) => {
    if (!isRecord(item) || typeof item.title !== 'string') return;
    const title = item.title.trim().replace(/\s+/g, ' ').toLowerCase();
    if (normalizedTitles.has(title)) {
      errors.push(`items[${index}].title: duplicate normalized title`);
    }
    normalizedTitles.add(title);
  });
  if (errors.length > 0) return { errors };

  const primaryEventsByLane = new Map<string, number>();
  resolvedItems.forEach((item, itemIndex) => {
    if (!isRecord(item) || (item.lane !== 'build' && item.lane !== 'career')
      || !Array.isArray(item.sources)) {
      return;
    }
    const itemPrimaryUrls = new Set(
      item.sources.flatMap((source) => (
        isRecord(source) && source.primary === true && typeof source.url === 'string'
          ? [source.url]
          : []
      )),
    );
    itemPrimaryUrls.forEach((url) => {
      const eventKey = `${item.lane}\u0000${url}`;
      const previousItemIndex = primaryEventsByLane.get(eventKey);
      if (previousItemIndex !== undefined) {
        errors.push(
          `items[${itemIndex}].sources: duplicate primary event citation from items[${previousItemIndex}]`,
        );
      } else {
        primaryEventsByLane.set(eventKey, itemIndex);
      }
    });
  });
  if (errors.length > 0) return { errors };

  const rankedItems = rankCards(resolvedItems as OpportunityInsight[]).slice(0, 5);
  const eligibleLanes = new Set(
    input.evidence
      .filter((record) => record.primary && record.tier <= 2)
      .map((record) => record.radar),
  );
  const representedLanes = new Set(rankedItems.map((item) => item.lane));
  eligibleLanes.forEach((lane) => {
    if (!representedLanes.has(lane)) errors.push(`items: requires an eligible ${lane} lane insight`);
  });

  const report = {
    schemaVersion: 1,
    reportType: input.kind,
    generatedAt: input.generatedAt,
    windowStart: input.windowStart,
    windowEnd: input.windowEnd,
    model: input.model ?? resolveXaiModel(),
    items: rankedItems,
    runStatus: 'fresh',
    ...(input.kind === 'weekly' && typeof draft.thesis === 'string' ? { thesis: draft.thesis } : {}),
    ...(input.kind === 'weekly' && Array.isArray(draft.watchNext) ? { watchNext: draft.watchNext } : {}),
  };

  const allowedUrls = new Set(input.evidence.filter((record) => record.tier <= 2).map((record) => record.url));
  const directlyVerifiableUrls = new Set(
    input.evidence
      .filter((record) => classifyEvidenceSource(record.url).directlyVerifiable)
      .map((record) => record.url),
  );
  const validation = validateOpportunityReport(report, allowedUrls, directlyVerifiableUrls);
  if (!validation.ok) errors.push(...validation.errors);

  return errors.length === 0 && validation.ok
    ? { report: validation.value, errors: [] }
    : { errors };
}

function summary(
  status: OpportunityPipelineSummary['status'],
  kind: QueryKind,
  report: OpportunityReport | undefined,
  evidenceCount: number,
  searchFailures: number,
  synthesisRequests: number,
  tokenUsage: ProviderTokenUsage,
  startedAt: number,
): OpportunityPipelineSummary {
  const items = report?.items ?? [];
  return {
    status,
    kind,
    itemCount: items.length,
    laneCounts: {
      build: items.filter((item) => item.lane === 'build').length,
      career: items.filter((item) => item.lane === 'career').length,
    },
    evidenceCount,
    searchFailures,
    synthesisRequests,
    tokenUsage,
    elapsedMs: Math.max(0, Date.now() - startedAt),
  };
}

async function persistAtomically(
  report: OpportunityReport,
  outputDir: string,
  directlyVerifiableUrls: ReadonlySet<string>,
): Promise<void> {
  await mkdir(outputDir, { recursive: true });
  const target = join(outputDir, `opportunity-${report.reportType}.json`);
  const temporary = join(outputDir, `.opportunity-${report.reportType}.${randomUUID()}.tmp`);
  const serialized = `${JSON.stringify(report, null, 2)}\n`;

  try {
    await writeFile(temporary, serialized, { encoding: 'utf8', flag: 'wx' });
    const exactCopy = await readFile(temporary, 'utf8');
    if (exactCopy !== serialized) throw new Error('Temporary report verification failed');
    let parsed: unknown;
    try {
      parsed = JSON.parse(exactCopy);
    } catch {
      throw new Error('Serialized report was not valid JSON');
    }
    const allowedUrls = new Set(report.items.flatMap((item) => item.sources.map((source) => source.url)));
    const validation = validateOpportunityReport(parsed, allowedUrls, directlyVerifiableUrls);
    if (!validation.ok) {
      throw new Error(`Serialized report validation failed: ${validation.errors.join('; ')}`);
    }
    await rename(temporary, target);
  } catch (error) {
    await rm(temporary, { force: true }).catch(() => undefined);
    throw error;
  }
}

export async function runOpportunityPipeline(
  options: RunOpportunityPipelineOptions,
): Promise<OpportunityPipelineSummary> {
  const startedAt = Date.now();
  try {
    if (!Number.isFinite(options.now.getTime())) throw new Error('now must be a valid date');

    const queries = getQueryPack(
      options.kind,
      options.collectionLimits ?? resolveCollectionLimits(options.kind, options.env),
    );
    const collected = await collectSearches(queries, options.search, options.now);
    const searchFailures = collected.filter((entry) => entry.error !== undefined).length;
    const evidence = buildSynthesisEvidence(collected, options.now);
    emitEvidenceDiagnostics(options, collected, evidence);
    const successfulQueryFamilies = collected.length - searchFailures;
    const requiredSuccessfulFamilies = Math.ceil(queries.length / 2);
    const qualifyingPrimary = evidence.filter((record) => record.primary && record.tier <= 2);
    const primaryLanes = new Set(qualifyingPrimary.map((record) => record.radar));
    const meetsCollectionQuorum = successfulQueryFamilies >= requiredSuccessfulFamilies
      && qualifyingPrimary.length >= 2
      && primaryLanes.has('build')
      && primaryLanes.has('career');

    if (!meetsCollectionQuorum) {
      if (searchFailures > 0) {
        throw new Error(
          `Evidence collection quorum not met: ${successfulQueryFamilies} of ${queries.length} query families succeeded; `
          + `${qualifyingPrimary.length} unique qualifying primary sources remained across `
          + `${[...primaryLanes].join(', ') || 'no'} lanes`,
        );
      }
      return summary(
        'no-signal',
        options.kind,
        undefined,
        evidence.length,
        searchFailures,
        0,
        { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        startedAt,
      );
    }

    const generatedAt = options.now.toISOString();
    const maximumLookbackDays = Math.max(...queries.map((query) => query.days));
    const windowMilliseconds = maximumLookbackDays * 24 * 60 * 60 * 1_000;
    const baseInput: SynthesisInput = {
      kind: options.kind,
      model: options.model ?? resolveXaiModel(options.env),
      generatedAt,
      windowStart: new Date(options.now.getTime() - windowMilliseconds).toISOString(),
      windowEnd: generatedAt,
      evidence,
      repairErrors: [],
    };

    let report: OpportunityReport | undefined;
    let repairErrors: string[] = [];
    let synthesisRequests = 0;
    const tokenUsage: ProviderTokenUsage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const synthesized = await options.synthesize({ ...baseInput, repairErrors });
      synthesisRequests += 1;
      const providerResult = isSynthesisProviderResult(synthesized) ? synthesized : undefined;
      if (providerResult) {
        tokenUsage.promptTokens += sanitizedTokenCount(providerResult.usage.promptTokens);
        tokenUsage.completionTokens += sanitizedTokenCount(providerResult.usage.completionTokens);
        tokenUsage.totalTokens += sanitizedTokenCount(providerResult.usage.totalTokens);
      }
      const candidate = providerResult?.value ?? synthesized;
      const resolved = resolveAndValidateDraft(candidate, baseInput);
      if (resolved.report) {
        report = resolved.report;
        break;
      }
      repairErrors = resolved.errors;
    }
    if (!report) throw new Error(`Synthesis validation failed: ${repairErrors.join('; ')}`);

    const directlyVerifiableUrls = new Set(
      evidence
        .filter((record) => classifyEvidenceSource(record.url).directlyVerifiable)
        .map((record) => record.url),
    );
    if (!options.dryRun) await persistAtomically(report, options.outputDir, directlyVerifiableUrls);

    return summary(
      options.dryRun ? 'dry-run' : 'published',
      options.kind,
      report,
      evidence.length,
      searchFailures,
      synthesisRequests,
      tokenUsage,
      startedAt,
    );
  } catch (error) {
    throw sanitizeError(error);
  }
}
