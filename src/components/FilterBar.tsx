"use client";
import { useZones } from "@/hooks/useTaxonomies";
import { type Listing } from "@/data/listings";
import { useMemo, useState } from "react";

export interface FilterState {
  prices: Set<string>;
  zones: Set<string>;
  highlights: Set<string>;
  openNow: boolean;
  sort: string;
  resorts: Set<string>;
}

interface FilterBarProps {
  filters: FilterState;
  onUpdate: (filters: FilterState) => void;
  hideZone?: boolean;
  hideOpenNow?: boolean;
  allListings?: Listing[];
  catListings?: Listing[];
  totalFilterCount?: number;
  onClearAll?: () => void;
}

const CHIP_LIMIT = 5;

export const filterChip = (active: boolean) =>
  `px-3 py-1.5 border rounded-lg text-[11px] font-semibold cursor-pointer transition-all duration-200 font-body whitespace-nowrap ${
    active
      ? "bg-foreground text-background border-foreground shadow-sm"
      : "bg-[hsl(var(--muted)/.5)] border-border/60 text-muted-foreground hover:bg-muted/70 hover:border-foreground/15 hover:text-foreground"
  }`;

export function ExpandableChips({
  items,
  renderChip,
  activeKeys,
}: {
  items: { key: string; label: string }[];
  renderChip: (item: { key: string; label: string }) => React.ReactNode;
  activeKeys?: Set<string>;
}) {
  const [expanded, setExpanded] = useState(false);

  // Reorder: active items first, then inactive — preserving relative order within each group
  const sorted = useMemo(() => {
    if (!activeKeys || activeKeys.size === 0) return items;
    const active = items.filter(i => activeKeys.has(i.key));
    const inactive = items.filter(i => !activeKeys.has(i.key));
    return [...active, ...inactive];
  }, [items, activeKeys]);

  const visible = expanded ? sorted : sorted.slice(0, CHIP_LIMIT);
  const hasMore = sorted.length > CHIP_LIMIT;

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {visible.map(renderChip)}
      {hasMore && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors font-body whitespace-nowrap"
        >
          + {sorted.length - CHIP_LIMIT} más
        </button>
      )}
      {expanded && hasMore && (
        <button
          onClick={() => setExpanded(false)}
          className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors font-body whitespace-nowrap"
        >
          Ver menos
        </button>
      )}
    </div>
  );
}

export default function FilterBar({ filters, onUpdate, hideZone, hideOpenNow, allListings = [], catListings, totalFilterCount = 0, onClearAll }: FilterBarProps) {
  const { data: zones = [] } = useZones();
  const contextListings = catListings ?? allListings;

  const zoneCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of contextListings) {
      if (l.region) counts.set(l.region, (counts.get(l.region) || 0) + 1);
    }
    return counts;
  }, [contextListings]);

  const sortedZones = useMemo(() => {
    return [...zones]
      .map(z => ({ ...z, count: zoneCounts.get(z.name) || 0 }))
      .filter(z => z.count > 0)
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [zones, zoneCounts]);

  const resortOptions = useMemo(() => {
    const resortCounts = new Map<string, number>();
    for (const l of contextListings) {
      if (l.locatedInListingId) {
        const rid = String(l.locatedInListingId);
        resortCounts.set(rid, (resortCounts.get(rid) || 0) + 1);
      }
    }
    const hotelIds = new Set(resortCounts.keys());
    return allListings
      .filter(l => hotelIds.has(String(l.id)))
      .map(l => ({ ...l, count: resortCounts.get(String(l.id)) || 0 }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [allListings, contextListings]);

  const toggle = (key: "prices" | "zones" | "resorts", value: string) => {
    const next = new Set(filters[key]);
    next.has(value) ? next.delete(value) : next.add(value);
    onUpdate({ ...filters, [key]: next });
  };

  const hasLocationFilters = !hideZone || resortOptions.length > 0;

  return (
    <div className="space-y-7">

      {hasLocationFilters && (
        <div className="space-y-3">
          <div className="text-[9px] font-bold tracking-[2.5px] uppercase text-muted-foreground/40">Ubicación</div>

          {!hideZone && sortedZones.length > 0 && (
          <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Zona</span>
              <ExpandableChips
                items={sortedZones.map(z => ({ key: z.id, label: z.name }))}
                activeKeys={new Set(sortedZones.filter(z => filters.zones.has(z.name)).map(z => z.id))}
                renderChip={(item) => (
                  <button key={item.key} onClick={() => toggle("zones", item.label)} className={filterChip(filters.zones.has(item.label))}>
                    {item.label}
                  </button>
                )}
              />
            </div>
          )}

          {resortOptions.length > 0 && (
          <div className="flex items-center gap-3">
              <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Dentro de</span>
              <ExpandableChips
                items={resortOptions.map(r => ({ key: String(r.id), label: r.name }))}
                activeKeys={filters.resorts}
                renderChip={(item) => (
                  <button key={item.key} onClick={() => toggle("resorts", item.key)} className={filterChip(filters.resorts.has(item.key))}>
                    {item.label}
                  </button>
                )}
              />
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <div className="text-[9px] font-bold tracking-[2.5px] uppercase text-muted-foreground/40">Precio</div>

        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Rango</span>
          <div className="flex gap-1.5">
            {["$", "$$", "$$$", "$$$$"].map(p => (
              <button key={p} onClick={() => toggle("prices", p)} className={`w-[40px] h-[30px] flex items-center justify-center border rounded-lg text-[11px] font-bold cursor-pointer transition-all duration-200 font-body ${
                filters.prices.has(p)
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-[hsl(var(--muted)/.5)] border-border/60 text-muted-foreground hover:bg-muted/70 hover:border-foreground/15 hover:text-foreground"
              }`}>
                {p}
              </button>
            ))}
          </div>

          {!hideOpenNow && (
            <div className="flex items-center gap-3 ml-3">
              <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70">Estado</span>
              <button
                onClick={() => onUpdate({ ...filters, openNow: !filters.openNow })}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[11px] font-semibold cursor-pointer transition-all duration-200 font-body whitespace-nowrap ${
                  filters.openNow
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-[hsl(var(--muted)/.5)] border-border/60 text-muted-foreground hover:bg-muted/70 hover:border-foreground/15 hover:text-foreground"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${filters.openNow ? "bg-green-400" : "bg-muted-foreground/30"}`} />
                Abierto ahora
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}