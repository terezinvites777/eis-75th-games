// src/components/layout/GameShell.tsx
// Main layout wrapper with themed header and navigation

import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Target, Users, Trophy } from 'lucide-react';
import { AnniversaryLockup } from '../brand/BrandMarks';

type Theme = 'detective' | 'command' | 'connect' | 'default';

interface GameShellProps {
  children: ReactNode;
  theme?: Theme;
  heroTitle?: string;
  heroSubtitle?: string;
  showHero?: boolean;
  showNav?: boolean;
  backPath?: string;
}

export function GameShell({
  children,
  theme = 'default',
  heroTitle,
  heroSubtitle,
  showHero = true,
  showNav = true,
  backPath,
}: GameShellProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/detective', label: 'Detective', icon: Search },
    { path: '/command', label: 'Command', icon: Target },
    { path: '/connect', label: 'Connect', icon: Users },
    { path: '/leaderboard', label: 'Scores', icon: Trophy },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-bg min-h-screen" data-theme={theme}>
      {/* Hero Header */}
      {showHero && (
        <header className="hero-strip relative">
          <div className="relative z-10 px-5 py-5">
            {backPath ? (
              <Link
                to={backPath}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-3 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
            ) : null}
            
            {heroTitle ? (
              <div className="space-y-1">
                <h1 className="hero-title text-2xl sm:text-3xl font-bold text-white">
                  {heroTitle}
                </h1>
                {heroSubtitle && (
                  <p className="hero-subtitle text-sm sm:text-base">
                    {heroSubtitle}
                  </p>
                )}
              </div>
            ) : (
              <AnniversaryLockup />
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`relative z-10 ${showNav ? 'pb-24' : ''}`}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/60 safe-area-bottom">
          <div className="max-w-lg mx-auto flex justify-around items-center py-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive(path)
                    ? 'text-[var(--theme-primary,var(--cdc-blue))] bg-[var(--theme-surface,rgba(0,87,184,0.08))]'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={22} strokeWidth={isActive(path) ? 2.5 : 2} />
                <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

export default GameShell;
