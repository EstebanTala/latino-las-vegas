/**
 * Check if a show listing has any performances scheduled for today (Las Vegas time).
 * Supports both one-off events (startDatetime) and recurring weekly schedules (hours JSON).
 */

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

interface DayEntry {
  closed?: boolean;
  allDay?: boolean;
  open?: string;
  close?: string;
}

function vegasNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
}

export function hasShowToday(startDatetime?: string, hoursRaw?: string): boolean {
  const vegas = vegasNow();
  const todayY = vegas.getFullYear();
  const todayM = vegas.getMonth();
  const todayD = vegas.getDate();

  // 1. Check one-off startDatetime
  if (startDatetime) {
    const start = new Date(startDatetime);
    if (
      start.getFullYear() === todayY &&
      start.getMonth() === todayM &&
      start.getDate() === todayD
    ) {
      return true;
    }
  }

  // 2. Check recurring weekly schedule
  if (hoursRaw) {
    try {
      const parsed: Record<string, DayEntry> = JSON.parse(hoursRaw);
      // Convert JS getDay() (0=Sun) to our key index (0=Mon)
      const dayIdx = (vegas.getDay() + 6) % 7;
      const todayKey = DAY_KEYS[dayIdx];
      const entry = parsed[todayKey];
      if (entry && !entry.closed && (entry.allDay || entry.open)) {
        return true;
      }
    } catch {
      // not structured JSON, ignore
    }
  }

  return false;
}
