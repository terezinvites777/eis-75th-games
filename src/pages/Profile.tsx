// src/pages/Profile.tsx
// User profile page

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Trophy, Search, Target, Award, Settings, LogOut } from 'lucide-react';
import { GameShell } from '../components/layout/GameShell';
import { useGameStore } from '../store/gameStore';

export function Profile() {
  const { player, completedCases, completedMissions, streak, setPlayer } = useGameStore();

  const totalScore = completedCases.length * 100; // Simplified

  const handleSignOut = () => {
    setPlayer(null);
  };

  if (!player) {
    return (
      <GameShell theme="default" heroTitle="Your Profile">
        <div className="p-5 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In to Play</h2>
          <p className="text-gray-500 text-center mb-6 max-w-xs">
            Track your progress, earn badges, and compete on the leaderboard during the 75th Anniversary Summit
          </p>
          <Link to="/login">
            <button className="btn-emboss btn-emboss-primary btn-emboss-lg">
              Sign In with EventPower
            </button>
          </Link>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell theme="default" heroTitle="Your Profile" heroSubtitle="Disease Detective">
      <div className="p-5 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[var(--cdc-blue)] to-[var(--cdc-teal)] rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-4xl font-bold text-white">
              {player.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{player.displayName}</h1>
          <p className="text-[var(--cdc-blue)] font-medium">
            {totalScore >= 1000 ? 'Epidemic Expert' : 
             totalScore >= 500 ? 'Disease Detective' : 
             totalScore >= 100 ? 'Field Investigator' : 'Trainee'}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="panel text-center py-5"
          >
            <Trophy className="w-8 h-8 mx-auto mb-2 text-[var(--anniv-gold)]" />
            <p className="text-2xl font-bold text-gray-900">{totalScore}</p>
            <p className="text-sm text-gray-500">Total Points</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="panel text-center py-5"
          >
            <Search className="w-8 h-8 mx-auto mb-2 text-[var(--anniv-bronze)]" />
            <p className="text-2xl font-bold text-gray-900">{completedCases.length}</p>
            <p className="text-sm text-gray-500">Cases Solved</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="panel text-center py-5"
          >
            <Target className="w-8 h-8 mx-auto mb-2 text-[var(--cdc-blue)]" />
            <p className="text-2xl font-bold text-gray-900">{completedMissions.length}</p>
            <p className="text-sm text-gray-500">Missions Led</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="panel text-center py-5"
          >
            <Award className="w-8 h-8 mx-auto mb-2 text-[var(--eis-purple)]" />
            <p className="text-2xl font-bold text-gray-900">{streak}</p>
            <p className="text-sm text-gray-500">Win Streak</p>
          </motion.div>
        </div>

        {/* Badges */}
        <div className="panel">
          <h3 className="font-bold text-gray-900 mb-4">Badges</h3>
          <p className="text-gray-500 text-center py-4">
            Complete games to earn badges!
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full btn-emboss justify-start gap-3">
            <Settings size={18} />
            Settings
          </button>
          <button
            onClick={handleSignOut}
            className="w-full btn-emboss justify-start gap-3 text-red-600"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </GameShell>
  );
}

export default Profile;
