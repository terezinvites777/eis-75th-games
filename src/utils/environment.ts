// Detect whether we're running in Electron kiosk or a web browser
export const isElectron =
  typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron');

// Kiosk: aggressive timeouts for public kiosk auto-reset
// Web: relaxed timeouts for virtual attendees browsing at their own pace
export const IDLE_RESET_TIMEOUT = isElectron ? 90 : 300;   // seconds
export const ATTRACT_TIMEOUT = isElectron ? 45 : 120;       // seconds
