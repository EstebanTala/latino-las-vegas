"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useListings } from "@/hooks/useListings";
import { useListingFilters } from "@/hooks/useListingFilters";
import ListingCard from "@/components/ListingCard";
import FilterBar from "@/components/FilterBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const REGIONS: Record<string, { label: string; desc: string }> = {
  "the-strip": { label: "The Strip", desc: "Los mejores hoteles, restaurantes, shows y vida nocturna del famoso Las Vegas Strip." },
  "downtown": { label: "Downtown", desc: "La zona histórica de Las Vegas con Fremont Street, museos y restaurantes auténticos." },
  "west-las-vegas": { label: "West Las Vegas", desc: "La comunidad latina más vibrante de Las Vegas con restaurantes y entretenimiento local." },
  "east-las-vegas": { label: "East Las Vegas", desc: "Steakhouses, cocina regional y experiencias auténticas en el este de Las Vegas." },
  "north-las-vegas": { label: "North Las Vegas", desc: "Sabores colombianos, peruanos y más en la zona norte de Las Vegas." },
  "south-las-vegas": { label: "South Las Vegas", desc: "Hoteles locales y entretenimiento fuera del Strip en el sur de Las Vegas." },
  "summerlin": { label: "Summerlin", desc: "Spas, restaurantes y vida relajada en la exclusiva comunidad de Summerlin." },
  "excursion": { label: "Excursión", desc: "Excursiones desde Las Vegas al Gran Cañón, Hoover Dam y más." },
};

function slugToRegion(slug: string): string {
  return REGIONS[slug]?.label || slug;
}

export default function RegionPage() {
  const { region } = useParams() as { region: string };
  const config = region ? REGIONS[region] : null;
  const regionLabel = config?.label || region || "";

  const { data: allListings = [] } = useListings();
  const regionListings = useMemo(
    () => allListings.filter(l => l.region && l.region.toLowerCase().replace(/\s+/g, "-") === region),
    [allListings, region]
  );
  const { search, setSearch, filters, setFilters, results } = useListingFilters(regionListings);

  useEffect(() => {
    document.title = `${regionLabel} — Guía de Las Vegas en Español`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", config?.desc || `Lugares en ${regionLabel}, Las Vegas.`);
  }, [regionLabel, config]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${regionLabel} — Latino Las Vegas`,
    description: config?.desc,
    url: `https://latinolasvegas.com/zona/${region}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: regionListings.length,
      itemListElement: regionListings.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://latinolasvegas.com/lugar/${l.slug}`,
        name: l.name,
      })),
    },
  };

  if (!config) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-[70px]">
          <div className="text-center">
            <div className="text-6xl mb-4">📍</div>
            <h1 className="font-display text-4xl mb-2">Zona no encontrada</h1>
            <Link href="/explorar" className="text-red hover:underline">← Volver a explorar</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pt-[120px] pb-12 bg-[linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)]">
        <div className="container animate-fade-up">
          <div className="flex items-center gap-2 text-[13px] text-dark-text-muted mb-6">
            <Link href="/" className="hover:text-dark-text transition-colors">Inicio</Link>
            <span className="text-[hsl(var(--dark-border-2))]">›</span>
            <Link href="/explorar" className="hover:text-dark-text transition-colors">Explorar</Link>
            <span className="text-[hsl(var(--dark-border-2))]">›</span>
            <span>{regionLabel}</span>
          </div>
          <div className="inline-flex items-center bg-red/10 border border-red/25 rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[2px] uppercase text-red mb-4">
            📍 Zona
          </div>
          <h1 className="font-display text-[56px] md:text-[72px] tracking-[3px] leading-[0.92] mb-4 text-dark-text">{regionLabel}</h1>
          <p className="text-lg text-dark-text-2 italic max-w-2xl">{config.desc}</p>
        </div>
      </div>

      <div className="py-10 bg-background">
        <div className="container">
          <FilterBar filters={filters} onUpdate={setFilters} hideZone />
          <div className="text-sm text-muted-foreground mb-6">{results.length} lugares en {regionLabel}</div>
          {results.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-muted-foreground">No se encontraron lugares en esta zona.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
