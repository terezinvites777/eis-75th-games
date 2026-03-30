// src/types/epi-jeopardy.ts
// Types for the Epi Jeopardy head-to-head trivia game

export type PlayerId = 'player1' | 'player2';

export type GamePhase =
  | 'attract'           // Idle screen — "TAP TO PLAY" with two sides
  | 'ready'             // Both players tap their side to confirm ready
  | 'category-reveal'   // Category name/icon flashes on screen
  | 'question'          // Active question — players race to answer
  | 'result'            // Show who got it right, explanation
  | 'final-score';      // End screen with winner announcement

export interface PlayerAnswerState {
  selectedIndex: number | null;   // Which option they tapped (0-3), null = no answer
  answerTimeMs: number | null;    // Time from question display to tap
  isCorrect: boolean | null;      // null until answered or time expires
  pointsEarned: number;
}

export interface PlayerGameState {
  id: PlayerId;
  label: string;                  // "Player 1" / "Player 2"
  totalScore: number;
  currentStreak: number;
  longestStreak: number;
  totalCorrect: number;
  totalWrong: number;
  currentAnswer: PlayerAnswerState;
}

export interface QuestionRoundState {
  questionNumber: number;         // 1-indexed
  totalQuestions: number;
  timeRemainingMs: number;
  questionStartTime: number;      // Date.now() when question was shown
  bothAnswered: boolean;          // True when both players have locked in
}

export interface EpiJeopardyGameState {
  phase: GamePhase;
  round: QuestionRoundState | null;
  player1: PlayerGameState;
  player2: PlayerGameState;
  winner: PlayerId | 'tie' | null;  // Set at final-score phase
}
