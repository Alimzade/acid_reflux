import { describe, expect, it } from 'vitest';
import { validateOpportunityReport } from './reportSchema';
import type { DailyOpportunityReport, OpportunityInsight } from './types';

const evidenceUrls = [
  'https://primary.example.com/announcement',
  'https://independent.example.com/coverage',
];

function insight(overrides: Partial<OpportunityInsight> = {}): OpportunityInsight {
  return {
    id: 'opportunity-1',
    lane: 'build',
    title: 'A verified opportunity',
    verifiedFacts: ['A verifiable fact'],
    inference: 'A practical inference.',
    whyItMatters: 'It has meaningful upside.',
    recommendedAction: 'Evaluate it this week.',
    confidence: 'medium',
    scores: {
      evidenceQuality: 75,
      productOpportunity: 70,
      careerLeverage: 55,
      urgency: 40,
      novelty: 50,
      overall: 75,
    },
    sources: [
      {
        url: evidenceUrls[0],
        title: 'Primary announcement',
        domain: 'primary.example.com',
        publishedAt: '2026-07-29T10:00:00.000Z',
        tier: 2,
        primary: true,
      },
      {
        url: evidenceUrls[1],
        title: 'Independent coverage',
        domain: 'independent.example.com',
        publishedAt: '2026-07-29T12:00:00.000Z',
        tier: 2,
        primary: false,
      },
    ],
    topics: ['ai'],
    ...overrides,
  };
}

function daily(overrides: Partial<DailyOpportunityReport> = {}): DailyOpportunityReport {
  return {
    schemaVersion: 1,
    reportType: 'daily',
    generatedAt: '2026-07-30T08:00:00.000Z',
    windowStart: '2026-07-29T08:00:00.000Z',
    windowEnd: '2026-07-30T08:00:00.000Z',
    model: 'grok-4',
    items: [insight()],
    runStatus: 'fresh',
    ...overrides,
  };
}

describe('Opportunity Intelligence report schema', () => {
  it('accepts a valid daily report', () => {
    const validDaily = daily();

    expect(validateOpportunityReport(validDaily, new Set(evidenceUrls))).toEqual({
      ok: true,
      value: validDaily,
    });
  });

  it('rejects more than five daily cards', () => {
    expect(validateOpportunityReport(daily({
      items: Array.from({ length: 6 }, (_, index) => insight({ id: `opportunity-${index}` })),
    })).ok).toBe(false);
  });

  it('rejects a card without primary evidence', () => {
    expect(validateOpportunityReport(daily({
      items: [insight({ sources: [
        { ...insight().sources[0], primary: false },
        insight().sources[1],
      ] })],
    })).ok).toBe(false);
  });

  it('rejects duplicate insight IDs', () => {
    expect(validateOpportunityReport(daily({ items: [insight(), insight()] })).ok).toBe(false);
  });

  it('rejects non-HTTPS evidence URLs', () => {
    expect(validateOpportunityReport(daily({
      items: [insight({ sources: [{ ...insight().sources[0], url: 'http://primary.example.com/announcement' }] })],
    })).ok).toBe(false);
  });

  it('rejects evidence URLs outside the allow-list', () => {
    expect(validateOpportunityReport(daily(), new Set([evidenceUrls[0]])).ok).toBe(false);
  });

  it('rejects duplicate source URLs inside one insight', () => {
    const primary = insight().sources[0];
    const result = validateOpportunityReport(daily({
      items: [insight({
        sources: [
          primary,
          { ...primary, title: 'Repeated metadata for the same URL' },
        ],
      })],
    }));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain('items[0].sources: duplicate source URLs are not allowed');
    }
  });

  it('rejects every tier-three source in a generated report', () => {
    expect(validateOpportunityReport(daily({
      items: [insight({
        sources: [
          insight().sources[0],
          { ...insight().sources[1], tier: 3 },
        ],
      })],
    })).ok).toBe(false);
  });

  it('does not count tier-three evidence as high-confidence corroboration', () => {
    expect(validateOpportunityReport(daily({
      items: [insight({
        confidence: 'high',
        scores: { ...insight().scores, evidenceQuality: 90, overall: 90 },
        sources: [
          insight().sources[0],
          { ...insight().sources[1], tier: 3 },
        ],
      })],
    })).ok).toBe(false);
  });

  it.each([
    { field: 'verifiedFacts', override: { verifiedFacts: [] } },
    { field: 'topics', override: { topics: [] } },
  ])('rejects an empty $field array', ({ override }) => {
    expect(validateOpportunityReport(daily({
      items: [insight(override)],
    })).ok).toBe(false);
  });

  it('rejects sources published outside the declared report window', () => {
    const result = validateOpportunityReport(daily({
      items: [insight({
        sources: [
          { ...insight().sources[0], publishedAt: '2026-07-28T07:59:59.999Z' },
          insight().sources[1],
        ],
      })],
    }));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain('items[0].sources[0].publishedAt: must be inside the report window');
    }
  });

  it('rejects impractically long strings and oversized nested arrays', () => {
    const result = validateOpportunityReport(daily({
      model: 'm'.repeat(101),
      items: [insight({
        title: 't'.repeat(241),
        verifiedFacts: Array.from({ length: 7 }, () => 'fact'),
        topics: Array.from({ length: 11 }, (_, index) => `topic-${index}`),
        sources: Array.from({ length: 7 }, (_, index) => ({
          ...insight().sources[index % 2],
          url: `https://primary.example.com/source-${index}`,
          domain: 'primary.example.com',
        })),
      })],
    }));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(expect.arrayContaining([
        expect.stringContaining('model'),
        expect.stringContaining('items[0].title'),
        expect.stringContaining('items[0].verifiedFacts'),
        expect.stringContaining('items[0].topics'),
        expect.stringContaining('items[0].sources'),
      ]));
    }
  });

  it('rejects high-confidence cards without independent corroboration', () => {
    expect(validateOpportunityReport(daily({
      items: [insight({
        confidence: 'high',
        scores: { ...insight().scores, evidenceQuality: 90, overall: 90 },
        sources: [insight().sources[0]],
      })],
    })).ok).toBe(false);
  });

  it('rejects a tier-one primary alone when it is not explicitly trusted', () => {
    const primaryDocumentation = 'https://www.docs.example.com/release-notes';
    expect(validateOpportunityReport(daily({
      items: [insight({
        confidence: 'high',
        scores: { ...insight().scores, evidenceQuality: 90, overall: 90 },
        sources: [{ ...insight().sources[0], url: primaryDocumentation, domain: 'docs.example.com', tier: 1 }],
      })],
    })).ok).toBe(false);
  });

  it('accepts a tier-one primary alone when its HTTPS URL is explicitly trusted', () => {
    const primaryDocumentation = 'https://www.docs.example.com/release-notes';
    const report = daily({
      items: [insight({
        confidence: 'high',
        scores: { ...insight().scores, evidenceQuality: 90, overall: 90 },
        sources: [{ ...insight().sources[0], url: primaryDocumentation, domain: 'docs.example.com', tier: 1 }],
      })],
    });

    expect(validateOpportunityReport(report, undefined, new Set([primaryDocumentation]))).toEqual({
      ok: true,
      value: report,
    });
  });

  it('accepts corroborated high confidence without a trusted direct-verification URL', () => {
    const report = daily({
      items: [insight({
        confidence: 'high',
        scores: { ...insight().scores, evidenceQuality: 90, overall: 90 },
      })],
    });

    expect(validateOpportunityReport(report)).toEqual({ ok: true, value: report });
  });

  it('rejects evidence quality below the threshold', () => {
    expect(validateOpportunityReport(daily({
      items: [insight({ scores: { ...insight().scores, evidenceQuality: 59 } })],
    })).ok).toBe(false);
  });

  it('uses evidence quality rather than overall score for high confidence', () => {
    expect(validateOpportunityReport(daily({
      items: [insight({
        confidence: 'high',
        scores: { ...insight().scores, evidenceQuality: 65, overall: 90 },
      })],
    })).ok).toBe(false);
  });

  it('uses evidence quality rather than overall score for medium confidence', () => {
    expect(validateOpportunityReport(daily({
      items: [insight({
        confidence: 'medium',
        scores: { ...insight().scores, evidenceQuality: 90, overall: 75 },
      })],
    })).ok).toBe(false);
  });

  it('rejects a tier-one primary whose declared domain does not match its URL hostname', () => {
    expect(validateOpportunityReport(daily({
      items: [insight({
        confidence: 'high',
        scores: { ...insight().scores, evidenceQuality: 90, overall: 90 },
        sources: [{
          ...insight().sources[0],
          url: 'https://docs.example.com/release-notes',
          domain: 'other.example.com',
          tier: 1,
        }],
      })],
    })).ok).toBe(false);
  });

  it('rejects a source whose declared domain does not match its URL hostname', () => {
    expect(validateOpportunityReport(daily({
      items: [insight({ sources: [{
        ...insight().sources[0],
        url: 'https://evidence.example.net/announcement',
        domain: 'primary.example.com',
      }, insight().sources[1]] })],
    })).ok).toBe(false);
  });

  it('does not treat a spoofed declared domain as independent corroboration', () => {
    expect(validateOpportunityReport(daily({
      items: [insight({
        confidence: 'high',
        scores: { ...insight().scores, evidenceQuality: 90, overall: 90 },
        sources: [
          insight().sources[0],
          {
            ...insight().sources[1],
            url: 'https://primary.example.com/coverage',
            domain: 'independent.example.com',
          },
        ],
      })],
    })).ok).toBe(false);
  });

  it('rejects unknown fields and invalid score values with field-path errors', () => {
    const report = {
      ...daily(),
      extra: true,
      items: [insight({ scores: { ...insight().scores, overall: 69.5 } })],
    };
    const result = validateOpportunityReport(report);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(expect.arrayContaining([
        expect.stringContaining('extra'),
        expect.stringContaining('items[0].scores.overall'),
      ]));
    }
  });
});
