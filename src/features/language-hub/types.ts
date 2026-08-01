export type PlayerId = 'alizade' | 'sakar';
export type MoveKey = 'money' | 'health' | 'learning';

export interface DailyMove {
  text: string;
  completed: boolean;
}

export interface PlayerQuestState {
  moves: Record<MoveKey, DailyMove>;
  germanSentence: string;
  answerIndex: number | null;
}

export interface DailyQuestDocument {
  challengeId: string;
  players: Record<PlayerId, PlayerQuestState>;
  updatedAt?: unknown;
}

export interface GermanChallenge {
  id: string;
  phrase: string;
  meaning: string;
  hint: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export type DayStatus = 'in-progress' | 'victory' | 'perfect';

export interface QuestScore {
  players: Record<PlayerId, number>;
  combo: number;
  total: number;
  status: DayStatus;
}
