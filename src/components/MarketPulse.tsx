import { useCallback, useMemo, useState } from 'react';
import pulseData from '../data/pulse.json';
import { IconChevronLeft, IconChevronRight } from './Icons';
import { Language } from '../types';

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
  language: Language;
}

const GERMAN_TITLES: Record<string, string> = {
  'Global Central Banks Align on Monetary Rate Stabilization Strategies': 'Globale Zentralbanken stimmen ihre Strategien zur Stabilisierung der Zinssätze ab',
  'Semiconductor & Tech Capital Expenditure Reaches All-Time High': 'Investitionen in Halbleiter und Technologie erreichen ein Allzeithoch',
  'Institutional Crypto Funds Record Massive Inflows Amid Digital Asset Expansion': 'Institutionelle Kryptofonds verzeichnen massive Zuflüsse',
  'Inflation Index Cools Towards Key Target Band in Q3 Financial Report': 'Inflationsindex nähert sich im Finanzbericht für Q3 dem Zielkorridor',
  'Global Crude Energy Supply Rebalances Following Shipping Route Updates': 'Globale Rohölversorgung stabilisiert sich nach Änderungen der Schifffahrtsrouten',
  'Enterprise Cloud Growth Accelerates Enterprise Digital Transformation': 'Cloud-Wachstum beschleunigt die digitale Transformation von Unternehmen',
  'International Trade Framework Tariff Adjustments Approved by Commerce Delegations': 'Handelsdelegationen genehmigen Zollanpassungen im internationalen Handelsrahmen',
  'Renewable Power Grid Capacities Exceed Expectations Across North America': 'Kapazitäten erneuerbarer Stromnetze übertreffen in Nordamerika die Erwartungen',
  'Global Sovereign Bond Yields Stabilize Following Policy Clarifications': 'Renditen globaler Staatsanleihen stabilisieren sich nach politischen Klarstellungen',
  'Frontier AI Models Achieve Unprecedented Autonomous Reasoning Benchmarks': 'Fortschrittliche KI-Modelle erreichen neue Bestwerte beim autonomen Schlussfolgern',
  'Custom Silicon Accelerators Double AI Cluster Compute Efficiency': 'Spezielle Silizium-Beschleuniger verdoppeln die Recheneffizienz von KI-Clustern',
  'International Coalition Agrees on Standardized AI Governance Guidelines': 'Internationale Koalition einigt sich auf standardisierte Richtlinien für KI-Governance',
  'Multimodal Agent Frameworks Transform Autonomous Enterprise Workflows': 'Multimodale Agenten-Frameworks verändern autonome Unternehmensabläufe',
  'Open-Source AI Developer Ecosystem Sees Exponential Adoption Surge': 'Open-Source-Ökosystem für KI-Entwicklung verzeichnet stark wachsende Nutzung',
  'Data Center Power Innovations Accelerate Next-Gen Model Deployments': 'Innovationen bei der Rechenzentrumsenergie beschleunigen den Einsatz neuer Modelle',
  'Venture Capital Inflows into Frontier AI Startups Reach New Peak': 'Risikokapitalzuflüsse in innovative KI-Start-ups erreichen einen neuen Höchststand',
  'Independent Research Labs Establish Standardized Benchmark Suite': 'Unabhängige Forschungslabore entwickeln eine standardisierte Benchmark-Suite',
  'Synthetic Data Generation Reduces Model Pre-Training Data Bottlenecks': 'Synthetische Datengenerierung reduziert Engpässe beim Vortraining von Modellen'
};

const GERMAN_CATEGORIES: Record<StoryCategory, string> = {
  Macro: 'Makro', Stocks: 'Aktien', Crypto: 'Krypto', Energy: 'Energie', Geopolitics: 'Geopolitik',
  Models: 'Modelle', Research: 'Forschung', Funding: 'Finanzierung', Chips: 'Chips',
  Policy: 'Regulierung', Products: 'Produkte'
};

export function MarketPulse({ language }: { language: Language }) {
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
    const locale = language === 'de' ? 'de-DE' : 'en-US';

    if (diffDays === 0) return `${language === 'de' ? 'Heute' : 'Today'} (${d.toLocaleDateString(locale, { month: 'short', day: 'numeric' })})`;
    if (diffDays === 1) return `${language === 'de' ? 'Gestern' : 'Yesterday'} (${d.toLocaleDateString(locale, { month: 'short', day: 'numeric' })})`;
    return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  }, [language]);

  return (
    <div className="intelligence-feed" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <PulseSection
        id="market-pulse-title"
        variant="market"
        kicker={language === 'de' ? 'Globale Informationen' : 'Global intelligence'}
        title={language === 'de' ? 'Markt-Puls' : 'Market Pulse'}
        description={language === 'de' ? 'Wichtige Entwicklungen, die Wirtschaft, Märkte und digitale Vermögenswerte prägen.' : 'Important stories shaping economies, markets, and digital assets.'}
        stories={marketStories}
        selectedDate={marketDate}
        dates={dates}
        onDateChange={setMarketDate}
        formatDateLabel={formatDateLabel}
        language={language}
      />
      <PulseSection
        id="ai-pulse-title"
        variant="ai"
        kicker={language === 'de' ? 'KI-Trends' : 'Frontier intelligence'}
        title={language === 'de' ? 'KI-Puls' : 'AI Pulse'}
        description={language === 'de' ? 'Wichtige Modellveröffentlichungen, Forschung, Finanzierung, Chips, Regulierung und Produkte.' : 'Major model releases, research, funding, chips, policy, and product moves.'}
        stories={aiStories}
        selectedDate={aiDate}
        dates={dates}
        onDateChange={setAiDate}
        formatDateLabel={formatDateLabel}
        language={language}
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
  formatDateLabel,
  language
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
              title={language === 'de' ? 'Zurück (älteres Datum)' : 'Previous (Older Date)'}
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
              title={language === 'de' ? 'Weiter (neueres Datum)' : 'Next (Newer Date)'}
            >
              <IconChevronRight size={16} />
            </button>

            <button
              type="button"
              className={`pulse-date-btn ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
              title={language === 'de' ? 'Pulsdaten aktualisieren' : 'Refresh pulse data'}
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
              <StoryLabels story={featured} language={language} />
              <h3>{language === 'de' ? GERMAN_TITLES[featured.title] ?? featured.title : featured.title}</h3>
              <StoryMeta story={featured} language={language} />
              <span className="read-story">
                {language === 'de' ? 'Ganzen Artikel lesen' : 'Read full story'} <span aria-hidden="true">&#8599;</span>
              </span>
            </div>
          </a>

          <div className="secondary-stories">
            {secondary.map((story) => (
              <a className="market-story compact-story" href={story.url_mobile || story.url} target="_blank" rel="noreferrer" key={story.url}>
                <StoryLabels story={story} language={language} />
                <h3>{language === 'de' ? GERMAN_TITLES[story.title] ?? story.title : story.title}</h3>
                <StoryMeta story={story} language={language} />
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          {language === 'de'
            ? `Für ${selectedDate} sind keine Meldungen im ${title} gespeichert.`
            : `No ${title.toLowerCase()} stories recorded for ${selectedDate}.`}
        </div>
      )}
    </section>
  );
}

function StoryLabels({ story, language }: { story: PulseStory; language: Language }) {
  const impact = language === 'de'
    ? story.impact === 'High' ? 'Hohe' : story.impact === 'Medium' ? 'Mittlere' : 'Geringe'
    : story.impact;

  return (
    <div className="story-labels">
      <span className={`impact-label impact-${story.impact.toLowerCase()}`}>
        {impact} {language === 'de' ? 'Wirkung' : 'impact'}
      </span>
      <span className="category-label">{language === 'de' ? GERMAN_CATEGORIES[story.category] : story.category}</span>
      <span className={`sentiment-dot sentiment-${story.sentiment.toLowerCase()}`} title={`${story.sentiment} headline tone`} />
    </div>
  );
}

function StoryMeta({ story, language }: { story: PulseStory; language: Language }) {
  return (
    <div className="story-meta">
      <span>{story.domain}</span>
      <span>{relativeTime(story.seendate, language)}</span>
      {story.tickers.map((ticker) => <span className="ticker" key={ticker}>{ticker}</span>)}
    </div>
  );
}

function relativeTime(dateString: string, language: Language): string {
  const date = new Date(dateString);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return language === 'de' ? 'Gerade eben' : 'Just now';
  if (diffHours < 24) return language === 'de' ? `vor ${diffHours} Std.` : `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return language === 'de' ? `vor ${diffDays} T.` : `${diffDays}d ago`;
}
