// src/components/layout/ExhibitPlate.tsx
// Universal museum exhibit plate wrapper for all game pages

import type { ReactNode } from 'react';

type Tone = 'blue' | 'purple' | 'gold' | 'slate';

interface ExhibitPlateProps {
  title: string;
  subtitle?: string;
  plateArt?: string;
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

export function ExhibitPlate({
  title,
  subtitle,
  plateArt,
  tone = 'blue',
  children,
  className = '',
}: ExhibitPlateProps) {
  return (
    <div className={`exhibit-plate tone-${tone} ${className}`}>
      <div className="plate-header">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {plateArt && (
        <div className="plate-art">
          <img src={plateArt} alt="" />
        </div>
      )}

      <div className="plate-body">{children}</div>
    </div>
  );
}

export default ExhibitPlate;
