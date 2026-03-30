import { motion, AnimatePresence } from 'framer-motion';
import type { ClueCard } from '../../utils/kiosk-detective-helpers';

interface RevealConfirmProps {
  clue: ClueCard | null;
  availablePoints: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RevealConfirm({ clue, availablePoints, onConfirm, onCancel }: RevealConfirmProps) {
  const canAfford = clue ? availablePoints >= clue.pointCost : false;

  return (
    <AnimatePresence>
      {clue && (
        <motion.div
          className="kiosk-dd__confirm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="kiosk-dd__confirm-card"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <p>Reveal <strong>{clue.title}</strong>?</p>
            <p className="kiosk-dd__confirm-cost">&minus;{clue.pointCost} points</p>
            {!canAfford && (
              <p style={{ color: '#c9302c', fontSize: 14 }}>Not enough points!</p>
            )}
            <div className="kiosk-dd__confirm-actions">
              <button
                className="kiosk-dd__confirm-yes"
                onClick={onConfirm}
                disabled={!canAfford}
                style={!canAfford ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
              >
                Yes, Reveal
              </button>
              <button className="kiosk-dd__confirm-no" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
