// src/components/predict/PredictionForm.tsx
import { useState } from 'react';
import type { PredictionScenario } from '../../types/predict';
import { TrendingUp, Calendar, Send } from 'lucide-react';

interface PredictionFormProps {
  scenario: PredictionScenario;
  onSubmit: (prediction: { peak_week: number; total_cases: number }) => void;
}

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
        {/* Peak Week */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Calendar size={16} />
            When will the outbreak peak?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={lastHistoricalWeek + 1}
              max={lastHistoricalWeek + 12}
              value={peakWeek}
              onChange={e => setPeakWeek(parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold">
              Week {peakWeek}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Currently at Week {lastHistoricalWeek} with {lastHistoricalCases.toLocaleString()} cases
          </p>
        </div>

        {/* Total Cases */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            What will the total case count be?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={lastHistoricalCases}
              max={lastHistoricalCases * 30}
              step={Math.floor(lastHistoricalCases / 10)}
              value={totalCases}
              onChange={e => setTotalCases(parseInt(e.target.value))}
              className="flex-1"
            />
            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg font-semibold min-w-[100px] text-center">
              {totalCases.toLocaleString()}
            </div>
          </div>
        </div>

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
