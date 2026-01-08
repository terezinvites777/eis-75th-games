import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  formatTime: () => string;
}

export function Timer({ timeRemaining, totalTime, formatTime }: TimerProps) {
  const percentRemaining = (timeRemaining / totalTime) * 100;
  const isLow = percentRemaining < 25;
  const isCritical = percentRemaining < 10;

  return (
    <motion.div
      animate={isCritical ? { scale: [1, 1.02, 1] } : {}}
      transition={{ repeat: Infinity, duration: 0.5 }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold ${
        isCritical
          ? 'bg-red-100 text-red-600'
          : isLow
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      {isCritical ? <AlertTriangle size={18} /> : <Clock size={18} />}
      <span className="text-lg">{formatTime()}</span>
    </motion.div>
  );
}
