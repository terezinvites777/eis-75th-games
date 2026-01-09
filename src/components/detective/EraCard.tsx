// src/components/detective/EraCard.tsx
// Styled era selection card

import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle } from 'lucide-react';
import type { EraInfo } from '../../types/detective';

interface EraCardProps {
  era: EraInfo;
  completedCount: number;
  totalCount: number;
  onClick: () => void;
  index?: number;
}

export function EraCard({ era, completedCount, totalCount, onClick, index = 0 }: EraCardProps) {
  const isComplete = completedCount === totalCount && totalCount > 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full text-left overflow-hidden rounded-2xl p-6 bg-gradient-to-r ${era.theme.gradient} text-white shadow-lg`}
      data-era={era.era}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white rounded-full" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-white/50 rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Era Icon */}
        <div className="text-4xl">{era.icon}</div>

        {/* Text Content */}
        <div className="flex-1">
          <div className="text-sm font-medium text-white/80 mb-0.5">{era.years}</div>
          <h3 className="text-xl font-bold mb-0.5">{era.title}</h3>
          <p className="text-sm text-white/90">{era.subtitle}</p>
        </div>

        {/* Status */}
        <div className="flex flex-col items-end gap-2">
          {isComplete ? (
            <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center">
              <CheckCircle size={18} className="text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ChevronRight size={18} className="text-white" />
            </div>
          )}
          <span className="text-xs text-white/80 font-medium">
            {completedCount}/{totalCount} cases
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      {progress > 0 && progress < 100 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-white/60 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.button>
  );
}

export default EraCard;
