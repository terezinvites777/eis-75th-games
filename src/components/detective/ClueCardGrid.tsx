import { Eye, Lock } from 'lucide-react';
import type { ClueCard } from '../../utils/kiosk-detective-helpers';

interface ClueCardGridProps {
  cards: ClueCard[];
  onTapLocked: (card: ClueCard) => void;
  onTapRevealed: (card: ClueCard) => void;
}

export function ClueCardGrid({ cards, onTapLocked, onTapRevealed }: ClueCardGridProps) {
  return (
    <div className="kiosk-dd__evidence-grid">
      {cards.map(card => (
        <button
          key={card.id}
          className={`kiosk-dd__clue-card ${card.isRevealed ? 'revealed' : 'locked'}`}
          onClick={() => card.isRevealed ? onTapRevealed(card) : onTapLocked(card)}
        >
          {!card.isRevealed && (
            <>
              <div className="kiosk-dd__clue-card-icon">
                <Lock size={28} />
              </div>
              <div className="kiosk-dd__clue-card-title">{card.title}</div>
              <div className="kiosk-dd__clue-card-cost">
                Tap to Reveal &bull; {card.pointCost} pts
              </div>
            </>
          )}
          {card.isRevealed && (
            <>
              <div className="kiosk-dd__clue-card-header">
                <Eye size={16} className="kiosk-dd__clue-card-header-icon" />
                <span className="kiosk-dd__clue-card-title">{card.title}</span>
              </div>
              <div className="kiosk-dd__clue-card-evidence">
                {card.content}
              </div>
              {card.source && (
                <div className="kiosk-dd__clue-card-source">
                  Source: {card.source}
                </div>
              )}
            </>
          )}
        </button>
      ))}
    </div>
  );
}
