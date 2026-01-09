// src/components/exhibit/PosterPanel.tsx
// Museum exhibit poster tile for the EIS 75th Anniversary Games
// Full-bleed image plates that look like physical museum displays

import { Link } from 'react-router-dom';
import type { ReactNode, CSSProperties } from 'react';

type PosterPanelProps = {
  number: number;
  title: string;
  subtitle?: string;
  description?: string;
  cta: string;
  href: string;
  bgImageUrl: string;
  dataTheme?: 'detective' | 'command' | 'connect' | 'default';
  className?: string;
  children?: ReactNode;
};

export function PosterPanel(props: PosterPanelProps) {
  const {
    number,
    title,
    subtitle,
    description,
    cta,
    href,
    bgImageUrl,
    dataTheme = 'default',
    className = '',
    children,
  } = props;

  const tileStyle: CSSProperties = {
    ['--poster-bg' as string]: `url("${bgImageUrl}")`,
  };

  return (
    <Link
      to={href}
      className={`posterTile ${className}`}
      data-theme={dataTheme}
      aria-label={`${number}. ${title}`}
      style={tileStyle}
    >
      {/* Full-bleed exhibit plate background */}
      <div className="posterTile__bg" />

      {/* Vignette for depth and text readability */}
      <div className="posterTile__vignette" />

      {/* Content overlay */}
      <div className="posterTile__content">
        {/* Gold medallion with number */}
        <div className="posterTile__badge">
          <span className="posterTile__badgeNum">{number}</span>
        </div>

        {/* Text block */}
        <div className="posterTile__text">
          <h3 className="posterTile__title">{title}</h3>
          {subtitle && <p className="posterTile__subtitle">{subtitle}</p>}
          {description && <p className="posterTile__desc">{description}</p>}
          {children}
        </div>

        {/* Brass CTA plaque */}
        <div className="posterTile__ctaRow">
          <span className="posterTile__cta">{cta}</span>
        </div>
      </div>
    </Link>
  );
}

export default PosterPanel;
