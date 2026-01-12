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

// Convert lat/lng to position on US-focused map
// US bounds: lat 24-50, lng -125 to -66
function latLngToUSPosition(lat: number, lng: number) {
  const minLat = 24, maxLat = 50;
  const minLng = -125, maxLng = -66;

  // Clamp values to US bounds
  const clampedLat = Math.max(minLat, Math.min(maxLat, lat));
  const clampedLng = Math.max(minLng, Math.min(maxLng, lng));

  const x = ((clampedLng - minLng) / (maxLng - minLng)) * 100;
  const y = ((maxLat - clampedLat) / (maxLat - minLat)) * 100;

  return { x, y };
}

export function WorldMap({ locations, onLocationClick }: WorldMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700">
      {/* US Map SVG */}
      <svg
        viewBox="0 0 960 600"
        className="w-full h-48 md:h-64"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect width="960" height="600" fill="transparent" />

        {/* Grid lines */}
        <g stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1">
          {[...Array(7)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 100} x2="960" y2={i * 100} />
          ))}
          {[...Array(10)].map((_, i) => (
            <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" />
          ))}
        </g>

        {/* Simplified US outline - Continental US */}
        <path
          d="M 120 180
             L 180 140 L 260 120 L 340 100 L 420 90 L 500 85 L 580 90 L 660 100 L 720 120
             L 780 150 L 820 180 L 850 220 L 870 280 L 860 340 L 840 380 L 800 420
             L 750 450 L 680 470 L 600 480 L 520 475 L 440 465 L 360 450 L 280 440
             L 200 450 L 150 480 L 120 500 L 100 460 L 90 400 L 85 340 L 90 280 L 100 230 Z"
          fill="rgba(220, 38, 38, 0.12)"
          stroke="rgba(220, 38, 38, 0.4)"
          strokeWidth="2"
        />

        {/* State-like divisions for visual interest */}
        <g stroke="rgba(220, 38, 38, 0.15)" strokeWidth="1" fill="none">
          {/* Vertical divisions */}
          <line x1="300" y1="100" x2="280" y2="450" />
          <line x1="450" y1="90" x2="440" y2="470" />
          <line x1="600" y1="90" x2="600" y2="480" />
          <line x1="720" y1="120" x2="750" y2="450" />
          {/* Horizontal divisions */}
          <line x1="90" y1="300" x2="870" y2="300" />
          <line x1="100" y1="400" x2="840" y2="400" />
        </g>

        {/* Region labels */}
        <g fill="rgba(148, 163, 184, 0.3)" fontSize="12" fontFamily="sans-serif">
          <text x="180" y="320">West</text>
          <text x="380" y="280">Central</text>
          <text x="550" y="250">Midwest</text>
          <text x="750" y="300">East</text>
          <text x="450" y="430">South</text>
        </g>

        {/* Notable cities as reference dots */}
        <g fill="rgba(148, 163, 184, 0.25)">
          <circle cx="140" cy="200" r="3" /> {/* Seattle */}
          <circle cx="120" cy="340" r="3" /> {/* LA */}
          <circle cx="280" cy="450" r="3" /> {/* Houston */}
          <circle cx="520" cy="300" r="3" /> {/* Chicago */}
          <circle cx="820" cy="280" r="3" /> {/* NYC */}
          <circle cx="780" cy="380" r="3" /> {/* Atlanta */}
        </g>
      </svg>

      {/* Mystery location pins */}
      {locations.map(loc => {
        const pos = latLngToUSPosition(loc.lat, loc.lng);
        const isHovered = hoveredLocation === loc.id;

        return (
          <div
            key={loc.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125"
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
            {/* Pulse animation for unrevealed mysteries */}
            {!loc.revealed && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-red-500 rounded-full animate-ping opacity-30" />
            )}

            {/* Pin marker */}
            <div className={`
              relative flex items-center justify-center rounded-full border-2 shadow-lg
              ${loc.isFeatured
                ? 'bg-amber-500 border-amber-300 w-10 h-10'
                : loc.revealed
                  ? 'bg-green-500 border-green-300 w-7 h-7'
                  : 'bg-red-500 border-red-300 w-7 h-7'
              }
            `}>
              {loc.revealed ? (
                <MapPin size={loc.isFeatured ? 20 : 14} className="text-white" />
              ) : (
                <HelpCircle size={loc.isFeatured ? 20 : 14} className="text-white" />
              )}
            </div>

            {/* Tooltip */}
            {isHovered && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-white rounded-lg shadow-xl whitespace-nowrap z-30 border border-slate-200">
                <div className="text-sm font-semibold text-slate-800">{loc.title}</div>
                {loc.isFeatured && (
                  <span className="text-xs text-amber-600 font-medium">75th Anniversary Feature</span>
                )}
                {!loc.revealed && (
                  <span className="text-xs text-slate-500 block">Click to investigate</span>
                )}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
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
        <p className="text-xs text-white/60">Click a pin to investigate</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex items-center gap-3 text-xs text-white/70">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>Solved</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-amber-500 rounded-full" />
          <span>Featured</span>
        </div>
      </div>
    </div>
  );
}
