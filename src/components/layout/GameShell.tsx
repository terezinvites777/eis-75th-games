// src/components/layout/GameShell.tsx
// Main layout wrapper with themed header and navigation

import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Target, Users, Trophy } from 'lucide-react';
import { AnniversaryLockup } from '../brand/BrandMarks';

type Theme = 'detective' | 'command' | 'connect' | 'patient-zero' | 'predict' | 'default';

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

  // Wood desk background for connect theme - use actual wood texture image
  const connectBgStyle = theme === 'connect' ? {
    backgroundImage: 'url(/images/textures/wood.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundColor: '#5a3d28',
  } : {};

  return (
    <div className="eis-bg min-h-screen" data-theme={theme} style={connectBgStyle}>
      {/* Hero Header */}
      {showHero && (
        <header className="eis-hero">
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
                <h1 className="eis-heroTitle text-2xl sm:text-3xl font-bold text-white">
                  {heroTitle}
                </h1>
                {heroSubtitle && (
                  <p className="eis-heroSub text-sm sm:text-base">
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
        <nav className="eis-nav">
          <div className="eis-navInner">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`eis-navItem ${isActive(path) ? 'active' : ''}`}
              >
                <Icon size={22} strokeWidth={isActive(path) ? 2.5 : 2} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

export default GameShell;
