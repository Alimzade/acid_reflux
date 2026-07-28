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

export interface Database {
  projectInfo: ProjectInfo;
  claims: Claim[];
}
