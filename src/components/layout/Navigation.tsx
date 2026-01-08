import { NavLink } from 'react-router-dom';
import { Home, Search, Target, Trophy, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/detective', icon: Search, label: 'Detective' },
  { to: '/command', icon: Target, label: 'Command' },
  { to: '/leaderboard', icon: Trophy, label: 'Ranks' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex justify-around items-center py-2 px-4 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'text-cdc-blue' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cdc-blue rounded-full"
                    />
                  )}
                </motion.div>
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
