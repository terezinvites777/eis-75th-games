// src/components/outbreak-network/NetworkCanvas.tsx
// SVG-based network graph visualization for the contact tracing puzzle

import { useRef, useEffect, useState, useCallback } from 'react';
import type { NetworkNode, NetworkEdge } from '../../data/outbreak-network-data';
import type { GamePhase } from '../../types/outbreak-network';

interface NetworkCanvasProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  revealedNodes: Set<string>;
  selectedNodeId: string | null;
  highlightedNodeId: string | null;
  identifiedPZId: string | null;
  phase: GamePhase;
  onNodeClick: (nodeId: string) => void;
}

const NODE_RADIUS = 24;
const PADDING = 40;

// Color palette
const COLORS = {
  unknown: '#94a3b8',        // slate-400
  unknownFill: '#e2e8f0',   // slate-200
  infected: '#ef4444',       // red-500
  infectedGlow: '#dc2626',   // red-600
  healthy: '#22c55e',        // green-500
  healthyFill: '#dcfce7',   // green-100
  selected: '#eab308',       // yellow-500
  selectedGlow: '#f59e0b',  // amber-500
  patientZero: '#991b1b',   // red-900
  patientZeroGlow: '#dc2626',
  edge: 'rgba(203, 213, 225, 0.5)',        // slate-300 visible
  edgeRevealed: 'rgba(239, 68, 68, 0.8)', // red transmission
  edgeHighlight: 'rgba(96, 165, 250, 0.7)', // blue highlight
  text: '#1e293b',           // slate-800
  textLight: '#f8fafc',     // slate-50
};

function getNodeColor(node: NetworkNode, revealed: boolean, isSelected: boolean, isIdentified: boolean, phase: GamePhase) {
  if (phase === 'reveal' || phase === 'score') {
    if (node.isPatientZero) return { fill: COLORS.patientZero, stroke: COLORS.patientZeroGlow, textColor: COLORS.textLight };
    if (node.status === 'infected') return { fill: COLORS.infected, stroke: COLORS.infectedGlow, textColor: COLORS.textLight };
    return { fill: COLORS.healthyFill, stroke: COLORS.healthy, textColor: COLORS.text };
  }

  if (isIdentified) return { fill: COLORS.selected, stroke: COLORS.selectedGlow, textColor: COLORS.text };
  if (isSelected) return { fill: '#dbeafe', stroke: '#3b82f6', textColor: COLORS.text };

  if (revealed) {
    if (node.status === 'infected') return { fill: COLORS.infected, stroke: COLORS.infectedGlow, textColor: COLORS.textLight };
    return { fill: COLORS.healthyFill, stroke: COLORS.healthy, textColor: COLORS.text };
  }

  return { fill: COLORS.unknownFill, stroke: COLORS.unknown, textColor: COLORS.text };
}

export function NetworkCanvas({
  nodes,
  edges,
  revealedNodes,
  selectedNodeId,
  highlightedNodeId,
  identifiedPZId,
  phase,
  onNodeClick,
}: NetworkCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Convert normalized 0-1 coords to pixel coords
  const toScreenX = useCallback((x: number) => PADDING + x * (dimensions.width - 2 * PADDING), [dimensions.width]);
  const toScreenY = useCallback((y: number) => PADDING + y * (dimensions.height - 2 * PADDING), [dimensions.height]);

  const isGameActive = phase === 'playing' || phase === 'identifying';

  // Determine which edges to highlight (connections of highlighted node)
  const highlightedEdges = new Set<string>();
  if (highlightedNodeId) {
    edges.forEach((e, i) => {
      if (e.source === highlightedNodeId || e.target === highlightedNodeId) {
        highlightedEdges.add(`edge-${i}`);
      }
    });
  }

  // Staggered reveal animation for transmission paths
  const [revealedTransmissionEdges, setRevealedTransmissionEdges] = useState<Set<number>>(new Set());
  useEffect(() => {
    if (phase !== 'reveal') {
      setRevealedTransmissionEdges(new Set());
      return;
    }

    // Stagger reveal of transmission edges by generation
    const transmissionEdges = edges
      .map((e, i) => ({ ...e, index: i }))
      .filter(e => e.isTransmissionPath)
      .sort((a, b) => {
        const aGen = Math.min(
          nodes.find(n => n.id === a.source)?.generation ?? 99,
          nodes.find(n => n.id === a.target)?.generation ?? 99,
        );
        const bGen = Math.min(
          nodes.find(n => n.id === b.source)?.generation ?? 99,
          nodes.find(n => n.id === b.target)?.generation ?? 99,
        );
        return aGen - bGen;
      });

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    transmissionEdges.forEach((e, i) => {
      const t = setTimeout(() => {
        setRevealedTransmissionEdges(prev => new Set([...prev, e.index]));
      }, i * 300);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [phase, edges, nodes]);

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: 400 }}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="select-none"
      >
        <defs>
          {/* Glow filter for infected nodes */}
          <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-pz" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const x1 = toScreenX(sourceNode.x);
          const y1 = toScreenY(sourceNode.y);
          const x2 = toScreenX(targetNode.x);
          const y2 = toScreenY(targetNode.y);

          const isHighlighted = highlightedEdges.has(`edge-${i}`);
          const isTransmissionRevealed = (phase === 'reveal' || phase === 'score') && revealedTransmissionEdges.has(i);

          let strokeColor = COLORS.edge;
          let strokeWidth = 2;
          let opacity = 0.6;

          if (isTransmissionRevealed) {
            strokeColor = COLORS.edgeRevealed;
            strokeWidth = 3;
            opacity = 0.8;
          } else if (isHighlighted) {
            strokeColor = COLORS.edgeHighlight;
            strokeWidth = 2.5;
            opacity = 0.7;
          }

          return (
            <line
              key={`edge-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              opacity={opacity}
              strokeLinecap="round"
              className={isTransmissionRevealed ? 'transition-all duration-500' : ''}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const cx = toScreenX(node.x);
          const cy = toScreenY(node.y);
          const revealed = revealedNodes.has(node.id);
          const isSelected = node.id === selectedNodeId;
          const isIdentified = node.id === identifiedPZId;
          const { fill, stroke, textColor } = getNodeColor(node, revealed, isSelected, isIdentified, phase);

          const isInfectedRevealed = revealed && node.status === 'infected';
          const isPZRevealed = (phase === 'reveal' || phase === 'score') && node.isPatientZero;

          let filter = '';
          if (isPZRevealed) filter = 'url(#glow-pz)';
          else if (isIdentified) filter = 'url(#glow-gold)';
          else if (isInfectedRevealed) filter = 'url(#glow-red)';

          return (
            <g
              key={node.id}
              onClick={() => isGameActive && onNodeClick(node.id)}
              className={isGameActive ? 'cursor-pointer' : ''}
              role={isGameActive ? 'button' : undefined}
              tabIndex={isGameActive ? 0 : undefined}
            >
              {/* Outer ring for pulse animation */}
              {(isInfectedRevealed || isPZRevealed) && (
                <circle
                  cx={cx} cy={cy}
                  r={NODE_RADIUS + 4}
                  fill="none"
                  stroke={isPZRevealed ? COLORS.patientZeroGlow : COLORS.infectedGlow}
                  strokeWidth={2}
                  opacity={0.5}
                  className="animate-pulse"
                />
              )}

              {/* Node circle */}
              <circle
                cx={cx} cy={cy}
                r={NODE_RADIUS}
                fill={fill}
                stroke={stroke}
                strokeWidth={isSelected || isIdentified ? 3 : 2}
                filter={filter}
                className="transition-colors duration-300"
              />

              {/* Person icon (simple silhouette) */}
              {!revealed && phase !== 'reveal' && phase !== 'score' && (
                <>
                  <circle cx={cx} cy={cy - 5} r={5} fill={COLORS.unknown} opacity={0.6} />
                  <ellipse cx={cx} cy={cy + 7} rx={7} ry={5} fill={COLORS.unknown} opacity={0.6} />
                </>
              )}

              {/* Generation number for infected revealed nodes */}
              {((revealed && node.status === 'infected') || ((phase === 'reveal' || phase === 'score') && node.status === 'infected')) && (
                <text
                  x={cx} y={cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={textColor}
                  fontSize={14}
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {node.isPatientZero ? 'P0' : `G${node.generation}`}
                </text>
              )}

              {/* Checkmark for healthy */}
              {((revealed && node.status === 'healthy') || ((phase === 'reveal' || phase === 'score') && node.status === 'healthy')) && (
                <text
                  x={cx} y={cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={COLORS.healthy}
                  fontSize={18}
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  ✓
                </text>
              )}

              {/* Node label */}
              <text
                x={cx} y={cy + NODE_RADIUS + 15}
                textAnchor="middle"
                fill="white"
                fontSize={12}
                fontWeight="700"
                className="pointer-events-none select-none"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.9)' }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
