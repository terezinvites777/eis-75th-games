// src/components/first-response/OutbreakSequence.tsx
// First Response mode — 10-step investigation sequencing with countdown

import { useState, useEffect, useRef, useCallback } from 'react';
import { SequenceCard } from './SequenceCard';
import { SequenceBar } from './SequenceBar';
import {
  INVESTIGATION_STEPS,
  OUTBREAK_SCENARIOS,
  MODE2_CONFIG,
  shuffle,
  randomFrom,
  calculateFirstResponseScore,
  type OutbreakScenario,
} from '../../data/first-response-data';
import type { SequenceCardState } from '../../types/first-response';

interface OutbreakSequenceProps {
  onComplete: (result: {
    scenarioId: string;
    score: number;
    wrongTaps: number;
    correctFirstTaps: number;
    timeRemaining: number;
    totalTime: number;
  }) => void;
}

function buildCards(): SequenceCardState[] {
  return shuffle(INVESTIGATION_STEPS.map((step, i) => ({
    id: step.id,
    name: step.fullName,
    shortName: step.label.replace('\n', ' '),
    icon: step.icon,
    correctOrder: i,
    tappedOrder: null,
    isCorrect: null,
    isLocked: false,
  })));
}

export function OutbreakSequence({ onComplete }: OutbreakSequenceProps) {
  const [scenario] = useState<OutbreakScenario>(() => randomFrom(OUTBREAK_SCENARIOS));
  const [cards, setCards] = useState<SequenceCardState[]>(() => buildCards());
  const [nextExpected, setNextExpected] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(MODE2_CONFIG.timeLimit);
  const [wrongTaps, setWrongTaps] = useState(0);
  const [correctFirstTaps, setCorrectFirstTaps] = useState(0);
  const [hintText, setHintText] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    if (!isStarted || isComplete) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up!
          clearInterval(timerRef.current!);
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const score = calculateFirstResponseScore(0, correctFirstTaps, INVESTIGATION_STEPS.length, wrongTaps);
          setIsComplete(true);
          onComplete({
            scenarioId: scenario.id,
            score,
            wrongTaps,
            correctFirstTaps,
            timeRemaining: 0,
            totalTime: elapsed,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isComplete, correctFirstTaps, wrongTaps, scenario.id, onComplete]);

  const startGame = () => {
    setIsStarted(true);
    startTimeRef.current = Date.now();
  };

  const handleTap = useCallback((id: string) => {
    if (isComplete) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isLocked) return;

    if (card.correctOrder === nextExpected) {
      // Correct!
      setCorrectFirstTaps(prev => prev + 1);
      setCards(prev => prev.map(c =>
        c.id === id
          ? { ...c, tappedOrder: nextExpected, isCorrect: true, isLocked: true }
          : c
      ));
      setNextExpected(prev => prev + 1);
      setHintText(null);

      // Check if all done
      if (nextExpected + 1 === INVESTIGATION_STEPS.length) {
        setIsComplete(true);
        if (timerRef.current) clearInterval(timerRef.current);
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const finalTimeRemaining = timeRemaining;
        const score = calculateFirstResponseScore(
          finalTimeRemaining, nextExpected + 1, INVESTIGATION_STEPS.length, wrongTaps
        );
        onComplete({
          scenarioId: scenario.id,
          score,
          wrongTaps,
          correctFirstTaps: nextExpected + 1,
          timeRemaining: finalTimeRemaining,
          totalTime: elapsed,
        });
      }
    } else {
      // Wrong!
      setWrongTaps(prev => prev + 1);
      setTimeRemaining(prev => Math.max(0, prev - MODE2_CONFIG.timePenaltyPerWrong));

      const correctStep = INVESTIGATION_STEPS[nextExpected];
      setHintText(`Step ${nextExpected + 1} is: ${correctStep.fullName}`);

      setCards(prev => prev.map(c =>
        c.id === id ? { ...c, isCorrect: false } : c
      ));

      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === id && c.isCorrect === false ? { ...c, isCorrect: null } : c
        ));
      }, 600);
    }
  }, [cards, nextExpected, isComplete, timeRemaining, wrongTaps, scenario.id, onComplete, correctFirstTaps]);

  const completedCount = cards.filter(c => c.isLocked).length;
  const completedLabels = cards
    .filter(c => c.isLocked)
    .sort((a, b) => (a.tappedOrder ?? 0) - (b.tappedOrder ?? 0))
    .map(c => c.shortName);

  const timeColor = timeRemaining <= 10 ? 'text-red-500' : timeRemaining <= 30 ? 'text-amber-500' : 'text-slate-800';

  // Scenario briefing screen
  if (!isStarted) {
    return (
      <div className="px-4 py-8 max-w-xl mx-auto">
        <div className="bg-white/95 rounded-2xl p-6 border border-slate-200 shadow-lg text-center">
          <div className="text-5xl mb-4">{scenario.icon}</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{scenario.title}</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">{scenario.briefing}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800 font-medium">
              Tap the 10 investigation steps in the correct CDC order. You have {MODE2_CONFIG.timeLimit} seconds.
              Wrong taps cost {MODE2_CONFIG.timePenaltyPerWrong} seconds each!
            </p>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg active:scale-[0.98] transition-transform"
          >
            Start Investigation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      {/* Header with timer */}
      <div className="bg-white/95 rounded-xl p-4 mb-4 border border-slate-200 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{scenario.title}</h2>
            <p className="text-xs text-slate-400">Tap steps in order</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold font-mono ${timeColor}`}>
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
            {wrongTaps > 0 && (
              <div className="text-xs text-red-500">-{wrongTaps * MODE2_CONFIG.timePenaltyPerWrong}s penalties</div>
            )}
          </div>
        </div>
      </div>

      {/* Hint */}
      {hintText && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 mb-4 animate-slideUp">
          <p className="text-sm text-amber-800 font-medium">💡 {hintText}</p>
        </div>
      )}

      {/* Cards — two columns for 10 steps */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {cards.map(card => (
          <SequenceCard
            key={card.id}
            card={card}
            onTap={handleTap}
            disabled={isComplete}
          />
        ))}
      </div>

      {/* Progress */}
      <SequenceBar
        totalSteps={INVESTIGATION_STEPS.length}
        completedSteps={completedCount}
        labels={completedLabels}
      />
    </div>
  );
}
