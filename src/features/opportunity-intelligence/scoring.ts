import type { OpportunityInsight, OpportunityScores } from './types';

export function calculateRank(scores: OpportunityScores): number {
  return Math.round(
    scores.evidenceQuality * 0.35
    + Math.max(scores.productOpportunity, scores.careerLeverage) * 0.30
    + scores.urgency * 0.20
    + scores.novelty * 0.15,
  );
}

export function rankCards(cards: OpportunityInsight[]): OpportunityInsight[] {
  return cards
    .filter((card) => card.scores.evidenceQuality >= 60)
    .map((card, index) => {
      const overall = calculateRank(card.scores);
      return {
        card: {
          ...card,
          scores: { ...card.scores, overall },
        },
        index,
        overall,
      };
    })
    .sort((left, right) => right.overall - left.overall || left.index - right.index)
    .map(({ card }) => card);
}
