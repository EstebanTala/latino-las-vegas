"use client";
import { useMemo, useState } from "react";
import { type Listing } from "@/data/listings";
import { useCuisines, useVenueTypes, useMusicGenres, useAttractionTypes, useShowTypes } from "@/hooks/useTaxonomies";
import { filterChip, ExpandableChips } from "@/components/FilterBar";

/* ── Category-specific filter state ── */
export interface CategoryFilterState {
  // Hoteles
  starRatings: Set<number>;
  // Restaurantes
  cuisines: Set<string>;
  // Shows
  showDate: string; // yyyy-mm-dd or ""
  // Atracciones
  admissionTypes: Set<string>;
  attractionTypes: Set<string>;
  durations: Set<string>;
  idealFor: Set<string>;
  experienceTypes: Set<string>;
  experienceLocations: Set<string>;
  // Nocturna
  venueTypes: Set<string>;
  musicGenres: Set<string>;
}

export const emptyCategoryFilters: CategoryFilterState = {
  starRatings: new Set(),
  cuisines: new Set(),
  showDate: "",
  admissionTypes: new Set(),
  attractionTypes: new Set(),
  durations: new Set(),
  idealFor: new Set(),
  experienceTypes: new Set(),
  experienceLocations: new Set(),
  venueTypes: new Set(),
  musicGenres: new Set(),
};

/* ── Helpers to derive available options from listings ── */
export function useCategoryOptions(listings: Listing[], cat: string) {
  return useMemo(() => {
    const filtered = cat ? listings.filter(l => l.cat === cat) : listings;

    const cuisines = [...new Set(filtered.flatMap(l => l.cuisine ?? []))].sort();
    const venueTypes = [...new Set(filtered.flatMap(l => l.venueType ?? []))].sort();
    const musicGenres = [...new Set(filtered.flatMap(l => l.musicGenres ?? []))].sort();
    const admissionTypes = [...new Set(filtered.map(l => l.admissionType).filter(Boolean) as string[])].sort();

    return { cuisines, venueTypes, musicGenres, admissionTypes };
  }, [listings, cat]);
}

/* ── Apply category filters ── */
export function applyCategoryFilters(listings: Listing[], cat: string, cf: CategoryFilterState): Listing[] {
  let r = listings;

  if (cat === "hoteles" && cf.starRatings.size > 0) {
    r = r.filter(l => cf.starRatings.has(l.stars));
  }
  if (cat === "restaurantes" && cf.cuisines.size > 0) {
    r = r.filter(l => l.cuisine?.some(c => cf.cuisines.has(c)));
  }
  if (cat === "shows" && cf.showDate) {
    r = r.filter(l => {
      if (!l.startDatetime) return true;
      return l.startDatetime.startsWith(cf.showDate);
    });
  }
  // Experience type filter: shows use showExperienceType, attractions use experienceType
  if (cat === "shows" && cf.experienceTypes.size > 0) {
    r = r.filter(l => l.showExperienceType?.some(v => cf.experienceTypes.has(v)));
  }
  if (cat === "atracciones" && cf.experienceTypes.size > 0) {
    r = r.filter(l => l.experienceType?.some(v => cf.experienceTypes.has(v)));
  }
  if (cat === "atracciones") {
    if (cf.admissionTypes.size > 0) {
      r = r.filter(l => l.admissionType && cf.admissionTypes.has(l.admissionType));
    }
    if (cf.durations.size > 0) {
      r = r.filter(l => l.duration && cf.durations.has(l.duration));
    }
    if (cf.idealFor.size > 0) {
      r = r.filter(l => l.idealFor?.some(v => cf.idealFor.has(v)));
    }
    if (cf.experienceLocations.size > 0) {
      r = r.filter(l => l.experienceLocation && cf.experienceLocations.has(l.experienceLocation));
    }
  }
  if (cat === "nocturna") {
    if (cf.venueTypes.size > 0) {
      r = r.filter(l => l.venueType?.some(v => cf.venueTypes.has(v)));
    }
    if (cf.musicGenres.size > 0) {
      r = r.filter(l => l.musicGenres?.some(g => cf.musicGenres.has(g)));
    }
  }

  return r;
}

const CUISINE_LIMIT = 8;

/* ── UI Component ── */
interface Props {
  cat: string;
  filters: CategoryFilterState;
  onUpdate: (f: CategoryFilterState) => void;
  listings: Listing[];
}

export default function CategoryFilters({ cat, filters, onUpdate, listings }: Props) {
  const options = useCategoryOptions(listings, cat);
  const { data: taxonomyCuisines = [] } = useCuisines();
  const { data: taxonomyVenueTypes = [] } = useVenueTypes();
  const { data: taxonomyMusicGenres = [] } = useMusicGenres();
  const { data: taxonomyAttractionTypes = [] } = useAttractionTypes();
  const { data: taxonomyShowTypes = [] } = useShowTypes();
  const [showAllCuisines, setShowAllCuisines] = useState(false);

  const toggleSet = <K extends keyof CategoryFilterState>(
    key: K,
    value: CategoryFilterState[K] extends Set<infer V> ? V : never
  ) => {
    const current = filters[key] as Set<any>;
    const next = new Set(current);
    next.has(value) ? next.delete(value) : next.add(value);
    onUpdate({ ...filters, [key]: next });
  };

  if (cat === "hoteles") {
    return (
      <div className="flex items-center gap-3">
        <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 min-w-[52px] shrink-0">Estrellas</span>
        <div className="flex gap-2">
          {[2, 3, 4, 5].map(s => (
            <button
              key={s}
              onClick={() => toggleSet("starRatings", s)}
              className={`${filterChip(filters.starRatings.has(s))} inline-flex items-center justify-center gap-1`}
            >
              <span>{s}</span>
              <span className="text-[11px] leading-none">★</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (cat === "restaurantes") {
    const catListings = listings.filter(l => l.cat === "restaurantes");
    const cuisineCounts = new Map<string, number>();
    for (const l of catListings) {
      for (const c of l.cuisine ?? []) {
        cuisineCounts.set(c, (cuisineCounts.get(c) || 0) + 1);
      }
    }

    const cuisineNames = taxonomyCuisines.length > 0
      ? taxonomyCuisines.map(c => c.name)
      : options.cuisines;

    const sortedCuisines = (() => {
      const all = cuisineNames
        .map(c => ({ name: c, count: cuisineCounts.get(c) || 0 }))
        .filter(c => c.count > 0)
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      // Move active cuisines to the front
      const active = all.filter(c => filters.cuisines.has(c.name));
      const inactive = all.filter(c => !filters.cuisines.has(c.name));
      return [...active, ...inactive];
    })();

    if (sortedCuisines.length === 0) return null;

    const visibleCuisines = showAllCuisines ? sortedCuisines : sortedCuisines.slice(0, CUISINE_LIMIT);
    const hasMore = sortedCuisines.length > CUISINE_LIMIT;

    return (
      <div className="flex items-center gap-3">
        <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Cocina</span>
        <div className="flex gap-2 flex-wrap items-center">
          {visibleCuisines.map(c => (
            <button
              key={c.name}
              onClick={() => toggleSet("cuisines", c.name)}
              className={filterChip(filters.cuisines.has(c.name))}
            >
              {c.name}
            </button>
          ))}
          {hasMore && !showAllCuisines && (
            <button
              onClick={() => setShowAllCuisines(true)}
              className="px-3 py-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors font-body whitespace-nowrap"
            >
              + Ver más
            </button>
          )}
          {showAllCuisines && hasMore && (
            <button
              onClick={() => setShowAllCuisines(false)}
              className="px-3 py-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors font-body whitespace-nowrap"
            >
              Ver menos
            </button>
          )}
        </div>
      </div>
    );
  }

  if (cat === "shows") {
    const today = new Date().toISOString().slice(0, 10);
    const expTypes = taxonomyShowTypes.map(t => t.name);
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Fecha</span>
          <input
            type="date"
            value={filters.showDate}
            onChange={e => onUpdate({ ...filters, showDate: e.target.value })}
            min={today}
            className="bg-[hsl(var(--muted))] border border-border rounded-md text-muted-foreground px-3 py-1.5 font-body text-[12px] outline-none cursor-pointer"
          />
          {filters.showDate && (
            <button
              onClick={() => onUpdate({ ...filters, showDate: "" })}
              className="text-[11px] text-muted-foreground hover:text-foreground font-semibold font-body underline underline-offset-2"
            >
              Cualquier fecha
            </button>
          )}
        </div>
        {expTypes.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Tipo</span>
            <ExpandableChips
              items={expTypes.map(t => ({ key: t, label: t }))}
              activeKeys={filters.experienceTypes}
              renderChip={(item) => (
                <button
                  key={item.key}
                  onClick={() => toggleSet("experienceTypes", item.key)}
                  className={filterChip(filters.experienceTypes.has(item.key))}
                >
                  {item.label}
                </button>
              )}
            />
          </div>
        )}
      </div>
    );
  }

  if (cat === "atracciones") {
    const expTypes = taxonomyAttractionTypes.map(t => t.name);
    const admTypes = options.admissionTypes.length > 0
      ? options.admissionTypes
      : ["Gratis", "De pago"];
    const durationOpts = ["< 1 hora", "1–2 horas", "2–3 horas", "3–4 horas", "4+ horas"];
    const idealOpts = ["Parejas", "Familias", "Solo", "Grupos", "Turistas"];
    const locationOpts = ["Interior", "Exterior", "Ambos"];
    return (
      <div className="space-y-3">
        {expTypes.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Tipo</span>
            <ExpandableChips
              items={expTypes.map(t => ({ key: t, label: t }))}
              activeKeys={filters.experienceTypes}
              renderChip={(item) => (
                <button
                  key={item.key}
                  onClick={() => toggleSet("experienceTypes", item.key)}
                  className={filterChip(filters.experienceTypes.has(item.key))}
                >
                  {item.label}
                </button>
              )}
            />
          </div>
        )}
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Entrada</span>
          <div className="flex gap-2">
            {admTypes.map(t => (
              <button
                key={t}
                onClick={() => toggleSet("admissionTypes", t)}
                className={filterChip(filters.admissionTypes.has(t))}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Duración</span>
          <div className="flex gap-2 flex-wrap">
            {durationOpts.map(t => (
              <button key={t} onClick={() => toggleSet("durations", t)} className={filterChip(filters.durations.has(t))}>{t}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Para</span>
          <div className="flex gap-2 flex-wrap">
            {idealOpts.map(t => (
              <button key={t} onClick={() => toggleSet("idealFor", t)} className={filterChip(filters.idealFor.has(t))}>{t}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Ubicación</span>
          <div className="flex gap-2">
            {locationOpts.map(t => (
              <button key={t} onClick={() => toggleSet("experienceLocations", t)} className={filterChip(filters.experienceLocations.has(t))}>{t}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cat === "nocturna") {
    const vTypes = taxonomyVenueTypes.length > 0
      ? taxonomyVenueTypes.map(t => t.name)
      : (options.venueTypes.length > 0 ? options.venueTypes : ["Nightclub", "Bar", "Lounge"]);
    const mGenres = taxonomyMusicGenres.length > 0
      ? taxonomyMusicGenres.map(g => g.name)
      : options.musicGenres;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Tipo</span>
          <ExpandableChips
            items={vTypes.map(t => ({ key: t, label: t }))}
            activeKeys={filters.venueTypes}
            renderChip={(item) => (
              <button
                key={item.key}
                onClick={() => toggleSet("venueTypes", item.key)}
                className={filterChip(filters.venueTypes.has(item.key))}
              >
                {item.label}
              </button>
            )}
          />
        </div>
        {mGenres.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold tracking-[1.5px] uppercase text-muted-foreground/70 w-[52px]">Género</span>
            <ExpandableChips
              items={mGenres.map(g => ({ key: g, label: g }))}
              activeKeys={filters.musicGenres}
              renderChip={(item) => (
                <button
                  key={item.key}
                  onClick={() => toggleSet("musicGenres", item.key)}
                  className={filterChip(filters.musicGenres.has(item.key))}
                >
                  {item.label}
                </button>
              )}
            />
          </div>
        )}
      </div>
    );
  }

  return null;
}
