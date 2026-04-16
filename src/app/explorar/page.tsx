"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useListings } from "@/hooks/useListings";
import ListingCard from "@/components/ListingCard";
import FilterBar from "@/components/FilterBar";
import CategoryFilters, { emptyCategoryFilters } from "@/components/CategoryFilters";
import { useListingFilters } from "@/hooks/useListingFilters";
import { useCuisines, useZones, useVenueTypes, useAttractionTypes, useShowTypes } from "@/hooks/useTaxonomies";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Map, LayoutGrid, X, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const catHeroContent: Record<string, { title: React.ReactNode; subtitle: string }> = {
  hoteles: {
    title: <>HOTELES EN <span className="text-red">LAS VEGAS</span></>,
    subtitle: "Descubre los mejores hoteles y casinos de Las Vegas, desde resorts icónicos en el Strip hasta opciones locales en toda la ciudad.",
  },
  restaurantes: {
    title: <>RESTAURANTES EN <span className="text-red">LAS VEGAS</span></>,
    subtitle: "Explora los sabores más destacados de Las Vegas, desde restaurantes icónicos hasta joyas locales en cada zona de la ciudad.",
  },
  shows: {
    title: <>SHOWS Y EVENTOS EN <span className="text-red">LAS VEGAS</span></>,
    subtitle: "Encuentra los mejores espectáculos, conciertos y eventos en Las Vegas para disfrutar una experiencia inolvidable.",
  },
  nocturna: {
    title: <>VIDA NOCTURNA EN <span className="text-red">LAS VEGAS</span></>,
    subtitle: "Descubre bares, lounges y nightclubs donde la fiesta en Las Vegas cobra vida cada noche.",
  },
  atracciones: {
    title: <>ATRACCIONES EN <span className="text-red">LAS VEGAS</span></>,
    subtitle: "Explora las mejores atracciones y experiencias que hacen de Las Vegas uno de los destinos más emocionantes del mundo.",
  },
};

const catTabs = [
  { key: "hoteles", label: "Hoteles & Casinos" },
  { key: "restaurantes", label: "Restaurantes" },
  { key: "shows", label: "Shows & Eventos" },
  { key: "nocturna", label: "Vida Nocturna" },
  { key: "atracciones", label: "Atracciones" },
];

const catPlaceholders: Record<string, string> = {
  "": "Busca hoteles, restaurantes, shows…",
  hoteles: "Busca hoteles o casinos",
  restaurantes: "Busca restaurantes o cocinas",
  shows: "Busca shows o eventos",
  nocturna: "Busca bares, lounges o nightclubs",
  atracciones: "Busca atracciones o experiencias",
};

function ExplorePageInner() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "hoteles";
  const initialQ = searchParams.get("q") || "";
  const initialCocinaSlug = searchParams.get("cocina") || "";
  const initialZonaSlug = searchParams.get("zona") || "";
  const initialAbierto = searchParams.get("abierto") === "1";
  const initialResort = searchParams.get("resort") || "";
  const initialTipoSlug = searchParams.get("tipo") || "";
  const [activeCat, setActiveCat] = useState(initialCat);
  const { data: allListings = [] } = useListings();
  const { data: taxonomyCuisines = [] } = useCuisines();
  const { data: taxonomyZones = [] } = useZones();
  const { data: taxonomyVenueTypes = [] } = useVenueTypes();
  const { data: taxonomyAttractionTypes = [] } = useAttractionTypes();
  const { data: taxonomyShowTypes = [] } = useShowTypes();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const tabsRef = useRef<HTMLDivElement>(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPageMap: Record<string, number> = {
    hoteles: 6,
    restaurantes: 9,
    nocturna: 9,
    shows: 6,
    atracciones: 9,
  };
  const itemsPerPage = itemsPerPageMap[activeCat] ?? 6;

  const updateUnderline = useCallback(() => {
    if (!tabsRef.current) return;
    const active = tabsRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (active) {
      const containerRect = tabsRef.current.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      setUnderline({
        left: activeRect.left - containerRect.left + tabsRef.current.scrollLeft,
        width: activeRect.width,
      });
    }
  }, []);

  const catListings = useMemo(
    () => activeCat ? allListings.filter(l => l.cat === activeCat) : allListings,
    [activeCat, allListings]
  );

  useEffect(() => {
    updateUnderline();
  }, [activeCat, allListings, updateUnderline]);

  // SEO: update title and meta description based on active category
  const catSeo: Record<string, { title: string; description: string }> = {
    restaurantes: {
      title: "Restaurantes en Las Vegas | Latino LV",
      description: "Descubre los mejores restaurantes en Las Vegas, desde cocina mexicana y asiática hasta steakhouse y restaurantes icónicos en el Strip, Downtown y otras zonas de la ciudad.",
    },
    hoteles: {
      title: "Hoteles y Casinos en Las Vegas | Latino LV",
      description: "Encuentra los mejores hoteles y casinos en Las Vegas. Guía completa con opciones en el Strip, Downtown y alrededores.",
    },
    shows: {
      title: "Shows y Eventos en Las Vegas | Latino LV",
      description: "Descubre los mejores shows y eventos en Las Vegas, desde espectáculos del Cirque du Soleil hasta conciertos y residencias.",
    },
    nocturna: {
      title: "Vida Nocturna en Las Vegas | Latino LV",
      description: "Explora la vida nocturna de Las Vegas: bares, clubs, lounges y las mejores fiestas en el Strip y Downtown.",
    },
    atracciones: {
      title: "Atracciones en Las Vegas | Latino LV",
      description: "Las mejores atracciones y cosas que hacer en Las Vegas. Experiencias únicas, aventuras y actividades para toda la familia.",
    },
  };

  useEffect(() => {
    const seo = catSeo[activeCat] || { title: "Explorar Las Vegas | Latino LV", description: "Tu guía en español de Las Vegas." };
    document.title = seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", seo.description);
    return () => {
      document.title = "Latino LV — Guía en Español de Las Vegas";
    };
  }, [activeCat]);

  const { search, setSearch, filters, setFilters, categoryFilters, setCategoryFilters, clearAll, results } = useListingFilters(catListings, activeCat);

  // Smart search: detect cuisine keywords and auto-activate filters
  const STOPWORDS = new Set(["en", "el", "la", "los", "las", "de", "del", "un", "una"]);
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (!value.trim() || activeCat !== "restaurantes") return;
    const tokens = value.toLowerCase().split(/\s+/).filter(t => !STOPWORDS.has(t) && t.length >= 3);
    for (const cuisine of taxonomyCuisines) {
      const cName = cuisine.name.toLowerCase();
      if (tokens.some(t => cName.includes(t) || t.includes(cName))) {
        setCategoryFilters(prev => {
          if (prev.cuisines.has(cuisine.name)) return prev;
          return { ...prev, cuisines: new Set([...prev.cuisines, cuisine.name]) };
        });
        if (!showFilters) setShowFilters(true);
        break;
      }
    }
  }, [activeCat, taxonomyCuisines, setSearch, setCategoryFilters, showFilters]);

  // Set initial search from URL
  useState(() => { if (initialQ) setSearch(initialQ); });

  // Apply initial cocina slug from URL: resolve slug→name, set cat + cuisine filter
  const [cocinaApplied, setCocinaApplied] = useState(false);
  useEffect(() => {
    if (initialCocinaSlug && taxonomyCuisines.length > 0 && !cocinaApplied) {
      const match = taxonomyCuisines.find(c => c.slug === initialCocinaSlug);
      if (match) {
        setActiveCat("restaurantes");
        setCategoryFilters(prev => ({ ...prev, cuisines: new Set([match.name]) }));
        setShowFilters(true);
      }
      setCocinaApplied(true);
    }
  }, [initialCocinaSlug, taxonomyCuisines, cocinaApplied]);

  // Apply initial zona slug from URL: resolve slug→name, set zone filter
  const [zonaApplied, setZonaApplied] = useState(false);
  useEffect(() => {
    if (initialZonaSlug && taxonomyZones.length > 0 && !zonaApplied) {
      const match = taxonomyZones.find(z => z.slug === initialZonaSlug);
      if (match) {
        setFilters(prev => ({ ...prev, zones: new Set([match.name]) }));
        setShowFilters(true);
      }
      setZonaApplied(true);
    }
  }, [initialZonaSlug, taxonomyZones, zonaApplied]);

  // Apply initial abierto from URL
  const [abiertoApplied, setAbiertoApplied] = useState(false);
  useEffect(() => {
    if (initialAbierto && !abiertoApplied) {
      setFilters(prev => ({ ...prev, openNow: true }));
      setShowFilters(true);
      setAbiertoApplied(true);
    }
  }, [initialAbierto, abiertoApplied]);

  // Apply initial resort slug from URL: resolve slug→id, set resort filter
  const [resortApplied, setResortApplied] = useState(false);
  useEffect(() => {
    if (initialResort && allListings.length > 0 && !resortApplied) {
      const match = allListings.find(l => l.slug === initialResort);
      if (match) {
        setFilters(prev => ({ ...prev, resorts: new Set([String(match.id)]) }));
        setShowFilters(true);
      }
      setResortApplied(true);
    }
  }, [initialResort, allListings, resortApplied]);

  // Apply initial tipo slug from URL: resolve slug→name, set venueTypes or experienceTypes filter
  const [tipoApplied, setTipoApplied] = useState(false);
  const allTipoTaxonomies = [...taxonomyVenueTypes, ...taxonomyAttractionTypes, ...taxonomyShowTypes];
  useEffect(() => {
    if (initialTipoSlug && !tipoApplied && allTipoTaxonomies.length > 0) {
      // Try venue type first (nocturna)
      const venueMatch = taxonomyVenueTypes.find(v => v.slug === initialTipoSlug);
      if (venueMatch) {
        setCategoryFilters(prev => ({ ...prev, venueTypes: new Set([venueMatch.name]) }));
        setShowFilters(true);
      } else {
        // Try attraction or show type
        const expMatch = allTipoTaxonomies.find(v => v.slug === initialTipoSlug || v.name === initialTipoSlug);
        if (expMatch) {
          setCategoryFilters(prev => ({ ...prev, experienceTypes: new Set([expMatch.name]) }));
          setShowFilters(true);
        }
      }
      setTipoApplied(true);
    }
  }, [initialTipoSlug, allTipoTaxonomies.length, tipoApplied]);

  const openNowCats = new Set(["restaurantes", "nocturna"]);
  const hideOpenNow = !openNowCats.has(activeCat);

  // Reset ALL filters only when user manually switches category tabs (not on initial load)
  const isInitialCat = useRef(true);
  useEffect(() => {
    if (isInitialCat.current) {
      isInitialCat.current = false;
      return;
    }
    setCategoryFilters(emptyCategoryFilters);
    setFilters({ prices: new Set(), zones: new Set(), highlights: new Set(), openNow: false, sort: "stars", resorts: new Set() });
    setSearch("");
  }, [activeCat]);

  // Reset page when filters, search, or category change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCat, filters, categoryFilters, search]);

  const activeFilterCount = filters.prices.size + filters.zones.size + filters.resorts.size + (filters.openNow ? 1 : 0);
  const activeCatFilterCount = categoryFilters.starRatings.size + categoryFilters.cuisines.size +
    (categoryFilters.showDate ? 1 : 0) + categoryFilters.admissionTypes.size +
    categoryFilters.venueTypes.size + categoryFilters.musicGenres.size +
    categoryFilters.experienceTypes.size;
  const totalFilterCount = activeFilterCount + activeCatFilterCount;

  // Shuffle helper (Fisher-Yates)
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Tier ranking: Seleccionado (max 3 shuffled), Destacado (distributed), rest normal
  // Re-shuffle when activeCat changes by including it in deps
  // Unified list: sponsored first, then featured distributed among normal
  const allResults = useMemo(() => {
    const sponsored = shuffle(results.filter(l => l.isSponsored)).slice(0, 3);
    const featured = shuffle(results.filter(l => l.isFeatured && !l.isSponsored));
    const normal = results.filter(l => !l.isFeatured && !l.isSponsored);

    // Distribute featured at random positions among normal listings
    const merged: typeof normal = [...normal];
    for (let fIdx = 0; fIdx < featured.length; fIdx++) {
      const minPos = Math.min(3 + fIdx * 2, merged.length);
      const pos = minPos + Math.floor(Math.random() * Math.max(1, merged.length - minPos + 1));
      merged.splice(Math.min(pos, merged.length), 0, featured[fIdx]);
    }

    return [...sponsored, ...merged];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, activeCat]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(allResults.length / itemsPerPage));
  const paginatedResults = allResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <Navbar />

      {/* Compact Hero */}
      <div className="pt-[100px] max-lg:pt-[84px] pb-10 max-lg:pb-1 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(196,34,41,0.12)_0%,transparent_60%),linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)]">
        <div className="container text-center">
          <h1 className="font-display text-[48px] md:text-[64px] max-lg:text-[36px] tracking-[3px] leading-[0.9] mb-3 max-lg:mb-1.5 text-dark-text">
            {(catHeroContent[activeCat]?.title ?? <>EXPLORA <span className="text-red">LAS VEGAS</span></>)}
          </h1>
          <p className="text-[15px] max-lg:text-[13px] text-dark-text-muted mb-6 max-lg:mb-3">{catHeroContent[activeCat]?.subtitle ?? "Encuentra qué hacer, dónde comer y a dónde salir en Las Vegas."}</p>
          <div className="flex max-w-[720px] mx-auto bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.18)] rounded-lg overflow-hidden focus-within:border-[rgba(255,255,255,0.35)] transition-colors">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={catPlaceholders[activeCat] || catPlaceholders[""]}
              className="flex-1 bg-transparent border-none outline-none px-5 py-3.5 text-dark-text font-body text-[15px] placeholder:text-dark-text-muted"
            />
            <button className="bg-red border-none px-6 py-3.5 text-primary-foreground font-condensed text-sm font-bold tracking-[1px] uppercase cursor-pointer hover:bg-red-light transition-colors">
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* Sticky control bar */}
      <div className="bg-background">
        <div className="container">
          {/* === MOBILE LAYOUT (unchanged) === */}
          <div className="lg:hidden flex flex-col items-stretch gap-0">
            {/* Category tabs */}
            <div className="relative border-b border-border">
              <div ref={tabsRef} className="relative flex items-center overflow-x-auto -mb-px flex-1 min-w-0 scrollbar-hide px-3" style={{ WebkitOverflowScrolling: 'touch' }}>
                {catTabs.map((tab) => (
                  <button
                    key={tab.key}
                    data-active={activeCat === tab.key}
                    onClick={() => setActiveCat(tab.key)}
                    className={`relative px-3 py-2.5 text-[13px] tracking-[0.5px] border-b-[3px] border-transparent transition-colors whitespace-nowrap font-body shrink-0 ${
                      activeCat === tab.key
                        ? "font-bold text-red bg-red/[0.06]"
                        : "font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <span
                  className="absolute bottom-0 h-[3px] bg-red rounded-full transition-all duration-300 ease-out"
                  style={{ left: underline.left, width: underline.width }}
                />
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-4 pointer-events-none bg-gradient-to-l from-background to-transparent z-10" />
            </div>

            {/* Mobile controls row */}
            <div className="flex items-center gap-1.5 py-1.5">
              <button
                onClick={() => setViewMode(viewMode === "map" ? "grid" : "map")}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md text-[12px] font-semibold transition-all font-body border ${
                  viewMode === "map"
                    ? "bg-background text-foreground shadow-sm border-border"
                    : "bg-muted/50 text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                Mapa
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md text-[12px] font-semibold transition-all font-body ${
                  showFilters || totalFilterCount > 0
                    ? "bg-red/10 text-red border border-red/30"
                    : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted hover:text-foreground"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>
                Filtros
                {totalFilterCount > 0 && (
                  <span className="bg-red text-primary-foreground text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                    {totalFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* === DESKTOP LAYOUT === */}
          <div className="hidden lg:block">
            {/* Row 1: Category tabs + Grid/Map toggle */}
            <div className="flex items-center justify-between">
              <div className="relative">
                <div ref={tabsRef} className="relative flex items-center overflow-x-auto -mb-px flex-1 min-w-0 scrollbar-hide">
                  {catTabs.map((tab) => (
                    <button
                      key={tab.key}
                      data-active={activeCat === tab.key}
                      onClick={() => setActiveCat(tab.key)}
                      className={`relative px-5 py-3.5 text-[13px] tracking-[0.5px] border-b-[3px] border-transparent transition-colors whitespace-nowrap font-body shrink-0 ${
                        activeCat === tab.key
                          ? "font-bold text-red bg-red/[0.06]"
                          : "font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                  <span
                    className="absolute bottom-0 h-[3px] bg-red rounded-full transition-all duration-300 ease-out"
                    style={{ left: underline.left, width: underline.width }}
                  />
                </div>
              </div>

              <div className="flex items-center rounded-md overflow-hidden shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-all font-body ${
                    viewMode === "grid" ? "text-foreground/70" : "text-muted-foreground/60 hover:text-muted-foreground"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium transition-all font-body ${
                    viewMode === "map" ? "text-foreground/70" : "text-muted-foreground/60 hover:text-muted-foreground"
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  Mapa
                </button>
              </div>
            </div>

            {/* Row 2: Results count + Filtros + Sort */}
            <div className="flex items-center justify-between border-t border-border/50 py-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span><strong className="text-foreground">{results.length}</strong> resultado{results.length !== 1 ? 's' : ''}</span>
                {totalFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors font-body underline underline-offset-2"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              <div className="flex items-center gap-0 shrink-0">

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all font-body ${
                    showFilters || totalFilterCount > 0
                      ? "bg-red/8 text-red/80"
                      : "text-muted-foreground/60 hover:text-muted-foreground"
                  }`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>
                  Filtros
                  {totalFilterCount > 0 && (
                    <span className="bg-red text-primary-foreground text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                      {totalFilterCount}
                    </span>
                  )}
                </button>

                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="bg-transparent text-muted-foreground/60 pl-1 pr-2 py-1.5 font-body text-[12px] font-medium outline-none cursor-pointer border-none"
                >
                  <option value="stars">Mejor calificados</option>
                  <option value="name">Nombre A–Z</option>
                  <option value="price-low">Precio: menor a mayor</option>
                  <option value="price-high">Precio: mayor a menor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Collapsible filter panel */}
          {showFilters && (
            <div className="pb-3 pt-2.5 border-t border-border mt-0 animate-in slide-in-from-top-2 duration-200">
              <FilterBar
                filters={filters}
                onUpdate={setFilters}
                hideOpenNow={hideOpenNow}
                allListings={allListings}
                catListings={catListings}
                totalFilterCount={totalFilterCount}
                onClearAll={clearAll}
              />

              {activeCat && (
                <div className="mt-2.5">
                  <CategoryFilters
                    cat={activeCat}
                    filters={categoryFilters}
                    onUpdate={setCategoryFilters}
                    listings={allListings}
                  />
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="pt-12 pb-8 max-lg:pt-8 max-lg:pb-4 bg-background min-h-[60vh]">
        <div className="container">
          {/* Mobile results count */}
          <div className="lg:hidden mb-2.5 text-[13px] text-muted-foreground font-medium">
            <strong className="text-foreground">{results.length}</strong> resultado{results.length !== 1 ? 's' : ''}
          </div>

          {viewMode === "map" ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <Map className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <div className="font-display text-[28px] tracking-[2px] text-muted-foreground mb-2">MAPA</div>
              <p className="text-sm text-muted-foreground">Vista de mapa próximamente</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 opacity-40">🔍</div>
              <div className="font-display text-[32px] tracking-[2px] text-muted-foreground mb-2">Sin Resultados</div>
              <div className="text-sm text-muted-foreground mb-4">Intenta con otros filtros</div>
              {totalFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm font-semibold text-red hover:text-red-light transition-colors"
                >
                  Limpiar filtros →
                </button>
              )}
            </div>
          ) : (
            <div key={activeCat} className="animate-fade-in">
              {/* Mobile grid */}
              <div className="lg:hidden">
                {paginatedResults.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {paginatedResults.map((l) => <ListingCard key={l.id} listing={l} featured={l.isSponsored || l.isFeatured} activeCat={activeCat} />)}
                  </div>
                )}
              </div>

              {/* Desktop grid */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-3 gap-6">
                  {paginatedResults.map((l) => <ListingCard key={l.id} listing={l} featured={l.isSponsored || l.isFeatured} activeCat={activeCat} />)}
                </div>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-10 pt-6 border-t border-border/30">
                  <button
                    onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-medium font-body transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>

                  {getPageNumbers().map((page, i) =>
                    page === '...' ? (
                      <span key={`dots-${i}`} className="px-2 py-2 text-[13px] text-muted-foreground/50">…</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`min-w-[36px] h-[36px] rounded-md text-[13px] font-semibold font-body transition-all ${
                          currentPage === page
                            ? "bg-red text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-medium font-body transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

import { Suspense } from "react";
export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExplorePageInner />
    </Suspense>
  );
}
