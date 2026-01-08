import { motion } from 'framer-motion';
import {
  FlaskConical,
  Activity,
  Stethoscope,
  TreePine,
  BookOpen,
  Lock,
  Eye
} from 'lucide-react';
import type { Clue } from '../../types/game';

interface ClueCardProps {
  clue: Clue;
  isRevealed: boolean;
  onReveal: () => void;
  disabled?: boolean;
}

const clueIcons: Record<Clue['type'], typeof FlaskConical> = {
  lab: FlaskConical,
  epi: Activity,
  clinical: Stethoscope,
  environmental: TreePine,
  historical: BookOpen,
};

const clueTypeLabels: Record<Clue['type'], string> = {
  lab: 'Lab Result',
  epi: 'Epidemiology',
  clinical: 'Clinical',
  environmental: 'Environmental',
  historical: 'Historical',
};

const clueTypeColors: Record<Clue['type'], string> = {
  lab: 'bg-blue-100 text-blue-700 border-blue-200',
  epi: 'bg-green-100 text-green-700 border-green-200',
  clinical: 'bg-red-100 text-red-700 border-red-200',
  environmental: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  historical: 'bg-amber-100 text-amber-700 border-amber-200',
};

export function ClueCard({ clue, isRevealed, onReveal, disabled }: ClueCardProps) {
  const Icon = clueIcons[clue.type];

  if (!isRevealed) {
    return (
      <motion.button
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        onClick={onReveal}
        disabled={disabled}
        className={`w-full p-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-cdc-blue hover:bg-blue-50 cursor-pointer'}
          transition-all`}
      >
        <div className="flex items-center gap-3 text-gray-400">
          <Lock size={20} />
          <div className="text-left">
            <p className="font-medium text-gray-500">Clue #{clue.order}</p>
            <p className="text-sm">{clueTypeLabels[clue.type]} Evidence</p>
          </div>
          <Eye size={18} className="ml-auto" />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border-2 ${clueTypeColors[clue.type]} bg-gradient-to-br from-white to-gray-50`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${clueTypeColors[clue.type]}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase tracking-wide opacity-70">
              {clueTypeLabels[clue.type]}
            </span>
            <span className="text-xs opacity-50">#{clue.order}</span>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">{clue.title}</h4>
          <p className="text-sm text-gray-600">{clue.content}</p>
        </div>
      </div>
    </motion.div>
  );
}
