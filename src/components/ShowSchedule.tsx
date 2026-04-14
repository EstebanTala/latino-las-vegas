"use client";
import { useState, useMemo, useCallback } from "react";
import { Calendar, Clock, ChevronDown, ExternalLink } from "lucide-react";
import type { Listing } from "@/data/listings";
import { formatStructuredHours } from "@/lib/formatHours";

interface Props {
  listing: Listing;
  allShowListings: Listing[];
  onTimeSelect?: (time: string | null, ticketUrl: string | null) => void;
}

/* ── Vegas timezone ── */
function vegasNow(): Date {
  const str = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
  return new Date(str);
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatTime(d: Date): string {
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return m > 0 ? `${h}:${m.toString().padStart(2, "0")} ${ampm}` : `${h}:00 ${ampm}`;
}

function formatDayLabel(date: Date, now: Date): { label: string; isToday: boolean } {
  if (isSameDay(date, now)) return { label: "Hoy", isToday: true };
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(date, tomorrow)) return { label: "Mañana", isToday: false };
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return {
    label: `${dayNames[date.getDay()]} ${date.getDate()} ${monthNames[date.getMonth()]}`,
    isToday: false,
  };
}

interface ShowTime { time: string; ticketUrl?: string; key: string }
/** statusTag: optional dynamic label shown after "Hoy" (e.g. "Popular", "Alta demanda") */
interface DayGroup { date: Date; label: string; isToday: boolean; times: ShowTime[]; statusTag?: string }

/* ── Collect & group showtimes ── */
function useShowGroups(listing: Listing, allShowListings: Listing[]) {
  return useMemo(() => {
    const now = vegasNow();
    const tUrl = listing.affiliateCtaUrl || listing.reservationUrl || listing.website || undefined;
    const showEvents: { dt: Date; url?: string }[] = [];

    if (listing.startDatetime) {
      const d = new Date(listing.startDatetime);
      if (d > now) showEvents.push({ dt: d, url: tUrl });
    }

    for (const l of allShowListings) {
      if (l.id === listing.id) continue;
      const sameVenue =
        (listing.locatedInListingId && l.locatedInListingId === listing.locatedInListingId) ||
        l.name === listing.name;
      if (!sameVenue) continue;
      if (l.startDatetime) {
        const d = new Date(l.startDatetime);
        if (d > now) showEvents.push({ dt: d, url: l.affiliateCtaUrl || l.reservationUrl || l.website || tUrl });
      }
    }

    // Parse hours JSON — support recurring, multi_dates, and weekly formats
    let parsed: Record<string, any> = {};
    try { parsed = JSON.parse(listing.hours || "{}"); } catch { parsed = {}; }

    if (parsed.type === "recurring") {
      const DAY_MAP: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

      // Support both new day_times format and legacy days+times format
      let dayTimesMap: Record<string, string[]> = {};
      if (parsed.day_times && typeof parsed.day_times === "object") {
        dayTimesMap = parsed.day_times;
      } else if (Array.isArray(parsed.days) && Array.isArray(parsed.times)) {
        for (const d of parsed.days) { dayTimesMap[d] = parsed.times; }
      }

      const dateFrom = parsed.date_from ? new Date(parsed.date_from + "T00:00:00") : null;
      const dateTo = parsed.date_to ? new Date(parsed.date_to + "T23:59:59") : null;

      for (let dayOffset = 0; dayOffset < 60; dayOffset++) {
        const d = new Date(now);
        d.setDate(d.getDate() + dayOffset);
        if (dateFrom && d < dateFrom) continue;
        if (dateTo && d > dateTo) break;

        const dow = d.getDay();
        const dowKey = Object.entries(DAY_MAP).find(([, v]) => v === dow)?.[0] || "";

        // Check if this date is an exception
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const exception = (parsed.exceptions as any[] || []).find((e: any) => e.date === dateStr);

        const timesForDay = exception ? (exception.times as string[] || []) : (dayTimesMap[dowKey] || []);

        for (const timeStr of timesForDay) {
          if (!timeStr) continue;
          const [h, m] = timeStr.split(":").map(Number);
          const sd = new Date(d);
          sd.setHours(h, m || 0, 0, 0);
          if (sd > now) showEvents.push({ dt: sd, url: tUrl });
        }
      }
    } else if (parsed.type === "multi_dates" && Array.isArray(parsed.dates)) {
      // Multi-date format: { type: "multi_dates", dates: [{ date: "2025-04-03", time: "20:00" }, ...] }
      for (const entry of parsed.dates) {
        if (!entry.date || !entry.time) continue;
        const [y, m, d] = entry.date.split("-").map(Number);
        const [h, min] = entry.time.split(":").map(Number);
        const dt = new Date(y, m - 1, d, h, min || 0, 0, 0);
        if (dt > now) showEvents.push({ dt, url: tUrl });
      }
    } else {
      const structured = formatStructuredHours(listing.hours);
      if (structured && structured.lines.length > 0) {
        const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
        for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
          const d = new Date(now);
          d.setDate(d.getDate() + dayOffset);
          const dayIdx = (d.getDay() + 6) % 7;
          const key = DAY_KEYS[dayIdx];
          const entry = parsed[key];
          if (!entry || entry.closed || entry.allDay) continue;
          if (entry.open && entry.close) {
            const [oh, om] = (entry.open as string).split(":").map(Number);
            const sd = new Date(d); sd.setHours(oh, om || 0, 0, 0);
            if (sd > now) showEvents.push({ dt: sd, url: tUrl });
          }
          if (entry.open2 && entry.close2) {
            const [oh2, om2] = (entry.open2 as string).split(":").map(Number);
            const sd2 = new Date(d); sd2.setHours(oh2, om2 || 0, 0, 0);
            if (sd2 > now) showEvents.push({ dt: sd2, url: tUrl });
          }
        }
      }
    }

    if (showEvents.length === 0) return { groups: [], ticketUrl: tUrl };

    showEvents.sort((a, b) => a.dt.getTime() - b.dt.getTime());
    const deduped: typeof showEvents = [];
    for (const e of showEvents) {
      if (!deduped.some(d => Math.abs(d.dt.getTime() - e.dt.getTime()) < 300000)) deduped.push(e);
    }

    const dayMap = new Map<string, DayGroup>();
    for (const e of deduped) {
      const dateKey = `${e.dt.getFullYear()}-${e.dt.getMonth()}-${e.dt.getDate()}`;
      if (!dayMap.has(dateKey)) {
        const { label, isToday } = formatDayLabel(e.dt, now);
        // Dynamically assign a status tag for today based on showtime count
        let statusTag: string | undefined;
        if (isToday) {
          const todayCount = deduped.filter(ev => isSameDay(ev.dt, now)).length;
          if (todayCount >= 3) statusTag = "Alta demanda";
          else if (todayCount >= 1) statusTag = "Popular";
        }
        dayMap.set(dateKey, { date: e.dt, label, isToday, times: [], statusTag });
      }
      const timeStr = formatTime(e.dt);
      dayMap.get(dateKey)!.times.push({
        time: timeStr,
        ticketUrl: e.url,
        key: `${dateKey}-${timeStr}`,
      });
    }

    return { groups: Array.from(dayMap.values()), ticketUrl: tUrl };
  }, [listing, allShowListings]);
}

/* ── Venue name helper ── */
function useVenueName(listing: Listing, allListings: Listing[]): string | null {
  return useMemo(() => {
    if (!listing.locatedInListingId) return null;
    const parent = allListings.find(l => String(l.id) === String(listing.locatedInListingId));
    return parent?.name || null;
  }, [listing, allListings]);
}

/* ── Main component ── */
export default function ShowSchedule({ listing, allShowListings, onTimeSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  
  const { groups, ticketUrl } = useShowGroups(listing, allShowListings);
  const venueName = useVenueName(listing, allShowListings);




  if (groups.length === 0) return null;

  const MAX_VISIBLE = 5;
  const visibleGroups = expanded ? groups : groups.slice(0, MAX_VISIBLE);
  const hasMore = groups.length > MAX_VISIBLE;

  return (
    <section>
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-border mb-6">
        <div>
          <h3 className="font-condensed text-[22px] font-bold tracking-[1px] uppercase">
            Próximas funciones
          </h3>
          <p className="text-[13px] text-muted-foreground mt-1">
            Selecciona una hora para comprar entradas
          </p>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">
            Las entradas se compran en el sitio oficial
          </p>
          {venueName && (
            <p className="text-[13px] text-muted-foreground/70 mt-1.5">
              <span>{venueName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Day groups */}
      <div className="space-y-7">
        {visibleGroups.map((group, gi) => (
          <div key={gi} className="space-y-3">
            {/* Day label */}
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-muted-foreground/50" strokeWidth={1.5} />
              <h4
                className={`text-[14px] font-bold tracking-wide uppercase ${
                  group.isToday ? "text-primary" : "text-foreground/80"
                }`}
              >
                {group.label}
                {group.isToday && group.statusTag && (
                  <span className="text-[11px] font-normal text-primary/60 normal-case tracking-normal ml-0.5">· {group.statusTag}</span>
                )}
              </h4>
              {group.isToday && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
            </div>

            {/* Time pills */}
            <div className="flex flex-wrap gap-2.5 pl-6">
              {group.times.map((t) => {
                const href = t.ticketUrl || ticketUrl || undefined;
                const hasLink = !!href;

                const pillClass = `group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-semibold transition-all duration-150 ${
                  hasLink
                    ? "border-border bg-card text-foreground/80 hover:border-primary/30 hover:bg-accent/50 cursor-pointer active:scale-95"
                    : "border-border bg-card text-foreground/50 cursor-default opacity-70"
                }`;

                if (hasLink) {
                  return (
                    <a
                      key={t.key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        onTimeSelect?.(t.time, href || null);
                      }}
                      className={pillClass}
                    >
                      <Clock className="w-3.5 h-3.5 text-muted-foreground/50" strokeWidth={1.5} />
                      {t.time}
                      <ExternalLink className="w-3 h-3 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" strokeWidth={1.5} />
                    </a>
                  );
                }

                return (
                  <span key={t.key} className={pillClass}>
                    <Clock className="w-3.5 h-3.5 text-muted-foreground/40" strokeWidth={1.5} />
                    {t.time}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Expand toggle */}
      {hasMore && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer bg-transparent border-none"
        >
          Ver calendario completo
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}
      {expanded && hasMore && (
        <button
          onClick={() => setExpanded(false)}
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground/70 transition-colors cursor-pointer bg-transparent border-none"
        >
          Ver menos
          <ChevronDown className="w-3.5 h-3.5 rotate-180" />
        </button>
      )}
    </section>
  );
}
