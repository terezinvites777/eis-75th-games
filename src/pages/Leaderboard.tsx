import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, RefreshCw } from 'lucide-react';
import { MobileFrame } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { formatScore, getRankTitle } from '../lib/scoring';
import { useGameStore } from '../store/gameStore';

type TimeFrame = 'all_time' | 'weekly' | 'daily';

const timeframes: { id: TimeFrame; label: string }[] = [
  { id: 'all_time', label: 'All Time' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'daily', label: 'Today' },
];

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
  if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
  return <span className="w-6 text-center font-bold text-gray-400">{rank}</span>;
}

function getRankStyle(rank: number) {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
  if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
  if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200';
  return 'bg-white border-gray-100';
}

export function Leaderboard() {
  const [timeframe, setTimeframe] = useState<TimeFrame>('all_time');
  const { entries, loading, error, refresh } = useLeaderboard({ timeframe });
  const { player } = useGameStore();

  return (
    <MobileFrame>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-gray-500">Top Disease Detectives</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Timeframe tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                timeframe === tf.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Leaderboard list */}
        {error && (
          <Card className="bg-red-50 border-red-200 text-center">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        <div className="space-y-2">
          {entries.map((entry, index) => {
            const isCurrentPlayer = player?.id === entry.playerId;

            return (
              <motion.div
                key={entry.playerId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  padding="sm"
                  className={`border ${getRankStyle(entry.rank)} ${
                    isCurrentPlayer ? 'ring-2 ring-cdc-blue' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div className="w-8 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {entry.avatarUrl ? (
                        <img
                          src={entry.avatarUrl}
                          alt={entry.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-gray-400">
                          {entry.displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {entry.displayName}
                        {isCurrentPlayer && (
                          <span className="ml-2 text-xs bg-cdc-blue text-white px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {getRankTitle(entry.score)} - {entry.gamesCompleted} games
                      </p>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatScore(entry.score)}
                      </p>
                      <p className="text-xs text-gray-500">pts</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {entries.length === 0 && !loading && (
          <Card className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No rankings yet. Be the first!</p>
          </Card>
        )}
      </div>
    </MobileFrame>
  );
}
