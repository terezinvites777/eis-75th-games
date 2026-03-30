// src/pages/FirstResponse.tsx
// First Response — PPE sequencing + outbreak investigation speed game
// Kiosk only — not on the live site

import { useState, useCallback } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { ModeSelect } from '../components/first-response/ModeSelect';
import { PPEChallenge } from '../components/first-response/PPEChallenge';
import { OutbreakSequence } from '../components/first-response/OutbreakSequence';
import { ScoreScreen } from '../components/first-response/ScoreScreen';
import {
  PPE_DONNING,
  PPE_DOFFING,
  INVESTIGATION_STEPS,
  MODE2_CONFIG,
  randomFrom,
  PPE_TEACHING_MOMENTS,
  INVESTIGATION_TEACHING_MOMENTS,
} from '../data/first-response-data';
import type { GameMode } from '../types/first-response';

type Phase = 'mode-select' | 'playing' | 'score';

interface GameResult {
  mode: GameMode;
  score: number;
  maxScore: number;
  totalTime: number;
  wrongTaps: number;
  teachingMoment: string;
  // Suit Up
  donningTime?: number;
  doffingTime?: number;
  donningErrors?: number;
  doffingErrors?: number;
  // First Response
  correctSteps?: number;
  totalSteps?: number;
  timeRemaining?: number;
}

export function FirstResponse() {
  const [phase, setPhase] = useState<Phase>('mode-select');
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);

  const handleSelectMode = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
    setPhase('playing');
    setResult(null);
  }, []);

  const handlePPEComplete = useCallback((data: {
    donningTime: number;
    doffingTime: number;
    donningErrors: number;
    doffingErrors: number;
    score: number;
  }) => {
    const maxScore = PPE_DONNING.basePoints + PPE_DOFFING.basePoints;
    setResult({
      mode: 'suit-up',
      score: data.score,
      maxScore,
      totalTime: data.donningTime + data.doffingTime,
      wrongTaps: data.donningErrors + data.doffingErrors,
      teachingMoment: randomFrom(PPE_TEACHING_MOMENTS),
      donningTime: data.donningTime,
      doffingTime: data.doffingTime,
      donningErrors: data.donningErrors,
      doffingErrors: data.doffingErrors,
    });
    setPhase('score');
  }, []);

  const handleOutbreakComplete = useCallback((data: {
    scenarioId: string;
    score: number;
    wrongTaps: number;
    correctFirstTaps: number;
    timeRemaining: number;
    totalTime: number;
  }) => {
    const maxScore = (INVESTIGATION_STEPS.length * MODE2_CONFIG.pointsPerCorrect) + MODE2_CONFIG.timeLimit;
    setResult({
      mode: 'first-response',
      score: data.score,
      maxScore,
      totalTime: data.totalTime,
      wrongTaps: data.wrongTaps,
      teachingMoment: randomFrom(INVESTIGATION_TEACHING_MOMENTS),
      correctSteps: data.correctFirstTaps,
      totalSteps: INVESTIGATION_STEPS.length,
      timeRemaining: data.timeRemaining,
    });
    setPhase('score');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setPhase('mode-select');
    setSelectedMode(null);
    setResult(null);
  }, []);

  return (
    <GameShell
      theme="patient-zero"
      heroTitle="First Response"
      heroSubtitle="How fast can you respond?"
      backPath="/"
    >
      {phase === 'mode-select' && (
        <ModeSelect onSelectMode={handleSelectMode} />
      )}

      {phase === 'playing' && selectedMode === 'suit-up' && (
        <PPEChallenge onComplete={handlePPEComplete} />
      )}

      {phase === 'playing' && selectedMode === 'first-response' && (
        <OutbreakSequence onComplete={handleOutbreakComplete} />
      )}

      {phase === 'score' && result && (
        <ScoreScreen
          mode={result.mode}
          score={result.score}
          maxScore={result.maxScore}
          totalTime={result.totalTime}
          wrongTaps={result.wrongTaps}
          teachingMoment={result.teachingMoment}
          donningTime={result.donningTime}
          doffingTime={result.doffingTime}
          donningErrors={result.donningErrors}
          doffingErrors={result.doffingErrors}
          correctSteps={result.correctSteps}
          totalSteps={result.totalSteps}
          timeRemaining={result.timeRemaining}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </GameShell>
  );
}

export default FirstResponse;
