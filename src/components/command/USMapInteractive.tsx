// src/components/command/USMapInteractive.tsx
// Interactive US Map with proper state boundaries

import { useState } from 'react';
import type { OutbreakLocation } from '../../types/command';
import { usStates, getStateById } from './USMapPaths';

// State center coordinates for labels and markers
const STATE_CENTERS: Record<string, { x: number; y: number }> = {
  'AL': { x: 628, y: 385 }, 'AK': { x: 85, y: 525 }, 'AZ': { x: 253, y: 365 },
  'AR': { x: 531, y: 365 }, 'CA': { x: 142, y: 295 }, 'CO': { x: 323, y: 270 },
  'CT': { x: 862, y: 177 }, 'DE': { x: 810, y: 235 }, 'FL': { x: 718, y: 460 },
  'GA': { x: 688, y: 385 }, 'HI': { x: 265, y: 510 }, 'ID': { x: 213, y: 155 },
  'IL': { x: 573, y: 275 }, 'IN': { x: 618, y: 275 }, 'IA': { x: 510, y: 215 },
  'KS': { x: 430, y: 295 }, 'KY': { x: 648, y: 305 }, 'LA': { x: 545, y: 425 },
  'ME': { x: 875, y: 115 }, 'MD': { x: 775, y: 250 }, 'MA': { x: 870, y: 165 },
  'MI': { x: 615, y: 185 }, 'MN': { x: 490, y: 150 }, 'MS': { x: 575, y: 395 },
  'MO': { x: 525, y: 305 }, 'MT': { x: 275, y: 95 }, 'NE': { x: 405, y: 225 },
  'NV': { x: 175, y: 255 }, 'NH': { x: 865, y: 135 }, 'NJ': { x: 820, y: 220 },
  'NM': { x: 305, y: 365 }, 'NY': { x: 795, y: 175 }, 'NC': { x: 745, y: 320 },
  'ND': { x: 420, y: 115 }, 'OH': { x: 670, y: 260 }, 'OK': { x: 440, y: 355 },
  'OR': { x: 135, y: 140 }, 'PA': { x: 765, y: 215 }, 'RI': { x: 878, y: 177 },
  'SC': { x: 720, y: 355 }, 'SD': { x: 415, y: 170 }, 'TN': { x: 640, y: 325 },
  'TX': { x: 415, y: 415 }, 'UT': { x: 250, y: 265 }, 'VT': { x: 850, y: 135 },
  'VA': { x: 755, y: 280 }, 'WA': { x: 155, y: 75 }, 'WV': { x: 720, y: 270 },
  'WI': { x: 555, y: 175 }, 'WY': { x: 295, y: 175 },
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
    <div className={`relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 ${className}`} style={{ aspectRatio: '960 / 600' }}>
      <svg
        viewBox="0 0 960 600"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect x="0" y="0" width="960" height="600" fill="transparent" />

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

        {/* State labels - only show for larger states or states with outbreaks */}
        <g className="pointer-events-none">
          {usStates.map(state => {
            const center = STATE_CENTERS[state.id];
            if (!center) return null;

            const hasCases = stateCases.has(state.id);
            // Only show labels for states with outbreaks or larger states
            const isLargeState = ['TX', 'CA', 'MT', 'AZ', 'NV', 'CO', 'NM', 'OR', 'WY', 'KS', 'NE', 'SD', 'ND', 'MN', 'OK', 'MO', 'IA', 'WI', 'IL', 'MI', 'NY', 'PA', 'FL', 'GA', 'NC', 'VA', 'OH', 'IN', 'AL', 'MS', 'LA', 'AR', 'WA', 'ID', 'UT'].includes(state.id);

            if (!hasCases && !isLargeState) return null;

            return (
              <text
                key={`label-${state.id}`}
                x={center.x}
                y={center.y + 4}
                textAnchor="middle"
                className={`text-[10px] font-bold select-none ${
                  hasCases ? 'fill-white' : 'fill-slate-500'
                }`}
                style={{
                  textShadow: hasCases ? '0 1px 2px rgba(0,0,0,0.8)' : 'none',
                }}
              >
                {state.id}
              </text>
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
