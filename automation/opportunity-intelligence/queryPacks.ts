export type QueryKind = 'daily' | 'weekly';
export type QueryRadar = 'build' | 'career';

export interface SearchQuery {
  topic: string;
  radar: QueryRadar;
  query: string;
  days: number;
  maxResults: number;
}

export interface CollectionLimits {
  maxQueries: number;
  maxResultsPerQuery: number;
}

type RuntimeEnvironment = Record<string, string | undefined>;

const queryDefaults: Record<QueryKind, number> = {
  daily: 5,
  weekly: 8,
};
const maximumResultsPerQuery = 10;

function boundedInteger(
  value: string | undefined,
  name: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  if (value === undefined || value.trim() === '') return fallback;
  if (!/^-?\d+$/.test(value.trim())) {
    throw new Error(`${name} must be an integer`);
  }
  return Math.min(maximum, Math.max(minimum, Number.parseInt(value, 10)));
}

export function resolveCollectionLimits(
  kind: QueryKind,
  env: RuntimeEnvironment = process.env,
): CollectionLimits {
  return {
    maxQueries: boundedInteger(
      env.OPPORTUNITY_MAX_QUERIES,
      'OPPORTUNITY_MAX_QUERIES',
      queryDefaults[kind],
      2,
      queryDefaults[kind],
    ),
    maxResultsPerQuery: boundedInteger(
      env.TAVILY_MAX_RESULTS_PER_QUERY,
      'TAVILY_MAX_RESULTS_PER_QUERY',
      maximumResultsPerQuery,
      1,
      maximumResultsPerQuery,
    ),
  };
}

const dailyQueries: readonly SearchQuery[] = [
  {
    topic: 'product',
    radar: 'build',
    query: '(site:openai.com OR site:anthropic.com OR site:ai.google.dev) (API OR product) (announcement OR release OR documentation)',
    days: 2,
    maxResults: 10,
  },
  {
    topic: 'enterprise',
    radar: 'build',
    query: '(site:openai.com OR site:news.microsoft.com OR site:aws.amazon.com) enterprise AI adoption (customer announcement OR procurement OR case study)',
    days: 2,
    maxResults: 10,
  },
  {
    topic: 'capital',
    radar: 'build',
    query: 'AI (funding OR acquisition) (site:sec.gov OR site:find-and-update.company-information.service.gov.uk OR site:news.microsoft.com OR site:investor.nvidia.com)',
    days: 3,
    maxResults: 10,
  },
  {
    topic: 'roles',
    radar: 'career',
    query: '("AI engineer" OR "machine learning engineer") remote (worldwide OR global) (site:boards.greenhouse.io OR site:jobs.lever.co OR site:careers.google.com)',
    days: 2,
    maxResults: 10,
  },
  {
    topic: 'skills',
    radar: 'career',
    query: 'AI labor market skills demand (site:bls.gov OR site:oecd.org OR dataset OR report)',
    days: 7,
    maxResults: 10,
  },
];

const weeklyQueries: readonly SearchQuery[] = [
  ...dailyQueries.map((query) => ({ ...query, days: Math.max(query.days, 7), maxResults: 10 })),
  {
    topic: 'regulation',
    radar: 'build',
    query: 'AI regulation (site:ftc.gov OR site:sec.gov OR site:europa.eu) guidance enforcement policy',
    days: 14,
    maxResults: 10,
  },
  {
    topic: 'infrastructure',
    radar: 'build',
    query: 'AI compute infrastructure data center chips capacity (site:nvidia.com OR "investor relations" OR announcement)',
    days: 14,
    maxResults: 10,
  },
  {
    topic: 'demand',
    radar: 'career',
    query: 'AI hiring demand recurring skills (site:boards.greenhouse.io OR site:jobs.lever.co OR report)',
    days: 14,
    maxResults: 10,
  },
];

export function getQueryPack(
  kind: QueryKind,
  limits: CollectionLimits = {
    maxQueries: queryDefaults[kind],
    maxResultsPerQuery: maximumResultsPerQuery,
  },
): SearchQuery[] {
  const queries = kind === 'daily' ? dailyQueries : weeklyQueries;
  const maximumQueries = Math.min(queryDefaults[kind], Math.max(2, limits.maxQueries));
  const selectedQueries = maximumQueries >= queries.length
    ? [...queries]
    : selectBalancedQueries(queries, maximumQueries);

  return selectedQueries
    .map((query) => ({
      ...query,
      maxResults: Math.min(maximumResultsPerQuery, Math.max(1, limits.maxResultsPerQuery)),
    }));
}

function selectBalancedQueries(
  queries: readonly SearchQuery[],
  maximumQueries: number,
): SearchQuery[] {
  const byRadar: Record<QueryRadar, SearchQuery[]> = {
    build: queries.filter((query) => query.radar === 'build'),
    career: queries.filter((query) => query.radar === 'career'),
  };
  const selected = new Set<SearchQuery>();

  for (let index = 0; selected.size < maximumQueries; index += 1) {
    for (const radar of ['build', 'career'] as const) {
      const query = byRadar[radar][index];
      if (query) selected.add(query);
      if (selected.size === maximumQueries) break;
    }
  }

  return queries.filter((query) => selected.has(query));
}
