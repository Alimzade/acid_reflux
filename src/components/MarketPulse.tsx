import { useCallback, useMemo, useState } from 'react';
import pulseData from '../data/pulse.json';
import { IconChevronLeft, IconChevronRight } from './Icons';

type Impact = 'High' | 'Medium' | 'Low';
type Sentiment = 'Positive' | 'Negative' | 'Mixed';
type MarketCategory = 'Macro' | 'Stocks' | 'Crypto' | 'Energy' | 'Geopolitics';
type AiCategory = 'Models' | 'Research' | 'Funding' | 'Chips' | 'Policy' | 'Products';
type StoryCategory = MarketCategory | AiCategory;

interface PulseStory {
  url: string;
  url_mobile?: string;
  title: string;
  seendate: string;
  domain: string;
  impact: Impact;
  sentiment: Sentiment;
  category: StoryCategory;
  tickers: string[];
  socialimage?: string;
}

interface PulseSectionProps {
  id: string;
  variant: 'market' | 'ai';
  kicker: string;
  title: string;
  description: string;
  stories: PulseStory[];
  selectedDate: string;
  dates: string[];
  onDateChange: (date: string) => void;
  formatDateLabel: (date: string) => string;
}

export function MarketPulse() {
  const dates = pulseData.dates;
  const [marketDate, setMarketDate] = useState<string>(dates[0]);
  const [aiDate, setAiDate] = useState<string>(dates[0]);

  const marketStories: PulseStory[] = useMemo(() => {
    const list = (pulseData.marketStoriesByDate as Record<string, PulseStory[]>)[marketDate] || [];
    return list;
  }, [marketDate]);

  const aiStories: PulseStory[] = useMemo(() => {
    const list = (pulseData.aiStoriesByDate as Record<string, PulseStory[]>)[aiDate] || [];
    return list;
  }, [aiDate]);

  const formatDateLabel = useCallback((dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const diffDays = Math.round((today.getTime() - d.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 0) return `Today (${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`;
    if (diffDays === 1) return `Yesterday (${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  return (
    <div className="intelligence-feed" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <PulseSection
        id="market-pulse-title"
        variant="market"
        kicker="Global intelligence"
        title="Market Pulse"
        description="Important stories shaping economies, markets, and digital assets."
        stories={marketStories}
        selectedDate={marketDate}
        dates={dates}
        onDateChange={setMarketDate}
        formatDateLabel={formatDateLabel}
      />
      <PulseSection
        id="ai-pulse-title"
        variant="ai"
        kicker="Frontier intelligence"
        title="AI Pulse"
        description="Major model releases, research, funding, chips, policy, and product moves."
        stories={aiStories}
        selectedDate={aiDate}
        dates={dates}
        onDateChange={setAiDate}
        formatDateLabel={formatDateLabel}
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
  selectedDate,
  dates,
  onDateChange,
  formatDateLabel
}: PulseSectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const featured = stories[0];
  const secondary = stories.slice(1);

  const currentIndex = dates.indexOf(selectedDate);
  const hasOlder = currentIndex < dates.length - 1;
  const hasNewer = currentIndex > 0;

  // Next (Right Arrow / Newer Date): move towards index 0
  const handleNextDate = () => {
    if (hasNewer) onDateChange(dates[currentIndex - 1]);
  };

  // Prev (Left Arrow / Older Date): move towards higher index
  const handlePrevDate = () => {
    if (hasOlder) onDateChange(dates[currentIndex + 1]);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    onDateChange(dates[0]);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <section className={`market-pulse ${variant === 'ai' ? 'ai-pulse' : ''}`} aria-labelledby={id}>
      <div className="market-pulse-header">
        <div>
          <span className="section-kicker">{kicker}</span>
          <h2 id={id}>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="market-pulse-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="pulse-date-btn"
              onClick={handlePrevDate}
              disabled={!hasOlder}
              title="Previous (Older Date)"
            >
              <IconChevronLeft size={16} />
            </button>

            <select
              id={`${variant}-date-select`}
              className="pulse-date-select"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
            >
              {dates.map((dateStr) => (
                <option key={dateStr} value={dateStr}>
                  {formatDateLabel(dateStr)}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="pulse-date-btn"
              onClick={handleNextDate}
              disabled={!hasNewer}
              title="Next (Newer Date)"
            >
              <IconChevronRight size={16} />
            </button>

            <button
              type="button"
              className={`pulse-date-btn ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh pulse data"
              style={{ marginLeft: '0.4rem' }}
            >
              <span className={isRefreshing ? 'spinning-icon' : ''} style={{ fontSize: '1rem', display: 'inline-block' }}>↻</span>
            </button>
          </div>
        </div>
      </div>

      {featured ? (
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
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          No {title.toLowerCase()} stories recorded for {selectedDate}.
        </div>
      )}
    </section>
  );
}

function StoryLabels({ story }: { story: PulseStory }) {
  return (
    <div className="story-labels">
      <span className={`impact-label impact-${story.impact.toLowerCase()}`}>{story.impact} impact</span>
      <span className="category-label">{story.category}</span>
      <span className={`sentiment-dot sentiment-${story.sentiment.toLowerCase()}`} title={`${story.sentiment} headline tone`} />
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

function relativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
