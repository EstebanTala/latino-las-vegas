/**
 * "Abierto ahora" check based on listing hours.
 * Supports structured JSON (from WeeklyHoursEditor) and legacy free-text formats.
 */

import { formatStructuredHours } from "@/lib/formatHours";

const dayMap: Record<string, number> = {
  dom: 0, lun: 1, mar: 2, mié: 3, mie: 3, jue: 4, vie: 5, sáb: 6, sab: 6,
};

function currentDayIndex(): number {
  const now = new Date();
  const vegas = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  return vegas.getDay();
}

function currentVegasHour(): number {
  const now = new Date();
  const vegas = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  return vegas.getHours() + vegas.getMinutes() / 60;
}

function parseTime(t: string): number {
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (!m) return -1;
  let h = parseInt(m[1]);
  const min = m[2] ? parseInt(m[2]) : 0;
  const ampm = m[3].toLowerCase();
  if (ampm === "pm" && h !== 12) h += 12;
  if (ampm === "am" && h === 12) h = 0;
  return h + min / 60;
}

function dayInRange(day: number, startDay: string, endDay: string): boolean {
  const s = dayMap[startDay.toLowerCase()];
  const e = dayMap[endDay.toLowerCase()];
  if (s === undefined || e === undefined) return true;
  if (s <= e) return day >= s && day <= e;
  return day >= s || day <= e;
}

export function isOpenNow(hours?: string): boolean {
  if (!hours) return false;

  // Try structured JSON first (from WeeklyHoursEditor)
  const structured = formatStructuredHours(hours);
  if (structured) {
    return structured.isOpen;
  }

  // Fallback: legacy free-text parsing
  const h = hours.toLowerCase().trim();
  if (h.includes("24 horas")) return true;

  const segments = hours.split(",").map(s => s.trim());
  const now = currentVegasHour();
  const today = currentDayIndex();

  for (const seg of segments) {
    const lower = seg.toLowerCase();
    const match = lower.match(/([a-záéíóú]+)\s*[–-]\s*([a-záéíóú]+)\s+(\d{1,2}(?::\d{2})?\s*[ap]m)\s*[–-]\s*(\d{1,2}(?::\d{2})?\s*[ap]m)/);
    if (match) {
      const [, dayStart, dayEnd, timeStart, timeEnd] = match;
      if (!dayInRange(today, dayStart, dayEnd)) continue;
      const open = parseTime(timeStart);
      const close = parseTime(timeEnd);
      if (open < 0 || close < 0) return true;
      if (close > open) {
        if (now >= open && now < close) return true;
      } else {
        if (now >= open || now < close) return true;
      }
    }
  }

  return false;
}
