import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, User } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { formatScore } from '../../lib/scoring';

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  const { player, playerStats } = useGameStore();

  return (
    <header className="bg-gradient-to-r from-cdc-blue to-cdc-teal text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <span className="text-2xl">🔬</span>
            </motion.div>
            <div>
              <h1 className="text-lg font-bold leading-tight">EIS 75th</h1>
              <p className="text-xs text-white/80">Anniversary Games</p>
            </div>
          </Link>

          {/* Player info / Login */}
          {showNav && (
            <div className="flex items-center gap-4">
              {player ? (
                <>
                  {/* Score */}
                  <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <Trophy size={16} className="text-yellow-300" />
                    <span className="font-semibold">
                      {formatScore(playerStats?.totalScore || 0)}
                    </span>
                  </div>

                  {/* Profile link */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      {player.avatarUrl ? (
                        <img
                          src={player.avatarUrl}
                          alt={player.displayName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <span className="hidden sm:inline font-medium">
                      {player.displayName}
                    </span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
