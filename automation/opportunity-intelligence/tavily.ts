export interface TavilyResult {
  title?: string;
  url?: string;
  published_date: string;
  content?: string;
  score?: number;
  days: number;
}

export interface TavilySearchOptions {
  days: number;
  maxResults: number;
  startDate: string;
  endDate: string;
  signal?: AbortSignal;
}

type RuntimeProcess = { process?: { env?: Record<string, string | undefined> } };

const timeoutMilliseconds = 20_000;

function runtimeApiKey(): string {
  const key = (globalThis as typeof globalThis & RuntimeProcess).process?.env?.TAVILY_API_KEY;
  if (!key) throw new Error('TAVILY_API_KEY is required at runtime');
  return key;
}

function redactSummary(value: string, apiKey: string): string {
  return value
    .split(apiKey).join('[REDACTED]')
    .replace(/("?(?:api[_-]?key|authorization)"?\s*[:=]\s*"?)([^",\s}]+)/gi, '$1[REDACTED]')
    .replace(/bearer\s+[^\s",}]+/gi, 'Bearer [REDACTED]')
    .replace(/\s+/g, ' ')
    .slice(0, 500);
}

export async function searchTavily(query: string, options: TavilySearchOptions): Promise<TavilyResult[]> {
  const apiKey = runtimeApiKey();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(options.startDate)
    || !/^\d{4}-\d{2}-\d{2}$/.test(options.endDate)
    || options.startDate > options.endDate) {
    throw new Error('Tavily startDate and endDate must be an ordered YYYY-MM-DD range');
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMilliseconds);
  const abort = () => controller.abort();
  options.signal?.addEventListener('abort', abort, { once: true });

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        topic: 'news',
        start_date: options.startDate,
        end_date: options.endDate,
        max_results: options.maxResults,
        search_depth: 'advanced',
        include_answer: false,
        include_raw_content: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const summary = redactSummary(await response.text(), apiKey);
      throw new Error(`Tavily search failed with status ${response.status}: ${summary || '[no response body]'}`);
    }

    const payload = await response.json() as { results?: unknown };
    return Array.isArray(payload.results)
      ? payload.results.flatMap((result) => {
        if (typeof result !== 'object' || result === null || Array.isArray(result)) return [];
        const record = result as Record<string, unknown>;
        if (typeof record.published_date !== 'string' || record.published_date.trim() === '') return [];
        return [{
          ...(record as Omit<TavilyResult, 'days'>),
          published_date: record.published_date,
          days: options.days,
        }];
      })
      : [];
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abort);
  }
}
