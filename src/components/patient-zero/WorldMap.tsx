// src/components/patient-zero/WorldMap.tsx
// Interactive US map showing mystery locations

import { useState } from 'react';
import { MapPin, HelpCircle } from 'lucide-react';

interface MysteryLocation {
  id: string;
  title: string;
  lat: number;
  lng: number;
  revealed: boolean;
  isFeatured?: boolean;
}

interface WorldMapProps {
  locations: MysteryLocation[];
  onLocationClick?: (id: string) => void;
}

// Convert lat/lng to position on US map
// US bounds approximately: lat 25-49, lng -125 to -67
function latLngToUSPosition(lat: number, lng: number) {
  const minLat = 25, maxLat = 49;
  const minLng = -125, maxLng = -67;

  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

  return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

export function WorldMap({ locations, onLocationClick }: WorldMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700">
      {/* US Map SVG - Simplified but recognizable outline */}
      <svg
        viewBox="0 0 960 600"
        className="w-full h-52 md:h-72"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="usaFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(220, 38, 38, 0.15)" />
            <stop offset="100%" stopColor="rgba(153, 27, 27, 0.1)" />
          </linearGradient>
        </defs>

        {/* Background grid */}
        <g stroke="rgba(148, 163, 184, 0.06)" strokeWidth="1">
          {[...Array(7)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 100} x2="960" y2={i * 100} />
          ))}
          {[...Array(10)].map((_, i) => (
            <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" />
          ))}
        </g>

        {/* Continental US outline - proper shape */}
        <path
          d="M158,138 L175,125 L195,118 L220,112 L248,108 L275,106 L298,108 L325,112
             L355,118 L385,125 L410,128 L435,130 L458,130 L480,128 L505,125 L530,120
             L555,115 L580,112 L605,112 L630,115 L658,122 L688,135 L715,150 L738,168
             L758,188 L775,210 L788,235 L798,262 L805,290 L808,318 L805,348 L798,378
             L785,405 L768,428 L745,448 L718,462 L688,472 L655,478 L620,480 L585,478
             L548,472 L510,465 L472,458 L435,455 L398,458 L362,465 L328,475 L295,488
             L265,498 L238,502 L212,498 L188,488 L168,472 L152,452 L140,428 L132,402
             L128,375 L128,348 L132,320 L138,292 L145,265 L152,240 L158,215 L162,190
             L162,165 L158,138 Z"
          fill="url(#usaFill)"
          stroke="rgba(220, 38, 38, 0.5)"
          strokeWidth="2"
        />

        {/* Florida peninsula */}
        <path
          d="M745,448 L755,465 L768,488 L775,512 L772,535 L762,548 L748,555 L735,548
             L728,532 L725,512 L728,488 L735,465 L745,448 Z"
          fill="url(#usaFill)"
          stroke="rgba(220, 38, 38, 0.5)"
          strokeWidth="2"
        />

        {/* Texas bulge */}
        <path
          d="M328,475 L315,495 L305,518 L298,542 L305,558 L322,568 L345,572 L372,568
             L398,558 L418,542 L428,518 L432,495 L428,475 L398,458 L362,465 L328,475 Z"
          fill="url(#usaFill)"
          stroke="rgba(220, 38, 38, 0.5)"
          strokeWidth="2"
        />

        {/* State-ish divider lines */}
        <g stroke="rgba(220, 38, 38, 0.12)" strokeWidth="1" fill="none" strokeDasharray="4,4">
          <line x1="280" y1="110" x2="280" y2="470" />
          <line x1="400" y1="130" x2="400" y2="555" />
          <line x1="520" y1="120" x2="520" y2="478" />
          <line x1="650" y1="120" x2="650" y2="478" />
          <line x1="130" y1="280" x2="800" y2="280" />
          <line x1="130" y1="380" x2="800" y2="380" />
        </g>

        {/* Region labels */}
        <g fill="rgba(148, 163, 184, 0.25)" fontSize="14" fontFamily="system-ui, sans-serif" fontWeight="500">
          <text x="195" y="310">WEST</text>
          <text x="335" y="350">SOUTHWEST</text>
          <text x="455" y="250">CENTRAL</text>
          <text x="580" y="300">MIDWEST</text>
          <text x="720" y="320">EAST</text>
        </g>
      </svg>

      {/* Mystery location pins - positioned over the SVG */}
      {locations.map(loc => {
        const pos = latLngToUSPosition(loc.lat, loc.lng);
        const isHovered = hoveredLocation === loc.id;

        return (
          <div
            key={loc.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-125"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              zIndex: isHovered || loc.isFeatured ? 20 : 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onLocationClick?.(loc.id);
            }}
            onMouseEnter={() => setHoveredLocation(loc.id)}
            onMouseLeave={() => setHoveredLocation(null)}
          >
            {/* Pulse animation for active mysteries */}
            {!loc.revealed && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-500 rounded-full animate-ping opacity-20" />
            )}

            {/* Pin marker */}
            <div className={`
              relative flex items-center justify-center rounded-full border-2 shadow-lg transition-all
              ${loc.isFeatured
                ? 'bg-amber-500 border-amber-300 w-10 h-10 shadow-amber-500/40'
                : loc.revealed
                  ? 'bg-green-500 border-green-300 w-8 h-8 shadow-green-500/40'
                  : 'bg-red-500 border-red-300 w-8 h-8 shadow-red-500/40'
              }
            `}>
              {loc.revealed ? (
                <MapPin size={loc.isFeatured ? 20 : 16} className="text-white" />
              ) : (
                <HelpCircle size={loc.isFeatured ? 20 : 16} className="text-white" />
              )}
            </div>

            {/* Tooltip */}
            {isHovered && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-white rounded-lg shadow-xl whitespace-nowrap z-30 border border-slate-200">
                <div className="text-sm font-bold text-slate-800">{loc.title}</div>
                {loc.isFeatured && (
                  <div className="text-xs text-amber-600 font-semibold">75th Anniversary Feature</div>
                )}
                <div className="text-xs text-slate-500 mt-1">
                  {loc.revealed ? 'Case solved' : 'Click to investigate'}
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
              </div>
            )}
          </div>
        );
      })}

      {/* Title overlay */}
      <div className="absolute top-3 left-3 text-white">
        <h3 className="text-sm font-bold drop-shadow-lg flex items-center gap-2">
          <MapPin size={14} className="text-red-400" />
          Mystery Locations
        </h3>
        <p className="text-xs text-white/50">Click a pin to investigate</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm" />
          <span className="text-white/70">Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm" />
          <span className="text-white/70">Solved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm" />
          <span className="text-white/70">Featured</span>
        </div>
      </div>
    </div>
  );
}
