import { useCallback, useEffect, useMemo, useState } from 'react';

type Impact = 'High' | 'Medium' | 'Low';
type Sentiment = 'Positive' | 'Negative' | 'Mixed';
type MarketCategory = 'Macro' | 'Stocks' | 'Crypto' | 'Energy' | 'Geopolitics';
type AiCategory = 'Models' | 'Research' | 'Funding' | 'Chips' | 'Policy' | 'Products';
type StoryCategory = MarketCategory | AiCategory;

interface GdeltArticle {
  url: string;
  url_mobile?: string;
  title: string;
  seendate: string;
  socialimage?: string;
  domain: string;
}

interface GdeltResponse {
  articles?: GdeltArticle[];
}

interface PulseStory extends GdeltArticle {
  impact: Impact;
  sentiment: Sentiment;
  category: StoryCategory;
  tickers: string[];
  score: number;
  stream: 'market' | 'ai';
}

interface CacheEntry {
  savedAt: number;
  marketStories: PulseStory[];
  aiStories: PulseStory[];
}

interface PulseSectionProps {
  id: string;
  variant: 'market' | 'ai';
  kicker: string;
  title: string;
  description: string;
  stories: PulseStory[];
  isLoading: boolean;
  error: string;
  lastUpdated: number | null;
  onRefresh: () => void;
}

const CACHE_KEY = 'acid-reflux-intelligence-pulse-v2';
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
  'bitcoin',
  '"artificial intelligence"',
  '"large language model"',
  '"foundation model"',
  'OpenAI',
  'Anthropic',
  '"Google DeepMind"',
  '"AI regulation"',
  '"AI funding"',
  '"AI chips"'
].join(' OR ');

const API_URL =
  `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(`(${QUERY}) sourcelang:english`)}` +
  '&mode=artlist&maxrecords=100&format=jsonp&sort=datedesc&timespan=24h';

let activeGdeltRequest: Promise<GdeltResponse> | null = null;

const aiSignal =
  /\b(ai|artificial intelligence|machine learning|large language model|llm|foundation model|openai|anthropic|deepmind|chatgpt|gemini|claude|copilot|neural network)\b/i;

const marketCategoryRules: Array<[MarketCategory, RegExp]> = [
  ['Crypto', /\b(bitcoin|crypto|ethereum|blockchain|btc|eth)\b/i],
  ['Energy', /\b(oil|gas|opec|energy|crude|lng)\b/i],
  ['Geopolitics', /\b(war|sanction|tariff|conflict|nato|trade deal|embargo)\b/i],
  ['Stocks', /\b(stock|shares|earnings|nasdaq|s&p|dow|ipo|merger)\b/i]
];

const aiCategoryRules: Array<[AiCategory, RegExp]> = [
  ['Funding', /\b(funding|raises|valuation|investment|venture|acquisition|acquires)\b/i],
  ['Chips', /\b(chip|gpu|semiconductor|nvidia|amd|tpu|data center)\b/i],
  ['Policy', /\b(regulation|law|act|safety|copyright|ban|government|antitrust)\b/i],
  ['Research', /\b(research|paper|benchmark|study|breakthrough|training method)\b/i],
  ['Models', /\b(model|llm|gpt|claude|gemini|foundation model|release)\b/i]
];

const tickerRules: Array<[string, RegExp]> = [
  ['BTC', /\b(bitcoin|btc)\b/i],
  ['ETH', /\b(ethereum|eth)\b/i],
  ['AAPL', /\b(apple|aapl)\b/i],
  ['MSFT', /\b(microsoft|msft|copilot)\b/i],
  ['NVDA', /\b(nvidia|nvda)\b/i],
  ['TSLA', /\b(tesla|tsla)\b/i],
  ['AMZN', /\b(amazon|amzn|aws)\b/i],
  ['GOOGL', /\b(google|alphabet|googl|deepmind|gemini)\b/i],
  ['META', /\b(meta|facebook|llama)\b/i],
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

function enrichStory(article: GdeltArticle): PulseStory {
  const text = article.title.toLowerCase();
  const stream = aiSignal.test(text) ? 'ai' : 'market';
  const category: StoryCategory =
    stream === 'ai'
      ? aiCategoryRules.find(([, pattern]) => pattern.test(text))?.[0] ?? 'Products'
      : marketCategoryRules.find(([, pattern]) => pattern.test(text))?.[0] ?? 'Macro';
  const tickers = tickerRules
    .filter(([, pattern]) => pattern.test(text))
    .map(([ticker]) => ticker)
    .slice(0, 3);

  const marketHigh =
    text.match(/\b(rate (?:hike|cut|decision)|central bank|war|recession|crash|sanction|tariff|default|emergency)\b/g)
      ?.length ?? 0;
  const aiHigh =
    text.match(/\b(major release|frontier model|breakthrough|ban|regulation|billion|acquisition|security flaw|open source)\b/g)
      ?.length ?? 0;
  const mediumSignals =
    text.match(/\b(inflation|earnings|jobs|gdp|oil|funding|launch|benchmark|partnership|copyright|chips?)\b/g)?.length ?? 0;
  const highSignals = stream === 'ai' ? aiHigh : marketHigh;
  const impact: Impact = highSignals > 0 ? 'High' : mediumSignals > 0 ? 'Medium' : 'Low';

  const positiveSignals =
    text.match(/\b(rally|surge|gain|growth|beat|record high|deal|recovery|launch|breakthrough|funding)\b/g)?.length ?? 0;
  const negativeSignals =
    text.match(/\b(fall|drop|loss|crash|recession|war|sanction|layoff|miss|inflation|ban|lawsuit|risk)\b/g)?.length ?? 0;
  const sentiment: Sentiment =
    positiveSignals === negativeSignals ? 'Mixed' : positiveSignals > negativeSignals ? 'Positive' : 'Negative';

  const ageHours = Math.max(0, (Date.now() - parseGdeltDate(article.seendate).getTime()) / 3600000);
  const namedAiLeader =
    stream === 'ai' && /\b(openai|anthropic|deepmind|nvidia|microsoft|meta|google)\b/i.test(text) ? 2 : 0;
  const score = highSignals * 5 + mediumSignals * 2 + tickers.length * 1.5 + namedAiLeader + Math.max(0, 4 - ageHours / 6);

  return { ...article, category, tickers, impact, sentiment, score, stream };
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
    const callbackName = `gdeltIntelligencePulse_${Date.now()}_${Math.random().toString(36).slice(2)}`;
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
  const [marketStories, setMarketStories] = useState<PulseStory[]>(cached?.marketStories ?? []);
  const [aiStories, setAiStories] = useState<PulseStory[]>(cached?.aiStories ?? []);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<number | null>(cached?.savedAt ?? null);

  const loadStories = useCallback(async (force = false) => {
    const existing = readCache();

    if (!force && existing && Date.now() - existing.savedAt < CACHE_TTL) {
      setMarketStories(existing.marketStories);
      setAiStories(existing.aiStories);
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
      const enriched = unique.map(enrichStory);
      const nextMarketStories = enriched
        .filter((story) => story.stream === 'market')
        .sort((a, b) => b.score - a.score)
        .slice(0, 7);
      const nextAiStories = enriched
        .filter((story) => story.stream === 'ai')
        .sort((a, b) => b.score - a.score)
        .slice(0, 7);

      if (!nextMarketStories.length || !nextAiStories.length) {
        throw new Error('Incomplete intelligence feed');
      }

      const savedAt = Date.now();
      const nextCache = { savedAt, marketStories: nextMarketStories, aiStories: nextAiStories };
      localStorage.setItem(CACHE_KEY, JSON.stringify(nextCache));
      setMarketStories(nextMarketStories);
      setAiStories(nextAiStories);
      setLastUpdated(savedAt);
    } catch {
      if (!marketStories.length && !aiStories.length) {
        setError('The public news feed is busy. Please wait a moment and refresh.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [aiStories.length, marketStories.length]);

  useEffect(() => {
    void loadStories();
    const interval = window.setInterval(() => void loadStories(true), REFRESH_INTERVAL);
    return () => window.clearInterval(interval);
  }, [loadStories]);

  const commonProps = {
    isLoading,
    error,
    lastUpdated,
    onRefresh: () => void loadStories(true)
  };

  return (
    <div className="intelligence-feed">
      <PulseSection
        {...commonProps}
        id="market-pulse-title"
        variant="market"
        kicker="Global intelligence"
        title="Market Pulse"
        description="Important stories shaping economies, markets, and digital assets."
        stories={marketStories}
      />
      <PulseSection
        {...commonProps}
        id="ai-pulse-title"
        variant="ai"
        kicker="Frontier intelligence"
        title="AI Pulse"
        description="Major model releases, research, funding, chips, policy, and product moves."
        stories={aiStories}
      />
    </div>
  );
}

function PulseSection({
  id,
  variant,
  kicker,
  title,
  description,
  stories,
  isLoading,
  error,
  lastUpdated,
  onRefresh
}: PulseSectionProps) {
  const featured = stories[0];
  const secondary = stories.slice(1);

  return (
    <section className={`market-pulse ${variant === 'ai' ? 'ai-pulse' : ''}`} aria-labelledby={id}>
      <div className="market-pulse-header">
        <div>
          <span className="section-kicker">{kicker}</span>
          <h2 id={id}>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="market-pulse-actions">
          {lastUpdated && <span>Updated {relativeTime(new Date(lastUpdated).toISOString())}</span>}
          <button className="refresh-btn" type="button" onClick={onRefresh} disabled={isLoading}>
            <span className={isLoading ? 'refresh-icon spinning' : 'refresh-icon'} aria-hidden="true">&#8635;</span>
            {isLoading ? 'Refreshing' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div className="market-notice">{error}</div>}

      {isLoading && !featured ? (
        <div className="market-grid" aria-label={`Loading ${title} stories`}>
          <div className="market-story featured-story story-skeleton" />
          <div className="secondary-stories">
            <div className="market-story story-skeleton" />
            <div className="market-story story-skeleton" />
          </div>
        </div>
      ) : featured ? (
        <div className="market-grid">
          <StoryCard story={featured} featured />
          <div className="secondary-stories">
            {secondary.map((story) => <StoryCard story={story} key={story.url} />)}
          </div>
        </div>
      ) : null}

      <p className="market-disclaimer">
        Automated headline ranking and tone analysis. For information only&mdash;verify important claims at the source.
        Data provided by <a href="https://www.gdeltproject.org/" target="_blank" rel="noreferrer">GDELT</a>.
      </p>
    </section>
  );
}

function StoryCard({ story, featured = false }: { story: PulseStory; featured?: boolean }) {
  return (
    <a
      className={`market-story ${featured ? 'featured-story' : 'compact-story'}`}
      href={story.url_mobile || story.url}
      target="_blank"
      rel="noreferrer"
    >
      {featured && story.socialimage && (
        <div className="featured-image" style={{ backgroundImage: `url("${story.socialimage}")` }} />
      )}
      {featured && <div className="featured-overlay" />}
      <div className={featured ? 'featured-content' : undefined}>
        <StoryLabels story={story} />
        <h3>{story.title}</h3>
        <StoryMeta story={story} />
        {featured && <span className="read-story">Read full story <span aria-hidden="true">&#8599;</span></span>}
      </div>
    </a>
  );
}

function StoryLabels({ story }: { story: PulseStory }) {
  return (
    <div className="story-labels">
      <span className={`impact-label impact-${story.impact.toLowerCase()}`}>{story.impact} impact</span>
      <span className="category-label">{story.category}</span>
      <span
        className={`sentiment-dot sentiment-${story.sentiment.toLowerCase()}`}
        title={`${story.sentiment} headline tone`}
      />
    </div>
  );
}

function StoryMeta({ story }: { story: PulseStory }) {
  return (
    <div className="story-meta">
      <span>{story.domain}</span>
      <span>{relativeTime(story.seendate)}</span>
      {story.tickers.map((ticker) => <span className="ticker" key={ticker}>{ticker}</span>)}
    </div>
  );
}
