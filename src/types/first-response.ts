// src/types/first-response.ts
// Types for the First Response game (PPE + Outbreak Investigation sequencing)

export type GameMode = 'suit-up' | 'first-response';
export type SuitUpPhase = 'donning' | 'doffing' | 'complete';

export interface SequenceCardState {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  correctOrder: number;     // 0-indexed position in correct sequence
  tappedOrder: number | null; // When the player tapped it (null = not yet tapped)
  isCorrect: boolean | null;  // null = not yet tapped
  isLocked: boolean;          // True after correct tap (card can't be untapped)
}

export interface SuitUpState {
  phase: SuitUpPhase;
  cards: SequenceCardState[];
  donningTime: number;
  doffingTime: number;
  donningErrors: number;
  doffingErrors: number;
  startTime: number | null;
  phaseStartTime: number | null;
  isComplete: boolean;
}

export interface FirstResponseState {
  scenarioId: string;
  cards: SequenceCardState[];
  timeRemaining: number;
  wrongTaps: number;
  correctFirstTaps: number;
  nextExpectedOrder: number;   // Which step number we're waiting for (0-indexed)
  startTime: number | null;
  isComplete: boolean;
}

export interface GameSummary {
  mode: GameMode;
  score: number;
  maxPossibleScore: number;
  totalTime: number;
  wrongTaps: number;
  accuracy: number;          // 0-1
  teachingMoment: string;    // Random factoid to display
}
