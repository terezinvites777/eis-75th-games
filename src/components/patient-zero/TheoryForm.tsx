// src/components/patient-zero/TheoryForm.tsx
import { useState } from 'react';
import type { PlayerTheory } from '../../types/patient-zero';
import { Send, AlertCircle, Lightbulb } from 'lucide-react';
import { outbreakSuggestions, pathogenSuggestions, sourceSuggestions } from '../../data/patient-zero-data';

interface TheoryFormProps {
  existingTheory?: PlayerTheory['theory'];
  onSubmit: (theory: PlayerTheory['theory']) => void;
}

export function TheoryForm({ existingTheory, onSubmit }: TheoryFormProps) {
  const [theory, setTheory] = useState({
    outbreak_name: existingTheory?.outbreak_name || '',
    year: existingTheory?.year || 1980,
    location: existingTheory?.location || '',
    pathogen: existingTheory?.pathogen || '',
    source: existingTheory?.source || '',
    confidence: existingTheory?.confidence || 'guess' as const,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: string[] = [];
    if (!theory.outbreak_name.trim()) newErrors.push('Outbreak name is required');
    if (!theory.location.trim()) newErrors.push('Location is required');
    if (!theory.pathogen.trim()) newErrors.push('Pathogen is required');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(theory);
  };

  const confidenceOptions: { value: typeof theory.confidence; label: string; description: string }[] = [
    { value: 'guess', label: 'Taking a guess', description: 'Low confidence, early theory' },
    { value: 'likely', label: 'Likely correct', description: 'Good evidence, some uncertainty' },
    { value: 'certain', label: 'Certain', description: 'All clues point to this' },
  ];

  // US states and major cities for location suggestions
  const locationSuggestions = [
    "Philadelphia, Pennsylvania", "New York, New York", "Four Corners region",
    "Los Angeles, California", "Chicago, Illinois", "Atlanta, Georgia",
    "Nationwide (USA)", "Multiple states", "Southwest United States",
    "New Mexico", "Arizona", "Colorado", "Utah"
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">
          {existingTheory ? 'Update Your Theory' : 'Submit Your Theory'}
        </h3>
        <button
          type="button"
          onClick={() => setShowHints(!showHints)}
          className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full transition-colors ${
            showHints ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Lightbulb size={14} />
          {showHints ? 'Hide hints' : 'Show hints'}
        </button>
      </div>

      {showHints && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
          <div className="font-medium mb-1">Hints enabled!</div>
          <p className="text-amber-700">Start typing to see suggestions. These are common outbreak names, pathogens, and sources from EIS history.</p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex gap-2 text-red-700">
            <AlertCircle size={20} />
            <div>
              {errors.map((err, i) => (
                <div key={i} className="text-sm">{err}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Outbreak Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            What was this outbreak called?
          </label>
          <input
            type="text"
            list={showHints ? "outbreak-suggestions" : undefined}
            value={theory.outbreak_name}
            onChange={e => setTheory(prev => ({ ...prev, outbreak_name: e.target.value }))}
            placeholder="e.g., Legionnaires' Disease, Hantavirus..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {showHints && (
            <datalist id="outbreak-suggestions">
              {outbreakSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            What year did this occur?
          </label>
          <input
            type="number"
            value={theory.year}
            onChange={e => setTheory(prev => ({ ...prev, year: parseInt(e.target.value) || 1980 }))}
            min={1950}
            max={2024}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          <p className="text-xs text-slate-500 mt-1">Hint: Within 2 years still earns partial points!</p>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Where did this outbreak occur?
          </label>
          <input
            type="text"
            list={showHints ? "location-suggestions" : undefined}
            value={theory.location}
            onChange={e => setTheory(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., Philadelphia, Pennsylvania"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {showHints && (
            <datalist id="location-suggestions">
              {locationSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          )}
        </div>

        {/* Pathogen */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            What was the pathogen/cause?
          </label>
          <input
            type="text"
            list={showHints ? "pathogen-suggestions" : undefined}
            value={theory.pathogen}
            onChange={e => setTheory(prev => ({ ...prev, pathogen: e.target.value }))}
            placeholder="e.g., Legionella pneumophila, virus..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {showHints && (
            <datalist id="pathogen-suggestions">
              {pathogenSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          )}
        </div>

        {/* Source (optional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            What was the source? <span className="text-amber-600">(+100 bonus points!)</span>
          </label>
          <input
            type="text"
            list={showHints ? "source-suggestions" : undefined}
            value={theory.source}
            onChange={e => setTheory(prev => ({ ...prev, source: e.target.value }))}
            placeholder="e.g., Cooling tower, contaminated food..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {showHints && (
            <datalist id="source-suggestions">
              {sourceSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          )}
        </div>

        {/* Confidence */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            How confident are you?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {confidenceOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheory(prev => ({ ...prev, confidence: opt.value }))}
                className={`
                  p-3 rounded-lg border-2 text-center transition-all
                  ${theory.confidence === opt.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-slate-200 hover:border-slate-300'
                  }
                `}
              >
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-slate-500 mt-1">{opt.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-6 w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
      >
        <Send size={18} />
        {existingTheory ? 'Update Theory' : 'Submit Theory'}
      </button>

      <p className="mt-3 text-xs text-slate-500 text-center">
        Tip: Submit early for bonus points! You can update your theory as new clues are revealed.
      </p>
    </form>
  );
}
