import { useCallback, useEffect, useMemo, useState } from 'react';

type Impact = 'High' | 'Medium' | 'Low';
type Sentiment = 'Positive' | 'Negative' | 'Mixed';
type Category = 'Macro' | 'Stocks' | 'Crypto' | 'Energy' | 'Geopolitics';

interface GdeltArticle {
  url: string;
  url_mobile?: string;
  title: string;
  seendate: string;
  socialimage?: string;
  domain: string;
  sourcecountry?: string;
}

interface GdeltResponse {
  articles?: GdeltArticle[];
}

interface MarketStory extends GdeltArticle {
  impact: Impact;
  sentiment: Sentiment;
  category: Category;
  tickers: string[];
  score: number;
}

interface CacheEntry {
  savedAt: number;
  stories: MarketStory[];
}

const CACHE_KEY = 'acid-reflux-market-pulse-v1';
const CACHE_TTL = 10 * 60 * 1000;
const REFRESH_INTERVAL = 15 * 60 * 1000;
const QUERY = [
  'inflation',
  '"interest rates"',
  '"central bank"',
  'tariffs',
  'recession',
  '"stock market"',
  'earnings',
  'oil',
  'sanctions',
  'bitcoin'
].join(' OR ');

const API_URL =
  `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(`(${QUERY}) sourcelang:english`)}` +
  '&mode=artlist&maxrecords=50&format=jsonp&sort=datedesc&timespan=24h';

let activeGdeltRequest: Promise<GdeltResponse> | null = null;

const categoryRules: Array<[Category, RegExp]> = [
  ['Crypto', /\b(bitcoin|crypto|ethereum|blockchain|btc|eth)\b/i],
  ['Energy', /\b(oil|gas|opec|energy|crude|lng)\b/i],
  ['Geopolitics', /\b(war|sanction|tariff|conflict|nato|trade deal|embargo)\b/i],
  ['Stocks', /\b(stock|shares|earnings|nasdaq|s&p|dow|ipo|merger)\b/i]
];

const tickerRules: Array<[string, RegExp]> = [
  ['BTC', /\b(bitcoin|btc)\b/i],
  ['ETH', /\b(ethereum|eth)\b/i],
  ['AAPL', /\b(apple|aapl)\b/i],
  ['MSFT', /\b(microsoft|msft)\b/i],
  ['NVDA', /\b(nvidia|nvda)\b/i],
  ['TSLA', /\b(tesla|tsla)\b/i],
  ['AMZN', /\b(amazon|amzn)\b/i],
  ['GOOGL', /\b(google|alphabet|googl)\b/i],
  ['META', /\b(meta|facebook)\b/i],
  ['EUR/USD', /\b(euro|ecb|european central bank)\b/i],
  ['USD/JPY', /\b(yen|bank of japan|boj)\b/i],
  ['OIL', /\b(oil|crude|opec)\b/i]
];

function parseGdeltDate(value: string): Date {
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T?(\d{2})(\d{2})(\d{2})Z?$/);

  if (!match) return new Date(value);

  const [, year, month, day, hour, minute, second] = match;
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
}

function relativeTime(value: string): string {
  const date = parseGdeltDate(value);
  const minutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000));

  if (Number.isNaN(minutes)) return 'Recently';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
}

function enrichStory(article: GdeltArticle): MarketStory {
  const text = article.title.toLowerCase();
  const category = categoryRules.find(([, pattern]) => pattern.test(text))?.[0] ?? 'Macro';
  const tickers = tickerRules
    .filter(([, pattern]) => pattern.test(text))
    .map(([ticker]) => ticker)
    .slice(0, 3);

  const highSignals = text.match(
    /\b(rate (?:hike|cut|decision)|central bank|war|recession|crash|sanction|tariff|default|emergency)\b/g
  )?.length ?? 0;
  const mediumSignals = text.match(/\b(inflation|earnings|jobs|gdp|oil|acquisition|regulation)\b/g)?.length ?? 0;
  const impact: Impact = highSignals > 0 ? 'High' : mediumSignals > 0 ? 'Medium' : 'Low';

  const positiveSignals = text.match(/\b(rally|surge|gain|growth|beat|record high|deal|recovery|cut)\b/g)?.length ?? 0;
  const negativeSignals = text.match(/\b(fall|drop|loss|crash|recession|war|sanction|layoff|miss|inflation)\b/g)?.length ?? 0;
  const sentiment: Sentiment =
    positiveSignals === negativeSignals ? 'Mixed' : positiveSignals > negativeSignals ? 'Positive' : 'Negative';

  const ageHours = Math.max(0, (Date.now() - parseGdeltDate(article.seendate).getTime()) / 3600000);
  const score = highSignals * 5 + mediumSignals * 2 + tickers.length * 1.5 + Math.max(0, 4 - ageHours / 6);

  return { ...article, category, tickers, impact, sentiment, score };
}

function readCache(): CacheEntry | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? (JSON.parse(cached) as CacheEntry) : null;
  } catch {
    return null;
  }
}

function loadGdeltFeed(): Promise<GdeltResponse> {
  if (activeGdeltRequest) return activeGdeltRequest;

  activeGdeltRequest = new Promise((resolve, reject) => {
    const callbackName = `gdeltMarketPulse_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const globalWindow = window as unknown as Record<string, unknown>;

    const cleanup = () => {
      window.clearTimeout(timeout);
      script.remove();
      delete globalWindow[callbackName];
    };

    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('service-error'));
    }, 15000);

    globalWindow[callbackName] = (data: GdeltResponse) => {
      cleanup();
      resolve(data);
    };

    script.src = `${API_URL}&callback=${callbackName}`;
    script.async = true;
    script.onerror = () => {
      cleanup();
      reject(new Error('service-error'));
    };
    document.head.appendChild(script);
  });

  void activeGdeltRequest.then(
    () => { activeGdeltRequest = null; },
    () => { activeGdeltRequest = null; }
  );

  return activeGdeltRequest;
}

export function MarketPulse() {
  const cached = useMemo(readCache, []);
  const [stories, setStories] = useState<MarketStory[]>(cached?.stories ?? []);
  const [isLoading, setIsLoading] = useState(!cached?.stories.length);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<number | null>(cached?.savedAt ?? null);

  const loadStories = useCallback(async (force = false) => {
    const existing = readCache();

    if (!force && existing && Date.now() - existing.savedAt < CACHE_TTL) {
      setStories(existing.stories);
      setLastUpdated(existing.savedAt);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await loadGdeltFeed();
      const unique = Array.from(
        new Map((data.articles ?? []).map((article) => [article.title.trim().toLowerCase(), article])).values()
      );
      const nextStories = unique
        .map(enrichStory)
        .sort((a, b) => b.score - a.score)
        .slice(0, 7);

      if (!nextStories.length) throw new Error('No market stories were returned');

      const savedAt = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt, stories: nextStories }));
      setStories(nextStories);
      setLastUpdated(savedAt);
    } catch {
      setError(
        stories.length
          ? 'The public news feed is busy. Showing cached stories until the next refresh.'
          : 'The public news feed is busy. Please wait a moment and refresh.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [stories.length]);

  useEffect(() => {
    void loadStories();
    const interval = window.setInterval(() => void loadStories(true), REFRESH_INTERVAL);
    return () => window.clearInterval(interval);
  }, [loadStories]);

  const featured = stories[0];
  const secondary = stories.slice(1);

  return (
    <section className="market-pulse" aria-labelledby="market-pulse-title">
      <div className="market-pulse-header">
        <div>
          <span className="section-kicker">Global intelligence</span>
          <h2 id="market-pulse-title">Market Pulse</h2>
          <p>Important stories shaping economies, markets, and digital assets.</p>
        </div>
        <div className="market-pulse-actions">
          {lastUpdated && <span>Updated {relativeTime(new Date(lastUpdated).toISOString())}</span>}
          <button className="refresh-btn" type="button" onClick={() => void loadStories(true)} disabled={isLoading}>
            <span className={isLoading ? 'refresh-icon spinning' : 'refresh-icon'} aria-hidden="true">↻</span>
            {isLoading ? 'Refreshing' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div className="market-notice">{error}</div>}

      {isLoading && !featured ? (
        <div className="market-grid" aria-label="Loading market stories">
          <div className="market-story featured-story story-skeleton" />
          <div className="secondary-stories">
            <div className="market-story story-skeleton" />
            <div className="market-story story-skeleton" />
          </div>
        </div>
      ) : featured ? (
        <div className="market-grid">
          <a className="market-story featured-story" href={featured.url_mobile || featured.url} target="_blank" rel="noreferrer">
            {featured.socialimage && (
              <div className="featured-image" style={{ backgroundImage: `url("${featured.socialimage}")` }} />
            )}
            <div className="featured-overlay" />
            <div className="featured-content">
              <StoryLabels story={featured} />
              <h3>{featured.title}</h3>
              <StoryMeta story={featured} />
              <span className="read-story">Read full story <span aria-hidden="true">↗</span></span>
            </div>
          </a>

          <div className="secondary-stories">
            {secondary.map((story) => (
              <a className="market-story compact-story" href={story.url_mobile || story.url} target="_blank" rel="noreferrer" key={story.url}>
                <StoryLabels story={story} />
                <h3>{story.title}</h3>
                <StoryMeta story={story} />
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <p className="market-disclaimer">
        News ranking and tone labels are automated from headline signals. For information only—not financial advice.
        Data provided by <a href="https://www.gdeltproject.org/" target="_blank" rel="noreferrer">GDELT</a>.
      </p>
    </section>
  );
}

function StoryLabels({ story }: { story: MarketStory }) {
  return (
    <div className="story-labels">
      <span className={`impact-label impact-${story.impact.toLowerCase()}`}>{story.impact} impact</span>
      <span className="category-label">{story.category}</span>
      <span className={`sentiment-dot sentiment-${story.sentiment.toLowerCase()}`} title={`${story.sentiment} headline tone`} />
    </div>
  );
}

function StoryMeta({ story }: { story: MarketStory }) {
  return (
    <div className="story-meta">
      <span>{story.domain}</span>
      <span>{relativeTime(story.seendate)}</span>
      {story.tickers.map((ticker) => <span className="ticker" key={ticker}>{ticker}</span>)}
    </div>
  );
}
