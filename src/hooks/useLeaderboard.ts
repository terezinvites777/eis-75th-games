import { useState, useEffect, useCallback } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import type { LeaderboardEntry, LeaderboardFilters } from '../types/player';

// Demo data for when Supabase isn't configured
const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, playerId: '1', displayName: 'Dr. Snow', score: 15420, gamesCompleted: 24, badges: [], avatarUrl: undefined },
  { rank: 2, playerId: '2', displayName: 'Agent Fleming', score: 12850, gamesCompleted: 19, badges: [], avatarUrl: undefined },
  { rank: 3, playerId: '3', displayName: 'Epi Explorer', score: 11200, gamesCompleted: 17, badges: [], avatarUrl: undefined },
  { rank: 4, playerId: '4', displayName: 'CDC Rookie', score: 8900, gamesCompleted: 14, badges: [], avatarUrl: undefined },
  { rank: 5, playerId: '5', displayName: 'Disease Hunter', score: 7650, gamesCompleted: 12, badges: [], avatarUrl: undefined },
];

interface UseLeaderboardReturn {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  filters: LeaderboardFilters;
  setFilters: (filters: LeaderboardFilters) => void;
}

export function useLeaderboard(initialFilters?: Partial<LeaderboardFilters>): UseLeaderboardReturn {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timeframe: 'all_time',
    ...initialFilters,
  });

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!isConfigured()) {
        // Use demo data
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
        setEntries(DEMO_LEADERBOARD);
        return;
      }

      let query = supabase
        .from('player_stats')
        .select(`
          player_id,
          total_score,
          games_completed,
          players (
            display_name,
            avatar_url
          )
        `)
        .order('total_score', { ascending: false })
        .limit(100);

      if (filters.gameType) {
        // Filter by game type if needed
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;

      const leaderboard: LeaderboardEntry[] = (data || []).map((entry, index) => ({
        rank: index + 1,
        playerId: entry.player_id,
        displayName: (entry.players as unknown as { display_name: string } | null)?.display_name || 'Anonymous',
        avatarUrl: (entry.players as unknown as { avatar_url?: string } | null)?.avatar_url,
        score: entry.total_score,
        gamesCompleted: entry.games_completed,
        badges: [],
      }));

      setEntries(leaderboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      // Fall back to demo data on error
      setEntries(DEMO_LEADERBOARD);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    entries,
    loading,
    error,
    refresh: fetchLeaderboard,
    filters,
    setFilters,
  };
}
