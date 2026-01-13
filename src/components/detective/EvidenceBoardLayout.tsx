// src/components/detective/EvidenceBoardLayout.tsx
// Evidence board layout matching the corkboard investigation design

import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Target, Users, Trophy, Activity, TrendingUp } from 'lucide-react';

type Props = {
  title: string;
  year?: string;
  progressPct?: number;
  points?: number;
  timeLeft?: string;
  onBack?: () => void;

  // Left column
  caseBriefing: ReactNode;
  timeline: ReactNode;
  objectives: ReactNode;

  // Center top row
  clinicalCard: ReactNode;
  chartCard: ReactNode;
  menuCard: ReactNode;

  // Center bottom
  evidenceBoard: ReactNode;

  // Right column
  notes: ReactNode;
  caseStatus: ReactNode;
  polaroid?: ReactNode;
};

export function EvidenceBoardLayout(props: Props) {
  const {
    title,
    year,
    progressPct = 0,
    points = 0,
    timeLeft = '5:00',
    onBack,
    caseBriefing,
    timeline,
    objectives,
    clinicalCard,
    chartCard,
    menuCard,
    evidenceBoard,
    notes,
    caseStatus,
    polaroid,
  } = props;

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
    <div className="dd-boardPage">
      {/* Top wood header bar */}
      <header className="dd-boardTop">
        <div className="dd-boardTop__left">
          <button className="dd-topBtn" type="button" onClick={onBack}>
            ← Back
          </button>
        </div>

        <div className="dd-boardTop__center">
          <div className="dd-titlePlaque">
            <div className="dd-titlePlaque__title">
              {title}
              {year && <span className="dd-titlePlaque__year">{year}</span>}
            </div>
          </div>

          <div className="dd-progressRow">
            <span className="dd-progressLabel">Progress</span>
            <div className="dd-progressTrack">
              <div
                className="dd-progressFill"
                style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }}
              />
            </div>
            <span className="dd-progressPoints">Points: {points}</span>
          </div>
        </div>

        <div className="dd-boardTop__right">
          <div className="dd-statPill">
            <div className="dd-statPill__k">Time</div>
            <div className="dd-statPill__v">{timeLeft}</div>
          </div>
          <div className="dd-statPill">
            <div className="dd-statPill__k">Points</div>
            <div className="dd-statPill__v">{points}</div>
          </div>
        </div>
      </header>

      {/* Corkboard */}
      <main className="dd-boardWrap">
        <section className="dd-board">
          <div className="dd-boardGrid">
            {/* Left column */}
            <div className="dd-zone dd-brief">{caseBriefing}</div>
            <div className="dd-zone dd-timeline">{timeline}</div>
            <div className="dd-zone dd-objectives">{objectives}</div>

            {/* Center */}
            <div className="dd-zone dd-clinical">{clinicalCard}</div>
            <div className="dd-zone dd-chart">{chartCard}</div>
            <div className="dd-zone dd-menu">{menuCard}</div>
            <div className="dd-zone dd-evidence">{evidenceBoard}</div>

            {/* Right */}
            <div className="dd-zone dd-notes">{notes}</div>
            <div className="dd-zone dd-status">{caseStatus}</div>
            <div className="dd-zone dd-polaroid">{polaroid ?? null}</div>
          </div>
        </section>
      </main>

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
