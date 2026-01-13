// src/pages/DetectiveGame.tsx
// Disease Detective - Full-bleed Evidence Board Layout

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Eye, Lock } from 'lucide-react';
import { EvidenceBoardLayout } from '../components/detective/EvidenceBoardLayout';
import { getCaseById } from '../data/detective';
import { DETECTIVE_PLATES } from '../data/detectivePlates';
import { useGameStore } from '../store/gameStore';

type GamePhase = 'briefing' | 'investigation' | 'diagnosis' | 'result';

export function DetectiveGame() {
  const navigate = useNavigate();
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
      <div className="eis-board" style={{ padding: 40, textAlign: 'center', color: '#d4af37' }}>
        Case not found.
      </div>
    );
  }

  const availablePoints = caseData.basePoints - pointsSpent;

  // Get clues by type
  const clinicalClues = caseData.clues.filter(c => c.type === 'clinical');
  const epiClues = caseData.clues.filter(c => c.type === 'epidemiologic');
  const envClues = caseData.clues.filter(c => c.type === 'environmental');
  const otherClues = caseData.clues.filter(c => !['clinical', 'epidemiologic', 'environmental'].includes(c.type));

  // Render a clue item
  const renderClue = (clue: typeof caseData.clues[0]) => {
    const isRevealed = revealedClues.includes(clue.id);
    return (
      <div key={clue.id} style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 13 }}>{clue.title}</div>
        {isRevealed ? (
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{clue.content}</p>
        ) : (
          <div className="locked-clue">
            <Lock size={18} className="locked-clue__icon" />
            <p className="locked-clue__text">Locked</p>
            {availablePoints >= clue.pointCost ? (
              <button className="reveal-btn" onClick={() => revealClue(clue.id)}>
                <Eye size={14} />
                Reveal ({clue.pointCost} pts)
              </button>
            ) : (
              <span style={{ fontSize: 11, opacity: 0.6 }}>Not enough points</span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <EvidenceBoardLayout
        title={caseData.title}
        subtitle={caseData.subtitle}
        year={String(caseData.year)}
        onBack={() => navigate(`/detective/${era}`)}
        timeLabel={formatTime(timeRemaining)}
        pointsLabel={String(availablePoints)}
      >
        <div className="eis-board-grid">
          {/* LEFT COLUMN: Briefing + Timeline + Objectives */}
          <section className="pinned r-1" style={{ gridColumn: '1 / span 4', gridRow: '1' }}>
            <h3 className="pinned__title">Case Briefing</h3>
            <div className="pinned__content">
              <p><strong>Good morning.</strong></p>
              <p>{caseData.briefing.content}</p>
            </div>
          </section>

          <section className="pinned r-3 pin-right" style={{ gridColumn: '1 / span 4', gridRow: '2' }}>
            <h3 className="pinned__title">Outbreak Timeline</h3>
            <div className="pinned__content">
              <p><strong>Location:</strong> {caseData.subtitle}</p>
              <p><strong>Year:</strong> {caseData.year}</p>
              {phase === 'briefing' && (
                <div style={{ marginTop: 16 }}>
                  <button
                    className="evidence-form__submit"
                    onClick={() => setPhase('investigation')}
                  >
                    Begin Investigation
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="pinned r-2" style={{ gridColumn: '1 / span 4', gridRow: '3' }}>
            <h3 className="pinned__title">Objectives</h3>
            <div className="pinned__content">
              <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {selectedPathogen ? <CheckCircle size={16} color="#16a34a" /> : <span style={{ opacity: 0.5 }}>☐</span>}
                Identify the pathogen
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {selectedSource ? <CheckCircle size={16} color="#16a34a" /> : <span style={{ opacity: 0.5 }}>☐</span>}
                Find the source/vehicle
              </p>
            </div>
          </section>

          {/* MIDDLE COLUMN: Evidence Cards */}
          <section className="pinned r-2 pin-center" style={{ gridColumn: '5 / span 4', gridRow: '1' }}>
            <h3 className="pinned__title">Clinical Presentation</h3>
            <div className="pinned__content">
              {clinicalClues.length > 0 ? (
                clinicalClues.map(renderClue)
              ) : (
                <p style={{ opacity: 0.7, fontStyle: 'italic', fontSize: 13 }}>
                  All cases reported nausea, diarrhea, and abdominal pain.
                </p>
              )}
            </div>
          </section>

          <section className="pinned taped r-4" style={{ gridColumn: '5 / span 4', gridRow: '2' }}>
            <div className="tape" />
            <h3 className="pinned__title">Epidemiologic Data</h3>
            <div className="pinned__content">
              {epiClues.length > 0 ? (
                epiClues.map(renderClue)
              ) : (
                <>
                  <p><strong>Attack Rate:</strong> ~50%</p>
                  <p><strong>Cases:</strong> {caseData.solution.totalCases || '42+ identified'}</p>
                </>
              )}
            </div>
          </section>

          <section className="pinned r-5" style={{ gridColumn: '5 / span 4', gridRow: '3' }}>
            <h3 className="pinned__title">Environmental Data</h3>
            <div className="pinned__content">
              {envClues.length > 0 ? (
                envClues.map(renderClue)
              ) : (
                <p style={{ opacity: 0.7, fontStyle: 'italic', fontSize: 13 }}>
                  Review evidence to uncover environmental factors.
                </p>
              )}
              {otherClues.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed rgba(0,0,0,0.15)' }}>
                  <p style={{ fontWeight: 600, marginBottom: 10, fontSize: 12, textTransform: 'uppercase' }}>
                    Additional Evidence:
                  </p>
                  {otherClues.map(renderClue)}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: Notes + Status + Polaroid */}
          <section className="pinned notes-paper taped tape-left r-3" style={{ gridColumn: '9 / span 4', gridRow: '1' }}>
            <div className="tape" />
            <h3 className="pinned__title">Notes</h3>
            <div className="pinned__content">
              {phase === 'briefing' && (
                <p>Read the case briefing. Note symptoms, timeline, and population.</p>
              )}
              {phase === 'investigation' && (
                <>
                  <p>Evidence: {revealedClues.length}/{caseData.clues.length}</p>
                  <p style={{ marginTop: 8 }}>Look for patterns in symptoms and exposure.</p>
                </>
              )}
              {(phase === 'diagnosis' || phase === 'result') && (
                <>
                  <p>Pathogen: {selectedPathogen ? caseData.diagnosis.pathogenOptions.find(p => p.id === selectedPathogen)?.label : '—'}</p>
                  <p>Source: {selectedSource ? caseData.diagnosis.sourceOptions.find(s => s.id === selectedSource)?.label : '—'}</p>
                </>
              )}
            </div>
          </section>

          <section className="pinned r-1" style={{ gridColumn: '9 / span 4', gridRow: '2' }}>
            <h3 className="pinned__title">Case Status</h3>
            <div className="pinned__content">
              <p><strong>Phase:</strong> {phase.charAt(0).toUpperCase() + phase.slice(1)}</p>
              <p><strong>Time:</strong> {formatTime(timeRemaining)}</p>
              <p><strong>Points:</strong> {availablePoints}</p>
              <p><strong>Clues:</strong> {revealedClues.length}/{caseData.clues.length}</p>
            </div>
          </section>

          <section className="polaroid r-4" style={{ gridColumn: '9 / span 4', gridRow: '3' }}>
            <img
              src={DETECTIVE_PLATES.evidence.src}
              alt="Case evidence"
            />
            <div className="polaroid__caption">Case #{caseData.id}</div>
          </section>

          {/* EVIDENCE BOARD FORM - spans middle columns at bottom */}
          <section className="evidence-form" style={{ gridColumn: '5 / span 4', gridRow: '4' }}>
            <h3 className="evidence-form__title">Evidence Board</h3>
            <p className="evidence-form__subtitle">Make a guess based on your evidence:</p>

            <div className="evidence-form__field">
              <label className="evidence-form__label">Outbreak source:</label>
              <select
                className="evidence-form__select"
                value={selectedPathogen || ''}
                onChange={(e) => setSelectedPathogen(e.target.value || null)}
              >
                <option value="">Select pathogen...</option>
                {caseData.diagnosis.pathogenOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="evidence-form__field">
              <label className="evidence-form__label">Exposure Vehicle:</label>
              <select
                className="evidence-form__select"
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
              className="evidence-form__submit"
              onClick={submitDiagnosis}
              disabled={!selectedPathogen || !selectedSource}
            >
              Submit Theory
            </button>
          </section>
        </div>
      </EvidenceBoardLayout>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            className="result-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="result-card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className={`result-card__icon ${isCorrect ? 'result-card__icon--success' : 'result-card__icon--fail'}`}>
                {isCorrect ? <CheckCircle size={40} /> : <XCircle size={40} />}
              </div>

              <h2 className="result-card__title" style={{ color: isCorrect ? '#16a34a' : '#dc2626' }}>
                {isCorrect ? 'Case Solved!' : 'Not Quite'}
              </h2>

              <p style={{ color: '#5a4a3a' }}>
                {isCorrect ? 'Excellent detective work!' : 'Review the evidence and try again.'}
              </p>

              <div className="result-card__score">+{score} pts</div>

              <div className="result-card__explanation">
                <p style={{ marginBottom: 8 }}><strong>Pathogen:</strong> {caseData.solution.pathogen}</p>
                <p style={{ marginBottom: 8 }}><strong>Source:</strong> {caseData.solution.source}</p>
                <p style={{ fontSize: 13 }}>{caseData.solution.explanation}</p>
              </div>

              <div className="result-card__actions">
                <button
                  className="result-card__btn result-card__btn--secondary"
                  onClick={() => navigate(`/detective/${era}`)}
                >
                  More Cases
                </button>
                <button
                  className="result-card__btn result-card__btn--primary"
                  onClick={() => navigate('/leaderboard')}
                >
                  Leaderboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default DetectiveGame;
