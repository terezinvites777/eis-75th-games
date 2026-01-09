// src/components/exhibit/ExhibitStagePlate.tsx
// Museum-grade cinematic phase plate for Disease Detective (and other games)
// Displays narrative background images with proper framing and caption overlays

import type { ReactNode } from 'react';

type Props = {
  src: string;
  alt: string;
  eyebrow?: string;     // small label above title
  title?: string;       // optional overlay title
  subtitle?: string;    // optional overlay subtitle
  badgeRight?: ReactNode; // optional chip/badge on right
  height?: 'sm' | 'md' | 'lg';
  className?: string;
};

const HEIGHT: Record<NonNullable<Props['height']>, string> = {
  sm: 'h-[180px] md:h-[220px]',
  md: 'h-[220px] md:h-[280px]',
  lg: 'h-[260px] md:h-[340px]',
};

export function ExhibitStagePlate({
  src,
  alt,
  eyebrow,
  title,
  subtitle,
  badgeRight,
  height = 'md',
  className = '',
}: Props) {
  return (
    <section className={`eis-stagePlate ${className}`}>
      <div className={`eis-stagePlate__frame ${HEIGHT[height]}`}>
        <img
          src={src}
          alt={alt}
          className="eis-stagePlate__img"
          loading="eager"
          decoding="async"
        />

        {/* vignette + readability */}
        <div className="eis-stagePlate__vignette" />

        {/* bottom caption band */}
        {(eyebrow || title || subtitle || badgeRight) && (
          <div className="eis-stagePlate__caption">
            <div className="min-w-0">
              {eyebrow && <div className="eis-stagePlate__eyebrow">{eyebrow}</div>}
              {title && <div className="eis-stagePlate__title">{title}</div>}
              {subtitle && <div className="eis-stagePlate__subtitle">{subtitle}</div>}
            </div>
            {badgeRight ? <div className="eis-stagePlate__badge">{badgeRight}</div> : null}
          </div>
        )}
      </div>
    </section>
  );
}

export default ExhibitStagePlate;
