// src/pages/OutbreakTiles.tsx
// Outbreak Tiles — Rapid grid classification game (3 rounds)

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { getRandomPrompt, shuffleTiles } from '../data/outbreak-tiles-data';
import type { TilePrompt, RoundResult } from '../types/outbreak-tiles';

type Phase = 'attract' | 'reading' | 'playing' | 'round-review' | 'round-transition' | 'complete';

// Scoring constants
const CORRECT_TAP_POINTS = 100;
const WRONG_TAP_POINTS = -50;
const WRONG_TAP_PENALTY_SECONDS = 3;
const TIME_BONUS_MULTIPLIER = 20;
const PERFECT_ROUND_BONUS = 200;
const PERFECT_GAME_BONUS = 500;

function getRank(accuracy: number, perfectGame: boolean) {
  if (perfectGame) return { icon: '\uD83C\uDFC5', title: 'EIS Ready' };
  if (accuracy >= 0.9) return { icon: '\uD83E\uDD47', title: 'Field Epidemiologist' };
  if (accuracy >= 0.7) return { icon: '\uD83E\uDD48', title: 'Disease Detective' };
  return { icon: '\uD83E\uDD49', title: 'Trainee' };
}

export function OutbreakTiles() {
  const [phase, setPhase] = useState<Phase>('attract');
  const [currentRound, setCurrentRound] = useState(1);
  const [prompt, setPrompt] = useState<TilePrompt | null>(null);
  const [shuffledTileIds, setShuffledTileIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [score, setScore] = useState(0);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Idle auto-reset to attract
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (phase === 'complete') {
      idleTimerRef.current = setTimeout(() => {
        setPhase('attract');
      }, 15000);
    }
  }, [phase]);

  useEffect(() => {
    resetIdleTimer();
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [resetIdleTimer]);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Time's up — show review
          setPhase('round-review');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const startGame = () => {
    setScore(0);
    setRoundResults([]);
    setCurrentRound(1);
    startRound(1);
  };

  const startRound = (round: 1 | 2 | 3) => {
    const p = getRandomPrompt(round);
    setPrompt(p);
    setShuffledTileIds(shuffleTiles(p.tiles.map(t => t.id)));
    setSelectedIds(new Set());
    setWrongIds(new Set());
    setTimeRemaining(p.timerSeconds);
    setPhase('reading');
    // 2-second read delay
    setTimeout(() => setPhase('playing'), 2000);
  };

  const correctTotal = prompt ? prompt.tiles.filter(t => t.isCorrect).length : 0;
  const correctFound = prompt ? prompt.tiles.filter(t => t.isCorrect && selectedIds.has(t.id)).length : 0;

  // Check if all correct tiles found
  useEffect(() => {
    if (phase === 'playing' && prompt && correctFound === correctTotal && correctTotal > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      // Small delay for the last tap to register visually
      setTimeout(() => setPhase('round-review'), 400);
    }
  }, [correctFound, correctTotal, phase, prompt]);

  const handleTileTap = (tileId: string) => {
    if (phase !== 'playing' || !prompt) return;
    if (selectedIds.has(tileId) || wrongIds.has(tileId)) return;

    const tile = prompt.tiles.find(t => t.id === tileId);
    if (!tile) return;

    if (tile.isCorrect) {
      setSelectedIds(prev => new Set(prev).add(tileId));
      setScore(prev => prev + CORRECT_TAP_POINTS);
    } else {
      setWrongIds(prev => new Set(prev).add(tileId));
      setScore(prev => prev + WRONG_TAP_POINTS);
      setTimeRemaining(prev => Math.max(0, prev + WRONG_TAP_PENALTY_SECONDS * -1));
    }
  };

  // Finalize round when entering review
  useEffect(() => {
    if (phase !== 'round-review' || !prompt) return;

    const wrongCount = wrongIds.size;
    const perfect = correctFound === correctTotal && wrongCount === 0;
    const timeBonus = timeRemaining * TIME_BONUS_MULTIPLIER;
    const perfectBonus = perfect ? PERFECT_ROUND_BONUS : 0;
    const roundScore = (correctFound * CORRECT_TAP_POINTS) + (wrongCount * WRONG_TAP_POINTS) + timeBonus + perfectBonus;

    setScore(prev => prev - (correctFound * CORRECT_TAP_POINTS) - (wrongCount * WRONG_TAP_POINTS) + roundScore);

    const result: RoundResult = {
      round: currentRound,
      correctTaps: correctFound,
      wrongTaps: wrongCount,
      totalCorrect: correctTotal,
      timeRemaining,
      score: roundScore,
      perfect,
    };

    setRoundResults(prev => [...prev, result]);

    // After 2-second review, transition
    setTimeout(() => {
      if (currentRound < 3) {
        setPhase('round-transition');
      } else {
        setPhase('complete');
      }
    }, 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleNextRound = () => {
    const next = (currentRound + 1) as 1 | 2 | 3;
    setCurrentRound(next);
    startRound(next);
  };

  const totalScore = roundResults.reduce((sum, r) => sum + r.score, 0);
  const totalCorrect = roundResults.reduce((sum, r) => sum + r.correctTaps, 0);
  const totalWrong = roundResults.reduce((sum, r) => sum + r.wrongTaps, 0);
  const totalPossible = roundResults.reduce((sum, r) => sum + r.totalCorrect, 0);
  const accuracy = totalPossible > 0 ? totalCorrect / totalPossible : 0;
  const perfectGame = roundResults.length === 3 && roundResults.every(r => r.perfect);
  const finalScore = totalScore + (perfectGame ? PERFECT_GAME_BONUS : 0);

  // ── ATTRACT SCREEN ──
  if (phase === 'attract') {
    return (
      <GameShell theme="tiles" heroTitle="Outbreak Tiles" heroSubtitle="How fast can you classify?">
        <div
          className="flex flex-col items-center justify-center px-8"
          style={{ height: 'calc(100vh - 200px)', cursor: 'pointer' }}
          onClick={startGame}
        >
          <div className="grid grid-cols-4 gap-3 mb-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border-2"
                style={{
                  width: 120, height: 90,
                  background: i % 3 === 0 ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.2)',
                  borderColor: 'rgba(212,175,55,0.55)',
                  animation: `pulse-glow 2s ease-in-out ${i * 150}ms infinite`,
                }}
              />
            ))}
          </div>
          <p className="text-3xl font-bold animate-pulse" style={{ color: '#D4AF37' }}>
            TAP TO PLAY
          </p>
          <p className="text-lg mt-2" style={{ color: 'rgba(212,175,55,0.8)' }}>
            3 rounds of rapid classification
          </p>
        </div>
      </GameShell>
    );
  }

  // ── ROUND TRANSITION SCREEN ──
  if (phase === 'round-transition') {
    const lastResult = roundResults[roundResults.length - 1];
    return (
      <GameShell theme="tiles" heroTitle="Outbreak Tiles" heroSubtitle={`Round ${currentRound} of 3`}>
        <div
          className="flex flex-col items-center justify-center px-8"
          style={{ height: 'calc(100vh - 200px)' }}
        >
          <div className="surface-solid text-center p-10 rounded-2xl max-w-md animate-slide-up">
            <p className="text-lg font-semibold mb-2" style={{ color: '#D4AF37' }}>
              Round {currentRound} Complete
            </p>
            <p className="text-4xl font-bold mb-4" style={{ color: '#B8860B' }}>
              +{lastResult?.score ?? 0}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              {lastResult?.correctTaps}/{lastResult?.totalCorrect} correct
              {lastResult?.perfect && ' \u2014 PERFECT!'}
            </p>
            <div className="text-2xl font-bold mb-6" style={{ color: '#D4AF37' }}>
              ROUND {currentRound + 1}
            </div>
            <button
              className="btn-emboss btn-emboss-primary btn-emboss-lg"
              onClick={handleNextRound}
            >
              START ROUND {currentRound + 1}
            </button>
          </div>
        </div>
      </GameShell>
    );
  }

  // ── COMPLETE SCREEN ──
  if (phase === 'complete') {
    const rank = getRank(accuracy, perfectGame);
    return (
      <GameShell theme="tiles" heroTitle="Outbreak Tiles" heroSubtitle="Results">
        <div
          className="flex flex-col items-center justify-center px-8"
          style={{ height: 'calc(100vh - 200px)' }}
        >
          <div className="surface-solid text-center p-8 rounded-2xl max-w-lg w-full animate-slide-up">
            <div className="text-5xl mb-2">{rank.icon}</div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#B8860B' }}>{rank.title}</h2>
            <p className="text-4xl font-bold mb-6 animate-score-pop" style={{ color: '#D4AF37' }}>
              {finalScore} points
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {roundResults.map((r, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-label">Round {r.round}</div>
                  <div className="stat-value" style={{ color: '#D4AF37' }}>+{r.score}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {r.correctTaps}/{r.totalCorrect} {r.perfect ? '\u2B50' : ''}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="stat-card">
                <div className="stat-label">Accuracy</div>
                <div className="stat-value" style={{ color: '#D4AF37' }}>{Math.round(accuracy * 100)}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Wrong Taps</div>
                <div className="stat-value" style={{ color: totalWrong > 0 ? '#dc2626' : '#D4AF37' }}>{totalWrong}</div>
              </div>
            </div>

            {perfectGame && (
              <p className="text-sm font-semibold mb-4" style={{ color: '#D4AF37' }}>
                PERFECT GAME BONUS: +{PERFECT_GAME_BONUS}
              </p>
            )}

            <div className="flex gap-3 justify-center">
              <button className="btn-emboss btn-emboss-primary" onClick={startGame}>
                PLAY AGAIN
              </button>
              <a href="/" className="btn-emboss">
                BACK TO GAMES
              </a>
            </div>
          </div>
        </div>
      </GameShell>
    );
  }

  // ── PLAYING / READING / ROUND-REVIEW ──
  if (!prompt) return null;

  const tilesById = new Map(prompt.tiles.map(t => [t.id, t]));

  return (
    <GameShell theme="tiles" heroTitle="Outbreak Tiles" heroSubtitle={`Round ${currentRound} of 3`} showNav={false}>
      <div className="px-4 py-3" style={{ height: 'calc(100vh - 100px)' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
              ROUND {currentRound} of 3
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xl font-bold" style={{ color: timeRemaining <= 5 ? '#dc2626' : '#B8860B' }}>
              {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:{String(timeRemaining % 60).padStart(2, '0')}
            </span>
            <span className="text-lg font-bold" style={{ color: '#D4AF37' }}>
              {score} pts
            </span>
          </div>
        </div>

        {/* Prompt bar */}
        <div
          className="rounded-xl px-6 py-3 mb-4 flex items-center justify-between"
          style={{ background: 'rgba(212,175,55,0.12)', border: '2px solid rgba(212,175,55,0.3)' }}
        >
          <span className="text-lg font-bold" style={{ color: '#B8860B' }}>
            {prompt.promptText}
          </span>
          <span className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
            {correctFound} of {correctTotal} found
          </span>
        </div>

        {/* Reading overlay */}
        {phase === 'reading' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
            <div className="text-white text-3xl font-bold animate-pulse">
              READ THE PROMPT...
            </div>
          </div>
        )}

        {/* Tile grid */}
        <div
          className="grid gap-3 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${prompt.gridCols}, 1fr)`,
            maxWidth: prompt.gridCols * 170,
          }}
        >
          {shuffledTileIds.map(tileId => {
            const tile = tilesById.get(tileId)!;
            const isSelected = selectedIds.has(tileId);
            const isWrong = wrongIds.has(tileId);
            const isRevealed = phase === 'round-review' && tile.isCorrect && !isSelected;

            let bg = 'linear-gradient(180deg, #ffffff 0%, #f9f8f6 100%)';
            let borderColor = 'rgba(212,175,55,0.2)';
            let textColor = '#8B6914';

            if (isSelected) {
              bg = 'linear-gradient(135deg, #D4AF37, #B8860B)';
              borderColor = '#8B6914';
              textColor = '#ffffff';
            } else if (isWrong) {
              bg = 'linear-gradient(135deg, #fca5a5, #ef4444)';
              borderColor = '#dc2626';
              textColor = '#ffffff';
            } else if (isRevealed) {
              bg = 'rgba(212,175,55,0.2)';
              borderColor = '#D4AF37';
            }

            return (
              <button
                key={tileId}
                onClick={() => handleTileTap(tileId)}
                disabled={phase !== 'playing' || isSelected || isWrong}
                className="relative rounded-xl border-2 px-3 py-4 text-center transition-all duration-150"
                style={{
                  background: bg,
                  borderColor,
                  color: textColor,
                  minHeight: 90,
                  fontSize: tile.label.length > 30 ? 13 : tile.label.length > 20 ? 14 : 16,
                  fontWeight: 600,
                  cursor: phase === 'playing' && !isSelected && !isWrong ? 'pointer' : 'default',
                  opacity: phase === 'reading' ? 0.5 : 1,
                  animation: isWrong ? 'shake 0.3s ease-in-out' : undefined,
                }}
              >
                {tile.label}
                {isSelected && (
                  <span className="absolute top-1 right-2 text-lg">{'\u2705'}</span>
                )}
                {isRevealed && (
                  <span className="absolute top-1 right-2 text-sm" style={{ color: '#D4AF37' }}>missed</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
        }
      `}</style>
    </GameShell>
  );
}

export default OutbreakTiles;
