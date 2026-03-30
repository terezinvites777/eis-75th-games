// src/components/first-response/SequenceBar.tsx
// Bottom bar showing locked-in sequence progress

interface SequenceBarProps {
  totalSteps: number;
  completedSteps: number;
  labels: string[];  // Short labels for each completed step
}

export function SequenceBar({ totalSteps, completedSteps, labels }: SequenceBarProps) {
  return (
    <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-700">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Progress
        </span>
        <span className="text-xs font-bold text-white ml-auto">
          {completedSteps} / {totalSteps}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              i < completedSteps
                ? 'bg-green-500'
                : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {labels.map((label, i) => (
            <span key={i} className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">
              {i + 1}. {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
