// src/components/predict/PredictionForm.tsx
// Prediction forms matching Disease Detective aesthetic

import { useState } from 'react';
import type { PredictionScenario, DataPoint, EnhancedPrediction } from '../../types/predict';
import { TrendingUp, Calendar, Send, ChevronDown, ChevronUp, Zap, Clock, Activity, BarChart3 } from 'lucide-react';

interface PredictionFormProps {
  scenario: PredictionScenario;
  onSubmit: (prediction: { peak_week: number; total_cases: number }) => void;
}

// Enhanced prediction form props
interface EnhancedPredictionFormProps {
  visibleData: DataPoint[];
  totalWeeksExpected?: number;
  onSubmit: (prediction: EnhancedPrediction) => void;
  dayNumber?: number;
}

// Basic prediction form (original) - with brand styling
export function PredictionForm({ scenario, onSubmit }: PredictionFormProps) {
  const lastHistoricalWeek = scenario.historical_data[scenario.historical_data.length - 1].week;
  const lastHistoricalCases = scenario.historical_data[scenario.historical_data.length - 1].cases;

  const [peakWeek, setPeakWeek] = useState(lastHistoricalWeek + 4);
  const [totalCases, setTotalCases] = useState(lastHistoricalCases * 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ peak_week: peakWeek, total_cases: totalCases });
  };

  return (
    <form onSubmit={handleSubmit} className="panel">
      {/* Header */}
      <div className="section-header mb-4">
        <TrendingUp size={18} className="text-[var(--theme-primary)]" />
        <span className="section-title">Make Your Prediction</span>
        <div className="section-header-line" />
      </div>

      <div className="space-y-6">
        {/* Peak Week */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Calendar size={16} className="text-slate-400" />
              When will the outbreak peak?
            </label>
            <span className="pill pill-themed">Week {peakWeek}</span>
          </div>
          <p className="text-xs text-slate-500">
            Currently at Week {lastHistoricalWeek} with {lastHistoricalCases.toLocaleString()} cases
          </p>
          <input
            type="range"
            min={lastHistoricalWeek + 1}
            max={lastHistoricalWeek + 12}
            value={peakWeek}
            onChange={e => setPeakWeek(parseInt(e.target.value))}
            className="w-full accent-[var(--theme-primary)]"
          />
        </div>

        {/* Total Cases */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <BarChart3 size={16} className="text-slate-400" />
              What will the total case count be?
            </label>
            <span className="pill pill-gold">{totalCases.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={lastHistoricalCases}
            max={lastHistoricalCases * 50}
            step={Math.floor(lastHistoricalCases / 10)}
            value={totalCases}
            onChange={e => setTotalCases(parseInt(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Quick presets */}
        <div className="bg-[var(--theme-surface)] rounded-lg p-4">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Quick estimates:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {[5, 10, 20, 35].map(multiplier => (
              <button
                key={multiplier}
                type="button"
                onClick={() => setTotalCases(lastHistoricalCases * multiplier)}
                className={`btn-emboss btn-emboss-sm ${
                  totalCases === lastHistoricalCases * multiplier
                    ? 'btn-emboss-primary'
                    : ''
                }`}
              >
                {multiplier}x ({(lastHistoricalCases * multiplier).toLocaleString()})
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="btn-emboss btn-emboss-primary btn-emboss-lg w-full mt-6"
      >
        <Send size={18} />
        Submit Prediction
      </button>
    </form>
  );
}

// Visual Gauge Slider - themed version
function GaugeSlider({
  label,
  icon: Icon,
  min,
  max,
  step = 1,
  value,
  onChange,
  format,
  color,
}: {
  label: string;
  icon: React.ElementType;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
  color: 'blue' | 'amber' | 'green' | 'purple';
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  const colors = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      badge: 'bg-blue-50 border-blue-200',
      fill: 'bg-blue-500'
    },
    amber: {
      bg: 'from-amber-500 to-orange-500',
      text: 'text-amber-600',
      badge: 'bg-amber-50 border-amber-200',
      fill: 'bg-amber-500'
    },
    green: {
      bg: 'from-green-500 to-emerald-500',
      text: 'text-green-600',
      badge: 'bg-green-50 border-green-200',
      fill: 'bg-green-500'
    },
    purple: {
      bg: 'from-purple-500 to-indigo-500',
      text: 'text-purple-600',
      badge: 'bg-purple-50 border-purple-200',
      fill: 'bg-purple-500'
    },
  };

  return (
    <div className="relative">
      {/* Label row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${colors[color].badge} border`}>
            <Icon size={14} className={colors[color].text} />
          </div>
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <div className={`px-3 py-1 rounded-lg ${colors[color].badge} border`}>
          <span className={`text-lg font-bold ${colors[color].text}`}>{format(value)}</span>
        </div>
      </div>

      {/* Slider track */}
      <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
        {/* Filled portion with gradient */}
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors[color].bg} rounded-full transition-all duration-150`}
          style={{ width: `${percentage}%` }}
        />
        {/* Dot at current position */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md border-2 ${colors[color].fill.replace('bg-', 'border-')} transition-all duration-150`}
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>

      {/* Hidden range input for interaction */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        style={{ marginTop: '24px' }}
      />

      {/* Min/Max labels */}
      <div className="flex justify-between mt-1 text-[10px] text-slate-400">
        <span>{typeof min === 'number' && min >= 1000 ? `${(min / 1000).toFixed(0)}k` : min}</span>
        <span>{typeof max === 'number' && max >= 1000 ? `${(max / 1000).toFixed(0)}k` : max}</span>
      </div>
    </div>
  );
}

// Enhanced prediction form with visual gauges - brand styling
export function EnhancedPredictionForm({ visibleData, onSubmit, dayNumber }: EnhancedPredictionFormProps) {
  const lastWeek = visibleData[visibleData.length - 1];
  const currentTotal = visibleData.reduce((sum, d) => sum + d.cases, 0);

  const [peakWeek, setPeakWeek] = useState(lastWeek.week + 3);
  const [peakCases, setPeakCases] = useState(Math.round(lastWeek.cases * 2.5));
  const [totalCases, setTotalCases] = useState(currentTotal * 5);
  const [durationWeeks, setDurationWeeks] = useState(lastWeek.week + 8);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [r0Estimate, setR0Estimate] = useState(2.0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      peak_week: peakWeek,
      peak_cases: peakCases,
      total_cases: totalCases,
      duration_weeks: durationWeeks,
      r0_estimate: showAdvanced ? r0Estimate : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="panel overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-1">
        <div className="section-header mb-0">
          <TrendingUp size={18} className="text-[var(--theme-primary)]" />
          <span className="section-title">Your Predictions</span>
        </div>
        {dayNumber && dayNumber <= 2 && (
          <span className="pill pill-gold animate-pulse-glow">
            <Zap size={14} />
            {dayNumber === 1 ? '2x' : '1.5x'} bonus!
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Primary Predictions - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card !p-4">
            <GaugeSlider
              label="Peak Week"
              icon={Calendar}
              min={lastWeek.week + 1}
              max={lastWeek.week + 12}
              value={peakWeek}
              onChange={v => setPeakWeek(Math.round(v))}
              format={v => `W${v}`}
              color="blue"
            />
          </div>

          <div className="stat-card !p-4">
            <GaugeSlider
              label="Peak Cases"
              icon={TrendingUp}
              min={lastWeek.cases}
              max={lastWeek.cases * 10}
              step={Math.max(1, Math.floor(lastWeek.cases / 20))}
              value={peakCases}
              onChange={v => setPeakCases(Math.round(v))}
              format={v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString()}
              color="amber"
            />
          </div>

          <div className="stat-card !p-4">
            <GaugeSlider
              label="Total Cases"
              icon={Activity}
              min={currentTotal}
              max={currentTotal * 15}
              step={Math.max(1, Math.floor(currentTotal / 10))}
              value={totalCases}
              onChange={v => setTotalCases(Math.round(v))}
              format={v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString()}
              color="green"
            />
          </div>

          <div className="stat-card !p-4">
            <GaugeSlider
              label="Duration"
              icon={Clock}
              min={lastWeek.week + 4}
              max={lastWeek.week + 20}
              value={durationWeeks}
              onChange={v => setDurationWeeks(Math.round(v))}
              format={v => `+${v - lastWeek.week}w`}
              color="purple"
            />
          </div>
        </div>

        {/* Quick presets */}
        <div className="bg-[var(--theme-surface)] rounded-lg p-4">
          <span className="text-xs text-slate-500 uppercase tracking-wide">Quick total estimates:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {[3, 5, 8, 12].map(multiplier => (
              <button
                key={multiplier}
                type="button"
                onClick={() => setTotalCases(currentTotal * multiplier)}
                className={`btn-emboss btn-emboss-sm ${
                  totalCases === currentTotal * multiplier
                    ? 'btn-emboss-primary'
                    : ''
                }`}
              >
                {multiplier}x ({(currentTotal * multiplier / 1000).toFixed(1)}k)
              </button>
            ))}
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-center gap-2 text-[var(--theme-primary)] text-sm font-medium hover:opacity-80 transition-opacity py-2"
        >
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showAdvanced ? 'Hide' : 'Show'} R₀ Estimate (+bonus)
        </button>

        {showAdvanced && (
          <div className="panel-themed animate-slide-up">
            <GaugeSlider
              label="Estimated R₀"
              icon={Activity}
              min={0.5}
              max={5}
              step={0.1}
              value={r0Estimate}
              onChange={setR0Estimate}
              format={v => v.toFixed(1)}
              color="purple"
            />
            <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
              <span className="pill text-xs">R₀ &lt; 1 = declining</span>
              <span className="pill text-xs">R₀ &gt; 1 = growing</span>
            </div>
          </div>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="btn-emboss btn-emboss-primary btn-emboss-lg w-full mt-6"
      >
        <Send size={18} />
        Submit Prediction
      </button>
    </form>
  );
}
