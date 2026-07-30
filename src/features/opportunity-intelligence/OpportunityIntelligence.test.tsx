import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BootstrapOpportunityReport,
  OpportunityInsight,
  OpportunityReport,
} from './types';
import {
  OpportunityIntelligence,
  buildOpportunityPresentation,
  collectOpportunitySources,
  formatGeneratedAt,
  formatGeneratedRelative,
  getReportFreshness,
  groupOpportunityItems,
  selectOpportunityReport,
} from './OpportunityIntelligence';

const buildItem: OpportunityInsight = {
  id: 'build-one',
  lane: 'build',
  title: 'Build an <img src=x onerror=alert(1)> assistant',
  verifiedFacts: [
    'A primary source published an API update.',
    'Adoption increased in the measured cohort.',
  ],
  inference: 'This could create a narrow product opening.',
  whyItMatters: 'Small teams can test the workflow quickly.',
  recommendedAction: 'Interview three operators this week.',
  confidence: 'medium',
  scores: {
    evidenceQuality: 82,
    productOpportunity: 91,
    careerLeverage: 60,
    urgency: 74,
    novelty: 77,
    overall: 81,
  },
  sources: [
    {
      url: 'https://docs.example.com/api-update',
      title: 'API <strong>update</strong>',
      domain: 'docs.example.com',
      publishedAt: '2026-07-29T09:00:00.000Z',
      tier: 1,
      primary: true,
    },
    {
      url: 'https://research.example.org/adoption',
      title: 'Adoption study',
      domain: 'research.example.org',
      publishedAt: '2026-07-28T12:00:00.000Z',
      tier: 2,
      primary: false,
    },
  ],
  topics: ['agents', 'developer tools'],
};

const careerItem: OpportunityInsight = {
  ...buildItem,
  id: 'career-one',
  lane: 'career',
  title: 'Lead AI evaluation programs',
  sources: [
    {
      url: 'https://jobs.example.net/evaluation',
      title: 'Evaluation roles report',
      domain: 'jobs.example.net',
      publishedAt: '2026-07-27T08:00:00.000Z',
      tier: 2,
      primary: false,
    },
  ],
};

const dailyReport: OpportunityReport = {
  schemaVersion: 1,
  reportType: 'daily',
  generatedAt: '2026-07-30T08:30:00.000Z',
  windowStart: '2026-07-29T00:00:00.000Z',
  windowEnd: '2026-07-30T00:00:00.000Z',
  model: 'fixture-model',
  runStatus: 'fresh',
  items: [buildItem, careerItem],
};

const weeklyReport: OpportunityReport = {
  ...dailyReport,
  reportType: 'weekly',
  generatedAt: '2026-07-27T08:30:00.000Z',
  items: [
    {
      ...buildItem,
      id: 'weekly-build-one',
      title: 'Weekly opportunity signal',
      verifiedFacts: ['Weekly evidence remains strong.'],
    },
  ],
  thesis: 'Evaluation is becoming an operating discipline.',
  watchNext: ['New benchmark releases'],
};

const bootstrapReport: BootstrapOpportunityReport = {
  schemaVersion: 1,
  reportType: 'daily',
  generatedAt: null,
  runStatus: 'awaiting-first-run',
  items: [],
};

describe('opportunity intelligence presentation helpers', () => {
  it('selects the report matching the active daily or weekly period', () => {
    expect(selectOpportunityReport('daily', dailyReport, weeklyReport)).toBe(dailyReport);
    expect(selectOpportunityReport('weekly', dailyReport, weeklyReport)).toBe(weeklyReport);
  });

  it('groups report items into Build and Career lanes without reordering them', () => {
    const secondBuild = { ...buildItem, id: 'build-two', title: 'Second build idea' };
    const groups = groupOpportunityItems([buildItem, careerItem, secondBuild]);

    expect(groups.build.map((item) => item.id)).toEqual(['build-one', 'build-two']);
    expect(groups.career.map((item) => item.id)).toEqual(['career-one']);
  });

  it('uses strict daily and weekly freshness thresholds', () => {
    expect(
      getReportFreshness(
        { ...dailyReport, generatedAt: '2026-07-28T20:00:00.000Z' },
        new Date('2026-07-30T08:00:00.000Z'),
      ),
    ).toBe('fresh');
    expect(
      getReportFreshness(
        { ...dailyReport, generatedAt: '2026-07-28T19:59:59.999Z' },
        new Date('2026-07-30T08:00:00.000Z'),
      ),
    ).toBe('stale');
    expect(
      getReportFreshness(
        { ...weeklyReport, generatedAt: '2026-07-21T08:00:00.000Z' },
        new Date('2026-07-30T08:00:00.000Z'),
      ),
    ).toBe('fresh');
    expect(
      getReportFreshness(
        { ...weeklyReport, generatedAt: '2026-07-21T07:59:59.999Z' },
        new Date('2026-07-30T08:00:00.000Z'),
      ),
    ).toBe('stale');
  });

  it('labels bootstrap reports as awaiting their first run', () => {
    expect(getReportFreshness(bootstrapReport, new Date('2026-07-30T08:00:00.000Z'))).toBe(
      'awaiting-first-run',
    );
  });

  it('formats generated timestamps with the requested interface locale', () => {
    const generatedAt = '2026-07-30T08:30:00.000Z';

    expect(formatGeneratedAt(generatedAt, 'en', 'UTC')).toBe('Jul 30, 2026, 8:30 AM');
    expect(formatGeneratedAt(generatedAt, 'de', 'UTC')).toBe('30. Juli 2026 um 8:30');
    expect(formatGeneratedRelative(
      generatedAt,
      'en',
      new Date('2026-07-30T09:00:00.000Z'),
    )).toBe('30 minutes ago');
    expect(formatGeneratedRelative(
      generatedAt,
      'de',
      new Date('2026-07-30T09:00:00.000Z'),
    )).toBe('vor 30 Minuten');
  });

  it('exposes every source link with its generated metadata unchanged', () => {
    expect(collectOpportunitySources(dailyReport)).toEqual([
      buildItem.sources[0],
      buildItem.sources[1],
      careerItem.sources[0],
    ]);
  });

  it('localizes interface labels but preserves generated editorial and untrusted text as plain values', () => {
    const english = buildOpportunityPresentation(
      dailyReport,
      'en',
      new Date('2026-07-30T09:00:00.000Z'),
      'UTC',
    );
    const german = buildOpportunityPresentation(
      dailyReport,
      'de',
      new Date('2026-07-30T09:00:00.000Z'),
      'UTC',
    );

    expect(english.copy.whyItMatters).toBe('Why it matters');
    expect(english.generatedLabel).toBe('30 minutes ago');
    expect(english.generatedTitle).toBe('Jul 30, 2026, 8:30 AM');
    expect(german.copy.whyItMatters).toBe('Warum es wichtig ist');
    expect(german.copy.daily).toBe('Täglich');
    expect(german.groups.build[0].title).toBe(buildItem.title);
    expect(german.groups.build[0].verifiedFacts).toEqual(buildItem.verifiedFacts);
    expect(german.groups.build[0].inference).toBe(buildItem.inference);
    expect(german.groups.build[0].sources[0].title).toBe('API <strong>update</strong>');
  });
});

describe('OpportunityIntelligence server rendering', () => {
  it('renders a populated German daily report with safe content, evidence, and source semantics', () => {
    const html = renderToStaticMarkup(
      <OpportunityIntelligence
        language="de"
        reports={{ daily: dailyReport, weekly: weeklyReport }}
      />,
    );

    expect(html).toContain('Chancen-Radar');
    expect(html).toContain('Live · evidenzbasiert');
    expect(html).toContain('Belege');
    expect(html).toContain('A primary source published an API update.');
    expect(html).toContain('Modellschlussfolgerung');
    expect(html).toContain('This could create a narrow product opening.');
    expect(html).toContain('Konfidenz (keine Wahrscheinlichkeit)');
    expect(html).toContain('Build an &lt;img src=x onerror=alert(1)&gt; assistant');
    expect(html).not.toContain('<img src=x onerror=alert(1)>');
    expect(html).toContain(
      'href="https://docs.example.com/api-update" target="_blank" rel="noopener noreferrer"',
    );
    expect(html).toContain('Täglich');
    expect(html).toContain('Wöchentlich');
    expect(html).toMatch(/<button[^>]*aria-pressed="true"[^>]*>Täglich<\/button>/);
    expect(html).toMatch(/<button[^>]*aria-pressed="false"[^>]*>Wöchentlich<\/button>/);
  });

  it('renders the supplied populated weekly report through the actual component', () => {
    const html = renderToStaticMarkup(
      <OpportunityIntelligence
        language="en"
        initialPeriod="weekly"
        now={new Date('2026-07-30T09:00:00.000Z')}
        timeZone="UTC"
        reports={{ daily: dailyReport, weekly: weeklyReport }}
      />,
    );

    expect(html).toContain('Weekly opportunity signal');
    expect(html).toContain('Weekly evidence remains strong.');
    expect(html).toContain('Live evidence-backed');
    expect(html).toContain('3 days ago');
    expect(html).toContain('title="Jul 27, 2026, 8:30 AM"');
    expect(html).toContain('Weekly thesis');
    expect(html).toContain('Evaluation is becoming an operating discipline.');
    expect(html).toContain('Watch next');
    expect(html).toContain('New benchmark releases');
    expect(html).toContain('Primary');
    expect(html).toContain('Corroborating');
    expect(html).toContain('Tier 1');
    expect(html).toContain('Tier 2');
    expect(html).toMatch(/<button[^>]*aria-pressed="false"[^>]*>Daily<\/button>/);
    expect(html).toMatch(/<button[^>]*aria-pressed="true"[^>]*>Weekly<\/button>/);
  });
});
