// src/components/stories/DecadeCard.tsx
import type { DecadeInfo } from '../../types/stories';
import { ChevronRight } from 'lucide-react';

interface DecadeCardProps {
  decade: DecadeInfo;
  isActive?: boolean;
  storiesCount: number;
  onClick: () => void;
}

const decadeColors: Record<string, { bg: string; border: string; text: string }> = {
  '1950s': { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-800' },
  '1960s': { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' },
  '1970s': { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800' },
  '1980s': { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800' },
  '1990s': { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800' },
  '2000s': { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' },
  '2010s': { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-800' },
  '2020s': { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' },
};

export function DecadeCard({ decade, isActive, storiesCount, onClick }: DecadeCardProps) {
  const colors = decadeColors[decade.decade] || decadeColors['2020s'];

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-xl p-4 border-2 transition-all
        ${isActive
          ? `${colors.bg} ${colors.border} shadow-lg`
          : 'bg-white border-slate-200 hover:border-slate-300'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-2xl font-bold ${isActive ? colors.text : 'text-slate-800'}`}>
            {decade.decade}
          </div>
          <div className="text-sm text-slate-600 mt-1">{decade.title}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">{storiesCount} stories</span>
          <ChevronRight size={20} className={isActive ? colors.text : 'text-slate-400'} />
        </div>
      </div>
    </button>
  );
}
