// src/components/patient-zero/ClueReveal.tsx
import type { Clue } from '../../types/patient-zero';
import { Clock, Sun, Moon, Lock } from 'lucide-react';

interface ClueRevealProps {
  clue: Clue;
  isRevealed: boolean;
  isNew?: boolean;
}

const hintLevelColors = {
  vague: 'border-slate-300 bg-slate-50',
  moderate: 'border-amber-300 bg-amber-50',
  specific: 'border-green-300 bg-green-50',
};

export function ClueReveal({ clue, isRevealed, isNew }: ClueRevealProps) {
  if (!isRevealed) {
    return (
      <div className="bg-slate-100 rounded-xl p-4 border-2 border-dashed border-slate-300">
        <div className="flex items-center gap-3 text-slate-400">
          <Lock size={20} />
          <div>
            <div className="font-semibold">Day {clue.day} • {clue.time === 'am' ? 'Morning' : 'Afternoon'} Clue</div>
            <div className="text-sm">Available soon...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        rounded-xl p-4 border-2 transition-all
        ${hintLevelColors[clue.hint_level]}
        ${isNew ? 'animate-pulse ring-2 ring-blue-400' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
          <Clock size={14} />
          Day {clue.day}
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500">
          {clue.time === 'am' ? <Sun size={14} /> : <Moon size={14} />}
          {clue.time === 'am' ? 'Morning' : 'Afternoon'}
        </div>
        <span className={`
          ml-auto px-2 py-0.5 rounded-full text-xs font-medium
          ${clue.hint_level === 'vague' ? 'bg-slate-200 text-slate-600' :
            clue.hint_level === 'moderate' ? 'bg-amber-200 text-amber-700' :
            'bg-green-200 text-green-700'}
        `}>
          {clue.hint_level}
        </span>
      </div>

      {/* Clue content */}
      <p className="text-slate-700 leading-relaxed">{clue.content}</p>
    </div>
  );
}
