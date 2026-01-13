// src/pages/DetectiveGame.tsx
// Main gameplay screen for Disease Detective cases - Investigation Workspace Layout

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, AlertTriangle, CheckCircle, XCircle,
  MessageSquare, ChevronDown, ChevronUp,
  Lightbulb, BookOpen, RotateCcw, Search, Clipboard
} from 'lucide-react';
import { CaseBanner } from '../components/detective/CaseBanner';
import { InvestigationLayout } from '../components/detective/InvestigationLayout';
import { ClueCard } from '../components/detective/ClueCard';
import { getCaseById } from '../data/detective';
import { DETECTIVE_PLATES, type PlateMeta } from '../data/detectivePlates';
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
  const [showBriefing, setShowBriefing] = useState(true);

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
  }, [caseData, selectedPathogen, selectedSource, timeRemaining, pointsSpent, addScore]);

  if (!caseData) {
    return (
      <InvestigationLayout
        banner={
          <CaseBanner
            title="Case Not Found"
            imageUrl={DETECTIVE_PLATES.caseSelect.src}
            onBack={() => navigate('/detective')}
          />
        }
        left={
          <div className="dd-panel">
            <p style={{ textAlign: 'center' }}>This case could not be loaded.</p>
          </div>
        }
        right={<div />}
      />
    );
  }

  const availablePoints = caseData.basePoints - pointsSpent;

  // Get the appropriate plate metadata based on current phase
  const getCurrentPlate = (): PlateMeta => {
    switch (phase) {
      case 'briefing': return DETECTIVE_PLATES.briefing;
      case 'investigation': return DETECTIVE_PLATES.evidence;
      case 'diagnosis': return DETECTIVE_PLATES.diagnosis;
      case 'result': return DETECTIVE_PLATES.reveal;
      default: return DETECTIVE_PLATES.briefing;
    }
  };

  const plate = getCurrentPlate();

  // Phase label for banner
  const phaseLabel = {
    briefing: 'Case Briefing',
    investigation: 'Investigation',
    diagnosis: 'Diagnosis',
    result: isCorrect ? 'Case Solved' : 'Review',
  }[phase];

  // Difficulty mapping
  const difficultyMap: Record<number, 'Easy' | 'Medium' | 'Hard'> = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard',
  };

  // Era tag
  const eraTagMap: Record<string, string> = {
    founding: '1950s',
    modern: '1970-90s',
    global: '2000s+',
  };

  // Notebook content based on phase
  const renderNotebook = () => {
    if (phase === 'result') {
      return (
        <div className="dd-notebook">
          <div className="dd-notebook__title">
            <BookOpen size={14} />
            Case Summary
          </div>
          <div className="dd-notebook__content">
            <p style={{ marginBottom: 8 }}>
              <strong>Your diagnosis:</strong>
            </p>
            <p style={{ marginBottom: 4 }}>
              Pathogen: {caseData.diagnosis.pathogenOptions.find(p => p.id === selectedPathogen)?.label || 'None'}
            </p>
            <p>
              Source: {caseData.diagnosis.sourceOptions.find(s => s.id === selectedSource)?.label || 'None'}
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="dd-notebook">
          <div className="dd-notebook__title">
            <Clipboard size={14} />
            Case Notebook
          </div>
          <div className="dd-notebook__content">
            {phase === 'briefing' && (
              <p>Read the briefing carefully. Note key symptoms, timeline, and affected population.</p>
            )}
            {phase === 'investigation' && (
              <>
                <p style={{ marginBottom: 8 }}>
                  <strong>Evidence reviewed:</strong> {revealedClues.length} / {caseData.clues.length}
                </p>
                <div className="dd-progress">
                  <div
                    className="dd-progress__fill"
                    style={{ width: `${(revealedClues.length / caseData.clues.length) * 100}%` }}
                  />
                </div>
                <p style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
                  Tip: Look for patterns in symptoms, timing, and exposure routes.
                </p>
              </>
            )}
            {phase === 'diagnosis' && (
              <>
                <p style={{ marginBottom: 8 }}>
                  <strong>Selected:</strong>
                </p>
                <p style={{ fontSize: 13 }}>
                  Pathogen: {selectedPathogen ? caseData.diagnosis.pathogenOptions.find(p => p.id === selectedPathogen)?.label : '—'}
                </p>
                <p style={{ fontSize: 13 }}>
                  Source: {selectedSource ? caseData.diagnosis.sourceOptions.find(s => s.id === selectedSource)?.label : '—'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Stats panel */}
        <div className="dd-notebook">
          <div className="dd-notebook__title">
            <Clock size={14} />
            Investigation Status
          </div>
          <div className="dd-notebook__content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Time Remaining:</span>
              <strong style={{ color: timeRemaining < 60 ? '#dc2626' : '#8a6a14' }}>
                {formatTime(timeRemaining)}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Points Available:</span>
              <strong style={{ color: '#8a6a14' }}>{availablePoints}</strong>
            </div>
            {(phase === 'investigation' || phase === 'diagnosis') && (
              <div className="dd-progress" style={{ marginTop: 10 }}>
                <div
                  className="dd-progress__fill"
                  style={{
                    width: `${(timeRemaining / caseData.timeLimit) * 100}%`,
                    background: timeRemaining < 60
                      ? 'linear-gradient(90deg, #dc2626, #ef4444)'
                      : undefined
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // Main content based on phase
  const renderMainContent = () => {
    return (
      <AnimatePresence mode="wait">
        {phase === 'briefing' && (
          <motion.div
            key="briefing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="dd-panel">
              <div className="dd-panel__header">
                <div className="dd-panel__icon">
                  <MessageSquare size={16} />
                </div>
                <h2 className="dd-panel__title">
                  {caseData.briefing.type === 'email' ? 'Incoming Email' :
                   caseData.briefing.type === 'phone' ? 'Phone Briefing' :
                   caseData.briefing.type === 'alert' ? 'Alert' : 'Memo'}
                </h2>
                {caseData.briefing.urgency === 'critical' && (
                  <span style={{
                    marginLeft: 'auto',
                    padding: '4px 10px',
                    background: '#fee2e2',
                    color: '#b91c1c',
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 999,
                  }}>
                    URGENT
                  </span>
                )}
              </div>

              <div style={{ fontSize: 13, marginBottom: 16, opacity: 0.85 }}>
                <p style={{ margin: '4px 0' }}><strong>From:</strong> {caseData.briefing.from}</p>
                <p style={{ margin: '4px 0' }}><strong>Subject:</strong> {caseData.briefing.subject}</p>
                {caseData.briefing.timestamp && (
                  <p style={{ margin: '4px 0' }}><strong>Date:</strong> {caseData.briefing.timestamp}</p>
                )}
              </div>

              <hr style={{ border: 'none', borderTop: '1px dashed rgba(60,40,28,.22)', margin: '16px 0' }} />

              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
                {caseData.briefing.content}
              </div>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button
                  onClick={() => setPhase('investigation')}
                  className="dd-btn dd-btn--primary"
                >
                  Begin Investigation
                </button>
                <p style={{ marginTop: 12, fontSize: 13, opacity: 0.7 }}>
                  You have {Math.floor(caseData.timeLimit / 60)} minutes to solve this case
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'investigation' && (
          <motion.div
            key="investigation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Collapsible briefing */}
            <div className="dd-panel">
              <button
                onClick={() => setShowBriefing(!showBriefing)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                  color: 'inherit',
                }}
              >
                <span style={{ fontWeight: 600 }}>Case Briefing</span>
                {showBriefing ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <AnimatePresence>
                {showBriefing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingTop: 16, fontSize: 14, whiteSpace: 'pre-wrap' }}>
                      {caseData.briefing.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Evidence Panel */}
            <div className="dd-panel">
              <div className="dd-panel__header">
                <div className="dd-panel__icon">
                  <Search size={16} />
                </div>
                <h2 className="dd-panel__title">
                  Evidence ({revealedClues.length}/{caseData.clues.length})
                </h2>
              </div>

              <div className="dd-evidenceList">
                {caseData.clues.map((clue) => (
                  <ClueCard
                    key={clue.id}
                    clue={clue}
                    isRevealed={revealedClues.includes(clue.id)}
                    onReveal={() => revealClue(clue.id)}
                    canAfford={availablePoints >= clue.pointCost}
                  />
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button
                  onClick={() => setPhase('diagnosis')}
                  className="dd-btn dd-btn--primary"
                  disabled={revealedClues.length === 0}
                >
                  <Lightbulb size={18} />
                  Ready to Diagnose
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'diagnosis' && (
          <motion.div
            key="diagnosis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="dd-panel">
              <div className="dd-panel__header">
                <div className="dd-panel__icon">
                  <AlertTriangle size={16} />
                </div>
                <h2 className="dd-panel__title">Make Your Diagnosis</h2>
              </div>

              <p style={{ marginBottom: 20 }}>
                Identify both the <strong>pathogen</strong> AND the <strong>source</strong> of this outbreak.
              </p>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
                  What caused this outbreak?
                </h3>
                <div className="dd-answerGrid">
                  {caseData.diagnosis.pathogenOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedPathogen(option.id)}
                      className={`dd-answerOption ${selectedPathogen === option.id ? 'dd-answerOption--selected' : ''}`}
                    >
                      <div className="dd-answerOption__label">{option.label}</div>
                      <div className="dd-answerOption__desc">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
                  What was the source?
                </h3>
                <div className="dd-answerGrid">
                  {caseData.diagnosis.sourceOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedSource(option.id)}
                      className={`dd-answerOption ${selectedSource === option.id ? 'dd-answerOption--selected' : ''}`}
                    >
                      <div className="dd-answerOption__label">{option.label}</div>
                      <div className="dd-answerOption__desc">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={submitDiagnosis}
                  className="dd-btn dd-btn--primary"
                  disabled={!selectedPathogen || !selectedSource}
                >
                  Submit Diagnosis
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Result Banner */}
            <div className="dd-panel">
              <div className="dd-result">
                {isCorrect ? (
                  <>
                    <div className="dd-result__icon dd-result__icon--success">
                      <CheckCircle size={32} />
                    </div>
                    <h2 className="dd-result__title dd-result__title--success">
                      Case Solved!
                    </h2>
                    <p style={{ color: '#16a34a' }}>Excellent detective work</p>
                    <div className="dd-result__score">+{score} pts</div>
                  </>
                ) : (
                  <>
                    <div className="dd-result__icon dd-result__icon--fail">
                      <XCircle size={32} />
                    </div>
                    <h2 className="dd-result__title dd-result__title--fail">
                      Not Quite
                    </h2>
                    <p style={{ color: '#dc2626' }}>Review the evidence and try again</p>
                    {score > 0 && (
                      <div className="dd-result__score" style={{ color: '#6b7280' }}>
                        +{score} pts (partial credit)
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* The Real Story */}
            <div className="dd-panel">
              <div className="dd-panel__header">
                <div className="dd-panel__icon">
                  <BookOpen size={16} />
                </div>
                <h2 className="dd-panel__title">The Real Story</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Pathogen</h4>
                  <p style={{ margin: 0 }}>{caseData.solution.pathogen}</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Source</h4>
                  <p style={{ margin: 0 }}>{caseData.solution.source}</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: 4 }}>What Happened</h4>
                  <p style={{ margin: 0 }}>{caseData.solution.explanation}</p>
                </div>
                {caseData.solution.realOutcome && (
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Outcome</h4>
                    <p style={{ margin: 0 }}>{caseData.solution.realOutcome}</p>
                  </div>
                )}
                <div style={{
                  marginTop: 8,
                  padding: 16,
                  background: 'rgba(212,175,55,0.08)',
                  borderRadius: 12,
                  border: '1px solid rgba(212,175,55,0.25)',
                }}>
                  <h4 style={{ fontWeight: 600, marginBottom: 4, color: '#8a6a14' }}>
                    EIS Legacy
                  </h4>
                  <p style={{ margin: 0 }}>{caseData.solution.eisLegacy}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button
                  onClick={() => navigate(`/detective/${era}`)}
                  className="dd-btn dd-btn--secondary"
                  style={{ flex: 1 }}
                >
                  <RotateCcw size={18} />
                  More Cases
                </button>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="dd-btn dd-btn--primary"
                  style={{ flex: 1 }}
                >
                  Leaderboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <InvestigationLayout
      banner={
        <CaseBanner
          title={caseData.title}
          location={caseData.subtitle}
          imageUrl={plate.src}
          phaseLabel={phaseLabel}
          timeLeft={phase !== 'briefing' ? formatTime(timeRemaining) : undefined}
          points={phase !== 'briefing' ? availablePoints : undefined}
          difficulty={difficultyMap[caseData.difficulty]}
          eraTag={eraTagMap[caseData.era]}
          onBack={() => navigate(`/detective/${era}`)}
        />
      }
      left={renderMainContent()}
      right={renderNotebook()}
    />
  );
}

export default DetectiveGame;
