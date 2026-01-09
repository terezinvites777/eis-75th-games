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

const clueTypeConfig: Record<ClueType, { icon: typeof FlaskConical; label: string; color: string }> = {
  epidemiologic: { icon: Activity, label: 'Epidemiologic', color: 'text-blue-600 bg-blue-50' },
  laboratory: { icon: FlaskConical, label: 'Laboratory', color: 'text-purple-600 bg-purple-50' },
  environmental: { icon: MapPin, label: 'Environmental', color: 'text-green-600 bg-green-50' },
  clinical: { icon: FileText, label: 'Clinical', color: 'text-rose-600 bg-rose-50' },
  timeline: { icon: Clock, label: 'Timeline', color: 'text-orange-600 bg-orange-50' },
  historical: { icon: FileText, label: 'Historical', color: 'text-gray-600 bg-gray-50' },
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
          <span className={`p-1.5 rounded-lg ${config.color}`}>
            <Icon size={16} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {config.label}
          </span>
        </div>
        
        {clue.isCritical && isRevealed && (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
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
