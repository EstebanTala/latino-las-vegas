"use client";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DAYS = [
  { key: "mon", label: "Lunes" },
  { key: "tue", label: "Martes" },
  { key: "wed", label: "Miércoles" },
  { key: "thu", label: "Jueves" },
  { key: "fri", label: "Viernes" },
  { key: "sat", label: "Sábado" },
  { key: "sun", label: "Domingo" },
] as const;

export type ShowSchedule = Record<string, string[]>;

export function emptyShowSchedule(): ShowSchedule {
  return Object.fromEntries(DAYS.map(d => [d.key, []]));
}

/** Convert show schedule to the hours JSON format used by the app */
export function showScheduleToHoursJson(schedule: ShowSchedule): Record<string, any> {
  const result: Record<string, any> = {};
  for (const day of DAYS) {
    const times = schedule[day.key] || [];
    if (times.length === 0) {
      result[day.key] = { closed: true };
    } else {
      // Use first time as open, add 2h for close; second time as open2
      const entry: Record<string, any> = { closed: false };
      entry.open = times[0];
      entry.close = addHours(times[0], 2);
      if (times.length > 1) {
        entry.open2 = times[1];
        entry.close2 = addHours(times[1], 2);
      }
      result[day.key] = entry;
    }
  }
  return result;
}

/** Parse hours JSON back into a ShowSchedule */
export function hoursJsonToShowSchedule(json: Record<string, any>): ShowSchedule {
  const schedule: ShowSchedule = {};
  for (const day of DAYS) {
    const entry = json[day.key];
    if (!entry || entry.closed) {
      schedule[day.key] = [];
    } else {
      const times: string[] = [];
      if (entry.open) times.push(entry.open);
      if (entry.open2) times.push(entry.open2);
      schedule[day.key] = times;
    }
  }
  return schedule;
}

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);
  const newH = (h + hours) % 24;
  return `${newH.toString().padStart(2, "0")}:${(m || 0).toString().padStart(2, "0")}`;
}

function formatTimeDisplay(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || "0", 10);
  const ampm = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return m > 0 ? `${h}:${m.toString().padStart(2, "0")} ${ampm}` : `${h}:00 ${ampm}`;
}

interface Props {
  value: ShowSchedule;
  onChange: (val: ShowSchedule) => void;
}

export default function ShowTimesEditor({ value, onChange }: Props) {
  const update = (dayKey: string, times: string[]) => {
    onChange({ ...value, [dayKey]: times });
  };

  const addTime = (dayKey: string) => {
    const current = value[dayKey] || [];
    if (current.length >= 4) return; // max 4 times per day
    update(dayKey, [...current, "19:00"]);
  };

  const removeTime = (dayKey: string, idx: number) => {
    const current = [...(value[dayKey] || [])];
    current.splice(idx, 1);
    update(dayKey, current);
  };

  const setTime = (dayKey: string, idx: number, val: string) => {
    const current = [...(value[dayKey] || [])];
    current[idx] = val;
    update(dayKey, current);
  };

  return (
    <div className="space-y-3">
      {DAYS.map(day => {
        const times = value[day.key] || [];
        return (
          <div key={day.key} className="flex items-start gap-3">
            <div className="w-24 shrink-0 pt-2 text-[13px] font-medium text-foreground/80">
              {day.label}
            </div>
            <div className="flex flex-wrap items-center gap-2 flex-1 min-h-[36px]">
              {times.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-lg border border-border bg-foreground/[0.02] px-2 py-1"
                >
                  <Input
                    type="time"
                    value={t}
                    onChange={e => setTime(day.key, i, e.target.value)}
                    className="h-7 w-[110px] border-0 bg-transparent p-0 text-[13px] focus-visible:ring-0"
                  />
                  <span className="text-[11px] text-muted-foreground/60">
                    {formatTimeDisplay(t)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTime(day.key, i)}
                    className="ml-0.5 text-muted-foreground/40 hover:text-destructive transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {times.length === 0 && (
                <span className="text-[12px] text-muted-foreground/40 italic">Sin funciones</span>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addTime(day.key)}
                className="h-7 px-2 text-[12px] text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Añadir
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
