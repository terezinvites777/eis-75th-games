// src/components/connect/MatchFilters.tsx
import type { MatchFilter, Topic } from '../../types/connect';
import { topicLabels } from '../../data/connect-data';

interface MatchFiltersProps {
  activeFilter: MatchFilter | Topic | null;
  onFilterChange: (filter: MatchFilter | Topic | null) => void;
}

export function MatchFilters({ activeFilter, onFilterChange }: MatchFiltersProps) {
  const mainFilters: { key: MatchFilter; label: string; icon: string }[] = [
    { key: 'new-alumni', label: 'Meet Alumni', icon: '🎓' },
    { key: 'incoming-2nd', label: 'Peer Connections', icon: '👥' },
    { key: 'by-topic', label: 'By Topic', icon: '🔬' },
  ];

  const topicOptions = Object.entries(topicLabels) as [Topic, string][];

  return (
    <div className="space-y-3">
      {/* Main filters */}
      <div className="flex flex-wrap gap-2">
        {mainFilters.map(filter => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(activeFilter === filter.key ? null : filter.key)}
            className={`
              px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2
              ${activeFilter === filter.key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
              }
            `}
          >
            <span>{filter.icon}</span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Topic sub-filters */}
      {activeFilter === 'by-topic' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <p className="text-sm text-slate-600 mb-3">Select a topic area:</p>
          <div className="flex flex-wrap gap-2">
            {topicOptions.map(([topic, label]) => (
              <button
                key={topic}
                onClick={() => onFilterChange(topic)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm transition-all
                  ${(activeFilter as string) === topic
                    ? 'bg-blue-100 text-blue-700 border-blue-300 border'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
