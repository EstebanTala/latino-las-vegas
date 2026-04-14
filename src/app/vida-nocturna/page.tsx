"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useListings } from "@/hooks/useListings";
import ListingCard from "@/components/ListingCard";
import FilterBar from "@/components/FilterBar";
import { useListingFilters } from "@/hooks/useListingFilters";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const categoryConfig: Record<string, {
  cat: string;
  title: string;
  accent: string;
  eyebrow: string;
  subtitle: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  slug: string;
}> = {
  restaurantes: {
    cat: "restaurantes",
    title: "RESTAURANTES",
    accent: "EN LAS VEGAS",
    eyebrow: "Gastronomía latina y más",
    subtitle: "Desde tacos auténticos hasta alta cocina — los mejores restaurantes para la comunidad latina.",
    icon: "🍽️",
    metaTitle: "Restaurantes en Las Vegas en Español | Latino LV",
    metaDescription: "Descubre los mejores restaurantes latinos y más en Las Vegas. Guía en español con reseñas, horarios, precios y ubicación.",
    intro: "Las Vegas es mucho más que buffets. Aquí encontrarás restaurantes mexicanos, peruanos, colombianos y de todo el mundo — todos recomendados por la comunidad latina. Desde taquerías auténticas hasta experiencias de alta cocina, esta guía te ayuda a comer bien sin barreras de idioma.",
    slug: "restaurantes",
  },
  hoteles: {
    cat: "hoteles",
    title: "HOTELES",
    accent: "& CASINOS",
    eyebrow: "Donde quedarte en Las Vegas",
    subtitle: "Los mejores resorts, casinos y hoteles del Strip y más allá — con info en español.",
    icon: "🏨",
    metaTitle: "Hoteles & Casinos en Las Vegas en Español | Latino LV",
    metaDescription: "Guía de hoteles & casinos en Las Vegas en español. Resorts del Strip, precios, reseñas y tips para la comunidad latina.",
    intro: "Elegir dónde quedarte en Las Vegas puede ser abrumador. Esta guía en español te muestra los mejores hoteles & casinos del Strip y alrededores — con información de precios, amenidades y tips prácticos para que tu estadía sea inolvidable.",
    slug: "hoteles",
  },
  shows: {
    cat: "shows",
    title: "SHOWS",
    accent: "& EVENTOS",
    eyebrow: "Entretenimiento en vivo",
    subtitle: "Residencias, conciertos, espectáculos y eventos para toda la familia.",
    icon: "⭐",
    metaTitle: "Shows y Eventos en Las Vegas en Español | Latino LV",
    metaDescription: "Los mejores shows, conciertos y eventos en Las Vegas. Guía en español con horarios, precios y recomendaciones.",
    intro: "Las Vegas es la capital mundial del entretenimiento. Desde residencias de artistas latinos hasta espectáculos del Cirque du Soleil, aquí encontrarás los mejores shows y eventos — con toda la información que necesitas en español.",
    slug: "shows",
  },
  "vida-nocturna": {
    cat: "nocturna",
    title: "VIDA",
    accent: "NOCTURNA",
    eyebrow: "Clubs, bares & cócteles",
    subtitle: "Los mejores clubs del Strip, rooftop bars y coctelerías hasta el amanecer.",
    icon: "🍸",
    metaTitle: "Vida Nocturna en Las Vegas en Español | Latino LV",
    metaDescription: "Clubs, bares y vida nocturna en Las Vegas. Guía en español con los mejores lugares para salir de noche en el Strip.",
    intro: "Cuando el sol se pone, Las Vegas apenas comienza. Descubre los clubs más exclusivos del Strip, rooftop bars con vistas increíbles y coctelerías escondidas — todo con recomendaciones de la comunidad latina para que disfrutes la noche al máximo.",
    slug: "vida-nocturna",
  },
  atracciones: {
    cat: "atracciones",
    title: "ATRACCIONES",
    accent: "EN LAS VEGAS",
    eyebrow: "Tours, museos y experiencias",
    subtitle: "Museos, tours, miradores y experiencias únicas que no te puedes perder.",
    icon: "🌎",
    metaTitle: "Atracciones en Las Vegas en Español | Latino LV",
    metaDescription: "Las mejores atracciones en Las Vegas. Tours, museos, miradores y experiencias únicas — todo en español.",
    intro: "Las Vegas tiene mucho más que casinos. Explora tours al Gran Cañón, museos interactivos, miradores espectaculares y experiencias únicas — con guías y recomendaciones en español.",
    slug: "atracciones",
  },
};

export default function CategoryPage() {
  const pathname = usePathname();
  const category = pathname.replace("/", "");
  const config = categoryConfig[category || ""];
  const { data: allListings = [] } = useListings();

  const catListings = config
    ? [...allListings.filter(l => l.cat === config.cat)].sort((a, b) => {
        const tierA = a.isSponsored ? 2 : a.isFeatured ? 1 : 0;
        const tierB = b.isSponsored ? 2 : b.isFeatured ? 1 : 0;
        return tierB - tierA;
      })
    : [];

  const sponsoredInCat = useMemo(() => catListings.filter(l => l.isSponsored).slice(0, 2), [catListings]);

  const { search, setSearch, filters, setFilters, results } = useListingFilters(catListings);

  // Set meta tags
  useEffect(() => {
    if (!config) return;
    document.title = config.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", config.metaDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = config.metaDescription;
      document.head.appendChild(meta);
    }
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = `https://latinolasvegas.com/${config.slug}`;
    } else {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = `https://latinolasvegas.com/${config.slug}`;
      document.head.appendChild(link);
    }
    return () => {
      document.title = "Latino Las Vegas";
    };
  }, [config]);

  const jsonLd = config ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.metaTitle,
    description: config.metaDescription,
    url: `https://latinolasvegas.com/${config.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: catListings.length,
      itemListElement: catListings.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: l.name,
        url: `https://latinolasvegas.com/lugar/${l.slug}`,
      })),
    },
  } : null;

  if (!config) {
    return (
      <>
        <Navbar />
        <div className="pt-[180px] pb-20 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="font-display text-[48px] tracking-[2px] text-muted-foreground">Categoría no encontrada</h1>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Navbar />

      {/* Hero */}
      <div className="pt-[140px] pb-16 text-center relative overflow-hidden bg-[linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(232,39,42,0.12)_0%,transparent_60%)]" />
        <div className="container relative">
          <div className="text-5xl mb-4">{config.icon}</div>
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">{config.eyebrow}</div>
          <h1 className="font-display text-[72px] md:text-[96px] tracking-[4px] leading-[0.9] mb-5 text-dark-text">
            {config.title}<br /><span className="text-red">{config.accent}</span>
          </h1>
          <p className="text-[17px] text-dark-text-muted max-w-[560px] mx-auto mb-8 leading-relaxed">{config.subtitle}</p>

          <div className="flex max-w-[600px] mx-auto bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.18)] rounded-lg overflow-hidden backdrop-blur-xl focus-within:border-[rgba(255,255,255,0.35)] transition-colors">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Buscar en ${config.title.toLowerCase()}…`}
              className="flex-1 bg-transparent border-none outline-none px-5 py-[15px] text-dark-text font-body text-[15px] placeholder:text-dark-text-muted"
            />
            <button className="bg-red border-none px-6 py-[15px] text-primary-foreground font-condensed text-sm font-bold tracking-[1px] uppercase cursor-pointer hover:bg-red-light transition-colors">
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* Intro paragraph for SEO */}
      <section className="py-10 bg-background border-b border-border">
        <div className="container max-w-[720px] mx-auto">
          <p className="text-muted-foreground leading-relaxed text-[15px]">{config.intro}</p>
        </div>
      </section>

      {/* Sponsored Banner */}
      {sponsoredInCat.length > 0 && (
        <section className="py-8 bg-background border-b border-border">
          <div className="container">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold tracking-[2px] uppercase text-muted-foreground">Seleccionados</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {sponsoredInCat.map(l => <ListingCard key={l.id} listing={l} featured />)}
            </div>
          </div>
        </section>
      )}

      {/* Filters + Results */}
      <div className="py-12 bg-background">
        <div className="container">
          <FilterBar filters={filters} onUpdate={setFilters} />

          <div className="mb-7 text-sm text-muted-foreground">
            <strong className="text-foreground">{results.length}</strong> lugar{results.length !== 1 ? 'es' : ''} encontrado{results.length !== 1 ? 's' : ''}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 opacity-40">🔍</div>
              <div className="font-display text-[32px] tracking-[2px] text-muted-foreground mb-2">Sin Resultados</div>
              <div className="text-sm text-muted-foreground">Intenta con otra búsqueda</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
