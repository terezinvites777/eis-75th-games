// src/pages/OutbreakNetwork.tsx
// Outbreak Network — Contact tracing puzzle game
// Trace the chain. Find Patient Zero.

import { useState, useCallback, useEffect, useRef } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { NetworkCanvas } from '../components/outbreak-network/NetworkCanvas';
import { NodeDetail } from '../components/outbreak-network/NodeDetail';
import { InvestigationPanel } from '../components/outbreak-network/InvestigationPanel';
import { ScoreScreen } from '../components/outbreak-network/ScoreScreen';
import { Search, Users, Eye } from 'lucide-react';
import {
  generatePuzzle,
  incrementPlayCount,
  getHighScore,
  setHighScore,
  calculateNetworkScore,
  getRandomFactoid,
  DIFFICULTY_CONFIGS,
  type NetworkPuzzle,
  type NetworkScore,
  type DifficultyLevel,
} from '../data/outbreak-network-data';
import type { GamePhase } from '../types/outbreak-network';

const DIFFICULTY_OPTIONS: { key: DifficultyLevel; description: string }[] = [
  { key: 'easy', description: 'Great for first-timers. Smaller network, more clues to start.' },
  { key: 'medium', description: 'A real challenge. Larger network, fewer starting clues.' },
  { key: 'hard', description: 'Expert mode. Maximum network, minimal resources.' },
];

export function OutbreakNetwork() {
  // Difficulty selection
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);

  // Game state
  const [puzzle, setPuzzle] = useState<NetworkPuzzle | null>(null);
  const [phase, setPhase] = useState<GamePhase>('playing');
  const [revealedNodes, setRevealedNodes] = useState<Set<string>>(new Set());
  const [tokensRemaining, setTokensRemaining] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [score, setScore] = useState<NetworkScore | null>(null);
  const [factoid, setFactoid] = useState('');
  const [highScore, setHighScoreState] = useState(getHighScore());
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start game with chosen difficulty
  const startGame = useCallback((difficulty: DifficultyLevel) => {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const newPuzzle = generatePuzzle(difficulty);

    setSelectedDifficulty(difficulty);
    setPuzzle(newPuzzle);
    setShowDifficultySelect(false);
    setPhase('playing');
    setRevealedNodes(new Set(newPuzzle.initialRevealed));
    setTokensRemaining(config.investigationTokens);
    setTotalTokens(config.investigationTokens);
    setSelectedNodeId(null);
    setHighlightedNodeId(null);
    setScore(null);
    setFactoid('');
    setIsNewHighScore(false);
    setElapsedSeconds(0);
    startTimeRef.current = Date.now();
    setHighScoreState(getHighScore());
  }, []);

  // Return to difficulty select
  const handlePlayAgain = useCallback(() => {
    setShowDifficultySelect(true);
    setPuzzle(null);
  }, []);

  // Timer
  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Handle node click — select/highlight only
  const handleNodeClick = useCallback((nodeId: string) => {
    if (!puzzle) return;

    if (revealedNodes.has(nodeId)) {
      setSelectedNodeId(nodeId);
      setHighlightedNodeId(prev => prev === nodeId ? null : nodeId);
      return;
    }

    setSelectedNodeId(nodeId);
    setHighlightedNodeId(null);
  }, [puzzle, revealedNodes]);

  // Investigate a node (spend a token)
  const handleInvestigate = useCallback(() => {
    if (!selectedNodeId || !puzzle || tokensRemaining <= 0) return;
    if (revealedNodes.has(selectedNodeId)) return;

    setRevealedNodes(prev => new Set([...prev, selectedNodeId]));
    setTokensRemaining(prev => prev - 1);
    setHighlightedNodeId(selectedNodeId);
  }, [selectedNodeId, puzzle, tokensRemaining, revealedNodes]);

  // Accuse a node as Patient Zero (called after user confirms in NodeDetail)
  const handleAccuse = useCallback((nodeId: string) => {
    if (!puzzle) return;

    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const correct = nodeId === puzzle.patientZeroId;
    const networkScore = calculateNetworkScore(correct, tokensRemaining, totalTokens, elapsed);

    incrementPlayCount();
    const currentHigh = getHighScore();
    if (networkScore.totalScore > currentHigh) {
      setHighScore(networkScore.totalScore);
      setIsNewHighScore(true);
    }

    setScore(networkScore);
    setFactoid(getRandomFactoid());
    setHighScoreState(Math.max(currentHigh, networkScore.totalScore));

    setPhase('reveal');
    setTimeout(() => {
      setPhase('score');
    }, Math.max(2000, puzzle.edges.filter(e => e.isTransmissionPath).length * 300 + 500));
  }, [puzzle, tokensRemaining, totalTokens]);

  // ── Difficulty Select Screen ──
  if (showDifficultySelect) {
    return (
      <GameShell
        theme="command"
        heroTitle="Outbreak Network"
        heroSubtitle="Trace the chain. Find Patient Zero."
        backPath="/"
      >
        <div className="px-4 py-8 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Choose Your Difficulty
            </h2>
            <p className="text-sm text-white/70">
              Larger networks are harder — fewer tokens means fewer chances to investigate.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {DIFFICULTY_OPTIONS.map(({ key, description }) => {
              const config = DIFFICULTY_CONFIGS[key];
              return (
                <button
                  key={key}
                  onClick={() => startGame(key)}
                  className="bg-white/95 rounded-xl p-5 border border-slate-200 shadow-lg text-left hover:ring-2 hover:ring-blue-400 hover:shadow-xl transition-all active:scale-[0.99] group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                      {config.label}
                    </h3>
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      key === 'easy'
                        ? 'bg-green-100 text-green-700'
                        : key === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {key}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-4">{description}</p>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <Users size={16} className="text-slate-500 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-slate-800">{config.nodeCount}</div>
                        <div className="text-[10px] text-slate-500 uppercase">People</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <Search size={16} className="text-blue-500 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-slate-800">{config.investigationTokens}</div>
                        <div className="text-[10px] text-slate-500 uppercase">Tokens</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <Eye size={16} className="text-amber-500 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-slate-800">{config.initialRevealedCount}</div>
                        <div className="text-[10px] text-slate-500 uppercase">Clues</div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {highScore > 0 && (
            <div className="mt-6 text-center">
              <span className="text-sm text-white/60">Your High Score: </span>
              <span className="text-sm font-bold text-amber-400">{highScore}</span>
            </div>
          )}
        </div>
      </GameShell>
    );
  }

  // ── Game Screen ──
  if (!puzzle || !selectedDifficulty) return null;

  const selectedNode = selectedNodeId ? puzzle.nodes.find(n => n.id === selectedNodeId) : null;
  const difficultyConfig = DIFFICULTY_CONFIGS[selectedDifficulty];

  return (
    <GameShell
      theme="command"
      heroTitle="Outbreak Network"
      heroSubtitle="Trace the chain. Find Patient Zero."
      backPath="/"
    >
      {phase === 'score' && score ? (
        <ScoreScreen
          score={score}
          factoid={factoid}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          elapsedSeconds={elapsedSeconds}
          onPlayAgain={handlePlayAgain}
        />
      ) : (
        <div className="px-4 py-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
            {/* Network visualization */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-700 overflow-hidden" style={{ minHeight: 450 }}>
              <NetworkCanvas
                nodes={puzzle.nodes}
                edges={puzzle.edges}
                revealedNodes={revealedNodes}
                selectedNodeId={selectedNodeId}
                highlightedNodeId={highlightedNodeId}
                identifiedPZId={null}
                phase={phase}
                onNodeClick={handleNodeClick}
              />
            </div>

            {/* Side panel */}
            <div className="flex flex-col gap-4">
              <InvestigationPanel
                tokensRemaining={tokensRemaining}
                totalTokens={totalTokens}
                elapsedSeconds={elapsedSeconds}
                phase={phase}
                difficulty={difficultyConfig.label}
              />

              {/* Node detail with investigate + accuse buttons */}
              {selectedNode && phase === 'playing' && (
                <NodeDetail
                  node={selectedNode}
                  isRevealed={revealedNodes.has(selectedNode.id)}
                  phase={phase}
                  onInvestigate={handleInvestigate}
                  onAccuse={handleAccuse}
                  canInvestigate={tokensRemaining > 0 && !revealedNodes.has(selectedNode.id)}
                  tokensRemaining={tokensRemaining}
                />
              )}

              {/* How to play — shown when no node selected */}
              {!selectedNode && phase === 'playing' && (
                <div className="bg-white/95 rounded-xl p-4 border border-slate-200 shadow-md">
                  <h3 className="text-sm font-bold text-slate-800 mb-2">How to Play</h3>
                  <ul className="text-xs text-slate-700 space-y-1.5 leading-relaxed">
                    <li>Tap any person in the network to select them</li>
                    <li><strong>Investigate</strong> — spend a token to reveal if they're infected</li>
                    <li><strong>Patient Zero!</strong> — accuse them as the source</li>
                    <li className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500"></span> Infected (shows generation) <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 ml-2"></span> Healthy</li>
                    <li>Use generation numbers to trace back to the source</li>
                  </ul>
                </div>
              )}

              {/* Reveal phase info */}
              {phase === 'reveal' && (
                <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 text-center animate-pulse">
                  <p className="text-red-300 font-bold text-sm">Tracing transmission chain...</p>
                </div>
              )}

              {/* Network stats */}
              <div className="bg-white/95 rounded-xl p-3 border border-slate-200 shadow-md">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-slate-800">{puzzle.nodes.length}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">People</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-800">{puzzle.edges.length}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">Connections</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </GameShell>
  );
}

export default OutbreakNetwork;
