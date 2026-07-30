import type { OpportunitySource, SourceTier } from '../../src/features/opportunity-intelligence/types';

export type EvidenceSource = OpportunitySource;

export interface SearchResult {
  title?: string;
  url?: string;
  published_date?: string;
  content?: string;
  score?: number;
  days?: number;
}

export interface EvidenceBundle {
  publishable: EvidenceSource[];
  discoveryOnly: EvidenceSource[];
}

const tierTwoDomains = [
  'reuters.com', 'apnews.com', 'bloomberg.com', 'ft.com', 'wsj.com', 'cnbc.com', 'bbc.com',
  'nytimes.com', 'theinformation.com', 'techcrunch.com', 'wired.com', 'theverge.com',
  'technologyreview.com', 'venturebeat.com', 'spectrum.ieee.org', 'nature.com', 'science.org',
  'arxiv.org', 'ssrn.com',
] as const;

const trackingParameterNames = new Set([
  'fbclid', 'gclid', 'dclid', 'msclkid', 'mc_cid', 'mc_eid', '_hsenc', '_hsmi', 'ref', 'trk', 'mkt_tok',
]);

const nonPrimaryClassification = { tier: 3, primary: false, directlyVerifiable: false } as const;
const tierTwoClassification = { tier: 2, primary: false, directlyVerifiable: false } as const;
const tierOnePrimaryClassification = { tier: 1, primary: true, directlyVerifiable: false } as const;
const directTierOnePrimaryClassification = { tier: 1, primary: true, directlyVerifiable: true } as const;
const directTierTwoPrimaryClassification = { tier: 2, primary: true, directlyVerifiable: true } as const;

export interface EvidenceSourceClassification {
  tier: SourceTier;
  primary: boolean;
  directlyVerifiable: boolean;
}

function isDomainOrSubdomain(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, '');
}

function normalizeTitle(title: string): string {
  return title.trim().replace(/\s+/g, ' ');
}

function hasPathPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => pathname.startsWith(prefix));
}

function hasSegments(pathname: string, minimum: number): boolean {
  return pathname.split('/').filter(Boolean).length >= minimum;
}

function isOfficialVendorPublication(hostname: string, pathname: string): boolean {
  if (hostname === 'openai.com') return hasPathPrefix(pathname, ['/index/', '/news/', '/blog/', '/research/', '/api/', '/docs/']);
  if (hostname === 'platform.openai.com') return hasPathPrefix(pathname, ['/docs/', '/resources/', '/changelog']);
  if (hostname === 'anthropic.com') return hasPathPrefix(pathname, ['/news/', '/research/', '/engineering/', '/api/', '/docs/']);
  if (hostname === 'docs.anthropic.com') return true;
  if (hostname === 'ai.google.dev') return true;
  if (hostname === 'blog.google') return hasPathPrefix(pathname, ['/technology/ai/', '/products-and-platforms/']);
  if (hostname === 'deepmind.google') return hasPathPrefix(pathname, ['/discover/blog/', '/research/']);
  if (hostname === 'learn.microsoft.com') return true;
  if (hostname === 'news.microsoft.com') return hasPathPrefix(pathname, ['/source/', '/']);
  if (hostname === 'azure.microsoft.com') return hasPathPrefix(pathname, ['/en-us/updates/', '/en-us/blog/']);
  if (hostname === 'docs.aws.amazon.com') return true;
  if (hostname === 'aws.amazon.com') return hasPathPrefix(pathname, ['/about-aws/whats-new/', '/blogs/', '/solutions/case-studies/']);
  if (hostname === 'ai.meta.com') return hasPathPrefix(pathname, ['/blog/', '/research/']);
  if (hostname === 'developer.nvidia.com') return true;
  if (hostname === 'nvidia.com') return hasPathPrefix(pathname, ['/en-us/about-nvidia/', '/en-us/geforce/news/']);
  if (hostname === 'investor.nvidia.com') return hasPathPrefix(pathname, ['/financial-info/', '/news-events/']);
  if (hostname === 'mistral.ai') return hasPathPrefix(pathname, ['/news/', '/blog/', '/technology/', '/documentation/']);
  if (hostname === 'docs.cohere.com') return true;
  if (hostname === 'cohere.com') return hasPathPrefix(pathname, ['/blog/', '/press/']);
  return false;
}

function isDirectVendorEvidence(hostname: string, pathname: string): boolean {
  if (hostname === 'openai.com') return hasPathPrefix(pathname, ['/api/', '/docs/', '/research/']);
  if (hostname === 'platform.openai.com') {
    return hasPathPrefix(pathname, ['/docs/', '/resources/', '/changelog']);
  }
  if (hostname === 'anthropic.com') return hasPathPrefix(pathname, ['/research/', '/api/', '/docs/']);
  if (hostname === 'docs.anthropic.com' || hostname === 'ai.google.dev') return true;
  if (hostname === 'deepmind.google') return hasPathPrefix(pathname, ['/research/']);
  if (hostname === 'learn.microsoft.com') return true;
  if (hostname === 'azure.microsoft.com') return hasPathPrefix(pathname, ['/en-us/updates/']);
  if (hostname === 'docs.aws.amazon.com') return true;
  if (hostname === 'aws.amazon.com') return hasPathPrefix(pathname, ['/about-aws/whats-new/']);
  if (hostname === 'ai.meta.com') return hasPathPrefix(pathname, ['/research/']);
  if (hostname === 'developer.nvidia.com') return true;
  if (hostname === 'investor.nvidia.com') return hasPathPrefix(pathname, ['/financial-info/']);
  if (hostname === 'mistral.ai') return hasPathPrefix(pathname, ['/documentation/']);
  if (hostname === 'docs.cohere.com') return true;
  return false;
}

function isRegulatorOrFiling(hostname: string, pathname: string): boolean {
  if (hostname === 'sec.gov') return hasPathPrefix(pathname, ['/Archives/edgar/', '/ixviewer/', '/newsroom/', '/files/']);
  if (hostname === 'ftc.gov') return hasPathPrefix(pathname, ['/news-events/', '/legal-library/']);
  if (hostname === 'fcc.gov') return hasPathPrefix(pathname, ['/document/', '/news-events/']);
  if (hostname === 'nist.gov') return hasPathPrefix(pathname, ['/publications/', '/itl/', '/ai/']);
  if (hostname === 'bls.gov') return hasPathPrefix(pathname, ['/news.release/', '/data/', '/oes/']);
  if (hostname === 'census.gov') return hasPathPrefix(pathname, ['/data/', '/newsroom/']);
  if (hostname === 'data.gov') return hasPathPrefix(pathname, ['/dataset/']);
  if (hostname === 'oecd.org') return hasPathPrefix(pathname, ['/en/publications/', '/en/data/']);
  if (hostname === 'data.worldbank.org') return hasPathPrefix(pathname, ['/indicator/']);
  if (hostname === 'documents1.worldbank.org') return hasPathPrefix(pathname, ['/curated/']);
  if (hostname === 'worldbank.org') return hasPathPrefix(pathname, ['/en/publication/', '/en/research/']);
  if (hostname === 'ec.europa.eu') return hasPathPrefix(pathname, ['/commission/presscorner/', '/eurostat/', '/info/law/']);
  if (hostname === 'eur-lex.europa.eu') return hasPathPrefix(pathname, ['/legal-content/']);
  if (hostname === 'digital-strategy.ec.europa.eu') return hasPathPrefix(pathname, ['/en/policies/', '/en/library/']);
  if (hostname === 'find-and-update.company-information.service.gov.uk') return /\/company\/[^/]+\/filing-history/.test(pathname);
  return false;
}

function isStandardsPublication(hostname: string, pathname: string): boolean {
  if (hostname === 'ietf.org') return hasPathPrefix(pathname, ['/archive/', '/rfc/']);
  if (hostname === 'w3.org') return hasPathPrefix(pathname, ['/TR/', '/standards/']);
  if (hostname === 'ieee.org') return hasPathPrefix(pathname, ['/standards/', '/publications/']);
  if (hostname === 'iso.org') return hasPathPrefix(pathname, ['/standard/']);
  return false;
}

function isOriginalResearch(hostname: string, pathname: string, searchParams: URLSearchParams): boolean {
  if (hostname === 'arxiv.org') return hasPathPrefix(pathname, ['/abs/', '/pdf/']);
  if (hostname === 'nature.com') return hasPathPrefix(pathname, ['/articles/']);
  if (hostname === 'science.org') return hasPathPrefix(pathname, ['/doi/']);
  if (hostname === 'papers.ssrn.com') {
    return (pathname === '/sol3/papers.cfm' && (searchParams.has('abstract_id') || searchParams.has('abstractid')))
      || hasPathPrefix(pathname, ['/sol3/Delivery.cfm/']);
  }
  return false;
}

function isEmployerCareerListing(hostname: string, pathname: string): boolean {
  if (hostname === 'amazon.jobs') return hasPathPrefix(pathname, ['/en/jobs/', '/content/en/job-categories/']);
  if (hostname === 'careers.google.com') return hasPathPrefix(pathname, ['/jobs/results/']);
  if (hostname === 'jobs.apple.com') return hasPathPrefix(pathname, ['/en-us/details/']);
  if (hostname === 'jobs.netflix.com') return hasPathPrefix(pathname, ['/jobs/']);
  if (hostname === 'careers.microsoft.com') return hasPathPrefix(pathname, ['/v2/global/en/search-results']);
  if (hostname === 'careers.meta.com') return hasPathPrefix(pathname, ['/jobs/']);
  if (hostname === 'boards.greenhouse.io' || hostname === 'job-boards.greenhouse.io') {
    return /^\/[^/]+\/jobs\/[^/]+/.test(pathname);
  }
  if (hostname === 'jobs.lever.co') return hasSegments(pathname, 2);
  if (hostname.endsWith('.myworkdayjobs.com')) return pathname.includes('/job/');
  if (hostname === 'jobs.ashbyhq.com') return hasSegments(pathname, 2);
  return false;
}

export function canonicalizeUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;

    url.hash = '';
    [...url.searchParams.keys()].forEach((name) => {
      const normalizedName = name.toLowerCase();
      if (normalizedName.startsWith('utm_') || trackingParameterNames.has(normalizedName)) {
        url.searchParams.delete(name);
      }
    });
    return url.toString();
  } catch {
    return null;
  }
}

export function classifyEvidenceSource(value: string): EvidenceSourceClassification {
  const canonicalUrl = canonicalizeUrl(value);
  if (!canonicalUrl) return nonPrimaryClassification;

  const parsed = new URL(canonicalUrl);
  const hostname = normalizeHostname(parsed.hostname);
  const pathname = parsed.pathname;
  if (isRegulatorOrFiling(hostname, pathname)
    || isStandardsPublication(hostname, pathname)
    || isEmployerCareerListing(hostname, pathname)) return directTierOnePrimaryClassification;
  if (isOriginalResearch(hostname, pathname, parsed.searchParams)) return directTierTwoPrimaryClassification;
  if (isOfficialVendorPublication(hostname, pathname)) {
    return isDirectVendorEvidence(hostname, pathname)
      ? directTierOnePrimaryClassification
      : tierOnePrimaryClassification;
  }
  if (tierTwoDomains.some((domain) => isDomainOrSubdomain(hostname, domain))) {
    return tierTwoClassification;
  }
  return nonPrimaryClassification;
}

export function classifySource(value: string): SourceTier {
  return classifyEvidenceSource(value).tier;
}

export function normalizeSearchResults(results: readonly SearchResult[], now: Date): EvidenceSource[] {
  const nowTimestamp = now.getTime();
  if (!Number.isFinite(nowTimestamp)) return [];

  return results.flatMap((result) => {
    const url = typeof result.url === 'string' ? canonicalizeUrl(result.url) : null;
    const title = typeof result.title === 'string' ? normalizeTitle(result.title) : '';
    const timestamp = typeof result.published_date === 'string' ? Date.parse(result.published_date) : Number.NaN;
    const days = result.days;

    if (!url || !title || !Number.isFinite(timestamp) || typeof days !== 'number'
      || !Number.isFinite(days) || days < 0) {
      return [];
    }
    const oldestTimestamp = nowTimestamp - days * 24 * 60 * 60 * 1000;
    if (timestamp < oldestTimestamp || timestamp > nowTimestamp) return [];

    const hostname = normalizeHostname(new URL(url).hostname);
    const classification = classifyEvidenceSource(url);
    return [{
      url,
      title,
      domain: hostname,
      publishedAt: new Date(timestamp).toISOString(),
      tier: classification.tier,
      primary: classification.primary,
    }];
  });
}

export function deduplicateEvidence(results: readonly EvidenceSource[]): EvidenceSource[] {
  const canonicalUrls = new Set<string>();
  const urlSurvivors = results.flatMap((result) => {
    const canonicalUrl = canonicalizeUrl(result.url);
    if (!canonicalUrl || canonicalUrls.has(canonicalUrl)) return [];
    canonicalUrls.add(canonicalUrl);
    return [{ ...result, url: canonicalUrl }];
  });

  const titles = new Set<string>();
  return urlSurvivors.filter((result) => {
    const normalizedTitle = normalizeTitle(result.title).toLowerCase();
    if (titles.has(normalizedTitle)) return false;
    titles.add(normalizedTitle);
    return true;
  });
}

export function buildEvidenceBundle(results: readonly EvidenceSource[]): EvidenceBundle {
  const deduplicated = deduplicateEvidence(results);
  return {
    publishable: deduplicated.filter((source) => source.tier <= 2),
    discoveryOnly: deduplicated.filter((source) => source.tier === 3),
  };
}
