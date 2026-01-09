// src/components/exhibit/ExhibitStagePlate.tsx
// Museum-grade cinematic phase plate for Disease Detective (and other games)
// Displays narrative background images with proper framing and bleed effects

import type { ReactNode, CSSProperties } from 'react';

type Props = {
  src: string;
  alt: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  badgeRight?: ReactNode;
  height?: 'sm' | 'md' | 'lg';
  /** Display mode: "bleed" paints blurred plate into page background, "framed" is a centered card */
  mode?: 'framed' | 'bleed';
  /** Show caption overlay (disable if image has baked-in text) */
  showCaption?: boolean;
  className?: string;
};

const HEIGHT: Record<NonNullable<Props['height']>, string> = {
  sm: 'h-[170px] md:h-[210px]',
  md: 'h-[210px] md:h-[270px]',
  lg: 'h-[250px] md:h-[330px]',
};

export function ExhibitStagePlate({
  src,
  alt,
  eyebrow,
  title,
  subtitle,
  badgeRight,
  height = 'md',
  mode = 'bleed',
  showCaption = true,
  className = '',
}: Props) {
  const hasCaption = showCaption && (eyebrow || title || subtitle || badgeRight);

  const sectionStyle: CSSProperties | undefined =
    mode === 'bleed' ? { ['--plate-url' as string]: `url(${src})` } : undefined;

  return (
    <section
      className={[
        'eis-stagePlate',
        mode === 'bleed' ? 'eis-stagePlate--bleed' : 'eis-stagePlate--framed',
        className,
      ].join(' ')}
      style={sectionStyle}
    >
      <div className={`eis-stagePlate__frame ${HEIGHT[height]}`}>
        <img
          src={src}
          alt={alt}
          className="eis-stagePlate__img"
          loading="eager"
          decoding="async"
        />
        <div className="eis-stagePlate__vignette" />

        {hasCaption && (
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
