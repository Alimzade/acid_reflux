import { useMemo, useState } from 'react';
import dailyReportData from '../../data/opportunity-daily.json';
import weeklyReportData from '../../data/opportunity-weekly.json';
import type { Language } from '../../types';
import { getOpportunityCopy, type OpportunityIntelligenceCopy } from './translations';
import type {
  OpportunityInsight,
  OpportunityReportFile,
  OpportunitySource,
  RadarKind,
} from './types';

export type OpportunityPeriod = 'daily' | 'weekly';
export type OpportunityFreshness = 'fresh' | 'stale' | 'awaiting-first-run';

interface OpportunityGroups {
  build: OpportunityInsight[];
  career: OpportunityInsight[];
}

export interface OpportunityPresentation {
  copy: OpportunityIntelligenceCopy;
  freshness: OpportunityFreshness;
  generatedLabel: string | null;
  generatedTitle: string | null;
  groups: OpportunityGroups;
}

const DAILY_STALE_AFTER_MS = 36 * 60 * 60 * 1000;
const WEEKLY_STALE_AFTER_MS = 9 * 24 * 60 * 60 * 1000;

export interface OpportunityReportInputs {
  daily: OpportunityReportFile;
  weekly: OpportunityReportFile;
}

export interface OpportunityIntelligenceProps {
  language: Language;
  reports?: OpportunityReportInputs;
  initialPeriod?: OpportunityPeriod;
  now?: Date;
  timeZone?: string;
}

const productionReports: OpportunityReportInputs = {
  daily: dailyReportData as OpportunityReportFile,
  weekly: weeklyReportData as OpportunityReportFile,
};

export function selectOpportunityReport(
  period: OpportunityPeriod,
  daily: OpportunityReportFile,
  weekly: OpportunityReportFile,
): OpportunityReportFile {
  return period === 'daily' ? daily : weekly;
}

export function groupOpportunityItems(items: OpportunityInsight[]): OpportunityGroups {
  return items.reduce<OpportunityGroups>(
    (groups, item) => {
      groups[item.lane].push(item);
      return groups;
    },
    { build: [], career: [] },
  );
}

export function getReportFreshness(
  report: OpportunityReportFile,
  now = new Date(),
): OpportunityFreshness {
  if (report.runStatus === 'awaiting-first-run' || report.generatedAt === null) {
    return 'awaiting-first-run';
  }

  if (report.runStatus === 'stale') {
    return 'stale';
  }

  const age = now.getTime() - new Date(report.generatedAt).getTime();
  const threshold =
    report.reportType === 'daily' ? DAILY_STALE_AFTER_MS : WEEKLY_STALE_AFTER_MS;

  return !Number.isFinite(age) || age > threshold ? 'stale' : 'fresh';
}

export function formatGeneratedAt(
  generatedAt: string,
  language: Language,
  timeZone?: string,
): string {
  return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: language === 'de' ? 'long' : 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  }).format(new Date(generatedAt));
}

export function formatGeneratedRelative(
  generatedAt: string,
  language: Language,
  now = new Date(),
): string {
  const differenceMilliseconds = new Date(generatedAt).getTime() - now.getTime();
  const formatter = new Intl.RelativeTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
    numeric: 'auto',
  });
  const absoluteMilliseconds = Math.abs(differenceMilliseconds);
  if (absoluteMilliseconds < 60 * 1_000) {
    return formatter.format(Math.round(differenceMilliseconds / 1_000), 'second');
  }
  if (absoluteMilliseconds < 60 * 60 * 1_000) {
    return formatter.format(Math.round(differenceMilliseconds / (60 * 1_000)), 'minute');
  }
  if (absoluteMilliseconds < 24 * 60 * 60 * 1_000) {
    return formatter.format(Math.round(differenceMilliseconds / (60 * 60 * 1_000)), 'hour');
  }
  return formatter.format(Math.round(differenceMilliseconds / (24 * 60 * 60 * 1_000)), 'day');
}

export function collectOpportunitySources(report: OpportunityReportFile): OpportunitySource[] {
  return report.items.flatMap((item) => item.sources);
}

export function buildOpportunityPresentation(
  report: OpportunityReportFile,
  language: Language,
  now = new Date(),
  timeZone?: string,
): OpportunityPresentation {
  return {
    copy: getOpportunityCopy(language),
    freshness: getReportFreshness(report, now),
    generatedLabel:
      report.generatedAt === null
        ? null
        : formatGeneratedRelative(report.generatedAt, language, now),
    generatedTitle:
      report.generatedAt === null ? null : formatGeneratedAt(report.generatedAt, language, timeZone),
    groups: groupOpportunityItems(report.items),
  };
}

export function OpportunityIntelligence({
  language,
  reports = productionReports,
  initialPeriod = 'daily',
  now = new Date(),
  timeZone,
}: OpportunityIntelligenceProps) {
  const [period, setPeriod] = useState<OpportunityPeriod>(initialPeriod);
  const report = selectOpportunityReport(period, reports.daily, reports.weekly);
  const presentation = useMemo(
    () => buildOpportunityPresentation(report, language, now, timeZone),
    [language, now, report, timeZone],
  );
  const { copy, freshness, generatedLabel, generatedTitle, groups } = presentation;
  const activeWeeklyReport = report.runStatus !== 'awaiting-first-run'
    && report.reportType === 'weekly'
    ? report
    : null;

  return (
    <section
      className="opportunity-intelligence"
      aria-labelledby="opportunity-intelligence-title"
    >
      <div className="opportunity-intelligence__header">
        <div className="opportunity-intelligence__heading">
          <span className="section-kicker">{copy.kicker}</span>
          <h2 id="opportunity-intelligence-title">{copy.title}</h2>
          <p>{copy.description}</p>
        </div>

        <div
          className="opportunity-intelligence__period"
          role="group"
          aria-label={copy.periodSelector}
        >
          {(['daily', 'weekly'] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={period === option ? 'is-active' : undefined}
              aria-pressed={period === option}
              onClick={() => setPeriod(option)}
            >
              {option === 'daily' ? copy.daily : copy.weekly}
            </button>
          ))}
        </div>
      </div>

      <div className="opportunity-intelligence__metadata">
        <span className="opportunity-intelligence__live-badge">
          <span aria-hidden="true">●</span>
          {copy.liveBadge}
        </span>
        {generatedLabel && (
          <p className="opportunity-intelligence__generated">
            {copy.generated}:{' '}
            <time
              dateTime={report.generatedAt ?? undefined}
              title={generatedTitle ?? undefined}
            >
              {generatedLabel}
            </time>
          </p>
        )}
      </div>

      {freshness === 'stale' && (
        <div className="opportunity-intelligence__notice" role="status">
          <strong>{copy.staleReport}</strong>
          <span>{copy.staleReportDescription}</span>
        </div>
      )}

      {freshness === 'awaiting-first-run' ? (
        <div className="opportunity-intelligence__bootstrap" role="status">
          <span className="opportunity-intelligence__bootstrap-icon" aria-hidden="true">
            ◌
          </span>
          <div>
            <h3>{copy.awaitingFirstRun}</h3>
            <p>{copy.awaitingFirstRunDescription}</p>
          </div>
        </div>
      ) : (
        <>
          {activeWeeklyReport
            && (activeWeeklyReport.thesis
              || (activeWeeklyReport.watchNext && activeWeeklyReport.watchNext.length > 0)) && (
            <div className="opportunity-intelligence__weekly-summary">
              {activeWeeklyReport.thesis && (
                <div>
                  <h3>{copy.weeklyThesis}</h3>
                  <p>{activeWeeklyReport.thesis}</p>
                </div>
              )}
              {activeWeeklyReport.watchNext && activeWeeklyReport.watchNext.length > 0 && (
                <div>
                  <h3>{copy.watchNext}</h3>
                  <ul>
                    {activeWeeklyReport.watchNext.map((entry, index) => (
                      <li key={`${index}-${entry}`}>{entry}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <div className="opportunity-intelligence__radars">
            <RadarColumn
              lane="build"
              title={copy.buildRadar}
              items={groups.build}
              copy={copy}
              language={language}
            />
            <RadarColumn
              lane="career"
              title={copy.careerRadar}
              items={groups.career}
              copy={copy}
              language={language}
            />
          </div>
        </>
      )}

      <p className="opportunity-intelligence__disclosure">{copy.disclosure}</p>
    </section>
  );
}

function RadarColumn({
  lane,
  title,
  items,
  copy,
  language,
}: {
  lane: RadarKind;
  title: string;
  items: OpportunityInsight[];
  copy: OpportunityIntelligenceCopy;
  language: Language;
}) {
  return (
    <div className={`opportunity-radar opportunity-radar--${lane}`}>
      <h3>{title}</h3>
      <div className="opportunity-radar__cards">
        {items.map((item) => (
          <OpportunityCard key={item.id} item={item} copy={copy} language={language} />
        ))}
      </div>
    </div>
  );
}

function OpportunityCard({
  item,
  copy,
  language,
}: {
  item: OpportunityInsight;
  copy: OpportunityIntelligenceCopy;
  language: Language;
}) {
  return (
    <article className={`opportunity-card opportunity-card--${item.lane}`}>
      <div className="opportunity-card__topline">
        <span className="opportunity-card__lane">{copy.laneLabels[item.lane]}</span>
        <span className="opportunity-card__score">
          {copy.overallScore} <strong>{item.scores.overall}/100</strong>
        </span>
      </div>

      <h4>{item.title}</h4>

      <section className="opportunity-card__evidence" aria-label={copy.evidence}>
        <h5>{copy.evidence}</h5>
        <ul>
          {item.verifiedFacts.map((fact, index) => (
            <li key={`${item.id}-fact-${index}`}>{fact}</li>
          ))}
        </ul>
      </section>

      <div className="opportunity-card__inference">
        <strong>{copy.modelInference}</strong>
        <p>{item.inference}</p>
      </div>

      <div className="opportunity-card__detail">
        <h5>{copy.whyItMatters}</h5>
        <p>{item.whyItMatters}</p>
      </div>

      <div className="opportunity-card__detail opportunity-card__action">
        <h5>{copy.nextMove}</h5>
        <p>{item.recommendedAction}</p>
      </div>

      <div className="opportunity-card__confidence">
        <span>{copy.confidence}</span>
        <strong>{copy.confidenceLabels[item.confidence]}</strong>
      </div>

      <div className="opportunity-card__topics">
        <h5>{copy.topics}</h5>
        <ul>
          {item.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </div>

      <div className="opportunity-card__sources">
        <h5>{copy.sources}</h5>
        <ul>
          {item.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                <span>{source.title}</span>
                <small>
                  <span className="opportunity-card__source-kind">
                    {source.primary ? copy.primarySource : copy.corroboratingSource}
                    {' · '}
                    {copy.tier} {source.tier}
                  </span>
                  <span>
                    {source.domain} · {formatSourceDate(source.publishedAt, language)}
                  </span>
                </small>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function formatSourceDate(publishedAt: string, language: Language): string {
  return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(publishedAt));
}
