// src/components/predict/EpiContext.tsx
// Epidemiological context panel showing R0, growth rates, and transmission info

import { TrendingUp, TrendingDown, Minus, Activity, Clock, AlertTriangle } from 'lucide-react';
import type { DataPoint } from '../../types/predict';
import { getEpiContext } from '../../data/predict-schedule';

interface EpiContextProps {
  data: DataPoint[];
  pathogen?: string;
  transmissionRoute?: string;
  incubationPeriod?: string;
}

export function EpiContext({ data, pathogen, transmissionRoute, incubationPeriod }: EpiContextProps) {
  const context = getEpiContext(data);

  const getTrendIcon = () => {
    switch (context.trend) {
      case 'accelerating':
        return <TrendingUp className="text-red-400" size={18} />;
      case 'decelerating':
        return <TrendingDown className="text-green-400" size={18} />;
      default:
        return <Minus className="text-amber-400" size={18} />;
    }
  };

  const getTrendLabel = () => {
    switch (context.trend) {
      case 'accelerating':
        return { text: 'Accelerating', color: 'text-red-400' };
      case 'decelerating':
        return { text: 'Slowing', color: 'text-green-400' };
      default:
        return { text: 'Steady', color: 'text-amber-400' };
    }
  };

  const trend = getTrendLabel();

  // R0 reference values
  const r0References = [
    { name: 'Measles', r0: 15, color: 'bg-red-500' },
    { name: 'COVID-19', r0: 2.5, color: 'bg-orange-500' },
    { name: 'Flu', r0: 1.3, color: 'bg-yellow-500' },
    { name: 'Ebola', r0: 1.8, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="bg-slate-700 px-4 py-2 flex items-center gap-2">
        <Activity size={16} className="text-blue-400" />
        <span className="font-semibold text-white text-sm">Epidemiological Context</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Weekly Growth */}
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Weekly Growth</div>
            <div className={`text-2xl font-bold ${context.weeklyGrowth > 0 ? 'text-red-400' : context.weeklyGrowth < 0 ? 'text-green-400' : 'text-slate-300'}`}>
              {context.weeklyGrowth > 0 ? '+' : ''}{context.weeklyGrowth}%
            </div>
          </div>

          {/* Estimated R0 */}
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Est. R₀</div>
            <div className={`text-2xl font-bold ${context.estimatedR0 > 1 ? 'text-amber-400' : 'text-green-400'}`}>
              {context.estimatedR0.toFixed(1)}
            </div>
          </div>

          {/* Trend */}
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Trend</div>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className={`font-semibold ${trend.color}`}>{trend.text}</span>
            </div>
          </div>

          {/* Doubling Time */}
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Doubling Time</div>
            <div className="text-lg font-bold text-slate-300 flex items-center gap-1">
              {context.doublingTime ? (
                <>
                  <Clock size={14} className="text-slate-400" />
                  {context.doublingTime.toFixed(1)} weeks
                </>
              ) : (
                <span className="text-slate-500">N/A</span>
              )}
            </div>
          </div>
        </div>

        {/* R0 Interpretation */}
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className={context.estimatedR0 > 1 ? 'text-amber-400' : 'text-green-400'} />
            <div className="text-sm text-slate-300">
              <strong>R₀ = {context.estimatedR0.toFixed(1)}</strong> means each case infects approximately {context.estimatedR0.toFixed(1)} others.{' '}
              {context.estimatedR0 > 1 ? (
                <span className="text-amber-400">Outbreak is growing (R₀ &gt; 1)</span>
              ) : context.estimatedR0 < 1 ? (
                <span className="text-green-400">Outbreak is declining (R₀ &lt; 1)</span>
              ) : (
                <span className="text-slate-400">Outbreak is stable (R₀ = 1)</span>
              )}
            </div>
          </div>
        </div>

        {/* Pathogen Info (if provided) */}
        {(pathogen || transmissionRoute || incubationPeriod) && (
          <div className="border-t border-slate-700 pt-3 space-y-2">
            {pathogen && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Pathogen:</span>
                <span className="text-white font-medium">{pathogen}</span>
              </div>
            )}
            {transmissionRoute && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Transmission:</span>
                <span className="text-white font-medium">{transmissionRoute}</span>
              </div>
            )}
            {incubationPeriod && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Incubation:</span>
                <span className="text-white font-medium">{incubationPeriod}</span>
              </div>
            )}
          </div>
        )}

        {/* R0 Reference Scale */}
        <div className="border-t border-slate-700 pt-3">
          <div className="text-xs text-slate-500 mb-2">Reference R₀ Values:</div>
          <div className="flex flex-wrap gap-2">
            {r0References.map(ref => (
              <span
                key={ref.name}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 rounded text-xs"
              >
                <span className={`w-2 h-2 rounded-full ${ref.color}`} />
                <span className="text-slate-300">{ref.name}: {ref.r0}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EpiContext;
