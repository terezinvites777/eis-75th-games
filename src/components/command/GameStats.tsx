// src/components/command/GameStats.tsx
import type { GameState, Pathogen } from '../../types/command';
import { Users, Skull, DollarSign, UserCog, Activity, Target } from 'lucide-react';

interface GameStatsProps {
  gameState: GameState;
  pathogen: Pathogen;
}

export function GameStats({ gameState, pathogen }: GameStatsProps) {
  return (
    <div className="space-y-4">
      {/* Day Counter - Prominent amber/gold for visibility */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-5 text-center shadow-lg border-2 border-amber-400">
        <div className="text-amber-100 text-xs uppercase tracking-widest font-bold mb-1">Day</div>
        <div className="text-5xl font-black text-white drop-shadow-lg">{gameState.day}</div>
        <div className="text-amber-100 text-sm mt-2 font-medium">Outbreak Response</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Users}
          label="Total Cases"
          value={gameState.cases}
          color="red"
          trend={gameState.cases > 50 ? 'up' : undefined}
        />
        <StatCard
          icon={Skull}
          label="Deaths"
          value={gameState.deaths}
          color="slate"
        />
        <StatCard
          icon={DollarSign}
          label="Budget"
          value={`$${(gameState.budget / 1000).toFixed(0)}k`}
          color="green"
          warning={gameState.budget < 100000}
        />
        <StatCard
          icon={UserCog}
          label="Personnel"
          value={gameState.personnel}
          color="blue"
        />
      </div>

      {/* R0 if applicable */}
      {pathogen.r0 > 0 && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-purple-600" />
              <span className="text-sm font-medium text-slate-600">Effective R</span>
            </div>
            <span className={`text-2xl font-bold ${gameState.r0 > 1 ? 'text-red-600' : 'text-green-600'}`}>
              {gameState.r0.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${gameState.r0 > 1 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min((gameState.r0 / 3) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {gameState.r0 > 1 ? 'Outbreak growing' : 'Outbreak shrinking'}
          </p>
        </div>
      )}

      {/* Source Status */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="flex items-center gap-2">
          <Target size={18} className={gameState.source_identified ? 'text-green-600' : 'text-amber-500'} />
          <span className="text-sm font-medium text-slate-600">Source Status</span>
        </div>
        <div className={`mt-2 font-semibold ${gameState.source_identified ? 'text-green-600' : 'text-amber-600'}`}>
          {gameState.source_identified ? 'IDENTIFIED' : 'Under Investigation'}
        </div>
      </div>

      {/* Pathogen Info */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <h4 className="font-semibold text-slate-700 text-sm">Pathogen</h4>
        <p className="text-slate-800 font-medium mt-1">{pathogen.name}</p>
        <p className="text-xs text-slate-500 mt-2">{pathogen.transmission}</p>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: 'red' | 'green' | 'blue' | 'slate';
  trend?: 'up' | 'down';
  warning?: boolean;
}

function StatCard({ icon: Icon, label, value, color, trend, warning }: StatCardProps) {
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    slate: 'bg-slate-50 border-slate-200 text-slate-700',
  };

  const iconColors = {
    red: 'text-red-500',
    green: 'text-green-500',
    blue: 'text-blue-500',
    slate: 'text-slate-500',
  };

  return (
    <div className={`rounded-xl p-3 border ${colorClasses[color]} ${warning ? 'animate-pulse' : ''}`}>
      <div className="flex items-center gap-2">
        <Icon size={16} className={iconColors[color]} />
        <span className="text-xs font-medium opacity-80">{label}</span>
        {trend === 'up' && <span className="text-xs text-red-600">↑</span>}
        {trend === 'down' && <span className="text-xs text-green-600">↓</span>}
      </div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}
