// src/types/origins.ts
// Outbreak Origins — map-based investigation/deduction game

export type EvidenceType = 'clinical' | 'lab' | 'interview' | 'environmental' | 'epiData' | 'geographic';

export interface StateEvidence {
  stateId: string;
  visitNumber?: number;
  type: EvidenceType;
  icon: string;
  title: string;
  content: string;
}

export interface OutbreakStateInfo {
  stateId: string;
  initialCases: number;
  growthPerTurn: number;
}

export interface SpreadEvent {
  turn: number;
  stateId: string;
  initialCases: number;
  growthPerTurn: number;
}

export interface OriginsScenario {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  basedOn: string;
  briefing: string;
  pathogen: string;
  source: string;
  originState: string;
  initialStates: OutbreakStateInfo[];
  spreadSchedule: SpreadEvent[];
  evidence: StateEvidence[];
  optimalPath: string[];
  optimalTokens: number;
  postGameText: string;
}

export interface AnswerOption {
  id: string;
  label: string;
}

export type StateStatus = 'clear' | 'active' | 'new' | 'investigated';

export interface CollectedEvidence {
  stateId: string;
  turn: number;
  evidence: StateEvidence;
}

export type OriginsPhase = 'attract' | 'scenario-select' | 'briefing' | 'investigating' | 'spreading' | 'submitting' | 'results';
