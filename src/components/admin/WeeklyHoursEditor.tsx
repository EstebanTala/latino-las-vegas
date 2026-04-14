"use client";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Copy, Plus, X, ToggleLeft } from "lucide-react";
import { useState } from "react";

const DAYS = [
  { key: "mon", label: "Lun" },
  { key: "tue", label: "Mar" },
  { key: "wed", label: "Mié" },
  { key: "thu", label: "Jue" },
  { key: "fri", label: "Vie" },
  { key: "sat", label: "Sáb" },
  { key: "sun", label: "Dom" },
] as const;

type DayKey = typeof DAYS[number]["key"];

export interface DayHours {
  closed: boolean;
  allDay: boolean;
  open: string;
  close: string;
  open2?: string;
  close2?: string;
}

export type WeeklyHours = Record<DayKey, DayHours>;

export function emptyWeeklyHours(): WeeklyHours {
  const result = {} as WeeklyHours;
  for (const d of DAYS) {
    result[d.key] = { closed: false, allDay: false, open: "09:00", close: "21:00", open2: "", close2: "" };
  }
  return result;
}

export function weeklyHoursToJson(wh: WeeklyHours): Record<string, any> {
  const result: Record<string, any> = {};
  for (const d of DAYS) {
    const day = wh[d.key];
    if (day.closed) {
      result[d.key] = { closed: true };
    } else if (day.allDay) {
      result[d.key] = { closed: false, open: "00:00", close: "23:59", allDay: true };
    } else {
      const entry: Record<string, any> = { closed: false, open: day.open, close: day.close };
      if (day.open2 && day.close2) {
        entry.open2 = day.open2;
        entry.close2 = day.close2;
      }
      result[d.key] = entry;
    }
  }
  return result;
}

export function jsonToWeeklyHours(json: Record<string, any>): WeeklyHours {
  const result = emptyWeeklyHours();
  for (const d of DAYS) {
    const val = json[d.key];
    if (!val) continue;
    result[d.key] = {
      closed: val.closed ?? false,
      allDay: val.allDay ?? false,
      open: val.open ?? "09:00",
      close: val.close ?? "21:00",
      open2: val.open2 ?? "",
      close2: val.close2 ?? "",
    };
  }
  return result;
}

const WEEKDAYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri"];
const WEEKEND: DayKey[] = ["sat", "sun"];
const ALL_DAYS: DayKey[] = DAYS.map(d => d.key);

interface Props {
  value: WeeklyHours;
  onChange: (val: WeeklyHours) => void;
}

export default function WeeklyHoursEditor({ value, onChange }: Props) {
  const [showCopyPrompt, setShowCopyPrompt] = useState(false);
  const [bulkOpen, setBulkOpen] = useState("09:00");
  const [bulkClose, setBulkClose] = useState("21:00");
  const [selected, setSelected] = useState<Set<DayKey>>(new Set());

  const toggleDay = (key: DayKey) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const selectPresetDays = (days: DayKey[]) => {
    setSelected(new Set(days));
  };

  const update = (day: DayKey, patch: Partial<DayHours>) => {
    const next = { ...value, [day]: { ...value[day], ...patch } };
    onChange(next);

    if (day === "mon" && (patch.open || patch.close) && !value.mon.closed && !value.mon.allDay) {
      setShowCopyPrompt(true);
    }
  };

  const applyToDays = (days: DayKey[], hours: Partial<DayHours>) => {
    const next = { ...value };
    for (const k of days) next[k] = { ...next[k], ...hours };
    onChange(next);
  };

  const copyMonToAll = () => {
    const m = value.mon;
    applyToDays(ALL_DAYS, { closed: m.closed, allDay: m.allDay, open: m.open, close: m.close, open2: m.open2, close2: m.close2 });
    setShowCopyPrompt(false);
  };

  const applyPreset = (preset: "all" | "weekdays" | "weekend" | "24h") => {
    const days = preset === "weekdays" ? WEEKDAYS : preset === "weekend" ? WEEKEND : ALL_DAYS;
    if (preset === "24h") {
      applyToDays(selected.size > 0 ? [...selected] : ALL_DAYS, { closed: false, allDay: true, open: "00:00", close: "23:59" });
    } else {
      selectPresetDays(days);
    }
  };

  const toggleAllClosed = (closed: boolean) => {
    const days = selected.size > 0 ? [...selected] : ALL_DAYS;
    applyToDays(days, { closed, allDay: false });
  };

  const applyBulkTimes = () => {
    const days = selected.size > 0 ? [...selected] : ALL_DAYS;
    applyToDays(days, { open: bulkOpen, close: bulkClose, closed: false, allDay: false });
    setSelected(new Set());
  };

  const hasSplit = (day: DayHours) => !!(day.open2 || day.close2);

  const addSplit = (key: DayKey) => {
    update(key, { open2: "17:00", close2: "22:00" });
  };

  const removeSplit = (key: DayKey) => {
    update(key, { open2: "", close2: "" });
  };

  const allClosed = ALL_DAYS.every(k => value[k].closed);

  return (
    <div className="space-y-4 rounded-lg border border-border p-4 bg-card">
      {/* Day selector chips */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Selecciona días para aplicar horario en lote:</p>
        <div className="flex flex-wrap gap-2">
          {DAYS.map(d => (
            <button
              key={d.key}
              type="button"
              onClick={() => toggleDay(d.key)}
              className={`h-8 px-4 rounded-full text-xs font-semibold border-2 transition-all ${
                selected.has(d.key)
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk controls */}
      {selected.size > 0 && (
        <div className="rounded-lg bg-muted/40 border border-border p-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">
              {selected.size} día{selected.size > 1 ? "s" : ""} seleccionado{selected.size > 1 ? "s" : ""}
            </p>
            <button type="button" onClick={() => setSelected(new Set())} className="text-[11px] text-muted-foreground hover:text-foreground underline">
              Limpiar
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Input type="time" value={bulkOpen} onChange={e => setBulkOpen(e.target.value)} className="h-9 text-sm w-[120px]" />
              <span className="text-sm text-muted-foreground">–</span>
              <Input type="time" value={bulkClose} onChange={e => setBulkClose(e.target.value)} className="h-9 text-sm w-[120px]" />
            </div>
            <Button type="button" variant="default" size="sm" className="h-9 px-4 text-sm" onClick={applyBulkTimes}>
              Aplicar
            </Button>
            <Button type="button" variant="outline" size="sm" className="h-9 text-sm" onClick={() => toggleAllClosed(!allClosed)}>
              <ToggleLeft className="h-3.5 w-3.5 mr-1.5" />
              {allClosed ? "Abrir" : "Cerrar"}
            </Button>
          </div>
        </div>
      )}

      {/* Copy prompt */}
      {showCopyPrompt && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20 border border-accent text-sm">
          <span className="flex-1">¿Aplicar horario de Lunes a todos los días?</span>
          <Button type="button" size="sm" className="h-7" onClick={copyMonToAll}>Sí</Button>
          <Button type="button" variant="ghost" size="sm" className="h-7" onClick={() => setShowCopyPrompt(false)}>No</Button>
        </div>
      )}

      {/* Schedule grid */}
      <div className="space-y-0.5">
        {/* Header */}
        <div className="grid grid-cols-[56px_50px_50px_1fr_1fr_36px] gap-x-3 gap-y-0 px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>Día</span>
          <span className="text-center">Cerr.</span>
          <span className="text-center">24h</span>
          <span>Abre</span>
          <span>Cierra</span>
          <span></span>
        </div>

        {DAYS.map((d, i) => {
          const day = value[d.key];
          const isSel = selected.has(d.key);
          const showSplit = hasSplit(day);
          const canSplit = !day.closed && !day.allDay;

          return (
            <div key={d.key} className={`rounded-md transition-colors ${isSel ? "bg-primary/8" : "hover:bg-muted/30"}`}>
              {/* Main row */}
              <div className="grid grid-cols-[56px_50px_50px_1fr_1fr_36px] gap-x-3 gap-y-0 items-center py-1.5 px-2">
                <button
                  type="button"
                  onClick={() => toggleDay(d.key)}
                  className={`text-sm font-semibold text-left transition-colors ${
                    isSel ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {d.label}
                </button>
                <div className="flex justify-center">
                  <Checkbox checked={day.closed} onCheckedChange={(v) => update(d.key, { closed: !!v, allDay: false })} />
                </div>
                <div className="flex justify-center">
                  <Checkbox checked={day.allDay} disabled={day.closed} onCheckedChange={(v) => update(d.key, { allDay: !!v })} />
                </div>
                <Input type="time" value={day.open} disabled={day.closed || day.allDay} onChange={e => update(d.key, { open: e.target.value })} className="h-8 text-sm" />
                <Input type="time" value={day.close} disabled={day.closed || day.allDay} onChange={e => update(d.key, { close: e.target.value })} className="h-8 text-sm" />
                <div className="flex justify-center gap-0.5">
                  {i === 0 && (
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Copiar a todos" onClick={copyMonToAll}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                  {canSplit && !showSplit && (
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Agregar 2do horario" onClick={() => addSplit(d.key)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Second range sub-row */}
              {showSplit && canSplit && (
                <div className="grid grid-cols-[56px_50px_50px_1fr_1fr_36px] gap-x-3 gap-y-0 items-center pb-1.5 px-2">
                  <span className="text-[10px] text-muted-foreground text-right pr-1">2do</span>
                  <span />
                  <span />
                  <Input type="time" value={day.open2 || ""} onChange={e => update(d.key, { open2: e.target.value })} className="h-8 text-sm" />
                  <Input type="time" value={day.close2 || ""} onChange={e => update(d.key, { close2: e.target.value })} className="h-8 text-sm" />
                  <div className="flex justify-center">
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" title="Quitar 2do horario" onClick={() => removeSplit(d.key)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
