import { Era, GameType } from './game';

export interface Player {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  lastPlayedAt?: Date;
}

export interface PlayerStats {
  playerId: string;
  totalScore: number;
  gamesPlayed: number;
  gamesCompleted: number;
  detectiveCasesCompleted: number;
  commandMissionsCompleted: number;
  averageAccuracy: number;
  fastestCaseTime?: number;
  streak: number;
  longestStreak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'milestone' | 'special';
  requirement: BadgeRequirement;
}

export interface BadgeRequirement {
  type: 'games_completed' | 'score_reached' | 'streak' | 'era_completed' | 'perfect_diagnosis' | 'speed_run';
  value: number;
  gameType?: GameType;
  era?: Era;
}

export interface PlayerBadge {
  playerId: string;
  badgeId: string;
  earnedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  gamesCompleted: number;
  badges: Badge[];
}

export interface LeaderboardFilters {
  gameType?: GameType;
  era?: Era;
  timeframe: 'all_time' | 'weekly' | 'daily';
}
