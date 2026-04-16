"use client";
"use client";
import { useMemo } from "react";
const heroVegas = "/hero-vegas.jpg";
import { getDailyOfertaListings } from "@/lib/dailyOferta";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, UtensilsCrossed, Theater, Moon, Compass } from "lucide-react";
import { useListings } from "@/hooks/useListings";
import { DEFAULT_LISTINGS } from "@/data/listings";
import ListingCard from "@/components/ListingCard";
import SectionHeader from "@/components/SectionHeader";
import HeroSearch from "@/components/HeroSearch";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categoryColors: Record<string, { text: string; border: string; bg: string; badge: string; icon: string; cta: string }> = {
  hoteles: { text: "text-[#60A5FA]", border: "border-[rgba(96,165,250,0.35)]", bg: "bg-[rgba(96,165,250,0.08)]", badge: "bg-[rgba(96,165,250,0.15)] border-[rgba(96,165,250,0.30)]", icon: "text-[rgba(147,197,253,0.78)]", cta: "text-[rgba(147,197,253,0.85)] group-hover:text-[#93C5FD]" },
  restaurantes: { text: "text-[#F87171]", border: "border-[rgba(248,113,113,0.35)]", bg: "bg-[rgba(248,113,113,0.08)]", badge: "bg-[rgba(248,113,113,0.15)] border-[rgba(248,113,113,0.30)]", icon: "text-[rgba(252,165,165,0.78)]", cta: "text-[rgba(252,165,165,0.85)] group-hover:text-[#FCA5A5]" },
  shows: { text: "text-[#FB923C]", border: "border-[rgba(251,146,60,0.35)]", bg: "bg-[rgba(251,146,60,0.08)]", badge: "bg-[rgba(251,146,60,0.15)] border-[rgba(251,146,60,0.30)]", icon: "text-[rgba(253,186,116,0.78)]", cta: "text-[rgba(253,186,116,0.85)] group-hover:text-[#FDBA74]" },
  nocturna: { text: "text-[#C084FC]", border: "border-[rgba(192,132,252,0.35)]", bg: "bg-[rgba(192,132,252,0.08)]", badge: "bg-[rgba(192,132,252,0.15)] border-[rgba(192,132,252,0.30)]", icon: "text-[rgba(216,180,254,0.78)]", cta: "text-[rgba(216,180,254,0.85)] group-hover:text-[#D8B4FE]" },
  atracciones: { text: "text-[#4ADE80]", border: "border-[rgba(74,222,128,0.35)]", bg: "bg-[rgba(74,222,128,0.08)]", badge: "bg-[rgba(5,46,22,0.85)] border-[rgba(74,222,128,0.25)] text-white", icon: "text-[rgba(134,239,172,0.78)]", cta: "text-[rgba(134,239,172,0.85)] group-hover:text-[#86EFAC]" },
};

const categoryUnits: Record<string, string> = {
  hoteles: "hoteles",
  restaurantes: "restaurantes",
  shows: "eventos",
  nocturna: "lugares",
  atracciones: "atracciones",
};

const categories = [
  { key: "hoteles", path: "/hoteles", label: "Hoteles & Casinos", desc: "Resorts, casinos y hospedajes destacados en Las Vegas.", bg: "bg-gradient-to-br from-[#020818] via-[#0c1a4a] to-[#3B82F6]", icon: Building2 },
  { key: "restaurantes", path: "/restaurantes", label: "Restaurantes", desc: "Los mejores restaurantes en Las Vegas, desde tacos hasta alta cocina.", bg: "bg-gradient-to-br from-[#180404] via-[#5a1212] to-[#EF4444]", icon: UtensilsCrossed },
  { key: "shows", path: "/explorar?cat=shows", label: "Shows & Eventos", desc: "Conciertos, residencias y espectáculos en Las Vegas.", bg: "bg-gradient-to-br from-[#1a0802] via-[#8a3a00] to-[#FB923C]", icon: Theater },
  { key: "nocturna", path: "/explorar?cat=nocturna", label: "Vida Nocturna", desc: "Discotecas, bares y lounges para disfrutar la noche.", bg: "bg-gradient-to-br from-[#0d031a] via-[#4a1a8a] to-[#A855F7]", icon: Moon },
  { key: "atracciones", path: "/atracciones", label: "Atracciones", desc: "Tours, museos, miradores y experiencias únicas.", bg: "bg-gradient-to-br from-[#011a08] via-[#0c7535] to-[#4ADE80]", icon: Compass },
];

export default function HomePage() {
  const router = useRouter();
  const { data: allListings = DEFAULT_LISTINGS } = useListings();

  const searchActionSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Latino Las Vegas",
    url: "https://latinolasvegas.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://latinolasvegas.com/explorar?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const sponsoredListings = useMemo(() => allListings.filter(l => l.isSponsored).slice(0, 4), [allListings]);
  // Shared sort: reviews DESC → rating DESC → name ASC
  const byReviews = (a: typeof allListings[0], b: typeof allListings[0]) => {
    const ar = a.googleUserRatingsTotal ?? 0;
    const br = b.googleUserRatingsTotal ?? 0;
    if (br !== ar) return br - ar;
    const ratingDiff = (b.googleRating ?? 0) - (a.googleRating ?? 0);
    if (ratingDiff !== 0) return ratingDiff;
    return a.name.localeCompare(b.name);
  };

  const hotels = allListings.filter(l => l.cat === "hoteles").sort(byReviews).slice(0, 6);
  const restaurants = allListings.filter(l => l.cat === "restaurantes").sort(byReviews).slice(0, 6);
  const shows = allListings.filter(l => l.cat === "shows").sort(byReviews).slice(0, 6);
  const nightlife = allListings.filter(l => l.cat === "nocturna").sort(byReviews).slice(0, 6);
  const attractions = allListings.filter(l => l.cat === "atracciones").sort(byReviews).slice(0, 6);

  // Trending: score & pick top 4, strict data-driven badges
  const trendingWithBadges = useMemo(() => {
    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    type ScoredItem = { listing: typeof allListings[0]; score: number; sortKey: number };

    const withImages = allListings.filter(l => !!l.image);

    // Build buckets — strict data-based eligibility only
    const buckets: Record<string, ScoredItem[]> = {
      Evento: [],
      Oferta: [],
      Nuevo: [],
      Tendencia: [],
      Fallback: [],
    };

    // Daily rotating Oferta picks (based on Happy Hour)
    const dailyOfertas = getDailyOfertaListings(withImages, 3);
    const dailyOfertaIds = new Set(dailyOfertas.map(l => l.id));

    for (const listing of withImages) {
      const hasFutureEvent = listing.cat === "shows" && listing.startDatetime && new Date(listing.startDatetime) > now;
      const isOferta = dailyOfertaIds.has(listing.id);
      const isNew = listing.createdAt && new Date(listing.createdAt) > fourteenDaysAgo;
      const isManualTrending = listing.trendingTag === "trending";

      // Manual tags boost priority but must pass the same data check
      const manualBoost = listing.trendingTag ? 50 : 0;

      if (hasFutureEvent) {
        const start = new Date(listing.startDatetime!);
        buckets.Evento.push({ listing, score: 80 + manualBoost, sortKey: -start.getTime() });
      }
      if (isOferta) {
        buckets.Oferta.push({ listing, score: 50 + manualBoost, sortKey: listing.googleUserRatingsTotal ?? 0 });
      }
      if (isNew) {
        buckets.Nuevo.push({ listing, score: 60 + manualBoost, sortKey: new Date(listing.createdAt!).getTime() });
      }
      if (isManualTrending) {
        buckets.Tendencia.push({ listing, score: 100, sortKey: listing.googleUserRatingsTotal ?? 0 });
      }

      // Everyone is a fallback candidate
      let fbScore = 0;
      if (listing.isFeatured) fbScore += 15;
      if (listing.isSponsored) fbScore += 10;
      fbScore += Math.min((listing.googleUserRatingsTotal ?? 0) / 100, 20);
      fbScore += (listing.googleRating ?? 0) * 2;
      buckets.Fallback.push({ listing, score: fbScore, sortKey: fbScore });
    }

    // Sort each bucket
    for (const key of Object.keys(buckets)) {
      buckets[key].sort((a, b) => {
        if (key === "Evento") return a.sortKey - b.sortKey; // nearest date first
        return b.sortKey - a.sortKey;
      });
    }

    // Pick 1 per badge type AND 1 per category, 4 total
    const usedIds = new Set<string | number>();
    const usedCats = new Set<string>();
    const result: { listing: typeof allListings[0]; badge: string }[] = [];
    const priorityOrder = ["Evento", "Oferta", "Nuevo", "Tendencia"];

    // Pass 1: one from each qualified bucket, strict unique category
    for (const type of priorityOrder) {
      if (result.length >= 4) break;
      for (const item of buckets[type]) {
        if (usedIds.has(item.listing.id) || usedCats.has(item.listing.cat)) continue;
        usedIds.add(item.listing.id);
        usedCats.add(item.listing.cat);
        result.push({ listing: item.listing, badge: type });
        break;
      }
    }

    // Pass 2: fill remaining with fallback, prefer unique categories
    // Fallback listings get NO badge to preserve Tendencia trust
    if (result.length < 4) {
      // Build a quality-ranked fallback list: prefer recent, complete, featured
      const rankedFallback = buckets.Fallback
        .map(item => {
          let rank = item.score;
          // Boost recently added listings
          if (item.listing.createdAt) {
            const age = now.getTime() - new Date(item.listing.createdAt).getTime();
            const daysSinceCreation = age / (1000 * 60 * 60 * 24);
            if (daysSinceCreation < 30) rank += 20 - (daysSinceCreation / 30) * 20;
          }
          // Boost content completeness
          if (item.listing.about) rank += 5;
          if (item.listing.galleryImages && item.listing.galleryImages.length >= 2) rank += 5;
          if (item.listing.description && item.listing.description.length > 80) rank += 3;
          return { ...item, rank };
        })
        .sort((a, b) => b.rank - a.rank);

      for (const item of rankedFallback) {
        if (result.length >= 4) break;
        if (usedIds.has(item.listing.id) || usedCats.has(item.listing.cat)) continue;
        usedIds.add(item.listing.id);
        usedCats.add(item.listing.cat);
        result.push({ listing: item.listing, badge: "" });
      }
    }
    // Last resort: allow duplicate categories
    if (result.length < 4) {
      for (const item of buckets.Fallback) {
        if (result.length >= 4) break;
        if (usedIds.has(item.listing.id)) continue;
        usedIds.add(item.listing.id);
        result.push({ listing: item.listing, badge: "" });
      }
    }

    return result;
  }, [allListings]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 md:px-12 pt-[120px] pb-[140px] overflow-visible z-20">
        {/* Background wrapper — overflow-hidden so image+overlays never exceed section bounds */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroVegas}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-[65%_center] blur-[1px] brightness-[0.5] contrast-[1.15] saturate-[1.1] scale-105"
          />
          {/* Gradient overlay — same container as image */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/20" />
          {/* Vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_120px_40px_rgba(0,0,0,0.4)]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(232,39,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(232,39,42,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_85%_80%_at_50%_50%,black_0%,transparent_75%)]" />
        </div>

        <div className="relative z-10 max-w-[820px]">
          <div className="animate-fade-up inline-flex items-center gap-2 bg-gold/[0.08] border border-gold/[0.18] rounded-full px-4 py-1.5 text-[10px] font-semibold tracking-[2.5px] uppercase text-gold-dark mb-8 backdrop-blur-sm">
            <span className="w-[6px] h-[6px] bg-gold-dark/80 rounded-full shadow-[0_0_6px_hsl(var(--gold)/0.35)] animate-pulse-dot" />
            Tu guía en español · Las Vegas, NV
          </div>

          <h1 className="animate-fade-up-1 font-display text-[clamp(72px,12vw,140px)] leading-[0.88] tracking-[4px] mb-3 text-dark-text drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            EXPLORA<br />
            <span className="text-transparent [-webkit-text-stroke:2.5px_hsl(0,72%,42%)] [text-shadow:0_0_40px_rgba(180,30,30,0.4),0_0_80px_rgba(180,30,30,0.18)]">LAS VEGAS</span>
          </h1>

          <p className="animate-fade-up-2 text-lg text-dark-text-2 mb-[40px] font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            Restaurantes, bares, shows y experiencias — todo en un solo lugar
          </p>

          <div className="[&>div]:shadow-[0_12px_48px_rgba(0,0,0,0.45)]">
            <HeroSearch allListings={allListings} />
          </div>

          <div className="mt-8 flex items-center justify-center">
            <p className="text-xs tracking-widest uppercase text-gold-dark/60 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
              Hecho para la comunidad latina en Las Vegas
            </p>
          </div>

        </div>
      </section>
      {/* Hero-to-content fade transition */}
      <div className="relative z-10 h-16 -mt-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />

      {/* Sponsored Featured Row */}
      {sponsoredListings.length > 0 && (
        <section className="py-14 bg-background border-b border-border">
          <div className="container">
            <SectionHeader eyebrow="Negocios destacados" title="Recomendados Para Ti" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sponsoredListings.map((l) => <ListingCard key={l.id} listing={l} featured />)}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-14 bg-background">
        <div className="container">
          <SectionHeader eyebrow="Explora por categoría" title="Encuentra Tu Experiencia" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-11">
            {categories.map((c) => (
              <Link
                key={c.key}
                href={c.path}
                className="group relative rounded-xl overflow-hidden aspect-[3/4] cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <div className={`absolute inset-0 ${c.bg} transition-all duration-500 group-hover:scale-110 group-hover:brightness-[1.15]`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative z-10 flex-1" />
                {(() => {
                  const count = allListings.filter(l => l.cat === c.key).length;
                  const colors = categoryColors[c.key];
                  if (count === 0) return null;
                  const hasCustomText = colors?.badge?.includes("text-");
                  return (
                    <div className={`absolute top-3 left-3 ${colors?.badge ?? "bg-[rgba(255,255,255,0.10)] border-[rgba(255,255,255,0.18)]"} border rounded-full px-3 py-1 text-[10px] font-bold tracking-[1.5px] uppercase ${hasCustomText ? "" : "text-[rgba(255,255,255,0.75)]"}`}>
                      {count} {categoryUnits[c.key]}
                    </div>
                  );
                })()}
                <div className="relative z-10 p-4 pb-6">
                  <c.icon size={22} strokeWidth={1.5} className={`mb-3 ${categoryColors[c.key]?.icon ?? "text-white/75"}`} />
                  <span className="font-condensed text-lg font-bold text-primary-foreground block mb-1">{c.label}</span>
                  <span className="text-[11px] text-[rgba(255,255,255,0.6)] block mb-3 leading-[1.4]">{c.desc}</span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold tracking-[1.5px] uppercase transition-all duration-300 group-hover:tracking-[2px] ${categoryColors[c.key]?.cta ?? "text-[rgba(255,255,255,0.8)] group-hover:text-white"}`}>
                    Explorar <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tendencias */}
      {trendingWithBadges.length > 0 && (() => {
        const [hero, ...supporting] = trendingWithBadges;
        return (
          <section className="py-14 bg-background">
            <div className="container">
              <SectionHeader
                eyebrow="Lo más popular ahora"
                title="Tendencias en Las Vegas"
                subtitle="Promociones, eventos y los lugares que más están dando de qué hablar."
              />
              {/* Hero card — full-width horizontal */}
              <Link
                href={`/lugar/${hero.listing.slug}`}
                className="group relative block w-full rounded-xl overflow-hidden border border-border shadow-card transition-all duration-300 lg:hover:shadow-[0_8px_32px_rgba(0,0,0,0.14)] lg:hover:border-foreground/12 lg:hover:-translate-y-0.5"
              >
                <div className="relative w-full aspect-[16/7] sm:aspect-[16/6]">
                  <img
                    src={hero.listing.image}
                    alt={hero.listing.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out lg:group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                  {/* Badge */}
                  {(() => {
                    const b = hero.badge;
                    const cls =
                      b === "Oferta" ? "bg-red text-white shadow-[0_1px_6px_rgba(196,34,41,0.4)]" :
                      b === "Evento" ? "bg-[hsl(0,0%,7%,0.92)] text-white shadow-[0_1px_4px_rgba(0,0,0,0.25)]" :
                      b === "Nuevo" ? "bg-[hsl(0,0%,100%,0.92)] text-[hsl(0,0%,7%)] shadow-[0_1px_6px_rgba(0,0,0,0.2)]" :
                      "bg-[hsl(0,0%,15%,0.75)] text-white/95 shadow-[0_1px_4px_rgba(0,0,0,0.2)]";
                    return (
                      <div className={`absolute top-4 left-4 text-[10px] px-[10px] py-[6px] rounded-full font-semibold tracking-[1.5px] uppercase backdrop-blur-[2px] ${cls}`}>
                        {b}
                      </div>
                    );
                  })()}

                  {/* Content overlay — bottom-left */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                    <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-white/60 mb-1.5">
                      {(() => {
                        const l = hero.listing;
                        return l.cat === 'nocturna' ? [l.venueType?.[0], l.musicGenres?.[0]].filter(Boolean).join(' • ') || l.catLabel :
                          l.cat === 'restaurantes' && l.cuisine?.length ? `Restaurante · ${l.cuisine[0]}` :
                          l.cat === 'hoteles' && l.stars ? `${l.catLabel} · ${l.stars}★` :
                          l.cat === 'atracciones' ? (l.catLabel ? `Atracción · ${l.catLabel}` : 'Atracción') :
                          l.catLabel || '';
                      })()}
                    </div>
                    <h3 className="font-condensed text-[26px] sm:text-[32px] lg:text-[38px] font-extrabold leading-[1.05] text-white mb-1.5 transition-colors duration-300 lg:group-hover:text-gold-light">
                      {hero.listing.name}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-white/70 italic leading-[1.5] line-clamp-2 max-w-[600px]">
                      {hero.listing.tagline || hero.listing.desc}
                    </p>
                    <div className="flex items-center gap-3 mt-2.5 text-[13px] text-white/80">
                      {hero.listing.price && (
                        <span className="font-bold tracking-[1px] text-white/65">{hero.listing.price}</span>
                      )}
                      {hero.listing.googleRating != null && (
                        <span className="font-semibold">
                          <span className="text-gold">★</span> {hero.listing.googleRating.toFixed(1)}
                        </span>
                      )}
                      {hero.listing.region && (
                        <span className="text-white/55">{hero.listing.region}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Supporting cards — 3-column grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8 lg:mt-10">
                {supporting.map(({ listing: l, badge }) => (
                  <ListingCard key={l.id} listing={l} trendBadge={badge} />
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Hotels */}
      {/* Hotels */}
       <section className="py-14 bg-background">
        <div className="container">
          <SectionHeader
            eyebrow="Alojamiento destacado"
            title="Hoteles & Casinos"
            subtitle="Descubre hoteles y casinos icónicos de Las Vegas, desde el Strip hasta los resorts locales."
            viewAllLink="/explorar?cat=hoteles"
            viewAllLabel="Ver todos los hoteles →"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hotels.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      </section>

      {/* Restaurants */}
      {/* Restaurants */}
      <section className="py-14 bg-background">
        <div className="container">
          <SectionHeader eyebrow="Sabores imperdibles" title="Restaurantes" subtitle="Explora los sabores más destacados de Las Vegas, desde restaurantes icónicos hasta joyas locales." viewAllLink="/explorar?cat=restaurantes" viewAllLabel="Ver todos los restaurantes →" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
            {restaurants.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      </section>

      {/* Why us belt */}
      <div className="bg-dark-2 border-y border-border/[0.05] py-14">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">¿Por qué Latino Las Vegas?</div>
              <div className="font-display text-[52px] tracking-[2px] leading-[0.95] text-dark-text mb-4">Hecho Para La Comunidad</div>
              <p className="text-dark-text-2 leading-relaxed mb-6">Todo el contenido está curado en español, pensado para visitantes y residentes latinos que quieren vivir Las Vegas al máximo — sin barreras.</p>
              <Link href="/explorar" className="inline-flex items-center gap-1.5 font-condensed text-sm font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-light hover:-translate-y-px transition-all">
                Explorar ahora →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🇲🇽", name: "100% en Español", sub: "Toda la guía en tu idioma" },
                { icon: "⭐", name: "Reseñas Reales", sub: "Opiniones de la comunidad" },
                { icon: "📍", name: "Mapa Interactivo", sub: "Encuentra lugares cercanos" },
                { icon: "🔔", name: "Alertas de Eventos", sub: "No te pierdas nada" },
              ].map((f) => (
                <div key={f.name} className="bg-dark-3 border border-[hsl(var(--dark-border))] rounded-lg p-5 text-center">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="font-condensed text-[15px] font-bold text-dark-text mb-1">{f.name}</div>
                  <div className="text-[11px] text-dark-text-muted italic">{f.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shows */}
      <section className="py-14 bg-background">
        <div className="container">
          <SectionHeader eyebrow="Espectáculos en vivo" title="Shows & Eventos" subtitle="Descubre los mejores espectáculos en Las Vegas" viewAllLink="/explorar?cat=shows" viewAllLabel="Ver todos los shows →" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shows.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      </section>

      {/* Vida Nocturna */}
      <section className="py-14 bg-background">
        <div className="container">
          <SectionHeader eyebrow="Noches inolvidables" title="Vida Nocturna" subtitle="Descubre clubes, bares y lounges que definen la noche en Las Vegas." viewAllLink="/explorar?cat=nocturna" viewAllLabel="Ver toda la vida nocturna →" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {nightlife.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      </section>

      {/* Atracciones */}
      <section className="py-14 bg-background">
        <div className="container">
          <SectionHeader eyebrow="Experiencias únicas" title="Atracciones" subtitle="Tours, experiencias y actividades únicas que no te puedes perder." viewAllLink="/explorar?cat=atracciones" viewAllLabel="Ver todas las atracciones →" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {attractions.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 text-center relative overflow-hidden bg-cream-2">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(196,34,41,0.05)_0%,transparent_70%)]" />
        <div className="relative max-w-[540px] mx-auto px-6">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">Newsletter</div>
          <div className="font-display text-[56px] tracking-[2px] mb-3">Mantente Al Día</div>
          <p className="text-muted-foreground mb-8 leading-relaxed">Los mejores eventos, lugares y planes en Las Vegas — directo a tu correo.</p>
          <div className="flex rounded-sm overflow-hidden border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,0.06)] focus-within:border-red/35 focus-within:shadow-[0_4px_20px_rgba(196,34,41,0.08)] transition-all">
            <input type="email" placeholder="tucorreo@email.com" className="flex-1 bg-transparent border-none outline-none px-5 py-3.5 font-body text-[15px] placeholder:text-muted-foreground" />
            <button className="bg-red border-none px-6 py-3.5 text-primary-foreground font-condensed text-sm font-bold tracking-[1px] uppercase cursor-pointer hover:bg-red-light transition-colors">Suscribirse</button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Sin spam. Solo recomendaciones útiles.</p>
        </div>
      </section>

      <Footer />
    </>
  );
}
