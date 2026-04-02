// src/pages/Command.tsx
// Outbreak Origins — Map-based investigation/deduction game
// REPLACES the old Outbreak Command game

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameShell } from '../components/layout/GameShell';
import { USMapInteractive } from '../components/command/USMapInteractive';
import { originsScenarios, pathogenOptions, sourceOptions } from '../data/origins-scenarios';
import { initializeMap, advanceTurn, calculateScore } from '../engine/origins-engine';
import type { MapState } from '../engine/origins-engine';
import type { OriginsScenario, CollectedEvidence, OriginsPhase, StateEvidence } from '../types/origins';

const INITIAL_TOKENS = 7;

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  hard: 'bg-orange-100 text-orange-800 border-orange-300',
};

function getRank(correct: number) {
  if (correct === 3) return { icon: '\uD83C\uDFC5', title: 'Chief Epidemiologist' };
  if (correct === 2) return { icon: '\uD83E\uDD48', title: 'EIS Officer' };
  if (correct === 1) return { icon: '\uD83E\uDD49', title: 'First-Year Fellow' };
  return { icon: '\uD83D\uDCCB', title: 'Observer' };
}

export function Command() {
  const [phase, setPhase] = useState<OriginsPhase>('attract');
  const [scenario, setScenario] = useState<OriginsScenario | null>(null);
  const [mapState, setMapState] = useState<MapState>({ statuses: {}, caseCounts: {} });
  const [currentTurn, setCurrentTurn] = useState(1);
  const [tokensRemaining, setTokensRemaining] = useState(INITIAL_TOKENS);
  const [investigatedStates, setInvestigatedStates] = useState<Set<string>>(new Set());
  const [collectedEvidence, setCollectedEvidence] = useState<CollectedEvidence[]>([]);
  const [activeEvidence, setActiveEvidence] = useState<StateEvidence | null>(null);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>(null);

  // Visit tracking for multi-visit states (Legionnaires)
  const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});

  // Answer state
  const [selectedPathogen, setSelectedPathogen] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);

  // Results
  const [scoreResult, setScoreResult] = useState<{ total: number; breakdown: { label: string; points: number }[] } | null>(null);

  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Idle auto-reset
  useEffect(() => {
    if (phase === 'results') {
      idleTimerRef.current = setTimeout(() => setPhase('attract'), 20000);
      return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
    }
  }, [phase]);

  const selectScenario = (s: OriginsScenario) => {
    setScenario(s);
    setMapState(initializeMap(s));
    setCurrentTurn(1);
    setTokensRemaining(INITIAL_TOKENS);
    setInvestigatedStates(new Set());
    setCollectedEvidence([]);
    setActiveEvidence(null);
    setVisitCounts({});
    setSelectedPathogen(null);
    setSelectedSource(null);
    setSelectedOrigin(null);
    setScoreResult(null);
    setPhase('briefing');
  };

  const startInvestigating = () => {
    setPhase('investigating');
  };

  const handleStateClick = useCallback((stateId: string) => {
    if (phase !== 'investigating' || !scenario) return;
    if (tokensRemaining <= 0) return;

    // Check if state has cases
    const hasCases = mapState.statuses[stateId] && mapState.statuses[stateId] !== 'clear';

    // Find evidence for this state
    const currentVisits = (visitCounts[stateId] || 0) + 1;
    const evidence = scenario.evidence.find(e =>
      e.stateId === stateId && (e.visitNumber === currentVisits || (!e.visitNumber && currentVisits === 1))
    );

    if (!evidence && !hasCases) {
      // No cases, no evidence — free peek
      setActiveEvidence({
        stateId, type: 'geographic', icon: '\uD83D\uDDFA\uFE0F',
        title: `No Reports \u2014 ${stateId}`,
        content: `No reported cases in ${stateId}. Investigation not warranted.`,
      });
      return;
    }

    if (!evidence) {
      // Already fully investigated this state
      setActiveEvidence({
        stateId, type: 'geographic', icon: '\uD83D\uDD0D',
        title: `Already Investigated \u2014 ${stateId}`,
        content: 'No new evidence available at this location. Review your evidence log for previous findings.',
      });
      return;
    }

    // Spend token and collect evidence
    setTokensRemaining(prev => prev - 1);
    setVisitCounts(prev => ({ ...prev, [stateId]: currentVisits }));
    setInvestigatedStates(prev => new Set(prev).add(stateId));
    setActiveEvidence(evidence);
    setCollectedEvidence(prev => [...prev, { stateId, turn: currentTurn, evidence }]);

    // Update map status
    setMapState(prev => ({
      ...prev,
      statuses: { ...prev.statuses, [stateId]: 'investigated' },
    }));
  }, [phase, scenario, tokensRemaining, mapState, visitCounts, currentTurn]);

  const dismissEvidence = () => {
    setActiveEvidence(null);
    // Advance turn — outbreak spreads
    if (scenario) {
      setPhase('spreading');
      setTimeout(() => {
        setCurrentTurn(prev => {
          const next = prev + 1;
          const result = advanceTurn(mapState, scenario, prev, investigatedStates);
          setMapState(result.newMapState);
          return next;
        });
        // Check if out of tokens
        if (tokensRemaining <= 1) {
          // Force submission (this was the last token)
          setTimeout(() => setPhase('submitting'), 1500);
        } else {
          setTimeout(() => setPhase('investigating'), 1500);
        }
      }, 800);
    }
  };

  const handleSubmit = () => {
    if (!scenario || !selectedPathogen || !selectedSource || !selectedOrigin) return;

    const pathogenCorrect = selectedPathogen === scenario.pathogen;
    const sourceCorrect = selectedSource === scenario.source;
    const originCorrect = selectedOrigin === scenario.originState;
    const result = calculateScore(pathogenCorrect, sourceCorrect, originCorrect, tokensRemaining, currentTurn);
    setScoreResult(result);
    setPhase('results');
  };

  // Convert map state to OutbreakLocation format for USMapInteractive
  const mapLocations = Object.entries(mapState.caseCounts)
    .filter(([, cases]) => cases > 0)
    .map(([state, cases]) => ({ state, cases }));

  // ── ATTRACT ──
  if (phase === 'attract') {
    return (
      <GameShell theme="command" heroTitle="Outbreak Origins" heroSubtitle="Track the outbreak. Find the source.">
        <div
          className="flex flex-col items-center justify-center px-8"
          style={{ height: 'calc(100vh - 200px)', cursor: 'pointer' }}
          onClick={() => setPhase('scenario-select')}
        >
          <div className="w-full max-w-3xl opacity-50 mb-8">
            <USMapInteractive locations={[]} className="pointer-events-none" />
          </div>
          <p className="text-3xl font-bold animate-pulse" style={{ color: '#0057B8' }}>
            TAP TO PLAY
          </p>
          <p className="text-lg mt-2 text-blue-600/60">
            Investigate outbreaks. Find the source.
          </p>
        </div>
      </GameShell>
    );
  }

  // ── SCENARIO SELECT ──
  if (phase === 'scenario-select') {
    return (
      <GameShell theme="command" heroTitle="Outbreak Origins" heroSubtitle="Choose your investigation" backPath="/">
        <div className="px-6 py-6 max-w-5xl mx-auto">
          <div className="rounded-xl p-5 border border-blue-200 mb-6" style={{ background: 'rgba(239,246,255,0.9)' }}>
            <p className="text-lg" style={{ color: '#0b1220' }}>
              You are an EIS officer. Investigate outbreak states on the map, read the evidence, and identify the pathogen, source, and origin. You have 7 investigation tokens.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {originsScenarios.map(s => (
              <button
                key={s.id}
                onClick={() => selectScenario(s)}
                className="surface-solid rounded-2xl p-5 text-left transition-all active:scale-[0.97]"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold" style={{ color: '#003d7a' }}>{s.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[s.difficulty]}`}>
                    {s.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{s.subtitle}</p>
                <p className="text-xs text-gray-400">{s.basedOn}</p>
              </button>
            ))}
          </div>
        </div>
      </GameShell>
    );
  }

  if (!scenario) return null;

  // ── BRIEFING ──
  if (phase === 'briefing') {
    return (
      <GameShell theme="command" heroTitle={scenario.title} heroSubtitle="Outbreak Origins" showNav={false}>
        <div className="flex items-center justify-center px-8" style={{ height: 'calc(100vh - 100px)' }}>
          <div className="surface-solid rounded-2xl p-8 max-w-2xl animate-slide-up text-center">
            <div className="text-4xl mb-4">{'\uD83D\uDCE1'}</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#003d7a' }}>DISPATCH ALERT</h2>
            <p className="text-lg mb-6 leading-relaxed" style={{ color: '#0b1220' }}>
              {scenario.briefing}
            </p>
            <div className="flex gap-3 justify-center text-sm mb-6">
              <span className="pill pill-blue">{scenario.initialStates.length} states affected</span>
              <span className="pill pill-blue">7 investigation tokens</span>
            </div>
            <button className="btn-emboss btn-emboss-primary btn-emboss-lg" onClick={startInvestigating}>
              BEGIN INVESTIGATION
            </button>
          </div>
        </div>
      </GameShell>
    );
  }

  // ── SUBMIT THEORY ──
  if (phase === 'submitting') {
    return (
      <GameShell theme="command" heroTitle="Submit Your Theory" heroSubtitle={scenario.title} showNav={false}>
        <div className="px-6 py-4" style={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}>
          <div className="max-w-4xl mx-auto">
            {/* Pathogen */}
            <div className="mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#003d7a' }}>
                PATHOGEN
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {pathogenOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedPathogen(opt.id)}
                    className="rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all active:scale-[0.97]"
                    style={{
                      background: selectedPathogen === opt.id ? 'linear-gradient(135deg, #0077B6, #0057B8)' : 'white',
                      color: selectedPathogen === opt.id ? 'white' : '#0b1220',
                      borderColor: selectedPathogen === opt.id ? '#0057B8' : 'rgba(0,87,184,0.2)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Source */}
            <div className="mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#003d7a' }}>
                SOURCE
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {sourceOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedSource(opt.id)}
                    className="rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all active:scale-[0.97]"
                    style={{
                      background: selectedSource === opt.id ? 'linear-gradient(135deg, #0077B6, #0057B8)' : 'white',
                      color: selectedSource === opt.id ? 'white' : '#0b1220',
                      borderColor: selectedSource === opt.id ? '#0057B8' : 'rgba(0,87,184,0.2)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Origin State */}
            <div className="mb-5">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#003d7a' }}>
                ORIGIN STATE — tap a state on the map
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <USMapInteractive
                    locations={mapLocations}
                    onStateClick={(id) => setSelectedOrigin(id)}
                    style={{ maxHeight: 280 }}
                  />
                </div>
                {selectedOrigin && (
                  <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold text-lg">
                    {selectedOrigin}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 justify-center mt-4">
              <button
                className="btn-emboss btn-emboss-primary btn-emboss-lg"
                disabled={!selectedPathogen || !selectedSource || !selectedOrigin}
                onClick={handleSubmit}
                style={{ opacity: (!selectedPathogen || !selectedSource || !selectedOrigin) ? 0.5 : 1 }}
              >
                CONFIRM & SUBMIT THEORY
              </button>
              <button className="btn-emboss" onClick={() => setPhase('investigating')}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </GameShell>
    );
  }

  // ── RESULTS ──
  if (phase === 'results' && scoreResult) {
    const pathogenCorrect = selectedPathogen === scenario.pathogen;
    const sourceCorrect = selectedSource === scenario.source;
    const originCorrect = selectedOrigin === scenario.originState;
    const correctCount = [pathogenCorrect, sourceCorrect, originCorrect].filter(Boolean).length;
    const rank = getRank(correctCount);

    const correctPathogenLabel = pathogenOptions.find(o => o.id === scenario.pathogen)?.label;
    const correctSourceLabel = sourceOptions.find(o => o.id === scenario.source)?.label;

    return (
      <GameShell theme="command" heroTitle="Investigation Complete" heroSubtitle={scenario.title} showNav={false}>
        <div className="px-6 py-4 overflow-auto" style={{ height: 'calc(100vh - 100px)' }}>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
              {/* Left: Score */}
              <div className="surface-solid rounded-2xl p-6 animate-slide-up">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{rank.icon}</div>
                  <h2 className="text-2xl font-bold" style={{ color: '#003d7a' }}>{rank.title}</h2>
                  <p className="text-4xl font-bold mt-2 animate-score-pop" style={{ color: '#0057B8' }}>
                    {scoreResult.total} points
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  {scoreResult.breakdown.map((b, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{b.label}</span>
                      <span className="font-bold" style={{ color: '#0057B8' }}>+{b.points}</span>
                    </div>
                  ))}
                </div>

                {/* Your answers vs correct */}
                <div className="border-t pt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>{pathogenCorrect ? '\u2705' : '\u274C'}</span>
                    <span className="text-gray-600">Pathogen:</span>
                    <span className="font-semibold">{correctPathogenLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{sourceCorrect ? '\u2705' : '\u274C'}</span>
                    <span className="text-gray-600">Source:</span>
                    <span className="font-semibold">{correctSourceLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{originCorrect ? '\u2705' : '\u274C'}</span>
                    <span className="text-gray-600">Origin:</span>
                    <span className="font-semibold">{scenario.originState}</span>
                  </div>
                </div>
              </div>

              {/* Right: The Real Investigation */}
              <div className="surface-solid rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#003d7a' }}>The Real Investigation</h3>
                <p className="text-sm leading-relaxed text-gray-700 mb-4">
                  {scenario.postGameText}
                </p>

                <h4 className="text-sm font-bold mb-2" style={{ color: '#003d7a' }}>Optimal Path</h4>
                <div className="flex gap-2 mb-4">
                  {scenario.optimalPath.map((stateId, i) => (
                    <span key={i} className="pill pill-blue">{i + 1}. {stateId}</span>
                  ))}
                  <span className="pill">{scenario.optimalTokens} tokens</span>
                </div>

                <p className="text-xs text-gray-400">{scenario.basedOn}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center mt-6">
              <button className="btn-emboss btn-emboss-primary" onClick={() => selectScenario(scenario)}>
                PLAY AGAIN
              </button>
              <button className="btn-emboss" onClick={() => setPhase('scenario-select')}>
                OTHER SCENARIO
              </button>
              <a href="/" className="btn-emboss">BACK TO GAMES</a>
            </div>
          </div>
        </div>
      </GameShell>
    );
  }

  // ── INVESTIGATING / SPREADING (main gameplay) ──
  return (
    <GameShell theme="command" heroTitle={scenario.title} heroSubtitle="Outbreak Origins" showNav={false}>
      <div className="px-4 py-2" style={{ height: 'calc(100vh - 100px)' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: '#003d7a' }}>
            Turn {currentTurn}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold" style={{ color: '#0057B8' }}>
              {'\uD83D\uDD0D'} {tokensRemaining}/{INITIAL_TOKENS}
            </span>
            <button
              className="btn-emboss btn-emboss-sm"
              onClick={() => setPhase('submitting')}
              style={{ background: 'linear-gradient(135deg, #0077B6, #0057B8)', color: 'white', borderColor: 'rgba(255,255,255,0.25)' }}
            >
              SUBMIT THEORY
            </button>
          </div>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 340px', height: 'calc(100% - 40px)' }}>
          {/* Map */}
          <div className="relative">
            <USMapInteractive
              locations={mapLocations}
              onStateClick={handleStateClick}
              className="h-full"
            />

            {/* Spreading overlay */}
            {phase === 'spreading' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl z-10">
                <div className="px-6 py-3 rounded-full text-white font-bold text-lg" style={{ background: 'rgba(220,38,38,0.9)' }}>
                  OUTBREAK SPREADING...
                </div>
              </div>
            )}

            {/* Evidence card overlay */}
            {activeEvidence && (
              <div className="absolute inset-x-4 bottom-4 z-20 animate-slide-up">
                <div className="surface-solid rounded-2xl p-5 border border-blue-200 shadow-xl" style={{ maxHeight: 300, overflow: 'auto' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{activeEvidence.icon}</span>
                      <h3 className="text-lg font-bold" style={{ color: '#003d7a' }}>
                        {activeEvidence.title}
                      </h3>
                    </div>
                    <button
                      onClick={dismissEvidence}
                      className="text-gray-400 active:text-gray-600 text-xl px-2"
                    >
                      {'\u2715'}
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 mb-4">
                    {activeEvidence.content}
                  </p>
                  <button
                    className="btn-emboss btn-emboss-primary w-full"
                    onClick={dismissEvidence}
                  >
                    GOT IT \u2014 NEXT
                  </button>
                </div>
              </div>
            )}

            {/* Bottom hint */}
            <div className="absolute bottom-2 left-2 right-2 z-0">
              <div className="text-center text-xs py-1 rounded-full" style={{ background: 'rgba(239,246,255,0.9)', color: '#003d7a' }}>
                {tokensRemaining > 0
                  ? '\uD83D\uDCA1 Tap a red state to investigate'
                  : '\u26A0\uFE0F No tokens remaining \u2014 submit your theory'}
              </div>
            </div>
          </div>

          {/* Evidence Log */}
          <div className="flex flex-col rounded-xl border border-blue-200 overflow-hidden" style={{ background: 'rgba(239,246,255,0.95)' }}>
            <div className="px-4 py-2 border-b border-blue-100">
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#003d7a' }}>
                Evidence Log
              </h3>
            </div>
            <div className="flex-1 overflow-auto px-3 py-2 space-y-2">
              {collectedEvidence.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-8">
                  No evidence collected yet. Tap a state to investigate.
                </p>
              )}
              {[...collectedEvidence].reverse().map((ce, i) => {
                const key = `${ce.stateId}-${ce.turn}`;
                const isExpanded = expandedEvidenceId === key;
                return (
                  <button
                    key={i}
                    onClick={() => setExpandedEvidenceId(isExpanded ? null : key)}
                    className="w-full text-left rounded-lg border px-3 py-2 transition-all"
                    style={{
                      background: 'white',
                      borderColor: 'rgba(0,87,184,0.15)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{ce.evidence.icon}</span>
                      <span className="text-xs font-bold" style={{ color: '#003d7a' }}>{ce.evidence.title}</span>
                      <span className="text-[10px] text-gray-400 ml-auto">T{ce.turn}</span>
                    </div>
                    {isExpanded && (
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        {ce.evidence.content}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit button at bottom of log */}
            <div className="px-3 py-2 border-t border-blue-100">
              <button
                className="btn-emboss btn-emboss-primary w-full btn-emboss-sm"
                onClick={() => setPhase('submitting')}
              >
                SUBMIT THEORY {'\u2192'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </GameShell>
  );
}

export default Command;
