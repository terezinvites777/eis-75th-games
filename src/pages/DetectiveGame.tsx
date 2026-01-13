// src/pages/DetectiveGame.tsx
// Disease Detective - Cork Board Investigation Layout

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, Eye, Lock,
  Home, Search, Target, Users, Trophy, Activity, TrendingUp
} from 'lucide-react';
import { getCaseById } from '../data/detective';
import { DETECTIVE_PLATES } from '../data/detectivePlates';
import { useGameStore } from '../store/gameStore';
import '../styles/detective-board.css';

type GamePhase = 'briefing' | 'investigation' | 'diagnosis' | 'result';

export function DetectiveGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const { era, caseId } = useParams<{ era: string; caseId: string }>();
  const { addScore } = useGameStore();

  const caseData = caseId ? getCaseById(caseId) : null;

  const [phase, setPhase] = useState<GamePhase>('briefing');
  const [timeRemaining, setTimeRemaining] = useState(caseData?.timeLimit || 300);
  const [revealedClues, setRevealedClues] = useState<string[]>([]);
  const [selectedPathogen, setSelectedPathogen] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [pointsSpent, setPointsSpent] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Navigation items
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

  useEffect(() => {
    if (phase !== 'investigation' && phase !== 'diagnosis') return;
    if (timeRemaining <= 0) {
      if (phase === 'investigation') setPhase('diagnosis');
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const revealClue = useCallback((clueId: string) => {
    const clue = caseData?.clues.find(c => c.id === clueId);
    if (!clue || revealedClues.includes(clueId)) return;
    setRevealedClues(prev => [...prev, clueId]);
    setPointsSpent(prev => prev + clue.pointCost);
  }, [caseData, revealedClues]);

  const submitDiagnosis = useCallback(() => {
    if (!caseData || !selectedPathogen || !selectedSource) return;
    const pathogenCorrect = selectedPathogen === caseData.solution.pathogenId;
    const sourceCorrect = selectedSource === caseData.solution.sourceId;
    const bothCorrect = pathogenCorrect && sourceCorrect;

    let finalScore = 0;
    if (bothCorrect) {
      finalScore = caseData.basePoints;
      const timeBonus = Math.floor((timeRemaining / caseData.timeLimit) * 100);
      finalScore += timeBonus;
      finalScore = Math.max(0, finalScore - pointsSpent);
    } else if (pathogenCorrect || sourceCorrect) {
      finalScore = Math.floor(caseData.basePoints * 0.25);
    }

    setScore(finalScore);
    setIsCorrect(bothCorrect);
    if (finalScore > 0) addScore(finalScore);
    setPhase('result');
    setShowResult(true);
  }, [caseData, selectedPathogen, selectedSource, timeRemaining, pointsSpent, addScore]);

  if (!caseData) {
    return (
      <div className="dd-board">
        <div style={{ padding: 40, textAlign: 'center', color: '#d4af37' }}>
          Case not found.
        </div>
      </div>
    );
  }

  const availablePoints = caseData.basePoints - pointsSpent;
  const progressPercent = phase === 'briefing' ? 0 :
    phase === 'investigation' ? 33 :
    phase === 'diagnosis' ? 66 : 100;

  // Era display
  const eraDisplay: Record<string, string> = {
    founding: '1950s',
    modern: '1970-90s',
    global: '2000s+',
  };

  return (
    <div className="dd-board">
      {/* Brass Header */}
      <header className="dd-header">
        <div className="dd-header__inner">
          <button className="dd-header__back" onClick={() => navigate(`/detective/${era}`)}>
            ← Back
          </button>

          <div className="dd-header__plaque">
            <h1 className="dd-header__title">
              {caseData.title}
              <span className="dd-header__year">{caseData.year}</span>
            </h1>
          </div>

          <div className="dd-header__stats">
            <div className="dd-statBox">
              <div className="dd-statBox__label">Time</div>
              <div className="dd-statBox__value" style={timeRemaining < 60 ? { color: '#ef4444' } : undefined}>
                {formatTime(timeRemaining)}
              </div>
            </div>
            <div className="dd-statBox">
              <div className="dd-statBox__label">Points</div>
              <div className="dd-statBox__value">{availablePoints}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="dd-progressBar">
        <div className="dd-progressBar__inner">
          <span className="dd-progressBar__label">Progress: {progressPercent}%</span>
          <div className="dd-progressBar__track">
            <div className="dd-progressBar__fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="dd-progressBar__label">Points: {availablePoints}</span>
        </div>
      </div>

      {/* Cork Board */}
      <div className="dd-corkBoard">
        <div className="dd-boardGrid">
          {/* Left Column - Case Briefing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="dd-pinnedCard" style={{ '--rotate': '-1deg' } as React.CSSProperties}>
              <h3 className="dd-pinnedCard__title">Case Briefing</h3>
              <div className="dd-pinnedCard__content">
                <p style={{ marginBottom: 12 }}>
                  <strong>From:</strong> {caseData.briefing.from}
                </p>
                <p>{caseData.briefing.content}</p>
              </div>
            </div>

            {/* Outbreak Timeline */}
            <div className="dd-pinnedCard dd-pinnedCard--clip" style={{ '--rotate': '0.5deg' } as React.CSSProperties}>
              <h3 className="dd-pinnedCard__title">Outbreak Timeline</h3>
              <div className="dd-pinnedCard__content">
                <p><strong>Location:</strong> {caseData.subtitle}</p>
                <p><strong>Year:</strong> {caseData.year}</p>
                <p><strong>Era:</strong> {eraDisplay[caseData.era]}</p>
              </div>
            </div>

            {/* Objectives */}
            <div className="dd-pinnedCard" style={{ '--rotate': '-0.5deg' } as React.CSSProperties}>
              <h3 className="dd-pinnedCard__title">Objectives</h3>
              <div className="dd-pinnedCard__content">
                <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {phase === 'result' ? <CheckCircle size={16} color="#16a34a" /> : <span>☐</span>}
                  Identify the pathogen
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {phase === 'result' ? <CheckCircle size={16} color="#16a34a" /> : <span>☐</span>}
                  Find the source
                </p>
              </div>
            </div>
          </div>

          {/* Center Column - Evidence & Answer Board */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Evidence Cards */}
            <div className="dd-evidenceGrid">
              {caseData.clues.map((clue, index) => {
                const isRevealed = revealedClues.includes(clue.id);
                const rotations = ['-2deg', '1deg', '-1deg', '2deg', '0deg'];

                return (
                  <div
                    key={clue.id}
                    className={`dd-evidenceCard ${!isRevealed ? 'dd-evidenceCard--locked' : ''}`}
                    style={{ '--rotate': rotations[index % rotations.length] } as React.CSSProperties}
                    onClick={() => !isRevealed && revealClue(clue.id)}
                  >
                    <div className="dd-evidenceCard__category">
                      {clue.type.toUpperCase()}
                    </div>
                    <div className="dd-evidenceCard__title">{clue.title}</div>

                    {isRevealed ? (
                      <div className="dd-evidenceCard__preview">{clue.content}</div>
                    ) : (
                      <div className="dd-evidenceCard__locked">
                        <Lock size={24} style={{ opacity: 0.5, marginBottom: 8 }} />
                        <p style={{ fontSize: 12, marginBottom: 12 }}>This clue is locked</p>
                        {availablePoints >= clue.pointCost ? (
                          <button className="dd-evidenceCard__cost">
                            <Eye size={14} />
                            Reveal ({clue.pointCost} pts)
                          </button>
                        ) : (
                          <p style={{ fontSize: 11, color: '#999' }}>Not enough points</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Evidence Board - Answer Section */}
            {(phase === 'investigation' || phase === 'diagnosis') && (
              <div className="dd-answerBoard">
                <h3 className="dd-answerBoard__title">Evidence Board</h3>
                <p style={{ textAlign: 'center', marginBottom: 16, fontSize: 14, color: '#5a4a3a' }}>
                  Make a guess based on your evidence:
                </p>

                <div className="dd-answerBoard__field">
                  <label className="dd-answerBoard__label">Outbreak source:</label>
                  <select
                    className="dd-answerBoard__select"
                    value={selectedPathogen || ''}
                    onChange={(e) => setSelectedPathogen(e.target.value || null)}
                  >
                    <option value="">Select pathogen...</option>
                    {caseData.diagnosis.pathogenOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="dd-answerBoard__field">
                  <label className="dd-answerBoard__label">Exposure Vehicle:</label>
                  <select
                    className="dd-answerBoard__select"
                    value={selectedSource || ''}
                    onChange={(e) => setSelectedSource(e.target.value || null)}
                  >
                    <option value="">Select source...</option>
                    {caseData.diagnosis.sourceOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  className="dd-answerBoard__submit"
                  onClick={submitDiagnosis}
                  disabled={!selectedPathogen || !selectedSource}
                >
                  Submit Theory
                </button>
              </div>
            )}

            {/* Start Investigation Button (Briefing phase) */}
            {phase === 'briefing' && (
              <div style={{ textAlign: 'center' }}>
                <button
                  className="dd-answerBoard__submit"
                  style={{ maxWidth: 300 }}
                  onClick={() => setPhase('investigation')}
                >
                  Begin Investigation
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Notes & Photos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Notes */}
            <div className="dd-notes" style={{ transform: 'rotate(1deg)' }}>
              <h3 className="dd-notes__title">Notes</h3>
              <div className="dd-notes__content">
                {phase === 'briefing' && (
                  <p>Read the case briefing carefully. Note key symptoms and timeline.</p>
                )}
                {phase === 'investigation' && (
                  <>
                    <p>Evidence reviewed: {revealedClues.length}/{caseData.clues.length}</p>
                    <p style={{ marginTop: 12 }}>Look for patterns in symptoms, timing, and exposure.</p>
                  </>
                )}
                {phase === 'diagnosis' && (
                  <>
                    <p>Selected pathogen: {selectedPathogen ? caseData.diagnosis.pathogenOptions.find(p => p.id === selectedPathogen)?.label : '—'}</p>
                    <p>Selected source: {selectedSource ? caseData.diagnosis.sourceOptions.find(s => s.id === selectedSource)?.label : '—'}</p>
                  </>
                )}
                {phase === 'result' && (
                  <p>Case {isCorrect ? 'solved!' : 'reviewed.'} Check your results.</p>
                )}
              </div>
            </div>

            {/* Status Card */}
            <div className="dd-pinnedCard dd-pinnedCard--tape" style={{ '--rotate': '-2deg' } as React.CSSProperties}>
              <h3 className="dd-pinnedCard__title">Case Status</h3>
              <div className="dd-pinnedCard__content">
                <p><strong>Phase:</strong> {phase.charAt(0).toUpperCase() + phase.slice(1)}</p>
                <p><strong>Time:</strong> {formatTime(timeRemaining)}</p>
                <p><strong>Points:</strong> {availablePoints}</p>
                <p><strong>Clues:</strong> {revealedClues.length}/{caseData.clues.length}</p>
              </div>
            </div>

            {/* Photo placeholder */}
            <div className="dd-photo" style={{ '--rotate': '3deg' } as React.CSSProperties}>
              <img
                src={DETECTIVE_PLATES.evidence.src}
                alt="Case evidence"
                className="dd-photo__img"
              />
              <div className="dd-photo__caption">Case #{caseData.id}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Overlay */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            className="dd-resultOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="dd-resultCard"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className={`dd-resultCard__icon ${isCorrect ? 'dd-resultCard__icon--success' : 'dd-resultCard__icon--fail'}`}>
                {isCorrect ? <CheckCircle size={48} /> : <XCircle size={48} />}
              </div>

              <h2 className="dd-resultCard__title" style={{ color: isCorrect ? '#16a34a' : '#dc2626' }}>
                {isCorrect ? 'Case Solved!' : 'Not Quite'}
              </h2>

              <p style={{ color: '#5a4a3a' }}>
                {isCorrect ? 'Excellent detective work!' : 'Review the evidence and try again.'}
              </p>

              <div className="dd-resultCard__score">+{score} pts</div>

              <div style={{ textAlign: 'left', marginTop: 20, padding: 16, background: 'rgba(0,0,0,0.05)', borderRadius: 8 }}>
                <p style={{ marginBottom: 8 }}><strong>Pathogen:</strong> {caseData.solution.pathogen}</p>
                <p style={{ marginBottom: 8 }}><strong>Source:</strong> {caseData.solution.source}</p>
                <p style={{ fontSize: 13, color: '#666' }}>{caseData.solution.explanation}</p>
              </div>

              <div className="dd-resultCard__actions">
                <button
                  className="dd-resultCard__btn dd-resultCard__btn--secondary"
                  onClick={() => navigate(`/detective/${era}`)}
                >
                  More Cases
                </button>
                <button
                  className="dd-resultCard__btn dd-resultCard__btn--primary"
                  onClick={() => navigate('/leaderboard')}
                >
                  Leaderboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default DetectiveGame;
