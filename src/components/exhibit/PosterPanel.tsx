// src/components/exhibit/PosterPanel.tsx
// Museum exhibit panel component for the EIS 75th Anniversary Games

import { Link } from 'react-router-dom';
import type { ReactNode, CSSProperties, KeyboardEvent } from 'react';

type PosterVariant = 'poster' | 'posterCompact';

type PosterPanelProps = {
  number: number;
  title: string;
  subtitle?: string;
  description?: string;
  cta: string;
  onClick?: () => void;
  href?: string;
  bgImageUrl?: string;
  dataTheme?: 'detective' | 'command' | 'connect' | 'default';
  variant?: PosterVariant;
  autoCompactOnMobile?: boolean;
  children?: ReactNode;
};

export function PosterPanel(props: PosterPanelProps) {
  const {
    number,
    title,
    subtitle,
    description,
    cta,
    onClick,
    href,
    bgImageUrl,
    dataTheme = 'default',
    variant = 'poster',
    autoCompactOnMobile = true,
    children,
  } = props;

  const clickable = Boolean(href || onClick);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!clickable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  // Adds compact class if variant requests it, or if mobile auto-compact is enabled.
  // We do the mobile part with CSS media query, but this keeps a single "compact"
  // switch available for any situation (like denser hubs).
  const panelClass =
    'eis-posterPanel' +
    (variant === 'posterCompact' ? ' is-compact' : '') +
    (autoCompactOnMobile ? ' auto-compact' : '');

  const panelStyle: CSSProperties | undefined = bgImageUrl
    ? { '--panel-bg': `url("${bgImageUrl}")` } as CSSProperties
    : undefined;

  const content = (
    <div
      className={panelClass}
      data-theme={dataTheme}
      data-bg={bgImageUrl ? 'true' : 'false'}
      style={panelStyle}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="eis-posterInner">
        <div className="eis-posterHeader">
          <div className="eis-posterNum">{number}</div>
          <div>
            <h3 className="eis-posterTitle">{title}</h3>
            {subtitle ? <div className="eis-posterSubtitle">{subtitle}</div> : null}
          </div>
        </div>

        <div className="eis-posterBody">
          {description ? <p className="eis-posterDesc">{description}</p> : null}
          {children ? <div style={{ marginTop: 10 }}>{children}</div> : null}
        </div>

        <div className="eis-posterFooter">
          <button className="eis-posterCta" type="button">
            {cta}
          </button>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link to={href} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
}

export default PosterPanel;
