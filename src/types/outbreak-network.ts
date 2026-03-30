// src/types/outbreak-network.ts
// Types for the Outbreak Network contact tracing puzzle game

export type NodeVisualStatus = 
  | 'unknown'          // Gray — not yet investigated
  | 'infected-known'   // Red — revealed as infected
  | 'healthy-known'    // Green — revealed as healthy
  | 'selected'         // Gold — player's Patient Zero guess
  | 'patient-zero-revealed'; // Dark red — actual Patient Zero (shown at end)

export interface VisualNode {
  id: string;
  x: number;            // Screen x coordinate (pixels)
  y: number;            // Screen y coordinate
  label: string;
  visualStatus: NodeVisualStatus;
  generation: number | null;  // Null if unknown or healthy
  connectionCount: number;
  isHighlighted: boolean;     // Connections highlighted on tap
  pulseAnimation: boolean;    // Active pulse effect
}

export interface VisualEdge {
  sourceId: string;
  targetId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isTransmissionPath: boolean;
  isRevealed: boolean;        // Show as transmission path in post-game
  animationDelay: number;     // For staggered transmission chain animation
}

export interface InvestigationAction {
  type: 'investigate' | 'identify';
  nodeId: string;
  timestamp: number;
}

export type GamePhase =
  | 'attract'         // Idle screen waiting for player
  | 'playing'         // Active gameplay
  | 'identifying'     // Player is selecting Patient Zero
  | 'reveal'          // Showing the answer + transmission chain animation
  | 'score';          // Score screen with teaching moment

export interface OutbreakNetworkGameState {
  phase: GamePhase;
  tokensRemaining: number;
  totalTokens: number;
  selectedNodeId: string | null;     // Currently highlighted/selected node
  identifiedPZId: string | null;     // Player's Patient Zero guess
  actions: InvestigationAction[];    // History of player actions
  startTime: number | null;
  endTime: number | null;
  score: number | null;
}
