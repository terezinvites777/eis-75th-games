// src/components/exhibit/ExhibitStagePlate.tsx
// Full-width narrative phase plate for Disease Detective (and other games)
// Each phase of the game gets a cinematic background that sets the mood

import type { ReactNode, CSSProperties } from 'react';

type ExhibitStagePlateProps = {
  /** Public-path URL: /images/plates/detective/briefing.png */
  backgroundSrc: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional overlay content (buttons, titles, etc) */
  children?: ReactNode;
  /** Control max width of the plate */
  maxWidth?: number;
  /** Control the height of the plate */
  height?: number | 'auto';
  /** Additional CSS class */
  className?: string;
};

export function ExhibitStagePlate({
  backgroundSrc,
  alt,
  children,
  maxWidth = 1200,
  height = 280,
  className = '',
}: ExhibitStagePlateProps) {
  const plateStyle: CSSProperties = {
    maxWidth,
    ...(height !== 'auto' ? { minHeight: height } : {}),
  };

  return (
    <section className={`eis-stagePlate ${className}`} aria-label={alt}>
      <div className="eis-stagePlate__inner" style={plateStyle}>
        {/* Background image */}
        <img
          className="eis-stagePlate__img"
          src={backgroundSrc}
          alt={alt}
          loading="eager"
        />

        {/* Cinematic vignette overlay */}
        <div className="eis-stagePlate__vignette" />

        {/* Optional content overlay */}
        {children && (
          <div className="eis-stagePlate__overlay">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export default ExhibitStagePlate;
