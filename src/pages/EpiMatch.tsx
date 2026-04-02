// src/pages/EpiMatch.tsx
// Epi Match — Memory card matching with mutation events

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { matchDecks } from '../data/epi-match-data';
import type { MatchDeck, MatchCard, MatchPhase } from '../types/epi-match';

// Scoring
const MATCH_POINTS = 150;
const TIME_BONUS_MULTIPLIER = 25;
const SPEED_BONUS = 300;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(deck: MatchDeck): MatchCard[] {
  const cards: MatchCard[] = [];
  deck.pairs.forEach((pair, idx) => {
    cards.push({
      id: `${pair.id}-A`,
      pairId: pair.id,
      label: pair.cardA.label,
      category: pair.cardA.category,
      side: 'A',
      state: 'face-down',
      gridPosition: idx * 2,
    });
    cards.push({
      id: `${pair.id}-B`,
      pairId: pair.id,
      label: pair.cardB.label,
      category: pair.cardB.category,
      side: 'B',
      state: 'face-down',
      gridPosition: idx * 2 + 1,
    });
  });
  // Shuffle positions
  const positions = shuffle(cards.map((_, i) => i));
  return cards.map((c, i) => ({ ...c, gridPosition: positions[i] }));
}

function getRank(cleared: boolean, timeRemaining: number, totalTime: number, mutationCount: number) {
  if (cleared && mutationCount === 0) return { icon: '\uD83C\uDFC5', title: 'Epi Expert' };
  if (cleared && timeRemaining > totalTime * 0.5) return { icon: '\uD83E\uDD47', title: 'Rapid Responder' };
  if (cleared) return { icon: '\uD83E\uDD48', title: 'Investigator' };
  return { icon: '\uD83E\uDD49', title: 'Trainee' };
}

export function EpiMatch() {
  const [phase, setPhase] = useState<MatchPhase>('attract');
  const [deck, setDeck] = useState<MatchDeck | null>(null);
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [mutationCountdown, setMutationCountdown] = useState(0);
  const [mutationCount, setMutationCount] = useState(0);
  const [showMutation, setShowMutation] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Idle auto-reset
  useEffect(() => {
    if (phase === 'complete') {
      idleTimerRef.current = setTimeout(() => setPhase('attract'), 15000);
      return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
    }
  }, [phase]);

  // Game timer
  useEffect(() => {
    if (phase !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPhase('complete');
          return 0;
        }
        return prev - 1;
      });
      setMutationCountdown(prev => {
        if (prev <= 1 && deck) {
          // Trigger mutation
          triggerMutation();
          return deck.mutationIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, deck]);

  // Check for win
  useEffect(() => {
    if (deck && matchedPairIds.size === deck.pairs.length && phase === 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => setPhase('complete'), 600);
    }
  }, [matchedPairIds, deck, phase]);

  const triggerMutation = useCallback(() => {
    setMutationCount(prev => prev + 1);
    setShowMutation(true);
    // After animation, reshuffle unmatched face-down cards
    setTimeout(() => {
      setCards(prev => {
        const matched = prev.filter(c => c.state === 'matched');
        const unmatched = prev.filter(c => c.state !== 'matched');
        const positions = shuffle(unmatched.map(c => c.gridPosition));
        const reshuffled = unmatched.map((c, i) => ({ ...c, gridPosition: positions[i] }));
        return [...matched, ...reshuffled];
      });
      setShowMutation(false);
    }, 1500);
  }, []);

  const selectDeck = (d: MatchDeck) => {
    setDeck(d);
    const newCards = buildCards(d);
    setCards(newCards);
    setFlippedIds([]);
    setMatchedPairIds(new Set());
    setStreak(0);
    setMaxStreak(0);
    setScore(0);
    setAttempts(0);
    setTimeRemaining(d.timerSeconds);
    setMutationCountdown(d.mutationIntervalSeconds);
    setMutationCount(0);
    // Preview flash
    setPhase('preview');
    setTimeout(() => setPhase('playing'), 1500);
  };

  const handleCardTap = (cardId: string) => {
    if (phase !== 'playing' || showMutation) return;
    if (flippedIds.length >= 2) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.state === 'matched' || flippedIds.includes(cardId)) return;

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(prev => prev + 1);
      const [id1, id2] = newFlipped;
      const c1 = cards.find(c => c.id === id1)!;
      const c2 = cards.find(c => c.id === id2)!;

      if (c1.pairId === c2.pairId) {
        // Match!
        const newStreak = streak + 1;
        setStreak(newStreak);
        setMaxStreak(prev => Math.max(prev, newStreak));
        const multiplier = newStreak >= 3 ? 2 : newStreak >= 2 ? 1.5 : 1;
        setScore(prev => prev + Math.round(MATCH_POINTS * multiplier));
        setMatchedPairIds(prev => new Set(prev).add(c1.pairId));
        setCards(prev => prev.map(c =>
          c.pairId === c1.pairId ? { ...c, state: 'matched' as const } : c
        ));
        setFlippedIds([]);
      } else {
        // No match — flip back after delay
        setStreak(0);
        flipTimeoutRef.current = setTimeout(() => {
          setFlippedIds([]);
        }, 1200);
      }
    }
  };

  // ── ATTRACT ──
  if (phase === 'attract') {
    return (
      <GameShell theme="match" heroTitle="Epi Match" heroSubtitle="Match the science. Beat the clock.">
        <div
          className="flex flex-col items-center justify-center px-8"
          style={{ height: 'calc(100vh - 200px)', cursor: 'pointer' }}
          onClick={() => setPhase('deck-select')}
        >
          <div className="grid grid-cols-4 gap-4 mb-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border-2"
                style={{
                  width: 100, height: 130,
                  background: 'rgba(212,175,55,0.25)',
                  borderColor: 'rgba(212,175,55,0.5)',
                  animation: `pulse-glow 2s ease-in-out ${i * 200}ms infinite`,
                }}
              />
            ))}
          </div>
          <p className="text-3xl font-bold animate-pulse" style={{ color: '#D4920B' }}>
            TAP TO PLAY
          </p>
        </div>
      </GameShell>
    );
  }

  // ── DECK SELECT ──
  if (phase === 'deck-select') {
    return (
      <GameShell theme="match" heroTitle="Epi Match" heroSubtitle="Choose your deck" backPath="/">
        <div className="px-6 py-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {matchDecks.map(d => (
              <button
                key={d.id}
                onClick={() => selectDeck(d)}
                className="surface-solid rounded-2xl p-6 text-left transition-all active:scale-[0.97]"
                style={{ minHeight: 220 }}
              >
                <div className="text-4xl mb-3">{d.icon}</div>
                <h3 className="text-xl font-bold mb-1" style={{ color: '#A16D07' }}>{d.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{d.description}</p>
                <div className="flex gap-2">
                  <span className="pill pill-themed">{d.pairs.length} pairs</span>
                  <span className="pill pill-themed">{d.timerSeconds}s</span>
                  <span className={`pill ${
                    d.difficulty === 'easy' ? 'bg-green-50 text-green-700 border-green-200' :
                    d.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-orange-50 text-orange-700 border-orange-200'
                  }`} style={{ border: '1px solid' }}>
                    {d.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </GameShell>
    );
  }

  // ── COMPLETE ──
  if (phase === 'complete' && deck) {
    const cleared = matchedPairIds.size === deck.pairs.length;
    const timeBonus = cleared ? timeRemaining * TIME_BONUS_MULTIPLIER : 0;
    const speedBonus = cleared && mutationCount === 0 ? SPEED_BONUS : 0;
    const finalScore = score + timeBonus + speedBonus;
    const matchAccuracy = attempts > 0 ? matchedPairIds.size / attempts : 0;
    const rank = getRank(cleared, timeRemaining, deck.timerSeconds, mutationCount);

    return (
      <GameShell theme="match" heroTitle="Epi Match" heroSubtitle="Results">
        <div className="flex flex-col items-center justify-center px-8" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="surface-solid text-center p-8 rounded-2xl max-w-lg w-full animate-slide-up">
            <div className="text-5xl mb-2">{rank.icon}</div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#A16D07' }}>{rank.title}</h2>
            <p className="text-sm text-gray-500 mb-1">{deck.name}</p>
            <p className="text-4xl font-bold mb-6 animate-score-pop" style={{ color: '#D4920B' }}>
              {finalScore} points
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="stat-card">
                <div className="stat-label">Pairs Found</div>
                <div className="stat-value" style={{ color: '#D4920B' }}>{matchedPairIds.size}/{deck.pairs.length}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Match Accuracy</div>
                <div className="stat-value" style={{ color: '#D4920B' }}>{Math.round(matchAccuracy * 100)}%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Best Streak</div>
                <div className="stat-value" style={{ color: '#D4920B' }}>{maxStreak}x</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Mutations</div>
                <div className="stat-value">{mutationCount}</div>
              </div>
            </div>

            {timeBonus > 0 && <p className="text-sm text-gray-500">Time bonus: +{timeBonus}</p>}
            {speedBonus > 0 && <p className="text-sm font-semibold" style={{ color: '#D4AF37' }}>Speed bonus: +{speedBonus}</p>}

            <div className="flex gap-3 justify-center mt-6">
              <button className="btn-emboss btn-emboss-primary" onClick={() => selectDeck(deck)}>
                PLAY AGAIN
              </button>
              <button className="btn-emboss" onClick={() => setPhase('deck-select')}>
                OTHER DECK
              </button>
              <a href="/" className="btn-emboss">BACK</a>
            </div>
          </div>
        </div>
      </GameShell>
    );
  }

  // ── PLAYING / PREVIEW ──
  if (!deck) return null;

  const sortedCards = [...cards].sort((a, b) => a.gridPosition - b.gridPosition);
  const isPreview = phase === 'preview';

  return (
    <GameShell theme="match" heroTitle="Epi Match" heroSubtitle={deck.name} showNav={false}>
      <div className="px-4 py-3" style={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">{deck.icon}</span>
            <span className="text-sm font-semibold" style={{ color: '#D4920B' }}>
              Matches: {matchedPairIds.size} of {deck.pairs.length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xl font-bold" style={{ color: timeRemaining <= 10 ? '#dc2626' : '#A16D07' }}>
              {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:{String(timeRemaining % 60).padStart(2, '0')}
            </span>
            <span className="text-lg font-bold" style={{ color: '#D4AF37' }}>{score} pts</span>
          </div>
        </div>

        {/* Mutation warning */}
        {showMutation && (
          <div
            className="absolute inset-x-0 top-24 z-30 text-center py-4 animate-slide-up"
            style={{ background: 'rgba(212,146,11,0.95)', color: 'white' }}
          >
            <span className="text-2xl font-bold">{'\u26A0\uFE0F'} MUTATION EVENT {'\u26A0\uFE0F'}</span>
          </div>
        )}

        {/* Bottom bar */}
        <div className="flex items-center justify-between mb-3">
          <div>
            {streak > 1 && (
              <span className="text-sm font-bold" style={{ color: '#dc2626' }}>
                {'\uD83D\uDD25'} Streak: x{streak >= 3 ? 2 : 1.5}
              </span>
            )}
          </div>
          <span className="text-xs" style={{ color: '#A16D07' }}>
            {'\u26A0\uFE0F'} Mutation in {mutationCountdown}s
          </span>
        </div>

        {/* Card grid */}
        <div
          className="grid gap-3 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${deck.gridCols}, 1fr)`,
            maxWidth: deck.gridCols * 175,
            maxHeight: 'calc(100vh - 220px)',
            overflow: 'auto',
          }}
        >
          {sortedCards.map(card => {
            const isFaceUp = isPreview || card.state === 'matched' || flippedIds.includes(card.id);
            const isMatched = card.state === 'matched';

            return (
              <button
                key={card.id}
                onClick={() => handleCardTap(card.id)}
                disabled={phase !== 'playing' || isMatched || showMutation}
                className="relative rounded-xl border-2 transition-all duration-200"
                style={{
                  minHeight: deck.gridRows <= 4 ? 130 : 110,
                  perspective: '600px',
                  background: isFaceUp
                    ? isMatched
                      ? 'linear-gradient(135deg, #FBBF24, #D4920B)'
                      : 'linear-gradient(180deg, #ffffff, #f9f8f6)'
                    : 'linear-gradient(135deg, rgba(212,175,55,0.35), rgba(184,134,11,0.25))',
                  borderColor: isMatched ? '#D4920B' : isFaceUp ? 'rgba(212,146,11,0.5)' : 'rgba(212,175,55,0.45)',
                  opacity: isMatched ? 0.85 : 1,
                  cursor: phase === 'playing' && !isMatched ? 'pointer' : 'default',
                  transform: showMutation && !isMatched ? 'scale(0.95)' : 'scale(1)',
                }}
              >
                {isFaceUp ? (
                  <div className="px-2 py-3 text-center">
                    <div
                      className="text-[10px] uppercase tracking-wider font-semibold mb-1"
                      style={{ color: isMatched ? 'rgba(255,255,255,0.8)' : '#A16D07' }}
                    >
                      {card.category}
                    </div>
                    <div
                      className="font-bold leading-tight"
                      style={{
                        fontSize: card.label.length > 25 ? 12 : card.label.length > 18 ? 13 : 15,
                        color: isMatched ? '#ffffff' : '#1a1207',
                      }}
                    >
                      {card.label}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-3xl opacity-80" style={{ color: '#D4AF37' }}>?</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}

export default EpiMatch;
