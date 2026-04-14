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

const CUISINES: Record<string, { label: string; desc: string; icon: string }> = {
  "mexicana": { label: "Cocina Mexicana", desc: "Los mejores restaurantes de cocina mexicana en Las Vegas — tacos, mole, mariscos y más.", icon: "🇲🇽" },
  "cubana": { label: "Cocina Cubana", desc: "Restaurantes de cocina cubana auténtica en Las Vegas.", icon: "🇨🇺" },
  "colombiana": { label: "Cocina Colombiana", desc: "Sabores colombianos auténticos en Las Vegas — pollo a la brasa, arepas y más.", icon: "🇨🇴" },
  "steakhouse": { label: "Steakhouse", desc: "Los mejores steakhouses de Las Vegas — cortes USDA Prime y ambiente sofisticado.", icon: "🥩" },
  "italiana": { label: "Cocina Italiana", desc: "Restaurantes italianos en Las Vegas — pasta, pizza y vino.", icon: "🇮🇹" },
  "peruana": { label: "Cocina Peruana", desc: "Ceviche, lomo saltado y más sabores peruanos en Las Vegas.", icon: "🇵🇪" },
  "mariscos": { label: "Mariscos", desc: "Los mejores mariscos de Las Vegas — ceviche, camarones, caldo y más.", icon: "🌊" },
};

function cuisineMatch(listingCuisine: string[] | undefined, slug: string): boolean {
  if (!listingCuisine || listingCuisine.length === 0) return false;
  const lower = listingCuisine.join(" ").toLowerCase();
  if (slug === "mexicana") return lower.includes("mexican");
  if (slug === "steakhouse") return lower.includes("steakhouse");
  if (slug === "cubana") return lower.includes("cuban");
  if (slug === "colombiana") return lower.includes("colombian");
  if (slug === "italiana") return lower.includes("italian");
  if (slug === "peruana") return lower.includes("peruan");
  if (slug === "mariscos") return lower.includes("marisco");
  return false;
}

export default function CuisinePage() {
  const { cuisine } = useParams();
  const config = cuisine ? CUISINES[cuisine] : null;
  const cuisineLabel = config?.label || cuisine || "";

  const { data: allListings = [] } = useListings();

  // Also match by catLabel for broader results
  const cuisineListings = useMemo(() => {
    if (!cuisine) return [];
    return allListings.filter(l => {
      if (cuisineMatch(l.cuisine, cuisine)) return true;
      const catLower = l.catLabel.toLowerCase();
      if (cuisine === "mexicana" && catLower.includes("mexican")) return true;
      if (cuisine === "cubana" && catLower.includes("cuban")) return true;
      if (cuisine === "colombiana" && catLower.includes("colombian")) return true;
      if (cuisine === "steakhouse" && catLower.includes("steakhouse")) return true;
      if (cuisine === "mariscos" && catLower.includes("marisco")) return true;
      return false;
    });
  }, [allListings, cuisine]);

  const { search, setSearch, filters, setFilters, results } = useListingFilters(cuisineListings);

  useEffect(() => {
    document.title = `${cuisineLabel} en Las Vegas — Latino Las Vegas`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", config?.desc || `Restaurantes de ${cuisineLabel} en Las Vegas.`);
  }, [cuisineLabel, config]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cuisineLabel} en Las Vegas`,
    description: config?.desc,
    url: `https://latinolasvegas.com/cocina/${cuisine}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cuisineListings.length,
      itemListElement: cuisineListings.map((l, i) => ({
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
            <div className="text-6xl mb-4">🍴</div>
            <h1 className="font-display text-4xl mb-2">Cocina no encontrada</h1>
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
            <Link href="/restaurantes" className="hover:text-dark-text transition-colors">Restaurantes</Link>
            <span className="text-[hsl(var(--dark-border-2))]">›</span>
            <span>{cuisineLabel}</span>
          </div>
          <div className="inline-flex items-center bg-red/10 border border-red/25 rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[2px] uppercase text-red mb-4">
            {config.icon} Cocina
          </div>
          <h1 className="font-display text-[56px] md:text-[72px] tracking-[3px] leading-[0.92] mb-4 text-dark-text">{cuisineLabel}</h1>
          <p className="text-lg text-dark-text-2 italic max-w-2xl">{config.desc}</p>
        </div>
      </div>

      <div className="py-10 bg-background">
        <div className="container">
          <FilterBar filters={filters} onUpdate={setFilters} hideZone />
          <div className="text-sm text-muted-foreground mb-6">{results.length} restaurantes</div>
          {results.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-muted-foreground">No se encontraron restaurantes de esta cocina.</p>
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
