import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Target, Trophy, BookOpen, ChevronRight } from 'lucide-react';
import { MobileFrame } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useGameStore } from '../store/gameStore';
import { formatScore, getRankTitle } from '../lib/scoring';

const gameModes = [
  {
    id: 'detective',
    title: 'Disease Detective',
    description: 'Solve historical outbreak mysteries using clues from real EIS investigations',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
    path: '/detective',
  },
  {
    id: 'command',
    title: 'Outbreak Command',
    description: 'Lead response operations and make critical decisions under pressure',
    icon: Target,
    color: 'from-purple-500 to-pink-500',
    path: '/command',
  },
];

export function Home() {
  const { player, playerStats, completedCases, completedMissions } = useGameStore();

  return (
    <MobileFrame>
      <div className="p-4 space-y-6">
        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            EIS 75th Anniversary
          </h1>
          <p className="text-gray-600">
            Celebrating 75 years of disease detectives
          </p>
        </motion.div>

        {/* Player stats (if logged in) */}
        {player && playerStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-cdc-blue to-cdc-teal text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Your Rank</p>
                  <h3 className="text-xl font-bold">{getRankTitle(playerStats.totalScore)}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Trophy size={16} className="text-yellow-300" />
                    <span className="font-semibold">{formatScore(playerStats.totalScore)} pts</span>
                  </div>
                </div>
                <div className="text-right text-white/80">
                  <p className="text-sm">{completedCases.length} Cases</p>
                  <p className="text-sm">{completedMissions.length} Missions</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Game modes */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Choose Your Mission</h2>

          {gameModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link to={mode.path}>
                <Card hoverable className="overflow-hidden">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${mode.color}`}>
                      <mode.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{mode.title}</h3>
                      <p className="text-sm text-gray-500">{mode.description}</p>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/leaderboard">
            <Card hoverable padding="sm" className="text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="font-medium text-gray-800">Leaderboard</p>
            </Card>
          </Link>
          <Link to="/about">
            <Card hoverable padding="sm" className="text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-cdc-blue" />
              <p className="font-medium text-gray-800">About EIS</p>
            </Card>
          </Link>
        </div>

        {/* Call to action for guests */}
        {!player && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-4"
          >
            <p className="text-gray-500 mb-4">
              Sign in to save your progress and compete on the leaderboard
            </p>
            <Link to="/login">
              <Button size="lg">Get Started</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </MobileFrame>
  );
}
