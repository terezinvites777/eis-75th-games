// src/components/first-response/SequenceCard.tsx
// Tappable card for sequencing games — shows PPE item or investigation step

import { motion } from 'framer-motion';
import type { SequenceCardState } from '../../types/first-response';

interface SequenceCardProps {
  card: SequenceCardState;
  onTap: (id: string) => void;
  disabled?: boolean;
  showContaminationWarning?: string;
}

export function SequenceCard({ card, onTap, disabled, showContaminationWarning }: SequenceCardProps) {
  const isCorrect = card.isCorrect === true;
  const isWrong = card.isCorrect === false;
  const isLocked = card.isLocked;
  const isPending = card.tappedOrder === null;

  return (
    <motion.button
      onClick={() => !isLocked && !disabled && onTap(card.id)}
      disabled={isLocked || disabled}
      className={`relative w-full rounded-xl p-4 text-left transition-colors border-2 shadow-md ${
        isLocked
          ? 'bg-green-50 border-green-400 cursor-default'
          : isWrong
          ? 'bg-red-50 border-red-400'
          : isPending
          ? 'bg-white border-slate-200 active:border-blue-400 active:bg-blue-50 cursor-pointer'
          : 'bg-white border-slate-200'
      }`}
      style={{ minHeight: 72 }}
      animate={
        isWrong
          ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
          : isCorrect && !isLocked
          ? { scale: [1, 1.03, 1] }
          : {}
      }
      transition={{ duration: isWrong ? 0.4 : 0.2 }}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`text-3xl shrink-0 ${isLocked ? 'opacity-60' : ''}`}>
          {card.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm leading-tight ${
            isLocked ? 'text-green-700' : isWrong ? 'text-red-700' : 'text-slate-800'
          }`}>
            {card.name}
          </div>
          {showContaminationWarning && isLocked && (
            <div className="text-xs text-amber-700 mt-1 leading-snug">
              {showContaminationWarning}
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="shrink-0">
          {isLocked && (
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
              {(card.tappedOrder ?? 0) + 1}
            </div>
          )}
          {isWrong && (
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-lg">
              ✕
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
