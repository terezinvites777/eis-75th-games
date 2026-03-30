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
      className={`relative w-full text-left overflow-hidden rounded-xl p-3 bg-gradient-to-r ${era.theme.gradient} text-white shadow-lg`}
      data-era={era.era}
    >
      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        {/* Era Icon */}
        <div className="text-2xl">{era.icon}</div>

        {/* Text Content */}
        <div className="flex-1">
          <div className="text-xs font-medium text-white/80">{era.years}</div>
          <h3 className="text-base font-bold">{era.title}</h3>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/80 font-medium">
            {completedCount}/{totalCount} cases
          </span>
          {isComplete ? (
            <CheckCircle size={18} className="text-white" />
          ) : (
            <ChevronRight size={18} className="text-white/70" />
          )}
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
