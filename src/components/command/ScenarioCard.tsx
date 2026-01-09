// src/components/command/ScenarioCard.tsx
import type { CommandScenario } from '../../types/command';

interface ScenarioCardProps {
  scenario: CommandScenario;
  onSelect: (id: string) => void;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  hard: 'bg-orange-100 text-orange-800 border-orange-300',
  expert: 'bg-red-100 text-red-800 border-red-300',
};

export function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
  return (
    <div
      className="bg-white/95 rounded-xl p-5 shadow-lg border border-slate-200 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
      onClick={() => onSelect(scenario.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{scenario.title}</h3>
          <p className="text-sm text-slate-600">{scenario.subtitle}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[scenario.difficulty]}`}>
          {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
        </span>
      </div>

      <div className="text-sm text-slate-500 mb-4">
        <span className="font-medium text-slate-700">Pathogen:</span> {scenario.pathogen.name}
      </div>

      <p className="text-sm text-slate-600 line-clamp-2 mb-4">
        {scenario.briefing.slice(0, 120)}...
      </p>

      <div className="flex gap-3 text-xs">
        <div className="bg-slate-100 px-2 py-1 rounded">
          <span className="text-slate-500">Cases:</span>{' '}
          <span className="font-semibold text-slate-700">{scenario.initial_state.cases}</span>
        </div>
        <div className="bg-slate-100 px-2 py-1 rounded">
          <span className="text-slate-500">Budget:</span>{' '}
          <span className="font-semibold text-slate-700">${(scenario.initial_state.budget / 1000).toFixed(0)}k</span>
        </div>
        <div className="bg-slate-100 px-2 py-1 rounded">
          <span className="text-slate-500">Team:</span>{' '}
          <span className="font-semibold text-slate-700">{scenario.initial_state.personnel}</span>
        </div>
      </div>
    </div>
  );
}
