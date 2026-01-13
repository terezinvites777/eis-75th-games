// src/components/detective/DetectiveGameShell.tsx
// Main wrapper for Disease Detective pages - archive/case file aesthetic

import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, Search, Target, Users, Trophy, Activity, TrendingUp } from 'lucide-react';
import '../../styles/detective-theme.css';

interface DetectiveGameShellProps {
  title: string;
  subtitle?: string;
  stageImageUrl?: string;
  children: ReactNode;
  headerRight?: ReactNode;
  statusStrip?: ReactNode;
  backPath?: string;
  showNav?: boolean;
}

export function DetectiveGameShell({
  title,
  subtitle,
  stageImageUrl,
  headerRight,
  statusStrip,
  backPath,
  children,
  showNav = true,
}: DetectiveGameShellProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/detective', label: 'Detective', icon: Search },
    { path: '/command', label: 'Command', icon: Target },
    { path: '/connect', label: 'Connect', icon: Users },
    { path: '/patient-zero', label: 'Patient 0', icon: Activity },
    { path: '/predict', label: 'Predict', icon: TrendingUp },
    { path: '/leaderboard', label: 'Scores', icon: Trophy },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div
      data-theme="detective"
      className="detective-bg"
      style={{
        backgroundImage: `
          radial-gradient(1200px 700px at 50% 15%, rgba(255,255,255,.08), transparent 60%),
          radial-gradient(900px 500px at 50% 85%, rgba(0,0,0,.35), transparent 60%),
          url('/images/textures/wood.png')
        `,
        backgroundSize: 'auto, auto, cover',
        backgroundColor: '#3a2419',
      }}
    >
      <div className="detective-shell">
        {/* Back button + title area */}
        <div className="mb-4">
          {backPath && (
            <Link
              to={backPath}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
          )}

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="detective-title text-2xl sm:text-3xl font-bold">
                {title}
              </h1>
              {subtitle && (
                <p className="detective-subtitle mt-1 text-sm sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>
            {headerRight && (
              <div className="shrink-0">{headerRight}</div>
            )}
          </div>
        </div>

        {/* Stage plate (banner image) */}
        {stageImageUrl && (
          <div className="stage-plate">
            <div className="stage-plate-inner">
              <img
                src={stageImageUrl}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        )}

        {/* Status strip */}
        {statusStrip && (
          <div className="status-strip">{statusStrip}</div>
        )}

        {/* Main content */}
        <div className="mt-2">{children}</div>
      </div>

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

export default DetectiveGameShell;
