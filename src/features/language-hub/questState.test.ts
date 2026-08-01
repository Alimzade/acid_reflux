import { describe, expect, it } from 'vitest';
import { emptyDailyQuest } from './questScoring';
import {
  applyPendingQuestLeaves,
  hydratePendingQuestSnapshot,
  nextQuestOperationVersion,
  normalizeHistoryEntries,
  normalizeQuest,
  questLeafKey,
  restoreQuestLeaf,
  settlePendingQuestLeaf,
  shouldAcceptConfirmedWrite,
  shouldRevealAnswers,
  type PendingQuestLeaf,
} from './questState';

describe('quest state normalization', () => {
  it('ignores invalid history document IDs before normalizing their quests', () => {
    const validQuest = emptyDailyQuest('2026-07-30');
    const entries = normalizeHistoryEntries([
      { date: '2026-02-30', quest: validQuest },
      { date: 'not-a-date', quest: validQuest },
      { date: '2026-07-30', quest: validQuest },
    ]);

    expect(entries).toHaveLength(1);
    expect(entries[0].date).toBe('2026-07-30');
  });

  it('rejects invalid dates before selecting a normalization fallback challenge', () => {
    expect(() => normalizeQuest(null, '2026-02-30')).toThrow(RangeError);
  });

  it('sanitizes invalid quest leaf values', () => {
    const malformed = {
      players: {
        alizade: {
          moves: {
            money: { text: '', completed: 'yes' },
            health: { text: 'h'.repeat(150), completed: true },
            learning: { text: 'Learn', completed: false },
          },
          germanSentence: 's'.repeat(210),
          answerIndex: 9,
        },
      },
    };

    const result = normalizeQuest(malformed, '2026-07-30');
    expect(result.players.alizade.moves.money.text).toBe('Take one money step.');
    expect(result.players.alizade.moves.money.completed).toBe(false);
    expect(result.players.alizade.moves.health.text).toHaveLength(140);
    expect(result.players.alizade.germanSentence).toHaveLength(200);
    expect(result.players.alizade.answerIndex).toBeNull();
  });
});

describe('confirmed and optimistic quest state', () => {
  it('rolls a failed latest leaf back to the most recent confirmed value', () => {
    const confirmed = emptyDailyQuest('2026-07-30');
    confirmed.players.alizade.moves.money.text = 'Confirmed by the server';
    const pending: Record<string, PendingQuestLeaf> = {
      money: {
        date: '2026-07-30',
        version: 2,
        update: {
          type: 'moveText',
          player: 'alizade',
          move: 'money',
          value: 'Newest optimistic draft',
        },
      },
    };

    expect(applyPendingQuestLeaves(confirmed, pending, '2026-07-30').players.alizade.moves.money.text)
      .toBe('Newest optimistic draft');
    const settled = settlePendingQuestLeaf(pending, 'money', 2);
    expect(applyPendingQuestLeaves(confirmed, settled, '2026-07-30').players.alizade.moves.money.text)
      .toBe('Confirmed by the server');
  });

  it('does not let an older operation remove a newer optimistic value', () => {
    const pending: Record<string, PendingQuestLeaf> = {
      money: {
        date: '2026-07-30',
        version: 2,
        update: {
          type: 'moveText',
          player: 'alizade',
          move: 'money',
          value: 'Newest optimistic draft',
        },
      },
    };

    expect(settlePendingQuestLeaf(pending, 'money', 1)).toBe(pending);
    expect(shouldAcceptConfirmedWrite(2, 1)).toBe(false);
    expect(shouldAcceptConfirmedWrite(1, 2)).toBe(true);
  });

  it('reveals results only from two confirmed answers', () => {
    const quest = emptyDailyQuest('2026-07-30');
    quest.players.alizade.answerIndex = 1;
    expect(shouldRevealAnswers(quest.players)).toBe(false);

    quest.players.sakar.answerIndex = 2;
    expect(shouldRevealAnswers(quest.players)).toBe(true);
  });

  it('keeps operation versions monotonic per date and leaf across navigation', () => {
    const versions: Record<string, number> = {};
    const update = {
      type: 'moveText' as const,
      player: 'alizade' as const,
      move: 'money' as const,
      value: 'Draft',
    };
    const dateAKey = questLeafKey('2026-07-30', update);
    const dateBKey = questLeafKey('2026-07-29', update);

    expect(nextQuestOperationVersion(versions, dateAKey)).toBe(1);
    expect(nextQuestOperationVersion(versions, dateBKey)).toBe(1);
    expect(nextQuestOperationVersion(versions, dateAKey)).toBe(2);
  });

  it('preserves date-scoped optimistic state when leaving and returning', () => {
    const dateA = emptyDailyQuest('2026-07-30');
    const dateB = emptyDailyQuest('2026-07-29');
    const updateA = {
      type: 'moveText' as const,
      player: 'alizade' as const,
      move: 'money' as const,
      value: 'Offline A draft',
    };
    const updateB = {
      type: 'moveText' as const,
      player: 'alizade' as const,
      move: 'money' as const,
      value: 'B draft',
    };
    const keyA = questLeafKey('2026-07-30', updateA);
    const keyB = questLeafKey('2026-07-29', updateB);
    const pending: Record<string, PendingQuestLeaf> = {
      [keyA]: { date: '2026-07-30', version: 2, update: updateA },
      [keyB]: { date: '2026-07-29', version: 1, update: updateB },
    };

    expect(applyPendingQuestLeaves(dateB, pending, '2026-07-29').players.alizade.moves.money.text)
      .toBe('B draft');
    expect(applyPendingQuestLeaves(dateA, pending, '2026-07-30').players.alizade.moves.money.text)
      .toBe('Offline A draft');
    expect(settlePendingQuestLeaf(pending, keyA, 1)).toBe(pending);
    expect(settlePendingQuestLeaf(pending, keyA, 2)[keyB]).toBeDefined();
  });

  it('hydrates pending cached snapshots without confirming an unacknowledged answer', () => {
    const confirmed = emptyDailyQuest('2026-07-30');
    confirmed.players.sakar.answerIndex = 1;
    const cached = emptyDailyQuest('2026-07-30');
    cached.players.alizade.moves.money.text = 'Cached offline edit';
    cached.players.alizade.answerIndex = 2;
    cached.players.sakar.answerIndex = 1;

    const hydrated = hydratePendingQuestSnapshot(cached, confirmed);
    expect(hydrated.players.alizade.moves.money.text).toBe('Cached offline edit');
    expect(hydrated.players.alizade.answerIndex).toBeNull();
    expect(hydrated.players.sakar.answerIndex).toBe(1);
    expect(shouldRevealAnswers(hydrated.players)).toBe(false);

    const restored = restoreQuestLeaf(hydrated, confirmed, {
      type: 'moveText',
      player: 'alizade',
      move: 'money',
      value: 'Cached offline edit',
    });
    expect(restored.players.alizade.moves.money.text).toBe('Take one money step.');
  });
});
