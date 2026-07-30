import type {
  BootstrapOpportunityReport,
  Confidence,
  OpportunityInsight,
  OpportunityReport,
  OpportunityReportFile,
  OpportunityScores,
  OpportunitySource,
} from './types';

export type OpportunityReportValidationResult =
  | { ok: true; value: OpportunityReport }
  | { ok: false; errors: string[] };

export type OpportunityReportFileValidationResult =
  | { ok: true; value: OpportunityReportFile }
  | { ok: false; errors: string[] };

type UnknownRecord = Record<string, unknown>;

export const OPPORTUNITY_REPORT_LIMITS = {
  modelLength: 100,
  insightIdLength: 120,
  insightTitleLength: 240,
  narrativeLength: 1_200,
  verifiedFacts: 6,
  factLength: 500,
  sources: 6,
  sourceUrlLength: 2_048,
  sourceTitleLength: 300,
  sourceDomainLength: 253,
  topics: 10,
  topicLength: 80,
  thesisLength: 1_600,
  watchNext: 8,
  watchNextLength: 500,
} as const;

const reportFields = [
  'schemaVersion',
  'reportType',
  'generatedAt',
  'windowStart',
  'windowEnd',
  'model',
  'items',
  'runStatus',
] as const;
const weeklyFields = [...reportFields, 'thesis', 'watchNext'] as const;
const insightFields = [
  'id',
  'lane',
  'title',
  'verifiedFacts',
  'inference',
  'whyItMatters',
  'recommendedAction',
  'confidence',
  'scores',
  'sources',
  'topics',
] as const;
const scoreFields = [
  'evidenceQuality',
  'productOpportunity',
  'careerLeverage',
  'urgency',
  'novelty',
  'overall',
] as const;
const sourceFields = ['url', 'title', 'domain', 'publishedAt', 'tier', 'primary'] as const;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function addUnknownFieldErrors(value: UnknownRecord, allowedFields: readonly string[], path: string, errors: string[]): void {
  Object.keys(value).forEach((field) => {
    if (!allowedFields.includes(field)) {
      errors.push(`${path}${path ? '.' : ''}${field}: unknown field`);
    }
  });
}

function isIsoDateTime(value: unknown): value is string {
  if (typeof value !== 'string'
    || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) {
    return false;
  }
  return Number.isFinite(Date.parse(value));
}

function requireString(
  value: unknown,
  path: string,
  errors: string[],
  maximumLength?: number,
): value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push(`${path}: expected a non-empty string`);
    return false;
  }
  if (maximumLength !== undefined && value.length > maximumLength) {
    errors.push(`${path}: expected at most ${maximumLength} characters`);
    return false;
  }
  return true;
}

function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/^www\./, '');
}

function normalizedHttpsUrlHostname(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' ? normalizeHostname(parsed.hostname) : null;
  } catch {
    return null;
  }
}

function validateStringArray(
  value: unknown,
  path: string,
  errors: string[],
  limits: { minimum: number; maximum: number; itemLength: number },
): value is string[] {
  if (!Array.isArray(value)) {
    errors.push(`${path}: expected an array of strings`);
    return false;
  }
  if (value.length < limits.minimum || value.length > limits.maximum) {
    errors.push(`${path}: expected between ${limits.minimum} and ${limits.maximum} entries`);
  }
  value.forEach((entry, index) => requireString(
    entry,
    `${path}[${index}]`,
    errors,
    limits.itemLength,
  ));
  return true;
}

function validateScores(value: unknown, path: string, errors: string[]): value is OpportunityScores {
  if (!isRecord(value)) {
    errors.push(`${path}: expected an object`);
    return false;
  }

  addUnknownFieldErrors(value, scoreFields, path, errors);
  scoreFields.forEach((field) => {
    const score = value[field];
    if (typeof score !== 'number' || !Number.isFinite(score) || !Number.isInteger(score) || score < 0 || score > 100) {
      errors.push(`${path}.${field}: expected a finite integer from 0 to 100`);
    }
  });
  if (typeof value.evidenceQuality === 'number'
    && Number.isFinite(value.evidenceQuality)
    && Number.isInteger(value.evidenceQuality)
    && value.evidenceQuality < 60) {
    errors.push(`${path}.evidenceQuality: must be at least 60`);
  }
  return true;
}

function validateSource(
  value: unknown,
  path: string,
  errors: string[],
  allowedUrls?: ReadonlySet<string>,
  windowStartTimestamp?: number,
  windowEndTimestamp?: number,
): value is OpportunitySource {
  if (!isRecord(value)) {
    errors.push(`${path}: expected an object`);
    return false;
  }

  addUnknownFieldErrors(value, sourceFields, path, errors);
  const url = value.url;
  const hasUrl = requireString(url, `${path}.url`, errors, OPPORTUNITY_REPORT_LIMITS.sourceUrlLength);
  requireString(value.title, `${path}.title`, errors, OPPORTUNITY_REPORT_LIMITS.sourceTitleLength);
  const domain = value.domain;
  const hasDomain = requireString(
    domain,
    `${path}.domain`,
    errors,
    OPPORTUNITY_REPORT_LIMITS.sourceDomainLength,
  );
  if (!isIsoDateTime(value.publishedAt)) {
    errors.push(`${path}.publishedAt: expected an ISO date-time`);
  } else {
    const publishedTimestamp = Date.parse(value.publishedAt);
    if (windowStartTimestamp !== undefined
      && windowEndTimestamp !== undefined
      && (publishedTimestamp < windowStartTimestamp || publishedTimestamp > windowEndTimestamp)) {
      errors.push(`${path}.publishedAt: must be inside the report window`);
    }
  }
  if (value.tier !== 1 && value.tier !== 2 && value.tier !== 3) errors.push(`${path}.tier: expected 1, 2, or 3`);
  if (value.tier === 3) errors.push(`${path}.tier: tier 3 sources are not allowed in generated reports`);
  if (typeof value.primary !== 'boolean') errors.push(`${path}.primary: expected a boolean`);

  const urlHostname = hasUrl ? normalizedHttpsUrlHostname(url) : null;
  if (hasUrl) {
    if (!urlHostname) errors.push(`${path}.url: expected an HTTPS URL`);
    if (allowedUrls && !allowedUrls.has(url)) errors.push(`${path}.url: not included in the allowed URL set`);
  }
  if (urlHostname && hasDomain && normalizeHostname(domain) !== urlHostname) {
    errors.push(`${path}.domain: must match the URL hostname`);
  }

  return true;
}

function hasIndependentCorroboration(sources: OpportunitySource[]): boolean {
  const primaryHostnames = new Set(
    sources
      .filter((source) => source.primary)
      .map((source) => normalizedHttpsUrlHostname(source.url))
      .filter((hostname): hostname is string => hostname !== null),
  );
  return sources.some((source) => {
    const hostname = normalizedHttpsUrlHostname(source.url);
    return !source.primary
      && (source.tier === 1 || source.tier === 2)
      && hostname !== null
      && !primaryHostnames.has(hostname);
  });
}

function isTrustedDirectlyVerifiablePrimary(
  source: OpportunitySource,
  directlyVerifiableUrls?: ReadonlySet<string>,
): boolean {
  const hostname = normalizedHttpsUrlHostname(source.url);
  return source.primary
    && (source.tier === 1 || source.tier === 2)
    && hostname !== null
    && directlyVerifiableUrls?.has(source.url) === true;
}

function validateInsight(
  value: unknown,
  path: string,
  errors: string[],
  allowedUrls?: ReadonlySet<string>,
  directlyVerifiableUrls?: ReadonlySet<string>,
  windowStartTimestamp?: number,
  windowEndTimestamp?: number,
): value is OpportunityInsight {
  if (!isRecord(value)) {
    errors.push(`${path}: expected an object`);
    return false;
  }

  addUnknownFieldErrors(value, insightFields, path, errors);
  requireString(value.id, `${path}.id`, errors, OPPORTUNITY_REPORT_LIMITS.insightIdLength);
  if (value.lane !== 'build' && value.lane !== 'career') errors.push(`${path}.lane: expected build or career`);
  requireString(value.title, `${path}.title`, errors, OPPORTUNITY_REPORT_LIMITS.insightTitleLength);
  validateStringArray(value.verifiedFacts, `${path}.verifiedFacts`, errors, {
    minimum: 1,
    maximum: OPPORTUNITY_REPORT_LIMITS.verifiedFacts,
    itemLength: OPPORTUNITY_REPORT_LIMITS.factLength,
  });
  requireString(value.inference, `${path}.inference`, errors, OPPORTUNITY_REPORT_LIMITS.narrativeLength);
  requireString(value.whyItMatters, `${path}.whyItMatters`, errors, OPPORTUNITY_REPORT_LIMITS.narrativeLength);
  requireString(
    value.recommendedAction,
    `${path}.recommendedAction`,
    errors,
    OPPORTUNITY_REPORT_LIMITS.narrativeLength,
  );
  if (value.confidence !== 'developing' && value.confidence !== 'medium' && value.confidence !== 'high') {
    errors.push(`${path}.confidence: expected developing, medium, or high`);
  }
  validateScores(value.scores, `${path}.scores`, errors);
  validateStringArray(value.topics, `${path}.topics`, errors, {
    minimum: 1,
    maximum: OPPORTUNITY_REPORT_LIMITS.topics,
    itemLength: OPPORTUNITY_REPORT_LIMITS.topicLength,
  });

  if (!Array.isArray(value.sources)) {
    errors.push(`${path}.sources: expected an array`);
  } else {
    if (value.sources.length < 1 || value.sources.length > OPPORTUNITY_REPORT_LIMITS.sources) {
      errors.push(`${path}.sources: expected between 1 and ${OPPORTUNITY_REPORT_LIMITS.sources} entries`);
    }
    value.sources.forEach((source, index) => validateSource(
      source,
      `${path}.sources[${index}]`,
      errors,
      allowedUrls,
      windowStartTimestamp,
      windowEndTimestamp,
    ));
    const validSources = value.sources.filter(isOpportunitySource);
    const sourceUrls = validSources.map((source) => source.url);
    if (new Set(sourceUrls).size !== sourceUrls.length) {
      errors.push(`${path}.sources: duplicate source URLs are not allowed`);
    }
    const qualifiedPrimary = validSources.some((source) => source.primary && (source.tier === 1 || source.tier === 2));
    if (!qualifiedPrimary) errors.push(`${path}.sources: requires a primary tier 1 or tier 2 source`);

    if (value.confidence === 'high') {
      const directlyVerifiablePrimary = validSources.some(
        (source) => isTrustedDirectlyVerifiablePrimary(source, directlyVerifiableUrls),
      );
      if (!directlyVerifiablePrimary && !hasIndependentCorroboration(validSources)) {
        errors.push(`${path}.sources: high confidence requires independent corroboration`);
      }
    }
  }

  if (isRecord(value.scores) && typeof value.scores.evidenceQuality === 'number' && Number.isInteger(value.scores.evidenceQuality)) {
    const confidenceBands: Record<Confidence, [number, number]> = {
      developing: [60, 69],
      medium: [70, 84],
      high: [85, 100],
    };
    if (value.confidence === 'developing' || value.confidence === 'medium' || value.confidence === 'high') {
      const [minimum, maximum] = confidenceBands[value.confidence];
      if (value.scores.evidenceQuality < minimum || value.scores.evidenceQuality > maximum) {
        errors.push(`${path}.confidence: requires evidence quality from ${minimum} to ${maximum}`);
      }
    }
  }

  return true;
}

function isOpportunitySource(value: unknown): value is OpportunitySource {
  return isRecord(value)
    && typeof value.url === 'string'
    && typeof value.title === 'string'
    && typeof value.domain === 'string'
    && typeof value.publishedAt === 'string'
    && (value.tier === 1 || value.tier === 2 || value.tier === 3)
    && typeof value.primary === 'boolean';
}

export function validateOpportunityReport(
  value: unknown,
  allowedUrls?: ReadonlySet<string>,
  directlyVerifiableUrls?: ReadonlySet<string>,
): OpportunityReportValidationResult {
  const errors: string[] = [];
  if (!isRecord(value)) return { ok: false, errors: ['report: expected an object'] };

  const isWeekly = value.reportType === 'weekly';
  addUnknownFieldErrors(value, isWeekly ? weeklyFields : reportFields, '', errors);
  if (value.schemaVersion !== 1) errors.push('schemaVersion: expected 1');
  if (value.reportType !== 'daily' && value.reportType !== 'weekly') errors.push('reportType: expected daily or weekly');
  ['generatedAt', 'windowStart', 'windowEnd'].forEach((field) => {
    if (!isIsoDateTime(value[field])) errors.push(`${field}: expected an ISO date-time`);
  });
  requireString(value.model, 'model', errors, OPPORTUNITY_REPORT_LIMITS.modelLength);
  if (value.runStatus !== 'fresh' && value.runStatus !== 'stale') errors.push('runStatus: expected fresh or stale');

  if (isWeekly) {
    if (value.thesis !== undefined) {
      requireString(value.thesis, 'thesis', errors, OPPORTUNITY_REPORT_LIMITS.thesisLength);
    }
    if (value.watchNext !== undefined) {
      validateStringArray(value.watchNext, 'watchNext', errors, {
        minimum: 1,
        maximum: OPPORTUNITY_REPORT_LIMITS.watchNext,
        itemLength: OPPORTUNITY_REPORT_LIMITS.watchNextLength,
      });
    }
  }

  const windowStartTimestamp = isIsoDateTime(value.windowStart)
    ? Date.parse(value.windowStart)
    : undefined;
  const windowEndTimestamp = isIsoDateTime(value.windowEnd)
    ? Date.parse(value.windowEnd)
    : undefined;
  if (windowStartTimestamp !== undefined
    && windowEndTimestamp !== undefined
    && windowStartTimestamp > windowEndTimestamp) {
    errors.push('windowStart: must not be after windowEnd');
  }

  if (!Array.isArray(value.items)) {
    errors.push('items: expected an array');
  } else {
    if (value.items.length < 1 || value.items.length > 5) errors.push('items: expected between 1 and 5 insights');
    value.items.forEach((item, index) => validateInsight(
      item,
      `items[${index}]`,
      errors,
      allowedUrls,
      directlyVerifiableUrls,
      windowStartTimestamp,
      windowEndTimestamp,
    ));
    const ids = value.items
      .filter(isRecord)
      .map((item) => item.id)
      .filter((id): id is string => typeof id === 'string');
    if (new Set(ids).size !== ids.length) errors.push('items: duplicate insight IDs are not allowed');
  }

  return errors.length === 0
    ? { ok: true, value: value as unknown as OpportunityReport }
    : { ok: false, errors };
}

export function validateOpportunityReportFile(value: unknown): OpportunityReportFileValidationResult {
  if (isRecord(value) && (value.runStatus === 'awaiting-first-run' || value.generatedAt === null)) {
    const errors: string[] = [];
    const bootstrapFields = ['schemaVersion', 'reportType', 'items', 'generatedAt', 'runStatus'] as const;
    addUnknownFieldErrors(value, bootstrapFields, '', errors);
    if (value.schemaVersion !== 1) errors.push('schemaVersion: expected 1');
    if (value.reportType !== 'daily' && value.reportType !== 'weekly') {
      errors.push('reportType: expected daily or weekly');
    }
    if (!Array.isArray(value.items) || value.items.length !== 0) errors.push('items: expected an empty array');
    if (value.generatedAt !== null) errors.push('generatedAt: expected null');
    if (value.runStatus !== 'awaiting-first-run') errors.push('runStatus: expected awaiting-first-run');
    return errors.length === 0
      ? { ok: true, value: value as unknown as BootstrapOpportunityReport }
      : { ok: false, errors };
  }

  const generated = validateOpportunityReport(value);
  return generated.ok
    ? { ok: true, value: generated.value }
    : generated;
}
