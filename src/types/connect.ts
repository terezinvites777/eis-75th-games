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

export type LookingFor = 'mentor' | 'mentee' | 'peer' | 'collaborator';

export interface AttendeeProfile {
  id: string;
  name: string;
  photo_url?: string;
  email?: string;
  role: AttendeeRole;
  eis_class_year?: number;
  home_state: string;
  assignment_location: string;
  topics: Topic[];
  bio?: string;
  looking_for?: LookingFor[];
  open_to_coffee?: boolean;
  linkedin_url?: string;
}

// User profile extends AttendeeProfile with required fields
export interface UserProfile extends Omit<AttendeeProfile, 'id' | 'email'> {
  id: string;
  email: string;
  looking_for: LookingFor[];
  open_to_coffee: boolean;
}

export interface Connection {
  id: string;
  player_id: string;
  connected_player_id: string;
  connected_at: string;
  points_earned: number;
  challenge_id?: string;
  connection_method?: 'qr_scan' | 'app_connect' | 'speed_session';
  rating?: number;
  notes?: string;
}

export interface ConnectChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  criteria_type: 'single_match' | 'cumulative';
}

export interface SpeedSession {
  id: string;
  player_id: string;
  matched_player_id: string;
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
  connected: boolean;
  skipped: boolean;
  rating?: number;
}

export interface MatchScore {
  attendeeId: string;
  score: number;
  reasons: string[];
}

export type MatchFilter = 'new-alumni' | 'incoming-2nd' | 'by-topic';

export type ConnectView = 'discover' | 'speed' | 'connections' | 'challenges' | 'qr';
