// src/components/kiosk/KioskIdleReset.tsx
// Global wrapper: navigates to home after 90s of inactivity on any game page

import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface KioskIdleResetProps {
  children: ReactNode;
  /** Seconds of inactivity before returning to home (default: 90) */
  timeout?: number;
}

export function KioskIdleReset({ children, timeout = 90 }: KioskIdleResetProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't auto-reset on home page (attract mode handles that)
    if (location.pathname === '/') return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        navigate('/');
      }, timeout * 1000);
    };

    const events = ['touchstart', 'mousedown', 'click', 'keydown'];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname, timeout, navigate]);

  return <>{children}</>;
}
