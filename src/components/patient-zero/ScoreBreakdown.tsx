// src/components/patient-zero/ScoreBreakdown.tsx
// Visual score breakdown showing what matched

import { Check, X, Minus, Trophy, Zap } from 'lucide-react';
import type { ScoreBreakdown } from '../../data/patient-zero-data';

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown;
  daySubmitted: number;
}

function FieldRow({
  label,
  playerAnswer,
  correctAnswer,
  matched,
  partial,
  points,
  maxPoints
}: {
  label: string;
  playerAnswer: string | number;
  correctAnswer: string | number;
  matched: boolean;
  partial?: boolean;
  points: number;
  maxPoints: number;
}) {
  const getIcon = () => {
    if (matched) return <Check className="text-green-500" size={18} />;
    if (partial) return <Minus className="text-amber-500" size={18} />;
    return <X className="text-red-400" size={18} />;
  };

  const getBgColor = () => {
    if (matched) return 'bg-green-50 border-green-200';
    if (partial) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className={`rounded-lg border p-3 ${getBgColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="font-semibold text-slate-700">{label}</span>
        </div>
        <div className={`font-bold ${matched ? 'text-green-600' : partial ? 'text-amber-600' : 'text-slate-400'}`}>
          +{points} / {maxPoints}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-slate-500 text-xs uppercase tracking-wide mb-0.5">Your Answer</div>
          <div className={`font-medium ${matched || partial ? 'text-green-700' : 'text-red-700'}`}>
            {playerAnswer || '—'}
          </div>
        </div>
        <div>
          <div className="text-slate-500 text-xs uppercase tracking-wide mb-0.5">Correct</div>
          <div className="font-medium text-slate-800">{correctAnswer}</div>
        </div>
      </div>
    </div>
  );
}

export function ScoreBreakdownDisplay({ breakdown, daySubmitted }: ScoreBreakdownProps) {
  const { fields } = breakdown;
  const matchedCount = [
    fields.outbreak.matched,
    fields.year.matched || fields.year.partial,
    fields.location.matched,
    fields.pathogen.matched,
    fields.source.matched,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Total Score Header */}
      <div className="text-center py-4 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl border border-amber-200">
        <Trophy className="mx-auto text-amber-500 mb-2" size={40} />
        <div className="text-3xl font-bold text-amber-600">{breakdown.totalScore} points</div>
        <div className="text-sm text-amber-700 mt-1">
          {matchedCount}/5 fields correct
        </div>
      </div>

      {/* Day Multiplier Badge */}
      {breakdown.dayMultiplier > 1 && (
        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-purple-100 rounded-lg border border-purple-200">
          <Zap className="text-purple-500" size={18} />
          <span className="font-semibold text-purple-700">
            Day {daySubmitted} Bonus: {breakdown.dayMultiplier}x multiplier!
          </span>
          <span className="text-purple-600 text-sm">
            ({breakdown.baseScore} × {breakdown.dayMultiplier} = {breakdown.totalScore})
          </span>
        </div>
      )}

      {/* Field Breakdowns */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">Score Breakdown</h4>

        <FieldRow
          label="Outbreak Name"
          playerAnswer={fields.outbreak.playerAnswer}
          correctAnswer={fields.outbreak.correctAnswer}
          matched={fields.outbreak.matched}
          points={fields.outbreak.points}
          maxPoints={250}
        />

        <FieldRow
          label="Year"
          playerAnswer={fields.year.playerAnswer}
          correctAnswer={fields.year.correctAnswer}
          matched={fields.year.matched}
          partial={fields.year.partial}
          points={fields.year.points}
          maxPoints={250}
        />

        <FieldRow
          label="Location"
          playerAnswer={fields.location.playerAnswer}
          correctAnswer={fields.location.correctAnswer}
          matched={fields.location.matched}
          points={fields.location.points}
          maxPoints={250}
        />

        <FieldRow
          label="Pathogen"
          playerAnswer={fields.pathogen.playerAnswer}
          correctAnswer={fields.pathogen.correctAnswer}
          matched={fields.pathogen.matched}
          points={fields.pathogen.points}
          maxPoints={250}
        />

        {fields.source.attempted && (
          <FieldRow
            label="Source (Bonus)"
            playerAnswer={fields.source.playerAnswer}
            correctAnswer={fields.source.correctAnswer}
            matched={fields.source.matched}
            points={fields.source.points}
            maxPoints={100}
          />
        )}
      </div>

      {/* Scoring Legend */}
      <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-200">
        <div className="font-medium text-slate-600 mb-1">Scoring:</div>
        <div className="grid grid-cols-2 gap-1">
          <span>• Exact match: 250 pts</span>
          <span>• Year within 2: 125 pts</span>
          <span>• Source bonus: 100 pts</span>
          <span>• Day 1: 2x, Day 2: 1.5x</span>
        </div>
      </div>
    </div>
  );
}
