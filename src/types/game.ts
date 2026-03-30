export type Era = '1950s' | '1980s' | '2010s';

export type GameType = 'detective' | 'command';

export type GameStatus = 'not_started' | 'in_progress' | 'completed' | 'failed';

export interface Clue {
  id: string;
  type: 'lab' | 'epi' | 'clinical' | 'environmental' | 'historical';
  title: string;
  content: string;
  revealed: boolean;
  order: number;
}

export interface DiagnosisOption {
  id: string;
  name: string;
  description: string;
  isCorrect: boolean;
}

export interface Case {
  id: string;
  era: Era;
  title: string;
  year: number;
  location: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // seconds
  basePoints: number;
  clues: Clue[];
  diagnosisOptions: DiagnosisOption[];
  correctDiagnosis: string;
  realOutcome: string;
  historicalContext: string;
  lessons: string[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  scenario: string;
  totalTurns: number;
  initialResources: MissionResources;
  events: MissionEvent[];
  outcomes: MissionOutcome[];
}

export interface MissionResources {
  budget: number;
  personnel: number;
  publicTrust: number;
  time: number;
}

export interface MissionEvent {
  id: string;
  turn: number;
  title: string;
  description: string;
  options: MissionAction[];
}

export interface MissionAction {
  id: string;
  label: string;
  description: string;
  cost: Partial<MissionResources>;
  outcomes: {
    success: { probability: number; effect: Partial<MissionResources>; message: string };
    failure: { probability: number; effect: Partial<MissionResources>; message: string };
  };
}

export interface MissionOutcome {
  condition: string;
  result: 'victory' | 'partial' | 'failure';
  message: string;
  points: number;
}

export interface GameProgress {
  id: string;
  playerId: string;
  gameType: GameType;
  itemId: string;
  status: GameStatus;
  score: number;
  timeSpentSeconds: number;
  attempts: number;
  completedAt?: Date;
  metadata?: Record<string, unknown>;
}
