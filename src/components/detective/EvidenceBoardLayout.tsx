// src/components/detective/EvidenceBoardLayout.tsx
// Full-bleed corkboard evidence board layout

import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Target, Users, Trophy, Activity, TrendingUp } from 'lucide-react';
import '../../styles/evidence-board.css';

type Props = {
  title: string;
  subtitle?: string;
  year?: string;
  onBack?: () => void;
  timeLabel?: string;
  pointsLabel?: string;
  children: ReactNode;
};

export function EvidenceBoardLayout({
  title,
  subtitle,
  year,
  onBack,
  timeLabel = '5:00',
  pointsLabel = '0',
  children,
}: Props) {
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
    <div className="eis-board">
      <header className="eis-board__topbar">
        <button className="eis-board__back" type="button" onClick={onBack}>
          ← Back
        </button>

        <div className="eis-board__nameplate">
          <div className="eis-board__title">
            {title}
            {year && <span className="eis-board__year">{year}</span>}
          </div>
          {subtitle && <div className="eis-board__subtitle">{subtitle}</div>}
        </div>

        <div className="eis-board__hud">
          <div className="eis-board__hudbox">
            <div className="k">Time</div>
            <div className="v">{timeLabel}</div>
          </div>
          <div className="eis-board__hudbox">
            <div className="k">Points</div>
            <div className="v">{pointsLabel}</div>
          </div>
        </div>
      </header>

      <div className="eis-board__canvas">
        {children}
      </div>

      {/* Bottom Navigation */}
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
    </div>
  );
}

export default EvidenceBoardLayout;
