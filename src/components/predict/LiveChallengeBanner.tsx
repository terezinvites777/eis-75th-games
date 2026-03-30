// src/components/predict/LiveChallengeBanner.tsx
// Data reveal banner for single-session Predict the Outbreak

import { ChevronRight, Zap, BarChart3, Eye } from 'lucide-react';
import { DATA_REVEAL_STEPS, REVEAL_MULTIPLIERS } from '../../data/predict-schedule';

interface LiveChallengeBannerProps {
  revealStep: number;
  weeksAvailable: number;
  onClick?: () => void;
  onRevealMore?: () => void;
  isCompact?: boolean;
}

export function LiveChallengeBanner({
  revealStep,
  weeksAvailable,
  onClick,
  onRevealMore,
  isCompact = false,
}: LiveChallengeBannerProps) {
  const maxSteps = DATA_REVEAL_STEPS.length;
  const currentMultiplier = REVEAL_MULTIPLIERS[Math.min(revealStep, maxSteps - 1)];
  const canRevealMore = revealStep < maxSteps - 1;
  const nextMultiplier = canRevealMore ? REVEAL_MULTIPLIERS[revealStep + 1] : null;

  if (isCompact) {
    // Compact inline version for detail view
    return (
      <div className="panel-themed relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500 to-amber-600" />

        <div className="pl-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-[var(--theme-primary)]" />
                <span className="text-sm font-semibold text-slate-700">
                  {weeksAvailable} weeks of data
                </span>
              </div>

              <span className="pill pill-gold">
                <Zap size={12} />
                {currentMultiplier}x multiplier
              </span>
            </div>

            {canRevealMore && onRevealMore && (
              <button
                onClick={(e) => { e.stopPropagation(); onRevealMore(); }}
                className="btn-emboss btn-emboss-sm"
              >
                <Eye size={14} />
                Reveal More Data
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((revealStep + 1) / maxSteps) * 100}%` }}
              />
            </div>
          </div>

          {canRevealMore && nextMultiplier && (
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-slate-500">Reveal more data to see further — but your multiplier drops to {nextMultiplier}x</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full banner for main page
  return (
    <div
      onClick={onClick}
      className="panel relative overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]" />

      <div className="absolute top-1 left-0 w-1.5 h-[calc(100%-4px)] bg-gradient-to-b from-amber-500 to-amber-600 rounded-b" />

      <div className="pl-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="p-3 bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-secondary)] rounded-xl shadow-lg">
            <BarChart3 size={28} className="text-white" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Mystery Outbreak 2026</h3>
            <p className="text-sm text-slate-600 mb-4">
              A novel pathogen is emerging. Study the epi curve and predict how this outbreak will unfold.
            </p>

            {/* Data progress */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${((revealStep + 1) / maxSteps) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-slate-500 font-medium">{weeksAvailable} weeks available</span>
            </div>

            <div className="flex items-center gap-4">
              <button className="btn-emboss btn-emboss-primary">
                Enter Challenge
                <ChevronRight size={16} />
              </button>
              {currentMultiplier > 1 && (
                <span className="pill pill-gold animate-pulse-glow">
                  <Zap size={14} />
                  {currentMultiplier}x bonus!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveChallengeBanner;
