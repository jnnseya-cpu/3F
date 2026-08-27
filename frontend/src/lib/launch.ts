/**
 * National launch — single source of truth for the date used by the homepage
 * countdown, the register page, and the footer. Change it here only.
 *
 * 4 January 2027, 00:00 Kinshasa time (UTC+1) — Journée des Martyrs.
 * In UTC that instant is 2027-01-03T23:00:00Z.
 */
export const LAUNCH_MS = Date.UTC(2027, 0, 3, 23, 0, 0);

/** French label, e.g. "4 janvier 2027". */
export const LAUNCH_LABEL_FR = '4 janvier 2027';

/** Short context line shown under the date. */
export const LAUNCH_CONTEXT_FR = 'Journée des Martyrs · heure de Kinshasa';

/** True once the launch instant has passed (client-side; uses device clock). */
export function hasLaunched(now: number = Date.now()): boolean {
  return now >= LAUNCH_MS;
}
