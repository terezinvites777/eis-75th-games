// src/components/outbreak-network/InvestigationPanel.tsx
// Panel showing investigation tokens and timer

import { Search, Clock } from 'lucide-react';
import type { GamePhase } from '../../types/outbreak-network';

interface InvestigationPanelProps {
  tokensRemaining: number;
  totalTokens: number;
  elapsedSeconds: number;
  phase: GamePhase;
  difficulty: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function InvestigationPanel({
  tokensRemaining,
  totalTokens,
  elapsedSeconds,
  phase,
  difficulty,
}: InvestigationPanelProps) {
  if (phase !== 'playing' && phase !== 'identifying') return null;

  return (
    <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-700">
      {/* Difficulty badge + timer */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {difficulty}
        </span>
        <div className="flex items-center gap-1.5 text-slate-300 text-sm">
          <Clock size={14} />
          <span className="font-mono">{formatTime(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Tokens */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Search size={16} className="text-blue-400" />
          <span className="text-sm font-medium text-slate-200">Investigation Tokens</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: totalTokens }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < tokensRemaining
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-700 text-slate-500'
              }`}
            >
              <Search size={14} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
