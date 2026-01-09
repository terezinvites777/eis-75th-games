// src/types/connect.ts
// EpiConnect Speed Networking types

export type Topic =
  | 'foodborne'
  | 'respiratory'
  | 'vector_borne'
  | 'chronic_disease'
  | 'injury'
  | 'environmental'
  | 'maternal_child'
  | 'antimicrobial_resistance'
  | 'global_health';

export type AttendeeRole = 'incoming' | 'second_year' | 'alumni' | 'supervisor';

export interface AttendeeProfile {
  id: string;
  name: string;
  photo_url?: string;
  role: AttendeeRole;
  eis_class_year?: number;
  home_state: string;
  assignment_location: string;
  topics: Topic[];
  bio?: string;
}

export interface Connection {
  id: string;
  player_id: string;
  connected_player_id: string;
  connected_at: string;
  points_earned: number;
  challenge_id?: string;
}

export interface ConnectChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  criteria_type: 'single_match' | 'cumulative';
}

export type MatchFilter = 'new-alumni' | 'incoming-2nd' | 'by-topic';
