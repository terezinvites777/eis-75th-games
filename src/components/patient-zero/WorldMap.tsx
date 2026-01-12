// src/components/patient-zero/WorldMap.tsx
// Interactive US map showing mystery locations - reuses state data from Outbreak Command

import { useState } from 'react';
import { MapPin } from 'lucide-react';
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
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-slate-700">
      {/* US Map SVG using proper state boundaries */}
      <svg
        viewBox={MAP_VIEWBOX}
        className="w-full h-52 md:h-72"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect x="192" y="9" width="1028" height="746" fill="transparent" />

        {/* State paths - all states in dark red tint */}
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
            className="absolute px-4 py-2 bg-white rounded-lg shadow-xl z-30 border border-slate-200 pointer-events-none"
            style={{
              left: `${xPercent}%`,
              top: `${yPercent}%`,
              transform: 'translate(-50%, -120%)',
            }}
          >
            <div className="text-sm font-bold text-slate-800 whitespace-nowrap">{loc.title}</div>
            {loc.isFeatured && (
              <div className="text-xs text-amber-600 font-semibold">75th Anniversary Feature</div>
            )}
            <div className="text-xs text-slate-500 mt-0.5">
              {loc.revealed ? 'Case solved' : 'Click to investigate'}
            </div>
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
