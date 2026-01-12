// src/components/patient-zero/WorldMap.tsx
// Interactive world map showing mystery locations

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

// Convert lat/lng to percentage positions on the map
// Using equirectangular projection for simplicity
function latLngToPosition(lat: number, lng: number) {
  // Map: lat -90 to 90 -> y 100% to 0%, lng -180 to 180 -> x 0% to 100%
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

export function WorldMap({ locations, onLocationClick }: WorldMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700">
      {/* Simple SVG world map outline */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-48 md:h-64"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect width="1000" height="500" fill="transparent" />

        {/* Grid lines */}
        <g stroke="rgba(148, 163, 184, 0.1)" strokeWidth="0.5">
          {[...Array(9)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 62.5} x2="1000" y2={i * 62.5} />
          ))}
          {[...Array(17)].map((_, i) => (
            <line key={`v-${i}`} x1={i * 62.5} y1="0" x2={i * 62.5} y2="500" />
          ))}
        </g>

        {/* Simple continent outlines */}
        <g fill="rgba(148, 163, 184, 0.2)" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="0.5">
          {/* North America (simplified) */}
          <path d="M120,80 L250,70 L280,100 L290,150 L260,200 L220,220 L180,250 L150,230 L100,200 L80,150 L100,100 Z" />
          {/* South America (simplified) */}
          <path d="M200,260 L240,250 L270,280 L280,350 L260,420 L220,450 L190,400 L180,320 Z" />
          {/* Europe (simplified) */}
          <path d="M450,80 L520,70 L560,90 L540,140 L490,150 L450,130 Z" />
          {/* Africa (simplified) */}
          <path d="M460,170 L530,160 L560,200 L550,300 L500,350 L450,320 L440,250 L450,200 Z" />
          {/* Asia (simplified) */}
          <path d="M560,60 L750,50 L850,100 L870,180 L800,220 L700,200 L600,160 L560,120 Z" />
          {/* Australia (simplified) */}
          <path d="M780,300 L860,290 L890,330 L870,380 L810,390 L770,360 L760,320 Z" />
        </g>

        {/* USA highlighted since most mysteries are there */}
        <path
          d="M130,130 L250,125 L260,160 L240,180 L180,190 L140,175 L120,150 Z"
          fill="rgba(220, 38, 38, 0.15)"
          stroke="rgba(220, 38, 38, 0.4)"
          strokeWidth="1"
        />
      </svg>

      {/* Mystery location pins */}
      {locations.map(loc => {
        const pos = latLngToPosition(loc.lat, loc.lng);
        const isHovered = hoveredLocation === loc.id;

        return (
          <div
            key={loc.id}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-transform hover:scale-125"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              zIndex: isHovered || loc.isFeatured ? 20 : 10,
            }}
            onClick={() => onLocationClick?.(loc.id)}
            onMouseEnter={() => setHoveredLocation(loc.id)}
            onMouseLeave={() => setHoveredLocation(null)}
          >
            {/* Pulse animation for unrevealed mysteries */}
            {!loc.revealed && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-500 rounded-full animate-ping opacity-40" />
            )}

            {/* Pin marker */}
            <div className={`
              relative flex items-center justify-center w-6 h-6 rounded-full border-2 shadow-lg
              ${loc.isFeatured
                ? 'bg-amber-500 border-amber-300 w-8 h-8'
                : loc.revealed
                  ? 'bg-green-500 border-green-300'
                  : 'bg-red-500 border-red-300'
              }
            `}>
              {loc.revealed ? (
                <MapPin size={loc.isFeatured ? 16 : 12} className="text-white" />
              ) : (
                <HelpCircle size={loc.isFeatured ? 16 : 12} className="text-white" />
              )}
            </div>

            {/* Tooltip */}
            {isHovered && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-xl whitespace-nowrap z-30 border border-slate-200">
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
          Where in the World?
        </h3>
        <p className="text-xs text-white/60">Click a location to investigate</p>
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
