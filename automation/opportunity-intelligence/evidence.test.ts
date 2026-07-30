import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import {
  buildEvidenceBundle,
  canonicalizeUrl,
  classifyEvidenceSource,
  classifySource,
  deduplicateEvidence,
  normalizeSearchResults,
  type SearchResult,
} from './evidence';
import { getQueryPack, resolveCollectionLimits } from './queryPacks';
import { searchTavily } from './tavily';

const fixturePath = new URL('./fixtures/tavily-results.json', import.meta.url);
const fixtureResults = JSON.parse(readFileSync(fixturePath, 'utf8')) as SearchResult[];
const newsFixturePath = new URL('./fixtures/tavily-news-response.json', import.meta.url);
const newsFixture = JSON.parse(readFileSync(newsFixturePath, 'utf8')) as { results: SearchResult[] };
const now = new Date('2026-07-30T00:00:00.000Z');

describe('evidence discovery quality gates', () => {
  it('keeps query packs within bounded result budgets', () => {
    const daily = getQueryPack('daily');
    const weekly = getQueryPack('weekly');

    expect(daily.reduce((total, query) => total + query.maxResults, 0)).toBeLessThanOrEqual(50);
    expect(weekly.reduce((total, query) => total + query.maxResults, 0)).toBeLessThanOrEqual(100);
    expect(new Set(daily.map((query) => query.topic))).toEqual(new Set([
      'product', 'enterprise', 'capital', 'roles', 'skills',
    ]));
    expect(weekly.map((query) => query.topic)).toEqual(expect.arrayContaining([
      'regulation', 'infrastructure', 'demand',
    ]));
    expect(daily.find((query) => query.topic === 'capital')?.query).toContain('site:sec.gov');
    expect(daily.find((query) => query.topic === 'roles')?.query).toContain('site:boards.greenhouse.io');
    expect(daily.find((query) => query.topic === 'roles')?.query).toContain('worldwide');
    expect(daily.find((query) => query.topic === 'roles')?.query).toContain('global');
    expect(daily.find((query) => query.topic === 'capital')?.query).toContain('site:news.microsoft.com');
    expect(daily.find((query) => query.topic === 'capital')?.query).toContain('site:find-and-update.company-information.service.gov.uk');
  });

  it('supports safely clamped per-run query and result limits without code changes', () => {
    expect(resolveCollectionLimits('daily', {
      OPPORTUNITY_MAX_QUERIES: '999',
      TAVILY_MAX_RESULTS_PER_QUERY: '999',
    })).toEqual({ maxQueries: 5, maxResultsPerQuery: 10 });
    expect(resolveCollectionLimits('weekly', {
      OPPORTUNITY_MAX_QUERIES: '3',
      TAVILY_MAX_RESULTS_PER_QUERY: '4',
    })).toEqual({ maxQueries: 3, maxResultsPerQuery: 4 });
    expect(getQueryPack('weekly', { maxQueries: 3, maxResultsPerQuery: 4 })).toHaveLength(3);
    expect(getQueryPack('weekly', { maxQueries: 3, maxResultsPerQuery: 4 })
      .every((query) => query.maxResults === 4)).toBe(true);
    expect(() => resolveCollectionLimits('daily', {
      OPPORTUNITY_MAX_QUERIES: 'not-a-number',
    })).toThrow('OPPORTUNITY_MAX_QUERIES');
  });

  it.each([
    { kind: 'daily' as const, maximum: 5 },
    { kind: 'weekly' as const, maximum: 8 },
  ])('keeps every allowed $kind query cap deterministic and lane-balanced', ({ kind, maximum }) => {
    expect(resolveCollectionLimits(kind, {
      OPPORTUNITY_MAX_QUERIES: '1',
    }).maxQueries).toBe(2);

    for (let cap = 2; cap <= maximum; cap += 1) {
      const first = getQueryPack(kind, { maxQueries: cap, maxResultsPerQuery: 10 });
      const second = getQueryPack(kind, { maxQueries: cap, maxResultsPerQuery: 10 });
      const lanes = new Set(first.map((query) => query.radar));
      const buildCount = first.filter((query) => query.radar === 'build').length;
      const careerCount = first.filter((query) => query.radar === 'career').length;

      expect(first).toEqual(second);
      expect(first).toHaveLength(cap);
      expect(lanes).toEqual(new Set(['build', 'career']));
      if (cap < maximum) {
        expect(Math.abs(buildCount - careerCount)).toBeLessThanOrEqual(1);
      }
      expect(Math.ceil(first.length / 2)).toBeLessThanOrEqual(first.length);
    }
  });

  it('preserves the full default query order when no cap is configured', () => {
    expect(getQueryPack('daily').map((query) => query.topic)).toEqual([
      'product', 'enterprise', 'capital', 'roles', 'skills',
    ]);
    expect(getQueryPack('weekly').map((query) => query.topic)).toEqual([
      'product', 'enterprise', 'capital', 'roles', 'skills',
      'regulation', 'infrastructure', 'demand',
    ]);
  });

  it('classifies explicit direct sources without conflating tier, primary, and verification', () => {
    expect(classifySource('https://openai.com/index/example')).toBe(1);
    expect(classifySource('https://reuters.com/technology/example')).toBe(2);
    expect(classifySource('https://unknown.example.com/official-release')).toBe(3);
    expect(classifyEvidenceSource('https://platform.openai.com/docs/guides/example')).toEqual({
      tier: 1, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://investor.nvidia.com/financial-info/quarterly-results/default.aspx')).toEqual({
      tier: 1, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://aws.amazon.com/solutions/case-studies/acme-ai/')).toEqual({
      tier: 1, primary: true, directlyVerifiable: false,
    });
    expect(classifyEvidenceSource('https://openai.com/index/example')).toEqual({
      tier: 1, primary: true, directlyVerifiable: false,
    });
    expect(classifyEvidenceSource('https://news.microsoft.com/source/features/ai/example')).toEqual({
      tier: 1, primary: true, directlyVerifiable: false,
    });
    expect(classifyEvidenceSource('https://platform.openai.com/docs/changelog/example')).toEqual({
      tier: 1, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://aws.amazon.com/marketplace/pp/prodview-example')).toEqual({
      tier: 3, primary: false, directlyVerifiable: false,
    });
    expect(classifyEvidenceSource('https://www.sec.gov/Archives/edgar/data/123/filing.htm')).toEqual({
      tier: 1, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://www.ftc.gov/news-events/news/press-releases/example')).toEqual({
      tier: 1, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://arxiv.org/abs/2607.00001')).toEqual({
      tier: 2, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://www.nature.com/articles/example')).toEqual({
      tier: 2, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://www.science.org/doi/10.1126/example')).toEqual({
      tier: 2, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1234567')).toEqual({
      tier: 2, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://papers.ssrn.com/sol3/Delivery.cfm/1234567.pdf?abstractid=1234567')).toEqual({
      tier: 2, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://www.oecd.org/en/publications/ai-outlook.html')).toEqual({
      tier: 1, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://data.worldbank.org/indicator/IT.NET.USER.ZS')).toEqual({
      tier: 1, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689')).toEqual({
      tier: 1, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://find-and-update.company-information.service.gov.uk/company/12345678/filing-history')).toEqual({
      tier: 1, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://boards.greenhouse.io/openai/jobs/123456')).toEqual({
      tier: 1, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://jobs.lever.co/example/123456')).toEqual({
      tier: 1, primary: true, directlyVerifiable: true,
    });
    expect(classifyEvidenceSource('https://reuters.com/technology/example')).toEqual({
      tier: 2, primary: false, directlyVerifiable: false,
    });
    expect(classifyEvidenceSource('https://www.google.com/search?q=ai')).toEqual({
      tier: 3, primary: false, directlyVerifiable: false,
    });
    expect(classifyEvidenceSource('https://www.amazon.com/dp/example')).toEqual({
      tier: 3, primary: false, directlyVerifiable: false,
    });
    expect(classifyEvidenceSource('https://huggingface.co/models/example')).toEqual({
      tier: 3, primary: false, directlyVerifiable: false,
    });
    expect(classifyEvidenceSource('https://unlisted-company.example/press/acquisition-announcement')).toEqual({
      tier: 3, primary: false, directlyVerifiable: false,
    });
  });

  it('strips tracking parameters and fragments from canonical URLs', () => {
    expect(canonicalizeUrl('https://example.com/a?utm_source=x#top')).toBe('https://example.com/a');
    expect(canonicalizeUrl('https://example.com/a?ref=newsletter&trk=campaign&mkt_tok=value')).toBe('https://example.com/a');
  });

  it('normalizes valid current evidence and rejects invalid or stale records', () => {
    const normalized = normalizeSearchResults(fixtureResults, now);

    expect(normalized).toHaveLength(6);
    expect(normalized.every((source) => source.publishedAt.endsWith('Z'))).toBe(true);
    expect(normalizeSearchResults([
      { url: 'http://example.com', title: 'HTTP source', published_date: '2026-07-29T00:00:00.000Z', days: 2 },
      { url: 'https://example.com/no-title', published_date: '2026-07-29T00:00:00.000Z', days: 2 },
      { url: 'https://example.com/no-date', title: 'Missing date', days: 2 },
    ], now)).toEqual([]);
  });

  it('preserves Tavily lookback context for weekly evidence', () => {
    const weeklyResult = {
      url: 'https://openai.com/index/weekly-release',
      title: 'Weekly release',
      published_date: '2026-07-24T12:00:00.000Z',
      days: 7,
    };

    expect(normalizeSearchResults([weeklyResult], now)).toHaveLength(1);
    expect(normalizeSearchResults([{ ...weeklyResult, days: 1 }], now)).toEqual([]);
  });

  it('deduplicates first by canonical URL and then normalized title', () => {
    const normalized = normalizeSearchResults(fixtureResults, now);
    const deduplicated = deduplicateEvidence(normalized);

    expect(deduplicated).toHaveLength(5);
    expect(deduplicated.filter((source) => source.title === 'OpenAI announces an example API capability')).toHaveLength(1);
  });

  it('finishes URL deduplication before title deduplication', () => {
    const sources = [
      { url: 'https://openai.com/index/a', title: 'Shared title', domain: 'openai.com', publishedAt: '2026-07-29T00:00:00.000Z', tier: 1 as const, primary: true },
      { url: 'https://www.reuters.com/technology/b', title: 'Shared title', domain: 'reuters.com', publishedAt: '2026-07-29T00:00:00.000Z', tier: 2 as const, primary: false },
      { url: 'https://www.reuters.com/technology/b', title: 'Distinct later title', domain: 'reuters.com', publishedAt: '2026-07-29T00:00:00.000Z', tier: 2 as const, primary: false },
    ];

    expect(deduplicateEvidence(sources).map((source) => source.url)).toEqual([
      'https://openai.com/index/a',
    ]);
  });

  it('folds titles with deterministic ASCII case normalization', () => {
    const sources = [
      { url: 'https://openai.com/index/case', title: 'CASE SIGNAL', domain: 'openai.com', publishedAt: '2026-07-29T00:00:00.000Z', tier: 1 as const, primary: true },
      { url: 'https://www.reuters.com/technology/case', title: 'case signal', domain: 'reuters.com', publishedAt: '2026-07-29T00:00:00.000Z', tier: 2 as const, primary: false },
    ];

    expect(deduplicateEvidence(sources)).toHaveLength(1);
  });

  it('keeps tier-three sources discovery-only', () => {
    const bundle = buildEvidenceBundle(deduplicateEvidence(normalizeSearchResults(fixtureResults, now)));

    expect(bundle.publishable.every(source => source.tier <= 2)).toBe(true);
    expect(bundle.discoveryOnly).toHaveLength(1);
    expect(bundle.discoveryOnly[0].tier).toBe(3);
  });

  it('uses the current Tavily news contract without putting the secret in the body', async () => {
    const originalFetch = globalThis.fetch;
    const runtime = globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } };
    const originalKey = runtime.process?.env?.TAVILY_API_KEY;
    const requests: Request[] = [];
    if (runtime.process?.env) runtime.process.env.TAVILY_API_KEY = 'test-key';
    globalThis.fetch = async (input, init) => {
      requests.push(new Request(input, init));
      return new Response(JSON.stringify(newsFixture), { status: 200 });
    };

    try {
      const results = await searchTavily('official AI release', {
        days: 7,
        maxResults: 3,
        startDate: '2026-07-23',
        endDate: '2026-07-31',
      });

      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        published_date: '2026-07-29T09:00:00.000Z',
        days: 7,
      });
      expect(requests).toHaveLength(1);
      expect(requests[0].url).toBe('https://api.tavily.com/search');
      expect(requests[0].headers.get('content-type')).toBe('application/json');
      expect(requests[0].headers.get('authorization')).toBe('Bearer test-key');
      const requestBody = await requests[0].text();
      expect(JSON.parse(requestBody)).toEqual({
        query: 'official AI release',
        topic: 'news',
        start_date: '2026-07-23',
        end_date: '2026-07-31',
        max_results: 3,
        search_depth: 'advanced',
        include_answer: false,
        include_raw_content: false,
      });
      expect(requestBody).not.toContain('test-key');
      expect(requestBody).not.toContain('api_key');
      expect(requestBody).not.toContain('"days"');
    } finally {
      globalThis.fetch = originalFetch;
      if (runtime.process?.env) runtime.process.env.TAVILY_API_KEY = originalKey;
    }
  });

  it('propagates the requested Tavily lookback to every returned result', async () => {
    const originalFetch = globalThis.fetch;
    const runtime = globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } };
    const originalKey = runtime.process?.env?.TAVILY_API_KEY;
    if (runtime.process?.env) runtime.process.env.TAVILY_API_KEY = 'test-key';
    globalThis.fetch = async () => new Response(JSON.stringify({ results: fixtureResults.slice(0, 1) }), { status: 200 });

    try {
      await expect(searchTavily('weekly signal', {
        days: 7,
        maxResults: 1,
        startDate: '2026-07-23',
        endDate: '2026-07-30',
      })).resolves.toEqual([
        expect.objectContaining({ days: 7 }),
      ]);
    } finally {
      globalThis.fetch = originalFetch;
      if (runtime.process?.env) runtime.process.env.TAVILY_API_KEY = originalKey;
    }
  });

  it('aborts a Tavily request at its timeout without using the network', async () => {
    vi.useFakeTimers();
    const originalFetch = globalThis.fetch;
    const runtime = globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } };
    const originalKey = runtime.process?.env?.TAVILY_API_KEY;
    if (runtime.process?.env) runtime.process.env.TAVILY_API_KEY = 'test-key';
    globalThis.fetch = (_input, init) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('Timed out', 'AbortError')));
    });

    try {
      const request = expect(searchTavily('timeout', {
        days: 1,
        maxResults: 1,
        startDate: '2026-07-29',
        endDate: '2026-07-30',
      })).rejects.toThrow('Timed out');
      await vi.advanceTimersByTimeAsync(20_000);
      await request;
    } finally {
      globalThis.fetch = originalFetch;
      if (runtime.process?.env) runtime.process.env.TAVILY_API_KEY = originalKey;
      vi.useRealTimers();
    }
  });

  it('redacts API secrets from non-success Tavily responses', async () => {
    const originalFetch = globalThis.fetch;
    const runtime = globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } };
    const originalKey = runtime.process?.env?.TAVILY_API_KEY;
    if (runtime.process?.env) runtime.process.env.TAVILY_API_KEY = 'test-key';
    globalThis.fetch = async () => new Response(
      '{"api_key":"test-key","authorization":"Bearer test-key","error":"denied"}',
      { status: 429 },
    );

    try {
      const options = {
        days: 1,
        maxResults: 1,
        startDate: '2026-07-29',
        endDate: '2026-07-30',
      };
      await expect(searchTavily('failure', options)).rejects.toThrow('status 429');
      await searchTavily('failure', options).catch((error: unknown) => {
        expect(String(error)).not.toContain('test-key');
        expect(String(error)).not.toContain('Bearer test-key');
        expect(String(error)).toContain('[REDACTED]');
      });
    } finally {
      globalThis.fetch = originalFetch;
      if (runtime.process?.env) runtime.process.env.TAVILY_API_KEY = originalKey;
    }
  });
});
