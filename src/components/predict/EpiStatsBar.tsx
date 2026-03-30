// src/components/predict/EpiStatsBar.tsx
// Compact epidemiological stats bar - matching Disease Detective aesthetic

import { TrendingUp, TrendingDown, Minus, AlertTriangle, Activity } from 'lucide-react';
import type { DataPoint } from '../../types/predict';
import { getEpiContext } from '../../data/predict-schedule';

interface EpiStatsBarProps {
  data: DataPoint[];
  className?: string;
  variant?: 'light' | 'dark';
}

export function EpiStatsBar({ data, className = '', variant = 'light' }: EpiStatsBarProps) {
  const context = getEpiContext(data);

  const getTrendIcon = () => {
    switch (context.trend) {
      case 'accelerating':
        return <TrendingUp size={14} />;
      case 'decelerating':
        return <TrendingDown size={14} />;
      default:
        return <Minus size={14} />;
    }
  };

  const getTrendColor = () => {
    switch (context.trend) {
      case 'accelerating': return 'text-red-500';
      case 'decelerating': return 'text-green-500';
      default: return 'text-amber-500';
    }
  };

  const getR0Color = () => {
    if (context.estimatedR0 > 2) return 'text-red-500';
    if (context.estimatedR0 > 1) return 'text-amber-500';
    return 'text-green-500';
  };

  const getGrowthColor = () => {
    if (context.weeklyGrowth > 0) return 'text-red-500';
    if (context.weeklyGrowth < 0) return 'text-green-500';
    return 'text-slate-600';
  };

  // Dark variant for use on colored backgrounds
  if (variant === 'dark') {
    return (
      <div className={`panel-themed ${className}`}>
        <div className="section-header mb-3">
          <Activity size={16} className="text-[var(--theme-primary)]" />
          <span className="section-title">Epidemiological Context</span>
          <div className="section-header-line" />
        </div>

        <div className="grid grid-cols-4 gap-3">
          {/* Weekly Growth */}
          <div className="stat-card">
            <div className={`stat-value ${getGrowthColor()}`}>
              {context.weeklyGrowth > 0 ? '+' : ''}{context.weeklyGrowth}%
            </div>
            <div className="stat-label">Growth</div>
          </div>

          {/* Estimated R0 */}
          <div className="stat-card">
            <div className={`stat-value ${getR0Color()}`}>
              {context.estimatedR0.toFixed(1)}
            </div>
            <div className="stat-label">Est. R₀</div>
          </div>

          {/* Trend */}
          <div className="stat-card">
            <div className={`stat-value text-lg flex items-center justify-center gap-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="capitalize">{context.trend}</span>
            </div>
            <div className="stat-label">Trend</div>
          </div>

          {/* Doubling Time */}
          <div className="stat-card">
            <div className="stat-value text-slate-700">
              {context.doublingTime ? `${context.doublingTime.toFixed(1)}w` : '—'}
            </div>
            <div className="stat-label">Doubling</div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-3 flex justify-end">
          <div className={`pill ${context.estimatedR0 > 1 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
            <AlertTriangle size={12} />
            <span className="text-xs font-medium">
              {context.estimatedR0 > 1 ? 'Outbreak Growing' : 'Outbreak Declining'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Light variant (inline bar) - uses themed styling
  return (
    <div className={`panel ${className}`}>
      <div className="flex items-center divide-x divide-slate-200">
        {/* Weekly Growth */}
        <div className="flex-1 px-4 py-2 text-center">
          <div className="stat-label mb-0.5">Growth</div>
          <div className={`text-lg font-bold ${getGrowthColor()}`}>
            {context.weeklyGrowth > 0 ? '+' : ''}{context.weeklyGrowth}%
          </div>
        </div>

        {/* Estimated R0 */}
        <div className="flex-1 px-4 py-2 text-center">
          <div className="stat-label mb-0.5">R₀</div>
          <div className={`text-lg font-bold ${getR0Color()}`}>
            {context.estimatedR0.toFixed(1)}
          </div>
        </div>

        {/* Trend */}
        <div className="flex-1 px-4 py-2 text-center">
          <div className="stat-label mb-0.5">Trend</div>
          <div className={`flex items-center justify-center gap-1 font-semibold ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm capitalize">{context.trend}</span>
          </div>
        </div>

        {/* Doubling Time */}
        <div className="flex-1 px-4 py-2 text-center">
          <div className="stat-label mb-0.5">Doubling</div>
          <div className="text-lg font-bold text-slate-700">
            {context.doublingTime ? `${context.doublingTime.toFixed(1)}w` : '—'}
          </div>
        </div>

        {/* Status indicator */}
        <div className="px-4 py-2">
          <div className={`pill text-xs ${
            context.estimatedR0 > 1
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-green-50 text-green-700 border-green-200'
          }`}>
            <AlertTriangle size={10} />
            {context.estimatedR0 > 1 ? 'Growing' : 'Declining'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EpiStatsBar;
