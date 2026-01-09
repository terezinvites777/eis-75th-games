// src/components/connect/ChallengeCard.tsx
import type { ConnectChallenge } from '../../types/connect';
import { Check } from 'lucide-react';

interface ChallengeCardProps {
  challenge: ConnectChallenge;
  progress?: number;
  target?: number;
  isComplete?: boolean;
}

export function ChallengeCard({ challenge, progress = 0, target = 1, isComplete }: ChallengeCardProps) {
  const progressPercent = Math.min((progress / target) * 100, 100);

  return (
    <div
      className={`
        rounded-xl p-4 border-2 transition-all
        ${isComplete
          ? 'bg-green-50 border-green-300'
          : 'bg-white border-slate-200'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center text-2xl
          ${isComplete ? 'bg-green-200' : 'bg-slate-100'}
        `}>
          {challenge.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-800">{challenge.title}</h4>
            {isComplete && <Check size={16} className="text-green-600" />}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{challenge.description}</p>

          {/* Progress bar for cumulative challenges */}
          {challenge.criteria_type === 'cumulative' && !isComplete && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Progress</span>
                <span>{progress} / {target}</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Points */}
        <div className={`
          px-3 py-1 rounded-full text-sm font-bold
          ${isComplete
            ? 'bg-green-200 text-green-700'
            : 'bg-amber-100 text-amber-700'
          }
        `}>
          {isComplete ? '+' : ''}{challenge.points}
        </div>
      </div>
    </div>
  );
}
