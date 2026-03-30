// src/components/command/EventDialog.tsx
import type { GameEvent, GameState } from '../../types/command';
import { AlertTriangle } from 'lucide-react';

interface EventDialogProps {
  event: GameEvent;
  onChoice: (choiceIndex: number | null) => void;
}

export function EventDialog({ event, onChoice }: EventDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-amber-500 text-white px-6 py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} />
            <div>
              <div className="text-xs font-medium opacity-80">DAY {event.day} EVENT</div>
              <h2 className="text-xl font-bold">{event.title}</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-700 leading-relaxed">{event.description}</p>

          {/* Choices or Continue */}
          <div className="mt-6 space-y-3">
            {event.choices ? (
              event.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => onChoice(idx)}
                  className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-left transition-colors"
                >
                  <span className="font-medium text-slate-800">{choice.label}</span>
                  {choice.effect && Object.keys(choice.effect).length > 0 && (
                    <div className="text-xs text-slate-500 mt-1">
                      {formatEffect(choice.effect)}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <button
                onClick={() => onChoice(null)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatEffect(effect: Partial<GameState>): string {
  const parts: string[] = [];

  if (effect.cases !== undefined) {
    parts.push(`${effect.cases > 0 ? '+' : ''}${effect.cases} cases`);
  }
  if (effect.deaths !== undefined) {
    parts.push(`${effect.deaths > 0 ? '+' : ''}${effect.deaths} deaths`);
  }
  if (effect.budget !== undefined) {
    const amt = effect.budget / 1000;
    parts.push(`${amt > 0 ? '+' : ''}$${amt}k budget`);
  }
  if (effect.personnel !== undefined) {
    parts.push(`${effect.personnel > 0 ? '+' : ''}${effect.personnel} personnel`);
  }

  return parts.join(', ') || 'No immediate effect';
}
