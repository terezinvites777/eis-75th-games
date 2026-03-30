// src/components/first-response/PPEChallenge.tsx
// Suit Up mode — CDC donning then doffing sequence

import { useState, useEffect, useRef, useCallback } from 'react';
import { SequenceCard } from './SequenceCard';
import { SequenceBar } from './SequenceBar';
import {
  PPE_DONNING,
  PPE_DOFFING,
  SAFE_WORK_PRACTICES,
  shuffle,
  calculateSuitUpScore,
  type PPESequence,
} from '../../data/first-response-data';
import type { SequenceCardState, SuitUpPhase } from '../../types/first-response';

interface PPEChallengeProps {
  onComplete: (result: {
    donningTime: number;
    doffingTime: number;
    donningErrors: number;
    doffingErrors: number;
    score: number;
  }) => void;
}

function buildCards(sequence: PPESequence): SequenceCardState[] {
  return shuffle(sequence.items.map((item, i) => ({
    id: item.id,
    name: item.name,
    shortName: item.shortName,
    icon: item.icon,
    correctOrder: i,
    tappedOrder: null,
    isCorrect: null,
    isLocked: false,
  })));
}

export function PPEChallenge({ onComplete }: PPEChallengeProps) {
  const [phase, setPhase] = useState<SuitUpPhase>('donning');
  const [cards, setCards] = useState<SequenceCardState[]>(() => buildCards(PPE_DONNING));
  const [nextExpected, setNextExpected] = useState(0);
  const [errors, setErrors] = useState(0);
  const [hintText, setHintText] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Track times per phase
  const [donningTime, setDonningTime] = useState(0);
  const [donningErrors, setDonningErrors] = useState(0);

  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const currentSequence = phase === 'donning' ? PPE_DONNING : PPE_DOFFING;
  const completedCount = cards.filter(c => c.isLocked).length;
  const completedLabels = cards
    .filter(c => c.isLocked)
    .sort((a, b) => (a.tappedOrder ?? 0) - (b.tappedOrder ?? 0))
    .map(c => c.shortName);

  const handleTap = useCallback((id: string) => {
    const card = cards.find(c => c.id === id);
    if (!card || card.isLocked) return;

    if (card.correctOrder === nextExpected) {
      // Correct!
      setCards(prev => prev.map(c =>
        c.id === id
          ? { ...c, tappedOrder: nextExpected, isCorrect: true, isLocked: true }
          : c
      ));
      setNextExpected(prev => prev + 1);
      setHintText(null);

      // Check if phase complete
      if (nextExpected + 1 === currentSequence.items.length) {
        const phaseElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

        if (phase === 'donning') {
          setDonningTime(phaseElapsed);
          setDonningErrors(errors);
          // Transition to doffing
          setTimeout(() => {
            setPhase('doffing');
            setCards(buildCards(PPE_DOFFING));
            setNextExpected(0);
            setErrors(0);
            setHintText(null);
            setElapsedSeconds(0);
          }, 1000);
        } else {
          // Game complete
          const doffingTime = phaseElapsed;
          const scores = calculateSuitUpScore(donningTime, donningErrors, doffingTime, errors);
          onComplete({
            donningTime,
            doffingTime,
            donningErrors,
            doffingErrors: errors,
            score: scores.totalScore,
          });
        }
      }
    } else {
      // Wrong!
      setErrors(prev => prev + 1);
      const correctItem = currentSequence.items[nextExpected];
      setHintText(correctItem.hintText);

      setCards(prev => prev.map(c =>
        c.id === id ? { ...c, isCorrect: false } : c
      ));

      // Clear wrong state after animation
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === id && c.isCorrect === false ? { ...c, isCorrect: null } : c
        ));
      }, 600);
    }
  }, [cards, nextExpected, currentSequence, phase, errors, donningTime, donningErrors, onComplete]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      {/* Phase header */}
      <div className="bg-white/95 rounded-xl p-4 mb-4 border border-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{currentSequence.title}</h2>
            <p className="text-sm text-slate-500">{currentSequence.subtitle}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-slate-800">{formatTime(elapsedSeconds)}</div>
            <div className="text-xs text-red-500 font-medium">{errors} error{errors !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {phase === 'doffing' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2">
            <p className="text-xs font-bold text-red-700 text-center">
              ⚠️ CONTAMINATION ZONE — Remove PPE in the correct order!
            </p>
          </div>
        )}
      </div>

      {/* Hint text */}
      {hintText && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 mb-4 animate-slideUp">
          <p className="text-sm font-semibold" style={{ color: '#451a03' }}>💡 {hintText}</p>
        </div>
      )}

      {/* Cards */}
      <div className="flex flex-col gap-3 mb-4">
        {cards.map(card => {
          const seqItem = currentSequence.items.find(i => i.id === card.id);
          return (
            <SequenceCard
              key={card.id}
              card={card}
              onTap={handleTap}
              showContaminationWarning={
                phase === 'doffing' && card.isLocked
                  ? seqItem?.contaminationWarning
                  : undefined
              }
            />
          );
        })}
      </div>

      {/* Progress bar */}
      <SequenceBar
        totalSteps={currentSequence.items.length}
        completedSteps={completedCount}
        labels={completedLabels}
      />

      {/* Safe work practice tip */}
      {phase === 'donning' && (
        <div className="mt-4 text-center">
          <p className="text-xs text-white/50 italic">
            {SAFE_WORK_PRACTICES[nextExpected % SAFE_WORK_PRACTICES.length]}
          </p>
        </div>
      )}
    </div>
  );
}
