// src/components/detective/DetectiveGameShell.tsx
// Main wrapper for Disease Detective pages - archive/case file aesthetic

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../../styles/detective-theme.css';

interface DetectiveGameShellProps {
  title: string;
  subtitle?: string;
  stageImageUrl?: string;
  children: ReactNode;
  headerRight?: ReactNode;
  statusStrip?: ReactNode;
  backPath?: string;
}

export function DetectiveGameShell({
  title,
  subtitle,
  stageImageUrl,
  headerRight,
  statusStrip,
  backPath,
  children,
}: DetectiveGameShellProps) {
  return (
    <div data-theme="detective" className="detective-bg">
      <div className="detective-shell">
        {/* Back button + title area */}
        <div className="mb-4">
          {backPath && (
            <Link
              to={backPath}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-3 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
          )}

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="detective-title text-2xl sm:text-3xl font-bold">
                {title}
              </h1>
              {subtitle && (
                <p className="detective-subtitle mt-1 text-sm sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>
            {headerRight && (
              <div className="shrink-0">{headerRight}</div>
            )}
          </div>
        </div>

        {/* Stage plate (banner image) */}
        {stageImageUrl && (
          <div className="stage-plate">
            <div className="stage-plate-inner">
              <img
                src={stageImageUrl}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </div>
        )}

        {/* Status strip */}
        {statusStrip && (
          <div className="status-strip">{statusStrip}</div>
        )}

        {/* Main content */}
        <div className="mt-2">{children}</div>
      </div>

      {/* Bottom navigation spacer */}
      <div className="h-20" />
    </div>
  );
}

export default DetectiveGameShell;
