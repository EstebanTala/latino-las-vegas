import Link from "next/link";
import { Listing, getStarsDisplay } from "@/data/listings";
import { useListings } from "@/hooks/useListings";
import ListingMetaRow from "@/components/ListingMetaRow";
import { isNewListing } from "@/lib/isNewListing";
import { hasShowToday } from "@/lib/showToday";

export default function ListingCard({ listing, featured, activeCat, trendBadge: _trendBadge }: { listing: Listing; featured?: boolean; activeCat?: string; trendBadge?: string }) {
  const { data: allListings = [] } = useListings();
  const isSponsored = listing.isSponsored;
  const isRestaurant = listing.cat === "restaurantes";
  const isFeatured = listing.isFeatured && !isSponsored;
  const parentResort = listing.locatedInListingId ? allListings.find(l => String(l.id) === listing.locatedInListingId) : null;

  // Unified metadata row: [CATEGORY] · [SUBTYPE] · [OPTIONAL SIGNAL]
  const getMetaRow = (): { category: string; subtype?: string; signal?: { text: string; pill?: boolean } } => {
    switch (listing.cat) {
      case 'shows':
        return {
          category: 'Shows & Eventos',
          subtype: listing.showExperienceType?.[0],
          signal: hasShowToday(listing.startDatetime, listing.hours) ? { text: 'Hoy', pill: true } : undefined,
        };
      case 'hoteles':
        return {
          category: 'Hoteles & Casinos',
          subtype: listing.stars ? `${listing.stars}★` : undefined,
        };
      case 'atracciones':
        return {
          category: 'Atracción',
          subtype: listing.experienceType?.[0],
        };
      case 'restaurantes':
        return {
          category: 'Restaurante',
          subtype: listing.cuisine?.[0],
        };
      case 'nocturna':
        return {
          category: 'Vida Nocturna',
          subtype: listing.venueType?.[0] || listing.musicGenres?.[0],
        };
      default:
        return { category: listing.catLabel || '' };
    }
  };

  const meta = getMetaRow();

  // Card border/shadow hierarchy
  const cardStyle = isSponsored
    ? "border-foreground/12 border-[1.5px] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_10px_24px_rgba(0,0,0,0.12)] bg-[hsl(var(--card)/0.97)]"
    : (featured || isFeatured)
      ? "border-gold/15 shadow-[0_2px_14px_rgba(0,0,0,0.07)]"
      : "border-border shadow-card";

  return (
    <Link
      href={`/lugar/${listing.slug}`}
      className={`group bg-card rounded-xl border overflow-hidden block h-full flex flex-col transition-all duration-300 ease-out lg:hover:shadow-[0_8px_32px_rgba(0,0,0,0.14)] lg:hover:border-foreground/12 lg:hover:-translate-y-0.5 active:scale-[0.98] active:duration-100 lg:active:scale-100 ${cardStyle}`}
    >
      {/* Image — fixed aspect ratio */}
      <div className="relative overflow-hidden bg-dark-4 aspect-[3/2]">
        <div className="w-full h-full flex items-center justify-center text-5xl transition-transform duration-500 ease-out lg:group-hover:scale-[1.04]">
          {listing.image ? (
            <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <span>{listing.icon}</span>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent pointer-events-none" />

        {isSponsored && (
          <div className="absolute top-3 left-3 text-[9.5px] px-3 py-1 bg-[hsl(0,0%,10%)]/80 border border-[rgba(195,175,120,0.2)] font-bold tracking-[2.5px] uppercase rounded-full text-white backdrop-blur-md lg:text-[10px] lg:py-[3px]">
            Seleccionado
          </div>
        )}

        {!isSponsored && (featured || isFeatured) && (
          <div className="absolute top-3 left-3 text-[9.5px] px-2.5 py-1 rounded-full bg-gold/85 text-foreground font-bold tracking-[1.5px] uppercase backdrop-blur-sm lg:text-[9px] lg:py-[4px] lg:rounded-md lg:bg-[rgba(165,135,40,0.88)] lg:text-white lg:shadow-[0_1px_4px_rgba(0,0,0,0.18)]">
            Destacado
          </div>
        )}
      </div>

      {/* Content — fixed structure */}
      <div className="p-4 pb-4 max-lg:p-3 max-lg:pb-3.5 flex flex-col flex-1">
        {/* Unified metadata row */}
        <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-red/80 mb-2 max-lg:mb-1.5 truncate flex items-center gap-[6px]">
          <span>{meta.category}</span>
          {meta.subtype && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="normal-case tracking-normal font-semibold text-muted-foreground/70">{meta.subtype}</span>
            </>
          )}
          {meta.signal && (
            <>
              <span className="text-muted-foreground/40">·</span>
              {meta.signal.pill ? (
                <span className="normal-case tracking-[0.5px] font-bold text-[9px] px-1.5 py-[1px] rounded-full bg-red/10 text-red/90">{meta.signal.text}</span>
              ) : (
                <span className="normal-case tracking-normal font-semibold text-muted-foreground/70">{meta.signal.text}</span>
              )}
            </>
          )}
        </div>

        {/* Title — clamped to 2 lines */}
        <h3 className="font-condensed text-[22px] font-extrabold leading-[1.1] mb-1 line-clamp-2 transition-colors duration-300 lg:group-hover:text-red">
          {listing.name}
        </h3>

        {/* Located in */}
        {parentResort && (
          <div className="text-[11px] text-muted-foreground mb-1">
            Dentro de: <span className="font-semibold text-foreground/70">{parentResort.name}</span>
          </div>
        )}

        {/* Description — clamped */}
        <p className="text-[13px] text-muted-foreground/65 italic leading-[1.5] line-clamp-1 max-lg:line-clamp-2 max-lg:mb-2">
          {listing.tagline || listing.desc}
        </p>

        {/* Desktop meta row: Price | Rating | Zone */}
        <ListingMetaRow
          rating={listing.googleRating != null ? listing.googleRating.toFixed(1) : null}
          price={listing.price ?? null}
          zone={listing.region ?? null}
        />

        {/* Mobile meta row */}
        <div className="flex lg:hidden items-center gap-2 text-[12px] text-muted-foreground mt-auto pt-2">
          {listing.price && (
            <span className="font-bold tracking-[1px] text-foreground/65">{listing.price}</span>
          )}
          {listing.googleRating != null && (
            <>
              {listing.price && <span className="text-muted-foreground/25">·</span>}
              <span className="flex items-center gap-0.5">
                <span className="text-gold">★</span>
                <span className="font-semibold text-foreground/60">{listing.googleRating.toFixed(1)}</span>
              </span>
            </>
          )}
          {listing.region && (
            <>
              <span className="text-muted-foreground/25">·</span>
              <span className="text-foreground/45">{listing.region}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
