import { describe, expect, it } from 'vitest';
import { challengeForDate, challenges } from './challengeBank';
import { calculateStreak, emptyDailyQuest, scorePlayer, scoreQuest } from './questScoring';

describe('Daily Duo Quest domain', () => {
  it('selects challenges deterministically', () => {
    expect(challengeForDate('2026-07-30')).toEqual(challengeForDate('2026-07-30'));
    expect(challenges.length).toBeGreaterThanOrEqual(14);
    Array.from({ length: 14 }, (_, offset) => `2026-07-${String(offset + 1).padStart(2, '0')}`)
      .forEach((date) => expect(challenges).toContain(challengeForDate(date)));
    challenges.forEach((challenge) => expect(challenge.options).toHaveLength(4));
  });

  it('scores a complete correct player with six XP', () => {
    const challenge = challengeForDate('2026-07-30');
    const state = emptyDailyQuest('2026-07-30').players.alizade;
    Object.values(state.moves).forEach((move) => { move.completed = true; });
    state.germanSentence = 'Wir lernen jeden Tag zusammen.';
    state.answerIndex = challenge.correctOption;
    expect(scorePlayer(state, challenge)).toBe(6);
  });

  it('awards a combo and perfect day', () => {
    const challenge = challengeForDate('2026-07-30');
    const quest = emptyDailyQuest('2026-07-30');
    Object.values(quest.players).forEach((player) => {
      Object.values(player.moves).forEach((move) => { move.completed = true; });
      player.germanSentence = 'Heute machen wir Fortschritte.';
      player.answerIndex = 0;
    });
    expect(scoreQuest(quest, challenge)).toMatchObject({ combo: 2, status: 'perfect' });
  });

  it('requires both a sentence and an answer from both players for team combo XP', () => {
    const challenge = challengeForDate('2026-07-30');
    const quest = emptyDailyQuest('2026-07-30');
    quest.players.alizade.answerIndex = challenge.correctOption;
    quest.players.sakar.answerIndex = challenge.correctOption;
    quest.players.alizade.germanSentence = 'Ich übe heute Deutsch.';

    expect(scoreQuest(quest, challenge).combo).toBe(0);

    quest.players.sakar.germanSentence = 'Wir lernen jeden Tag zusammen.';
    expect(scoreQuest(quest, challenge).combo).toBe(2);
  });

  it('requires German participation before awarding victory', () => {
    const challenge = challengeForDate('2026-07-30');
    const quest = emptyDailyQuest('2026-07-30');
    Object.values(quest.players).forEach((player) => {
      player.moves.money.completed = true;
      player.moves.health.completed = true;
    });
    expect(scoreQuest(quest, challenge).status).toBe('in-progress');
    Object.values(quest.players).forEach((player) => {
      player.germanSentence = 'Wir machen Fortschritte.';
      player.answerIndex = challenge.correctOption;
    });
    expect(scoreQuest(quest, challenge).status).toBe('victory');
  });

  it('requires German participation before awarding perfect', () => {
    const challenge = challengeForDate('2026-07-30');
    const quest = emptyDailyQuest('2026-07-30');
    Object.values(quest.players).forEach((player) => {
      Object.values(player.moves).forEach((move) => { move.completed = true; });
    });
    expect(scoreQuest(quest, challenge).status).toBe('in-progress');
    Object.values(quest.players).forEach((player) => {
      player.germanSentence = 'Wir lernen zusammen.';
      player.answerIndex = challenge.correctOption;
    });
    expect(scoreQuest(quest, challenge).status).toBe('perfect');
  });

  it('keeps yesterday streak while today is in progress', () => {
    expect(calculateStreak([
      { date: '2026-07-28', victorious: true },
      { date: '2026-07-29', victorious: true },
      { date: '2026-07-30', victorious: false },
    ], '2026-07-30')).toBe(2);
  });
});
