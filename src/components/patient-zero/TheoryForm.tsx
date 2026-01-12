// src/components/patient-zero/TheoryForm.tsx
// Theory submission form with brand styling

import { useState } from 'react';
import type { PlayerTheory } from '../../types/patient-zero';
import { Send, AlertCircle, Lightbulb, Target, Calendar, MapPin, Bug, FileQuestion } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="panel animate-slide-up">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-secondary)]" />

      <div className="flex items-center justify-between mb-4 pt-1">
        <div className="section-header mb-0">
          <Target size={18} className="text-[var(--theme-primary)]" />
          <span className="section-title">
            {existingTheory ? 'Update Your Theory' : 'Submit Your Theory'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowHints(!showHints)}
          className={`pill transition-colors ${
            showHints ? 'pill-gold' : 'hover:bg-slate-100'
          }`}
        >
          <Lightbulb size={14} />
          {showHints ? 'Hide hints' : 'Show hints'}
        </button>
      </div>

      {showHints && (
        <div className="panel-themed p-3 mb-4 animate-slide-up">
          <div className="font-medium text-amber-800 mb-1 text-sm">Hints enabled!</div>
          <p className="text-amber-700 text-xs">Start typing to see suggestions. These are common outbreak names, pathogens, and sources from EIS history.</p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="panel-themed p-4 mb-4 border-red-200 bg-red-50">
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

      <div className="space-y-5">
        {/* Outbreak Name */}
        <div className="stat-card !text-left !p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <FileQuestion size={16} className="text-slate-400" />
            What was this outbreak called?
          </label>
          <input
            type="text"
            list={showHints ? "outbreak-suggestions" : undefined}
            value={theory.outbreak_name}
            onChange={e => setTheory(prev => ({ ...prev, outbreak_name: e.target.value }))}
            placeholder="e.g., Legionnaires' Disease, Hantavirus..."
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] transition-colors"
          />
          {showHints && (
            <datalist id="outbreak-suggestions">
              {outbreakSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          )}
        </div>

        {/* Year */}
        <div className="stat-card !text-left !p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Calendar size={16} className="text-slate-400" />
            What year did this occur?
          </label>
          <input
            type="number"
            value={theory.year}
            onChange={e => setTheory(prev => ({ ...prev, year: parseInt(e.target.value) || 1980 }))}
            min={1950}
            max={2024}
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] transition-colors"
          />
          <p className="text-xs text-slate-500 mt-2">
            <span className="pill text-xs">Hint: Within 2 years still earns partial points!</span>
          </p>
        </div>

        {/* Location */}
        <div className="stat-card !text-left !p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <MapPin size={16} className="text-slate-400" />
            Where did this outbreak occur?
          </label>
          <input
            type="text"
            list={showHints ? "location-suggestions" : undefined}
            value={theory.location}
            onChange={e => setTheory(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., Philadelphia, Pennsylvania"
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] transition-colors"
          />
          {showHints && (
            <datalist id="location-suggestions">
              {locationSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          )}
        </div>

        {/* Pathogen */}
        <div className="stat-card !text-left !p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Bug size={16} className="text-slate-400" />
            What was the pathogen/cause?
          </label>
          <input
            type="text"
            list={showHints ? "pathogen-suggestions" : undefined}
            value={theory.pathogen}
            onChange={e => setTheory(prev => ({ ...prev, pathogen: e.target.value }))}
            placeholder="e.g., Legionella pneumophila, virus..."
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] transition-colors"
          />
          {showHints && (
            <datalist id="pathogen-suggestions">
              {pathogenSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          )}
        </div>

        {/* Source (optional) */}
        <div className="stat-card !text-left !p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <Target size={16} className="text-slate-400" />
            What was the source?
            <span className="pill pill-gold text-xs">+100 bonus pts!</span>
          </label>
          <input
            type="text"
            list={showHints ? "source-suggestions" : undefined}
            value={theory.source}
            onChange={e => setTheory(prev => ({ ...prev, source: e.target.value }))}
            placeholder="e.g., Cooling tower, contaminated food..."
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] transition-colors"
          />
          {showHints && (
            <datalist id="source-suggestions">
              {sourceSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          )}
        </div>

        {/* Confidence */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            How confident are you?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {confidenceOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheory(prev => ({ ...prev, confidence: opt.value }))}
                className={`
                  stat-card !p-3 cursor-pointer transition-all
                  ${theory.confidence === opt.value
                    ? 'ring-2 ring-[var(--theme-primary)] !border-[var(--theme-primary)]'
                    : 'hover:border-slate-300'
                  }
                `}
              >
                <div className="font-medium text-sm text-slate-800">{opt.label}</div>
                <div className="text-xs text-slate-500 mt-1">{opt.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn-emboss btn-emboss-primary btn-emboss-lg w-full mt-6"
      >
        <Send size={18} />
        {existingTheory ? 'Update Theory' : 'Submit Theory'}
      </button>

      <p className="mt-4 text-center">
        <span className="pill text-xs">
          Tip: Submit early for bonus points! You can update your theory as new clues are revealed.
        </span>
      </p>
    </form>
  );
}
