// src/components/exhibit/OrnatePanel.tsx
// Parchment panel with brass frame and corner studs for museum exhibit look

import type { ReactNode } from 'react';

interface OrnatePanelProps {
  children: ReactNode;
  className?: string;
  pad?: 'sm' | 'md' | 'lg';
}

export function OrnatePanel({
  children,
  className = '',
  pad = 'md',
}: OrnatePanelProps) {
  return (
    <section className={`eis-ornatePanel eis-ornatePanel--${pad} ${className}`}>
      <div className="eis-ornatePanel__inner">
        {children}
      </div>
    </section>
  );
}

export default OrnatePanel;
