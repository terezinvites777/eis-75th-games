import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target, Clock } from 'lucide-react';
import type { ScoreBreakdown } from '../../lib/scoring';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ScoreDisplayProps {
  breakdown: ScoreBreakdown;
  isCorrect: boolean;
  onContinue: () => void;
  caseTitle?: string;
  realOutcome?: string;
}

export function ScoreDisplay({
  breakdown,
  isCorrect,
  onContinue,
  caseTitle,
  realOutcome,
}: ScoreDisplayProps) {
  const scoreItems = [
    { label: 'Base Points', value: breakdown.basePoints, icon: Target },
    { label: 'Time Bonus', value: breakdown.timeBonus, icon: Clock },
    { label: 'Accuracy Bonus', value: breakdown.accuracyBonus, icon: Zap },
    { label: 'Streak Bonus', value: breakdown.streakBonus, icon: Star },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Result header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            isCorrect ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {isCorrect ? (
            <Trophy className="w-10 h-10 text-green-600" />
          ) : (
            <span className="text-4xl">😔</span>
          )}
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900">
          {isCorrect ? 'Correct Diagnosis!' : 'Incorrect Diagnosis'}
        </h2>

        {caseTitle && (
          <p className="text-gray-500 mt-1">{caseTitle}</p>
        )}
      </div>

      {/* Score breakdown */}
      {isCorrect && (
        <Card variant="elevated" padding="md">
          <div className="space-y-3">
            {scoreItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-gray-600">
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </div>
                <span className="font-semibold text-gray-900">
                  +{item.value.toLocaleString()}
                </span>
              </motion.div>
            ))}

            {breakdown.difficultyMultiplier > 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-between text-purple-600"
              >
                <span>Difficulty Multiplier</span>
                <span className="font-semibold">x{breakdown.difficultyMultiplier}</span>
              </motion.div>
            )}

            <div className="border-t border-gray-200 pt-3 mt-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.8 }}
                className="flex items-center justify-between"
              >
                <span className="font-bold text-lg text-gray-900">Total Score</span>
                <span className="font-bold text-2xl text-cdc-blue">
                  +{breakdown.totalScore.toLocaleString()}
                </span>
              </motion.div>
            </div>
          </div>
        </Card>
      )}

      {/* Historical outcome */}
      {realOutcome && (
        <Card className="bg-amber-50 border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-2">Historical Outcome</h3>
          <p className="text-amber-700 text-sm">{realOutcome}</p>
        </Card>
      )}

      <Button onClick={onContinue} className="w-full" size="lg">
        Continue
      </Button>
    </motion.div>
  );
}
