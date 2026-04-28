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
  /**
   * If true, renders an <a> tag for navigation outside the React Router app
   * (e.g. linking to a static HTML page in /public). Defaults to false,
   * which uses React Router's <Link> for in-app navigation.
   */
  external?: boolean;
};

export function PosterPanel(props: PosterPanelProps) {
  const {
    number,
    title,
    subtitle,
    description,
    href,
    bgImageUrl,
    dataTheme = 'default',
    className = '',
    children,
    external = false,
  } = props;

  const bgStyle: CSSProperties = {
    backgroundImage: `url("${bgImageUrl}")`,
  };

  const innerContent = (
    <>
      {/* Full-bleed exhibit plate background */}
      <div className="posterTile__bg" style={bgStyle} />

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

      </div>
    </>
  );

  // External link: full page navigation (used for static HTML pages in /public)
  if (external) {
    return (
      <a
        href={href}
        className={`posterTile ${className}`}
        data-theme={dataTheme}
        aria-label={`${number}. ${title}`}
      >
        {innerContent}
      </a>
    );
  }

  // Internal route: React Router navigation
  return (
    <Link
      to={href}
      className={`posterTile ${className}`}
      data-theme={dataTheme}
      aria-label={`${number}. ${title}`}
    >
      {innerContent}
    </Link>
  );
}

export default PosterPanel;
