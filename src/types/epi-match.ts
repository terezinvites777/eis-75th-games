// src/types/epi-match.ts

export interface MatchPair {
  id: string;
  cardA: { label: string; category: string };
  cardB: { label: string; category: string };
}

export interface MatchDeck {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gridCols: number;
  gridRows: number;
  timerSeconds: number;
  mutationIntervalSeconds: number;
  pairs: MatchPair[];
}

export interface MatchCard {
  id: string;
  pairId: string;
  label: string;
  category: string;
  side: 'A' | 'B';
  state: 'face-down' | 'face-up' | 'matched';
  gridPosition: number;
}

export type MatchPhase = 'attract' | 'deck-select' | 'preview' | 'playing' | 'mutation' | 'complete';
