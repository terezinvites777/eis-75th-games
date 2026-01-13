// src/components/detective/InvestigationLayout.tsx
// Two-column investigation workspace with sticky tools panel

import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Target, Users, Trophy, Activity, TrendingUp } from 'lucide-react';
import '../../styles/detective-case.css';

type Props = {
  banner: ReactNode;
  left: ReactNode;
  right: ReactNode;
  showNav?: boolean;
};

export function InvestigationLayout({ banner, left, right, showNav = true }: Props) {
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
      className="dd-casePage"
      data-theme="detective"
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
      {banner}

      <main className="dd-workspace">
        <section className="dd-workspace__left">{left}</section>
        <aside className="dd-workspace__right">
          <div className="dd-sticky">{right}</div>
        </aside>
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

export default InvestigationLayout;
