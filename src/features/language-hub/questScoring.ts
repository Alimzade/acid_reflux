import { challengeForDate } from './challengeBank';
import type { DailyQuestDocument, GermanChallenge, PlayerQuestState, QuestScore } from './types';

const moveTexts = {
  money: 'Take one money step.',
  health: 'Take one health step.',
  learning: 'Learn something new.',
} as const;

function emptyPlayer(): PlayerQuestState {
  return {
    moves: {
      money: { text: moveTexts.money, completed: false },
      health: { text: moveTexts.health, completed: false },
      learning: { text: moveTexts.learning, completed: false },
    },
    germanSentence: '',
    answerIndex: null,
  };
}

export function emptyDailyQuest(date: string): DailyQuestDocument {
  return {
    challengeId: challengeForDate(date).id,
    players: {
      alizade: emptyPlayer(),
      sakar: emptyPlayer(),
    },
  };
}

export function scorePlayer(state: PlayerQuestState, challenge: GermanChallenge): number {
  const completedMoves = Object.values(state.moves).filter((move) => move.completed).length;
  const sentencePoints = state.germanSentence.trim() ? 1 : 0;
  const answerPoints = state.answerIndex === challenge.correctOption ? 2 : 0;
  return completedMoves + sentencePoints + answerPoints;
}

function hasGermanParticipation(player: PlayerQuestState): boolean {
  return player.germanSentence.trim().length > 0 && player.answerIndex !== null;
}

export function scoreQuest(document: DailyQuestDocument, challenge: GermanChallenge): QuestScore {
  const players = {
    alizade: scorePlayer(document.players.alizade, challenge),
    sakar: scorePlayer(document.players.sakar, challenge),
  };
  const combo = Object.values(document.players).every(hasGermanParticipation) ? 2 : 0;
  const completedMoveCounts = Object.values(document.players).map(
    (player) => Object.values(player.moves).filter((move) => move.completed).length,
  );
  const everyoneParticipated = Object.values(document.players).every(hasGermanParticipation);
  const status = everyoneParticipated && completedMoveCounts.every((count) => count === 3)
    ? 'perfect'
    : everyoneParticipated && completedMoveCounts.every((count) => count >= 2)
      ? 'victory'
      : 'in-progress';

  return { players, combo, total: players.alizade + players.sakar + combo, status };
}

interface QuestDay {
  date: string;
  victorious: boolean;
}

export function calculateStreak(days: QuestDay[], today: string): number {
  const victoriousDates = new Set(days.filter((day) => day.victorious).map((day) => day.date));
  const todayMilliseconds = Date.parse(`${today}T00:00:00Z`);
  let cursor = victoriousDates.has(today) ? todayMilliseconds : todayMilliseconds - 86_400_000;
  let streak = 0;

  while (victoriousDates.has(new Date(cursor).toISOString().slice(0, 10))) {
    streak += 1;
    cursor -= 86_400_000;
  }

  return streak;
}
