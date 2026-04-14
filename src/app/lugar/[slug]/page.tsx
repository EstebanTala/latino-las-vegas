"use client";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useCallback, useState, useRef } from "react";
import { icons, Circle, Check, Accessibility, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAmenities, type AmenityItem } from "@/hooks/useTaxonomies";
import { getStarsDisplay } from "@/data/listings";
import { useListings } from "@/hooks/useListings";
import ListingCard from "@/components/ListingCard";
import ResortCategoryCarousel from "@/components/ResortCategoryCarousel";
import ListingGallery from "@/components/ListingGallery";
import SectionHeader from "@/components/SectionHeader";
import StarRating from "@/components/StarRating";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import GalleryVideoPlayer from "@/components/GalleryVideoPlayer";
import NightlifeQuickInfo from "@/components/NightlifeQuickInfo";
import ShowSchedule from "@/components/ShowSchedule";
import { supabase } from "@/integrations/supabase/client";
import { formatStructuredHours } from "@/lib/formatHours";
import { isOpenNow } from "@/lib/hours";
import { resolveUsefulInfoIcon } from "@/lib/usefulInfoIcons";

const CAT_COLORS: Record<string, { border: string; text: string }> = {
  restaurantes: { border: "#B91C1C", text: "#B91C1C" },
  hoteles:      { border: "#1E40AF", text: "#1E40AF" },
  nocturna:     { border: "#A855F7", text: "#A855F7" },
  shows:        { border: "#E6B325", text: "#E6B325" },
  atracciones:  { border: "#22C55E", text: "#22C55E" },
};

const CAT_EXPLORE_ROUTES: Record<string, string> = {
  restaurantes: "/explorar?cat=restaurantes",
  hoteles:      "/explorar?cat=hoteles",
  nocturna:     "/explorar?cat=nocturna",
  shows:        "/explorar?cat=shows",
  atracciones:  "/explorar?cat=atracciones",
};

const CUISINE_DATA: Record<string, { flag: string; bg: string; border: string; text: string }> = {
  mexicana:            { flag: "🇲🇽", bg: "bg-emerald-500/10", border: "border-emerald-600/30", text: "text-emerald-700" },
  cubana:              { flag: "🇨🇺", bg: "bg-blue-500/10", border: "border-blue-600/30", text: "text-blue-700" },
  peruana:             { flag: "🇵🇪", bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-700" },
  colombiana:          { flag: "🇨🇴", bg: "bg-yellow-500/10", border: "border-yellow-600/30", text: "text-yellow-700" },
  venezolana:          { flag: "🇻🇪", bg: "bg-yellow-500/10", border: "border-yellow-600/30", text: "text-yellow-700" },
  argentina:           { flag: "🇦🇷", bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-700" },
  salvadoreña:         { flag: "🇸🇻", bg: "bg-blue-500/10", border: "border-blue-600/30", text: "text-blue-700" },
  guatemalteca:        { flag: "🇬🇹", bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-700" },
  brasileña:           { flag: "🇧🇷", bg: "bg-green-500/10", border: "border-green-600/30", text: "text-green-700" },
  chilena:             { flag: "🇨🇱", bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-700" },
  dominicana:          { flag: "🇩🇴", bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-700" },
  puertorriqueña:      { flag: "🇵🇷", bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-700" },
  española:            { flag: "🇪🇸", bg: "bg-yellow-500/10", border: "border-yellow-600/30", text: "text-yellow-700" },
  italiana:            { flag: "🇮🇹", bg: "bg-red-400/10", border: "border-red-400/30", text: "text-red-600" },
  japonesa:            { flag: "🇯🇵", bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-700" },
  china:               { flag: "🇨🇳", bg: "bg-rose-600/10", border: "border-rose-600/30", text: "text-rose-800" },
  coreana:             { flag: "🇰🇷", bg: "bg-blue-500/10", border: "border-blue-600/30", text: "text-blue-700" },
  tailandesa:          { flag: "🇹🇭", bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-700" },
  india:               { flag: "🇮🇳", bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-700" },
  francesa:            { flag: "🇫🇷", bg: "bg-blue-400/10", border: "border-blue-400/30", text: "text-blue-600" },
  americana:           { flag: "🇺🇸", bg: "bg-slate-500/10", border: "border-slate-500/30", text: "text-slate-700" },
  steakhouse:          { flag: "🥩", bg: "bg-amber-500/10", border: "border-amber-600/30", text: "text-amber-700" },
  mariscos:            { flag: "🦐", bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-700" },
  fusión:              { flag: "🌎", bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-700" },
  café:                { flag: "☕", bg: "bg-amber-700/10", border: "border-amber-700/30", text: "text-amber-800" },
  "brunch y desayuno": { flag: "🥞", bg: "bg-amber-400/10", border: "border-amber-500/30", text: "text-amber-700" },
  asiática:            { flag: "🌏", bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-700" },
  bbq:                 { flag: "🔥", bg: "bg-orange-600/10", border: "border-orange-600/30", text: "text-orange-700" },
  hamburguesas:        { flag: "🍔", bg: "bg-yellow-600/10", border: "border-yellow-600/30", text: "text-yellow-700" },
  pizza:               { flag: "🍕", bg: "bg-red-400/10", border: "border-red-400/30", text: "text-red-600" },
  vegana:              { flag: "🌱", bg: "bg-lime-500/10", border: "border-lime-500/30", text: "text-lime-700" },
  buffet:              { flag: "🍽️", bg: "bg-violet-400/10", border: "border-violet-400/30", text: "text-violet-600" },
  griega:              { flag: "🇬🇷", bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-700" },
  panadería:           { flag: "🥐", bg: "bg-pink-400/10", border: "border-pink-400/30", text: "text-pink-600" },
  "mexicana de autor": { flag: "🇲🇽", bg: "bg-emerald-500/10", border: "border-emerald-600/30", text: "text-emerald-700" },
  "mexicana regional": { flag: "🇲🇽", bg: "bg-emerald-500/10", border: "border-emerald-600/30", text: "text-emerald-700" },
  "tacos de tijuana":  { flag: "🇲🇽", bg: "bg-emerald-500/10", border: "border-emerald-600/30", text: "text-emerald-700" },
};

const DEFAULT_CUISINE = { flag: "🍽️", bg: "bg-muted", border: "border-border", text: "text-foreground/80" };

function cuisineStyle(name: string) {
  return CUISINE_DATA[name.toLowerCase()] || DEFAULT_CUISINE;
}

function buildJsonLd(listing: any) {
  const base: any = {
    "@context": "https://schema.org",
    name: listing.name,
    description: listing.desc,
    address: listing.address ? {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: "Las Vegas",
      addressRegion: "NV",
      addressCountry: "US",
    } : undefined,
    telephone: listing.phone || undefined,
    url: `https://latinolasvegas.com/lugar/${listing.slug}`,
    image: listing.image || undefined,
    aggregateRating: (listing.googleRating != null || listing.stars) ? {
      "@type": "AggregateRating",
      ratingValue: listing.googleRating ?? listing.stars,
      bestRating: 5,
      ratingCount: listing.googleUserRatingsTotal ?? 3,
    } : undefined,
  };

  if (listing.cat === "restaurantes") {
    // Parse opening hours from structured JSON if available
    let openingHours: string[] | undefined;
    if (listing.hours) {
      try {
        const parsed = JSON.parse(listing.hours);
        if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
          const dayMap: Record<string, string> = { mon: "Mo", tue: "Tu", wed: "We", thu: "Th", fri: "Fr", sat: "Sa", sun: "Su" };
          openingHours = Object.entries(dayMap).reduce<string[]>((acc, [key, abbr]) => {
            const day = parsed[key];
            if (day?.open && day?.close) {
              acc.push(`${abbr} ${day.open}-${day.close}`);
              if (day.open2 && day.close2) acc.push(`${abbr} ${day.open2}-${day.close2}`);
            }
            return acc;
          }, []);
        }
      } catch { /* ignore */ }
    }
    return {
      ...base,
      "@type": "Restaurant",
      servesCuisine: listing.cuisine?.join(", ") || "Mexicana",
      priceRange: listing.price,
      ...(openingHours?.length ? { openingHours } : {}),
    };
  }
  if (listing.cat === "hoteles") {
    return { ...base, "@type": "Hotel", priceRange: listing.price, starRating: { "@type": "Rating", ratingValue: listing.stars } };
  }
  if (listing.cat === "shows") {
    return { ...base, "@type": "Event", eventStatus: "https://schema.org/EventScheduled", location: { "@type": "Place", name: listing.address } };
  }
  if (listing.cat === "nocturna") {
    return { ...base, "@type": "NightClub", priceRange: listing.price };
  }
  return { ...base, "@type": "LocalBusiness", priceRange: listing.price };
}

function ReviewText({ text, originalLanguage }: { text: string; originalLanguage?: string | null }) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const isTranslated = originalLanguage != null && originalLanguage !== "es";

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight + 1);
    }
  }, [text]);

  return (
    <div className="text-[13.5px] text-foreground/80 leading-relaxed mt-3">
      <span ref={textRef} className={!expanded ? "line-clamp-3" : ""}>"{text}"</span>
      {isClamped && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="block mt-1 text-[11px] font-semibold text-muted-foreground/70 hover:text-foreground transition-colors"
        >
          {expanded ? "Ver menos" : "Ver más →"}
        </button>
      )}
      {isTranslated && (
        <span className="block text-[10px] text-muted-foreground/50 italic mt-1">Traducido automáticamente</span>
      )}
    </div>
  );
}

/** Editorial divider for premium visual separation between sections */
function SectionDivider({ isFirst = false }: { isFirst?: boolean }) {
  if (isFirst) return null;
  return (
    <div className="mx-auto" style={{ height: '1px', background: '#E5E5E5', opacity: 0.6, marginTop: '40px', marginBottom: '40px', maxWidth: '1200px' }} />
  );
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

type GalleryFiveImageLayoutProps = {
  images: string[];
  listingName: string;
  onImageClick: (index: number) => void;
};

function getGallerySubtitle(cat: string): string {
  switch (cat) {
    case 'hotels': case 'hoteles': return 'Explora las habitaciones, el casino y las instalaciones del resort.';
    case 'restaurantes': return 'Descubre los platillos, el ambiente y la experiencia del lugar.';
    case 'nocturna': return 'Explora el ambiente, la música y la energía del lugar.';
    case 'atracciones': return 'Descubre la experiencia, actividades y lo que puedes disfrutar.';
    case 'shows': return 'Explora el espectáculo, el ambiente y los momentos destacados.';
    default: return 'Explora las imágenes y momentos destacados del lugar.';
  }
}

function GalleryFiveImageLayout({ images, listingName, onImageClick }: GalleryFiveImageLayoutProps) {
  const [image1, image2, image3, image4, image5] = images;

  const tile = "relative rounded-xl overflow-hidden group cursor-pointer transition-shadow duration-200 hover:shadow-md";
  const img = "w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]";
  const overlay = "absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300";

  return (
    <div className="flex flex-col gap-3">
      {/* Top: large left + 2 stacked right */}
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: '1.8fr 1fr',
          gridTemplateRows: '270px 270px',
          gridTemplateAreas: `"A B" "A C"`,
        }}
      >
        <div className={tile} style={{ gridArea: 'A' }} onClick={() => onImageClick(0)}>
          <img src={image1} alt={`${listingName} - 1`} className={img} loading="lazy" />
          <div className={overlay} />
        </div>
        <div className={tile} style={{ gridArea: 'B' }} onClick={() => onImageClick(1)}>
          <img src={image2} alt={`${listingName} - 2`} className={img} loading="lazy" />
          <div className={overlay} />
        </div>
        <div className={tile} style={{ gridArea: 'C' }} onClick={() => onImageClick(2)}>
          <img src={image3} alt={`${listingName} - 3`} className={img} loading="lazy" />
          <div className={overlay} />
        </div>
      </div>
      {/* Bottom: wide left + narrower right */}
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: '1.8fr 1fr',
          height: 220,
        }}
      >
        <div className={tile} onClick={() => onImageClick(3)}>
          <img src={image4} alt={`${listingName} - 4`} className={img} loading="lazy" />
          <div className={overlay} />
        </div>
        <div className={tile} onClick={() => onImageClick(4)}>
          <img src={image5} alt={`${listingName} - 5`} className={img} loading="lazy" />
          <div className={overlay} />
        </div>
      </div>
    </div>
  );
}

export default function ListingDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { data: allListings = [], isLoading } = useListings();
  const { data: taxonomyAmenities = [] } = useAmenities();
  const [galleryLightbox, setGalleryLightbox] = useState<number | null>(null);
  
  const [hhLightbox, setHhLightbox] = useState<string | null>(null);
  const [resortCat, setResortCat] = useState<string>("");
  const [glowColor, setGlowColor] = useState<string>("rgba(217,164,65,0.26)");
  const glowCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const relatedScrollRef = useRef<HTMLDivElement | null>(null);
  const [relatedCanScrollLeft, setRelatedCanScrollLeft] = useState(false);
  const [relatedCanScrollRight, setRelatedCanScrollRight] = useState(true);
  const [googleReviews, setGoogleReviews] = useState<any[] | null>(null);
  const [googleReviewsLoading, setGoogleReviewsLoading] = useState(false);
  const [googlePlaceData, setGooglePlaceData] = useState<{ rating: number | null; user_ratings_total: number | null } | null>(null);
  const listing = allListings.find(l => l.slug === slug);
  const stars = listing ? getStarsDisplay(listing.stars) : "";
  // Related listings: contextually relevant restaurants
  const finalRelated = (() => {
    if (!listing) return [];
    const MAX = 3;
    const candidates = allListings.filter(l => l.cat === listing.cat && l.slug !== listing.slug);
    const byRating = (a: typeof candidates[0], b: typeof candidates[0]) =>
      (b.googleRating ?? 0) - (a.googleRating ?? 0) || (b.googleUserRatingsTotal ?? 0) - (a.googleUserRatingsTotal ?? 0);

    const added = new Set<string>();
    const result: typeof candidates = [];
    const add = (l: typeof candidates[0]) => {
      if (added.has(l.id)) return;
      added.add(l.id);
      result.push(l);
    };

    const cuisineSet = new Set(listing.cuisine ?? []);

    // Bucket 1: Same property (same resort/hotel)
    const sameProperty = listing.locatedInListingId
      ? candidates.filter(l => l.locatedInListingId === listing.locatedInListingId).sort(byRating)
      : [];

    // Bucket 2: Same cuisine + same zone
    const sameCuisineZone = (listing.region && cuisineSet.size > 0)
      ? candidates.filter(l => l.region === listing.region && l.cuisine?.some(c => cuisineSet.has(c))).sort(byRating)
      : [];

    // Bucket 3: Same zone OR same price
    const sameZoneOrPrice = candidates
      .filter(l => (listing.region && l.region === listing.region) || (listing.price && l.price === listing.price))
      .sort(byRating);

    // Pick 1 from each bucket when available
    const pick = (bucket: typeof candidates) => {
      for (const l of bucket) {
        if (!added.has(l.id)) { add(l); return; }
      }
    };

    pick(sameProperty);
    pick(sameCuisineZone);
    pick(sameZoneOrPrice);

    // Fallback: fill remaining slots with top-rated
    if (result.length < MAX) {
      candidates.sort(byRating).forEach(l => { if (result.length < MAX) add(l); });
    }

    // Ensure sponsored listing gets priority slot
    const sponsoredIdx = result.findIndex(r => r.isSponsored);
    if (sponsoredIdx > 0) {
      const [s] = result.splice(sponsoredIdx, 1);
      result.unshift(s);
    }

    return result.slice(0, MAX);
  })();
  const isPremium = listing ? (listing.isFeatured || listing.isSponsored) : false;
  const isNonRestaurant = listing ? listing.cat !== "restaurantes" : false;
  const hasAffiliateCta = listing ? !!(isNonRestaurant && listing.affiliateCtaUrl && listing.affiliateCtaLabel) : false;
  const parentResort = listing?.locatedInListingId ? allListings.find(l => String(l.id) === listing.locatedInListingId) : null;
  const childListings = listing?.cat === "hoteles" ? allListings.filter(l => l.locatedInListingId === String(listing.id)) : [];

  // Upcoming events for nightlife venues
  const upcomingEvents = (() => {
    if (!listing || listing.cat !== "nocturna") return [];
    const now = new Date();
    return allListings
      .filter(l => l.cat === "shows" && l.locatedInListingId === String(listing.id) && l.startDatetime && new Date(l.startDatetime) > now)
      .sort((a, b) => new Date(a.startDatetime!).getTime() - new Date(b.startDatetime!).getTime());
  })();

  // Track scroll position for related carousel arrows
  useEffect(() => {
    const el = relatedScrollRef.current;
    if (!el) return;
    const update = () => {
      setRelatedCanScrollLeft(el.scrollLeft > 4);
      setRelatedCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [finalRelated]);

  const trackAffiliateClick = useCallback(() => {
    if (!listing) return;
    supabase.from("affiliate_clicks").insert({
      listing_id: listing.id,
      category: listing.cat,
    }).then(() => {});
  }, [listing]);

  useEffect(() => {
    if (!listing) return;
    document.title = `${listing.name} — Latino Las Vegas`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", listing.desc);
  }, [listing]);

  // Fetch real Google reviews when listing has a googlePlaceId
  useEffect(() => {
    if (!listing?.googlePlaceId) {
      setGoogleReviews(null);
      setGooglePlaceData(null);
      return;
    }
    let cancelled = false;
    setGoogleReviewsLoading(true);

    const projectId = process.env.VITE_SUPABASE_PROJECT_ID;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    fetch(
      `https://${projectId}.supabase.co/functions/v1/google-place-details?placeId=${encodeURIComponent(listing.googlePlaceId)}`,
      { headers: { "apikey": anonKey, "Content-Type": "application/json" } }
    )
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setGoogleReviews(data.reviews || []);
          setGooglePlaceData({ rating: data.rating ?? null, user_ratings_total: data.user_ratings_total ?? null });
          setGoogleReviewsLoading(false);
        }
      })
      .catch(err => {
        console.error("[GoogleReviews] Failed to fetch:", err);
        if (!cancelled) {
          setGoogleReviews(null);
          setGoogleReviewsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [listing?.googlePlaceId]);

  // Extract dominant color from hero image via canvas sampling
  const handleActiveImageChange = useCallback((src: string) => {
    if (!src) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        if (!glowCanvasRef.current) {
          glowCanvasRef.current = document.createElement("canvas");
        }
        const canvas = glowCanvasRef.current;
        const size = 32;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        // Boost saturation slightly for visibility
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const mid = (max + min) / 2;
        if (mid > 0 && max !== min) {
          const boost = 1.3;
          r = Math.min(255, Math.round(mid + (r - mid) * boost));
          g = Math.min(255, Math.round(mid + (g - mid) * boost));
          b = Math.min(255, Math.round(mid + (b - mid) * boost));
        }
        setGlowColor(`rgba(${r},${g},${b},0.30)`);
      } catch {
        // CORS or other error — keep previous glow
      }
    };
    img.src = src;
  }, []);


  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!listing) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-[70px]">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="font-display text-4xl mb-2">Lugar no encontrado</h1>
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(listing)) }} />
      {/* Hero */}
      <div className="llv-hero pt-[120px] bg-[linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)] overflow-visible" style={{ ["--heroGlow" as any]: glowColor }}>
        <div className="container relative z-[1]">
          {/* Breadcrumb + Volver */}
          <div className="flex items-center justify-between text-[13px] text-dark-text-2/85 mb-7 animate-fade-up">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-dark-text transition-colors">Inicio</Link>
              <span className="text-[hsl(var(--dark-border-2))]">›</span>
              <Link href="/explorar" className="hover:text-dark-text transition-colors">Explorar</Link>
              <span className="text-[hsl(var(--dark-border-2))]">›</span>
              <Link href={CAT_EXPLORE_ROUTES[listing.cat] || "/explorar"} className="hover:text-dark-text transition-colors">{listing.catLabel}</Link>
              <span className="text-[hsl(var(--dark-border-2))]">›</span>
              <span>{listing.name}</span>
            </div>
            <button onClick={() => window.history.length > 1 ? router.push(-1) : router.push("/explorar")} className="hover:text-dark-text transition-colors bg-transparent border-none cursor-pointer text-[13px] text-dark-text-muted font-body">← Volver</button>
          </div>

          {/* Header */}
          <div className="animate-fade-up-1 flex flex-col lg:flex-row items-start justify-between gap-8 pb-4">
            <div className="flex-1">
              {(listing.isSponsored || (listing.isFeatured && !listing.isSponsored)) && (
                <div className="flex items-center gap-2 mb-4">
                  {listing.isSponsored && (
                    <div
                      className="inline-flex items-center bg-transparent border rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[2px] uppercase"
                      style={{ borderColor: "#F9FAFB", color: "#F9FAFB" }}
                    >
                      Seleccionado
                    </div>
                  )}
                  {listing.isFeatured && !listing.isSponsored && (
                    <div
                      className="inline-flex items-center bg-transparent border rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[2px] uppercase"
                      style={{ borderColor: "#E6B325", color: "#E6B325" }}
                    >
                      Destacado
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-start gap-5 mb-3">
                {listing.logoUrl && (
                  <img src={listing.logoUrl} alt={`${listing.name} logo`} className="h-[80px] w-auto max-w-[100px] object-contain shrink-0 rounded-lg" />
                )}
                <div className="font-display text-[72px] tracking-[3px] leading-[0.92] text-dark-text">{listing.name}</div>
              </div>
              {listing.tagline && (
                <div className="text-[17px] text-dark-text-2/70 font-body leading-relaxed max-w-[680px] mb-1">{listing.tagline}</div>
              )}
            
            </div>
            {(() => {
              const isRestaurant = listing.cat === "restaurantes";
              const isPaid = listing.isFeatured || listing.isSponsored;

              // Compute CTA
              let cta: { label: string; url: string } | null = null;
              if (isRestaurant) {
                if (listing.reservationUrl) cta = { label: "Reservar mesa", url: listing.reservationUrl };
                else if (listing.orderOnlineUrl) cta = { label: "Ordenar en línea", url: listing.orderOnlineUrl };
              } else if (listing.cat === "shows" && hasAffiliateCta) {
                cta = { label: "Comprar boletos", url: listing.affiliateCtaUrl! };
              } else if (hasAffiliateCta) {
                cta = { label: listing.affiliateCtaLabel || "Ver opciones", url: listing.affiliateCtaUrl! };
              } else if (listing.website) {
                cta = { label: "Sitio web", url: listing.website };
              }

              const shouldShow = cta?.url && (isRestaurant ? isPaid : true);
              if (!shouldShow || !cta) return null;

              const isGold = isRestaurant && cta.label === "Reservar mesa";
              const btnClass = `font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm hover:-translate-y-px transition-all duration-200 ease-out text-center ${
                isGold
                  ? "bg-gold text-foreground shadow-[0_2px_8px_hsl(var(--gold)/0.3)] hover:bg-gold-dark hover:shadow-[0_4px_14px_hsl(var(--gold)/0.4)]"
                  : "bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-dark hover:shadow-[0_4px_14px_hsl(var(--red)/0.4)]"
              }`;

              return (
                <div className="flex flex-col gap-2.5 min-w-[220px] lg:mt-[40px]">
                  <a href={cta.url} target="_blank" rel="noreferrer" className={btnClass}
                    {...(!isRestaurant && hasAffiliateCta ? { onClick: trackAffiliateClick } : {})}
                  >
                    {cta.label}
                  </a>
                </div>
              );
            })()}
          </div>

          {/* Metadata row — unified styling across all categories */}
          <div className="flex items-center w-full pb-6">
            <div className="flex items-center gap-[16px] flex-wrap font-condensed text-[19px] font-semibold tracking-[0.5px] text-dark-text">
              {/* Rating */}
              {(() => {
                const liveRating = googlePlaceData?.rating;
                const rating = liveRating ?? listing.googleRating ?? null;
                if (rating == null || rating === 0) {
                  return null;
                }
                return (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-gold">★</span>
                    <span>{rating % 1 === 0 ? `${rating}.0` : rating.toFixed(1)}</span>
                  </span>
                );
              })()}

              {/* Category-specific detail */}
              {(() => {
                let detail: string | null = null;
                if (listing.cat === "hoteles" && listing.propertyType) {
                  detail = `${listing.propertyType}${listing.stars ? ` · ${listing.stars} estrellas` : ''}`;
                } else if (listing.cat === "restaurantes" && listing.cuisine?.length) {
                  detail = listing.cuisine.join(' · ');
                } else if (listing.cat === "nocturna" && listing.venueType?.length) {
                  detail = listing.venueType.join(' · ');
                } else if (listing.cat === "shows") {
                  detail = listing.showExperienceType?.[0] || listing.venueType?.join(' · ') || "Show en vivo";
                } else if (listing.cat === "atracciones" && listing.experienceType?.length) {
                  detail = listing.experienceType[0];
                } else if (listing.catLabel) {
                  detail = listing.catLabel;
                }
                if (!detail) return null;
                return (
                  <>
                    <span className="text-dark-text-muted/30 select-none">·</span>
                    <span>{detail}</span>
                  </>
                );
              })()}

              {/* Price */}
              {listing.price && (
                <>
                  <span className="text-dark-text-muted/30 select-none">·</span>
                  <span>{listing.price}</span>
                </>
              )}

              {/* Location / Zone */}
              {listing.region && (
                <>
                  <span className="text-dark-text-muted/30 select-none">·</span>
                  <span>{listing.region}</span>
                </>
              )}

              {/* Badge — premium only */}
              {isPremium && listing.badge && (
                <div className="bg-gold text-foreground text-[10px] font-bold tracking-[1.5px] uppercase px-2.5 py-1 rounded ml-1">{listing.badge}</div>
              )}
            </div>
          </div>
        </div>

        {/* Visual / Gallery */}
        <div className="container pb-16 relative overflow-visible z-[1]">
          {(() => {
            const mainImage = listing.image || null;
            const galleryImages = (listing.galleryImages || [])
              .map((img: any) => (typeof img === "string" ? img : img?.url))
              .filter((img: string | undefined | null): img is string => !!img && img.trim().length > 0);
            const imagesForCarousel = Array.from(new Set([mainImage, ...galleryImages].filter(Boolean))) as string[];

            return (
              <div className="llv-hero-media hero-media w-full relative" style={{ ["--heroGlow" as any]: glowColor }}>
                {listing.cat === "hoteles" && (
                  <div className="absolute inset-0 z-[2] pointer-events-none rounded-[inherit]" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.15) 80%, transparent)" }} />
                )}
                <div className="hero-media__inner">
                  <ListingGallery
                    galleryImages={imagesForCarousel}
                    name={listing.name}
                    icon={listing.icon}
                    onActiveImageChange={handleActiveImageChange}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Mobile sticky bar spacer for restaurants */}
      {listing.cat === "restaurantes" && <div className="h-[68px] lg:hidden" />}

      {/* Body */}
      <div className="py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 items-start">
            {/* Main */}
            <div className="space-y-10">
              {/* Highlight — Seleccionado only */}
              {listing.isSponsored && listing.highlight && (
                <div className="border-l-2 border-muted-foreground/20 pl-5 py-1">
                  <p className="text-[15px] italic text-foreground/70 leading-relaxed">{listing.highlight}</p>
                </div>
              )}

              {/* Highlights callout — Seleccionado only */}
              {listing.isSponsored && (listing.highlights?.length ?? 0) > 0 && (
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] leading-none tracking-wide font-medium mb-1.5 cursor-default transition-all duration-[180ms] ease-in-out hover:shadow-[0_12px_28px_rgba(0,0,0,0.26),0_3px_8px_rgba(0,0,0,0.18)]"
                  style={{
                    background: 'rgba(0,0,0,0.78)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    boxShadow: '0 14px 30px rgba(0,0,0,0.22), 0 4px 10px rgba(0,0,0,0.12)',
                    color: 'rgba(255,255,255,0.92)',
                  }}
                >
                  <span className="text-[12px] text-gold opacity-85">★</span>
                  <span>{(listing.highlights || []).map(h => h.trim()).join(' • ')}</span>
                </div>
              )}



              {listing.desc && (
              <section>
                <SectionDivider isFirst />
                <div className="font-condensed text-[22px] font-bold tracking-[1px] uppercase pb-3 border-b border-border mb-1">
                   {(listing.cat === 'nocturna' || listing.cat === 'atracciones') ? 'La experiencia' : 'Acerca de este lugar'}
                </div>
                {listing.cat === 'nocturna' && (
                  <p className="text-[13px] text-muted-foreground mb-4">Lo que hace único a este venue</p>
                )}
                {listing.cat === 'atracciones' && (
                  <p className="text-[13px] text-muted-foreground mb-4">Lo que hace especial esta experiencia</p>
                )}
                {listing.cat !== 'nocturna' && listing.cat !== 'atracciones' && <div className="mb-4" />}

                {(listing.cat === 'nocturna' || listing.cat === 'atracciones') ? (() => {
                  const sentences = listing.desc.split(/(?<=\.)\s+/).filter(s => s.trim().length > 0);
                  const midpoint = Math.ceil(sentences.length / 2);
                  const para1 = sentences.slice(0, midpoint).join(' ');
                  const para2 = sentences.slice(midpoint).join(' ');

                  return (
                    <div className="space-y-4">
                      <p className="text-base text-foreground/80 leading-[1.9]">{para1}</p>
                      {para2 && <p className="text-base text-foreground/80 leading-[1.9]">{para2}</p>}
                    </div>
                  );
                })() : (
                  <p className="text-base text-foreground/80 leading-[2]">
                    {listing.cat === "hoteles" ? (() => {
                      const seoPhrases = [
                        "resort en Las Vegas", "hotel en Las Vegas", "casino en Las Vegas",
                        "resort boutique", "hotel de lujo en Las Vegas", "resort de lujo",
                        "casino y resort", "hotel casino", "resort casino",
                        "hotel boutique", "resort todo incluido",
                      ];
                      let text = listing.desc;
                      let bolded = 0;
                      const parts: (string | React.ReactNode)[] = [];
                      let remaining = text;
                      for (const phrase of seoPhrases) {
                        if (bolded >= 2) break;
                        const idx = remaining.toLowerCase().indexOf(phrase.toLowerCase());
                        if (idx !== -1) {
                          const before = remaining.slice(0, idx);
                          const match = remaining.slice(idx, idx + phrase.length);
                          if (before) parts.push(before);
                          parts.push(<strong key={bolded}>{match}</strong>);
                          remaining = remaining.slice(idx + phrase.length);
                          bolded++;
                        }
                      }
                      if (remaining) parts.push(remaining);
                      return bolded > 0 ? parts : text;
                    })() : listing.desc}
                  </p>
                )}
              </section>
              )}

              {/* Galería — Shows only (before schedule) */}
              {listing.cat === "shows" && (() => {
                const galleryImages = (listing.galleryImages || [])
                  .map((img: any) => (typeof img === "string" ? img : img?.url))
                  .filter((img: string | undefined | null): img is string => !!img && img.trim().length > 0);
                const allImgs = Array.from(new Set([listing.image, ...galleryImages].filter(Boolean))).slice(1) as string[];
                const videoUrl = (listing as any).videoUrl as string | undefined;
                const youtubeId = videoUrl ? extractYouTubeId(videoUrl) : null;
                if (allImgs.length === 0 && !youtubeId) return null;
                const visibleImgs = allImgs.slice(0, youtubeId ? 5 : 6);
                const hasMore = allImgs.length > (youtubeId ? 5 : 6);
                const imgCount = visibleImgs.length + (youtubeId ? 1 : 0);

                return (
                  <section>
                    <SectionDivider />
                    <div className="pb-3 border-b border-border mb-5">
                      <div className="font-condensed text-[18px] font-bold tracking-[1px] uppercase text-foreground/70">Galería</div>
                      <p className="text-sm text-muted-foreground mt-1">
                         {getGallerySubtitle(listing.cat)}
                       </p>
                     </div>

                    {imgCount === 1 && !youtubeId && (
                      <div className="relative rounded-xl overflow-hidden group cursor-pointer transition-shadow duration-200 hover:shadow-md" onClick={() => setGalleryLightbox(0)}>
                        <img src={visibleImgs[0]} alt={`${listing.name} - 1`} className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] rounded-xl" style={{ aspectRatio: '16/9' }} loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl" />
                      </div>
                    )}

                    {imgCount === 2 && !youtubeId && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {visibleImgs.slice(0, 2).map((img, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden group cursor-pointer transition-shadow duration-200 hover:shadow-md" onClick={() => setGalleryLightbox(i)}>
                            <img src={img} alt={`${listing.name} - ${i + 1}`} className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" style={{ aspectRatio: '4/3' }} loading="lazy" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Exactly 5 images, no video — dedicated layout */}
                    {imgCount === 5 && !youtubeId && (
                      <GalleryFiveImageLayout
                        images={visibleImgs}
                        listingName={listing.name}
                        onImageClick={(index) => setGalleryLightbox(index)}
                      />
                    )}

                    {/* 3-4 or 6+ images, or has video */}
                    {((imgCount >= 3 && imgCount !== 5) || youtubeId) && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {/* Video takes the main hero slot for shows */}
                        {youtubeId && (
                          <div className="relative rounded-xl overflow-hidden row-span-2 col-span-1 sm:col-span-2">
                            <GalleryVideoPlayer
                              videoUrl={videoUrl!}
                              name={listing.name}
                              className="rounded-xl w-full h-full"
                              active={galleryLightbox === null}
                              inline
                            />
                          </div>
                        )}
                        {/* First image is hero only when no video */}
                        {!youtubeId && visibleImgs.length > 0 && (
                          <div className="relative rounded-xl overflow-hidden group cursor-pointer transition-shadow duration-200 hover:shadow-md row-span-2 col-span-1 sm:col-span-2" onClick={() => setGalleryLightbox(0)}>
                            <img src={visibleImgs[0]} alt={`${listing.name} - 1`} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" style={{ aspectRatio: '4/3' }} loading="lazy" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>
                        )}
                        {/* Remaining images — when video is hero, show all images as tiles */}
                        {(youtubeId ? visibleImgs : visibleImgs.slice(1)).map((img, i) => {
                          const globalIdx = youtubeId ? i : i + 1;
                          const remainingImgs = youtubeId ? visibleImgs : visibleImgs.slice(1);
                          const isLast = i === remainingImgs.length - 1 && hasMore;
                          return (
                            <div key={globalIdx} className="relative rounded-xl overflow-hidden group cursor-pointer transition-shadow duration-200 hover:shadow-md" onClick={() => isLast ? setGalleryLightbox(0) : setGalleryLightbox(globalIdx)}>
                              <img src={img} alt={`${listing.name} - ${globalIdx + 1}`} className="w-full aspect-[4/3.3] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" loading="lazy" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                              {isLast && (
                                <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center gap-1 transition-colors duration-300 group-hover:bg-black/55">
                                  <span className="text-white text-lg font-semibold">+{allImgs.length - visibleImgs.length} fotos</span>
                                  <span className="text-white/70 text-xs font-medium tracking-wide uppercase">Ver galería</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {galleryLightbox !== null && (
                      <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setGalleryLightbox(null)}>
                        <button onClick={(e) => { e.stopPropagation(); setGalleryLightbox(null); }} className="absolute top-5 right-5 text-white/70 hover:text-white z-10 transition-colors">
                          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setGalleryLightbox(galleryLightbox === 0 ? allImgs.length - 1 : galleryLightbox - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10 transition-colors">
                          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <img src={allImgs[galleryLightbox]} alt="" className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
                        <button onClick={(e) => { e.stopPropagation(); setGalleryLightbox(galleryLightbox === allImgs.length - 1 ? 0 : galleryLightbox + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10 transition-colors">
                          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <div className="absolute bottom-5 text-white/50 text-sm">{galleryLightbox + 1} / {allImgs.length}</div>
                      </div>
                    )}
                  </section>
                );
              })()}

              {/* Próximas funciones — Shows only */}
              {listing.cat === "shows" && (
                <section>
                  <SectionDivider />
                  <ShowSchedule
                    listing={listing}
                    allShowListings={allListings.filter(l => l.cat === "shows")}
                  />
                </section>
              )}

              {/* Información útil — Shows only, admin-managed */}
              {listing.cat === "shows" && listing.usefulInfo && listing.usefulInfo.length > 0 && (
                <section className="mb-10">
                  <SectionDivider />
                  <div className="font-condensed text-[22px] font-bold tracking-[1px] uppercase pb-1 border-b border-border mb-4">
                    Información útil
                  </div>
                  <ul className="flex flex-col gap-[10px]">
                    {listing.usefulInfo.map((item, i) => {
                      const IconComp = resolveUsefulInfoIcon(item.icon, item.text);
                      return (
                        <li key={i} className="flex items-center gap-[10px] text-[13.5px] leading-[1.4] text-muted-foreground">
                          <IconComp size={16} strokeWidth={2.2} className="w-4 h-4 shrink-0 text-foreground/45" />
                          <span>{item.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
              {/* Platos populares — Restaurants only */}
              {listing.cat === 'restaurantes' && listing.popularDishes && listing.popularDishes.length > 0 && (
                <section>
                  <SectionDivider />
                  <div className="font-condensed text-[22px] font-bold tracking-[1px] uppercase pb-3 border-b border-border mb-1">
                    Platos populares
                  </div>
                  <p className="text-[13px] text-muted-foreground mb-7">Lo más pedido y recomendado del lugar.</p>
                  <div className="space-y-1">
                    {listing.popularDishes.map((dish, i) => (
                      <div key={i} className={`flex items-start gap-3 py-4 ${i < listing.popularDishes!.length - 1 ? 'border-b border-foreground/[0.03]' : ''}`}>
                        <span className="text-base leading-none mt-0.5">{dish.emoji}</span>
                        <div>
                          <span className="text-[14px] font-semibold text-foreground/95">{dish.name}</span>
                          {dish.description && (
                            <p className="text-[13px] text-muted-foreground/55 leading-relaxed mt-0.5">{dish.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Qué esperar — Nightlife only */}
              {listing.cat === "nocturna" && (() => {
                const rows = [
                  listing.venueType?.length ? 1 : null,
                  listing.musicGenres?.length ? 1 : null,
                  listing.dressCode ? 1 : null,
                  listing.admissionType ? 1 : null,
                  listing.bestTime ? 1 : null,
                ].filter(Boolean);
                return rows.length >= 2;
              })() && (
                <section>
                  <SectionDivider />
                   <div className="font-condensed text-[22px] font-bold tracking-[1px] uppercase pb-3 border-b border-border mb-1">
                     Antes de ir
                   </div>
                    <p className="text-[13px] text-muted-foreground mb-5">Lo que necesitas saber para tu noche</p>
                    <div className="space-y-0">
                      {[
                        listing.venueType?.length ? { label: "Tipo de lugar", value: listing.venueType.join(' · ') } : null,
                        listing.musicGenres?.length ? { label: "Música", value: listing.musicGenres.join(', ') } : null,
                        listing.dressCode ? { label: "Código de vestimenta", value: listing.dressCode } : null,
                        listing.admissionType ? { label: "Entrada", value: listing.admissionType } : null,
                        listing.bestTime ? { label: "Mejor momento", value: listing.bestTime } : null,
                      ].filter(Boolean).map((item, i, arr) => (
                        <div key={i} className={`grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] gap-x-6 py-[18px] rounded-lg transition-colors duration-150 hover:bg-foreground/[0.02] ${i < arr.length - 1 ? 'border-b border-foreground/[0.04]' : ''}`}>
                          <h4 className="text-[10px] font-semibold uppercase tracking-[3px] text-muted-foreground/45 pt-1">
                            {item!.label}
                          </h4>
                          <p className="text-[14px] font-semibold leading-relaxed text-foreground/85">
                            {item!.value}
                          </p>
                        </div>
                      ))}
                    </div>
                </section>
              )}

              {/* Detalles de la experiencia — Atracciones only */}
              {listing.cat === "atracciones" && (() => {
                const attrRows = [
                  listing.experienceType?.length ? true : null,
                  listing.duration ? true : null,
                  listing.experienceLocation ? true : null,
                  listing.foodAvailable ? true : null,
                  (listing.admissionType || listing.priceFrom || (listing as any).priceMin) ? true : null,
                  listing.bestVisitTime ? true : null,
                  listing.idealFor?.length ? true : null,
                ].filter(Boolean);
                if (attrRows.length < 2) return null;
                return true;
              })() && (
                <section>
                  <SectionDivider />
                  <div className="font-condensed text-[22px] font-bold tracking-[1px] uppercase pb-3 border-b border-border mb-1">
                    Detalles de la experiencia
                  </div>
                  <p className="text-[13px] text-muted-foreground mb-5">Lo que necesitas saber para tu visita</p>
                  <div className="space-y-0">
                    {[
listing.experienceType?.length ? { label: "Experiencia", value: listing.experienceType.join(", ") } : null,
                       listing.duration ? { label: "Duración estimada", value: listing.duration } : null,
                      listing.experienceLocation ? { label: "Ubicación", value: listing.experienceLocation } : null,
                      listing.foodAvailable ? { label: "Comida / bebida", value: listing.foodAvailable } : null,
                      (listing.admissionType || listing.priceFrom || (listing as any).priceMin) ? (() => {
                        const isGratis = listing.admissionType?.toLowerCase() === "gratis";
                        const priceMin = (listing as any).priceMin as number | undefined;
                        const priceMax = (listing as any).priceMax as number | undefined;
                        let displayValue: string;
                        if (isGratis) {
                          displayValue = "Gratis";
                        } else if (priceMin != null && priceMax != null) {
                          displayValue = `$${priceMin} – $${priceMax}`;
                        } else if (priceMin != null) {
                          displayValue = `Desde $${priceMin}`;
                        } else if (listing.priceFrom) {
                          displayValue = listing.priceFrom;
                        } else {
                          displayValue = listing.admissionType || "De pago";
                        }
                        return { label: "Entrada", value: displayValue };
                      })() : null,
                      listing.bestVisitTime ? { label: "Mejor horario", value: listing.bestVisitTime } : null,
                      listing.idealFor?.length ? { label: "Recomendado para", value: listing.idealFor.join(" · ") } : null,
                    ].filter(Boolean).map((item, i, arr) => (
                      <div key={i} className={`grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] gap-x-6 py-[18px] rounded-lg transition-colors duration-150 hover:bg-foreground/[0.02] ${i < arr.length - 1 ? 'border-b border-foreground/[0.04]' : ''}`}>
                        <h4 className="text-[10px] font-semibold uppercase tracking-[3px] text-muted-foreground/45 pt-1">
                          {item!.label}
                        </h4>
                        <p className="text-[14px] font-semibold leading-relaxed text-foreground/85">
                          {item!.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}


              {/* Por qué lo recomendamos — Hotels */}
              {listing.cat === "hoteles" && listing.recomendadoBullets && listing.recomendadoBullets.length > 0 && (
                <section>
                  <SectionDivider />
                  <div className="font-condensed text-[22px] font-bold tracking-[1px] uppercase pb-3 border-b border-border mb-4">
                    Por qué lo recomendamos
                  </div>
                  {listing.recomendacionResumen && (
                    <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">{listing.recomendacionResumen}</p>
                  )}
                  <ul className="space-y-5">
                    {listing.recomendadoBullets.slice(0, 4).map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15px] text-foreground/65 leading-relaxed">
                        <Check className="w-4 h-4 text-gold/50 mt-0.5 shrink-0" strokeWidth={1.2} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Comodidades — Hotels */}
              {listing.cat === "hoteles" && listing.amenities && listing.amenities.length > 0 && (() => {
                const amenityIconMap = new Map<string, string | null>();
                for (const a of taxonomyAmenities) {
                  amenityIconMap.set(a.name, a.icon);
                }
                const AMENITY_PRIORITY: string[] = [
                  "Piscina", "Spa", "Gimnasio", "Casino", "Servicio a la habitación",
                  "Concierge", "Valet Parking", "Estacionamiento", "Wi-Fi", "Restaurantes",
                  "Centro de convenciones", "Tienda de regalos", "Accesible",
                ];
                const sortedAmenities = [...listing.amenities!].sort((a, b) => {
                  const ai = AMENITY_PRIORITY.findIndex(p => a.toLowerCase().includes(p.toLowerCase()));
                  const bi = AMENITY_PRIORITY.findIndex(p => b.toLowerCase().includes(p.toLowerCase()));
                  return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
                });
                const AMENITY_ICON_OVERRIDES: Record<string, string> = {
                  "estacionamiento gratis": "CircleParking",
                  "estación de carga para vehículos eléctricos": "PlugZap",
                  "accesible": "Accessibility",
                  "boliche": "Disc3",
                };
                function AmenityIcon({ iconName, amenityName }: { iconName: string | null | undefined; amenityName: string }) {
                  const overrideKey = amenityName.toLowerCase();
                  const overrideName = AMENITY_ICON_OVERRIDES[overrideKey];
                  if (overrideName) {
                    const OverrideIcon = (icons as any)[overrideName];
                    if (OverrideIcon) return <OverrideIcon className="w-4 h-4" strokeWidth={1.75} />;
                  }
                  if (!iconName) return <Check className="w-4 h-4" strokeWidth={1.75} />;
                  const pascal = iconName.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
                  const LucideIcon = (icons as any)[pascal];
                  if (!LucideIcon) return <Check className="w-4 h-4" strokeWidth={1.75} />;
                  return <LucideIcon className="w-4 h-4" strokeWidth={1.75} />;
                }
                return (
                  <section>
                    <SectionDivider />
                    <div className="font-condensed text-[22px] font-bold tracking-[1px] uppercase pb-3 border-b border-border mb-3">
                      Comodidades
                    </div>
                    <p className="text-[13px] text-muted-foreground mb-6">Servicios y comodidades del resort</p>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-[18px]">
                      {sortedAmenities.map((amenity, i) => (
                        <div key={i} className="flex items-center gap-2.5 px-4 py-3.5 bg-foreground/[0.03] border border-border rounded-lg text-[13px] text-foreground/70 min-h-[44px] transition-all duration-200 hover:bg-foreground/[0.06] hover:shadow-sm cursor-default">
                          <span className="text-foreground/70 shrink-0 flex items-center">
                            <AmenityIcon iconName={amenityIconMap.get(amenity)} amenityName={amenity} />
                          </span>
                          <span className="leading-tight">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })()}

              {/* Galería — non-shows categories */}
              {listing.cat !== "shows" && (() => {
                const galleryImages = (listing.galleryImages || [])
                  .map((img: any) => (typeof img === "string" ? img : img?.url))
                  .filter((img: string | undefined | null): img is string => !!img && img.trim().length > 0);
                const allImgs = Array.from(new Set([listing.image, ...galleryImages].filter(Boolean))).slice(1) as string[];
                const videoUrl = (listing as any).videoUrl as string | undefined;
                const youtubeId = videoUrl ? extractYouTubeId(videoUrl) : null;
                if (allImgs.length === 0 && !youtubeId) return null;
                const visibleImgs = allImgs.slice(0, youtubeId ? 5 : 6);
                const hasMore = allImgs.length > (youtubeId ? 5 : 6);

                // Determine grid layout based on image count
                const imgCount = visibleImgs.length + (youtubeId ? 1 : 0);

                return (
                  <section>
                    <SectionDivider />
                    <div className="pb-3 border-b border-border mb-5">
                      <div className="font-condensed text-[22px] font-bold tracking-[1px] uppercase">Galería</div>
                      <p className="text-sm text-muted-foreground mt-1">
                         {getGallerySubtitle(listing.cat)}
                       </p>
                    </div>

                    {/* 1 image — full width */}
                    {imgCount === 1 && !youtubeId && (
                      <div className="relative rounded-xl overflow-hidden group cursor-pointer transition-shadow duration-200 hover:shadow-md" onClick={() => setGalleryLightbox(0)}>
                        <img src={visibleImgs[0]} alt={`${listing.name} - 1`} className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] rounded-xl" style={{ aspectRatio: '16/9' }} loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl" />
                      </div>
                    )}

                    {/* 2 images — side by side */}
                    {imgCount === 2 && !youtubeId && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {visibleImgs.slice(0, 2).map((img, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden group cursor-pointer transition-shadow duration-200 hover:shadow-md" onClick={() => setGalleryLightbox(i)}>
                            <img src={img} alt={`${listing.name} - ${i + 1}`} className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" style={{ aspectRatio: '4/3' }} loading="lazy" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Exactly 5 images, no video — dedicated layout */}
                    {imgCount === 5 && !youtubeId && (
                      <GalleryFiveImageLayout
                        images={visibleImgs}
                        listingName={listing.name}
                        onImageClick={(index) => setGalleryLightbox(index)}
                      />
                    )}

                    {/* 3-4 or 6+ images, or has video */}
                    {((imgCount >= 3 && imgCount !== 5) || youtubeId) && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {/* First image is always the hero */}
                        {visibleImgs.length > 0 && (
                          <div className="relative rounded-xl overflow-hidden group cursor-pointer transition-shadow duration-200 hover:shadow-md row-span-2 col-span-1 sm:col-span-2" onClick={() => setGalleryLightbox(0)}>
                            <img src={visibleImgs[0]} alt={`${listing.name} - 1`} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" style={{ aspectRatio: '4/3' }} loading="lazy" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                          </div>
                        )}
                        {/* Video as a regular tile */}
                        {youtubeId && (
                          <div className="relative rounded-xl overflow-hidden">
                            <GalleryVideoPlayer
                              videoUrl={videoUrl!}
                              name={listing.name}
                              className="rounded-xl w-full aspect-[4/3.3]"
                              active={galleryLightbox === null}
                            />
                          </div>
                        )}
                        {/* Remaining images */}
                        {visibleImgs.slice(1).map((img, i) => {
                          const globalIdx = i + 1;
                          const isLast = i === visibleImgs.slice(1).length - 1 && hasMore;
                          return (
                            <div key={globalIdx} className="relative rounded-xl overflow-hidden group cursor-pointer transition-shadow duration-200 hover:shadow-md" onClick={() => isLast ? setGalleryLightbox(0) : setGalleryLightbox(globalIdx)}>
                              <img src={img} alt={`${listing.name} - ${globalIdx + 1}`} className="w-full aspect-[4/3.3] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" loading="lazy" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                              {isLast && (
                                <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center gap-1 transition-colors duration-300 group-hover:bg-black/55">
                                  <span className="text-white text-lg font-semibold">+{allImgs.length - visibleImgs.length} fotos</span>
                                  <span className="text-white/70 text-xs font-medium tracking-wide uppercase">Ver galería</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {galleryLightbox !== null && (
                      <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setGalleryLightbox(null)}>
                        <button onClick={(e) => { e.stopPropagation(); setGalleryLightbox(null); }} className="absolute top-5 right-5 text-white/70 hover:text-white z-10 transition-colors">
                          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setGalleryLightbox(galleryLightbox === 0 ? allImgs.length - 1 : galleryLightbox - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10 transition-colors">
                          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setGalleryLightbox(galleryLightbox === allImgs.length - 1 ? 0 : galleryLightbox + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10 transition-colors">
                          <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <div className="max-w-[92vw] max-h-[88vh]" onClick={(e) => e.stopPropagation()}>
                          <img src={allImgs[galleryLightbox]} alt={`${listing.name} - ${galleryLightbox + 1}`} className="max-w-full max-h-[88vh] object-contain" />
                        </div>
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 text-white/80 text-xs font-semibold px-3.5 py-1.5 rounded-full tracking-wide">
                          {galleryLightbox + 1} / {allImgs.length}
                        </div>
                      </div>
                    )}
                  </section>
                );
              })()}

              {(() => {
                let happyHours: { days?: string; hours?: string; details?: string; image?: string }[] = [];
                if (listing.happyHourDetails) {
                  try {
                    const parsed = JSON.parse(listing.happyHourDetails);
                    if (Array.isArray(parsed)) happyHours = parsed;
                  } catch { /* legacy text */ }
                }
                if (happyHours.length === 0 && (listing.happyHourDays || listing.happyHourDetails)) {
                  happyHours = [{ days: listing.happyHourDays || "", details: listing.happyHourDetails || "" }];
                }
                if (happyHours.length === 0) return null;
                return (
                  <section>
                    <SectionDivider />
                    <div className="font-condensed text-[22px] font-bold tracking-[1px] uppercase pb-3 border-b border-border mb-4">
                      Happy Hour
                    </div>
                    <div className="space-y-5">
                      {happyHours.map((hh, idx) => (
                        <div key={idx} className="bg-card border border-gold/20 rounded-lg overflow-hidden">
                          {hh.image && (
                            <img src={hh.image} alt="Happy Hour" className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setHhLightbox(hh.image!)} />
                          )}
                          <div className="px-6 py-7 space-y-4">
                            <span className="bg-gold/15 border border-gold/30 rounded-md px-3 py-1 text-xs font-bold tracking-[1px] uppercase text-gold inline-block">
                              {idx === 0 ? "Promoción" : `Promoción ${idx + 1}`}
                            </span>
                            {(hh.days || hh.hours) && (
                              <div className="flex items-center gap-2">
                                <span className="text-base leading-none">🕒</span>
                                {hh.days && <span className="text-sm font-medium text-foreground/90">{hh.days}</span>}
                                {hh.days && hh.hours && <span className="text-muted-foreground/40">·</span>}
                                {hh.hours && <span className="text-[15px] font-semibold text-foreground">{hh.hours}</span>}
                              </div>
                            )}
                            {hh.details && (
                              <div className="text-[15px] text-foreground/80 leading-[1.9] whitespace-pre-line">
                                {(() => { const t = hh.details.replace(/^happy\s*hour\s*(todos los días\s*(con\s*)?)?/i, ""); return t.charAt(0).toUpperCase() + t.slice(1); })()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })()}

              {hhLightbox && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setHhLightbox(null)}>
                  <button onClick={(e) => { e.stopPropagation(); setHhLightbox(null); }} className="absolute top-5 right-5 text-white/70 hover:text-white z-10 transition-colors">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <div className="max-w-[92vw] max-h-[88vh]" onClick={(e) => e.stopPropagation()}>
                    <img src={hhLightbox} alt="Happy Hour" className="max-w-full max-h-[88vh] object-contain" />
                  </div>
                </div>
              )}

              {/* Google Reviews section — only if real reviews exist */}
              {listing.googlePlaceId && !googleReviewsLoading && googleReviews && googleReviews.length > 0 && (
                <section>
                  <SectionDivider />
                  <div className="font-condensed text-[22px] font-bold tracking-[1px] uppercase pb-1 border-b border-border mb-2">
                    Opiniones de visitantes
                  </div>
                  <p className="text-[11px] text-muted-foreground/60 tracking-wide mb-6">Basado en reseñas verificadas de Google</p>

                  {(() => {
                    const maxVisible = 4;
                    const visibleReviews = googleReviews.slice(0, maxVisible);
                    return (
                      <>
                        <div className="space-y-5">
                          {visibleReviews.map((r: any, i: number) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0_3px_12px_rgba(0,0,0,0.08)] hover:-translate-y-[1px]">
                              {/* Stars + numeric rating */}
                              <div className="flex items-center gap-2 mb-2">
                                <StarRating rating={r.rating} size={16} />
                                <span className="text-[13px] font-semibold text-foreground/70">{r.rating}.0</span>
                              </div>
                              {/* Avatar + name + time */}
                              <div className="flex items-center gap-2.5">
                                {r.profile_photo_url ? (
                                  <img src={r.profile_photo_url} alt={r.author_name} className="w-9 h-9 rounded-full object-cover" />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-[13px] font-semibold text-muted-foreground">
                                    {r.author_name?.charAt(0)?.toUpperCase() || '?'}
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold text-[14px] leading-tight">{r.author_name}</div>
                                  <div className="text-[11px] text-muted-foreground/60 leading-tight mt-0.5">{r.relative_time_description}</div>
                                </div>
                              </div>
                              {r.text && <ReviewText text={r.text} originalLanguage={r.original_language} />}
                            </div>
                          ))}
                        </div>
                        <a
                          href={listing.googleMapsUrl || `https://search.google.com/local/reviews?placeid=${listing.googlePlaceId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-3 text-[12px] font-semibold tracking-[1px] text-foreground/60 hover:text-foreground hover:underline transition-all"
                        >
                          Ver todas las reseñas →
                        </a>
                      </>
                    );
                  })()}
                </section>
              )}
            </div>

            {/* Sidebar */}
             <div className="sticky top-[90px] space-y-5">
              {/* ── Detalles del show (shows only) ── */}
              {listing.cat === "shows" && (() => {
                const showDetails: { label: string; value: string }[] = [
                  ...(listing.showExperienceType?.length ? [{ label: "Experiencia", value: listing.showExperienceType.join(", ") }] : []),
                  ...(listing.duration ? [{ label: "Duración", value: listing.duration }] : []),
                  ...(listing.priceFrom ? [{ label: "Precio desde", value: listing.priceFrom }] : []),
                  ...(listing.minimumAge ? [{ label: "Edad mínima", value: listing.minimumAge }] : []),
                ];
                if (showDetails.length === 0) return null;
                return (
                  <div className="bg-card rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] mt-1" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="px-5 py-4 font-condensed text-[15px] font-extrabold tracking-[2px] uppercase text-foreground/80" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Detalles del show</div>
                    {showDetails.map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3.5 text-sm" style={{ borderBottom: i < showDetails.length - 1 ? '1px solid hsl(var(--border))' : undefined }}>
                        <span className="text-muted-foreground text-[13px]">{item.label}</span>
                        <span className="text-foreground font-semibold text-[13.5px]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
              <div className="bg-card rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="px-5 py-4 font-condensed text-sm font-bold tracking-[2px] uppercase text-muted-foreground" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Información</div>
                {(() => {
                  const structuredHours = formatStructuredHours(listing.hours);
                  const plainOpen = !structuredHours && listing.hours ? isOpenNow(listing.hours) : false;
                  const hoursIsOpen = structuredHours ? structuredHours.isOpen : plainOpen;
                  const isHotel = listing.cat === "hoteles";

                  const infoItems: { icon: string; label: string; value?: React.ReactNode }[] = [
                    ...(parentResort ? [{
                      icon: "🏨",
                      label: "Dentro de",
                      value: (
                        <Link href={`/lugar/${parentResort.slug}`} className="text-foreground/80 hover:text-foreground transition-colors underline decoration-border hover:decoration-foreground/40 font-semibold">
                          {parentResort.name}
                        </Link>
                      ) as React.ReactNode,
                    }] : []),
                    ...(listing.address ? [{ icon: "📍", label: "Dirección", value: listing.address as React.ReactNode }] : []),
                    ...(listing.phone ? [{ icon: "📞", label: "Teléfono", value: listing.phone as React.ReactNode }] : []),
                    ...(!isHotel && listing.cat !== "shows" && (structuredHours || (listing.hours && !listing.hours.trim().startsWith("{"))) ? [{
                      icon: "🕐",
                      label: "Horario",
                      value: structuredHours
                        ? (
                          <div className="space-y-1.5">
                            {structuredHours.lines.map((line, li) => (
                              <div key={li}>{line}</div>
                            ))}
                          </div>
                        )
                        : listing.hours as React.ReactNode,
                    }] : []),
                  ];

                  return infoItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3.5 px-5 py-3.5 last:border-b-0 text-sm" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[1.5px] text-muted-foreground/50 font-medium mb-1">
                           {item.label}
                          {item.label === "Horario" && !isHotel && (structuredHours || (listing.hours && !listing.hours.trim().startsWith("{"))) && (
                            hoursIsOpen
                              ? <span className="inline-flex items-center px-2.5 py-0.5 bg-green-500/10 border border-green-500/30 rounded-full text-[11px] font-semibold text-green-400 normal-case tracking-normal">Abierto</span>
                              : <span className="inline-flex items-center px-2.5 py-0.5 bg-red-500/10 border border-red-500/30 rounded-full text-[11px] font-semibold text-red-400 normal-case tracking-normal">Cerrado</span>
                          )}
                        </div>
                        <div className="text-foreground font-medium text-[13.5px]">{item.value}</div>
                      </div>
                    </div>
                  ));
                })()}
                {isPremium && (listing.instagram || listing.facebook || listing.website || listing.tiktok || listing.twitterX) && (
                  <div className="flex items-start gap-3.5 px-5 py-3.5 text-sm">
                    <span className="text-lg shrink-0 mt-0.5">📱</span>
                    <div>
                      <div className="text-[10px] uppercase tracking-[1.5px] text-muted-foreground/60 font-medium mb-1.5">Redes Sociales</div>
                      <div className="flex gap-2 flex-wrap">
                        {listing.instagram && (
                          <a href={listing.instagram} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground/5 border border-border rounded-md text-xs font-bold text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:shadow-sm transition-all">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="#E4405F"/></svg>
                            Instagram
                          </a>
                        )}
                        {listing.facebook && (
                          <a href={listing.facebook} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground/5 border border-border rounded-md text-xs font-bold text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:shadow-sm transition-all">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/></svg>
                            Facebook
                          </a>
                        )}
                        {listing.twitterX && (
                          <a href={listing.twitterX} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground/5 border border-border rounded-md text-xs font-bold text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:shadow-sm transition-all">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/></svg>
                            X
                          </a>
                        )}
                        {listing.tiktok && (
                          <a href={listing.tiktok} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground/5 border border-border rounded-md text-xs font-bold text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:shadow-sm transition-all">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.48a8.27 8.27 0 004.77 1.5V7.55a4.83 4.83 0 01-1-.86z" fill="currentColor"/></svg>
                            TikTok
                          </a>
                        )}
                        {listing.website && (
                          <a href={listing.website} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-foreground/5 border border-border rounded-md text-xs font-bold text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:shadow-sm transition-all">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                            Sitio web
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {listing.address && (
                <div className="bg-card rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div className="p-4">
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.address + ', Las Vegas, NV')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-[240px] rounded-lg border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Mapa de ${listing.name}`}
                    />
                    <a
                      href={listing.googleMapsUrl || listing.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address + ', Las Vegas, NV')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground hover:underline mt-3 transition-colors"
                    >
                      Ver en Google Maps →
                    </a>
                  </div>
                </div>
              )}

              {(() => {
                const liveRating = googlePlaceData?.rating;
                const liveCount = googlePlaceData?.user_ratings_total;
                const rating = liveRating ?? listing.googleRating ?? null;
                const ratingCount = liveCount ?? listing.googleUserRatingsTotal;
                const isFromGoogle = liveRating != null || listing.googleRating != null;

                // Show loading skeleton only while fetching
                if (googleReviewsLoading && listing.googlePlaceId) {
                  return (
                    <div className="bg-card rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                      <div className="px-5 pt-5 pb-1 font-condensed text-[11px] font-bold tracking-[2.5px] uppercase text-muted-foreground/50 text-center">Calificación</div>
                      <div className="px-6 py-7 flex flex-col items-center">
                        <div className="animate-pulse py-4">
                          <div className="h-12 bg-muted rounded w-20 mx-auto mb-3" />
                          <div className="h-4 bg-muted rounded w-32 mx-auto mb-2" />
                          <div className="h-3 bg-muted rounded w-40 mx-auto" />
                        </div>
                      </div>
                    </div>
                  );
                }

                // Hide entire card if no real rating
                if (rating == null || rating === 0) return null;

                return (
                  <div className="bg-card rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)]" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="px-5 pt-5 pb-1 font-condensed text-[11px] font-bold tracking-[2.5px] uppercase text-muted-foreground/50 text-center">Calificación</div>
                    <div className="px-6 py-7 flex flex-col items-center">
                      <div className="flex flex-col items-center gap-4">
                        <StarRating rating={rating} size={30} />
                        <div className="text-[33px] font-semibold" style={{ color: '#A67C2E', letterSpacing: '0.5px' }}>
                          {rating.toFixed(1)} <span className="text-[18px] font-normal" style={{ color: '#A67C2E80' }}>/ 5</span>
                        </div>
                        <div className="text-[12px] leading-relaxed text-center max-w-[210px]" style={{ color: '#6B6B6B' }}>
                          {isFromGoogle && ratingCount != null
                            ? (
                              <span className="flex flex-col items-center gap-1">
                                <span className="flex items-center gap-1.5">
                                   <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                  </svg>
                                  <span className="font-semibold" style={{ color: '#555' }}>Google</span>
                                </span>
                                <span>{ratingCount.toLocaleString()} reseñas verificadas</span>
                              </span>
                            )
                            : isFromGoogle
                              ? (
                                <span className="flex items-center justify-center gap-1.5">
                                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                  </svg>
                                  Basado en reseñas de Google
                                </span>
                              )
                              : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

          {/* Inside resort — child listings with category filter tabs */}
          {childListings.length > 0 && (() => {
            const RESORT_TABS = [
              { cat: "restaurantes", label: "Restaurantes" },
              { cat: "nocturna",     label: "Vida nocturna" },
              { cat: "shows",        label: "Eventos" },
              { cat: "atracciones",  label: "Atracciones" },
              { cat: "tiendas",      label: "Tiendas" },
            ];
            const availableTabs = RESORT_TABS.filter(t => childListings.some(l => l.cat === t.cat));
            const activeCatKey = resortCat || (availableTabs[0]?.cat ?? "");
            const activeTab = RESORT_TABS.find(t => t.cat === activeCatKey);

            const items = childListings.filter(l => l.cat === activeCatKey);
            const seleccionados = items.filter(l => l.isSponsored);
            const rest = items.filter(l => !l.isSponsored).sort((a, b) => {
              const rA = a.googleRating ?? a.stars ?? -1;
              const rB = b.googleRating ?? b.stars ?? -1;
              if (rA !== rB) return rB - rA;
              return (b.googleUserRatingsTotal ?? 0) - (a.googleUserRatingsTotal ?? 0);
            });
            const dayIndex = Math.floor(Date.now() / 86400000);
            const rotated = seleccionados.length > 1
              ? [...seleccionados.slice(dayIndex % seleccionados.length), ...seleccionados.slice(0, dayIndex % seleccionados.length)]
              : seleccionados;
            const sorted = [...rotated, ...rest];

            return (
              <div className="mt-16 pt-16">
                <hr className="border-t border-border/40 mb-16" />
                <SectionHeader eyebrow="Dentro del resort" title={`Qué hay en ${listing.name}`} />
                <p className="text-[15px] text-muted-foreground/70 leading-relaxed -mt-2 mb-8">
                  Descubre los restaurantes, bares y experiencias que forman parte del resort.
                </p>

                {/* Category filter tabs */}
                <div className="flex gap-2 flex-wrap mb-8">
                  {availableTabs.map(tab => {
                    const count = childListings.filter(l => l.cat === tab.cat).length;
                    const isActive = tab.cat === activeCatKey;
                    return (
                      <button
                        key={tab.cat}
                        onClick={() => setResortCat(tab.cat)}
                        className={`px-4 py-2 rounded-full text-[12px] font-bold tracking-[1px] uppercase transition-all border ${
                          isActive
                            ? "bg-foreground text-background border-foreground"
                            : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
                        }`}
                      >
                        {tab.label} <span className={isActive ? "opacity-60" : "opacity-40"}>({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active category listings */}
                {activeTab && sorted.length > 0 && (
                  <div>
                    <div className="flex items-end justify-between pb-3 border-b border-border/15 mb-8">
                      {activeCatKey === "restaurantes" && (
                        <Link
                          href={`/explorar?cat=restaurantes&resort=${listing.slug}`}
                          className="text-[13px] text-foreground/60 hover:text-foreground transition-colors whitespace-nowrap ml-auto"
                        >
                          Ver todos los restaurantes →
                        </Link>
                      )}
                    </div>
                    {sorted.length === 1 ? (
                      <div className="max-w-[480px]">
                        <ListingCard listing={sorted[0]} />
                      </div>
                    ) : sorted.length === 2 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {sorted.map(item => <ListingCard key={item.id} listing={item} />)}
                      </div>
                    ) : (
                      <ResortCategoryCarousel items={sorted} />
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* FAQ — Hotels only */}
          {listing.cat === "hoteles" && (() => {
            // Use full hotel name for SEO accuracy
            const shortName = listing.name;

            const restaurantChildren = childListings.filter(l => l.cat === "restaurantes");
            const showChildren = childListings.filter(l => l.cat === "shows");
            const amenities = (listing.amenities || []).map(a => a.toLowerCase());
            const hasPool = amenities.some(a => a.includes("piscina"));
            const hasSpa = amenities.some(a => a.includes("spa"));
            const hasGym = amenities.some(a => a.includes("gimnasio"));
            const hasCasino = amenities.some(a => a.includes("casino"));
            const hasParking = amenities.some(a => a.includes("estacionamiento") || a.includes("valet"));
            const hasWifi = amenities.some(a => a.includes("wifi"));
            const hasPetFriendly = amenities.some(a => a.includes("pet"));
            const hasRoomService = amenities.some(a => a.includes("habitación") || a.includes("concierge"));
            const isOnStrip = listing.region?.toLowerCase().includes("strip") || listing.address?.toLowerCase().includes("las vegas blvd") || listing.address?.toLowerCase().includes("boulevard");
            const isDowntown = listing.region?.toLowerCase().includes("downtown") || listing.address?.toLowerCase().includes("fremont");
            const isBoutique = listing.propertyType?.toLowerCase().includes("boutique");
            const isLuxury = listing.propertyType?.toLowerCase().includes("lujo") || listing.stars >= 4;
            const starCount = listing.stars || 0;

            const familyAmenities: string[] = [];
            if (hasPool) familyAmenities.push("piscina");
            if (hasSpa) familyAmenities.push("spa");
            if (hasGym) familyAmenities.push("gimnasio");
            if (hasCasino) familyAmenities.push("casino");
            if (hasWifi) familyAmenities.push("Wi-Fi");
            if (hasRoomService) familyAmenities.push("servicio a la habitación");

            const faqs: { q: string; a: string }[] = [
              // 1. ¿Dónde se encuentra...?
              {
                q: `¿Dónde se encuentra ${shortName}?`,
                a: listing.address
                  ? `${shortName} se encuentra en ${listing.address}${listing.region ? `, en la zona de ${listing.region}` : ''}. ${
                    isOnStrip ? 'Está ubicado directamente sobre el famoso Las Vegas Strip, con acceso peatonal a casinos, restaurantes y entretenimiento.' :
                    isDowntown ? 'Está en el corazón de Downtown Las Vegas, cerca de Fremont Street y la escena gastronómica local.' :
                    listing.region ? `La zona de ${listing.region} ofrece una experiencia diferente al Strip tradicional.` : ''
                  }`
                  : `${shortName} está en ${listing.region || 'Las Vegas, Nevada'}. ${isOnStrip ? 'Sobre el Strip, en el centro de la acción.' : 'Consulta su sitio web para la dirección exacta y cómo llegar.'}`,
              },
              // 2. ¿Está ... en el Strip?
              {
                q: `¿Está ${shortName} en el Strip de Las Vegas?`,
                a: isOnStrip
                  ? `Sí, ${shortName} está sobre el Las Vegas Strip. Tendrás a poca distancia los principales casinos, shows y centros comerciales de la ciudad.`
                  : isDowntown
                    ? `${shortName} está en Downtown Las Vegas, no directamente sobre el Strip, pero con fácil acceso en auto o transporte público. Downtown tiene su propia oferta gastronómica y cultural que vale la pena explorar.`
                    : listing.region
                      ? `${shortName} se encuentra en la zona de ${listing.region}, fuera del Strip. Esto puede significar precios más accesibles y un ambiente distinto al de las propiedades sobre el Boulevard.`
                      : `Recomendamos verificar la ubicación exacta de ${shortName} para determinar su distancia al Strip.`,
              },
              // 3. ¿Es ... ideal para familias o parejas?
              {
                q: `¿Es ${shortName} ideal para familias o parejas?`,
                a: (() => {
                  const traits: string[] = [];
                  if (hasPool) traits.push("piscina");
                  if (restaurantChildren.length > 0) traits.push(`${restaurantChildren.length} restaurante${restaurantChildren.length > 1 ? 's' : ''} dentro del resort`);
                  if (showChildren.length > 0) traits.push("shows en vivo");
                  if (hasSpa) traits.push("spa");

                  if (isBoutique) {
                    return `${shortName} tiene un perfil boutique que lo hace especialmente atractivo para parejas y viajeros adultos que buscan un ambiente más íntimo${traits.length ? `. Cuenta con ${traits.join(', ')}` : ''}.`;
                  }
                  if (isLuxury && traits.length > 0) {
                    return `Como ${starCount >= 4 ? `propiedad de ${starCount} estrellas` : 'resort de lujo'}, ${shortName} es popular entre parejas, pero también funciona para familias gracias a sus ${traits.join(', ')}.`;
                  }
                  if (traits.length > 0) {
                    return `${shortName} recibe tanto familias como parejas. Entre sus amenidades destacan ${traits.join(', ')}, lo que lo convierte en una opción versátil para distintos tipos de viajero.`;
                  }
                  return `${shortName} es adecuado para distintos perfiles de viajero. Recomendamos revisar sus amenidades en el sitio oficial para elegir la mejor opción según tu grupo.`;
                })(),
              },
              // 4. ¿Qué restaurantes hay dentro de...?
              {
                q: `¿Qué restaurantes hay dentro de ${shortName}?`,
                a: restaurantChildren.length > 0
                  ? `${shortName} cuenta con ${restaurantChildren.length} restaurante${restaurantChildren.length > 1 ? 's' : ''} en sus instalaciones: ${restaurantChildren.slice(0, 3).map(r => r.name).join(', ')}${restaurantChildren.length > 3 ? ` y ${restaurantChildren.length - 3} más` : ''}. Puedes explorarlos más arriba en esta misma página.`
                  : hasCasino
                    ? `No tenemos restaurantes registrados dentro de ${shortName} en este momento, aunque como casino-resort es probable que ofrezca opciones gastronómicas. Consulta su sitio web para ver el menú actualizado.`
                    : `Actualmente no tenemos información de restaurantes dentro de ${shortName}. Te sugerimos verificar directamente con la propiedad.`,
              },
              // 5. ¿Qué comodidades ofrece...?
              {
                q: `¿Qué comodidades ofrece ${shortName}?`,
                a: familyAmenities.length > 0
                  ? `${shortName} ofrece ${familyAmenities.join(', ')}${hasPetFriendly ? ', y además es pet-friendly' : ''}. ${
                    isLuxury ? 'Como propiedad premium, estas comodidades están diseñadas para ofrecer una experiencia de primer nivel.' :
                    'Estas comodidades lo hacen una opción completa para tu estadía en Las Vegas.'
                  }`
                  : `Te sugerimos consultar directamente con ${shortName} para conocer la lista completa de comodidades disponibles.`,
              },
              // 6. ¿Hay estacionamiento en...?
              {
                q: `¿Hay estacionamiento en ${shortName}?`,
                a: hasParking
                  ? `Sí, ${shortName} cuenta con estacionamiento${hasCasino ? '. Como casino-resort, es común que ofrezca opciones de valet y self-parking' : ''}. Las tarifas pueden variar; te recomendamos confirmar precios y disponibilidad al momento de reservar.`
                  : hasCasino
                    ? `Aunque no tenemos datos confirmados, la mayoría de los casino-resorts en Las Vegas ofrecen estacionamiento (valet o self-parking). Consulta directamente con ${shortName} para tarifas actualizadas.`
                    : `No contamos con información específica sobre estacionamiento en ${shortName}. Te sugerimos contactarlos antes de tu visita para planificar tu llegada.`,
              },
              // 7. ¿Cuánto cuesta una habitación en...?
              // 7. ¿Qué hay cerca de...? (local SEO — context-aware by region)
              {
                q: `¿Qué hay cerca de ${shortName}?`,
                a: (() => {
                  const region = (listing.region || '').toLowerCase();
                  const address = (listing.address || '').toLowerCase();
                  const name = (listing.name || '').toLowerCase();

                  // Summerlin / Red Rock area
                  if (region.includes('summerlin') || name.includes('red rock') || address.includes('summerlin') || address.includes('charleston')) {
                    return `${shortName} está en Summerlin, uno de los vecindarios más exclusivos de Las Vegas. A pocos minutos tienes Red Rock Canyon National Conservation Area, ideal para senderismo y escalada. También está cerca de Downtown Summerlin, un centro comercial al aire libre con restaurantes, tiendas y entretenimiento. Es una excelente base si quieres disfrutar de la naturaleza sin alejarte del confort de un resort.`;
                  }
                  // The Strip
                  if (isOnStrip || region.includes('strip')) {
                    return `${shortName} se encuentra sobre el famoso Las Vegas Strip, rodeado de los principales casinos, teatros y restaurantes de la ciudad. A poca distancia peatonal encontrarás el Bellagio, el Cosmopolitan, el T-Mobile Arena y los grandes centros comerciales como Fashion Show Mall y The Shops at Crystals. También está bien conectado con el aeropuerto Harry Reid, a unos 15–20 minutos en taxi o Uber.`;
                  }
                  // Downtown Las Vegas
                  if (isDowntown || region.includes('downtown')) {
                    return `${shortName} está en el corazón de Downtown Las Vegas, a pasos de Fremont Street Experience, conocida por su techo de luces LED y shows en vivo gratuitos. Cerca encontrarás el Distrito de las Artes, el Mercado de los Arcos y varios restaurantes independientes que forman parte de la escena gastronómica local. Es una zona con mucho carácter, popular entre viajeros que buscan algo diferente al Strip.`;
                  }
                  // Henderson / Green Valley
                  if (region.includes('henderson') || region.includes('green valley') || address.includes('henderson')) {
                    return `${shortName} está en Henderson, una de las ciudades con mayor crecimiento en el área metropolitana de Las Vegas. Cerca tienes el Lake Las Vegas, perfect para paseos en kayak y gastronomía junto al lago, así como el Sloan Canyon National Conservation Area. Henderson ofrece un ambiente más tranquilo que el Strip, con acceso rápido en auto hacia el centro de Las Vegas.`;
                  }
                  // North Las Vegas / Aliante
                  if (region.includes('north') || address.includes('north las vegas') || address.includes('aliante')) {
                    return `${shortName} se encuentra en el norte del área metropolitana de Las Vegas. La zona ofrece precios más accesibles y fácil acceso en auto hacia el Strip y Downtown. Cerca tienes el Floyd Lamb Park at Tule Springs, un parque natural ideal para picnics y caminatas, y el Nellis Dunes Off-Highway Vehicle Area, popular entre los amantes del todoterreno.`;
                  }
                  // Boulder / Lake Mead area
                  if (region.includes('boulder') || address.includes('boulder') || region.includes('lake mead')) {
                    return `${shortName} está cerca del Lake Mead National Recreation Area, el lago artificial más grande de Estados Unidos, ideal para paseos en bote, pesca y deportes acuáticos. También tienes acceso rápido al Hoover Dam, una de las grandes maravillas de la ingeniería moderna. La zona es perfecta para quienes quieren combinar naturaleza con comodidad.`;
                  }
                  // Generic fallback
                  return `${shortName} está a corta distancia del Las Vegas Strip y de los principales atractivos de la ciudad. La ubicación permite acceder fácilmente a casinos, restaurantes de renombre, centros comerciales y entretenimiento en vivo. Consulta el mapa para ver qué tienes cerca durante tu estadía.`;
                })(),
              },
              // 8. ¿Cómo llegar a...?
              {
                q: `¿Cómo llegar a ${shortName}?`,
                a: (() => {
                  if (isOnStrip) {
                    return `${shortName} está sobre el Las Vegas Strip, accesible desde Las Vegas Boulevard. Desde el aeropuerto Harry Reid (LAS), puedes llegar en taxi o rideshare en aproximadamente 15–20 minutos. También puedes tomar el Monorail o el Deuce bus que recorren el Strip. Si vienes en auto, la mayoría de los GPS te guiarán directamente; busca señalización hacia self-parking o valet en la entrada principal.`;
                  }
                  if (isDowntown) {
                    return `${shortName} está en Downtown Las Vegas, a unos 20–25 minutos del aeropuerto Harry Reid (LAS) en taxi o rideshare. Desde el Strip, puedes tomar un Uber/Lyft (10–15 min) o el bus Deuce/SDX que conecta el Strip con Fremont Street. Si llegas en auto, hay estacionamiento disponible en la zona.`;
                  }
                  return `Para llegar a ${shortName}, te recomendamos usar GPS o una app de navegación con la dirección${listing.address ? ` ${listing.address}` : ''}. Desde el aeropuerto Harry Reid (LAS), la mayoría de las propiedades en Las Vegas están a 15–30 minutos en taxi o rideshare. También puedes rentar un auto en el aeropuerto si planeas explorar atracciones fuera del Strip.`;
                })(),
              },
              // 9. ¿Cuánto cuesta una habitación en...?
              {
                q: `¿Cuánto cuesta una habitación en ${shortName}?`,
                a: `Los precios de las habitaciones en ${shortName} cambian según la fecha y disponibilidad. Puedes consultar precios actualizados en el botón "Ver disponibilidad".`,
              },
            ];

            return (
              <section className="mt-16">
                <SectionDivider />
                <div className="font-condensed text-[22px] font-bold tracking-[1px] uppercase pb-3 border-b border-border mb-2">
                  Preguntas frecuentes
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Respuestas a preguntas frecuentes sobre {shortName}.
                </p>
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    mainEntity: faqs.map(faq => ({
                      "@type": "Question",
                      name: faq.q,
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.a,
                      },
                    })),
                  }) }}
                />
                <Accordion type="single" collapsible className="space-y-1">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border py-1">
                      <AccordionTrigger className="text-[15px] font-bold text-foreground py-5 hover:no-underline gap-3 [&>svg]:text-muted-foreground [&>svg]:size-4 [&>svg]:shrink-0 [&[data-state=open]>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-200">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-foreground/70 leading-relaxed pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            );
          })()}

          {/* Upcoming Events for nightlife venues */}
          {upcomingEvents.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <SectionHeader eyebrow="Eventos" title="Próximos eventos" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map(ev => {
                  const d = new Date(ev.startDatetime!);
                  const dayName = d.toLocaleDateString("es-MX", { weekday: "long" });
                  const month = d.toLocaleDateString("es-MX", { month: "short" }).replace(".", "");
                  const day = d.getDate();
                  return (
                    <Link
                      key={ev.id}
                      href={`/lugar/${ev.slug}`}
                      className="group bg-card border border-border rounded-lg overflow-hidden hover:border-muted-foreground/40 hover:shadow-md transition-all"
                    >
                      {ev.image && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img src={ev.image} alt={ev.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="p-4 flex gap-4 items-start">
                        <div className="text-center shrink-0 min-w-[48px]">
                          <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground">{month}</div>
                          <div className="font-display text-[28px] leading-none">{day}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[15px] leading-snug truncate group-hover:text-primary transition-colors">{ev.name}</div>
                          <div className="text-[13px] text-muted-foreground capitalize mt-0.5">{dayName}</div>
                          {ev.tagline && (
                            <div className="text-[12px] text-muted-foreground/70 mt-1 truncate">{ev.tagline}</div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Related */}
          {finalRelated.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <SectionHeader eyebrow="Explora más" title={`${listing?.cat === 'hoteles' ? 'Hoteles similares' : listing?.cat === 'restaurantes' ? 'Restaurantes similares' : listing?.cat === 'shows' ? 'Más experiencias como esta' : listing?.cat === 'nocturna' || listing?.cat === 'vida-nocturna' ? 'Lugares similares' : 'Opciones similares'}`} viewAllLink={`/explorar?cat=${listing?.cat === 'vida-nocturna' ? 'nocturna' : listing?.cat || 'hoteles'}`} viewAllLabel={`${listing?.cat === 'hoteles' ? 'Ver más hoteles en Las Vegas' : listing?.cat === 'restaurantes' ? 'Ver más restaurantes en Las Vegas' : listing?.cat === 'shows' ? 'Ver más shows en Las Vegas' : listing?.cat === 'nocturna' || listing?.cat === 'vida-nocturna' ? 'Ver más vida nocturna en Las Vegas' : 'Ver más opciones en Las Vegas'} →`} />
              <p className="text-[15px] text-muted-foreground/70 leading-relaxed -mt-4 mb-6">
                {listing?.cat === 'nocturna' || listing?.cat === 'vida-nocturna'
                  ? 'Descubre clubes y lugares de vida nocturna similares en Las Vegas.'
                  : listing?.cat === 'shows'
                    ? 'Descubre otros shows que te pueden interesar.'
                    : `Descubre ${listing?.cat === 'hoteles' ? 'otros hoteles populares en' : listing?.cat === 'restaurantes' ? 'otros restaurantes populares en' : 'otros lugares populares en'} Las Vegas.`}
              </p>
               <div className="relative group/carousel">
                <div className="overflow-hidden">
                  <div
                    ref={relatedScrollRef}
                    className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-1 scrollbar-hide bg-transparent"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {finalRelated.slice(0, 6).map(l => (
                      <div key={l.id} className="min-w-[280px] w-[85vw] sm:w-[calc((100%-32px)/3)] sm:min-w-[calc((100%-32px)/3)] flex-shrink-0 snap-start similar-card-tall">
                        <ListingCard listing={l} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Edge fades */}
                {relatedCanScrollLeft && (
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background/60 to-transparent z-[1] pointer-events-none transition-opacity duration-300" />
                )}
                {relatedCanScrollRight && (
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/60 to-transparent z-[1] pointer-events-none transition-opacity duration-300" />
                )}
                {/* Left arrow */}
                {relatedCanScrollLeft && (
                  <button
                    onClick={() => relatedScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                    className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-card border border-border shadow-sm text-foreground/50 hover:text-foreground hover:shadow-md transition-all opacity-0 group-hover/carousel:opacity-75 hover:!opacity-100"
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                {/* Right arrow */}
                {relatedCanScrollRight && (
                  <button
                    onClick={() => relatedScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                    className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-card border border-border shadow-sm text-foreground/50 hover:text-foreground hover:shadow-md transition-all opacity-0 group-hover/carousel:opacity-75 hover:!opacity-100"
                    aria-label="Siguiente"
                  >
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {listing.cat === "restaurantes" && (
        <MobileStickyBar
          address={listing.address}
          googleMapsUrl={listing.googleMapsUrl}
          reservationUrl={listing.reservationUrl}
          isPaidTier={listing.isFeatured || listing.isSponsored}
        />
      )}
    </>
  );
}

