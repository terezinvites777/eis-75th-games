import { motion, AnimatePresence } from 'framer-motion';
import type { ClueCard } from '../../utils/kiosk-detective-helpers';

interface ClueDetailModalProps {
  clue: ClueCard | null;
  onClose: () => void;
}

export function ClueDetailModal({ clue, onClose }: ClueDetailModalProps) {
  return (
    <AnimatePresence>
      {clue && (
        <motion.div
          className="kiosk-dd__modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="kiosk-dd__modal-card pinned"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="pinned__title">{clue.title}</h3>
            <div className="pinned__content" style={{ fontSize: 16, lineHeight: 1.7 }}>
              <p style={{ whiteSpace: 'pre-line' }}>{clue.content}</p>
              {clue.source && (
                <p style={{ opacity: 0.6, fontSize: 13, marginTop: 12 }}>
                  Source: {clue.source}
                </p>
              )}
            </div>
            <button className="kiosk-dd__modal-close" onClick={onClose}>
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
