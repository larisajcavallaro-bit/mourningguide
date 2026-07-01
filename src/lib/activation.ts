// Central configuration for the death-activation lifecycle.
//
// When a legacy contact activates a guide, we do NOT send anything immediately.
// We open a *cancel window* during which the activation can be undone (in case
// it was triggered by mistake while the person is still alive). Once the window
// closes, a cron job processes the activation: releasing letters and notifying
// contacts in phased order.

/** How long the legacy contact can cancel an activation before anything is sent. */
export const CANCEL_WINDOW_HOURS = 24;

/** Delayed letters go out this long after the activation completes. */
export const DELAYED_LETTER_DAYS = 30;

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/**
 * Hours (from activation completion) after which each notification phase is sent.
 * `manual` is never auto-sent — the family reaches out by hand.
 */
export const NOTIFY_PHASE_OFFSET_HOURS: Record<string, number | null> = {
  inner_circle: 0,
  financial_only: 0,
  close_family: 6,
  community: 24,
  manual: null,
};

export function cancelWindowExpiry(from: Date = new Date()): Date {
  return new Date(from.getTime() + CANCEL_WINDOW_HOURS * HOUR);
}

export function delayedLetterReleaseAt(from: Date = new Date()): Date {
  return new Date(from.getTime() + DELAYED_LETTER_DAYS * DAY);
}

/**
 * When a given notification phase should be sent, measured from `completedAt`.
 * Returns null for `manual` (never auto-sent).
 */
export function scheduledNotifyAt(phase: string | null, completedAt: Date): Date | null {
  const offset = NOTIFY_PHASE_OFFSET_HOURS[phase ?? 'manual'];
  if (offset === null || offset === undefined) return null;
  return new Date(completedAt.getTime() + offset * HOUR);
}
