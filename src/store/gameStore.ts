import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Era, GameType, Case, Mission, GameStatus } from '../types/game';
import type { Player, PlayerStats, PlayerBadge } from '../types/player';

interface GameState {
  // Player
  player: Player | null;
  playerStats: PlayerStats | null;
  playerBadges: PlayerBadge[];

  // Current game session
  currentGameType: GameType | null;
  currentEra: Era | null;
  currentCase: Case | null;
  currentMission: Mission | null;
  revealedClues: string[];
  selectedDiagnosis: string | null;
  gameStatus: GameStatus;
  timeRemaining: number;
  score: number;

  // Command mode state
  currentTurn: number;
  resources: {
    budget: number;
    personnel: number;
    publicTrust: number;
    time: number;
  };
  actionHistory: Array<{
    turn: number;
    actionId: string;
    result: 'success' | 'failure';
    message: string;
  }>;

  // Progress tracking
  completedCases: string[];
  completedMissions: string[];
  streak: number;

  // Actions
  setPlayer: (player: Player | null) => void;
  setPlayerStats: (stats: PlayerStats) => void;
  addBadge: (badge: PlayerBadge) => void;

  startDetectiveCase: (caseData: Case) => void;
  revealClue: (clueId: string) => void;
  selectDiagnosis: (diagnosisId: string) => void;
  submitDiagnosis: () => boolean;

  startCommandMission: (mission: Mission) => void;
  executeAction: (actionId: string) => { success: boolean; message: string };
  advanceTurn: () => void;

  updateTimeRemaining: (time: number) => void;
  addScore: (points: number) => void;
  resetGame: () => void;
  completeGame: (finalScore: number) => void;
}

const initialGameState = {
  currentGameType: null,
  currentEra: null,
  currentCase: null,
  currentMission: null,
  revealedClues: [],
  selectedDiagnosis: null,
  gameStatus: 'not_started' as GameStatus,
  timeRemaining: 0,
  score: 0,
  currentTurn: 0,
  resources: { budget: 0, personnel: 0, publicTrust: 0, time: 0 },
  actionHistory: [],
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      player: null,
      playerStats: null,
      playerBadges: [],
      ...initialGameState,
      completedCases: [],
      completedMissions: [],
      streak: 0,

      // Player actions
      setPlayer: (player) => set({ player }),
      setPlayerStats: (stats) => set({ playerStats: stats }),
      addBadge: (badge) => set((state) => ({ playerBadges: [...state.playerBadges, badge] })),

      // Detective mode actions
      startDetectiveCase: (caseData) => set({
        currentGameType: 'detective',
        currentEra: caseData.era,
        currentCase: caseData,
        revealedClues: [],
        selectedDiagnosis: null,
        gameStatus: 'in_progress',
        timeRemaining: caseData.timeLimit,
        score: 0,
      }),

      revealClue: (clueId) => set((state) => ({
        revealedClues: state.revealedClues.includes(clueId)
          ? state.revealedClues
          : [...state.revealedClues, clueId],
      })),

      selectDiagnosis: (diagnosisId) => set({ selectedDiagnosis: diagnosisId }),

      submitDiagnosis: () => {
        const state = get();
        if (!state.currentCase || !state.selectedDiagnosis) return false;

        const isCorrect = state.selectedDiagnosis === state.currentCase.correctDiagnosis;

        set({
          gameStatus: isCorrect ? 'completed' : 'failed',
          streak: isCorrect ? state.streak + 1 : 0,
          completedCases: isCorrect
            ? [...state.completedCases, state.currentCase.id]
            : state.completedCases,
        });

        return isCorrect;
      },

      // Command mode actions
      startCommandMission: (mission) => set({
        currentGameType: 'command',
        currentMission: mission,
        currentTurn: 1,
        resources: { ...mission.initialResources },
        actionHistory: [],
        gameStatus: 'in_progress',
        score: 0,
      }),

      executeAction: (actionId) => {
        const state = get();
        const currentEvent = state.currentMission?.events.find(e => e.turn === state.currentTurn);
        const action = currentEvent?.options.find(o => o.id === actionId);

        if (!action) return { success: false, message: 'Invalid action' };

        // Apply costs
        const newResources = { ...state.resources };
        if (action.cost.budget) newResources.budget -= action.cost.budget;
        if (action.cost.personnel) newResources.personnel -= action.cost.personnel;
        if (action.cost.publicTrust) newResources.publicTrust -= action.cost.publicTrust;
        if (action.cost.time) newResources.time -= action.cost.time;

        // Determine outcome
        const roll = Math.random();
        const isSuccess = roll < action.outcomes.success.probability;
        const outcome = isSuccess ? action.outcomes.success : action.outcomes.failure;

        // Apply effects
        if (outcome.effect.budget) newResources.budget += outcome.effect.budget;
        if (outcome.effect.personnel) newResources.personnel += outcome.effect.personnel;
        if (outcome.effect.publicTrust) newResources.publicTrust += outcome.effect.publicTrust;
        if (outcome.effect.time) newResources.time += outcome.effect.time;

        set({
          resources: newResources,
          actionHistory: [
            ...state.actionHistory,
            {
              turn: state.currentTurn,
              actionId,
              result: isSuccess ? 'success' : 'failure',
              message: outcome.message,
            },
          ],
        });

        return { success: isSuccess, message: outcome.message };
      },

      advanceTurn: () => set((state) => ({
        currentTurn: state.currentTurn + 1,
      })),

      // Common actions
      updateTimeRemaining: (time) => set({ timeRemaining: time }),
      addScore: (points) => set((state) => ({ score: state.score + points })),

      resetGame: () => set(initialGameState),

      completeGame: (finalScore) => set((state) => ({
        gameStatus: 'completed',
        score: finalScore,
        completedMissions: state.currentMission
          ? [...state.completedMissions, state.currentMission.id]
          : state.completedMissions,
      })),
    }),
    {
      name: 'eis-75th-games-storage',
      partialize: (state) => ({
        player: state.player,
        playerStats: state.playerStats,
        playerBadges: state.playerBadges,
        completedCases: state.completedCases,
        completedMissions: state.completedMissions,
        streak: state.streak,
      }),
    }
  )
);
