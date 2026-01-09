// src/types/patient-zero.ts
// Where in the World is Patient Zero? types

export interface Clue {
  day: number;
  time: 'am' | 'pm';
  content: string;
  hint_level: 'vague' | 'moderate' | 'specific';
}

export interface MysteryDefinition {
  id: string;
  title: string;
  solution: {
    outbreak: string;
    year: number;
    location: string;
    pathogen: string;
    source: string;
    patient_zero_context: string;
    eis_officers_involved: string[];
  };
  clues: Clue[];
}

export interface PlayerTheory {
  player_id: string;
  mystery_id: string;
  submitted_at: string;
  updated_at?: string;
  theory: {
    outbreak_name: string;
    year: number;
    location: string;
    pathogen: string;
    source?: string;
    confidence: 'guess' | 'likely' | 'certain';
  };
  day_submitted: number;
  final_score?: number;
}

export interface ClueSchedule {
  day: number;
  time: 'am' | 'pm';
  release_date: Date;
  is_released: boolean;
}
