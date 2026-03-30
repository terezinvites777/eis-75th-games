// src/pages/EpiJeopardy.tsx
// Epi Jeopardy — Head-to-Head Trivia for two players on one touch screen
// Split screen: Player 1 (left) vs Player 2 (right)

import { useState, useCallback, useEffect, useRef } from 'react';
import { GameShell } from '../components/layout/GameShell';
import {
  CATEGORIES,
  GAME_CONFIG,
  selectRoundQuestions,
  calculateQuestionPoints,
  incrementGamesPlayed,
  type TriviaQuestion,
  type Category,
} from '../data/epi-jeopardy-data';
import type { PlayerId } from '../types/epi-jeopardy';

type Phase = 'attract' | 'ready' | 'category-reveal' | 'question' | 'result' | 'final-score';

interface PlayerState {
  score: number;
  streak: number;
  longestStreak: number;
  correct: number;
  wrong: number;
  selectedIndex: number | null;
  answerTimeMs: number | null;
  locked: boolean;
  pointsThisRound: number;
}

const initialPlayer = (): PlayerState => ({
  score: 0, streak: 0, longestStreak: 0, correct: 0, wrong: 0,
  selectedIndex: null, answerTimeMs: null, locked: false, pointsThisRound: 0,
});

export function EpiJeopardy() {
  const [phase, setPhase] = useState<Phase>('attract');
  const [p1Ready, setP1Ready] = useState(false);
  const [p2Ready, setP2Ready] = useState(false);
  const [singlePlayer, setSinglePlayer] = useState(false);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [p1, setP1] = useState<PlayerState>(initialPlayer());
  const [p2, setP2] = useState<PlayerState>(initialPlayer());
  const [timeRemaining, setTimeRemaining] = useState(GAME_CONFIG.timePerQuestion);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [winner, setWinner] = useState<'player1' | 'player2' | 'tie' | null>(null);

  const questionStartRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[questionIdx] || null;

  // Reset everything for a new game
  const resetGame = useCallback(() => {
    setPhase('attract');
    setP1Ready(false);
    setP2Ready(false);
    setSinglePlayer(false);
    setQuestions([]);
    setQuestionIdx(0);
    setP1(initialPlayer());
    setP2(initialPlayer());
    setTimeRemaining(GAME_CONFIG.timePerQuestion);
    setCurrentCategory(null);
    setWinner(null);
    if (timerRef.current) clearInterval(timerRef.current);
    if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
  }, []);

  // Start game after both ready (or single-player fallback)
  const startGame = useCallback((isSingle: boolean) => {
    const q = selectRoundQuestions();
    setQuestions(q);
    setQuestionIdx(0);
    setSinglePlayer(isSingle);
    // Show first category
    const cat = CATEGORIES.find(c => c.id === q[0].category)!;
    setCurrentCategory(cat);
    setPhase('category-reveal');
    setTimeout(() => {
      setPhase('question');
      setTimeRemaining(GAME_CONFIG.timePerQuestion);
      questionStartRef.current = Date.now();
    }, GAME_CONFIG.categoryRevealTime * 1000);
  }, []);

  // Handle ready taps
  const handleReadyTap = useCallback((player: PlayerId) => {
    if (phase !== 'attract' && phase !== 'ready') return;

    if (phase === 'attract') {
      setPhase('ready');
    }

    if (player === 'player1') setP1Ready(true);
    if (player === 'player2') setP2Ready(true);
  }, [phase]);

  // Check if both ready
  useEffect(() => {
    if (phase !== 'ready') return;

    if (p1Ready && p2Ready) {
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
      startGame(false);
      return;
    }

    // Single-player fallback: if only one taps within 5 seconds
    if ((p1Ready || p2Ready) && !readyTimeoutRef.current) {
      readyTimeoutRef.current = setTimeout(() => {
        if (p1Ready && !p2Ready) startGame(true);
        else if (p2Ready && !p1Ready) startGame(true);
        readyTimeoutRef.current = null;
      }, 5000);
    }

    return () => {
      if (readyTimeoutRef.current) {
        clearTimeout(readyTimeoutRef.current);
        readyTimeoutRef.current = null;
      }
    };
  }, [phase, p1Ready, p2Ready, startGame]);

  // Question timer
  useEffect(() => {
    if (phase !== 'question') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up — go to result
          clearInterval(timerRef.current!);
          showResult();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, questionIdx]);

  // Show result after both answered or timeout
  const showResult = useCallback(() => {
    if (phase !== 'question') return;
    if (timerRef.current) clearInterval(timerRef.current);

    const q = questions[questionIdx];
    if (!q) return;

    // Score Player 1
    setP1(prev => {
      if (prev.selectedIndex === null) {
        return { ...prev, wrong: prev.wrong + 1, streak: 0, pointsThisRound: 0 };
      }
      const isCorrect = prev.selectedIndex === q.correctIndex;
      if (isCorrect) {
        const pts = calculateQuestionPoints(q.points, prev.answerTimeMs || 12000, true, prev.streak);
        return {
          ...prev,
          correct: prev.correct + 1,
          streak: prev.streak + 1,
          longestStreak: Math.max(prev.longestStreak, prev.streak + 1),
          score: prev.score + pts,
          pointsThisRound: pts,
        };
      }
      return { ...prev, wrong: prev.wrong + 1, streak: 0, pointsThisRound: 0 };
    });

    // Score Player 2 (if not single player)
    if (!singlePlayer) {
      setP2(prev => {
        if (prev.selectedIndex === null) {
          return { ...prev, wrong: prev.wrong + 1, streak: 0, pointsThisRound: 0 };
        }
        const isCorrect = prev.selectedIndex === q.correctIndex;
        if (isCorrect) {
          const pts = calculateQuestionPoints(q.points, prev.answerTimeMs || 12000, true, prev.streak);
          return {
            ...prev,
            correct: prev.correct + 1,
            streak: prev.streak + 1,
            longestStreak: Math.max(prev.longestStreak, prev.streak + 1),
            score: prev.score + pts,
            pointsThisRound: pts,
          };
        }
        return { ...prev, wrong: prev.wrong + 1, streak: 0, pointsThisRound: 0 };
      });
    }

    setPhase('result');
  }, [phase, questions, questionIdx, singlePlayer]);

  // Check if both answered
  useEffect(() => {
    if (phase !== 'question') return;
    if (singlePlayer && p1.locked) {
      setTimeout(showResult, 500);
    } else if (!singlePlayer && p1.locked && p2.locked) {
      setTimeout(showResult, 500);
    }
  }, [p1.locked, p2.locked, phase, singlePlayer, showResult]);

  // Handle answer tap
  const handleAnswer = useCallback((player: PlayerId, optionIndex: number) => {
    if (phase !== 'question') return;
    const timeMs = Date.now() - questionStartRef.current;

    if (player === 'player1' && !p1.locked) {
      setP1(prev => ({ ...prev, selectedIndex: optionIndex, answerTimeMs: timeMs, locked: true }));
    }
    if (player === 'player2' && !p2.locked && !singlePlayer) {
      setP2(prev => ({ ...prev, selectedIndex: optionIndex, answerTimeMs: timeMs, locked: true }));
    }
  }, [phase, p1.locked, p2.locked, singlePlayer]);

  // Advance to next question or final score
  const nextQuestion = useCallback(() => {
    const nextIdx = questionIdx + 1;
    if (nextIdx >= questions.length) {
      // Game over
      incrementGamesPlayed();
      setWinner(
        p1.score > p2.score ? 'player1' :
        p2.score > p1.score ? 'player2' : 'tie'
      );
      setPhase('final-score');
      return;
    }

    setQuestionIdx(nextIdx);
    // Reset player round state
    setP1(prev => ({ ...prev, selectedIndex: null, answerTimeMs: null, locked: false, pointsThisRound: 0 }));
    setP2(prev => ({ ...prev, selectedIndex: null, answerTimeMs: null, locked: false, pointsThisRound: 0 }));

    // Category reveal
    const cat = CATEGORIES.find(c => c.id === questions[nextIdx].category)!;
    setCurrentCategory(cat);
    setPhase('category-reveal');
    setTimeout(() => {
      setPhase('question');
      setTimeRemaining(GAME_CONFIG.timePerQuestion);
      questionStartRef.current = Date.now();
    }, GAME_CONFIG.categoryRevealTime * 1000);
  }, [questionIdx, questions, p1.score, p2.score]);

  // Auto-advance from result screen
  useEffect(() => {
    if (phase !== 'result') return;
    const t = setTimeout(nextQuestion, GAME_CONFIG.resultDisplayTime * 1000);
    return () => clearTimeout(t);
  }, [phase, nextQuestion]);

  // Auto-reset from final score
  useEffect(() => {
    if (phase !== 'final-score') return;
    const t = setTimeout(resetGame, GAME_CONFIG.finalScoreDisplayTime * 1000);
    return () => clearTimeout(t);
  }, [phase, resetGame]);

  const LETTERS = ['A', 'B', 'C', 'D'];

  // ═══════════════════════════════════════════
  // ATTRACT SCREEN
  // ═══════════════════════════════════════════
  if (phase === 'attract' || phase === 'ready') {
    return (
      <div className="fixed inset-0 flex" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)' }}>
        {/* Player 1 side */}
        <button
          onClick={() => handleReadyTap('player1')}
          className={`flex-1 flex flex-col items-center justify-center border-r border-amber-500/30 transition-all duration-500 ${
            p1Ready ? 'bg-blue-600/20' : 'active:bg-blue-500/20'
          }`}
        >
          <div className="text-6xl mb-6">🧬</div>
          {p1Ready ? (
            <div className="text-3xl font-bold text-green-400 animate-pulse">READY!</div>
          ) : (
            <>
              <div className="text-2xl font-bold text-white mb-2">TAP THIS SIDE</div>
              <div className="text-lg text-blue-300">to play as Player 1</div>
            </>
          )}
        </button>

        {/* Center divider text */}
        <div className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400 mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              EPI JEOPARDY
            </div>
            <div className="text-sm text-white/50">Head to Head</div>
            {phase === 'ready' && !(p1Ready && p2Ready) && (
              <div className="text-xs text-white/40 mt-2">
                {p1Ready || p2Ready ? 'Waiting for other player... (starting solo in 5s)' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Player 2 side */}
        <button
          onClick={() => handleReadyTap('player2')}
          className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 ${
            p2Ready ? 'bg-red-600/20' : 'active:bg-red-500/20'
          }`}
        >
          <div className="text-6xl mb-6">🔬</div>
          {p2Ready ? (
            <div className="text-3xl font-bold text-green-400 animate-pulse">READY!</div>
          ) : (
            <>
              <div className="text-2xl font-bold text-white mb-2">TAP THIS SIDE</div>
              <div className="text-lg text-red-300">to play as Player 2</div>
            </>
          )}
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // CATEGORY REVEAL
  // ═══════════════════════════════════════════
  if (phase === 'category-reveal' && currentCategory) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: currentCategory.color }}>
        <div className="text-center animate-slideUp">
          <div className="text-8xl mb-6">{currentCategory.icon}</div>
          <h2 className="text-4xl font-bold text-white mb-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {currentCategory.name}
          </h2>
          <p className="text-lg text-white/70">{currentCategory.description}</p>
          <div className="mt-4 text-white/50 text-sm">
            Question {questionIdx + 1} of {questions.length}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // QUESTION SCREEN (split-screen)
  // ═══════════════════════════════════════════
  if (phase === 'question' && currentQuestion) {
    const cat = CATEGORIES.find(c => c.id === currentQuestion.category);
    const timerColor = timeRemaining <= 5 ? 'text-red-500' : timeRemaining <= 8 ? 'text-amber-400' : 'text-white';

    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)' }}>
        {/* Header: category + question number + timer */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="text-xl">{cat?.icon}</span>
            <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">{cat?.name}</span>
          </div>
          <div className="text-sm text-white/60">Q {questionIdx + 1}/{questions.length}</div>
          <div className={`text-3xl font-bold font-mono ${timerColor} ${timeRemaining <= 5 ? 'animate-pulse' : ''}`}>
            {timeRemaining}
          </div>
        </div>

        {/* Timer bar */}
        <div className="h-1 bg-slate-800">
          <div
            className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(timeRemaining / GAME_CONFIG.timePerQuestion) * 100}%` }}
          />
        </div>

        {/* Question text */}
        <div className="px-8 py-5 text-center">
          <p className="text-xl font-bold text-white leading-relaxed" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            {currentQuestion.question}
          </p>
          <div className="mt-2 text-xs text-amber-400/60">{currentQuestion.points} points</div>
        </div>

        {/* Split answer zones */}
        <div className={`flex-1 flex ${singlePlayer ? '' : ''}`}>
          {/* Player 1 */}
          <div className={`${singlePlayer ? 'flex-1 max-w-2xl mx-auto' : 'flex-1 border-r border-amber-500/20'} flex flex-col px-4 pb-4`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-blue-400">PLAYER 1</span>
              <span className="text-sm font-bold text-amber-400">🏆 {p1.score}</span>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer('player1', i)}
                  disabled={p1.locked}
                  className={`flex-1 flex items-center gap-3 px-4 rounded-xl font-bold text-left transition-all ${
                    p1.locked && p1.selectedIndex === i
                      ? 'bg-amber-500 text-black border-2 border-amber-300'
                      : p1.locked
                      ? 'bg-slate-800/50 text-slate-600 border-2 border-slate-700'
                      : 'bg-slate-800 text-white border-2 border-amber-500/30 active:bg-amber-500/20 active:border-amber-400'
                  }`}
                  style={{ minHeight: 64 }}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    p1.locked && p1.selectedIndex === i ? 'bg-black/20 text-black' : 'bg-amber-500/20 text-amber-400'
                  }`}>{LETTERS[i]}</span>
                  <span className="text-sm">{opt}</span>
                </button>
              ))}
            </div>
            {p1.locked && (
              <div className="text-center mt-2 text-amber-400 font-bold text-sm">⚡ LOCKED IN</div>
            )}
          </div>

          {/* Player 2 (hidden in single player) */}
          {!singlePlayer && (
            <div className="flex-1 flex flex-col px-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-amber-400">🏆 {p2.score}</span>
                <span className="text-sm font-bold text-red-400">PLAYER 2</span>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer('player2', i)}
                    disabled={p2.locked}
                    className={`flex-1 flex items-center gap-3 px-4 rounded-xl font-bold text-left transition-all ${
                      p2.locked && p2.selectedIndex === i
                        ? 'bg-amber-500 text-black border-2 border-amber-300'
                        : p2.locked
                        ? 'bg-slate-800/50 text-slate-600 border-2 border-slate-700'
                        : 'bg-slate-800 text-white border-2 border-amber-500/30 active:bg-amber-500/20 active:border-amber-400'
                    }`}
                    style={{ minHeight: 64 }}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      p2.locked && p2.selectedIndex === i ? 'bg-black/20 text-black' : 'bg-amber-500/20 text-amber-400'
                    }`}>{LETTERS[i]}</span>
                    <span className="text-sm">{opt}</span>
                  </button>
                ))}
              </div>
              {p2.locked && (
                <div className="text-center mt-2 text-amber-400 font-bold text-sm">⚡ LOCKED IN</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // RESULT SCREEN
  // ═══════════════════════════════════════════
  if (phase === 'result' && currentQuestion) {
    const correctOpt = currentQuestion.options[currentQuestion.correctIndex];
    const p1Correct = p1.selectedIndex === currentQuestion.correctIndex;
    const p2Correct = p2.selectedIndex === currentQuestion.correctIndex;

    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)' }}>
        {/* Correct answer */}
        <div className="px-8 py-6 text-center border-b border-green-500/20">
          <div className="text-green-400 font-bold text-sm uppercase tracking-wider mb-1">Correct Answer</div>
          <div className="text-2xl font-bold text-white mb-3">
            {LETTERS[currentQuestion.correctIndex]}) {correctOpt}
          </div>
          <p className="text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">{currentQuestion.explanation}</p>
        </div>

        {/* Player results */}
        <div className={`flex-1 flex ${singlePlayer ? 'justify-center' : ''}`}>
          {/* P1 result */}
          <div className={`${singlePlayer ? 'max-w-md w-full' : 'flex-1 border-r border-amber-500/20'} flex flex-col items-center justify-center p-6`}>
            <div className="text-blue-400 font-bold text-sm mb-2">PLAYER 1</div>
            {p1.selectedIndex === null ? (
              <div className="text-slate-500 text-lg">⏱️ No answer</div>
            ) : p1Correct ? (
              <>
                <div className="text-5xl mb-2">✅</div>
                <div className="text-2xl font-bold text-green-400">+{p1.pointsThisRound} pts</div>
                {p1.streak >= 3 && (
                  <div className="text-amber-400 font-bold text-sm mt-1">🔥 {p1.streak}x STREAK!</div>
                )}
              </>
            ) : (
              <>
                <div className="text-5xl mb-2">❌</div>
                <div className="text-lg text-red-400">Wrong</div>
              </>
            )}
            <div className="mt-4 text-lg font-bold text-white">Total: {p1.score}</div>
          </div>

          {/* P2 result */}
          {!singlePlayer && (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="text-red-400 font-bold text-sm mb-2">PLAYER 2</div>
              {p2.selectedIndex === null ? (
                <div className="text-slate-500 text-lg">⏱️ No answer</div>
              ) : p2Correct ? (
                <>
                  <div className="text-5xl mb-2">✅</div>
                  <div className="text-2xl font-bold text-green-400">+{p2.pointsThisRound} pts</div>
                  {p2.streak >= 3 && (
                    <div className="text-amber-400 font-bold text-sm mt-1">🔥 {p2.streak}x STREAK!</div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-5xl mb-2">❌</div>
                  <div className="text-lg text-red-400">Wrong</div>
                </>
              )}
              <div className="mt-4 text-lg font-bold text-white">Total: {p2.score}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // FINAL SCORE
  // ═══════════════════════════════════════════
  if (phase === 'final-score') {
    const winnerLabel = winner === 'player1' ? 'Player 1 Wins!' :
                        winner === 'player2' ? 'Player 2 Wins!' : "It's a Tie!";

    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1810 50%, #1a1a2e 100%)' }}
        onClick={resetGame}
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-4xl font-bold text-amber-400 mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            EPI JEOPARDY
          </h2>
          <p className="text-2xl font-bold text-white">{winnerLabel}</p>
        </div>

        <div className={`flex gap-8 ${singlePlayer ? '' : ''}`}>
          {/* P1 stats */}
          <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 min-w-[200px] text-center border ${winner === 'player1' ? 'border-amber-400' : 'border-white/10'}`}>
            <div className="text-blue-400 font-bold text-sm mb-3">PLAYER 1</div>
            <div className="text-4xl font-bold text-white mb-3">{p1.score}</div>
            <div className="space-y-1 text-sm text-white/70">
              <div>{p1.correct}/{questions.length} correct</div>
              <div>Best streak: {p1.longestStreak}x</div>
            </div>
          </div>

          {/* P2 stats */}
          {!singlePlayer && (
            <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 min-w-[200px] text-center border ${winner === 'player2' ? 'border-amber-400' : 'border-white/10'}`}>
              <div className="text-red-400 font-bold text-sm mb-3">PLAYER 2</div>
              <div className="text-4xl font-bold text-white mb-3">{p2.score}</div>
              <div className="space-y-1 text-sm text-white/70">
                <div>{p2.correct}/{questions.length} correct</div>
                <div>Best streak: {p2.longestStreak}x</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 text-white/40 text-sm animate-pulse">
          TAP ANYWHERE TO PLAY AGAIN
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <GameShell theme="detective" heroTitle="Epi Jeopardy" heroSubtitle="Head-to-Head Trivia" backPath="/">
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-white/60">Loading...</p>
      </div>
    </GameShell>
  );
}

export default EpiJeopardy;
