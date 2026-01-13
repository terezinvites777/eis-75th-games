// src/components/epiconnect/EpiExhibitCard.tsx
// Museum-grade card chrome for EpiConnect

import type { ReactNode } from 'react';

interface EpiExhibitCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'feature' | 'muted';
  interactive?: boolean;
  onClick?: () => void;
}

export function EpiExhibitCard({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  onClick,
}: EpiExhibitCardProps) {
  const variantClass = {
    default: 'epi-card',
    feature: 'epi-card epi-card--feature',
    muted: 'epi-card epi-card--muted',
  }[variant];

  const interactiveClass = interactive ? 'epi-card--interactive' : '';

  return (
    <div
      className={`${variantClass} ${interactiveClass} ${className}`}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
}

interface EpiCardHeaderProps {
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EpiCardHeader({ children, icon, action }: EpiCardHeaderProps) {
  return (
    <div className="epi-card__header">
      <div className="epi-card__title">
        {icon && <span className="epi-card__title-icon">{icon}</span>}
        {children}
      </div>
      {action}
    </div>
  );
}

export default EpiExhibitCard;
