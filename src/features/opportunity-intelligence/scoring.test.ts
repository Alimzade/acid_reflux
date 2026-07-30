import { describe, expect, it } from 'vitest';
import { calculateRank, rankCards } from './scoring';
import type { OpportunityInsight, OpportunityScores } from './types';

function scores(overrides: Partial<OpportunityScores> = {}): OpportunityScores {
  return {
    evidenceQuality: 80,
    productOpportunity: 50,
    careerLeverage: 50,
    urgency: 40,
    novelty: 20,
    overall: 1,
    ...overrides,
  };
}

function card(id: string, scoreOverrides: Partial<OpportunityScores> = {}): OpportunityInsight {
  return {
    id,
    lane: 'build',
    title: id,
    verifiedFacts: ['A fact'],
    inference: 'An inference.',
    whyItMatters: 'It matters.',
    recommendedAction: 'Act on it.',
    confidence: 'medium',
    scores: scores(scoreOverrides),
    sources: [],
    topics: [],
  };
}

describe('Opportunity Intelligence scoring', () => {
  it('calculates the specified weighted rank', () => {
    expect(calculateRank(scores({
      evidenceQuality: 80,
      productOpportunity: 70,
      careerLeverage: 40,
      urgency: 60,
      novelty: 20,
    }))).toBe(64);
  });

  it('uses career leverage when it exceeds product opportunity', () => {
    const ranked = rankCards([
      card('product', { productOpportunity: 80, careerLeverage: 10 }),
      card('career', { productOpportunity: 10, careerLeverage: 90 }),
    ]);

    expect(ranked.map((item) => item.id)).toEqual(['career', 'product']);
  });

  it('recalculates model-supplied overall scores and excludes weak evidence', () => {
    const ranked = rankCards([
      card('weak-evidence', { evidenceQuality: 59, overall: 100 }),
      card('strong-evidence', { overall: 0 }),
    ]);

    expect(ranked).toHaveLength(1);
    expect(ranked[0].id).toBe('strong-evidence');
    expect(ranked[0].scores.overall).toBe(calculateRank(ranked[0].scores));
  });

  it('retains original order for tied ranks', () => {
    expect(rankCards([card('first'), card('second')]).map((item) => item.id)).toEqual(['first', 'second']);
  });
});
