// src/components/predict/LiveChallengeBanner.tsx
// Premium styled live challenge banner matching Disease Detective aesthetic

import { Calendar, Clock, Radio, Zap, ChevronRight } from 'lucide-react';
import { CountdownTimer } from '../patient-zero/CountdownTimer';

interface LiveChallengeBannerProps {
  day: number;
  totalDays: number;
  weeksAvailable: number;
  nextRelease?: Date | null;
  onSkipDay?: () => void;
  onClick?: () => void;
  isCompact?: boolean;
}

export function LiveChallengeBanner({
  day,
  totalDays,
  weeksAvailable,
  nextRelease,
  onSkipDay,
  onClick,
  isCompact = false,
}: LiveChallengeBannerProps) {
  if (isCompact) {
    // Compact inline version for detail view
    return (
      <div className="panel-themed relative overflow-hidden">
        {/* Animated pulse accent */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-500 to-red-600 animate-pulse" />

        <div className="pl-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Live indicator */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  Live
                </span>
              </div>

              <div className="h-6 w-px bg-slate-200" />

              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[var(--theme-primary)]" />
                <span className="text-sm font-semibold text-slate-700">
                  Day {day} of {totalDays}
                </span>
              </div>

              <span className="pill text-xs">
                {weeksAvailable} weeks available
              </span>
            </div>

            {onSkipDay && day < totalDays && (
              <button
                onClick={(e) => { e.stopPropagation(); onSkipDay(); }}
                className="btn-emboss btn-emboss-sm"
              >
                Skip to Day {day + 1}
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(day / totalDays) * 100}%` }}
              />
            </div>
          </div>

          {/* Next release countdown */}
          {nextRelease && day < totalDays && (
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-slate-500">Next data release:</span>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[var(--theme-primary)]" />
                <CountdownTimer
                  targetDate={nextRelease}
                  label="New Data"
                  variant="compact"
                />
              </div>
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
      {/* Top accent bar with theme gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]" />

      {/* Animated side accent */}
      <div className="absolute top-1 left-0 w-1.5 h-[calc(100%-4px)] bg-gradient-to-b from-red-500 to-red-600 animate-pulse rounded-b" />

      <div className="pl-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="p-3 bg-gradient-to-br from-[var(--theme-primary)] to-[var(--theme-secondary)] rounded-xl shadow-lg">
            <Radio size={28} className="text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {/* Live indicator */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                Live Conference Challenge
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-1">Mystery Outbreak 2026</h3>
            <p className="text-sm text-slate-600 mb-4">
              A novel pathogen is emerging. New surveillance data released daily during the conference.
            </p>

            {/* Progress indicator */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(day / totalDays) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-slate-500 font-medium">Day {day}/{totalDays}</span>
            </div>

            <div className="flex items-center gap-4">
              <button className="btn-emboss btn-emboss-primary">
                Enter Challenge
                <ChevronRight size={16} />
              </button>
              {day <= 2 && (
                <span className="pill pill-gold animate-pulse-glow">
                  <Zap size={14} />
                  {day === 1 ? '2x' : '1.5x'} early bonus!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Countdown footer */}
        {nextRelease && day < totalDays && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-500">Next data release:</span>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[var(--theme-primary)]" />
              <CountdownTimer
                targetDate={nextRelease}
                label="New Data"
                variant="compact"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveChallengeBanner;
