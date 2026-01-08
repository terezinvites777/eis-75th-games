import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Trophy, Search, Target, Award, Settings, LogOut } from 'lucide-react';
import { MobileFrame } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useGameStore } from '../store/gameStore';
import { formatScore, getRankTitle } from '../lib/scoring';

export function Profile() {
  const { player, playerStats, playerBadges, completedCases, completedMissions, setPlayer } = useGameStore();

  const handleSignOut = () => {
    setPlayer(null);
  };

  if (!player) {
    return (
      <MobileFrame>
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In to Play</h2>
          <p className="text-gray-500 text-center mb-6">
            Track your progress, earn badges, and compete on the leaderboard
          </p>
          <Link to="/login">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <div className="p-4 space-y-6">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cdc-blue to-cdc-teal rounded-full flex items-center justify-center mb-4">
            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt={player.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-white">
                {player.displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{player.displayName}</h1>
          <p className="text-cdc-blue font-medium">
            {getRankTitle(playerStats?.totalScore || 0)}
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center bg-gradient-to-br from-yellow-50 to-amber-50">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold text-gray-900">
                {formatScore(playerStats?.totalScore || 0)}
              </p>
              <p className="text-sm text-gray-500">Total Points</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center bg-gradient-to-br from-blue-50 to-cyan-50">
              <Search className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-gray-900">{completedCases.length}</p>
              <p className="text-sm text-gray-500">Cases Solved</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold text-gray-900">{completedMissions.length}</p>
              <p className="text-sm text-gray-500">Missions Led</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50">
              <Award className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-gray-900">{playerBadges.length}</p>
              <p className="text-sm text-gray-500">Badges Earned</p>
            </Card>
          </motion.div>
        </div>

        {/* Badges section */}
        <Card>
          <h3 className="font-bold text-gray-900 mb-4">Badges</h3>
          {playerBadges.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {playerBadges.map((badge) => (
                <div key={badge.badgeId} className="text-center">
                  <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-1">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Complete games to earn badges!
            </p>
          )}
        </Card>

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-3">
            <Settings size={20} />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut size={20} />
            Sign Out
          </Button>
        </div>
      </div>
    </MobileFrame>
  );
}
