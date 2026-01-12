// src/components/patient-zero/WorldMap.tsx
// Interactive US map with brand styling integration

import { useState } from 'react';
import { MapPin, Search, CheckCircle, Star } from 'lucide-react';
import { usStates, MAP_VIEWBOX } from '../command/USMapPaths';

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

// Convert lat/lng to SVG coordinates for the USMapPaths viewBox (192 9 1028 746)
// US bounds approximately: lat 25-49, lng -125 to -67
function latLngToSvgCoords(lat: number, lng: number) {
  const minLat = 25, maxLat = 49;
  const minLng = -125, maxLng = -67;

  // Map viewBox is "192 9 1028 746" so x: 192-1220, y: 9-755
  const x = 192 + ((lng - minLng) / (maxLng - minLng)) * 1028;
  const y = 9 + ((maxLat - lat) / (maxLat - minLat)) * 746;

  return { x, y };
}

export function WorldMap({ locations, onLocationClick }: WorldMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  return (
    <div className="panel relative overflow-hidden">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]" />

      {/* Map container with dark background */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden border border-slate-700 mt-1">
        {/* US Map SVG using proper state boundaries */}
        <svg
          viewBox={MAP_VIEWBOX}
          className="w-full h-52 md:h-72"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect x="192" y="9" width="1028" height="746" fill="transparent" />

          {/* State paths - all states in theme-tinted red */}
          <g>
            {usStates.map(state => (
              <path
                key={state.id}
                d={state.path}
                fill="rgba(220, 38, 38, 0.15)"
                stroke="rgba(220, 38, 38, 0.4)"
                strokeWidth="1"
                className="transition-colors"
              />
            ))}
          </g>

          {/* Mystery location markers */}
          {locations.map(loc => {
            const coords = latLngToSvgCoords(loc.lat, loc.lng);
            const isHovered = hoveredLocation === loc.id;
            const size = loc.isFeatured ? 24 : 18;

            return (
              <g
                key={loc.id}
                className="cursor-pointer"
                onClick={() => onLocationClick?.(loc.id)}
                onMouseEnter={() => setHoveredLocation(loc.id)}
                onMouseLeave={() => setHoveredLocation(null)}
                style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)', transformOrigin: `${coords.x}px ${coords.y}px` }}
              >
                {/* Pulse ring for active mysteries */}
                {!loc.revealed && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={size + 15}
                    fill="none"
                    stroke={loc.isFeatured ? '#f59e0b' : '#dc2626'}
                    strokeWidth="2"
                    opacity="0.4"
                    className="animate-ping"
                    style={{ animationDuration: '2s' }}
                  />
                )}

                {/* Main marker */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={size}
                  fill={loc.isFeatured ? '#f59e0b' : loc.revealed ? '#22c55e' : '#dc2626'}
                  stroke="#fff"
                  strokeWidth="3"
                  className="drop-shadow-lg"
                />

                {/* Icon */}
                <g transform={`translate(${coords.x - 8}, ${coords.y - 8})`}>
                  {loc.revealed ? (
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                      fill="white"
                      transform="scale(0.7)"
                    />
                  ) : (
                    <circle cx="8" cy="8" r="5" fill="none" stroke="white" strokeWidth="2" />
                  )}
                </g>
              </g>
            );
          })}
        </svg>

        {/* Tooltips - rendered outside SVG for better styling */}
        {locations.map(loc => {
          const isHovered = hoveredLocation === loc.id;
          if (!isHovered) return null;

          // Calculate percentage position for tooltip
          const coords = latLngToSvgCoords(loc.lat, loc.lng);
          const xPercent = ((coords.x - 192) / 1028) * 100;
          const yPercent = ((coords.y - 9) / 746) * 100;

          return (
            <div
              key={`tooltip-${loc.id}`}
              className="absolute panel !p-3 z-30 pointer-events-none animate-fade-in"
              style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform: 'translate(-50%, -120%)',
              }}
            >
              <div className="text-sm font-bold text-slate-800 whitespace-nowrap">{loc.title}</div>
              {loc.isFeatured && (
                <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-1">
                  <Star size={10} />
                  75th Anniversary Feature
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                {loc.revealed ? (
                  <>
                    <CheckCircle size={10} className="text-green-500" />
                    Case solved
                  </>
                ) : (
                  <>
                    <Search size={10} />
                    Click to investigate
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Title overlay with brand styling */}
        <div className="absolute top-3 left-3">
          <div className="section-header mb-0 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
            <MapPin size={14} className="text-red-400" />
            <span className="text-xs font-bold text-white drop-shadow-lg">Mystery Locations</span>
          </div>
        </div>

        {/* Legend with pills */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="pill text-xs bg-red-900/80 text-red-200 border-red-700">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            Active
          </span>
          <span className="pill text-xs bg-green-900/80 text-green-200 border-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Solved
          </span>
          <span className="pill text-xs bg-amber-900/80 text-amber-200 border-amber-700">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
            Featured
          </span>
        </div>
      </div>

      {/* Bottom instruction */}
      <div className="mt-3 text-center">
        <span className="pill text-xs">
          <Search size={12} />
          Click a location marker to begin your investigation
        </span>
      </div>
    </div>
  );
}
