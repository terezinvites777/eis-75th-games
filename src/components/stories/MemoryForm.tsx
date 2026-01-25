// src/components/stories/MemoryForm.tsx
import { useState } from 'react';
import type { Decade } from '../../types/stories';
import { Send } from 'lucide-react';

interface MemoryFormProps {
  onSubmit: (memory: { decade: Decade; memory_text: string }) => void;
}

const decades: Decade[] = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

export function MemoryForm({ onSubmit }: MemoryFormProps) {
  const [decade, setDecade] = useState<Decade>('2010s');
  const [memoryText, setMemoryText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoryText.trim()) return;

    onSubmit({ decade, memory_text: memoryText });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="rounded-xl p-6 text-center border border-amber-300/50"
        style={{
          background: 'linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4)',
        }}
      >
        <div className="text-4xl mb-3">✨</div>
        <h3 className="text-lg font-bold text-green-800">Thank You!</h3>
        <p className="text-green-700 mt-2">
          Your memory has been submitted for review. It may appear in our community gallery soon!
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setMemoryText('');
          }}
          className="mt-4 px-6 py-2 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 shadow-md"
        >
          Share Another Memory
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-6 border border-amber-200/50"
      style={{
        background: 'linear-gradient(180deg, #f5e6c8 0%, #ead4a8 100%)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
      }}
    >
      <h3 className="text-lg font-bold text-stone-800 mb-4">Share Your EIS Memory</h3>

      <p className="text-sm text-stone-600 mb-4">
        Were you an EIS officer? Do you have a memory from your time in the program?
        Share it with the community!
      </p>

      {/* Decade selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          What decade is your memory from?
        </label>
        <div className="flex flex-wrap gap-2">
          {decades.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setDecade(d)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${decade === d
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }
              `}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Memory text */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Your Memory
        </label>
        <textarea
          value={memoryText}
          onChange={e => setMemoryText(e.target.value)}
          placeholder="Tell us about your experience as an EIS officer..."
          rows={4}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none bg-white/80"
        />
        <div className="text-xs text-stone-500 mt-1 text-right">
          {memoryText.length} / 500 characters
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!memoryText.trim()}
        className="w-full bg-stone-800 text-amber-50 py-3 rounded-xl font-semibold hover:bg-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
      >
        <Send size={18} />
        Submit Memory
      </button>

      <p className="mt-3 text-xs text-stone-500 text-center">
        Memories are reviewed before appearing publicly. By submitting, you agree to share
        your story with the EIS community.
      </p>
    </form>
  );
}
