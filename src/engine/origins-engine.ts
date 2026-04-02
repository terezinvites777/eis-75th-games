// src/engine/origins-engine.ts
// Outbreak Origins — spread simulation and turn logic

import type { OriginsScenario, StateStatus } from '../types/origins';

export interface MapState {
  statuses: Record<string, StateStatus>;
  caseCounts: Record<string, number>;
}

export function initializeMap(scenario: OriginsScenario): MapState {
  const statuses: Record<string, StateStatus> = {};
  const caseCounts: Record<string, number> = {};

  scenario.initialStates.forEach(s => {
    statuses[s.stateId] = 'active';
    caseCounts[s.stateId] = s.initialCases;
  });

  return { statuses, caseCounts };
}

export function advanceTurn(
  mapState: MapState,
  scenario: OriginsScenario,
  currentTurn: number,
  investigatedStates: Set<string>
): { newMapState: MapState; newStates: string[] } {
  const nextTurn = currentTurn + 1;
  const newStatuses = { ...mapState.statuses };
  const newCaseCounts = { ...mapState.caseCounts };
  const newStates: string[] = [];

  // Grow existing outbreak states
  for (const s of scenario.initialStates) {
    if (newCaseCounts[s.stateId]) {
      newCaseCounts[s.stateId] += s.growthPerTurn;
    }
  }

  // Previous spread events also grow
  for (const event of scenario.spreadSchedule) {
    if (event.turn < nextTurn && newCaseCounts[event.stateId]) {
      newCaseCounts[event.stateId] += event.growthPerTurn;
    }
  }

  // New spread events this turn
  for (const event of scenario.spreadSchedule) {
    if (event.turn === nextTurn && !newCaseCounts[event.stateId]) {
      newStatuses[event.stateId] = 'new';
      newCaseCounts[event.stateId] = event.initialCases;
      newStates.push(event.stateId);
    }
  }

  // Mark investigated states
  for (const stateId of investigatedStates) {
    if (newStatuses[stateId]) {
      newStatuses[stateId] = 'investigated';
    }
  }

  // Convert 'new' states from previous turns to 'active'
  for (const [stateId, status] of Object.entries(mapState.statuses)) {
    if (status === 'new' && !investigatedStates.has(stateId)) {
      newStatuses[stateId] = 'active';
    }
  }

  return { newMapState: { statuses: newStatuses, caseCounts: newCaseCounts }, newStates };
}

export function calculateScore(
  pathogenCorrect: boolean,
  sourceCorrect: boolean,
  originCorrect: boolean,
  tokensRemaining: number,
  totalTurns: number
): { total: number; breakdown: { label: string; points: number }[] } {
  const breakdown: { label: string; points: number }[] = [];

  if (pathogenCorrect) breakdown.push({ label: 'Pathogen identified', points: 200 });
  if (sourceCorrect) breakdown.push({ label: 'Source identified', points: 200 });
  if (originCorrect) breakdown.push({ label: 'Origin state identified', points: 200 });

  if (tokensRemaining >= 3) {
    const bonus = tokensRemaining * 100;
    breakdown.push({ label: `Efficiency bonus (${tokensRemaining} tokens)`, points: bonus });
  }

  if (totalTurns <= 4) {
    breakdown.push({ label: 'Speed bonus', points: 150 });
  }

  const total = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { total, breakdown };
}
