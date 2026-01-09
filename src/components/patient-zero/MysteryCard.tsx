// src/components/patient-zero/MysteryCard.tsx
import type { MysteryDefinition } from '../../types/patient-zero';
import { Calendar, MapPin, Play, CheckCircle } from 'lucide-react';

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
      className={`
        bg-white rounded-xl shadow-lg border overflow-hidden transition-all hover:shadow-xl cursor-pointer
        ${isComplete ? 'border-green-300' : 'border-slate-200'}
      `}
      onClick={() => onStart(mystery.id)}
    >
      {/* Header */}
      <div className={`p-4 ${isComplete ? 'bg-green-600' : 'bg-slate-800'} text-white`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">{mystery.title}</h3>
            <div className="flex items-center gap-3 mt-2 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {mystery.solution.year}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {mystery.solution.location.split(',')[0]}
              </span>
            </div>
          </div>
          {isComplete && (
            <CheckCircle size={24} className="text-green-200" />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-600">Clues Revealed</span>
            <span className="font-medium text-slate-800">{revealedClues} / {totalClues}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${(revealedClues / totalClues) * 100}%` }}
            />
          </div>
        </div>

        {/* Score if complete */}
        {isComplete && score !== undefined && (
          <div className="bg-amber-50 rounded-lg p-3 mb-4 text-center">
            <div className="text-sm text-amber-700">Your Score</div>
            <div className="text-2xl font-bold text-amber-600">{score} pts</div>
          </div>
        )}

        {/* Action button */}
        <button
          className={`
            w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
            ${isComplete
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          <Play size={18} />
          {isComplete ? 'Review Mystery' : 'Investigate'}
        </button>
      </div>
    </div>
  );
}
