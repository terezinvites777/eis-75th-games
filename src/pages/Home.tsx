// src/pages/Home.tsx
// Main landing page for EIS 75th Anniversary Games

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Target, Users, Trophy, BookOpen, ChevronRight } from 'lucide-react';
import { GameShell } from '../components/layout/GameShell';
import { EISShield } from '../components/brand/BrandMarks';
import { useGameStore } from '../store/gameStore';
import { allCases } from '../data/detective';

const gameModes = [
  {
    id: 'detective',
    title: 'Disease Detective',
    description: 'Solve historical outbreak mysteries using real EIS case studies',
    icon: Search,
    gradient: 'from-amber-500 to-yellow-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    path: '/detective',
    available: true,
  },
  {
    id: 'command',
    title: 'Outbreak Command',
    description: 'Lead response operations and make critical decisions under pressure',
    icon: Target,
    gradient: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    path: '/command',
    available: true,
  },
  {
    id: 'connect',
    title: 'EpiConnect',
    description: 'Network with fellow EIS officers and complete challenges',
    icon: Users,
    gradient: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    path: '/connect',
    available: false,
  },
];

export function Home() {
  const { completedCases, streak } = useGameStore();
  
  const totalScore = completedCases.length * 100; // Simplified for now

  return (
    <GameShell theme="default" showHero={true}>
      <div className="p-5 space-y-6">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface text-center py-8"
        >
          <div className="flex justify-center mb-4">
            <EISShield size="xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, Disease Detective
          </h2>
          <p className="text-gray-600 max-w-sm mx-auto">
            Celebrate 75 years of the Epidemic Intelligence Service by solving real outbreak mysteries
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stat-card"
          >
            <div className="stat-value text-[var(--anniv-gold)]">
              {completedCases.length}
            </div>
            <div className="stat-label">Solved</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="stat-card"
          >
            <div className="stat-value text-[var(--cdc-blue)]">
              {streak}
            </div>
            <div className="stat-label">Streak</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stat-card"
          >
            <div className="stat-value text-[var(--eis-purple)]">
              {allCases.length}
            </div>
            <div className="stat-label">Cases</div>
          </motion.div>
        </div>

        {/* Game Modes */}
        <div className="space-y-4">
          <div className="section-header">
            <span className="section-title">Choose Your Mission</span>
            <div className="section-header-line" />
          </div>

          <div className="space-y-4">
            {gameModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.1 }}
              >
                <Link 
                  to={mode.available ? mode.path : '#'} 
                  className={mode.available ? '' : 'pointer-events-none'}
                >
                  <div className={`game-card flex items-center gap-4 ${!mode.available ? 'opacity-50' : ''}`}>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${mode.gradient} shadow-lg`}>
                      <mode.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{mode.title}</h3>
                      <p className="text-sm text-gray-500">{mode.description}</p>
                      {!mode.available && (
                        <span className="text-xs text-gray-400 mt-1 inline-block">Coming soon</span>
                      )}
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/leaderboard">
              <div className="panel text-center py-5 hover:shadow-lg transition-shadow">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-[var(--anniv-gold)]" />
                <p className="font-semibold text-gray-800">Leaderboard</p>
                <p className="text-xs text-gray-500">See top detectives</p>
              </div>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Link to="/about">
              <div className="panel text-center py-5 hover:shadow-lg transition-shadow">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-[var(--cdc-blue)]" />
                <p className="font-semibold text-gray-800">About EIS</p>
                <p className="text-xs text-gray-500">75 years of service</p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-gray-400 pt-4"
        >
          Based on real EIS investigations • Educational use only
        </motion.p>
      </div>
    </GameShell>
  );
}

export default Home;
