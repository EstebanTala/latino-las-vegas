/**
 * Format structured weekly hours JSON into human-readable Spanish.
 * Also provides "Abierto ahora" / "Cerrado" status.
 *
 * Expected JSON shape (from WeeklyHoursEditor):
 * { "lun": { "closed": false, "allDay": true, "open": "09:00", "close": "17:00", "open2": "...", "close2": "..." }, ... }
 */

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const DAY_LABELS: Record<string, string> = {
  mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom",
};

interface DayEntry {
  closed?: boolean;
  allDay?: boolean;
  open?: string;
  close?: string;
  open2?: string;
  close2?: string;
}

function to12h(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || "0", 10);
  const ampm = h >= 12 ? "pm" : "am";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return m > 0 ? `${h}:${m.toString().padStart(2, "0")} ${ampm}` : `${h} ${ampm}`;
}

function dayLabel(key: string): string {
  return DAY_LABELS[key] || key;
}

function rangeLabel(startIdx: number, endIdx: number): string {
  if (startIdx === endIdx) return dayLabel(DAY_KEYS[startIdx]);
  return `${dayLabel(DAY_KEYS[startIdx])}–${dayLabel(DAY_KEYS[endIdx])}`;
}

export interface FormattedHours {
  lines: string[];
  isOpen: boolean;
}

function formatTimeRange(entry: DayEntry): string {
  const r1 = `${to12h(entry.open || "0:00")} – ${to12h(entry.close || "0:00")}`;
  if (entry.open2 && entry.close2) {
    const r2 = `${to12h(entry.open2)} – ${to12h(entry.close2)}`;
    return `${r1}, ${r2}`;
  }
  return r1;
}

export function formatStructuredHours(hoursRaw: string | undefined): FormattedHours | null {
  if (!hoursRaw) return null;

  let parsed: Record<string, DayEntry>;
  try {
    parsed = JSON.parse(hoursRaw);
  } catch {
    return null;
  }

  const hasDayKeys = DAY_KEYS.some(k => k in parsed);
  if (!hasDayKeys) return null;

  // Build lines by grouping consecutive days with same schedule
  const lines: string[] = [];
  let i = 0;
  while (i < DAY_KEYS.length) {
    const key = DAY_KEYS[i];
    const entry = parsed[key] as DayEntry | undefined;
    const sig = entrySignature(entry);

    let j = i;
    while (j + 1 < DAY_KEYS.length && entrySignature(parsed[DAY_KEYS[j + 1]]) === sig) {
      j++;
    }

    const label = rangeLabel(i, j);
    if (!entry || entry.closed) {
      lines.push(`${label}: Cerrado`);
    } else if (entry.allDay) {
      lines.push(`${label}: Abierto 24 horas`);
    } else {
      lines.push(`${label}: ${formatTimeRange(entry)}`);
    }
    i = j + 1;
  }

  // Determine if open now (Las Vegas = America/Los_Angeles)
  const now = new Date();
  const vegasStr = now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  const vegas = new Date(vegasStr);
  const dayIdx = (vegas.getDay() + 6) % 7;
  const currentKey = DAY_KEYS[dayIdx];
  const todayEntry = parsed[currentKey] as DayEntry | undefined;

  let isOpen = false;
  if (todayEntry && !todayEntry.closed) {
    if (todayEntry.allDay) {
      isOpen = true;
    } else {
      const nowMinutes = vegas.getHours() * 60 + vegas.getMinutes();
      isOpen = isInRange(nowMinutes, todayEntry.open, todayEntry.close)
            || isInRange(nowMinutes, todayEntry.open2, todayEntry.close2);
    }
  }

  return { lines, isOpen };
}

function isInRange(nowMinutes: number, openStr?: string, closeStr?: string): boolean {
  if (!openStr || !closeStr) return false;
  const [oh, om] = openStr.split(":").map(Number);
  const [ch, cm] = closeStr.split(":").map(Number);
  const openMin = oh * 60 + (om || 0);
  const closeMin = ch * 60 + (cm || 0);
  if (closeMin > openMin) {
    return nowMinutes >= openMin && nowMinutes < closeMin;
  }
  // Overnight
  return nowMinutes >= openMin || nowMinutes < closeMin;
}

function entrySignature(entry: DayEntry | undefined): string {
  if (!entry || entry.closed) return "closed";
  if (entry.allDay) return "allDay";
  let sig = `${entry.open}-${entry.close}`;
  if (entry.open2 && entry.close2) sig += `|${entry.open2}-${entry.close2}`;
  return sig;
}
