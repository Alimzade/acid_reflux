export type RadarKind = 'build' | 'career';
export type SourceTier = 1 | 2 | 3;
export type Confidence = 'developing' | 'medium' | 'high';

export interface OpportunityScores {
  evidenceQuality: number;
  productOpportunity: number;
  careerLeverage: number;
  urgency: number;
  novelty: number;
  overall: number;
}

export interface OpportunitySource {
  url: string;
  title: string;
  domain: string;
  publishedAt: string;
  tier: SourceTier;
  primary: boolean;
}

export interface OpportunityInsight {
  id: string;
  lane: RadarKind;
  title: string;
  verifiedFacts: string[];
  inference: string;
  whyItMatters: string;
  recommendedAction: string;
  confidence: Confidence;
  scores: OpportunityScores;
  sources: OpportunitySource[];
  topics: string[];
}

interface BaseOpportunityReport {
  schemaVersion: 1;
  generatedAt: string;
  windowStart: string;
  windowEnd: string;
  model: string;
  items: OpportunityInsight[];
  runStatus: 'fresh' | 'stale';
}

export interface DailyOpportunityReport extends BaseOpportunityReport {
  reportType: 'daily';
}

export interface WeeklyOpportunityReport extends BaseOpportunityReport {
  reportType: 'weekly';
  thesis?: string;
  watchNext?: string[];
}

export interface BootstrapOpportunityReport {
  schemaVersion: 1;
  reportType: 'daily' | 'weekly';
  items: [];
  generatedAt: null;
  runStatus: 'awaiting-first-run';
}

export type OpportunityReport = DailyOpportunityReport | WeeklyOpportunityReport;
export type OpportunityReportFile = OpportunityReport | BootstrapOpportunityReport;
