// src/pages/DetectiveGame.tsx
// Main gameplay screen for Disease Detective cases

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, AlertTriangle, CheckCircle, XCircle,
  MessageSquare, ChevronDown, ChevronUp,
  Lightbulb, BookOpen, RotateCcw, FileText, Search
} from 'lucide-react';
import { DetectiveGameShell } from '../components/detective/DetectiveGameShell';
import { ParchmentPanel } from '../components/detective/ParchmentPanel';
import { ClueCard } from '../components/detective/ClueCard';
import { EraBadge, DifficultyStars } from '../components/brand/BrandMarks';
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
      <DetectiveGameShell
        title="Case Not Found"
        backPath="/detective"
      >
        <ParchmentPanel title="Error" icon={<AlertTriangle size={14} />}>
          <p className="text-center">This case could not be loaded.</p>
        </ParchmentPanel>
      </DetectiveGameShell>
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

  // Phase title for status strip
  const phaseLabel = {
    briefing: 'Case Briefing',
    investigation: 'Investigation',
    diagnosis: 'Diagnosis',
    result: isCorrect ? 'Case Solved' : 'Review',
  }[phase];

  return (
    <DetectiveGameShell
      title={caseData.title}
      subtitle={caseData.subtitle}
      stageImageUrl={plate.src}
      backPath={`/detective/${era}`}
      statusStrip={
        <>
          <div className="status-item">
            <Clock
              size={16}
              className={timeRemaining < 60 ? 'text-red-500' : 'text-[var(--brass-1)]'}
            />
            <span className="status-label">Time:</span>
            <span
              className="status-value"
              style={timeRemaining < 60 ? { color: '#ef4444' } : undefined}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="status-item">
            <FileText size={16} className="text-[var(--brass-1)]" />
            <span className="status-label">Phase:</span>
            <span className="status-value">{phaseLabel}</span>
          </div>
          <div className="status-item">
            <Search size={16} className="text-[var(--brass-1)]" />
            <span className="status-label">Points:</span>
            <span className="status-value">{availablePoints}</span>
          </div>
        </>
      }
    >
      {/* Progress bar for active phases */}
      {(phase === 'investigation' || phase === 'diagnosis') && (
        <div className="detective-progress mt-2">
          <div
            className="detective-progress-fill"
            style={{ width: `${(timeRemaining / caseData.timeLimit) * 100}%` }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === 'briefing' && (
          <motion.div
            key="briefing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ParchmentPanel
              title={caseData.briefing.type === 'email' ? 'Incoming Email' : caseData.briefing.type === 'phone' ? 'Phone Briefing' : caseData.briefing.type === 'alert' ? 'Alert' : 'Memo'}
              icon={<MessageSquare size={14} />}
              showPins
              right={
                <div className="flex items-center gap-3">
                  <EraBadge era={caseData.era} />
                  <span style={{ color: 'var(--ink-1)' }}>{caseData.year}</span>
                  <DifficultyStars level={caseData.difficulty} />
                  {caseData.briefing.urgency === 'critical' && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      URGENT
                    </span>
                  )}
                </div>
              }
            >
              <div className="space-y-2 mb-4">
                <p><strong>From:</strong> {caseData.briefing.from}</p>
                <p><strong>Subject:</strong> {caseData.briefing.subject}</p>
                {caseData.briefing.timestamp && (
                  <p><strong>Date:</strong> {caseData.briefing.timestamp}</p>
                )}
              </div>
              <hr className="border-dashed border-[var(--ink-0)]/20 my-4" />
              <div className="whitespace-pre-wrap">{caseData.briefing.content}</div>

              <div className="text-center space-y-3 mt-6">
                <button
                  onClick={() => setPhase('investigation')}
                  className="detective-btn-primary"
                >
                  Begin Investigation
                </button>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  You have {Math.floor(caseData.timeLimit / 60)} minutes to solve this case
                </p>
              </div>
            </ParchmentPanel>
          </motion.div>
        )}

        {phase === 'investigation' && (
          <motion.div
            key="investigation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Collapsible briefing */}
            <ParchmentPanel>
              <button
                onClick={() => setShowBriefing(!showBriefing)}
                className="w-full flex items-center justify-between"
              >
                <span className="font-semibold">Case Briefing</span>
                {showBriefing ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              <AnimatePresence>
                {showBriefing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 text-sm whitespace-pre-wrap">
                      {caseData.briefing.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </ParchmentPanel>

            {/* Evidence Panel */}
            <ParchmentPanel
              title={`Evidence (${revealedClues.length}/${caseData.clues.length})`}
              icon={<Search size={14} />}
              showPins
            >
              <div className="space-y-4">
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

              <div className="text-center mt-6">
                <button
                  onClick={() => setPhase('diagnosis')}
                  className="detective-btn-primary"
                  disabled={revealedClues.length === 0}
                >
                  <Lightbulb size={18} />
                  Ready to Diagnose
                </button>
              </div>
            </ParchmentPanel>
          </motion.div>
        )}

        {phase === 'diagnosis' && (
          <motion.div
            key="diagnosis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ParchmentPanel
              title="Make Your Diagnosis"
              icon={<AlertTriangle size={14} />}
              showPins
            >
              <p className="mb-4">
                Identify both the <strong>pathogen</strong> AND the <strong>source</strong> of this outbreak.
              </p>

              <div className="space-y-4 mb-6">
                <h3 className="font-semibold">What caused this outbreak?</h3>
                <div className="space-y-2">
                  {caseData.diagnosis.pathogenOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedPathogen(option.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedPathogen === option.id
                          ? 'border-[var(--brass-0)] bg-[var(--paper-0)]'
                          : 'border-[var(--ink-0)]/20 bg-white/50 hover:border-[var(--brass-1)]'
                      }`}
                    >
                      <div className="font-semibold" style={{ color: 'var(--ink-0)' }}>
                        {option.label}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-semibold">What was the source?</h3>
                <div className="space-y-2">
                  {caseData.diagnosis.sourceOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedSource(option.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedSource === option.id
                          ? 'border-[var(--brass-0)] bg-[var(--paper-0)]'
                          : 'border-[var(--ink-0)]/20 bg-white/50 hover:border-[var(--brass-1)]'
                      }`}
                    >
                      <div className="font-semibold" style={{ color: 'var(--ink-0)' }}>
                        {option.label}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={submitDiagnosis}
                  className="detective-btn-primary"
                  disabled={!selectedPathogen || !selectedSource}
                >
                  Submit Diagnosis
                </button>
              </div>
            </ParchmentPanel>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Result Banner */}
            <ParchmentPanel showPins>
              <div className="text-center py-4">
                {isCorrect ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-700 mb-2">
                      Case Solved!
                    </h2>
                    <p className="text-green-600 mb-4">Excellent detective work</p>
                    <div
                      className="text-4xl font-bold animate-score-pop"
                      style={{ color: 'var(--brass-0)' }}
                    >
                      +{score} pts
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle size={32} className="text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-700 mb-2">
                      Not Quite
                    </h2>
                    <p className="text-red-600 mb-4">
                      Review the evidence and try again
                    </p>
                    {score > 0 && (
                      <div className="text-2xl font-bold" style={{ color: 'var(--muted)' }}>
                        +{score} pts (partial credit)
                      </div>
                    )}
                  </>
                )}
              </div>
            </ParchmentPanel>

            {/* The Real Story */}
            <ParchmentPanel
              title="The Real Story"
              icon={<BookOpen size={14} />}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Pathogen</h4>
                  <p>{caseData.solution.pathogen}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Source</h4>
                  <p>{caseData.solution.source}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">What Happened</h4>
                  <p>{caseData.solution.explanation}</p>
                </div>
                {caseData.solution.realOutcome && (
                  <div>
                    <h4 className="font-semibold mb-1">Outcome</h4>
                    <p>{caseData.solution.realOutcome}</p>
                  </div>
                )}
                <div
                  className="mt-4 p-4 rounded-lg"
                  style={{ background: 'var(--paper-0)' }}
                >
                  <h4
                    className="font-semibold mb-1"
                    style={{ color: 'var(--brass-2)' }}
                  >
                    EIS Legacy
                  </h4>
                  <p>{caseData.solution.eisLegacy}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => navigate(`/detective/${era}`)}
                  className="flex-1 detective-btn-secondary"
                >
                  <RotateCcw size={18} />
                  More Cases
                </button>
                <button
                  onClick={() => navigate('/leaderboard')}
                  className="flex-1 detective-btn-primary"
                >
                  Leaderboard
                </button>
              </div>
            </ParchmentPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </DetectiveGameShell>
  );
}

export default DetectiveGame;
