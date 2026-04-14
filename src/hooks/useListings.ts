import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_LISTINGS, type Listing } from "@/data/listings";

// Map DB row to frontend Listing type
function mapRow(row: any): Listing {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    cat: row.cat,
    catLabel: row.cat_label,
    region: row.region,
    icon: row.icon,
    stars: row.stars,
    price: row.price,
    badge: row.badge,
    desc: row.description,
    tagline: row.tagline,
    about: row.about,
    image: row.image,
    image2: row.image2,
    image3: row.image3,
    image4: row.image4,
    image5: row.image5,
    image6: row.image6,
    galleryImages: (() => {
      // Prefer gallery_images if available; fall back to legacy image2-6
      const fromGallery = (row.gallery_images ?? []).filter(Boolean) as string[];
      if (fromGallery.length > 0) return fromGallery;
      return [row.image2, row.image3, row.image4, row.image5, row.image6].filter(Boolean) as string[];
    })(),
    address: row.address,
    phone: row.phone,
    hours: row.hours,
    cuisine: row.cuisine ?? [],
    instagram: row.instagram,
    facebook: row.facebook,
    website: row.website,
    tiktok: row.tiktok,
    twitterX: row.twitter_x,
    happyHourDays: row.happy_hour_days,
    happyHourDetails: row.happy_hour_details,
    highlights: row.highlights,
    isFeatured: row.is_featured ?? false,
    isSponsored: row.is_sponsored ?? false,
    googleMapsLink: row.google_maps_link,
    startDatetime: row.start_datetime,
    admissionType: row.admission_type,
    venueType: row.venue_type ?? [],
    musicGenres: row.music_genres,
    locatedInListingId: row.located_in_listing_id,
    logoUrl: row.logo_url,
    googlePlaceId: row.google_place_id,
    googleMapsUrl: row.google_maps_url,
    googleRating: row.google_rating != null ? Number(row.google_rating) : undefined,
    googleUserRatingsTotal: row.google_user_ratings_total,
    googleLastSyncedAt: row.google_last_synced_at,
    orderOnlineUrl: row.order_online_url,
    reservationUrl: row.reservation_url,
    affiliateCtaLabel: row.affiliate_cta_label,
    affiliateCtaUrl: row.affiliate_cta_url,
    affiliateProvider: row.affiliate_provider,
    affiliateLastUpdated: row.affiliate_last_updated,
    highlight: row.highlight,
    propertyType: row.property_type ?? undefined,
    recomendadoBullets: row.recomendado_bullets ?? undefined,
    recomendacionResumen: row.recomendacion_resumen ?? undefined,
    amenities: row.amenities ?? undefined,
    videoUrl: row.video_url ?? undefined,
    dressCode: row.dress_code ?? undefined,
    bestTime: row.best_time ?? undefined,
    popularDishes: row.popular_dishes ?? undefined,
    trendingTag: row.trending_tag ?? undefined,
    createdAt: row.created_at ?? undefined,
    duration: row.duration ?? undefined,
    idealFor: row.ideal_for ?? undefined,
    experienceType: row.experience_type ?? undefined,
    showExperienceType: row.show_experience_type ?? undefined,
    experienceLocation: row.experience_location ?? undefined,
    foodAvailable: row.food_available ?? undefined,
    bestVisitTime: row.best_visit_time ?? undefined,
    priceFrom: row.price_from ?? undefined,
    priceMin: row.price_min != null ? Number(row.price_min) : undefined,
    priceMax: row.price_max != null ? Number(row.price_max) : undefined,
    minimumAge: row.minimum_age ?? undefined,
    showType: row.show_type ?? undefined,
    usefulInfo: row.useful_info ?? undefined,
  };
}

export function useListings() {
  return useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/listings?select=*&order=name`;
        const res = await fetch(url, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch listings: ${res.status}`);
        const data = await res.json();
        const mapped = (data ?? []).map(mapRow);
        return mapped.length ? mapped : DEFAULT_LISTINGS;
      } catch (error) {
        console.warn("Falling back to local listings", error);
        return DEFAULT_LISTINGS;
      }
    },
  });
}

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (listing: Record<string, any>) => {
      const { error } = await supabase.from("listings").insert(listing as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
}

export function useUpdateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Record<string, any>) => {
      const { error } = await supabase.from("listings").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
}

export function useDeleteListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["listings"] }),
  });
}
