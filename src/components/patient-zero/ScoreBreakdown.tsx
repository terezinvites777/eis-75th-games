// src/components/patient-zero/ScoreBreakdown.tsx
// Visual score breakdown with brand styling

import { Check, X, Minus, Trophy, Zap, Target } from 'lucide-react';
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
    <div className={`stat-card !text-left !p-3 ${getBgColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="font-semibold text-slate-700 text-sm">{label}</span>
        </div>
        <span className={`pill text-xs ${matched ? 'pill bg-green-100 text-green-700 border-green-200' : partial ? 'pill-gold' : 'bg-red-100 text-red-700 border-red-200'}`}>
          +{points} / {maxPoints}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="stat-label !mt-0 !text-left">Your Answer</div>
          <div className={`font-medium ${matched || partial ? 'text-green-700' : 'text-red-700'}`}>
            {playerAnswer || '—'}
          </div>
        </div>
        <div>
          <div className="stat-label !mt-0 !text-left">Correct</div>
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
      {/* Total Score Header - uses stat-card */}
      <div className="stat-card bg-gradient-to-r from-amber-50 to-amber-100 !border-amber-200 animate-score-pop">
        <div className="p-2 bg-amber-100 rounded-full w-fit mx-auto mb-2">
          <Trophy className="text-amber-500" size={32} />
        </div>
        <div className="stat-value text-gradient-gold">{breakdown.totalScore} points</div>
        <div className="stat-label">
          {matchedCount}/5 fields correct
        </div>
      </div>

      {/* Day Multiplier Badge */}
      {breakdown.dayMultiplier > 1 && (
        <div className="panel-themed p-3 flex items-center justify-center gap-2 animate-slide-up">
          <Zap className="text-purple-500" size={18} />
          <span className="font-semibold text-purple-700 text-sm">
            Day {daySubmitted} Bonus: {breakdown.dayMultiplier}x multiplier!
          </span>
          <span className="pill text-xs">
            ({breakdown.baseScore} × {breakdown.dayMultiplier} = {breakdown.totalScore})
          </span>
        </div>
      )}

      {/* Field Breakdowns */}
      <div className="space-y-3">
        <div className="section-header">
          <Target size={16} className="text-[var(--theme-primary)]" />
          <span className="section-title">Score Breakdown</span>
          <div className="section-header-line" />
        </div>

        <div className="space-y-2 stagger-children">
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
      </div>

      {/* Scoring Legend */}
      <div className="panel-themed p-3">
        <div className="stat-label !mt-0 !text-left mb-2">Scoring System</div>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <Check size={12} className="text-green-500" />
            Exact match: 250 pts
          </span>
          <span className="flex items-center gap-1">
            <Minus size={12} className="text-amber-500" />
            Year within 2: 125 pts
          </span>
          <span className="flex items-center gap-1">
            <Zap size={12} className="text-purple-500" />
            Source bonus: 100 pts
          </span>
          <span className="flex items-center gap-1">
            <Trophy size={12} className="text-amber-500" />
            Day 1: 2x, Day 2: 1.5x
          </span>
        </div>
      </div>
    </div>
  );
}
