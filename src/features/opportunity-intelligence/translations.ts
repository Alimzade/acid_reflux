import type { Language } from '../../types';
import type { Confidence, RadarKind } from './types';

export interface OpportunityIntelligenceCopy {
  kicker: string;
  title: string;
  description: string;
  liveBadge: string;
  daily: string;
  weekly: string;
  periodSelector: string;
  buildRadar: string;
  careerRadar: string;
  whyItMatters: string;
  nextMove: string;
  evidence: string;
  modelInference: string;
  confidence: string;
  generated: string;
  awaitingFirstRun: string;
  awaitingFirstRunDescription: string;
  staleReport: string;
  staleReportDescription: string;
  overallScore: string;
  topics: string;
  sources: string;
  primarySource: string;
  corroboratingSource: string;
  tier: string;
  weeklyThesis: string;
  watchNext: string;
  disclosure: string;
  laneLabels: Record<RadarKind, string>;
  confidenceLabels: Record<Confidence, string>;
}

const COPY: Record<Language, OpportunityIntelligenceCopy> = {
  en: {
    kicker: 'Opportunity intelligence',
    title: 'Opportunity Intelligence',
    description: 'Evidence-led signals for what to build and where to grow next.',
    liveBadge: 'Live evidence-backed',
    daily: 'Daily',
    weekly: 'Weekly',
    periodSelector: 'Report period',
    buildRadar: 'Build Radar',
    careerRadar: 'Career Radar',
    whyItMatters: 'Why it matters',
    nextMove: 'Next move',
    evidence: 'Evidence',
    modelInference: 'Model inference',
    confidence: 'Confidence (not a probability)',
    generated: 'Generated',
    awaitingFirstRun: 'Awaiting first run',
    awaitingFirstRunDescription:
      'The research pipeline is ready. Its first verified opportunity report will appear here.',
    staleReport: 'Stale report',
    staleReportDescription:
      'This report is older than its refresh window. Treat it as a starting point until the next run.',
    overallScore: 'Overall score',
    topics: 'Topics',
    sources: 'Sources',
    primarySource: 'Primary',
    corroboratingSource: 'Corroborating',
    tier: 'Tier',
    weeklyThesis: 'Weekly thesis',
    watchNext: 'Watch next',
    disclosure: 'Informational only — not financial, investment, or career advice.',
    laneLabels: {
      build: 'Build',
      career: 'Career',
    },
    confidenceLabels: {
      developing: 'Developing',
      medium: 'Medium',
      high: 'High',
    },
  },
  de: {
    kicker: 'Chancen-Intelligence',
    title: 'Chancen-Radar',
    description: 'Evidenzbasierte Signale dafür, was als Nächstes gebaut werden und wo Wachstum entstehen kann.',
    liveBadge: 'Live · evidenzbasiert',
    daily: 'Täglich',
    weekly: 'Wöchentlich',
    periodSelector: 'Berichtszeitraum',
    buildRadar: 'Build-Radar',
    careerRadar: 'Karriere-Radar',
    whyItMatters: 'Warum es wichtig ist',
    nextMove: 'Nächster Schritt',
    evidence: 'Belege',
    modelInference: 'Modellschlussfolgerung',
    confidence: 'Konfidenz (keine Wahrscheinlichkeit)',
    generated: 'Erstellt',
    awaitingFirstRun: 'Erster Lauf steht aus',
    awaitingFirstRunDescription:
      'Die Recherche-Pipeline ist bereit. Der erste verifizierte Chancenbericht erscheint hier.',
    staleReport: 'Veralteter Bericht',
    staleReportDescription:
      'Dieser Bericht ist älter als sein Aktualisierungsfenster. Nutze ihn bis zum nächsten Lauf nur als Ausgangspunkt.',
    overallScore: 'Gesamtwert',
    topics: 'Themen',
    sources: 'Quellen',
    primarySource: 'Primärquelle',
    corroboratingSource: 'Bestätigung',
    tier: 'Stufe',
    weeklyThesis: 'Wöchentliche These',
    watchNext: 'Als Nächstes beobachten',
    disclosure: 'Nur zur Information — keine Finanz-, Anlage- oder Karriereberatung.',
    laneLabels: {
      build: 'Build',
      career: 'Karriere',
    },
    confidenceLabels: {
      developing: 'Im Aufbau',
      medium: 'Mittel',
      high: 'Hoch',
    },
  },
};

export function getOpportunityCopy(language: Language): OpportunityIntelligenceCopy {
  return COPY[language];
}
