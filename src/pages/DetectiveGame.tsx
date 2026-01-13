// src/pages/DetectiveGame.tsx
// Disease Detective - Evidence Board Layout

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Eye, Lock } from 'lucide-react';
import { EvidenceBoardLayout } from '../components/detective/EvidenceBoardLayout';
import { getCaseById } from '../data/detective';
import { DETECTIVE_PLATES } from '../data/detectivePlates';
import { useGameStore } from '../store/gameStore';
import '../styles/detective-board.css';

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
      <div className="dd-boardPage" style={{ padding: 40, textAlign: 'center', color: '#d4af37' }}>
        Case not found.
      </div>
    );
  }

  const availablePoints = caseData.basePoints - pointsSpent;
  const progressPct = phase === 'briefing' ? 10 :
    phase === 'investigation' ? 40 :
    phase === 'diagnosis' ? 70 : 100;

  // Era display
  const eraDisplay: Record<string, string> = {
    founding: '1950s',
    modern: '1970-90s',
    global: '2000s+',
  };

  // Get clues by type for different cards
  const clinicalClues = caseData.clues.filter(c => c.type === 'clinical');
  const epiClues = caseData.clues.filter(c => c.type === 'epidemiologic');
  const envClues = caseData.clues.filter(c => c.type === 'environmental');

  // Render a clue card
  const renderClueCard = (clue: typeof caseData.clues[0], index: number) => {
    const isRevealed = revealedClues.includes(clue.id);
    return (
      <div key={clue.id} style={{ marginBottom: index < caseData.clues.length - 1 ? 12 : 0 }}>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>{clue.title}</div>
        {isRevealed ? (
          <p style={{ margin: 0, fontSize: 13 }}>{clue.content}</p>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <Lock size={18} style={{ opacity: 0.4, marginBottom: 6 }} />
            <p style={{ fontSize: 12, margin: '0 0 8px 0', opacity: 0.7 }}>Locked</p>
            {availablePoints >= clue.pointCost ? (
              <button
                onClick={() => revealClue(clue.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: 'linear-gradient(145deg, #d4af37, #b8891a)',
                  border: 'none',
                  borderRadius: 6,
                  color: '#1a0f08',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
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
        year={String(caseData.year)}
        progressPct={progressPct}
        points={availablePoints}
        timeLeft={formatTime(timeRemaining)}
        onBack={() => navigate(`/detective/${era}`)}

        caseBriefing={
          <div className="dd-paper">
            <h3 className="dd-paper__title">Case Briefing</h3>
            <div className="dd-paper__content">
              <p><strong>Good morning.</strong></p>
              <p>{caseData.briefing.content}</p>
            </div>
          </div>
        }

        timeline={
          <div className="dd-paper dd-paper--clip">
            <h3 className="dd-paper__title">Outbreak Timeline</h3>
            <div className="dd-paper__content">
              <p><strong>Location:</strong> {caseData.subtitle}</p>
              <p><strong>Year:</strong> {caseData.year}</p>
              <p><strong>Era:</strong> {eraDisplay[caseData.era]}</p>
              {phase === 'briefing' && (
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <button
                    onClick={() => setPhase('investigation')}
                    className="dd-evidenceForm__submit"
                    style={{ padding: '10px 20px', fontSize: 13 }}
                  >
                    Begin Investigation
                  </button>
                </div>
              )}
            </div>
          </div>
        }

        objectives={
          <div className="dd-paper">
            <h3 className="dd-paper__title">Objectives</h3>
            <div className="dd-paper__content">
              <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {selectedPathogen ? <CheckCircle size={16} color="#16a34a" /> : <span style={{ opacity: 0.5 }}>☐</span>}
                Identify the pathogen
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {selectedSource ? <CheckCircle size={16} color="#16a34a" /> : <span style={{ opacity: 0.5 }}>☐</span>}
                Find the source/vehicle
              </p>
            </div>
          </div>
        }

        clinicalCard={
          <div className="dd-paper">
            <h3 className="dd-paper__title">Clinical Presentation</h3>
            <div className="dd-paper__content">
              {clinicalClues.length > 0 ? (
                clinicalClues.map((clue, i) => renderClueCard(clue, i))
              ) : (
                <p style={{ opacity: 0.7, fontStyle: 'italic' }}>
                  All cases reported nausea, diarrhea, and abdominal pain. Onset was rapid.
                </p>
              )}
            </div>
          </div>
        }

        chartCard={
          <div className="dd-paper dd-paper--tape">
            <h3 className="dd-paper__title">Epidemiologic Data</h3>
            <div className="dd-paper__content">
              {epiClues.length > 0 ? (
                epiClues.map((clue, i) => renderClueCard(clue, i))
              ) : (
                <>
                  <p><strong>Attack Rate:</strong> ~50%</p>
                  <p><strong>Cases:</strong> {caseData.solution.totalCases || '42+ identified'}</p>
                  <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                    Field Interviews: In progress
                  </p>
                </>
              )}
            </div>
          </div>
        }

        menuCard={
          <div className="dd-paper">
            <h3 className="dd-paper__title">Environmental Data</h3>
            <div className="dd-paper__content">
              {envClues.length > 0 ? (
                envClues.map((clue, i) => renderClueCard(clue, i))
              ) : (
                <p style={{ opacity: 0.7, fontStyle: 'italic' }}>
                  Review evidence to uncover environmental factors.
                </p>
              )}
              {/* Show remaining clues */}
              {caseData.clues.filter(c => !['clinical', 'epidemiologic', 'environmental'].includes(c.type)).length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed rgba(0,0,0,0.15)' }}>
                  <p style={{ fontWeight: 600, marginBottom: 8 }}>Additional Evidence:</p>
                  {caseData.clues
                    .filter(c => !['clinical', 'epidemiologic', 'environmental'].includes(c.type))
                    .map((clue, i) => renderClueCard(clue, i))}
                </div>
              )}
            </div>
          </div>
        }

        evidenceBoard={
          <div className="dd-evidenceForm">
            <h3 className="dd-evidenceForm__title">Evidence Board</h3>
            <p style={{ textAlign: 'center', marginBottom: 16, fontSize: 14, color: '#5a4a3a' }}>
              Make a guess based on your evidence:
            </p>

            <div className="dd-evidenceForm__field">
              <label className="dd-evidenceForm__label">Outbreak source:</label>
              <select
                className="dd-evidenceForm__select"
                value={selectedPathogen || ''}
                onChange={(e) => setSelectedPathogen(e.target.value || null)}
              >
                <option value="">Select pathogen...</option>
                {caseData.diagnosis.pathogenOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="dd-evidenceForm__field">
              <label className="dd-evidenceForm__label">Exposure Vehicle:</label>
              <select
                className="dd-evidenceForm__select"
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
              className="dd-evidenceForm__submit"
              onClick={submitDiagnosis}
              disabled={!selectedPathogen || !selectedSource}
            >
              Submit Theory
            </button>
          </div>
        }

        notes={
          <div className="dd-notes-paper">
            <h3 className="dd-notes-paper__title">Notes</h3>
            <div className="dd-notes-paper__content">
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
          </div>
        }

        caseStatus={
          <div className="dd-paper dd-paper--tape">
            <h3 className="dd-paper__title">Case Status</h3>
            <div className="dd-paper__content">
              <p><strong>Phase:</strong> {phase.charAt(0).toUpperCase() + phase.slice(1)}</p>
              <p><strong>Time:</strong> {formatTime(timeRemaining)}</p>
              <p><strong>Points:</strong> {availablePoints}</p>
              <p><strong>Clues:</strong> {revealedClues.length}/{caseData.clues.length}</p>
            </div>
          </div>
        }

        polaroid={
          <div className="dd-polaroid">
            <img
              src={DETECTIVE_PLATES.evidence.src}
              alt="Case evidence"
              className="dd-polaroid__img"
            />
            <div className="dd-polaroid__caption">Case #{caseData.id}</div>
          </div>
        }
      />

      {/* Result Modal */}
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
                {isCorrect ? <CheckCircle size={40} /> : <XCircle size={40} />}
              </div>

              <h2 className="dd-resultCard__title" style={{ color: isCorrect ? '#16a34a' : '#dc2626' }}>
                {isCorrect ? 'Case Solved!' : 'Not Quite'}
              </h2>

              <p style={{ color: '#5a4a3a' }}>
                {isCorrect ? 'Excellent detective work!' : 'Review the evidence and try again.'}
              </p>

              <div className="dd-resultCard__score">+{score} pts</div>

              <div className="dd-resultCard__explanation">
                <p style={{ marginBottom: 8 }}><strong>Pathogen:</strong> {caseData.solution.pathogen}</p>
                <p style={{ marginBottom: 8 }}><strong>Source:</strong> {caseData.solution.source}</p>
                <p style={{ fontSize: 13 }}>{caseData.solution.explanation}</p>
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
    </>
  );
}

export default DetectiveGame;
