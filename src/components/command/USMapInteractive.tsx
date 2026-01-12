// src/components/command/USMapInteractive.tsx
// Interactive US Map with proper state boundaries

import { useState } from 'react';
import type { OutbreakLocation } from '../../types/command';
import { usStates, getStateById, MAP_VIEWBOX } from './USMapPaths';

// State center coordinates for the map (viewBox: 192 9 1028 746)
const STATE_CENTERS: Record<string, { x: number; y: number }> = {
  'AK': { x: 336, y: 618 },
  'AL': { x: 943, y: 427 },
  'AR': { x: 835, y: 386 },
  'AZ': { x: 473, y: 376 },
  'CA': { x: 362, y: 276 },
  'CO': { x: 599, y: 284 },
  'CT': { x: 1151, y: 188 },
  'DC': { x: 1093, y: 261 },
  'DE': { x: 1119, y: 251 },
  'FL': { x: 1009, y: 525 },
  'GA': { x: 1004, y: 415 },
  'HI': { x: 599, y: 623 },
  'IA': { x: 809, y: 226 },
  'ID': { x: 473, y: 120 },
  'IL': { x: 878, y: 271 },
  'IN': { x: 932, y: 267 },
  'KS': { x: 724, y: 303 },
  'KY': { x: 947, y: 312 },
  'LA': { x: 854, y: 468 },
  'MA': { x: 1166, y: 167 },
  'MD': { x: 1088, y: 258 },
  'ME': { x: 1187, y: 94 },
  'MI': { x: 920, y: 154 },
  'MN': { x: 805, y: 127 },
  'MO': { x: 829, y: 306 },
  'MS': { x: 881, y: 431 },
  'MT': { x: 556, y: 96 },
  'NC': { x: 1058, y: 342 },
  'ND': { x: 699, y: 102 },
  'NE': { x: 704, y: 235 },
  'NH': { x: 1159, y: 130 },
  'NJ': { x: 1126, y: 226 },
  'NM': { x: 578, y: 385 },
  'NV': { x: 411, y: 261 },
  'NY': { x: 1100, y: 160 },
  'OH': { x: 989, y: 247 },
  'OK': { x: 717, y: 373 },
  'OR': { x: 375, y: 126 },
  'PA': { x: 1073, y: 221 },
  'RI': { x: 1169, y: 180 },
  'SC': { x: 1043, y: 391 },
  'SD': { x: 697, y: 174 },
  'TN': { x: 946, y: 353 },
  'TX': { x: 688, y: 466 },
  'UT': { x: 496, y: 259 },
  'VA': { x: 1057, y: 293 },
  'VT': { x: 1136, y: 135 },
  'WA': { x: 396, y: 55 },
  'WI': { x: 862, y: 162 },
  'WV': { x: 1039, y: 274 },
  'WY': { x: 576, y: 191 }
};

interface USMapInteractiveProps {
  locations: OutbreakLocation[];
  className?: string;
  onStateClick?: (stateId: string) => void;
}

export function USMapInteractive({ locations, className = '', onStateClick }: USMapInteractiveProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Create a map of state IDs to case counts
  const stateCases = new Map<string, number>();
  locations.forEach(loc => {
    stateCases.set(loc.state, (stateCases.get(loc.state) || 0) + loc.cases);
  });

  const maxCases = Math.max(...Array.from(stateCases.values()), 1);

  // Get fill color based on case count
  const getStateFill = (stateId: string): string => {
    const cases = stateCases.get(stateId);
    if (!cases) return '#e2e8f0'; // Default gray

    const intensity = cases / maxCases;

    if (intensity >= 0.8) return '#dc2626'; // Red-600
    if (intensity >= 0.6) return '#ef4444'; // Red-500
    if (intensity >= 0.4) return '#f87171'; // Red-400
    if (intensity >= 0.2) return '#fca5a5'; // Red-300
    return '#fecaca'; // Red-200
  };

  // Get stroke color for state
  const getStateStroke = (stateId: string): string => {
    if (hoveredState === stateId) return '#1e40af'; // Blue-800
    if (stateCases.has(stateId)) return '#991b1b'; // Red-800
    return '#94a3b8'; // Slate-400
  };

  return (
    <div className={`relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 ${className}`} style={{ aspectRatio: '1028 / 746' }}>
      <svg
        viewBox={MAP_VIEWBOX}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect x="192" y="9" width="1028" height="746" fill="transparent" />

        {/* State paths */}
        <g>
          {usStates.map(state => {
            const cases = stateCases.get(state.id);
            const isHovered = hoveredState === state.id;
            const hasOutbreak = cases !== undefined && cases > 0;

            return (
              <path
                key={state.id}
                d={state.path}
                fill={getStateFill(state.id)}
                stroke={getStateStroke(state.id)}
                strokeWidth={isHovered ? 2 : 1}
                className="transition-all duration-150 cursor-pointer"
                style={{
                  filter: isHovered ? 'brightness(0.95)' : 'none',
                  transform: isHovered ? 'scale(1.01)' : 'scale(1)',
                  transformOrigin: 'center',
                }}
                onMouseEnter={() => setHoveredState(state.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => onStateClick?.(state.id)}
              >
                <title>{state.name}{hasOutbreak ? `: ${cases} cases` : ''}</title>
              </path>
            );
          })}
        </g>

        {/* Outbreak markers with pulse effect */}
        {locations.map((loc, idx) => {
          const state = getStateById(loc.state);
          if (!state) return null;

          const center = STATE_CENTERS[loc.state];
          if (!center) return null;

          const size = 8 + (loc.cases / maxCases) * 20;

          return (
            <g key={`marker-${idx}`}>
              {/* Pulse ring */}
              <circle
                cx={center.x}
                cy={center.y}
                r={size + 10}
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
                opacity="0.4"
                className="animate-ping"
                style={{ animationDuration: '2s' }}
              />
              {/* Marker circle */}
              <circle
                cx={center.x}
                cy={center.y}
                r={size}
                fill="#dc2626"
                stroke="#fff"
                strokeWidth="2"
                className="drop-shadow-lg"
              />
              {/* Case count label */}
              <text
                x={center.x}
                y={center.y + 4}
                textAnchor="middle"
                className="fill-white font-bold"
                style={{ fontSize: size > 15 ? '12px' : '10px' }}
              >
                {loc.cases}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3 border border-slate-200">
        <div className="text-xs font-semibold text-slate-700 mb-2">Case Density</div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 bg-slate-200 rounded-sm" />
          <div className="w-4 h-3 bg-red-200 rounded-sm" />
          <div className="w-4 h-3 bg-red-300 rounded-sm" />
          <div className="w-4 h-3 bg-red-400 rounded-sm" />
          <div className="w-4 h-3 bg-red-500 rounded-sm" />
          <div className="w-4 h-3 bg-red-600 rounded-sm" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredState && (
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 border border-slate-200">
          <div className="font-semibold text-slate-800">
            {getStateById(hoveredState)?.name}
          </div>
          {stateCases.has(hoveredState) && (
            <div className="text-sm text-red-600 font-medium">
              {stateCases.get(hoveredState)} cases
            </div>
          )}
        </div>
      )}
    </div>
  );
}
