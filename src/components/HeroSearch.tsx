"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Listing } from "@/data/listings";
import { useZones, useCuisines } from "@/hooks/useTaxonomies";

// Category definitions for matching
const CATEGORIES = [
  { key: "hoteles", path: "/hoteles", label: "Hoteles & Casinos" },
  { key: "restaurantes", path: "/restaurantes", label: "Restaurantes" },
  { key: "shows", path: "/explorar?cat=shows", label: "Shows & Eventos" },
  { key: "nocturna", path: "/explorar?cat=nocturna", label: "Vida Nocturna" },
  { key: "atracciones", path: "/atracciones", label: "Atracciones" },
];

const POPULAR_SEARCHES = [
  { label: "Hoteles en el Strip", path: "/explorar?cat=hoteles&zona=the-strip" },
  { label: "Restaurantes mexicanos", path: "/explorar?cat=restaurantes&cocina=mexicana" },
  { label: "Shows de magia", path: "/explorar?cat=shows&q=magia" },
  { label: "Bares con vista", path: "/explorar?cat=nocturna&tipo=rooftop-bar" },
  { label: "Atracciones en Las Vegas", path: "/atracciones" },
];

// Contextual suggestions keyed by detected intent
const CONTEXTUAL_SUGGESTIONS: Record<string, { label: string; path: string }[]> = {
  shows: [
    { label: "Shows en el Strip", path: "/explorar?cat=shows&zona=the-strip" },
    { label: "Shows de Cirque du Soleil", path: "/explorar?q=cirque+du+soleil" },
    { label: "Shows en Las Vegas hoy", path: "/explorar?cat=shows" },
    { label: "Shows baratos en Las Vegas", path: "/explorar?cat=shows&precio=budget" },
    { label: "Shows familiares en Las Vegas", path: "/explorar?q=shows+familiares" },
  ],
  restaurantes: [
    { label: "Restaurantes mexicanos en Las Vegas", path: "/explorar?cat=restaurantes&cocina=mexicana" },
    { label: "Restaurantes en el Strip", path: "/explorar?cat=restaurantes&zona=the-strip" },
    { label: "Restaurantes en Summerlin", path: "/explorar?cat=restaurantes&zona=summerlin" },
    { label: "Restaurantes abiertos tarde", path: "/explorar?cat=restaurantes&q=abiertos+tarde" },
    { label: "Restaurantes dentro de casinos", path: "/explorar?cat=restaurantes&q=casino" },
  ],
  hoteles: [
    { label: "Hoteles en el Strip", path: "/explorar?cat=hoteles&zona=the-strip" },
    { label: "Hoteles baratos en Las Vegas", path: "/explorar?cat=hoteles&precio=budget" },
    { label: "Hoteles con casino", path: "/explorar?cat=hoteles&q=casino" },
    { label: "Hoteles en Downtown Las Vegas", path: "/explorar?cat=hoteles&zona=downtown" },
  ],
  nocturna: [
    { label: "Vida nocturna en el Strip", path: "/explorar?cat=nocturna&zona=the-strip" },
    { label: "Clubs en Las Vegas", path: "/explorar?cat=nocturna&q=club" },
    { label: "Bares en Downtown", path: "/explorar?cat=nocturna&zona=downtown" },
    { label: "Antros en Las Vegas", path: "/explorar?cat=nocturna&q=antro" },
  ],
  atracciones: [
    { label: "Atracciones en el Strip", path: "/explorar?cat=atracciones&zona=the-strip" },
    { label: "Atracciones en Las Vegas", path: "/atracciones" },
    { label: "Tours en Las Vegas", path: "/explorar?cat=atracciones&q=tour" },
    { label: "Atracciones familiares", path: "/explorar?q=atracciones+familiares" },
  ],
};

// Zone-based contextual suggestions
const ZONE_SUGGESTIONS: Record<string, { label: string; path: string }[]> = {
  strip: [
    { label: "Restaurantes en el Strip", path: "/explorar?cat=restaurantes&zona=the-strip" },
    { label: "Shows en el Strip", path: "/explorar?cat=shows&zona=the-strip" },
    { label: "Vida nocturna en el Strip", path: "/explorar?cat=nocturna&zona=the-strip" },
    { label: "Hoteles en el Strip", path: "/explorar?cat=hoteles&zona=the-strip" },
  ],
  downtown: [
    { label: "Restaurantes en Downtown", path: "/explorar?cat=restaurantes&zona=downtown" },
    { label: "Bares en Downtown", path: "/explorar?cat=nocturna&zona=downtown" },
    { label: "Atracciones en Downtown", path: "/explorar?cat=atracciones&zona=downtown" },
    { label: "Hoteles en Downtown", path: "/explorar?cat=hoteles&zona=downtown" },
  ],
  summerlin: [
    { label: "Restaurantes en Summerlin", path: "/explorar?cat=restaurantes&zona=summerlin" },
    { label: "Bares en Summerlin", path: "/explorar?cat=nocturna&zona=summerlin" },
    { label: "Atracciones en Summerlin", path: "/explorar?cat=atracciones&zona=summerlin" },
    { label: "Hoteles cerca de Summerlin", path: "/explorar?cat=hoteles&zona=summerlin" },
  ],
  henderson: [
    { label: "Restaurantes en Henderson", path: "/explorar?cat=restaurantes&zona=henderson" },
    { label: "Bares en Henderson", path: "/explorar?cat=nocturna&zona=henderson" },
    { label: "Atracciones en Henderson", path: "/explorar?cat=atracciones&zona=henderson" },
  ],
};

function getContextualSuggestions(query: string): { label: string; path: string }[] | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  const tokens = stripStopwords(q.split(/\s+/));

  // Check category intents via tokens
  const catAliasMap: Record<string, string> = {
    hotel: "hoteles", hoteles: "hoteles", casino: "hoteles", casinos: "hoteles",
    resort: "hoteles", hospedaje: "hoteles",
    restaurante: "restaurantes", restaurantes: "restaurantes",
    comida: "restaurantes", comer: "restaurantes", buffet: "restaurantes",
    show: "shows", shows: "shows", espectáculo: "shows", espectáculos: "shows",
    concierto: "shows", conciertos: "shows", evento: "shows",
    club: "nocturna", clubs: "nocturna", bar: "nocturna", bares: "nocturna",
    antro: "nocturna", fiesta: "nocturna", discoteca: "nocturna",
    atracción: "atracciones", atracciones: "atracciones", tour: "atracciones",
    tours: "atracciones", excursión: "atracciones", museo: "atracciones",
    miradores: "atracciones", experiencias: "atracciones",
  };

  // Also check multi-word intents
  const cleanQuery = tokens.join(" ");
  if (cleanQuery.includes("vida nocturna") || cleanQuery.includes("nocturna")) {
    return CONTEXTUAL_SUGGESTIONS["nocturna"];
  }
  if (cleanQuery.includes("cosas hacer")) {
    return CONTEXTUAL_SUGGESTIONS["atracciones"];
  }

  for (const token of tokens) {
    const mapped = catAliasMap[token];
    if (mapped && CONTEXTUAL_SUGGESTIONS[mapped]) return CONTEXTUAL_SUGGESTIONS[mapped];
  }

  // Check zone intents
  for (const [key, suggestions] of Object.entries(ZONE_SUGGESTIONS)) {
    if (tokens.some(t => t.includes(key))) return suggestions;
  }

  return null;
}

// Spanish stopwords to ignore during search
const STOPWORDS = new Set([
  "en", "el", "la", "los", "las", "de", "del", "un", "una", "unos", "unas",
  "con", "por", "para", "al", "que", "y", "o", "a", "es", "son", "muy",
]);

function stripStopwords(tokens: string[]): string[] {
  const filtered = tokens.filter(t => !STOPWORDS.has(t));
  return filtered.length > 0 ? filtered : tokens; // fallback to original if all stripped
}

// Synonyms/aliases to improve intent matching
const ALIASES: Record<string, string> = {
  // Hotels
  hotel: "hoteles", hoteles: "hoteles", casino: "hoteles", casinos: "hoteles",
  resort: "hoteles", hospedaje: "hoteles",
  // Restaurants
  restaurante: "restaurantes", restaurantes: "restaurantes",
  comida: "restaurantes", comer: "restaurantes", buffet: "restaurantes",
  // Shows
  show: "shows", shows: "shows", espectáculo: "shows", espectáculos: "shows",
  concierto: "shows", conciertos: "shows", evento: "shows",
  // Nightlife
  club: "nocturna", clubs: "nocturna", bar: "nocturna", bares: "nocturna",
  antro: "nocturna", fiesta: "nocturna", discoteca: "nocturna",
  // Attractions
  atracción: "atracciones", atracciones: "atracciones", tour: "atracciones",
  tours: "atracciones", excursión: "atracciones", museo: "atracciones",
  miradores: "atracciones", mirador: "atracciones", experiencias: "atracciones",
  experiencia: "atracciones",
  // Cuisines
  sushi: "japonesa", pizza: "italiana", taco: "mexicana", tacos: "mexicana",
  steak: "steakhouse", carne: "steakhouse",
};

// Zone aliases for location detection
const ZONE_ALIASES: Record<string, string> = {
  strip: "the-strip", "the-strip": "the-strip",
  downtown: "downtown", fremont: "downtown",
  summerlin: "summerlin", henderson: "henderson",
};

type SuggestionItem =
  | { group: "category"; label: string; sub: string; path: string }
  | { group: "zone"; label: string; sub: string; path: string }
  | { group: "cuisine"; label: string; sub: string; path: string }
  | { group: "listing"; label: string; sub: string; path: string };

const GROUP_LABELS: Record<string, string> = {
  category: "Categorías",
  zone: "Zonas",
  cuisine: "Cocinas",
  listing: "Lugares",
};

interface HeroSearchProps {
  allListings: Listing[];
  onOpenChange?: (open: boolean) => void;
}

export default function HeroSearch({ allListings, onOpenChange }: HeroSearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  

  const { data: zones = [] } = useZones();
  const { data: cuisines = [] } = useCuisines();


  // Build parent resort lookup
  const parentMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const l of allListings) {
      if (l.locatedInListingId) {
        const parent = allListings.find(p => String(p.id) === l.locatedInListingId);
        if (parent) map[String(l.id)] = parent.name;
      }
    }
    return map;
  }, [allListings]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Notify parent of open state
  useEffect(() => {
    onOpenChange?.(showSuggestions);
  }, [showSuggestions, onOpenChange]);


  // Build suggestions
  const suggestions = useMemo((): SuggestionItem[] => {
    if (!search.trim()) return [];
    const q = search.toLowerCase().trim();
    const rawTokens = q.split(/\s+/);
    const tokens = stripStopwords(rawTokens);
    const cleanQuery = tokens.join(" ");
    const results: SuggestionItem[] = [];

    // Detect category and zone intents from tokens
    let detectedCat: string | null = null;
    let detectedZoneSlug: string | null = null;

    for (const token of tokens) {
      if (!detectedCat) {
        const aliasKey = ALIASES[token];
        if (aliasKey) {
          const cat = CATEGORIES.find(c => c.key === aliasKey);
          if (cat) detectedCat = cat.key;
        }
      }
      if (!detectedZoneSlug && ZONE_ALIASES[token]) {
        detectedZoneSlug = ZONE_ALIASES[token];
      }
    }

    // Category matches
    for (const c of CATEGORIES) {
      if (c.label.toLowerCase().includes(cleanQuery) || c.key.includes(cleanQuery)) {
        results.push({ group: "category", label: c.label, sub: "Categoría", path: c.path });
      }
    }
    // Alias → category
    for (const token of tokens) {
      const aliasKey = ALIASES[token];
      if (aliasKey) {
        const cat = CATEGORIES.find(c => c.key === aliasKey);
        if (cat && !results.some(r => r.group === "category" && r.path === cat.path)) {
          results.push({ group: "category", label: cat.label, sub: "Categoría", path: cat.path });
        }
      }
    }

    // Zone matches
    for (const z of zones) {
      const zName = z.name.toLowerCase();
      const zSlug = z.slug;
      if (tokens.some(t => zName.includes(t) || zSlug.includes(t))) {
        results.push({ group: "zone", label: z.name, sub: "Zona", path: `/explorar?zona=${z.slug}` });
      }
    }

    // Cuisine matches
    for (const c of cuisines) {
      if (c.name.toLowerCase().includes(cleanQuery) || c.slug.includes(cleanQuery)) {
        results.push({ group: "cuisine", label: c.name, sub: "Tipo de cocina", path: `/explorar?cat=restaurantes&cocina=${c.slug}` });
      }
    }
    // Alias → cuisine
    for (const token of tokens) {
      const aliasVal = ALIASES[token];
      if (aliasVal) {
        const cuisine = cuisines.find(c => c.slug === aliasVal || c.name.toLowerCase() === aliasVal);
        if (cuisine && !results.some(r => r.group === "cuisine" && r.label === cuisine.name)) {
          results.push({ group: "cuisine", label: cuisine.name, sub: "Tipo de cocina", path: `/explorar?cat=restaurantes&cocina=${cuisine.slug}` });
        }
      }
    }

    // Listing matches — search across multiple fields
    const scored: { listing: Listing; score: number }[] = [];
    for (const l of allListings) {
      let score = 0;
      const name = l.name.toLowerCase();
      const catLabel = l.catLabel.toLowerCase();
      const cat = l.cat.toLowerCase();
      const region = (l.region || "").toLowerCase();
      const tagline = (l.tagline || "").toLowerCase();
      const desc = l.desc.toLowerCase();
      const cuisineStr = (l.cuisine || []).join(" ").toLowerCase();
      const parentName = (parentMap[String(l.id)] || "").toLowerCase();
      const venueType = (l.venueType || []).join(" ").toLowerCase();

      // Full clean query match on name
      if (name.includes(cleanQuery)) score += 100;
      else {
        for (const token of tokens) {
          if (name.includes(token)) score += 40;
        }
      }
      if (catLabel.includes(cleanQuery)) score += 20;
      if (region.includes(cleanQuery)) score += 15;
      if (cuisineStr.includes(cleanQuery)) score += 15;
      if (parentName.includes(cleanQuery)) score += 15;
      if (venueType.includes(cleanQuery)) score += 10;
      if (tagline.includes(cleanQuery)) score += 8;
      if (desc.includes(cleanQuery)) score += 5;

      // Token-level matching (using clean tokens)
      if (tokens.length > 1 && score < 100) {
        let tokenHits = 0;
        const allText = `${name} ${cat} ${catLabel} ${region} ${cuisineStr} ${parentName} ${venueType} ${tagline} ${desc}`;
        for (const token of tokens) {
          if (allText.includes(token)) tokenHits++;
        }
        if (tokenHits === tokens.length) score += 30;
        else if (tokenHits > 0) score += tokenHits * 5;
      }

      // Boost for combined category + zone intent
      if (detectedCat && detectedZoneSlug) {
        const matchesCat = cat === detectedCat || catLabel.includes(detectedCat);
        const zoneSlug = detectedZoneSlug;
        const matchesZone = region.includes(zoneSlug) || region.includes(zoneSlug.replace("-", " "));
        if (matchesCat && matchesZone) score += 50;
        else if (matchesCat) score += 15;
        else if (matchesZone) score += 10;
      }

      if (score > 0) scored.push({ listing: l, score });
    }

    scored.sort((a, b) => b.score - a.score);
    for (const { listing: l } of scored.slice(0, 6)) {
      const parentName = parentMap[String(l.id)];
      const sub = parentName ? `${l.catLabel} · ${parentName}` : l.catLabel;
      results.push({ group: "listing", label: l.name, sub, path: `/lugar/${l.slug}` });
    }

    return results;
  }, [search, allListings, zones, cuisines, parentMap]);

  // Grouped suggestions for rendering
  const groupedSuggestions = useMemo(() => {
    const groups: { key: string; label: string; items: SuggestionItem[] }[] = [];
    const order = ["category", "zone", "cuisine", "listing"];
    for (const g of order) {
      const items = suggestions.filter(s => s.group === g);
      if (items.length > 0) {
        groups.push({ key: g, label: GROUP_LABELS[g], items });
      }
    }
    return groups;
  }, [suggestions]);

  // Flat list for keyboard navigation (includes contextual suggestions)
  const contextualForNav = useMemo(() => getContextualSuggestions(search), [search]);
  const flatItems = useMemo(() => {
    const base = [...suggestions];
    if (contextualForNav && suggestions.length > 0) {
      for (const s of contextualForNav) {
        base.push({ group: "category" as const, label: s.label, sub: "", path: s.path });
      }
    }
    return base;
  }, [suggestions, contextualForNav]);

  const handleNavigate = useCallback((path: string) => {
    setShowSuggestions(false);
    setSearch("");
    router.push(path);
  }, [router]);

  const handleSearch = useCallback(() => {
    if (!search.trim()) return;
    setShowSuggestions(false);
    router.push(`/explorar?q=${encodeURIComponent(search.trim())}`);
  }, [search, router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      return;
    }

    const isDropdownOpen = showSuggestions && (flatItems.length > 0 || !search.trim());
    if (!isDropdownOpen) {
      if (e.key === "Enter") handleSearch();
      return;
    }

    // Popular searches mode
    if (!search.trim()) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, POPULAR_SEARCHES.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < POPULAR_SEARCHES.length) {
          handleNavigate(POPULAR_SEARCHES[activeIndex].path);
        }
      }
      return;
    }

    // Suggestions mode
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < flatItems.length) {
        handleNavigate(flatItems[activeIndex].path);
      } else {
        handleSearch();
      }
    }
  }, [showSuggestions, flatItems, search, activeIndex, handleSearch, handleNavigate]);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [search]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-suggestion]");
      items[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const showPopular = showSuggestions && !search.trim();
  const showResults = showSuggestions && search.trim();
  const hasResults = suggestions.length > 0;
  const contextualSuggs = useMemo(() => getContextualSuggestions(search), [search]);
  const fallbackSuggs = contextualSuggs || POPULAR_SEARCHES;

  let itemIndex = -1; // global counter for flat index mapping

  return (
    <div className="animate-fade-up-3 max-w-[700px] mx-auto mb-5 relative z-50" ref={containerRef}>
      {/* Search input */}
       <div className="flex rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.2)]">
        <div className="flex-1 bg-[rgba(0,0,0,0.5)] backdrop-blur-xl border border-[rgba(255,255,255,0.15)] border-r-[rgba(255,255,255,0.08)] rounded-l-lg focus-within:border-[rgba(255,255,255,0.3)] transition-all">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder="¿Qué buscas? (tacos, rooftop, shows, etc)"
            className="w-full bg-transparent border-none outline-none px-5 py-[14px] text-dark-text font-body text-[15px] placeholder:text-dark-text-muted"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
          />
        </div>
        <button
          onClick={() => { setShowSuggestions(false); handleSearch(); }}
          className="bg-[hsl(0,72%,42%)] border-y border-r border-[hsl(0,72%,42%)] rounded-r-lg px-[28px] py-[14px] text-primary-foreground font-condensed text-[15px] font-bold tracking-[1.5px] uppercase cursor-pointer hover:bg-[hsl(0,72%,48%)] transition-colors shrink-0"
        >
          Buscar
        </button>
      </div>

      {/* Popular searches (empty input) */}
      {showPopular && (
         <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-[#F7F5F1] border border-[rgba(0,0,0,0.08)] rounded-xl shadow-[0_24px_60px_rgba(0,0,0,0.35),0_8px_20px_rgba(0,0,0,0.18)] z-[80] max-h-[280px] overflow-y-auto search-dropdown-scroll" ref={listRef}>
          <div className="px-4 pt-3 pb-1 text-[9px] font-semibold tracking-[2.5px] uppercase text-[#B0A89E]">Búsquedas populares</div>
          {POPULAR_SEARCHES.map((s, i) => (
            <button
              key={i}
              data-suggestion
              onClick={() => handleNavigate(s.path)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors duration-150 ${activeIndex === i ? "bg-[#EFECE7]" : "hover:bg-[#EFECE7]"}`}
            >
              <span className="text-[13px] font-medium text-[#3A3530]">{s.label}</span>
              <span className="ml-auto text-[11px] text-[#C8C1B8] font-light">→</span>
            </button>
          ))}
        </div>
      )}

      {/* Results dropdown */}
      {showResults && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-[#F7F5F1] border border-[rgba(0,0,0,0.08)] rounded-xl shadow-[0_24px_60px_rgba(0,0,0,0.35),0_8px_20px_rgba(0,0,0,0.18)] z-[80] max-h-[280px] overflow-y-auto search-dropdown-scroll" ref={listRef}>
          {hasResults ? (
            <>
              {groupedSuggestions.map((group) => (
                <div key={group.key}>
                  <div className="px-4 pt-3 pb-1 text-[9px] font-semibold tracking-[2.5px] uppercase text-[#B0A89E]">
                    {group.label}
                  </div>
                  {group.items.map((s) => {
                    itemIndex++;
                    const idx = itemIndex;
                    return (
                      <button
                        key={`${s.group}-${s.label}`}
                        data-suggestion
                        onClick={() => handleNavigate(s.path)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors duration-150 ${activeIndex === idx ? "bg-[#EFECE7]" : "hover:bg-[#EFECE7]"}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-[#3A3530] truncate leading-tight">{s.label}</div>
                          <div className="text-[10px] text-[#B0A89E] uppercase tracking-[1px] leading-tight mt-0.5">{s.sub}</div>
                        </div>
                        <span className="text-[11px] text-[#C8C1B8] font-light">→</span>
                      </button>
                    );
                  })}
                </div>
              ))}
              {/* Contextual suggested searches after results */}
              {contextualSuggs && (
                <div>
                  <div className="px-4 pt-3 pb-1 text-[9px] font-semibold tracking-[2.5px] uppercase text-[#B0A89E]">Búsquedas sugeridas</div>
                  {contextualSuggs.map((s, i) => {
                    itemIndex++;
                    const idx = itemIndex;
                    return (
                      <button
                        key={`ctx-${i}`}
                        data-suggestion
                        onClick={() => handleNavigate(s.path)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors duration-150 ${activeIndex === idx ? "bg-[#EFECE7]" : "hover:bg-[#EFECE7]"}`}
                      >
                        <span className="text-[13px] font-medium text-[#3A3530]">{s.label}</span>
                        <span className="ml-auto text-[11px] text-[#C8C1B8] font-light">→</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-5 text-center">
              <div className="text-[13px] text-[#8A8279] mb-3">No encontramos resultados para "<span className="font-semibold text-[#3A3530]">{search}</span>"</div>
              <div className="text-[9px] font-semibold tracking-[2.5px] uppercase text-[#B0A89E] mb-2">Prueba con</div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {fallbackSuggs.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleNavigate(s.path)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium text-[#5A5349] bg-[#EFECE7] hover:bg-[#E5E1DB] transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
