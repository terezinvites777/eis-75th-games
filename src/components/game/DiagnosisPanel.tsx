import { motion } from 'framer-motion';
import { Check, AlertTriangle } from 'lucide-react';
import { DiagnosisOption } from '../../types/game';
import { Button } from '../ui/Button';

interface DiagnosisPanelProps {
  options: DiagnosisOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  result?: 'correct' | 'incorrect' | null;
}

export function DiagnosisPanel({
  options,
  selectedId,
  onSelect,
  onSubmit,
  isSubmitting,
  result,
}: DiagnosisPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-800">What's your diagnosis?</h3>

      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selectedId === option.id;
          const showCorrect = result && option.isCorrect;
          const showIncorrect = result === 'incorrect' && isSelected && !option.isCorrect;

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !result && onSelect(option.id)}
              disabled={!!result}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                showCorrect
                  ? 'border-green-500 bg-green-50'
                  : showIncorrect
                  ? 'border-red-500 bg-red-50'
                  : isSelected
                  ? 'border-cdc-blue bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              } ${result ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    showCorrect
                      ? 'border-green-500 bg-green-500 text-white'
                      : showIncorrect
                      ? 'border-red-500 bg-red-500 text-white'
                      : isSelected
                      ? 'border-cdc-blue bg-cdc-blue'
                      : 'border-gray-300'
                  }`}
                >
                  {(showCorrect || (isSelected && !result)) && <Check size={12} />}
                  {showIncorrect && <AlertTriangle size={12} />}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{option.name}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {!result && (
        <Button
          onClick={onSubmit}
          disabled={!selectedId || isSubmitting}
          isLoading={isSubmitting}
          className="w-full"
          size="lg"
        >
          Submit Diagnosis
        </Button>
      )}
    </div>
  );
}
