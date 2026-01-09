// src/types/predict.ts
// Predict the Outbreak game types

export interface DataPoint {
  week: number;
  cases: number;
  deaths?: number;
  hospitalizations?: number;
}

export interface PredictionScenario {
  id: string;
  title: string;
  description: string;
  pathogen: string;
  location: string;
  historical_data: DataPoint[];
  actual_outcome: DataPoint[];
  peak_week: number;
  total_cases: number;
}

export interface PlayerPrediction {
  player_id: string;
  scenario_id: string;
  submitted_at: string;
  predicted_peak_week: number;
  predicted_total_cases: number;
  predicted_curve: DataPoint[];
  accuracy_score?: number;
}

export interface PredictionChallenge {
  id: string;
  scenario_id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  leaderboard_visible: boolean;
}
