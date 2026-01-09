// src/types/command.ts
// Outbreak Command game types

export interface Pathogen {
  name: string;
  transmission: string;
  r0: number;
  fatality_rate: number;
}

export interface OutbreakLocation {
  state: string;
  cases: number;
  lat: number;
  lng: number;
}

export interface GameState {
  day: number;
  cases: number;
  deaths: number;
  budget: number;
  personnel: number;
  r0: number;
  actions_taken: string[];
  source_identified: boolean;
  outbreak_locations: OutbreakLocation[];
}

export interface Action {
  id: string;
  name: string;
  cost: number;
  duration: number;
  effect: string;
  description: string;
  active?: boolean;
  progress?: number;
  started_day?: number;
}

export interface GameEvent {
  day: number;
  title: string;
  description: string;
  choices?: { label: string; effect: Partial<GameState> }[];
  effect?: Partial<GameState>;
}

export interface WinConditions {
  r_below?: number;
  source_identified?: boolean;
  cases_below?: number;
}

export interface LoseConditions {
  cases_above?: number;
  budget_below?: number;
  deaths_above?: number;
}

export interface CommandScenario {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  pathogen: Pathogen;
  initial_state: Omit<GameState, 'day' | 'deaths' | 'r0' | 'actions_taken' | 'source_identified' | 'outbreak_locations'> & {
    cases: number;
    budget: number;
    personnel: number;
  };
  initial_locations: OutbreakLocation[];
  briefing: string;
  available_actions: Action[];
  events: GameEvent[];
  win_state: WinConditions;
  lose_state: LoseConditions;
}
