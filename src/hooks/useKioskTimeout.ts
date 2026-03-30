// src/hooks/useKioskTimeout.ts
// Monitors touch/click activity for kiosk auto-reset
// - After idleTimeout on results/score screen → reset to attract mode
// - After globalTimeout on any other screen → navigate to home page

import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseKioskTimeoutOptions {
  /** Seconds of inactivity before triggering onIdle (default: 15) */
  idleTimeout?: number;
  /** Seconds of inactivity before navigating home (default: 60) */
  globalTimeout?: number;
  /** Called when idle timeout fires (e.g., show attract mode) */
  onIdle?: () => void;
  /** Whether this is a results/score screen (uses shorter timeout) */
  isResultsScreen?: boolean;
  /** Disable the timeout (e.g., during active gameplay) */
  disabled?: boolean;
}

export function useKioskTimeout({
  idleTimeout = 15,
  globalTimeout = 60,
  onIdle,
  isResultsScreen = false,
  disabled = false,
}: UseKioskTimeoutOptions = {}) {
  const navigate = useNavigate();
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const globalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimers = useCallback(() => {
    if (disabled) return;

    // Clear existing timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (globalTimerRef.current) clearTimeout(globalTimerRef.current);

    // Set idle timer (short — for results screens)
    if (isResultsScreen && onIdle) {
      idleTimerRef.current = setTimeout(() => {
        onIdle();
      }, idleTimeout * 1000);
    }

    // Set global timer (long — navigate home)
    globalTimerRef.current = setTimeout(() => {
      navigate('/');
    }, globalTimeout * 1000);
  }, [disabled, isResultsScreen, onIdle, idleTimeout, globalTimeout, navigate]);

  useEffect(() => {
    if (disabled) return;

    const events = ['touchstart', 'mousedown', 'click', 'keydown'];

    const handleActivity = () => resetTimers();

    // Start timers
    resetTimers();

    // Listen for activity
    events.forEach(event => window.addEventListener(event, handleActivity, { passive: true }));

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (globalTimerRef.current) clearTimeout(globalTimerRef.current);
    };
  }, [disabled, resetTimers]);

  return { resetTimers };
}
