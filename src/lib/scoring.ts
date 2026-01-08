import type { Case } from '../types/game';

export interface ScoreBreakdown {
  basePoints: number;
  timeBonus: number;
  accuracyBonus: number;
  streakBonus: number;
  difficultyMultiplier: number;
  totalScore: number;
}

export function calculateDetectiveScore(
  caseData: Case,
  timeSpentSeconds: number,
  cluesRevealed: number,
  isCorrect: boolean,
  currentStreak: number
): ScoreBreakdown {
  if (!isCorrect) {
    return {
      basePoints: 0,
      timeBonus: 0,
      accuracyBonus: 0,
      streakBonus: 0,
      difficultyMultiplier: 1,
      totalScore: 0,
    };
  }

  const basePoints = caseData.basePoints;

  // Time bonus: More points for faster completion
  const timeRatio = Math.max(0, 1 - (timeSpentSeconds / caseData.timeLimit));
  const timeBonus = Math.floor(basePoints * 0.5 * timeRatio);

  // Accuracy bonus: Fewer clues revealed = higher bonus
  const clueRatio = 1 - (cluesRevealed / caseData.clues.length);
  const accuracyBonus = Math.floor(basePoints * 0.3 * clueRatio);

  // Streak bonus: Consecutive correct diagnoses
  const streakBonus = Math.min(currentStreak * 50, 250);

  // Difficulty multiplier
  const difficultyMultiplier =
    caseData.difficulty === 'hard' ? 1.5 :
    caseData.difficulty === 'medium' ? 1.2 : 1.0;

  const subtotal = basePoints + timeBonus + accuracyBonus + streakBonus;
  const totalScore = Math.floor(subtotal * difficultyMultiplier);

  return {
    basePoints,
    timeBonus,
    accuracyBonus,
    streakBonus,
    difficultyMultiplier,
    totalScore,
  };
}

export function calculateCommandScore(
  _missionId: string,
  turnsUsed: number,
  totalTurns: number,
  outcome: 'victory' | 'partial' | 'failure',
  resourcesRemaining: number
): ScoreBreakdown {
  const basePoints =
    outcome === 'victory' ? 1000 :
    outcome === 'partial' ? 500 : 0;

  // Efficiency bonus for completing faster
  const turnRatio = Math.max(0, 1 - (turnsUsed / totalTurns));
  const timeBonus = Math.floor(basePoints * 0.3 * turnRatio);

  // Resource management bonus
  const accuracyBonus = Math.floor(resourcesRemaining * 2);

  return {
    basePoints,
    timeBonus,
    accuracyBonus,
    streakBonus: 0,
    difficultyMultiplier: 1,
    totalScore: basePoints + timeBonus + accuracyBonus,
  };
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}

export function getRankTitle(totalScore: number): string {
  if (totalScore >= 10000) return 'Master Epidemiologist';
  if (totalScore >= 7500) return 'Senior Investigator';
  if (totalScore >= 5000) return 'Field Officer';
  if (totalScore >= 2500) return 'Junior Detective';
  if (totalScore >= 1000) return 'Trainee';
  return 'Rookie';
}
