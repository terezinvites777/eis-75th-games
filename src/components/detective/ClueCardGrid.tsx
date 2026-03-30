import { Eye, Lock } from 'lucide-react';
import type { ClueCard } from '../../utils/kiosk-detective-helpers';
import { truncate } from '../../utils/kiosk-detective-helpers';

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
          <div className="kiosk-dd__clue-card-icon">
            {card.isRevealed ? <Eye size={28} /> : <Lock size={28} />}
          </div>
          <div className="kiosk-dd__clue-card-title">{card.title}</div>
          {!card.isRevealed && (
            <div className="kiosk-dd__clue-card-cost">
              Tap to Reveal &bull; {card.pointCost} pts
            </div>
          )}
          {card.isRevealed && (
            <div className="kiosk-dd__clue-card-peek">
              {truncate(card.content, 60)}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
