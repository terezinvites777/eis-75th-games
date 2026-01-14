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
    <form onSubmit={handleSubmit} className="pz-frame animate-slide-up">
      {/* Case File Header */}
      <div className="pz-caseHeader">
        <div className="pz-caseIcon">
          <Target size={24} className="text-[#fff8e6]" />
        </div>
        <div className="flex-1">
          <h3 className="pz-caseTitle">
            {existingTheory ? 'Update Your Theory' : 'Submit Your Theory'}
          </h3>
          <p className="pz-caseSubtitle">Case File Investigation Report</p>
        </div>
        <button
          type="button"
          onClick={() => setShowHints(!showHints)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            showHints
              ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#1a140d] border border-[rgba(255,255,255,0.3)]'
              : 'bg-[rgba(139,115,85,0.3)] text-[#f4e4c1] border border-[rgba(212,175,55,0.3)] hover:bg-[rgba(139,115,85,0.5)]'
          }`}
        >
          <Lightbulb size={14} />
          {showHints ? 'Hide hints' : 'Show hints'}
        </button>
      </div>

      {/* Form body - parchment style */}
      <div className="pz-parchment !rounded-t-none !border-t-0">

      {showHints && (
        <div className="p-3 mb-4 animate-slide-up bg-gradient-to-r from-[rgba(212,175,55,0.15)] to-[rgba(184,134,11,0.1)] border border-[rgba(212,175,55,0.3)] rounded-lg">
          <div className="font-medium text-[#705812] mb-1 text-sm font-serif">Hints enabled!</div>
          <p className="text-[#4a3728] text-xs">Start typing to see suggestions. These are common outbreak names, pathogens, and sources from EIS history.</p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="p-4 mb-4 border border-[#8b4444] bg-gradient-to-r from-[rgba(139,68,68,0.15)] to-[rgba(139,68,68,0.1)] rounded-lg">
          <div className="flex gap-2 text-[#6b3030]">
            <AlertCircle size={20} />
            <div>
              {errors.map((err, i) => (
                <div key={i} className="text-sm font-medium">{err}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Outbreak Name */}
        <div className="p-4 bg-gradient-to-b from-[rgba(248,240,210,0.5)] to-[rgba(230,215,170,0.3)] border border-[rgba(139,115,85,0.3)] rounded-lg">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#2d1f10] mb-2 font-serif">
            <FileQuestion size={16} className="text-[#8b6914]" />
            What was this outbreak called?
          </label>
          <input
            type="text"
            list={showHints ? "outbreak-suggestions" : undefined}
            value={theory.outbreak_name}
            onChange={e => setTheory(prev => ({ ...prev, outbreak_name: e.target.value }))}
            placeholder="e.g., Legionnaires' Disease, Hantavirus..."
            className="w-full px-4 py-2.5 bg-white border-2 border-[#8b7355] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition-colors text-[#2d1f10]"
          />
          {showHints && (
            <datalist id="outbreak-suggestions">
              {outbreakSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          )}
        </div>

        {/* Year */}
        <div className="p-4 bg-gradient-to-b from-[rgba(248,240,210,0.5)] to-[rgba(230,215,170,0.3)] border border-[rgba(139,115,85,0.3)] rounded-lg">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#2d1f10] mb-2 font-serif">
            <Calendar size={16} className="text-[#8b6914]" />
            What year did this occur?
          </label>
          <input
            type="number"
            value={theory.year}
            onChange={e => setTheory(prev => ({ ...prev, year: parseInt(e.target.value) || 1980 }))}
            min={1950}
            max={2024}
            className="w-full px-4 py-2.5 bg-white border-2 border-[#8b7355] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition-colors text-[#2d1f10]"
          />
          <p className="text-xs text-[#4a3728] mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-[rgba(139,115,85,0.15)] text-[#3d2b1f] rounded border border-[rgba(139,115,85,0.3)]">Hint: Within 2 years still earns partial points!</span>
          </p>
        </div>

        {/* Location */}
        <div className="p-4 bg-gradient-to-b from-[rgba(248,240,210,0.5)] to-[rgba(230,215,170,0.3)] border border-[rgba(139,115,85,0.3)] rounded-lg">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#2d1f10] mb-2 font-serif">
            <MapPin size={16} className="text-[#8b6914]" />
            Where did this outbreak occur?
          </label>
          <input
            type="text"
            list={showHints ? "location-suggestions" : undefined}
            value={theory.location}
            onChange={e => setTheory(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., Philadelphia, Pennsylvania"
            className="w-full px-4 py-2.5 bg-white border-2 border-[#8b7355] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition-colors text-[#2d1f10]"
          />
          {showHints && (
            <datalist id="location-suggestions">
              {locationSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          )}
        </div>

        {/* Pathogen */}
        <div className="p-4 bg-gradient-to-b from-[rgba(248,240,210,0.5)] to-[rgba(230,215,170,0.3)] border border-[rgba(139,115,85,0.3)] rounded-lg">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#2d1f10] mb-2 font-serif">
            <Bug size={16} className="text-[#8b6914]" />
            What was the pathogen/cause?
          </label>
          <input
            type="text"
            list={showHints ? "pathogen-suggestions" : undefined}
            value={theory.pathogen}
            onChange={e => setTheory(prev => ({ ...prev, pathogen: e.target.value }))}
            placeholder="e.g., Legionella pneumophila, virus..."
            className="w-full px-4 py-2.5 bg-white border-2 border-[#8b7355] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition-colors text-[#2d1f10]"
          />
          {showHints && (
            <datalist id="pathogen-suggestions">
              {pathogenSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          )}
        </div>

        {/* Source (optional) */}
        <div className="p-4 bg-gradient-to-b from-[rgba(248,240,210,0.5)] to-[rgba(230,215,170,0.3)] border border-[rgba(139,115,85,0.3)] rounded-lg">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#2d1f10] mb-2 font-serif">
            <Target size={16} className="text-[#8b6914]" />
            What was the source?
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#1a140d] rounded border border-[rgba(255,255,255,0.3)]">+100 bonus pts!</span>
          </label>
          <input
            type="text"
            list={showHints ? "source-suggestions" : undefined}
            value={theory.source}
            onChange={e => setTheory(prev => ({ ...prev, source: e.target.value }))}
            placeholder="e.g., Cooling tower, contaminated food..."
            className="w-full px-4 py-2.5 bg-white border-2 border-[#8b7355] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] transition-colors text-[#2d1f10]"
          />
          {showHints && (
            <datalist id="source-suggestions">
              {sourceSuggestions.map(s => <option key={s} value={s} />)}
            </datalist>
          )}
        </div>

        {/* Confidence */}
        <div>
          <label className="block text-sm font-semibold text-[#2d1f10] mb-3 font-serif">
            How confident are you?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {confidenceOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheory(prev => ({ ...prev, confidence: opt.value }))}
                className={`
                  p-3 cursor-pointer transition-all rounded-lg border-2
                  bg-gradient-to-b from-[rgba(248,240,210,0.6)] to-[rgba(230,215,170,0.4)]
                  ${theory.confidence === opt.value
                    ? 'ring-2 ring-[#d4af37] border-[#d4af37]'
                    : 'border-[rgba(139,115,85,0.3)] hover:border-[#8b7355]'
                  }
                `}
              >
                <div className="font-semibold text-sm text-[#2d1f10] font-serif">{opt.label}</div>
                <div className="text-xs text-[#4a3728] mt-1">{opt.description}</div>
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
        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-[rgba(139,115,85,0.15)] text-[#3d2b1f] rounded-lg border border-[rgba(139,115,85,0.3)]">
          Tip: Submit early for bonus points! You can update your theory as new clues are revealed.
        </span>
      </p>
      </div>
    </form>
  );
}
