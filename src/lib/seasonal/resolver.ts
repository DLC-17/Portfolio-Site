import { DateBoundary, SeasonalEventConfig, SeasonalEventId } from "./types";
import { SEASONAL_EVENTS } from "./config";

/**
 * Checks whether a given date falls within the start and end month/day boundaries.
 * Correctly accounts for year-wrapping boundaries (e.g., Dec 1 - Feb 28, or Dec 30 - Jan 3).
 */
export function isDateInRange(date: Date, start: DateBoundary, end: DateBoundary): boolean {
  const month = date.getMonth() + 1; // 1-indexed
  const day = date.getDate();

  const currentVal = month * 100 + day;
  const startVal = start.month * 100 + start.day;
  const endVal = end.month * 100 + end.day;

  if (startVal <= endVal) {
    // Standard range within the same calendar year (e.g., Mar 1 - May 31)
    return currentVal >= startVal && currentVal <= endVal;
  } else {
    // Year-wrapping range (e.g., Dec 1 - Feb 28 or Dec 30 - Jan 3)
    return currentVal >= startVal || currentVal <= endVal;
  }
}

/**
 * Checks URL search params for developer testing override (e.g., ?season=winter or ?holiday=halloween).
 * Only executes in client environment.
 */
export function getOverrideEventId(): SeasonalEventId | null {
  if (typeof window === "undefined") return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const override = (params.get("season") || params.get("holiday"))?.toLowerCase() as SeasonalEventId | undefined;

    if (override && SEASONAL_EVENTS.some((e) => e.id === override)) {
      return override;
    }
  } catch {
    // Safe fallback if URL parsing fails
  }

  return null;
}

/**
 * Resolves the currently active seasonal event based on either URL developer overrides
 * or the active calendar date (with holidays prioritized over seasons).
 */
export function resolveActiveEvent(customDate?: Date): {
  event: SeasonalEventConfig | null;
  isOverridden: boolean;
} {
  // 1. Check for developer override via URL parameter (?season=... / ?holiday=...)
  const overrideId = getOverrideEventId();
  if (overrideId) {
    const matched = SEASONAL_EVENTS.find((e) => e.id === overrideId);
    if (matched) {
      return { event: matched, isOverridden: true };
    }
  }

  // 2. Resolve by date (sorted by priority descending so holidays take precedence)
  const now = customDate ?? new Date();
  const sorted = [...SEASONAL_EVENTS].sort((a, b) => b.priority - a.priority);

  for (const candidate of sorted) {
    if (isDateInRange(now, candidate.start, candidate.end)) {
      return { event: candidate, isOverridden: false };
    }
  }

  return { event: null, isOverridden: false };
}
