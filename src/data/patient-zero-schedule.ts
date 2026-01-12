// src/data/patient-zero-schedule.ts
// Conference-based clue release schedule for Patient Zero

// Conference dates: April 28 - May 2, 2026
// Clues release twice daily (morning and afternoon)
export const CONFERENCE_SCHEDULE = {
  start: new Date('2026-04-28T08:00:00-04:00'),
  end: new Date('2026-05-02T17:00:00-04:00'),
  clueSchedule: [
    { day: 1, time: 'am' as const, release: new Date('2026-04-28T09:00:00-04:00') },
    { day: 1, time: 'pm' as const, release: new Date('2026-04-28T14:00:00-04:00') },
    { day: 2, time: 'am' as const, release: new Date('2026-04-29T09:00:00-04:00') },
    { day: 2, time: 'pm' as const, release: new Date('2026-04-29T14:00:00-04:00') },
    { day: 3, time: 'am' as const, release: new Date('2026-04-30T09:00:00-04:00') },
    { day: 3, time: 'pm' as const, release: new Date('2026-04-30T14:00:00-04:00') },
  ],
  finalReveal: new Date('2026-05-01T15:00:00-04:00'),
};

// Dev mode flag - set to true to enable demo mode with manual day advancement
export const DEV_MODE = true;

/**
 * Get the current conference day (1-3)
 * In dev mode, this returns what the day would be based on schedule
 */
export function getCurrentDay(): number {
  if (DEV_MODE) return 1; // In dev mode, start at day 1

  const now = new Date();
  const daysSinceStart = Math.floor(
    (now.getTime() - CONFERENCE_SCHEDULE.start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.min(Math.max(daysSinceStart + 1, 1), 3);
}

/**
 * Check if a specific clue has been released
 */
export function isClueReleased(day: number, time: 'am' | 'pm'): boolean {
  if (DEV_MODE) return false; // In dev mode, clues are controlled manually

  const schedule = CONFERENCE_SCHEDULE.clueSchedule.find(
    s => s.day === day && s.time === time
  );
  if (!schedule) return false;
  return new Date() >= schedule.release;
}

/**
 * Get the next clue release time
 */
export function getNextClueRelease(): Date | null {
  if (DEV_MODE) return null;

  const now = new Date();
  const next = CONFERENCE_SCHEDULE.clueSchedule.find(s => s.release > now);
  return next?.release || null;
}

/**
 * Get time until the final reveal
 */
export function getTimeUntilReveal(): { hours: number; minutes: number; seconds: number } | null {
  const now = new Date();
  const reveal = CONFERENCE_SCHEDULE.finalReveal;
  if (now >= reveal) return null;

  const diff = reveal.getTime() - now.getTime();
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

/**
 * Get the release date for a specific clue
 */
export function getClueReleaseDate(day: number, time: 'am' | 'pm'): Date | null {
  const schedule = CONFERENCE_SCHEDULE.clueSchedule.find(
    s => s.day === day && s.time === time
  );
  return schedule?.release || null;
}

/**
 * Format a date for display
 */
export function formatReleaseDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
