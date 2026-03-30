// src/components/command/USMap.tsx
// Simplified US state map visualization for outbreak locations

import type { OutbreakLocation } from '../../types/command';

interface USMapProps {
  locations: OutbreakLocation[];
  className?: string;
}

// State center coordinates (simplified)
const stateCoords: Record<string, { x: number; y: number }> = {
  'AL': { x: 580, y: 350 },
  'AK': { x: 130, y: 450 },
  'AZ': { x: 200, y: 320 },
  'AR': { x: 500, y: 320 },
  'CA': { x: 100, y: 260 },
  'CO': { x: 280, y: 250 },
  'CT': { x: 720, y: 180 },
  'DE': { x: 700, y: 220 },
  'FL': { x: 640, y: 420 },
  'GA': { x: 620, y: 350 },
  'HI': { x: 230, y: 460 },
  'ID': { x: 180, y: 140 },
  'IL': { x: 530, y: 230 },
  'IN': { x: 560, y: 230 },
  'IA': { x: 460, y: 200 },
  'KS': { x: 380, y: 270 },
  'KY': { x: 580, y: 270 },
  'LA': { x: 500, y: 390 },
  'ME': { x: 750, y: 100 },
  'MD': { x: 680, y: 230 },
  'MA': { x: 730, y: 160 },
  'MI': { x: 560, y: 160 },
  'MN': { x: 440, y: 130 },
  'MS': { x: 540, y: 360 },
  'MO': { x: 480, y: 270 },
  'MT': { x: 230, y: 100 },
  'NE': { x: 370, y: 210 },
  'NV': { x: 140, y: 230 },
  'NH': { x: 730, y: 130 },
  'NJ': { x: 710, y: 200 },
  'NM': { x: 260, y: 330 },
  'NY': { x: 690, y: 150 },
  'NC': { x: 660, y: 290 },
  'ND': { x: 370, y: 110 },
  'OH': { x: 600, y: 220 },
  'OK': { x: 400, y: 320 },
  'OR': { x: 110, y: 130 },
  'PA': { x: 670, y: 200 },
  'RI': { x: 735, y: 170 },
  'SC': { x: 650, y: 320 },
  'SD': { x: 370, y: 160 },
  'TN': { x: 570, y: 300 },
  'TX': { x: 370, y: 390 },
  'UT': { x: 200, y: 240 },
  'VT': { x: 715, y: 120 },
  'VA': { x: 670, y: 260 },
  'WA': { x: 120, y: 80 },
  'WV': { x: 640, y: 250 },
  'WI': { x: 510, y: 150 },
  'WY': { x: 270, y: 180 },
};

export function USMap({ locations, className = '' }: USMapProps) {
  const maxCases = Math.max(...locations.map(l => l.cases), 1);

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 800 500" className="w-full h-auto">
        {/* Simplified US outline */}
        <path
          d="M100,80 L180,80 L180,100 L250,100 L250,80 L370,80 L370,100 L450,100 L450,130 L510,130 L510,150 L560,140 L600,150 L690,130 L750,100 L760,120 L750,140 L730,160 L740,180 L720,200 L720,230 L700,250 L680,270 L670,290 L660,320 L650,350 L640,380 L640,420 L600,420 L580,400 L540,380 L500,400 L460,380 L400,400 L340,420 L280,380 L240,340 L200,330 L160,320 L100,280 L80,220 L80,140 L100,80 Z"
          fill="#e2e8f0"
          stroke="#94a3b8"
          strokeWidth="2"
        />

        {/* Outbreak location markers */}
        {locations.map((loc, idx) => {
          const coords = stateCoords[loc.state];
          if (!coords) return null;

          const size = 10 + (loc.cases / maxCases) * 30;
          const opacity = 0.5 + (loc.cases / maxCases) * 0.5;

          return (
            <g key={idx}>
              {/* Outer pulse ring */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={size + 8}
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
                opacity={opacity * 0.3}
                className="animate-ping"
                style={{ animationDuration: '2s' }}
              />
              {/* Main circle */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={size}
                fill="#dc2626"
                opacity={opacity}
              />
              {/* State label */}
              <text
                x={coords.x}
                y={coords.y + 4}
                textAnchor="middle"
                className="fill-white font-bold text-xs"
              >
                {loc.cases}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white/90 px-3 py-2 rounded-lg shadow text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600 opacity-50" />
          <span className="text-slate-600">Active outbreak location</span>
        </div>
      </div>
    </div>
  );
}
