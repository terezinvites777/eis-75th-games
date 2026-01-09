// src/pages/DetectiveGame.tsx
// Main gameplay screen for Disease Detective cases

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, AlertTriangle, CheckCircle, XCircle, 
  MessageSquare, ChevronDown, ChevronUp,
  Lightbulb, BookOpen, RotateCcw
} from 'lucide-react';
import { GameShell } from '../components/layout/GameShell';
import { ClueCard } from '../components/detective/ClueCard';
import { EraBadge, DifficultyStars } from '../components/brand/BrandMarks';
import { getCaseById } from '../data/detective';
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
      <GameShell theme="detective" heroTitle="Case Not Found" backPath="/detective">
        <div className="p-5 text-center">
          <p className="text-gray-500">This case could not be loaded.</p>
        </div>
      </GameShell>
    );
  }

  const availablePoints = caseData.basePoints - pointsSpent;

  return (
    <GameShell
      theme="detective"
      heroTitle={caseData.title}
      heroSubtitle={caseData.subtitle}
      backPath={`/detective/${era}`}
      showNav={phase === 'briefing' || phase === 'result'}
    >
      {(phase === 'investigation' || phase === 'diagnosis') && (
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={18} className={timeRemaining < 60 ? 'text-red-500' : 'text-gray-500'} />
              <span className={`font-mono font-bold ${timeRemaining < 60 ? 'text-red-500' : 'text-gray-700'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Points:</span>
              <span className="font-bold text-[var(--anniv-bronze)]">{availablePoints}</span>
            </div>
          </div>
          <div className="mt-2 progress-bar">
            <div className="progress-fill" style={{ width: `${(timeRemaining / caseData.timeLimit) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="p-5 space-y-6">
        <AnimatePresence mode="wait">
          {phase === 'briefing' && (
            <motion.div key="briefing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <EraBadge era={caseData.era} />
                <span className="text-gray-500">{caseData.year}</span>
                <DifficultyStars level={caseData.difficulty} />
              </div>

              <div className="panel-themed">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={18} className="text-[var(--theme-primary)]" />
                  <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {caseData.briefing.type === 'email' ? 'Incoming Email' : caseData.briefing.type === 'phone' ? 'Phone Briefing' : caseData.briefing.type === 'alert' ? 'Alert' : 'Memo'}
                  </span>
                  {caseData.briefing.urgency === 'critical' && (
                    <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">URGENT</span>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-500"><span className="font-medium">From:</span> {caseData.briefing.from}</p>
                  <p className="text-sm text-gray-500"><span className="font-medium">Subject:</span> {caseData.briefing.subject}</p>
                  {caseData.briefing.timestamp && <p className="text-sm text-gray-500"><span className="font-medium">Date:</span> {caseData.briefing.timestamp}</p>}
                </div>
                <div className="divider-themed" />
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caseData.briefing.content}</div>
              </div>

              <div className="text-center space-y-3">
                <button onClick={() => setPhase('investigation')} className="btn-emboss btn-emboss-primary btn-emboss-lg">
                  Begin Investigation
                </button>
                <p className="text-sm text-gray-500">You have {Math.floor(caseData.timeLimit / 60)} minutes to solve this case</p>
              </div>
            </motion.div>
          )}

          {phase === 'investigation' && (
            <motion.div key="investigation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="panel">
                <button onClick={() => setShowBriefing(!showBriefing)} className="w-full flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Case Briefing</span>
                  {showBriefing ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <AnimatePresence>
                  {showBriefing && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-4 text-sm text-gray-600 whitespace-pre-wrap">{caseData.briefing.content}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-4">
                <div className="section-header">
                  <span className="section-title">Evidence ({revealedClues.length}/{caseData.clues.length})</span>
                  <div className="section-header-line" />
                </div>
                <div className="space-y-4">
                  {caseData.clues.map((clue) => (
                    <ClueCard key={clue.id} clue={clue} isRevealed={revealedClues.includes(clue.id)} onReveal={() => revealClue(clue.id)} canAfford={availablePoints >= clue.pointCost} />
                  ))}
                </div>
              </div>

              <div className="text-center pt-4">
                <button onClick={() => setPhase('diagnosis')} className="btn-emboss btn-emboss-primary" disabled={revealedClues.length === 0}>
                  <Lightbulb size={18} />
                  Ready to Diagnose
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'diagnosis' && (
            <motion.div key="diagnosis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="panel">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-amber-500" />
                  <span className="font-semibold text-gray-800">Make Your Diagnosis</span>
                </div>
                <p className="text-sm text-gray-600">Identify both the pathogen AND the source of this outbreak.</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">What caused this outbreak?</h3>
                <div className="space-y-2">
                  {caseData.diagnosis.pathogenOptions.map((option) => (
                    <button key={option.id} onClick={() => setSelectedPathogen(option.id)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedPathogen === option.id ? 'border-[var(--theme-primary)] bg-[var(--theme-surface)]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">What was the source?</h3>
                <div className="space-y-2">
                  {caseData.diagnosis.sourceOptions.map((option) => (
                    <button key={option.id} onClick={() => setSelectedSource(option.id)} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedSource === option.id ? 'border-[var(--theme-primary)] bg-[var(--theme-surface)]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <div className="font-semibold text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4">
                <button onClick={submitDiagnosis} className="btn-emboss btn-emboss-primary btn-emboss-lg" disabled={!selectedPathogen || !selectedSource}>
                  Submit Diagnosis
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className={`panel-themed text-center py-8`}>
                {isCorrect ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-700 mb-2">Case Solved!</h2>
                    <p className="text-green-600 mb-4">Excellent detective work</p>
                    <div className="text-4xl font-bold text-[var(--anniv-gold)] animate-score-pop">+{score} pts</div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle size={32} className="text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-700 mb-2">Not Quite</h2>
                    <p className="text-red-600 mb-4">Review the evidence and try again</p>
                    {score > 0 && <div className="text-2xl font-bold text-gray-500">+{score} pts (partial credit)</div>}
                  </>
                )}
              </div>

              <div className="panel">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={18} className="text-[var(--theme-primary)]" />
                  <span className="font-semibold text-gray-800">The Real Story</span>
                </div>
                <div className="space-y-4 text-sm text-gray-700">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Pathogen</h4>
                    <p>{caseData.solution.pathogen}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Source</h4>
                    <p>{caseData.solution.source}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">What Happened</h4>
                    <p>{caseData.solution.explanation}</p>
                  </div>
                  {caseData.solution.realOutcome && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Outcome</h4>
                      <p>{caseData.solution.realOutcome}</p>
                    </div>
                  )}
                  <div className="mt-4 p-4 bg-[var(--theme-surface)] rounded-lg">
                    <h4 className="font-semibold text-[var(--theme-primary)] mb-1">EIS Legacy</h4>
                    <p>{caseData.solution.eisLegacy}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => navigate(`/detective/${era}`)} className="flex-1 btn-emboss">
                  <RotateCcw size={18} />
                  More Cases
                </button>
                <button onClick={() => navigate('/leaderboard')} className="flex-1 btn-emboss btn-emboss-primary">
                  Leaderboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameShell>
  );
}

export default DetectiveGame;
