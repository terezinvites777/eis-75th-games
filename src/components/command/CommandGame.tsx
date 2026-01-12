// src/components/command/CommandGame.tsx
import { useState, useEffect, useCallback } from 'react';
import type { CommandScenario, GameState, Action, GameEvent } from '../../types/command';
import { USMapInteractive } from './USMapInteractive';
import { ActionPanel } from './ActionPanel';
import { GameStats } from './GameStats';
import { EventDialog } from './EventDialog';
import { TutorialOverlay } from './TutorialOverlay';
import { ToastContainer, type ToastData } from './ActionToast';
import { Play, Pause, FastForward, RotateCcw, Trophy, XCircle } from 'lucide-react';

// State abbreviation to full name mapping
const STATE_NAMES: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
};

interface CommandGameProps {
  scenario: CommandScenario;
  onComplete: (won: boolean, score: number) => void;
  onBack: () => void;
}

type GameStatus = 'briefing' | 'playing' | 'paused' | 'won' | 'lost';

export function CommandGame({ scenario, onComplete, onBack }: CommandGameProps) {
  const [gameStatus, setGameStatus] = useState<GameStatus>('briefing');
  const [gameState, setGameState] = useState<GameState>(() => initGameState(scenario));
  const [actions, setActions] = useState<Action[]>(() => [...scenario.available_actions]);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [eventQueue, setEventQueue] = useState<GameEvent[]>([]);
  const [speed, setSpeed] = useState<1 | 2>(1);

  // Tutorial and toast states
  const [showTutorial, setShowTutorial] = useState(() => {
    // Check if user has seen tutorial before
    return !localStorage.getItem('command-tutorial-seen');
  });
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Add a toast notification
  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  // Remove a toast
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Dismiss tutorial and remember
  const dismissTutorial = useCallback(() => {
    setShowTutorial(false);
    localStorage.setItem('command-tutorial-seen', 'true');
  }, []);

  // Initialize game state
  function initGameState(s: CommandScenario): GameState {
    return {
      day: 1,
      cases: s.initial_state.cases,
      deaths: 0,
      budget: s.initial_state.budget,
      personnel: s.initial_state.personnel,
      r0: s.pathogen.r0,
      actions_taken: [],
      source_identified: false,
      outbreak_locations: [...s.initial_locations],
    };
  }

  // Check win/lose conditions
  const checkGameEnd = useCallback((state: GameState) => {
    const { win_state, lose_state } = scenario;

    // Check lose conditions
    if (lose_state.cases_above && state.cases >= lose_state.cases_above) {
      return 'lost';
    }
    if (lose_state.deaths_above && state.deaths >= lose_state.deaths_above) {
      return 'lost';
    }
    if (lose_state.budget_below !== undefined && state.budget <= lose_state.budget_below) {
      return 'lost';
    }

    // Check win conditions
    let won = true;
    if (win_state.source_identified && !state.source_identified) won = false;
    if (win_state.r_below && state.r0 >= win_state.r_below) won = false;
    if (win_state.cases_below && state.cases >= win_state.cases_below) won = false;

    if (won && (win_state.source_identified || win_state.r_below || win_state.cases_below)) {
      return 'won';
    }

    return null;
  }, [scenario]);

  // Game tick - advance day
  const advanceDay = useCallback(() => {
    if (gameStatus !== 'playing') return;

    setGameState(prev => {
      let newState = { ...prev, day: prev.day + 1 };

      // Apply daily case growth based on R0 (simplified)
      if (prev.r0 > 0) {
        const growthRate = Math.max(0, (prev.r0 - 1) * 0.1);
        const newCases = Math.floor(prev.cases * growthRate);
        newState.cases += newCases;

        // Calculate deaths based on fatality rate
        const newDeaths = Math.floor(newCases * scenario.pathogen.fatality_rate);
        newState.deaths += newDeaths;

        // Spread to new locations occasionally
        if (newCases > 10 && Math.random() > 0.7) {
          // All US states for realistic outbreak spread
          const states = [
            'AL', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'IA', 'ID',
            'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN',
            'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV',
            'NY', 'OH', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'UT', 'VA',
            'VT', 'WA', 'WI', 'WV', 'WY'
          ];
          const existingStates = newState.outbreak_locations.map(l => l.state);
          const newStates = states.filter(s => !existingStates.includes(s));
          if (newStates.length > 0) {
            const randomState = newStates[Math.floor(Math.random() * newStates.length)];
            // Find coordinates (simplified)
            newState.outbreak_locations = [
              ...newState.outbreak_locations,
              { state: randomState, cases: Math.floor(newCases * 0.2), lat: 0, lng: 0 }
            ];
          }
        }
      }

      return newState;
    });

    // Update active actions
    setActions(prev =>
      prev.map(action => {
        if (action.active && action.started_day !== undefined) {
          const elapsed = gameState.day + 1 - action.started_day;
          if (elapsed >= action.duration) {
            // Action completed - apply effects and show toast
            const result = applyActionEffect(action);
            addToast({
              message: `${action.name} completed!`,
              type: result.sourceFound ? 'success' : 'info',
              effect: result.sourceFound ? 'Source identified!' : action.effect,
            });
            return { ...action, active: false, progress: 0 };
          }
          return { ...action, progress: elapsed };
        }
        return action;
      })
    );

    // Check for events on this day
    const dayEvents = scenario.events.filter(e => e.day === gameState.day + 1);
    if (dayEvents.length > 0) {
      setEventQueue(prev => [...prev, ...dayEvents]);
    }
  }, [gameStatus, gameState, scenario, addToast]);

  // Apply action effects (simplified) - returns result info for toast
  const applyActionEffect = (action: Action): { sourceFound: boolean } => {
    let sourceFound = false;

    setGameState(prev => {
      let newState = { ...prev };

      // Parse effect string for common patterns
      if (action.effect.includes('source ID') || action.effect.includes('Identifies')) {
        // Random chance based on effect strength
        const chance = action.effect.includes('50%') ? 0.5 :
                       action.effect.includes('40%') ? 0.4 :
                       action.effect.includes('30%') ? 0.3 :
                       action.effect.includes('25%') ? 0.25 : 0.2;
        if (Math.random() < chance) {
          newState.source_identified = true;
          sourceFound = true;
        }
      }

      if (action.effect.includes('new cases')) {
        const match = action.effect.match(/-(\d+)%/);
        if (match) {
          const reduction = parseInt(match[1]) / 100;
          newState.r0 = Math.max(0, prev.r0 * (1 - reduction));
        }
      }

      if (action.effect.includes('source contained') && newState.source_identified) {
        newState.r0 = Math.max(0, prev.r0 * 0.3);
      }

      if (action.effect.includes('Stops new exposures')) {
        newState.r0 = Math.max(0, prev.r0 * 0.5);
      }

      return newState;
    });

    return { sourceFound };
  };

  // Execute action
  const executeAction = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (!action || action.active || gameState.budget < action.cost) return;

    // Deduct cost
    setGameState(prev => ({
      ...prev,
      budget: prev.budget - action.cost,
      actions_taken: [...prev.actions_taken, actionId],
    }));

    // Activate action
    setActions(prev =>
      prev.map(a =>
        a.id === actionId
          ? { ...a, active: true, started_day: gameState.day, progress: 0 }
          : a
      )
    );
  };

  // Handle event choice
  const handleEventChoice = (choiceIndex: number | null) => {
    if (!currentEvent) return;

    let effect: Partial<GameState> | undefined;
    if (choiceIndex !== null && currentEvent.choices) {
      effect = currentEvent.choices[choiceIndex].effect;
    } else {
      effect = currentEvent.effect;
    }

    if (effect) {
      setGameState(prev => {
        const newState = {
          ...prev,
          cases: prev.cases + (effect.cases || 0),
          deaths: prev.deaths + (effect.deaths || 0),
          budget: prev.budget + (effect.budget || 0),
          personnel: prev.personnel + (effect.personnel || 0),
        };

        // Handle new outbreak locations from events
        if (effect.outbreak_locations && effect.outbreak_locations.length > 0) {
          newState.outbreak_locations = [
            ...prev.outbreak_locations,
            ...effect.outbreak_locations,
          ];
        }

        return newState;
      });
    }

    setCurrentEvent(null);
  };

  // Process event queue
  useEffect(() => {
    if (eventQueue.length > 0 && !currentEvent) {
      setCurrentEvent(eventQueue[0]);
      setEventQueue(prev => prev.slice(1));
      setGameStatus('paused');
    }
  }, [eventQueue, currentEvent]);

  // Game loop
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      advanceDay();
    }, speed === 1 ? 2000 : 1000);

    return () => clearInterval(interval);
  }, [gameStatus, speed, advanceDay]);

  // Check game end conditions
  useEffect(() => {
    const result = checkGameEnd(gameState);
    if (result === 'won') {
      setGameStatus('won');
      const score = calculateScore(gameState, scenario);
      onComplete(true, score);
    } else if (result === 'lost') {
      setGameStatus('lost');
      onComplete(false, 0);
    }
  }, [gameState, checkGameEnd, onComplete, scenario]);

  // Calculate score
  function calculateScore(state: GameState, scen: CommandScenario): number {
    let score = 1000;
    score -= state.deaths * 100;
    score -= Math.floor(state.cases / 10) * 5;
    score += Math.floor(state.budget / 10000) * 10;
    score += state.source_identified ? 200 : 0;
    score -= (state.day - 1) * 10;

    // Difficulty bonus
    const diffBonus = { easy: 1, medium: 1.5, hard: 2, expert: 3 };
    score = Math.floor(score * diffBonus[scen.difficulty]);

    return Math.max(0, score);
  }

  // Resume after event
  const resumeGame = () => {
    if (currentEvent) return;
    setGameStatus('playing');
  };

  // Restart game
  const restartGame = () => {
    setGameState(initGameState(scenario));
    setActions([...scenario.available_actions]);
    setEventQueue([]);
    setCurrentEvent(null);
    setGameStatus('briefing');
  };

  // Render briefing screen
  if (gameStatus === 'briefing') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-slate-800 text-white p-6">
            <div className="text-sm text-slate-400 mb-2">MISSION BRIEFING</div>
            <h1 className="text-2xl font-bold">{scenario.title}</h1>
            <p className="text-slate-300 mt-1">{scenario.subtitle}</p>
          </div>

          <div className="p-6">
            <p className="text-slate-700 leading-relaxed">{scenario.briefing}</p>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-red-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-600">{scenario.initial_state.cases}</div>
                <div className="text-xs text-slate-500">Initial Cases</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">
                  ${(scenario.initial_state.budget / 1000).toFixed(0)}k
                </div>
                <div className="text-xs text-slate-500">Budget</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600">{scenario.initial_state.personnel}</div>
                <div className="text-xs text-slate-500">Personnel</div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setGameStatus('playing')}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Play size={20} />
                Start Response
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render end screens
  if (gameStatus === 'won' || gameStatus === 'lost') {
    const score = gameStatus === 'won' ? calculateScore(gameState, scenario) : 0;
    return (
      <div className="max-w-md mx-auto p-6">
        <div className={`rounded-2xl shadow-xl overflow-hidden ${gameStatus === 'won' ? 'bg-green-600' : 'bg-red-600'}`}>
          <div className="p-8 text-center text-white">
            {gameStatus === 'won' ? (
              <Trophy size={64} className="mx-auto mb-4" />
            ) : (
              <XCircle size={64} className="mx-auto mb-4" />
            )}
            <h2 className="text-3xl font-bold">
              {gameStatus === 'won' ? 'Outbreak Contained!' : 'Response Failed'}
            </h2>
            <p className="mt-2 text-white/80">
              {gameStatus === 'won'
                ? 'You successfully managed the outbreak.'
                : 'The outbreak exceeded critical thresholds.'}
            </p>
          </div>

          <div className="bg-white p-6">
            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              <div>
                <div className="text-2xl font-bold text-slate-800">{gameState.day}</div>
                <div className="text-xs text-slate-500">Days Elapsed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{gameState.cases}</div>
                <div className="text-xs text-slate-500">Total Cases</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{gameState.deaths}</div>
                <div className="text-xs text-slate-500">Deaths</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">{score}</div>
                <div className="text-xs text-slate-500">Score</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={restartGame}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                Try Again
              </button>
              <button
                onClick={onBack}
                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors"
              >
                Back to Scenarios
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render main game UI
  return (
    <div className="p-4">
      {/* Tutorial Overlay - shows for first-time players */}
      {showTutorial && (
        <TutorialOverlay
          scenarioName={scenario.title}
          onDismiss={dismissTutorial}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Event Dialog */}
      {currentEvent && (
        <EventDialog event={currentEvent} onChoice={handleEventChoice} />
      )}

      {/* Header Bar - Prominent title and controls */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-xl shadow-lg mb-4 overflow-hidden">
        {/* Title Row */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            {gameStatus === 'playing' ? (
              <button
                onClick={() => setGameStatus('paused')}
                className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-400 shadow"
              >
                <Pause size={20} />
              </button>
            ) : (
              <button
                onClick={resumeGame}
                disabled={!!currentEvent}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-400 disabled:opacity-50 shadow"
              >
                <Play size={20} />
              </button>
            )}
            <button
              onClick={() => setSpeed(speed === 1 ? 2 : 1)}
              className={`p-2 rounded-lg shadow ${speed === 2 ? 'bg-blue-500 text-white' : 'bg-white/20 text-white'}`}
            >
              <FastForward size={20} />
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-xl font-bold text-white drop-shadow">{scenario.title}</h1>
            <span className={`text-sm font-medium px-3 py-0.5 rounded-full ${
              scenario.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
              scenario.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
              scenario.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
            </span>
          </div>

          <button
            onClick={onBack}
            className="px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Exit
          </button>
        </div>

        {/* Objective Banner */}
        <div className="px-4 py-2 bg-black/20 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-white/90">
            <span className="text-amber-400 font-semibold">🎯 MISSION:</span>
            {scenario.win_state.source_identified && (
              <span className={gameState.source_identified ? 'text-green-400' : ''}>
                {gameState.source_identified ? '✓ Source Found' : 'Identify the source'}
              </span>
            )}
            {scenario.win_state.cases_below && (
              <span>• Keep cases below {scenario.win_state.cases_below}</span>
            )}
          </div>
          {scenario.lose_state.cases_above && (
            <div className="flex items-center gap-2 text-red-300">
              <span>⚠️ Fail at {scenario.lose_state.cases_above} cases</span>
              <span className="font-bold">({gameState.cases} current)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Game Grid */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Stats Panel */}
        <div className="lg:col-span-3">
          <GameStats gameState={gameState} pathogen={scenario.pathogen} />
        </div>

        {/* Map */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Outbreak Map</h3>
            <USMapInteractive
              locations={gameState.outbreak_locations}
              className="h-72 lg:h-96"
            />

            {/* Location List - sorted by case count */}
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {[...gameState.outbreak_locations]
                .sort((a, b) => b.cases - a.cases)
                .map((loc, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm bg-slate-50 px-3 py-2 rounded-lg">
                    <span className="font-medium text-slate-700">{STATE_NAMES[loc.state] || loc.state}</span>
                    <span className="font-bold text-red-600">{loc.cases} cases</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Actions Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl shadow p-4">
            <ActionPanel
              actions={actions}
              gameState={gameState}
              onExecuteAction={executeAction}
              disabled={gameStatus !== 'playing'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
