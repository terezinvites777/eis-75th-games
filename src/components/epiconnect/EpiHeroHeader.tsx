// src/components/epiconnect/EpiHeroHeader.tsx
// Purple velvet hero header for EpiConnect

import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EpiHeroHeaderProps {
  title: string;
  subtitle?: string;
  backPath?: string;
  badge?: ReactNode;
  badgeVariant?: 'default' | 'online';
}

export function EpiHeroHeader({
  title,
  subtitle,
  backPath,
  badge,
  badgeVariant = 'default',
}: EpiHeroHeaderProps) {
  return (
    <header className="epi-hero">
      <div className="epi-hero__content">
        <div className="epi-hero__left">
          {backPath && (
            <Link to={backPath} className="epi-hero__back">
              <ArrowLeft size={20} />
            </Link>
          )}
          <div>
            <h1 className="epi-hero__title">{title}</h1>
            {subtitle && <p className="epi-hero__subtitle">{subtitle}</p>}
          </div>
        </div>
        {badge && (
          <div className={`epi-hero__badge ${badgeVariant === 'online' ? 'epi-hero__badge--online' : ''}`}>
            {badge}
          </div>
        )}
      </div>
    </header>
  );
}

export default EpiHeroHeader;
