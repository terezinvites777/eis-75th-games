// src/types/field-ops.ts

export interface TriageCase {
  id: string;
  patientProfile: string;
  correctBucket: 'investigate' | 'monitor' | 'rule-out';
  explanation: string;
}

export interface InvestigationStep {
  id: string;
  order: number;
  icon: string;
  label: string;
  shortDescription: string;
  hintOnWrongTap: string;
}

export interface FieldOpsScenario {
  id: string;
  name: string;
  icon: string;
  setting: string;
  pathogen: string;
  cases: TriageCase[];
  investigationContext: string;
}

export type FieldOpsPhase =
  | 'attract'
  | 'scenario-select'
  | 'triage'
  | 'triage-transition'
  | 'sequencing'
  | 'complete';

export interface TriageResult {
  caseId: string;
  chosenBucket: string;
  correct: boolean;
  offBy: number; // 0 = correct, 1 = off by 1, 2 = off by 2
}
