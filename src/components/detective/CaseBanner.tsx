// src/components/detective/CaseBanner.tsx
// Compact header strip for Disease Detective case pages

import type { ReactNode } from 'react';

type CaseBannerProps = {
  title: string;
  location?: string;
  imageUrl: string;
  phaseLabel?: string;
  timeLeft?: string;
  points?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  eraTag?: string;
  onBack?: () => void;
  rightSlot?: ReactNode;
};

export function CaseBanner({
  title,
  location,
  imageUrl,
  phaseLabel,
  timeLeft,
  points,
  difficulty,
  eraTag,
  onBack,
  rightSlot,
}: CaseBannerProps) {
  return (
    <header
      className="dd-caseBanner"
      style={{ '--dd-banner': `url(${imageUrl})` } as React.CSSProperties}
    >
      <div className="dd-caseBanner__bg" aria-hidden="true" />
      <div className="dd-caseBanner__scrim" aria-hidden="true" />

      <div className="dd-caseBanner__inner">
        <div className="dd-caseBanner__topRow">
          <button className="dd-caseBanner__back" onClick={onBack} type="button">
            ← Back
          </button>

          <div className="dd-caseBanner__meta">
            {eraTag && <span className="dd-chip">{eraTag}</span>}
            {difficulty && <span className="dd-chip dd-chip--muted">{difficulty}</span>}
            {phaseLabel && <span className="dd-chip dd-chip--gold">{phaseLabel}</span>}
          </div>

          <div className="dd-caseBanner__stats">
            {timeLeft && (
              <div className="dd-statMini">
                <div className="dd-statMini__label">Time</div>
                <div className="dd-statMini__value">{timeLeft}</div>
              </div>
            )}
            {typeof points === 'number' && (
              <div className="dd-statMini">
                <div className="dd-statMini__label">Points</div>
                <div className="dd-statMini__value">{points}</div>
              </div>
            )}
          </div>
        </div>

        <div className="dd-caseBanner__titleRow">
          <div className="dd-caseBanner__titles">
            <h1 className="dd-caseBanner__title">{title}</h1>
            {location && <p className="dd-caseBanner__subtitle">{location}</p>}
          </div>
          {rightSlot && <div className="dd-caseBanner__rightSlot">{rightSlot}</div>}
        </div>
      </div>
    </header>
  );
}

export default CaseBanner;
