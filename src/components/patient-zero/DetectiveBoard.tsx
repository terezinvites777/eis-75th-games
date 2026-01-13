// src/components/patient-zero/DetectiveBoard.tsx
// Cork board visual with brand styling integration

import type { Clue } from '../../types/patient-zero';
import { Lock, FileText, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { OrnateCornersWrapper } from '../ui/OrnateCornersWrapper';

interface DetectiveBoardProps {
  clues: Clue[];
  currentDay: number;
  mysteryTitle: string;
}

// Pinned note styles for each hint level - vintage parchment aesthetic
const hintStyles = {
  vague: {
    bg: 'bg-gradient-to-b from-[#f8f0d8] to-[#e8dcc0]',
    border: 'border-[#c9a227]',
    pin: 'bg-gradient-to-br from-[#d4af37] to-[#8b6914]',
    icon: FileText,
    badge: 'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#1a140d] rounded border border-[rgba(255,255,255,0.3)]',
    badgeText: 'cryptic',
  },
  moderate: {
    bg: 'bg-gradient-to-b from-[#f5f0e6] to-[#e5dcd0]',
    border: 'border-[#8b7355]',
    pin: 'bg-gradient-to-br from-[#c9a227] to-[#705812]',
    icon: AlertTriangle,
    badge: 'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[rgba(139,115,85,0.25)] text-[#3d2b1f] rounded border border-[rgba(139,115,85,0.4)]',
    badgeText: 'helpful',
  },
  specific: {
    bg: 'bg-gradient-to-b from-[#f0ebe0] to-[#ddd5c8]',
    border: 'border-[#705812]',
    pin: 'bg-gradient-to-br from-[#8b6914] to-[#554410]',
    icon: CheckCircle,
    badge: 'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#8b6914] to-[#705812] text-[#f4e4c1] rounded border border-[rgba(255,255,255,0.2)]',
    badgeText: 'key clue',
  },
};

function PinnedClue({ clue, isRevealed, position }: { clue: Clue; isRevealed: boolean; position: number }) {
  const style = hintStyles[clue.hint_level];
  const Icon = style.icon;

  // Slight rotation for each card to look like pinned notes
  const rotations = [-2, 1, -1, 2, -1.5, 1.5];
  const rotation = rotations[position % rotations.length];

  if (!isRevealed) {
    return (
      <div
        className="pz-clueItem is-locked relative p-4 rounded-lg shadow-md transform transition-all hover:scale-105"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Push pin - brass */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-[#8b7355] to-[#5c4a36] rounded-full shadow-md border-2 border-[rgba(255,255,255,0.2)]" />

        <div className="flex items-center gap-2 text-[#8b7355]">
          <Lock size={16} />
          <div>
            <div className="font-semibold text-sm font-serif">Day {clue.day} - {clue.time === 'am' ? 'AM' : 'PM'}</div>
            <div className="text-xs">Clue locked...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`pz-pinnedNote relative p-4 ${style.bg} border-2 ${style.border} rounded-lg shadow-lg transform transition-all hover:scale-105 hover:z-10 animate-slide-up`}
      style={{ transform: `rotate(${rotation}deg)`, animationDelay: `${position * 100}ms` }}
    >
      {/* Push pin - brass/gold gradient */}
      <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 ${style.pin} rounded-full shadow-lg border-2 border-[rgba(255,255,255,0.4)]`} />

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-[#8b6914]" />
        <span className="text-xs font-semibold text-[#705812] uppercase tracking-wide font-serif">
          Day {clue.day} {clue.time === 'am' ? 'Morning' : 'Afternoon'}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm text-[#2d1f10] leading-relaxed font-serif italic">
        "{clue.content}"
      </p>

      {/* Hint level badge */}
      <div className="mt-3 text-right">
        <span className={style.badge}>
          {style.badgeText}
        </span>
      </div>
    </div>
  );
}

export function DetectiveBoard({ clues, currentDay, mysteryTitle }: DetectiveBoardProps) {
  const revealedCount = clues.filter(c => c.day <= currentDay).length;

  return (
    <OrnateCornersWrapper size="md" className="mb-4">
      <div className="pz-frame relative overflow-hidden animate-slide-up p-4">
      {/* Cork board texture background - darker mahogany */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3d2b1f] to-[#2a1f15] rounded-xl" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23d4af37' fill-opacity='0.3'/%3E%3Ccircle cx='10' cy='10' r='0.5' fill='%23c9a227' fill-opacity='0.2'/%3E%3Ccircle cx='30' cy='30' r='0.5' fill='%23b8860b' fill-opacity='0.2'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Title card pinned at top - parchment style */}
      <div className="relative mb-8 text-center">
        <div className="inline-block pz-parchment px-6 py-3 shadow-xl transform -rotate-1">
          {/* Brass push pin */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-to-br from-[#d4af37] to-[#8b6914] rounded-full shadow-lg border-2 border-[rgba(255,255,255,0.4)]" />
          <h3 className="text-lg font-bold text-[#2d1f10] font-serif">{mysteryTitle}</h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Search size={12} className="text-[#8b6914]" />
            <span className="text-xs text-[#4a3728]">
              {revealedCount} of {clues.length} clues revealed
            </span>
          </div>
        </div>
      </div>

      {/* Gold strings SVG connecting revealed clues */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <filter id="string-shadow">
            <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Horizontal connections between cards */}
        {clues.map((clue, idx) => {
          if (idx === 0 || clue.day > currentDay) return null;
          const prevClue = clues[idx - 1];
          if (prevClue.day > currentDay) return null;

          const x1 = `${(idx - 1) * (100 / (clues.length - 1)) + 8}%`;
          const x2 = `${idx * (100 / (clues.length - 1)) + 8}%`;

          return (
            <line
              key={`string-${idx}`}
              x1={x1}
              y1="65%"
              x2={x2}
              y2="65%"
              stroke="#c9a227"
              strokeWidth="2"
              strokeDasharray="8,4"
              filter="url(#string-shadow)"
              className="animate-pulse"
              style={{ animationDelay: `${idx * 100}ms`, animationDuration: '3s' }}
            />
          );
        })}
      </svg>

      {/* Clue grid */}
      <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4" style={{ zIndex: 2 }}>
        {clues.map((clue, idx) => (
          <PinnedClue
            key={`clue-${idx}`}
            clue={clue}
            isRevealed={clue.day <= currentDay}
            position={idx}
          />
        ))}
      </div>

        {/* Photo evidence corner - vintage polaroid */}
        <div className="absolute bottom-4 right-4 opacity-70">
          <div className="w-16 h-12 bg-gradient-to-b from-[#f8f0d8] to-[#e8dcc0] rounded shadow-lg transform rotate-6 border-2 border-[#8b7355]">
            <div className="w-full h-full flex items-center justify-center text-[#8b7355] text-xs font-serif">
              ?
            </div>
          </div>
        </div>
      </div>
    </OrnateCornersWrapper>
  );
}
