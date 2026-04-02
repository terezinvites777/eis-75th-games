// src/pages/FieldOps.tsx
// Field Ops — Two-phase triage + sequencing game

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { fieldOpsScenarios, investigationSteps, shuffle } from '../data/field-ops-data';
import type { FieldOpsScenario, FieldOpsPhase, TriageResult } from '../types/field-ops';

// Scoring constants
const CORRECT_SORT = 100;
const WRONG_BY_1 = -25;
const WRONG_BY_2 = -75;
const AUTO_TRIAGE_PENALTY = -25;
const SPEED_BONUS = 25;
const PERFECT_TRIAGE_BONUS = 300;
const CORRECT_SEQUENCE_STEP = 100;
const SEQUENCE_TIME_MULTIPLIER = 5;
const WRONG_SEQUENCE_PENALTY_SECONDS = 3;
const PERFECT_SEQUENCE_BONUS = 500;

const BUCKET_ORDER = ['investigate', 'monitor', 'rule-out'] as const;

function bucketDistance(a: string, b: string): number {
  const ai = BUCKET_ORDER.indexOf(a as typeof BUCKET_ORDER[number]);
  const bi = BUCKET_ORDER.indexOf(b as typeof BUCKET_ORDER[number]);
  return Math.abs(ai - bi);
}

function getRank(triageAcc: number, seqComplete: boolean, seqPerfect: boolean) {
  if (triageAcc >= 1 && seqPerfect) return { icon: '\uD83C\uDFC5', title: 'Incident Commander' };
  if (triageAcc >= 0.9 && seqComplete) return { icon: '\uD83E\uDD47', title: 'Senior EIS Officer' };
  if (triageAcc >= 0.75 && seqComplete) return { icon: '\uD83E\uDD48', title: 'EIS Officer' };
  if (seqComplete) return { icon: '\uD83E\uDD49', title: 'First-Year Fellow' };
  return { icon: '\uD83D\uDCCB', title: 'Observer' };
}

const bucketColors = {
  investigate: { bg: '#dc2626', label: 'INVESTIGATE', icon: '\uD83D\uDD34' },
  monitor: { bg: '#eab308', label: 'MONITOR', icon: '\uD83D\uDFE1' },
  'rule-out': { bg: '#22c55e', label: 'RULE OUT', icon: '\uD83D\uDFE2' },
};

export function FieldOps() {
  const [phase, setPhase] = useState<FieldOpsPhase>('attract');
  const [scenario, setScenario] = useState<FieldOpsScenario | null>(null);

  // Phase 1: Triage
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [triageResults, setTriageResults] = useState<TriageResult[]>([]);
  const [triageScore, setTriageScore] = useState(0);
  const [triageTimeRemaining, setTriageTimeRemaining] = useState(60);
  const [lastSortTime, setLastSortTime] = useState<number>(Date.now());
  const [autoTriageTimer, setAutoTriageTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showFeedback, setShowFeedback] = useState<{ correct: boolean; bucket: string } | null>(null);

  // Phase 2: Sequencing
  const [shuffledSteps, setShuffledSteps] = useState(investigationSteps);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [sequencingScore, setSequencingScore] = useState(0);
  const [sequencingTimeRemaining, setSequencingTimeRemaining] = useState(60);
  const [sequencingWrongTaps, setSequencingWrongTaps] = useState(0);
  const [hintText, setHintText] = useState<string | null>(null);

  const triageTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sequencingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Idle auto-reset
  useEffect(() => {
    if (phase === 'complete') {
      idleTimerRef.current = setTimeout(() => setPhase('attract'), 15000);
      return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
    }
  }, [phase]);

  // Triage timer
  useEffect(() => {
    if (phase !== 'triage') {
      if (triageTimerRef.current) clearInterval(triageTimerRef.current);
      return;
    }
    triageTimerRef.current = setInterval(() => {
      setTriageTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(triageTimerRef.current!);
          // Time's up — transition to phase 2
          setPhase('triage-transition');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (triageTimerRef.current) clearInterval(triageTimerRef.current); };
  }, [phase]);

  // Sequencing timer
  useEffect(() => {
    if (phase !== 'sequencing') {
      if (sequencingTimerRef.current) clearInterval(sequencingTimerRef.current);
      return;
    }
    sequencingTimerRef.current = setInterval(() => {
      setSequencingTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(sequencingTimerRef.current!);
          setPhase('complete');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (sequencingTimerRef.current) clearInterval(sequencingTimerRef.current); };
  }, [phase]);

  // Auto-triage timer (3 seconds per card)
  useEffect(() => {
    if (phase !== 'triage' || !scenario) return;
    if (currentCaseIndex >= scenario.cases.length) {
      setPhase('triage-transition');
      return;
    }

    const timer = setTimeout(() => {
      // Auto-sort into monitor
      const currentCase = scenario.cases[currentCaseIndex];
      const dist = bucketDistance('monitor', currentCase.correctBucket);
      setTriageResults(prev => [...prev, {
        caseId: currentCase.id,
        chosenBucket: 'monitor',
        correct: currentCase.correctBucket === 'monitor',
        offBy: dist,
      }]);
      setTriageScore(prev => prev + AUTO_TRIAGE_PENALTY);
      setCurrentCaseIndex(prev => prev + 1);
    }, 8000);

    setAutoTriageTimer(timer);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentCaseIndex, scenario]);

  // Check if all 10 steps completed in sequencing
  useEffect(() => {
    if (phase === 'sequencing' && completedStepIds.length === 10) {
      if (sequencingTimerRef.current) clearInterval(sequencingTimerRef.current);
      setTimeout(() => setPhase('complete'), 500);
    }
  }, [completedStepIds, phase]);

  const selectScenario = (s: FieldOpsScenario) => {
    setScenario(s);
    setCurrentCaseIndex(0);
    setTriageResults([]);
    setTriageScore(0);
    setTriageTimeRemaining(60);
    setLastSortTime(Date.now());
    setCompletedStepIds([]);
    setSequencingScore(0);
    setSequencingTimeRemaining(60);
    setSequencingWrongTaps(0);
    setShuffledSteps(shuffle(investigationSteps));
    setHintText(null);
    setShowFeedback(null);
    setPhase('triage');
  };

  const handleTriageSort = (bucket: 'investigate' | 'monitor' | 'rule-out') => {
    if (phase !== 'triage' || !scenario) return;
    if (currentCaseIndex >= scenario.cases.length) return;

    // Clear auto-triage timer
    if (autoTriageTimer) clearTimeout(autoTriageTimer);

    const currentCase = scenario.cases[currentCaseIndex];
    const dist = bucketDistance(bucket, currentCase.correctBucket);
    const isCorrect = dist === 0;
    const now = Date.now();
    const sortTime = (now - lastSortTime) / 1000;
    const speedBonus = sortTime < 1.5 ? SPEED_BONUS : 0;

    let points = 0;
    if (isCorrect) points = CORRECT_SORT + speedBonus;
    else if (dist === 1) points = WRONG_BY_1;
    else points = WRONG_BY_2;

    setTriageResults(prev => [...prev, {
      caseId: currentCase.id,
      chosenBucket: bucket,
      correct: isCorrect,
      offBy: dist,
    }]);
    setTriageScore(prev => prev + points);
    setLastSortTime(now);

    // Brief feedback
    setShowFeedback({ correct: isCorrect, bucket });
    setTimeout(() => setShowFeedback(null), 400);

    // Next case
    if (currentCaseIndex + 1 >= scenario.cases.length) {
      setTimeout(() => setPhase('triage-transition'), 500);
    } else {
      setCurrentCaseIndex(prev => prev + 1);
    }
  };

  const handleSequenceStep = (stepId: string) => {
    if (phase !== 'sequencing') return;
    const nextOrder = completedStepIds.length + 1;
    const step = investigationSteps.find(s => s.id === stepId);
    if (!step) return;

    if (step.order === nextOrder) {
      // Correct
      const timePoints = sequencingTimeRemaining * SEQUENCE_TIME_MULTIPLIER;
      setSequencingScore(prev => prev + CORRECT_SEQUENCE_STEP + timePoints);
      setCompletedStepIds(prev => [...prev, stepId]);
      setHintText(null);
    } else {
      // Wrong
      setSequencingWrongTaps(prev => prev + 1);
      setSequencingTimeRemaining(prev => Math.max(0, prev - WRONG_SEQUENCE_PENALTY_SECONDS));
      const correctNext = investigationSteps.find(s => s.order === nextOrder);
      setHintText(correctNext?.hintOnWrongTap || 'Not the right step yet');
      setTimeout(() => setHintText(null), 2000);
    }
  };

  // Computed values
  const triageCorrect = triageResults.filter(r => r.correct).length;
  const triageTotal = triageResults.length;
  const triageAccuracy = triageTotal > 0 ? triageCorrect / triageTotal : 0;
  const perfectTriage = triageCorrect === 12;
  const seqComplete = completedStepIds.length === 10;
  const seqPerfect = seqComplete && sequencingWrongTaps === 0;
  const totalTriageScore = triageScore + (perfectTriage ? PERFECT_TRIAGE_BONUS : 0);
  const totalSeqScore = sequencingScore + (seqPerfect ? PERFECT_SEQUENCE_BONUS : 0);
  const totalScore = totalTriageScore + totalSeqScore;

  // ── ATTRACT ──
  if (phase === 'attract') {
    return (
      <GameShell theme="fieldops" heroTitle="Field Ops" heroSubtitle="Triage. Investigate. Solve.">
        <div
          className="flex flex-col items-center justify-center px-8"
          style={{ height: 'calc(100vh - 200px)', cursor: 'pointer' }}
          onClick={() => setPhase('scenario-select')}
        >
          <div className="flex gap-4 mb-8">
            {['\uD83D\uDD34', '\uD83D\uDFE1', '\uD83D\uDFE2'].map((icon, i) => (
              <div
                key={i}
                className="w-24 h-24 rounded-2xl border-2 flex items-center justify-center text-3xl"
                style={{
                  borderColor: 'rgba(212,175,55,0.5)',
                  background: 'rgba(212,175,55,0.2)',
                  animation: `pulse-glow 2s ease-in-out ${i * 300}ms infinite`,
                }}
              >
                {icon}
              </div>
            ))}
          </div>
          <p className="text-3xl font-bold animate-pulse" style={{ color: '#D4AF37' }}>
            TAP TO PLAY
          </p>
          <p className="text-lg mt-2" style={{ color: 'rgba(212,175,55,0.8)' }}>
            Two-phase field investigation
          </p>
        </div>
      </GameShell>
    );
  }

  // ── SCENARIO SELECT ──
  if (phase === 'scenario-select') {
    return (
      <GameShell theme="fieldops" heroTitle="Field Ops" heroSubtitle="Choose your scenario" backPath="/">
        <div className="px-6 py-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-4">
            {fieldOpsScenarios.map(s => (
              <button
                key={s.id}
                onClick={() => selectScenario(s)}
                className="surface-solid rounded-2xl p-5 text-left transition-all active:scale-[0.97]"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <h3 className="text-lg font-bold" style={{ color: '#334155' }}>{s.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{s.setting}</p>
                <span className="pill text-xs">12 cases + 10 steps</span>
              </button>
            ))}
          </div>
        </div>
      </GameShell>
    );
  }

  if (!scenario) return null;

  // ── TRIAGE PHASE ──
  if (phase === 'triage') {
    const currentCase = currentCaseIndex < scenario.cases.length ? scenario.cases[currentCaseIndex] : null;
    const bucketCounts = {
      investigate: triageResults.filter(r => r.chosenBucket === 'investigate').length,
      monitor: triageResults.filter(r => r.chosenBucket === 'monitor').length,
      'rule-out': triageResults.filter(r => r.chosenBucket === 'rule-out').length,
    };

    return (
      <GameShell theme="fieldops" heroTitle="FIELD OPS: TRIAGE" heroSubtitle={scenario.name} showNav={false}>
        <div className="px-4 py-3" style={{ height: 'calc(100vh - 100px)' }}>
          {/* Top bar */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: '#F59E0B' }}>
              {scenario.icon} {scenario.name}
            </span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xl font-bold" style={{ color: triageTimeRemaining <= 10 ? '#dc2626' : '#475569' }}>
                {String(Math.floor(triageTimeRemaining / 60)).padStart(2, '0')}:{String(triageTimeRemaining % 60).padStart(2, '0')}
              </span>
              <span className="text-lg font-bold" style={{ color: '#F59E0B' }}>{triageScore} pts</span>
            </div>
          </div>

          {/* Case card */}
          <div className="flex items-center justify-center" style={{ height: 'calc(100% - 100px)' }}>
            {currentCase ? (
              <div className="surface-solid rounded-2xl p-8 max-w-2xl w-full animate-slide-up">
                <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#475569' }}>
                  CASE #{currentCaseIndex + 1}
                </div>
                <p className="text-2xl font-bold mb-8 leading-relaxed" style={{ color: '#0f172a' }}>
                  {currentCase.patientProfile}
                </p>

                {/* Feedback flash */}
                {showFeedback && (
                  <div className={`text-center text-lg font-bold mb-4 ${showFeedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {showFeedback.correct ? '\u2705 Correct!' : '\u274C Wrong bucket'}
                  </div>
                )}

                {/* Bucket buttons */}
                <div className="grid grid-cols-3 gap-3">
                  {(Object.entries(bucketColors) as [string, { bg: string; label: string; icon: string }][]).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => handleTriageSort(key as 'investigate' | 'monitor' | 'rule-out')}
                      className="rounded-xl py-5 text-white font-bold text-lg transition-all active:scale-[0.95]"
                      style={{ background: val.bg, minHeight: 80 }}
                    >
                      {val.icon} {val.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-xl font-bold" style={{ color: '#475569' }}>
                All cases triaged!
              </div>
            )}
          </div>

          {/* Bottom tally */}
          <div className="flex items-center justify-between text-sm" style={{ color: '#475569' }}>
            <span>Cases: {currentCaseIndex}/{scenario.cases.length}</span>
            <div className="flex gap-3">
              <span>{'\uD83D\uDD34'} {bucketCounts.investigate}</span>
              <span>{'\uD83D\uDFE1'} {bucketCounts.monitor}</span>
              <span>{'\uD83D\uDFE2'} {bucketCounts['rule-out']}</span>
            </div>
          </div>
        </div>
      </GameShell>
    );
  }

  // ── TRIAGE TRANSITION ──
  if (phase === 'triage-transition') {
    return (
      <GameShell theme="fieldops" heroTitle="Triage Complete" heroSubtitle={scenario.name} showNav={false}>
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 100px)' }}>
          <div className="surface-solid rounded-2xl p-8 max-w-lg text-center animate-slide-up">
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#334155' }}>Triage Complete</h2>
            <p className="text-lg mb-4" style={{ color: '#475569' }}>
              You triaged {triageTotal} cases: {triageCorrect} correct ({Math.round(triageAccuracy * 100)}% accuracy)
            </p>
            <p className="text-3xl font-bold mb-6" style={{ color: '#F59E0B' }}>+{totalTriageScore} pts</p>
            <div className="text-lg font-bold mb-4" style={{ color: '#334155' }}>
              Now: organize your field investigation.
            </div>
            <button
              className="btn-emboss btn-emboss-primary btn-emboss-lg"
              onClick={() => setPhase('sequencing')}
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
            >
              BEGIN INVESTIGATION
            </button>
          </div>
        </div>
      </GameShell>
    );
  }

  // ── SEQUENCING PHASE ──
  if (phase === 'sequencing') {
    const remainingSteps = shuffledSteps.filter(s => !completedStepIds.includes(s.id));

    return (
      <GameShell theme="fieldops" heroTitle="FIELD OPS: INVESTIGATE" heroSubtitle={scenario.name} showNav={false}>
        <div className="px-4 py-3" style={{ height: 'calc(100vh - 100px)' }}>
          {/* Top bar */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: '#F59E0B' }}>
              {scenario.icon} {scenario.name}
            </span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xl font-bold" style={{ color: sequencingTimeRemaining <= 10 ? '#dc2626' : '#475569' }}>
                {String(Math.floor(sequencingTimeRemaining / 60)).padStart(2, '0')}:{String(sequencingTimeRemaining % 60).padStart(2, '0')}
              </span>
              <span className="text-lg font-bold" style={{ color: '#F59E0B' }}>{triageScore + sequencingScore} pts</span>
            </div>
          </div>

          {/* Context */}
          <div className="rounded-lg px-4 py-2 mb-3 text-sm" style={{ background: 'rgba(71,85,105,0.08)', color: '#334155' }}>
            {scenario.investigationContext}
          </div>

          {/* Hint */}
          {hintText && (
            <div className="rounded-lg px-4 py-2 mb-2 text-sm font-semibold animate-slide-up" style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>
              {hintText}
            </div>
          )}

          {/* Step cards grid */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {remainingSteps.map(step => (
              <button
                key={step.id}
                onClick={() => handleSequenceStep(step.id)}
                className="rounded-xl border-2 p-3 text-center transition-all active:scale-[0.95]"
                style={{
                  background: 'linear-gradient(180deg, #ffffff, #f1f5f9)',
                  borderColor: 'rgba(71,85,105,0.2)',
                  minHeight: 100,
                }}
              >
                <div className="text-2xl mb-1">{step.icon}</div>
                <div className="text-xs font-bold leading-tight" style={{ color: '#334155' }}>
                  {step.label}
                </div>
              </button>
            ))}
          </div>

          {/* Sequence bar */}
          <div className="rounded-xl border-2 px-4 py-3" style={{ borderColor: 'rgba(71,85,105,0.2)', background: 'rgba(71,85,105,0.04)' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#475569' }}>SEQUENCE</div>
            <div className="flex gap-2">
              {investigationSteps.map((step, i) => {
                const isCompleted = completedStepIds.includes(step.id);
                return (
                  <div
                    key={step.id}
                    className="rounded-lg px-2 py-1 text-center flex-1"
                    style={{
                      background: isCompleted ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(71,85,105,0.1)',
                      color: isCompleted ? 'white' : '#94a3b8',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {isCompleted ? `${i + 1} ${step.icon}` : i + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </GameShell>
    );
  }

  // ── COMPLETE ──
  if (phase === 'complete') {
    const rank = getRank(triageAccuracy, seqComplete, seqPerfect);

    return (
      <GameShell theme="fieldops" heroTitle="Mission Complete" heroSubtitle={scenario.name} showNav={false}>
        <div className="flex items-center justify-center px-8" style={{ height: 'calc(100vh - 100px)' }}>
          <div className="surface-solid text-center p-8 rounded-2xl max-w-lg w-full animate-slide-up">
            <div className="text-5xl mb-2">{rank.icon}</div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#334155' }}>{rank.title}</h2>
            <p className="text-4xl font-bold mb-6 animate-score-pop" style={{ color: '#F59E0B' }}>
              {totalScore} points
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="stat-card">
                <div className="stat-label">Phase 1: Triage</div>
                <div className="stat-value" style={{ color: '#F59E0B' }}>+{totalTriageScore}</div>
                <div className="text-xs text-gray-500 mt-1">{triageCorrect}/12 correct ({Math.round(triageAccuracy * 100)}%)</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Phase 2: Sequencing</div>
                <div className="stat-value" style={{ color: '#F59E0B' }}>+{totalSeqScore}</div>
                <div className="text-xs text-gray-500 mt-1">{completedStepIds.length}/10 steps{seqPerfect ? ' \u2B50' : ''}</div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Pathogen revealed: <span className="font-bold">{scenario.pathogen}</span>
            </p>

            <div className="flex gap-3 justify-center">
              <button
                className="btn-emboss btn-emboss-primary"
                onClick={() => selectScenario(scenario)}
                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
              >
                PLAY AGAIN
              </button>
              <button className="btn-emboss" onClick={() => setPhase('scenario-select')}>
                OTHER SCENARIO
              </button>
              <a href="/" className="btn-emboss">BACK</a>
            </div>
          </div>
        </div>
      </GameShell>
    );
  }

  return null;
}

export default FieldOps;
