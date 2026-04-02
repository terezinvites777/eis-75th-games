// src/types/outbreak-tiles.ts

export interface TileItem {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface TilePrompt {
  id: string;
  round: 1 | 2 | 3;
  promptText: string;
  tiles: TileItem[];
  gridCols: number;
  timerSeconds: number;
}

export interface RoundResult {
  round: number;
  correctTaps: number;
  wrongTaps: number;
  totalCorrect: number;
  timeRemaining: number;
  score: number;
  perfect: boolean;
}

export interface TileGameState {
  phase: 'attract' | 'playing' | 'reading' | 'round-transition' | 'complete';
  currentRound: number;
  currentPrompt: TilePrompt | null;
  selectedTileIds: string[];
  wrongTapIds: string[];
  timeRemaining: number;
  score: number;
  roundResults: RoundResult[];
}
