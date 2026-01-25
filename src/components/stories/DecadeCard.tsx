// src/components/stories/DecadeCard.tsx
import type { DecadeInfo } from '../../types/stories';
import { ChevronRight } from 'lucide-react';

interface DecadeCardProps {
  decade: DecadeInfo;
  isActive?: boolean;
  storiesCount: number;
  onClick: () => void;
}

const decadeColors: Record<string, { accent: string; text: string }> = {
  '1950s': { accent: 'border-l-amber-500', text: 'text-amber-700' },
  '1960s': { accent: 'border-l-orange-500', text: 'text-orange-700' },
  '1970s': { accent: 'border-l-yellow-500', text: 'text-yellow-700' },
  '1980s': { accent: 'border-l-pink-500', text: 'text-pink-700' },
  '1990s': { accent: 'border-l-purple-500', text: 'text-purple-700' },
  '2000s': { accent: 'border-l-blue-500', text: 'text-blue-700' },
  '2010s': { accent: 'border-l-teal-500', text: 'text-teal-700' },
  '2020s': { accent: 'border-l-green-500', text: 'text-green-700' },
};

export function DecadeCard({ decade, isActive, storiesCount, onClick }: DecadeCardProps) {
  const colors = decadeColors[decade.decade] || decadeColors['2020s'];

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded-lg p-4 transition-all border-l-4
        ${colors.accent}
        ${isActive
          ? 'shadow-lg ring-2 ring-amber-400/50'
          : 'hover:shadow-md'
        }
      `}
      style={{
        background: `linear-gradient(135deg, #f5e6c8 0%, #e8d4a8 100%)`,
        boxShadow: isActive
          ? '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
          : '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-2xl font-bold ${isActive ? colors.text : 'text-stone-800'}`}>
            {decade.decade}
          </div>
          <div className="text-sm text-stone-600 mt-1">{decade.title}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-500">{storiesCount} stories</span>
          <ChevronRight size={20} className={isActive ? colors.text : 'text-stone-400'} />
        </div>
      </div>
    </button>
  );
}
