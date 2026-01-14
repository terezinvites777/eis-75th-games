// src/pages/Leaderboard.tsx
// Leaderboard showing top Disease Detectives

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import { GameShell } from '../components/layout/GameShell';
import { useGameStore } from '../store/gameStore';
import '../styles/leaderboard.css';

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
  if (rank === 1) return 'leaderboard-card leaderboard-card--gold';
  if (rank === 2) return 'leaderboard-card leaderboard-card--silver';
  if (rank === 3) return 'leaderboard-card leaderboard-card--bronze';
  return 'leaderboard-card';
}

export function Leaderboard() {
  const [timeframe, setTimeframe] = useState<'all' | 'week' | 'today'>('all');
  const { completedCases } = useGameStore();

  const currentPlayerScore = completedCases.length * 100;

  return (
    <GameShell theme="scores" heroTitle="Leaderboard" heroSubtitle="Top Disease Detectives">
      <div className="leaderboard-wrap">
        {/* Timeframe Tabs */}
        <div className="leaderboard-tabs">
          {['all', 'week', 'today'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as typeof timeframe)}
              className={`leaderboard-tab ${timeframe === tf ? 'leaderboard-tab--active' : ''}`}
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
            className="leaderboard-your-rank"
          >
            <div className="flex items-center gap-4">
              <div className="leaderboard-your-rank__icon">
                <Users className="w-6 h-6 text-[#b8860b]" />
              </div>
              <div className="flex-1">
                <p className="leaderboard-your-rank__label">Your Ranking</p>
                <p className="leaderboard-your-rank__value">#{mockLeaderboard.length + 1} of {mockLeaderboard.length + 50}</p>
              </div>
              <div className="text-right">
                <p className="leaderboard-your-rank__score">{currentPlayerScore}</p>
                <p className="leaderboard-your-rank__pts">points</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard List */}
        <div className="leaderboard-list">
          {mockLeaderboard.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={getRankStyle(index + 1)}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="w-8 flex justify-center">
                  {getRankIcon(index + 1)}
                </div>

                {/* Avatar */}
                <div className="leaderboard-avatar">
                  <span className="leaderboard-avatar__initials">
                    {entry.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="leaderboard-name">
                    {entry.name}
                  </h3>
                  <p className="leaderboard-meta">
                    {entry.gamesCompleted} cases • {entry.streak > 0 ? `${entry.streak}🔥` : ''}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="leaderboard-score">
                    {entry.score.toLocaleString()}
                  </p>
                  <p className="leaderboard-pts">pts</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <p className="leaderboard-note">
          Rankings update in real-time during the 75th Anniversary Summit
        </p>
      </div>
    </GameShell>
  );
}

export default Leaderboard;
