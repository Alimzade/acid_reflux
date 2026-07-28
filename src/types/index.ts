export interface Claim {
  id: string;
  developer: string;
  aiAgent: string;
  reservedPath: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'shelved';
  timestamp: string;
}

export interface ProjectInfo {
  name: string;
  tagline: string;
  ethos: string;
}

export interface ChessMove {
  id: string;
  moveNumber: number;
  player: string;
  aiAgent?: string;
  piece: string;
  hash: string;
  date: string;
  title: string;
  details: string[];
}

export interface Database {
  projectInfo: ProjectInfo;
  claims: Claim[];
  moves: ChessMove[];
}

export type PageView = 'pulse' | 'chess' | 'docs';
export type Language = 'en' | 'de';
