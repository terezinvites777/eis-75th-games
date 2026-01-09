// src/pages/Leaderboard.tsx
// Leaderboard showing top Disease Detectives

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import { GameShell } from '../components/layout/GameShell';
import { useGameStore } from '../store/gameStore';

// Mock leaderboard data
const mockLeaderboard = [
  { id: '1', name: 'Dr. Sarah Chen', score: 2450, gamesCompleted: 8, streak: 5 },
  { id: '2', name: 'Dr. Marcus Johnson', score: 2180, gamesCompleted: 7, streak: 3 },
  { id: '3', name: 'Dr. Emily Park', score: 1890, gamesCompleted: 6, streak: 4 },
  { id: '4', name: 'Dr. James Wilson', score: 1650, gamesCompleted: 5, streak: 2 },
  { id: '5', name: 'Dr. Lisa Rodriguez', score: 1420, gamesCompleted: 5, streak: 1 },
  { id: '6', name: 'Dr. Michael Brown', score: 1200, gamesCompleted: 4, streak: 0 },
  { id: '7', name: 'Dr. Amanda Lee', score: 980, gamesCompleted: 3, streak: 2 },
  { id: '8', name: 'Dr. David Kim', score: 750, gamesCompleted: 3, streak: 1 },
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
  const [timeframe, setTimeframe] = useState<'all' | 'week' | 'today'>('all');
  const { completedCases, streak } = useGameStore();

  const currentPlayerScore = completedCases.length * 100;

  return (
    <GameShell theme="default" heroTitle="Leaderboard" heroSubtitle="Top Disease Detectives">
      <div className="p-5 space-y-6">
        {/* Timeframe Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          {['all', 'week', 'today'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as typeof timeframe)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                timeframe === tf
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tf === 'all' ? 'All Time' : tf === 'week' ? 'This Week' : 'Today'}
            </button>
          ))}
        </div>

        {/* Your Ranking */}
        {currentPlayerScore > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel-themed"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--theme-primary)]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[var(--theme-primary)]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Your Ranking</p>
                <p className="font-bold text-gray-900">#{mockLeaderboard.length + 1} of {mockLeaderboard.length + 50}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[var(--anniv-gold)]">{currentPlayerScore}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-3">
          {mockLeaderboard.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`surface p-4 border ${getRankStyle(index + 1)}`}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="w-8 flex justify-center">
                  {getRankIcon(index + 1)}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-500">
                    {entry.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {entry.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {entry.gamesCompleted} cases • {entry.streak > 0 ? `${entry.streak}🔥` : ''}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {entry.score.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">pts</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-xs text-gray-400 pt-4">
          Rankings update in real-time during the 75th Anniversary Summit
        </p>
      </div>
    </GameShell>
  );
}

export default Leaderboard;
