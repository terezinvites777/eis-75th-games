// src/pages/DetectiveHub.tsx
// Main hub for Disease Detective game mode - Archive/Case File aesthetic

import { useNavigate, useParams } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Trophy, Flame, FolderOpen, Search, ArrowLeft, Home, Target, Users, Activity, TrendingUp } from 'lucide-react';
import { EraCard } from '../components/detective/EraCard';
import { CaseCard } from '../components/detective/CaseCard';
import { ERA_INFO, getCasesByEra, allCases } from '../data/detective';
import type { Era } from '../types/detective';
import { useGameStore } from '../store/gameStore';
import '../styles/detective-theme.css';

export function DetectiveHub() {
  const navigate = useNavigate();
  const location = useLocation();
  const { era } = useParams<{ era?: string }>();
  const { completedCases, streak } = useGameStore();

  // If an era is selected, show cases for that era
  const selectedEra = era as Era | undefined;
  const cases = selectedEra ? getCasesByEra(selectedEra) : [];
  const eraInfo = selectedEra ? ERA_INFO[selectedEra] : null;

  const handleSelectEra = (eraKey: Era) => {
    navigate(`/detective/${eraKey}`);
  };

  const handleSelectCase = (caseId: string) => {
    navigate(`/detective/${selectedEra}/${caseId}`);
  };

  // Calculate completed counts per era
  const getCompletedForEra = (eraKey: Era) => {
    return getCasesByEra(eraKey).filter(c => completedCases.includes(c.id)).length;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/detective', label: 'Detective', icon: Search },
    { path: '/command', label: 'Command', icon: Target },
    { path: '/connect', label: 'Connect', icon: Users },
    { path: '/patient-zero', label: 'Patient 0', icon: Activity },
    { path: '/predict', label: 'Predict', icon: TrendingUp },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // If era is selected, show split-screen layout
  if (selectedEra && eraInfo) {
    return (
      <div
        data-theme="detective"
        className="detective-era-page"
        style={{
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `
            radial-gradient(1200px 700px at 50% 15%, rgba(255,255,255,.08), transparent 60%),
            radial-gradient(900px 500px at 50% 85%, rgba(0,0,0,.35), transparent 60%),
            url('./images/textures/wood.png')
          `,
          backgroundSize: 'auto, auto, cover',
          backgroundColor: '#3a2419',
        }}
      >
        {/* Split Layout Container */}
        <div className="detective-split-layout">
          {/* LEFT SIDE: Large Image */}
          <div className="detective-split-left">
            <div className="detective-showcase">
              <img
                src="./images/plates/detective/DiseaseDetective.png"
                alt="Disease Detective"
                className="detective-showcase__img"
              />
              <div className="detective-showcase__overlay">
                <div className="detective-showcase__era-badge">
                  {eraInfo.title}
                </div>
                <h2 className="detective-showcase__title">{eraInfo.years}</h2>
                <p className="detective-showcase__subtitle">{eraInfo.description}</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Case List */}
          <div className="detective-split-right">
            {/* Header */}
            <div className="detective-split-header">
              <Link
                to="/detective"
                className="detective-back-btn"
              >
                <ArrowLeft size={16} />
                Back to Eras
              </Link>
              <h1 className="detective-split-title">{eraInfo.title}</h1>
            </div>

            {/* Stats */}
            <div className="detective-stats-bar">
              <div className="detective-stat">
                <Trophy size={16} />
                <span>Solved: {completedCases.length}</span>
              </div>
              <div className="detective-stat">
                <Flame size={16} />
                <span>Streak: {streak}</span>
              </div>
              <div className="detective-stat">
                <FolderOpen size={16} />
                <span>Cases: {cases.length}</span>
              </div>
            </div>

            {/* Case List */}
            <div className="detective-case-list">
              <div className="detective-case-list__header">
                <FolderOpen size={16} />
                <span>{cases.length} Cases Available</span>
              </div>
              <div className="detective-case-list__items" data-case-count={cases.length}>
                {cases.map((caseData, index) => {
                  const isCompleted = completedCases.includes(caseData.id);
                  const status = isCompleted ? 'completed' : 'available';

                  return (
                    <CaseCard
                      key={caseData.id}
                      caseData={caseData}
                      status={status}
                      onClick={() => handleSelectCase(caseData.id)}
                      index={index}
                    />
                  );
                })}
              </div>
            </div>
          </div>
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

  // Default: Era selection view — split layout matching era detail pages
  return (
    <div
      data-theme="detective"
      className="detective-era-page"
      style={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `
          radial-gradient(1200px 700px at 50% 15%, rgba(255,255,255,.08), transparent 60%),
          radial-gradient(900px 500px at 50% 85%, rgba(0,0,0,.35), transparent 60%),
          url('./images/textures/wood.png')
        `,
        backgroundSize: 'auto, auto, cover',
        backgroundColor: '#3a2419',
      }}
    >
      {/* Split Layout Container */}
      <div className="detective-split-layout">
        {/* LEFT SIDE: Showcase Image */}
        <div className="detective-split-left">
          <div className="detective-showcase">
            <img
              src="./images/plates/detective/DiseaseDetective.png"
              alt="Disease Detective"
              className="detective-showcase__img"
            />
            <div className="detective-showcase__overlay">
              <div className="detective-showcase__era-badge">
                EIS 75th Anniversary
              </div>
              <h2 className="detective-showcase__title">Disease Detective</h2>
              <p className="detective-showcase__subtitle">Solve historical outbreak mysteries using real EIS case studies</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Era Selection + How to Play */}
        <div className="detective-split-right">
          {/* Header */}
          <div className="detective-split-header">
            <Link
              to="/"
              className="detective-back-btn"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <h1 className="detective-split-title">Disease Detective</h1>
          </div>

          {/* Stats */}
          <div className="detective-stats-bar">
            <div className="detective-stat">
              <Trophy size={16} />
              <span>Solved: {completedCases.length}</span>
            </div>
            <div className="detective-stat">
              <Flame size={16} />
              <span>Streak: {streak}</span>
            </div>
            <div className="detective-stat">
              <FolderOpen size={16} />
              <span>Total Cases: {allCases.length}</span>
            </div>
          </div>

          {/* How to Play - compact */}
          <div className="detective-how-to-play">
            <div className="detective-case-list__header">
              <BookOpen size={16} />
              <span>How to Play</span>
            </div>
            <ol className="detective-how-to-play__list">
              <li>Choose an era from EIS history</li>
              <li>Review clues from real outbreak investigations</li>
              <li>Identify the pathogen AND the source</li>
              <li>Learn how EIS officers solved each case</li>
            </ol>
          </div>

          {/* Era Selection */}
          <div className="detective-case-list" style={{ flex: 1 }}>
            <div className="detective-case-list__header">
              <Search size={16} />
              <span>Choose Your Era</span>
            </div>
            <div className="detective-case-list__items">
              {(Object.keys(ERA_INFO) as Era[]).map((eraKey, index) => (
                <EraCard
                  key={eraKey}
                  era={ERA_INFO[eraKey]}
                  completedCount={getCompletedForEra(eraKey)}
                  totalCount={getCasesByEra(eraKey).length}
                  onClick={() => handleSelectEra(eraKey)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
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

export default DetectiveHub;
