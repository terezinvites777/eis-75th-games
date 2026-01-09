// src/components/command/ActionPanel.tsx
import type { Action, GameState } from '../../types/command';
import { Clock, DollarSign, Zap } from 'lucide-react';

interface ActionPanelProps {
  actions: Action[];
  gameState: GameState;
  onExecuteAction: (actionId: string) => void;
  disabled?: boolean;
}

export function ActionPanel({ actions, gameState, onExecuteAction, disabled }: ActionPanelProps) {
  const canAfford = (action: Action) => gameState.budget >= action.cost;
  const isActive = (action: Action) => action.active;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Zap size={20} className="text-amber-500" />
        Available Actions
      </h3>

      <div className="grid gap-3">
        {actions.map(action => {
          const affordable = canAfford(action);
          const active = isActive(action);

          return (
            <div
              key={action.id}
              className={`
                relative p-4 rounded-xl border-2 transition-all
                ${active
                  ? 'bg-blue-50 border-blue-300'
                  : affordable && !disabled
                    ? 'bg-white hover:bg-slate-50 border-slate-200 cursor-pointer hover:border-blue-300'
                    : 'bg-slate-100 border-slate-200 opacity-60'
                }
              `}
              onClick={() => {
                if (!disabled && affordable && !active) {
                  onExecuteAction(action.id);
                }
              }}
            >
              {active && (
                <div className="absolute top-2 right-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Clock size={12} />
                    Day {action.started_day! + action.duration - gameState.day} left
                  </span>
                </div>
              )}

              <div className="pr-20">
                <h4 className="font-semibold text-slate-800">{action.name}</h4>
                <p className="text-sm text-slate-600 mt-1">{action.description}</p>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-sm">
                  <DollarSign size={14} className="text-green-600" />
                  <span className={affordable ? 'text-slate-700' : 'text-red-600 font-semibold'}>
                    ${(action.cost / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Clock size={14} />
                  <span>{action.duration} days</span>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  {action.effect}
                </div>
              </div>

              {action.progress !== undefined && action.progress > 0 && (
                <div className="mt-3">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${(action.progress / action.duration) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Execute button - only show if action is available */}
              {!active && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled && affordable) {
                      onExecuteAction(action.id);
                    }
                  }}
                  disabled={disabled || !affordable}
                  className={`
                    mt-3 w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all
                    ${affordable && !disabled
                      ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }
                  `}
                >
                  {affordable ? 'Execute Action' : 'Insufficient Budget'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
