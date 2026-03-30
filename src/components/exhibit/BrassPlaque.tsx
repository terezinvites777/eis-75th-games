// src/components/exhibit/BrassPlaque.tsx
// Brass museum plaque section header

import type { ReactNode } from 'react';

interface BrassPlaqueProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BrassPlaque({
  children,
  className = '',
  size = 'md',
}: BrassPlaqueProps) {
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <div className={`eis-brassPlaque ${className}`}>
      <span className={`eis-brassPlaque__text ${sizes[size]}`}>
        {children}
      </span>
    </div>
  );
}

export default BrassPlaque;
