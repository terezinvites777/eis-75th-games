// src/components/patient-zero/MysteryCard.tsx
// Mystery case card with brand styling

import type { MysteryDefinition } from '../../types/patient-zero';
import { Search, Play, CheckCircle, Star, HelpCircle, Zap } from 'lucide-react';

interface MysteryCardProps {
  mystery: MysteryDefinition;
  currentDay: number;
  isComplete?: boolean;
  score?: number;
  onStart: (id: string) => void;
}

export function MysteryCard({ mystery, currentDay, isComplete, score, onStart }: MysteryCardProps) {
  const totalClues = mystery.clues.length;
  const revealedClues = mystery.clues.filter(c => c.day <= currentDay).length;

  return (
    <div
      className="game-card group"
      onClick={() => onStart(mystery.id)}
    >
      {/* Top accent bar - theme color based on status */}
      <div className={`absolute top-0 left-0 right-0 h-1 transition-opacity ${
        isComplete
          ? 'bg-gradient-to-r from-green-400 to-emerald-500 opacity-100'
          : mystery.isFeatured
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 opacity-100'
            : 'bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)] opacity-0 group-hover:opacity-100'
      }`} />

      {/* Header row */}
      <div className="flex items-start justify-between mb-3 pt-1">
        <div className="flex-1">
          {mystery.isFeatured && (
            <span className="pill pill-gold text-xs mb-2">
              <Star size={12} />
              Featured
            </span>
          )}
          <h3 className="text-lg font-bold text-slate-800">{mystery.title}</h3>
        </div>
        <div className={`p-2 rounded-lg transition-colors ${
          isComplete
            ? 'bg-green-100'
            : 'bg-slate-100 group-hover:bg-[var(--theme-surface)]'
        }`}>
          {isComplete ? (
            <CheckCircle size={20} className="text-green-600" />
          ) : (
            <Search size={20} className="text-slate-400 group-hover:text-[var(--theme-primary)]" />
          )}
        </div>
      </div>

      {/* Clues info */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <HelpCircle size={14} />
        <span>{totalClues} clues to discover</span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="stat-label !mt-0">Clues Revealed</span>
          <span className="font-medium text-slate-700">{revealedClues} / {totalClues}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(revealedClues / totalClues) * 100}%`,
              background: isComplete
                ? 'linear-gradient(90deg, #22c55e, #10b981)'
                : undefined
            }}
          />
        </div>
      </div>

      {/* Score display if complete */}
      {isComplete && score !== undefined && (
        <div className="stat-card mb-4 animate-score-pop">
          <div className="stat-label !mt-0">Your Score</div>
          <div className="stat-value text-gradient-gold">{score} pts</div>
        </div>
      )}

      {/* Early bonus indicator */}
      {!isComplete && currentDay <= 2 && (
        <div className="flex items-center justify-center mb-4">
          <span className="pill pill-gold animate-pulse-glow text-xs">
            <Zap size={12} />
            {currentDay === 1 ? '2x' : '1.5x'} early submission bonus!
          </span>
        </div>
      )}

      {/* Action button */}
      <button
        className={`w-full ${
          isComplete
            ? 'btn-emboss'
            : 'btn-emboss btn-emboss-primary'
        }`}
      >
        <Play size={16} />
        {isComplete ? 'Review Case' : 'Investigate'}
      </button>
    </div>
  );
}
