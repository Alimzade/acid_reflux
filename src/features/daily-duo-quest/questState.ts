import { assertDateKey, isDateKey } from './dateKey';
import { emptyDailyQuest } from './questScoring';
import type {
  DailyQuestDocument,
  MoveKey,
  PlayerId,
  PlayerQuestState,
} from './types';

const players: PlayerId[] = ['alizade', 'sakar'];
const moves: MoveKey[] = ['money', 'health', 'learning'];

export function cloneQuest(quest: DailyQuestDocument): DailyQuestDocument {
  return {
    ...quest,
    players: {
      alizade: {
        ...quest.players.alizade,
        moves: {
          money: { ...quest.players.alizade.moves.money },
          health: { ...quest.players.alizade.moves.health },
          learning: { ...quest.players.alizade.moves.learning },
        },
      },
      sakar: {
        ...quest.players.sakar,
        moves: {
          money: { ...quest.players.sakar.moves.money },
          health: { ...quest.players.sakar.moves.health },
          learning: { ...quest.players.sakar.moves.learning },
        },
      },
    },
  };
}

export function normalizeQuest(value: unknown, date: string): DailyQuestDocument {
  assertDateKey(date);
  const normalized = emptyDailyQuest(date);
  if (!value || typeof value !== 'object') return normalized;

  const candidatePlayers = (value as {
    players?: Partial<Record<PlayerId, unknown>>;
  }).players;

  players.forEach((player) => {
    const candidate = candidatePlayers?.[player];
    if (!candidate || typeof candidate !== 'object') return;
    const candidatePlayer = candidate as {
      moves?: Partial<Record<MoveKey, unknown>>;
      germanSentence?: unknown;
      answerIndex?: unknown;
    };

    moves.forEach((move) => {
      const candidateMove = candidatePlayer.moves?.[move];
      if (!candidateMove || typeof candidateMove !== 'object') return;
      const moveValue = candidateMove as { text?: unknown; completed?: unknown };
      if (typeof moveValue.text === 'string' && moveValue.text.length >= 1) {
        normalized.players[player].moves[move].text = moveValue.text.slice(0, 140);
      }
      if (typeof moveValue.completed === 'boolean') {
        normalized.players[player].moves[move].completed = moveValue.completed;
      }
    });

    if (typeof candidatePlayer.germanSentence === 'string') {
      normalized.players[player].germanSentence = candidatePlayer.germanSentence.slice(0, 200);
    }
    if (
      candidatePlayer.answerIndex === null
      || (
        Number.isInteger(candidatePlayer.answerIndex)
        && Number(candidatePlayer.answerIndex) >= 0
        && Number(candidatePlayer.answerIndex) <= 3
      )
    ) {
      normalized.players[player].answerIndex = candidatePlayer.answerIndex as number | null;
    }
  });

  return normalized;
}

export interface UnnormalizedHistoryEntry {
  date: string;
  quest: unknown;
}

export interface NormalizedHistoryEntry {
  date: string;
  quest: DailyQuestDocument;
}

export function normalizeHistoryEntries(
  entries: UnnormalizedHistoryEntry[],
): NormalizedHistoryEntry[] {
  return entries.flatMap((entry) => (
    isDateKey(entry.date)
      ? [{ date: entry.date, quest: normalizeQuest(entry.quest, entry.date) }]
      : []
  ));
}

export type QuestLeafUpdate =
  | { type: 'moveText'; player: PlayerId; move: MoveKey; value: string }
  | { type: 'moveCompleted'; player: PlayerId; move: MoveKey; value: boolean }
  | { type: 'germanSentence'; player: PlayerId; value: string }
  | { type: 'answerIndex'; player: PlayerId; value: number };

export interface PendingQuestLeaf {
  date: string;
  version: number;
  update: QuestLeafUpdate;
}

export function questLeafKey(date: string, update: QuestLeafUpdate): string {
  assertDateKey(date);
  if (update.type === 'moveText') {
    return `${date}:${update.player}:${update.move}:text`;
  }
  if (update.type === 'moveCompleted') {
    return `${date}:${update.player}:${update.move}:completed`;
  }
  if (update.type === 'germanSentence') {
    return `${date}:${update.player}:sentence`;
  }
  return `${date}:${update.player}:answer`;
}

export function nextQuestOperationVersion(
  versions: Record<string, number>,
  key: string,
): number {
  const next = (versions[key] ?? 0) + 1;
  versions[key] = next;
  return next;
}

export function applyQuestLeaf(
  quest: DailyQuestDocument,
  update: QuestLeafUpdate,
): DailyQuestDocument {
  const next = cloneQuest(quest);
  if (update.type === 'moveText') {
    next.players[update.player].moves[update.move].text = update.value;
  } else if (update.type === 'moveCompleted') {
    next.players[update.player].moves[update.move].completed = update.value;
  } else if (update.type === 'germanSentence') {
    next.players[update.player].germanSentence = update.value;
  } else {
    next.players[update.player].answerIndex = update.value;
  }
  return next;
}

export function applyPendingQuestLeaves(
  confirmed: DailyQuestDocument,
  pending: Record<string, PendingQuestLeaf>,
  selectedDate: string,
): DailyQuestDocument {
  return Object.values(pending).reduce(
    (quest, leaf) => (
      leaf.date === selectedDate ? applyQuestLeaf(quest, leaf.update) : quest
    ),
    confirmed,
  );
}

export function hydratePendingQuestSnapshot(
  snapshot: DailyQuestDocument,
  confirmed: DailyQuestDocument,
): DailyQuestDocument {
  const hydrated = cloneQuest(snapshot);
  players.forEach((player) => {
    hydrated.players[player].answerIndex = confirmed.players[player].answerIndex;
  });
  return hydrated;
}

export function restoreQuestLeaf(
  quest: DailyQuestDocument,
  confirmed: DailyQuestDocument,
  update: QuestLeafUpdate,
): DailyQuestDocument {
  const restored = cloneQuest(quest);
  if (update.type === 'moveText') {
    restored.players[update.player].moves[update.move].text =
      confirmed.players[update.player].moves[update.move].text;
  } else if (update.type === 'moveCompleted') {
    restored.players[update.player].moves[update.move].completed =
      confirmed.players[update.player].moves[update.move].completed;
  } else if (update.type === 'germanSentence') {
    restored.players[update.player].germanSentence =
      confirmed.players[update.player].germanSentence;
  } else {
    restored.players[update.player].answerIndex =
      confirmed.players[update.player].answerIndex;
  }
  return restored;
}

export function settlePendingQuestLeaf(
  pending: Record<string, PendingQuestLeaf>,
  key: string,
  version: number,
): Record<string, PendingQuestLeaf> {
  if (pending[key]?.version !== version) return pending;
  const next = { ...pending };
  delete next[key];
  return next;
}

export function shouldAcceptConfirmedWrite(
  confirmedVersion: number,
  operationVersion: number,
): boolean {
  return operationVersion > confirmedVersion;
}

export function shouldRevealAnswers(
  states: Record<PlayerId, PlayerQuestState>,
): boolean {
  return players.every((player) => states[player].answerIndex !== null);
}
