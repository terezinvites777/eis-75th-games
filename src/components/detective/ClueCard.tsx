// src/components/detective/ClueCard.tsx
// Styled clue card for Disease Detective game

import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, FlaskConical, Activity, MapPin, Clock, FileText, Sparkles } from 'lucide-react';
import type { Clue, ClueType } from '../../types/detective';

interface ClueCardProps {
  clue: Clue;
  isRevealed: boolean;
  onReveal?: () => void;
  canAfford?: boolean;
}

const clueTypeConfig: Record<ClueType, { icon: typeof FlaskConical; label: string }> = {
  epidemiologic: { icon: Activity, label: 'Epidemiologic' },
  laboratory: { icon: FlaskConical, label: 'Laboratory' },
  environmental: { icon: MapPin, label: 'Environmental' },
  clinical: { icon: FileText, label: 'Clinical' },
  timeline: { icon: Clock, label: 'Timeline' },
  historical: { icon: FileText, label: 'Historical' },
};

export function ClueCard({ clue, isRevealed, onReveal, canAfford = true }: ClueCardProps) {
  const config = clueTypeConfig[clue.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${isRevealed ? 'clue-card' : 'clue-card-locked'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`clue-type-badge clue-type-${clue.type}`}>
            <Icon size={16} />
          </span>
          <span className="clue-type-label">
            {config.label}
          </span>
        </div>

        {clue.isCritical && isRevealed && (
          <span className="clue-critical-badge">
            <Sparkles size={12} />
            Critical
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="font-bold text-gray-900 mb-2">{clue.title}</h4>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isRevealed ? (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap"
          >
            {clue.content}
            
            {clue.source && (
              <p className="mt-3 text-xs text-gray-500 italic">
                Source: {clue.source}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-6 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <Lock size={20} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {clue.revealHint || 'This clue is locked'}
            </p>
            
            <button
              onClick={onReveal}
              disabled={!canAfford}
              className={`btn-emboss btn-emboss-sm ${
                canAfford 
                  ? 'btn-emboss-primary' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <Eye size={16} />
              Reveal ({clue.pointCost} pts)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Mini version for compact display
interface ClueChipProps {
  clue: Clue;
  isRevealed: boolean;
  onClick?: () => void;
}

export function ClueChip({ clue, isRevealed, onClick }: ClueChipProps) {
  const config = clueTypeConfig[clue.type];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={`pill flex items-center gap-2 transition-all ${
        isRevealed 
          ? 'pill-themed' 
          : 'bg-gray-100 text-gray-400'
      }`}
    >
      {isRevealed ? (
        <Icon size={14} />
      ) : (
        <Lock size={14} />
      )}
      <span className="text-sm font-medium">{clue.order}</span>
    </button>
  );
}

export default ClueCard;
