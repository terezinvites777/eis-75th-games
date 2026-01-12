// src/components/predict/PredictionForm.tsx
import { useState } from 'react';
import type { PredictionScenario, DataPoint, EnhancedPrediction } from '../../types/predict';
import { TrendingUp, Calendar, Send, ChevronDown, ChevronUp, Zap, Clock, Activity } from 'lucide-react';

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

// Slider component for consistency
function PredictionSlider({
  label,
  description,
  icon: Icon,
  min,
  max,
  step = 1,
  value,
  onChange,
  format,
  accentColor = 'blue',
}: {
  label: string;
  description?: string;
  icon?: React.ElementType;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
  accentColor?: 'blue' | 'amber' | 'green' | 'purple';
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    amber: 'bg-amber-100 text-amber-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
        {Icon && <Icon size={16} />}
        {label}
      </label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="flex-1 accent-blue-600"
        />
        <div className={`${colors[accentColor]} px-3 py-1 rounded-lg font-semibold min-w-[100px] text-center`}>
          {format(value)}
        </div>
      </div>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
    </div>
  );
}

// Basic prediction form (original)
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
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-600" />
        Make Your Prediction
      </h3>

      <div className="space-y-6">
        <PredictionSlider
          label="When will the outbreak peak?"
          icon={Calendar}
          description={`Currently at Week ${lastHistoricalWeek} with ${lastHistoricalCases.toLocaleString()} cases`}
          min={lastHistoricalWeek + 1}
          max={lastHistoricalWeek + 12}
          value={peakWeek}
          onChange={setPeakWeek}
          format={v => `Week ${v}`}
          accentColor="blue"
        />

        <PredictionSlider
          label="What will the total case count be?"
          min={lastHistoricalCases}
          max={lastHistoricalCases * 30}
          step={Math.floor(lastHistoricalCases / 10)}
          value={totalCases}
          onChange={setTotalCases}
          format={v => v.toLocaleString()}
          accentColor="amber"
        />

        {/* Quick presets */}
        <div>
          <p className="text-sm text-slate-600 mb-2">Quick estimates:</p>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15, 20].map(multiplier => (
              <button
                key={multiplier}
                type="button"
                onClick={() => setTotalCases(lastHistoricalCases * multiplier)}
                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200"
              >
                {multiplier}x current ({(lastHistoricalCases * multiplier).toLocaleString()})
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <Send size={18} />
        Submit Prediction
      </button>
    </form>
  );
}

// Enhanced prediction form with more variables
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
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          Make Your Prediction
        </h3>
        {dayNumber && dayNumber <= 2 && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
            <Zap size={12} />
            {dayNumber === 1 ? '2x' : '1.5x'} early bonus!
          </span>
        )}
      </div>

      <div className="space-y-5">
        {/* Core Predictions */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Core Predictions</div>

          <PredictionSlider
            label="Peak Week"
            description="When will cases be highest?"
            icon={Calendar}
            min={lastWeek.week + 1}
            max={lastWeek.week + 12}
            value={peakWeek}
            onChange={v => setPeakWeek(Math.round(v))}
            format={v => `Week ${v}`}
            accentColor="blue"
          />

          <PredictionSlider
            label="Peak Cases"
            description="Maximum weekly cases at peak"
            icon={TrendingUp}
            min={lastWeek.cases}
            max={lastWeek.cases * 10}
            step={Math.max(1, Math.floor(lastWeek.cases / 20))}
            value={peakCases}
            onChange={v => setPeakCases(Math.round(v))}
            format={v => v.toLocaleString()}
            accentColor="amber"
          />

          <PredictionSlider
            label="Total Cases"
            description="Final cumulative count when outbreak ends"
            min={currentTotal}
            max={currentTotal * 15}
            step={Math.max(1, Math.floor(currentTotal / 10))}
            value={totalCases}
            onChange={v => setTotalCases(Math.round(v))}
            format={v => v.toLocaleString()}
            accentColor="green"
          />

          <PredictionSlider
            label="Outbreak Duration"
            description="When will cases drop below threshold?"
            icon={Clock}
            min={lastWeek.week + 4}
            max={lastWeek.week + 20}
            value={durationWeeks}
            onChange={v => setDurationWeeks(Math.round(v))}
            format={v => `${v - lastWeek.week} more weeks`}
            accentColor="purple"
          />
        </div>

        {/* Quick presets for total cases */}
        <div>
          <p className="text-sm text-slate-600 mb-2">Quick total case estimates:</p>
          <div className="flex flex-wrap gap-2">
            {[3, 5, 8, 12].map(multiplier => (
              <button
                key={multiplier}
                type="button"
                onClick={() => setTotalCases(currentTotal * multiplier)}
                className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200"
              >
                {multiplier}x current ({(currentTotal * multiplier).toLocaleString()})
              </button>
            ))}
          </div>
        </div>

        {/* Advanced predictions toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
        >
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showAdvanced ? 'Hide' : 'Show'} Advanced Predictions (+bonus points)
        </button>

        {showAdvanced && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 space-y-4">
            <div className="text-sm font-semibold text-blue-800">Advanced (Bonus Points)</div>

            <PredictionSlider
              label="Estimated R0"
              description="Average number of secondary infections per case"
              icon={Activity}
              min={0.5}
              max={5}
              step={0.1}
              value={r0Estimate}
              onChange={setR0Estimate}
              format={v => v.toFixed(1)}
              accentColor="purple"
            />

            <div className="text-xs text-blue-700 bg-blue-100 rounded-lg p-2">
              R0 &gt; 1 = outbreak growing | R0 &lt; 1 = outbreak declining | Seasonal flu ~ 1.3 | Measles ~ 15
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        <Send size={18} />
        Submit Prediction
      </button>
    </form>
  );
}
