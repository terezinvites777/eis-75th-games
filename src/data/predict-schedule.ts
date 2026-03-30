// src/data/predict-schedule.ts
// Progressive data reveal system for Predict the Outbreak — single-session gameplay
// Player reveals more data at will; earlier predictions earn higher multipliers.

import type { DataPoint } from '../types/predict';

// Reveal steps: how many weeks of data are visible at each step
export const DATA_REVEAL_STEPS = [3, 5, 7, 9, 12];
export const REVEAL_MULTIPLIERS = [3.0, 2.5, 2.0, 1.5, 1.0];

export interface PredictChallenge {
  id: string;
  title: string;
  description: string;
  pathogen: string;
  location: string;
  isFeatured: boolean;

  // Full dataset (hidden until reveal)
  full_data: DataPoint[];
  peak_week: number;
  peak_cases: number;
  total_cases: number;

  // Epidemiological context
  r0_estimate: number;
  transmission_route: string;
  incubation_period: string;
}

// Mystery Outbreak 2026 — single-session challenge
export const MYSTERY_OUTBREAK_2026: PredictChallenge = {
  id: 'mystery-2026',
  title: 'Mystery Outbreak 2026',
  description: 'A novel respiratory pathogen is spreading in a metropolitan area. Study the emerging epi curve, then predict how this outbreak will unfold.',
  pathogen: 'Unknown (Respiratory)',
  location: 'Metropolitan Area, USA',
  isFeatured: true,

  full_data: [
    { week: 1, cases: 12 },
    { week: 2, cases: 28 },
    { week: 3, cases: 67 },
    { week: 4, cases: 142 },
    { week: 5, cases: 298 },
    { week: 6, cases: 534 },
    { week: 7, cases: 876 },
    { week: 8, cases: 1243 },
    { week: 9, cases: 1587 },  // Peak
    { week: 10, cases: 1402 },
    { week: 11, cases: 1089 },
    { week: 12, cases: 756 },
    { week: 13, cases: 489 },
    { week: 14, cases: 287 },
    { week: 15, cases: 156 },
    { week: 16, cases: 78 },
  ],
  peak_week: 9,
  peak_cases: 1587,
  total_cases: 9044,

  r0_estimate: 2.4,
  transmission_route: 'Respiratory droplets, close contact',
  incubation_period: '3-7 days',
};

// Get visible data based on the current reveal step
export function getVisibleData(challenge: PredictChallenge, revealStep: number): DataPoint[] {
  const weeksToShow = DATA_REVEAL_STEPS[Math.min(revealStep, DATA_REVEAL_STEPS.length - 1)];
  return challenge.full_data.filter(d => d.week <= weeksToShow);
}

// Get the score multiplier for the current reveal step
export function getMultiplier(revealStep: number): number {
  return REVEAL_MULTIPLIERS[Math.min(revealStep, REVEAL_MULTIPLIERS.length - 1)];
}

// Enhanced scoring
export interface EnhancedPrediction {
  peak_week: number;
  peak_cases: number;
  total_cases: number;
  duration_weeks: number;
  r0_estimate?: number;
}

export interface EnhancedScoreBreakdown {
  peakWeek: { points: number; maxPoints: number; diff: number; predicted: number; actual: number };
  peakCases: { points: number; maxPoints: number; percentOff: number; predicted: number; actual: number };
  totalCases: { points: number; maxPoints: number; percentOff: number; predicted: number; actual: number };
  duration: { points: number; maxPoints: number; diff: number; predicted: number; actual: number };
  r0Bonus: { points: number; maxPoints: number; diff: number; predicted?: number; actual: number };
  revealBonus: { points: number; multiplier: number; step: number };
  baseScore: number;
  totalScore: number;
}

export function calculateEnhancedScore(
  predicted: EnhancedPrediction,
  challenge: PredictChallenge,
  revealStep: number
): EnhancedScoreBreakdown {
  const actualDuration = challenge.full_data.length;
  const multiplier = getMultiplier(revealStep);

  const breakdown: EnhancedScoreBreakdown = {
    peakWeek: {
      points: 0,
      maxPoints: 200,
      diff: Math.abs(predicted.peak_week - challenge.peak_week),
      predicted: predicted.peak_week,
      actual: challenge.peak_week,
    },
    peakCases: {
      points: 0,
      maxPoints: 200,
      percentOff: Math.abs(predicted.peak_cases - challenge.peak_cases) / challenge.peak_cases,
      predicted: predicted.peak_cases,
      actual: challenge.peak_cases,
    },
    totalCases: {
      points: 0,
      maxPoints: 200,
      percentOff: Math.abs(predicted.total_cases - challenge.total_cases) / challenge.total_cases,
      predicted: predicted.total_cases,
      actual: challenge.total_cases,
    },
    duration: {
      points: 0,
      maxPoints: 100,
      diff: Math.abs(predicted.duration_weeks - actualDuration),
      predicted: predicted.duration_weeks,
      actual: actualDuration,
    },
    r0Bonus: {
      points: 0,
      maxPoints: 100,
      diff: predicted.r0_estimate ? Math.abs(predicted.r0_estimate - challenge.r0_estimate) : 999,
      predicted: predicted.r0_estimate,
      actual: challenge.r0_estimate,
    },
    revealBonus: {
      points: 0,
      multiplier,
      step: revealStep,
    },
    baseScore: 0,
    totalScore: 0,
  };

  // Peak week accuracy (max 200)
  breakdown.peakWeek.points = Math.max(0, 200 - breakdown.peakWeek.diff * 50);

  // Peak cases accuracy (max 200)
  breakdown.peakCases.points = Math.max(0, Math.round(200 * (1 - breakdown.peakCases.percentOff * 2)));

  // Total cases accuracy (max 200)
  breakdown.totalCases.points = Math.max(0, Math.round(200 * (1 - breakdown.totalCases.percentOff * 2)));

  // Duration accuracy (max 100)
  breakdown.duration.points = Math.max(0, 100 - breakdown.duration.diff * 20);

  // R0 bonus (max 100)
  if (predicted.r0_estimate !== undefined) {
    breakdown.r0Bonus.points = Math.max(0, Math.round(100 - breakdown.r0Bonus.diff * 50));
  }

  // Calculate base score
  breakdown.baseScore =
    breakdown.peakWeek.points +
    breakdown.peakCases.points +
    breakdown.totalCases.points +
    breakdown.duration.points +
    breakdown.r0Bonus.points;

  // Apply reveal multiplier
  breakdown.revealBonus.points = Math.round(breakdown.baseScore * (multiplier - 1));
  breakdown.totalScore = Math.round(breakdown.baseScore * multiplier);

  return breakdown;
}

// Get epidemiological context hints based on current data
export function getEpiContext(data: DataPoint[]): {
  weeklyGrowth: number;
  estimatedR0: number;
  trend: 'accelerating' | 'steady' | 'decelerating';
  doublingTime: number | null;
} {
  if (data.length < 2) {
    return { weeklyGrowth: 0, estimatedR0: 1, trend: 'steady', doublingTime: null };
  }

  const lastWeek = data[data.length - 1].cases;
  const prevWeek = data[data.length - 2].cases;
  const weeklyGrowth = prevWeek > 0 ? ((lastWeek - prevWeek) / prevWeek) * 100 : 0;

  const estimatedR0 = 1 + (weeklyGrowth / 100);

  let trend: 'accelerating' | 'steady' | 'decelerating' = 'steady';
  if (data.length >= 3) {
    const prevPrevWeek = data[data.length - 3].cases;
    const prevGrowth = prevPrevWeek > 0 ? ((prevWeek - prevPrevWeek) / prevPrevWeek) * 100 : 0;
    if (weeklyGrowth > prevGrowth + 10) trend = 'accelerating';
    else if (weeklyGrowth < prevGrowth - 10) trend = 'decelerating';
  }

  const doublingTime = weeklyGrowth > 0 ? Math.log(2) / Math.log(1 + weeklyGrowth / 100) : null;

  return { weeklyGrowth: Math.round(weeklyGrowth), estimatedR0, trend, doublingTime };
}
