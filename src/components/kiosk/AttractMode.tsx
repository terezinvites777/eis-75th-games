// src/components/kiosk/AttractMode.tsx
// Full-screen attract overlay for kiosk idle state
// Shows "TAP TO PLAY" on first launch and after extended inactivity
// Back/Home navigation skips attract — only idle triggers it

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { isElectron } from '../../utils/environment';

// Module-level: tracks whether the app has been interacted with at least once
let hasBeenDismissedOnce = false;

interface AttractModeProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  /** Seconds of inactivity before attract screen shows (default: 45) */
  timeout?: number;
  onStart?: () => void;
}

export function AttractMode({
  children,
  title,
  subtitle,
  timeout = 45,
  onStart,
}: AttractModeProps) {
  // Only show attract on very first load — not on back-navigation
  const [isAttract, setIsAttract] = useState(!hasBeenDismissedOnce);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-attract after timeout of inactivity (only when not currently showing)
  useEffect(() => {
    if (isAttract) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsAttract(true);
      }, timeout * 1000);
    };

    const events = ['touchstart', 'mousedown', 'click', 'keydown'];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAttract, timeout]);

  const handleDismiss = () => {
    setIsAttract(false);
    hasBeenDismissedOnce = true;
    onStart?.();
  };

  if (!isAttract) {
    return <>{children}</>;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 cursor-pointer"
      onClick={handleDismiss}
      onTouchStart={handleDismiss}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-teal-500/10 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 text-center px-8">
        <div className="mb-8">
          <img src="./images/eis-logo.png" alt="EIS Logo" className="w-24 h-24 mx-auto object-contain mb-4" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-3" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
          {title}
        </h1>
        {subtitle && <p className="text-xl text-white/70 mb-12">{subtitle}</p>}
        <div className="animate-pulse">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-10 py-5">
            <span className="text-2xl font-bold text-white tracking-wide">{isElectron ? 'TAP TO PLAY' : 'CLICK TO START'}</span>
          </div>
        </div>
        <p className="mt-12 text-sm text-white/40">EIS 75th Anniversary — Disease Detective Games</p>
      </div>
    </div>
  );
}
