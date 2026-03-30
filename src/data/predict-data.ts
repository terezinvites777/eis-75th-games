// src/data/predict-data.ts
// Predict the Outbreak game data

import type { PredictionScenario } from '../types/predict';

export const predictionScenarios: PredictionScenario[] = [
  {
    id: 'seasonal-flu-2023',
    title: 'Seasonal Influenza 2023-24',
    description: 'Based on early season data, predict the peak week and total cases for this flu season.',
    pathogen: 'Influenza A/H1N1',
    location: 'United States',
    historical_data: [
      { week: 40, cases: 1200 },
      { week: 41, cases: 1450 },
      { week: 42, cases: 1890 },
      { week: 43, cases: 2340 },
      { week: 44, cases: 3100 },
      { week: 45, cases: 4200 },
      { week: 46, cases: 5800 },
      { week: 47, cases: 7500 },
    ],
    actual_outcome: [
      { week: 48, cases: 9200 },
      { week: 49, cases: 11500 },
      { week: 50, cases: 14200 },
      { week: 51, cases: 16800 },
      { week: 52, cases: 18500 },
      { week: 1, cases: 17200 },
      { week: 2, cases: 15100 },
      { week: 3, cases: 12400 },
      { week: 4, cases: 9800 },
      { week: 5, cases: 7200 },
      { week: 6, cases: 5100 },
      { week: 7, cases: 3400 },
    ],
    peak_week: 52,
    total_cases: 158000,
  },
  {
    id: 'norovirus-cruise',
    title: 'Cruise Ship Norovirus',
    description: 'A norovirus outbreak has begun on a cruise ship. Predict how it will spread among the 3,000 passengers.',
    pathogen: 'Norovirus GII.4',
    location: 'Caribbean Cruise Ship',
    historical_data: [
      { week: 1, cases: 12 },
      { week: 2, cases: 35 },
      { week: 3, cases: 89 },
    ],
    actual_outcome: [
      { week: 4, cases: 156 },
      { week: 5, cases: 234 },
      { week: 6, cases: 178 },
      { week: 7, cases: 95 },
      { week: 8, cases: 42 },
    ],
    peak_week: 5,
    total_cases: 841,
  },
  {
    id: 'measles-community',
    title: 'Measles in Undervaccinated Community',
    description: 'Measles has been introduced to a community with 15% vaccination exemption rate. Predict the outbreak trajectory.',
    pathogen: 'Measles virus',
    location: 'Pacific Northwest',
    historical_data: [
      { week: 1, cases: 1 },
      { week: 2, cases: 4 },
      { week: 3, cases: 9 },
      { week: 4, cases: 18 },
    ],
    actual_outcome: [
      { week: 5, cases: 31 },
      { week: 6, cases: 52 },
      { week: 7, cases: 78 },
      { week: 8, cases: 65 },
      { week: 9, cases: 41 },
      { week: 10, cases: 22 },
      { week: 11, cases: 8 },
    ],
    peak_week: 7,
    total_cases: 329,
  },
];

export function getScenarioById(id: string): PredictionScenario | undefined {
  return predictionScenarios.find(s => s.id === id);
}

// Calculate prediction score
export function calculatePredictionScore(
  predicted: { peak_week: number; total_cases: number },
  actual: { peak_week: number; total_cases: number }
): number {
  let score = 1000;

  // Peak week accuracy (max 500 points)
  const weekDiff = Math.abs(predicted.peak_week - actual.peak_week);
  if (weekDiff === 0) score += 0; // Already at max
  else if (weekDiff === 1) score -= 100;
  else if (weekDiff === 2) score -= 200;
  else score -= 300;

  // Total cases accuracy (max 500 points)
  const caseDiff = Math.abs(predicted.total_cases - actual.total_cases) / actual.total_cases;
  if (caseDiff <= 0.05) score -= 0; // Within 5%
  else if (caseDiff <= 0.10) score -= 100; // Within 10%
  else if (caseDiff <= 0.20) score -= 200; // Within 20%
  else if (caseDiff <= 0.30) score -= 300; // Within 30%
  else score -= 400;

  return Math.max(0, score);
}
