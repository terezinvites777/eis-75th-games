// src/data/predict-schedule.ts
// Progressive data release system for Predict the Outbreak - tied to EIS Conference 2026

import type { DataPoint } from '../types/predict';

// Dev mode for testing - set to true to enable time controls
export const DEV_MODE = true;

// Conference dates (April 28 - May 1, 2026)
export const CONFERENCE_START = new Date('2026-04-28T09:00:00-04:00'); // EDT
export const CONFERENCE_END = new Date('2026-05-01T17:00:00-04:00');

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

  // Progressive reveals
  data_releases: {
    day: number;
    time: 'am' | 'pm';
    release_date: Date;
    weeks_visible: number;
  }[];

  // Final reveal
  results_reveal: Date;

  // Epidemiological context
  r0_estimate: number;
  transmission_route: string;
  incubation_period: string;
}

// Conference Challenge - Mystery Outbreak 2026
export const MYSTERY_OUTBREAK_2026: PredictChallenge = {
  id: 'mystery-2026',
  title: 'Mystery Outbreak 2026',
  description: 'A novel respiratory pathogen is spreading in a metropolitan area. New surveillance data will be released throughout the conference. Can you predict how this outbreak will unfold?',
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

  data_releases: [
    // Monday April 28
    { day: 1, time: 'am', release_date: new Date('2026-04-28T09:00:00-04:00'), weeks_visible: 3 },
    { day: 1, time: 'pm', release_date: new Date('2026-04-28T14:00:00-04:00'), weeks_visible: 4 },
    // Tuesday April 29
    { day: 2, time: 'am', release_date: new Date('2026-04-29T09:00:00-04:00'), weeks_visible: 5 },
    { day: 2, time: 'pm', release_date: new Date('2026-04-29T14:00:00-04:00'), weeks_visible: 6 },
    // Wednesday April 30
    { day: 3, time: 'am', release_date: new Date('2026-04-30T09:00:00-04:00'), weeks_visible: 7 },
    { day: 3, time: 'pm', release_date: new Date('2026-04-30T14:00:00-04:00'), weeks_visible: 8 },
    // Thursday May 1
    { day: 4, time: 'am', release_date: new Date('2026-05-01T09:00:00-04:00'), weeks_visible: 9 },
  ],

  results_reveal: new Date('2026-05-01T15:00:00-04:00'),

  r0_estimate: 2.4,
  transmission_route: 'Respiratory droplets, close contact',
  incubation_period: '3-7 days',
};

// Get visible data based on current time (or dev mode day)
export function getVisibleData(challenge: PredictChallenge, overrideDay?: number): DataPoint[] {
  const now = new Date();

  // If dev mode day override is provided
  if (overrideDay !== undefined && DEV_MODE) {
    const matchingRelease = challenge.data_releases
      .filter(r => r.day <= overrideDay)
      .sort((a, b) => b.weeks_visible - a.weeks_visible)[0];

    if (!matchingRelease) {
      return challenge.full_data.slice(0, 2);
    }
    return challenge.full_data.slice(0, matchingRelease.weeks_visible);
  }

  // Find the latest released data
  const latestRelease = challenge.data_releases
    .filter(r => new Date(r.release_date) <= now)
    .sort((a, b) => b.weeks_visible - a.weeks_visible)[0];

  if (!latestRelease) {
    return challenge.full_data.slice(0, 2); // Minimum data
  }

  return challenge.full_data.slice(0, latestRelease.weeks_visible);
}

// Check if results are revealed
export function isResultsRevealed(challenge: PredictChallenge): boolean {
  return new Date() >= challenge.results_reveal;
}

// Get the current conference day (1-4)
export function getCurrentDay(): number {
  const now = new Date();

  // Before conference starts
  if (now < CONFERENCE_START) return 1;

  // After conference ends
  if (now >= CONFERENCE_END) return 4;

  // During conference - calculate day
  const daysSinceStart = Math.floor(
    (now.getTime() - CONFERENCE_START.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.min(4, daysSinceStart + 1);
}

// Get next data release time
export function getNextDataRelease(challenge: PredictChallenge): Date | null {
  const now = new Date();

  const nextRelease = challenge.data_releases
    .filter(r => new Date(r.release_date) > now)
    .sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())[0];

  return nextRelease ? new Date(nextRelease.release_date) : null;
}

// Get count of weeks visible for current day
export function getWeeksVisible(challenge: PredictChallenge, day: number): number {
  const matchingRelease = challenge.data_releases
    .filter(r => r.day <= day)
    .sort((a, b) => b.weeks_visible - a.weeks_visible)[0];

  return matchingRelease?.weeks_visible || 2;
}

// Calculate early submission bonus multiplier
export function getEarlySubmissionMultiplier(daySubmitted: number): number {
  switch (daySubmitted) {
    case 1: return 2.0;   // Monday: 2x points
    case 2: return 1.5;   // Tuesday: 1.5x points
    case 3: return 1.25;  // Wednesday: 1.25x points
    default: return 1.0;  // Thursday: 1x points
  }
}

// Enhanced scoring with more prediction variables
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
  earlyBonus: { points: number; multiplier: number; day: number };
  baseScore: number;
  totalScore: number;
}

export function calculateEnhancedScore(
  predicted: EnhancedPrediction,
  challenge: PredictChallenge,
  daySubmitted: number
): EnhancedScoreBreakdown {
  const actualDuration = challenge.full_data.length;

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
    earlyBonus: {
      points: 0,
      multiplier: getEarlySubmissionMultiplier(daySubmitted),
      day: daySubmitted,
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

  // Apply early submission multiplier
  breakdown.earlyBonus.points = Math.round(breakdown.baseScore * (breakdown.earlyBonus.multiplier - 1));
  breakdown.totalScore = Math.round(breakdown.baseScore * breakdown.earlyBonus.multiplier);

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

  // Estimate R0 from growth rate (simplified)
  const estimatedR0 = 1 + (weeklyGrowth / 100);

  // Determine trend
  let trend: 'accelerating' | 'steady' | 'decelerating' = 'steady';
  if (data.length >= 3) {
    const prevPrevWeek = data[data.length - 3].cases;
    const prevGrowth = prevPrevWeek > 0 ? ((prevWeek - prevPrevWeek) / prevPrevWeek) * 100 : 0;
    if (weeklyGrowth > prevGrowth + 10) trend = 'accelerating';
    else if (weeklyGrowth < prevGrowth - 10) trend = 'decelerating';
  }

  // Calculate doubling time (in weeks)
  const doublingTime = weeklyGrowth > 0 ? Math.log(2) / Math.log(1 + weeklyGrowth / 100) : null;

  return { weeklyGrowth: Math.round(weeklyGrowth), estimatedR0, trend, doublingTime };
}
