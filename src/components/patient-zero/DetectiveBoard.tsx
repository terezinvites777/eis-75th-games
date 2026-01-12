// src/components/patient-zero/DetectiveBoard.tsx
// Cork board visual with red strings connecting clues

import type { Clue } from '../../types/patient-zero';
import { Lock, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface DetectiveBoardProps {
  clues: Clue[];
  currentDay: number;
  mysteryTitle: string;
}

// Pinned note styles for each hint level
const hintStyles = {
  vague: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    pin: 'bg-amber-500',
    icon: FileText,
  },
  moderate: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    pin: 'bg-blue-500',
    icon: AlertTriangle,
  },
  specific: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    pin: 'bg-green-500',
    icon: CheckCircle,
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
        className="relative p-4 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg shadow-md transform transition-all hover:scale-105"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Push pin */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-400 rounded-full shadow-md border-2 border-slate-300" />

        <div className="flex items-center gap-2 text-slate-400">
          <Lock size={16} />
          <div>
            <div className="font-semibold text-sm">Day {clue.day} - {clue.time === 'am' ? 'AM' : 'PM'}</div>
            <div className="text-xs">Clue locked...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative p-4 ${style.bg} border ${style.border} rounded-lg shadow-lg transform transition-all hover:scale-105 hover:z-10`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Push pin */}
      <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 ${style.pin} rounded-full shadow-md border-2 border-white`} />

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-slate-500" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Day {clue.day} {clue.time === 'am' ? 'Morning' : 'Afternoon'}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm text-slate-700 leading-relaxed font-serif italic">
        "{clue.content}"
      </p>

      {/* Hint level badge */}
      <div className="mt-2 text-right">
        <span className={`
          inline-block px-2 py-0.5 rounded text-xs font-medium
          ${clue.hint_level === 'vague' ? 'bg-amber-200 text-amber-800' :
            clue.hint_level === 'moderate' ? 'bg-blue-200 text-blue-800' :
            'bg-green-200 text-green-800'}
        `}>
          {clue.hint_level}
        </span>
      </div>
    </div>
  );
}

export function DetectiveBoard({ clues, currentDay, mysteryTitle }: DetectiveBoardProps) {
  const revealedCount = clues.filter(c => c.day <= currentDay).length;

  return (
    <div className="relative bg-amber-100 rounded-xl p-6 shadow-inner border-4 border-amber-900/20 overflow-hidden">
      {/* Cork board texture pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23a16207' fill-opacity='0.3'/%3E%3Ccircle cx='10' cy='10' r='0.5' fill='%23a16207' fill-opacity='0.2'/%3E%3Ccircle cx='30' cy='30' r='0.5' fill='%23a16207' fill-opacity='0.2'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Title card pinned at top */}
      <div className="relative mb-8 text-center">
        <div className="inline-block bg-white px-6 py-3 rounded shadow-md border border-slate-200 transform -rotate-1">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full shadow-md border-2 border-red-400" />
          <h3 className="text-lg font-bold text-slate-800 font-serif">{mysteryTitle}</h3>
          <p className="text-xs text-slate-500 mt-1">
            {revealedCount} of {clues.length} clues revealed
          </p>
        </div>
      </div>

      {/* Red strings SVG connecting revealed clues */}
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
              stroke="#dc2626"
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

      {/* Photo evidence corner */}
      <div className="absolute bottom-4 right-4 opacity-60">
        <div className="w-16 h-12 bg-slate-200 rounded shadow transform rotate-6 border border-slate-300">
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
            ?
          </div>
        </div>
      </div>
    </div>
  );
}
