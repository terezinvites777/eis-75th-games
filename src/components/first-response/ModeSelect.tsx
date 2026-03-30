// src/components/first-response/ModeSelect.tsx
// Two-panel mode selector: Suit Up (PPE) vs First Response (Investigation)

import type { GameMode } from '../../types/first-response';

interface ModeSelectProps {
  onSelectMode: (mode: GameMode) => void;
}

export function ModeSelect({ onSelectMode }: ModeSelectProps) {
  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          Choose Your Challenge
        </h2>
        <p className="text-white/70">Test your speed and knowledge of emergency response protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode 1: Suit Up */}
        <button
          onClick={() => onSelectMode('suit-up')}
          className="bg-white/95 rounded-2xl p-6 border-2 border-slate-200 shadow-lg text-left active:scale-[0.98] transition-transform group"
        >
          <div className="text-5xl mb-4">🧤</div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">SUIT UP</h3>
          <p className="text-sm font-semibold text-red-600 mb-3">PPE Challenge</p>
          <p className="text-sm text-slate-600 mb-4">
            Don and doff personal protective equipment in the correct CDC sequence. Speed matters — but accuracy matters more.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="bg-slate-100 px-2 py-1 rounded">Donning & Doffing</span>
            <span className="bg-slate-100 px-2 py-1 rounded">~60 sec</span>
          </div>
        </button>

        {/* Mode 2: First Response */}
        <button
          onClick={() => onSelectMode('first-response')}
          className="bg-white/95 rounded-2xl p-6 border-2 border-slate-200 shadow-lg text-left active:scale-[0.98] transition-transform group"
        >
          <div className="text-5xl mb-4">🔬</div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">FIRST RESPONSE</h3>
          <p className="text-sm font-semibold text-blue-600 mb-3">Outbreak Investigation</p>
          <p className="text-sm text-slate-600 mb-4">
            A real outbreak has been reported. Put the 10 steps of a field investigation in the correct order — before time runs out.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="bg-slate-100 px-2 py-1 rounded">10 Steps</span>
            <span className="bg-slate-100 px-2 py-1 rounded">90 sec countdown</span>
          </div>
        </button>
      </div>
    </div>
  );
}
