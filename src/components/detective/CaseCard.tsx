// src/components/detective/CaseCard.tsx
// Card component for displaying a Detective case

import { motion } from 'framer-motion';
import { Lock, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { DifficultyStars } from '../brand/BrandMarks';
import type { DetectiveCase } from '../../types/detective';

interface CaseCardProps {
  caseData: DetectiveCase;
  status: 'locked' | 'available' | 'completed';
  score?: number;
  onClick?: () => void;
  index?: number;
}

export function CaseCard({ caseData, status, score, onClick, index = 0 }: CaseCardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={status === 'available' ? { scale: 1.02, y: -2 } : undefined}
      whileTap={status === 'available' ? { scale: 0.98 } : undefined}
      onClick={status === 'available' ? onClick : undefined}
      className={`case-card relative ${
        status === 'locked' ? 'opacity-60 cursor-not-allowed' :
        status === 'available' ? 'cursor-pointer' : ''
      }`}
      data-era={caseData.era}
    >
      {/* Status Indicator */}
      <div className="absolute top-3 right-3">
        {status === 'locked' && (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <Lock size={16} className="text-gray-400" />
          </div>
        )}
        {status === 'completed' && (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle size={18} className="text-green-600" />
          </div>
        )}
        {status === 'available' && (
          <div className="w-8 h-8 rounded-full bg-[var(--theme-surface)] flex items-center justify-center">
            <ChevronRight size={18} className="text-[var(--theme-primary)]" />
          </div>
        )}
      </div>

      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-amber-100 text-amber-800 border border-amber-200">
          {caseData.year}
        </span>
        <span className="text-xs font-bold text-[var(--theme-primary)]">
          {caseData.basePoints} pts
        </span>
      </div>

      {/* Title & Subtitle */}
      <h3 className="text-lg font-bold text-gray-900 mb-1 pr-10">
        {caseData.title}
      </h3>
      <p className="text-sm text-gray-500 mb-3">
        {caseData.subtitle}
      </p>

      {/* Teaser */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {caseData.teaser}
      </p>

      {/* Footer Row */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <DifficultyStars level={caseData.difficulty} />

        {/* Time Limit */}
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock size={14} />
          <span className="text-xs font-medium">{formatTime(caseData.timeLimit)}</span>
        </div>
      </div>

      {/* Completed Score Overlay */}
      {status === 'completed' && score !== undefined && (
        <div className="absolute bottom-3 right-3">
          <div className="pill-themed font-bold">
            {score} pts
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default CaseCard;
