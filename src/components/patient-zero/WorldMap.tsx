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
    <div className="pz-frame relative">
      {/* Map container with dark museum background */}
      <div className="relative bg-gradient-to-br from-[#2a1f15] to-[#1a140d] rounded-xl overflow-hidden">
        {/* US Map SVG using proper state boundaries */}
        <svg
          viewBox={MAP_VIEWBOX}
          className="w-full h-52 md:h-72"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background */}
          <rect x="192" y="9" width="1028" height="746" fill="transparent" />

          {/* State paths - sepia/parchment tones for museum aesthetic */}
          <g>
            {usStates.map(state => (
              <path
                key={state.id}
                d={state.path}
                fill="rgba(212, 175, 55, 0.12)"
                stroke="rgba(184, 134, 11, 0.4)"
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
                    stroke={loc.isFeatured ? '#d4af37' : '#c9a227'}
                    strokeWidth="2"
                    opacity="0.4"
                    className="animate-ping"
                    style={{ animationDuration: '2s' }}
                  />
                )}

                {/* Main marker - brass/gold tones */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={size}
                  fill={loc.isFeatured ? '#d4af37' : loc.revealed ? '#8b6914' : '#c9a227'}
                  stroke="rgba(255,255,255,0.8)"
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
              className="absolute pz-parchment !p-3 z-30 pointer-events-none animate-fade-in"
              style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform: 'translate(-50%, -120%)',
              }}
            >
              <div className="text-sm font-bold text-[#2d1f10] whitespace-nowrap font-serif">{loc.title}</div>
              {loc.isFeatured && (
                <div className="flex items-center gap-1 text-xs text-[#8b6914] font-semibold mt-1">
                  <Star size={10} />
                  75th Anniversary Feature
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-[#4a3728] mt-1">
                {loc.revealed ? (
                  <>
                    <CheckCircle size={10} className="text-[#8b6914]" />
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

        {/* Title overlay - brass plaque style */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#c9a227] to-[#8b6914] rounded-lg px-3 py-2 shadow-lg border border-[rgba(255,255,255,0.3)]">
            <MapPin size={14} className="text-[#1a140d]" />
            <span className="text-xs font-bold text-[#1a140d] drop-shadow-sm">Mystery Locations</span>
          </div>
        </div>

        {/* Legend with vintage pills */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-[rgba(26,20,13,0.7)] text-[#f4e4c1] border border-[rgba(212,175,55,0.3)]">
            <div className="w-2 h-2 bg-[#c9a227] rounded-full" />
            Active
          </span>
          <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-[rgba(26,20,13,0.7)] text-[#f4e4c1] border border-[rgba(212,175,55,0.3)]">
            <div className="w-2 h-2 bg-[#8b6914] rounded-full" />
            Solved
          </span>
          <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded bg-[rgba(26,20,13,0.7)] text-[#f4e4c1] border border-[rgba(212,175,55,0.3)]">
            <div className="w-2 h-2 bg-[#d4af37] rounded-full" />
            Featured
          </span>
        </div>
      </div>

      {/* Bottom instruction - parchment style */}
      <div className="p-3 bg-gradient-to-r from-[rgba(248,240,210,0.95)] to-[rgba(230,215,170,0.95)] text-center border-t border-[rgba(139,115,85,0.3)]">
        <span className="flex items-center justify-center gap-2 text-xs text-[#3d2b1f] font-medium">
          <Search size={12} className="text-[#8b6914]" />
          Click a location marker to begin your investigation
        </span>
      </div>
    </div>
  );
}
