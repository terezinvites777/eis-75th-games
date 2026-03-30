// src/data/outbreak-network-data.ts
// Outbreak Network game data — Contact tracing puzzle generator
// Procedurally generated network graphs with simulated disease spread

// ============================================================
// TYPES
// ============================================================

export interface NetworkNode {
  id: string;
  x: number;           // Normalized 0-1 position (mapped to screen coords by renderer)
  y: number;
  status: 'unknown' | 'infected' | 'healthy';
  isPatientZero: boolean;
  generation: number;   // 0 = patient zero, 1 = first wave, 2 = second wave, etc. -1 = not infected
  revealed: boolean;    // Has the player investigated this node?
  connections: string[];
  label: string;        // Display name (e.g., "Person A", "Contact 7")
}

export interface NetworkEdge {
  source: string;
  target: string;
  isTransmissionPath: boolean;  // Part of the actual transmission chain
}

export interface NetworkPuzzle {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  patientZeroId: string;
  totalInfected: number;
  totalHealthy: number;
  difficulty: DifficultyLevel;
  initialRevealed: string[];  // IDs of nodes revealed at start
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  nodeCount: number;
  minConnections: number;
  maxConnections: number;
  investigationTokens: number;
  initialRevealedCount: number;
  transmissionProbability: number;
  label: string;
}

export interface GameState {
  puzzle: NetworkPuzzle;
  tokensRemaining: number;
  revealedNodes: Set<string>;
  selectedPatientZero: string | null;
  startTime: number;
  isComplete: boolean;
}

export interface NetworkScore {
  correct: boolean;
  basePoints: number;
  efficiencyBonus: number;   // Points for unused tokens
  timeBonus: number;         // Points for speed
  totalScore: number;
}

// ============================================================
// DIFFICULTY CONFIGURATION
// ============================================================

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    nodeCount: 12,
    minConnections: 2,
    maxConnections: 3,
    investigationTokens: 6,
    initialRevealedCount: 3,
    transmissionProbability: 0.7,
    label: 'Rookie Detective',
  },
  medium: {
    nodeCount: 16,
    minConnections: 2,
    maxConnections: 4,
    investigationTokens: 5,
    initialRevealedCount: 2,
    transmissionProbability: 0.65,
    label: 'Field Investigator',
  },
  hard: {
    nodeCount: 20,
    minConnections: 3,
    maxConnections: 4,
    investigationTokens: 4,
    initialRevealedCount: 2,
    transmissionProbability: 0.6,
    label: 'Senior Epidemiologist',
  },
};

// Determine difficulty based on number of plays (stored in localStorage)
export function getDifficulty(playCount: number): DifficultyLevel {
  if (playCount < 3) return 'easy';
  if (playCount < 7) return 'medium';
  return 'hard';
}

// ============================================================
// NETWORK GENERATION
// ============================================================

// Person name labels for nodes (anonymous but friendly)
const NODE_LABELS = [
  'Alex', 'Blair', 'Casey', 'Drew', 'Ellis',
  'Frankie', 'Gray', 'Harper', 'Indigo', 'Jordan',
  'Kit', 'Lane', 'Morgan', 'Noel', 'Oakley',
  'Parker', 'Quinn', 'Reese', 'Sage', 'Taylor',
];

/**
 * Generate a random network puzzle.
 * 
 * Algorithm:
 * 1. Place nodes with minimum distance constraints
 * 2. Connect nodes (proximity-weighted, respecting min/max connection counts)
 * 3. Select Patient Zero
 * 4. Simulate BFS spread with probability-based transmission
 * 5. Initially reveal a few infected nodes
 */
export function generatePuzzle(difficulty: DifficultyLevel): NetworkPuzzle {
  const config = DIFFICULTY_CONFIGS[difficulty];

  // Step 1: Place nodes
  const nodes = placeNodes(config.nodeCount);

  // Step 2: Connect nodes
  const edges = connectNodes(nodes, config.minConnections, config.maxConnections);

  // Update node connection lists
  for (const edge of edges) {
    const sourceNode = nodes.find(n => n.id === edge.source)!;
    const targetNode = nodes.find(n => n.id === edge.target)!;
    if (!sourceNode.connections.includes(edge.target)) sourceNode.connections.push(edge.target);
    if (!targetNode.connections.includes(edge.source)) targetNode.connections.push(edge.source);
  }

  // Step 3: Select Patient Zero (prefer nodes with 2-3 connections, not the most connected)
  const candidatePZs = nodes.filter(n => n.connections.length >= 2 && n.connections.length <= 4);
  const patientZero = candidatePZs[Math.floor(Math.random() * candidatePZs.length)] || nodes[0];
  patientZero.isPatientZero = true;
  patientZero.status = 'infected';
  patientZero.generation = 0;

  // Step 4: Simulate spread via BFS
  simulateSpread(nodes, edges, patientZero.id, config.transmissionProbability);

  // Count infected/healthy
  const infected = nodes.filter(n => n.status === 'infected');
  const healthy = nodes.filter(n => n.status === 'healthy');

  // If too few or too many infected, regenerate (aim for 40-70% infection rate)
  const infectionRate = infected.length / nodes.length;
  if (infectionRate < 0.35 || infectionRate > 0.75) {
    // Retry — recursive but bounded by probability (very unlikely to recurse more than 2-3 times)
    return generatePuzzle(difficulty);
  }

  // Step 5: Initially reveal some infected nodes (not Patient Zero)
  const revealCandidates = infected.filter(n => !n.isPatientZero);
  const shuffledCandidates = shuffleArray(revealCandidates);
  const initialRevealed = shuffledCandidates
    .slice(0, Math.min(config.initialRevealedCount, shuffledCandidates.length))
    .map(n => n.id);

  // Mark initially revealed nodes
  for (const id of initialRevealed) {
    const node = nodes.find(n => n.id === id)!;
    node.revealed = true;
  }

  return {
    nodes,
    edges,
    patientZeroId: patientZero.id,
    totalInfected: infected.length,
    totalHealthy: healthy.length,
    difficulty,
    initialRevealed,
  };
}

function placeNodes(count: number): NetworkNode[] {
  const nodes: NetworkNode[] = [];
  const minDistance = 0.15; // Minimum normalized distance between nodes
  const padding = 0.08;    // Edge padding

  for (let i = 0; i < count; i++) {
    let x: number, y: number;
    let attempts = 0;
    const maxAttempts = 100;

    // Try to place node with minimum distance from existing nodes
    do {
      x = padding + Math.random() * (1 - 2 * padding);
      y = padding + Math.random() * (1 - 2 * padding);
      attempts++;
    } while (
      attempts < maxAttempts &&
      nodes.some(n => Math.hypot(n.x - x, n.y - y) < minDistance)
    );

    nodes.push({
      id: `node-${i}`,
      x,
      y,
      status: 'unknown',
      isPatientZero: false,
      generation: -1,
      revealed: false,
      connections: [],
      label: NODE_LABELS[i] || `Person ${i + 1}`,
    });
  }

  return nodes;
}

function connectNodes(
  nodes: NetworkNode[],
  minConn: number,
  maxConn: number,
): NetworkEdge[] {
  const edges: NetworkEdge[] = [];
  const connectionCount: Record<string, number> = {};
  nodes.forEach(n => connectionCount[n.id] = 0);

  // Sort all possible edges by distance (prefer closer connections)
  const possibleEdges: { source: string; target: string; distance: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      possibleEdges.push({
        source: nodes[i].id,
        target: nodes[j].id,
        distance: Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y),
      });
    }
  }
  possibleEdges.sort((a, b) => a.distance - b.distance);

  // First pass: ensure everyone has at least minConn connections
  for (const node of nodes) {
    while (connectionCount[node.id] < minConn) {
      // Find closest unconnected node that hasn't maxed out
      const candidate = possibleEdges.find(e => {
        const otherId = e.source === node.id ? e.target : (e.target === node.id ? e.source : null);
        if (!otherId) return false;
        if (connectionCount[otherId] >= maxConn) return false;
        // Check if edge already exists
        return !edges.some(
          existing =>
            (existing.source === e.source && existing.target === e.target) ||
            (existing.source === e.target && existing.target === e.source)
        );
      });

      if (!candidate) break; // No valid candidates

      edges.push({ source: candidate.source, target: candidate.target, isTransmissionPath: false });
      connectionCount[candidate.source]++;
      connectionCount[candidate.target]++;
    }
  }

  // Second pass: add some additional random connections for complexity
  const extraEdges = Math.floor(nodes.length * 0.3); // ~30% more edges
  let added = 0;
  for (const candidate of shuffleArray(possibleEdges)) {
    if (added >= extraEdges) break;
    if (connectionCount[candidate.source] >= maxConn) continue;
    if (connectionCount[candidate.target] >= maxConn) continue;
    if (edges.some(
      e => (e.source === candidate.source && e.target === candidate.target) ||
           (e.source === candidate.target && e.target === candidate.source)
    )) continue;
    // Prefer shorter distances (add with probability inversely proportional to distance)
    if (Math.random() > (1 - candidate.distance * 0.8)) continue;

    edges.push({ source: candidate.source, target: candidate.target, isTransmissionPath: false });
    connectionCount[candidate.source]++;
    connectionCount[candidate.target]++;
    added++;
  }

  return edges;
}

function simulateSpread(
  nodes: NetworkNode[],
  edges: NetworkEdge[],
  patientZeroId: string,
  transmissionProb: number,
): void {
  // BFS from Patient Zero
  const queue: { nodeId: string; generation: number }[] = [
    { nodeId: patientZeroId, generation: 0 }
  ];
  const visited = new Set<string>([patientZeroId]);

  while (queue.length > 0) {
    const { nodeId, generation } = queue.shift()!;
    const node = nodes.find(n => n.id === nodeId)!;

    // Find all connected nodes
    for (const connId of node.connections) {
      if (visited.has(connId)) continue;
      visited.add(connId);

      const connNode = nodes.find(n => n.id === connId)!;

      // Transmission probability check
      if (Math.random() < transmissionProb) {
        connNode.status = 'infected';
        connNode.generation = generation + 1;

        // Mark the edge as a transmission path
        const edge = edges.find(
          e => (e.source === nodeId && e.target === connId) ||
               (e.source === connId && e.target === nodeId)
        );
        if (edge) edge.isTransmissionPath = true;

        queue.push({ nodeId: connId, generation: generation + 1 });
      } else {
        connNode.status = 'healthy';
        connNode.generation = -1;
      }
    }
  }

  // Any unvisited nodes (disconnected) are healthy
  for (const node of nodes) {
    if (node.status === 'unknown' && !node.isPatientZero) {
      node.status = 'healthy';
      node.generation = -1;
    }
  }
}

// ============================================================
// SCORING
// ============================================================

export const SCORING_CONFIG = {
  correctBasePoints: 200,
  incorrectBasePoints: 0,
  tokensUnusedBonus: 20,    // Per unused token
  timeBonus: {
    maxSeconds: 180,         // Max time for full time bonus
    maxPoints: 100,          // Max time bonus points
  },
};

export function calculateNetworkScore(
  correct: boolean,
  tokensRemaining: number,
  _totalTokens: number,
  elapsedSeconds: number,
): NetworkScore {
  if (!correct) {
    return {
      correct: false,
      basePoints: 0,
      efficiencyBonus: 0,
      timeBonus: 0,
      totalScore: 0,
    };
  }

  const basePoints = SCORING_CONFIG.correctBasePoints;
  const efficiencyBonus = tokensRemaining * SCORING_CONFIG.tokensUnusedBonus;
  const timeFraction = Math.max(0, 1 - (elapsedSeconds / SCORING_CONFIG.timeBonus.maxSeconds));
  const timeBonus = Math.floor(timeFraction * SCORING_CONFIG.timeBonus.maxPoints);

  return {
    correct: true,
    basePoints,
    efficiencyBonus,
    timeBonus,
    totalScore: basePoints + efficiencyBonus + timeBonus,
  };
}

// ============================================================
// TEACHING MOMENTS (shown after each round)
// ============================================================

export const TEACHING_FACTOIDS = [
  'Contact tracing is the cornerstone of outbreak response — every link in the chain matters.',
  'Superspreaders — individuals with many contacts — can drive an entire epidemic.',
  'In the 2014 Ebola response, EIS officers traced thousands of contacts by hand in West Africa.',
  'Modern genomic sequencing can confirm transmission chains identified by field epidemiology.',
  'The first step is always the same: find the connections.',
  'During the COVID-19 pandemic, digital contact tracing apps supplemented traditional shoe-leather epidemiology.',
  'In network analysis, the "degree" of a node (number of connections) predicts outbreak risk.',
  'Ring vaccination — vaccinating contacts of cases — uses the same network logic as contact tracing.',
  'John Snow\'s 1854 cholera investigation was one of the earliest examples of tracing disease through a network of exposures.',
  'EIS officers often say: "The answer is in the field." That\'s where the connections are found.',
];

export function getRandomFactoid(): string {
  return TEACHING_FACTOIDS[Math.floor(Math.random() * TEACHING_FACTOIDS.length)];
}

// ============================================================
// LOCAL STORAGE HELPERS
// ============================================================

const PLAY_COUNT_KEY = 'outbreak-network-plays';
const HIGH_SCORE_KEY = 'outbreak-network-highscore';

export function getPlayCount(): number {
  try {
    return parseInt(localStorage.getItem(PLAY_COUNT_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

export function incrementPlayCount(): number {
  const count = getPlayCount() + 1;
  try {
    localStorage.setItem(PLAY_COUNT_KEY, count.toString());
  } catch { /* kiosk may block localStorage */ }
  return count;
}

export function getHighScore(): number {
  try {
    return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

export function setHighScore(score: number): void {
  if (score > getHighScore()) {
    try {
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
    } catch { /* kiosk may block localStorage */ }
  }
}

// ============================================================
// UTILITIES
// ============================================================

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
