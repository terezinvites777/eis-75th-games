// src/components/detective/ParchmentPanel.tsx
// Reusable parchment-styled panel for Disease Detective pages

import type { ReactNode } from 'react';

interface ParchmentPanelProps {
  title?: string;
  icon?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  showPins?: boolean;
}

export function ParchmentPanel({
  title,
  icon,
  right,
  children,
  className = '',
  showPins = false,
}: ParchmentPanelProps) {
  return (
    <section className={`parchment-panel ${className}`}>
      {/* Optional corner pins */}
      {showPins && (
        <>
          <div className="panel-pin top-left" />
          <div className="panel-pin top-right" />
          <div className="panel-pin bottom-left" />
          <div className="panel-pin bottom-right" />
        </>
      )}

      {/* Header with title plaque and optional right content */}
      {(title || right) && (
        <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          {title ? (
            <div className="section-plaque">
              {icon && <span>{icon}</span>}
              <span>{title}</span>
            </div>
          ) : (
            <div />
          )}
          {right && (
            <div className="flex items-center gap-2">{right}</div>
          )}
        </div>
      )}

      {/* Panel content */}
      <div className="panel-text">{children}</div>
    </section>
  );
}

export default ParchmentPanel;
