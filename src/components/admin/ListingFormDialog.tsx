"use client";
import { useState, useEffect, useCallback } from "react";
import { USEFUL_INFO_ICON_OPTIONS } from "@/lib/usefulInfoIcons";
import { format } from "date-fns";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDown, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useZones, useCuisines, useVenueTypes, useMusicGenres, useAmenities, useAttractionTypes, useShowTypes } from "@/hooks/useTaxonomies";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";
import type { Listing } from "@/data/listings";
import { useListings } from "@/hooks/useListings";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import WeeklyHoursEditor, { type WeeklyHours, emptyWeeklyHours, weeklyHoursToJson, jsonToWeeklyHours } from "./WeeklyHoursEditor";
import ShowTimesEditor, { type ShowSchedule, emptyShowSchedule, showScheduleToHoursJson, hoursJsonToShowSchedule } from "./ShowTimesEditor";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CATEGORIES = [
  { value: "restaurantes", label: "Restaurantes", color: "#B91C1C" },
  { value: "hoteles", label: "Hoteles & Casinos", color: "#1E40AF" },
  { value: "shows", label: "Shows & Eventos", color: "#E6B325" },
  { value: "nocturna", label: "Vida Nocturna", color: "#A855F7" },
  { value: "atracciones", label: "Atracciones", color: "#F97316" },
];

/* Deterministic color map for cuisine chips */
const CUISINE_COLORS: Record<string, string> = {
  mexicana: "#2E7D32",
  italiana: "#1565C0",
  bbq: "#6D4C41",
  steakhouse: "#B71C1C",
  cafe: "#5D4037",
  japonesa: "#E65100",
  china: "#C62828",
  peruana: "#F9A825",
  americana: "#1976D2",
  mariscos: "#00838F",
  francesa: "#6A1B9A",
  thai: "#EF6C00",
  india: "#FF8F00",
  mediterranea: "#2E7D32",
  vegana: "#388E3C",
  fusión: "#7B1FA2",
  coreana: "#D32F2F",
  cubana: "#0277BD",
  colombiana: "#F57F17",
  venezolana: "#BF360C",
  argentina: "#4E342E",
  salvadoreña: "#1B5E20",
  española: "#E53935",
  brunch: "#FF6F00",
  pizza: "#D84315",
  tacos: "#558B2F",
  sushi: "#AD1457",
  buffet: "#4527A0",
  postres: "#EC407A",
  internacional: "#455A64",
};

function getCuisineColor(name: string): string | undefined {
  const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
  return CUISINE_COLORS[slug];
}

export interface HappyHourEntry {
  days: string;
  hours: string;
  details: string;
  image: string;
}

const emptyHappyHour = (): HappyHourEntry => ({ days: "", hours: "", details: "", image: "" });
const MAX_HAPPY_HOURS = 3;

function parseHappyHours(days?: string | null, details?: string | null): HappyHourEntry[] {
  // Try parsing details as JSON array first (new format)
  if (details) {
    try {
      const parsed = JSON.parse(details);
      if (Array.isArray(parsed)) return parsed.map((e: any) => ({
        days: e.days || "", hours: e.hours || "", details: e.details || "", image: e.image || "",
      }));
    } catch { /* not JSON, fall through */ }
  }
  // Legacy single entry
  if (days || details) return [{ days: days || "", hours: "", details: details || "", image: "" }];
  return [];
}

function serializeHappyHours(entries: HappyHourEntry[]): string | null {
  const filtered = entries.filter(e => e.days || e.hours || e.details || e.image);
  if (filtered.length === 0) return null;
  return JSON.stringify(filtered);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function categoryIcon(cat: string): string {
  return CATEGORIES.find(c => c.value === cat)?.label?.[0] || "📍";
}

interface FormData {
  slug: string; name: string; cat: string; cat_label: string;
  region: string; stars: number; price_type: string; price: string; badge: string;
  tagline: string;
  description: string; about: string;
  image: string;
  gallery_images: string[];
  logo_url: string;
  address: string; phone: string;
  weekly_hours: WeeklyHours;
  cuisine: string[];
  instagram: string; facebook: string; website: string; tiktok: string; twitter_x: string; google_maps_link: string;
  happy_hours: HappyHourEntry[]; highlights_text: string;
  is_featured: boolean; is_sponsored: boolean; trending_tag: string;
  venue_type: string[]; music_genres: string[];
  admission_type: string; start_datetime: string;
  show_frequency: "once" | "multiple" | "recurring";
  show_times: ShowSchedule;
  show_dates: { date: string; time: string }[];
  recurring_day_times: Record<string, string[]>;
  recurring_date_from: string;
  recurring_date_to: string;
  recurring_exceptions: { date: string; times: string[] }[];
  located_in_listing_id: string;
  google_place_id: string;
  google_maps_url: string;
  google_rating: string;
  google_user_ratings_total: string;
  order_online_url: string;
  reservation_url: string;
  affiliate_cta_label: string;
  affiliate_cta_url: string;
  affiliate_provider: string;
  highlight: string;
  property_type: string;
  recomendado_bullets_text: string;
  recomendacion_resumen: string;
  amenities: string[];
  video_url: string;
  dress_code: string;
  best_time: string;
  popular_dishes: { emoji: string; name: string; description: string }[];
  duration: string;
  ideal_for: string[];
  experience_type: string[];
  show_experience_type: string[];
  experience_location: string;
  food_available: string;
  best_visit_time: string;
  price_from: string;
  price_min: string;
  price_max: string;
  attraction_type: string;
  minimum_age: string;
  show_type: string;
  useful_info: { icon: string; text: string }[];
}

const emptyForm: FormData = {
  slug: "", name: "", cat: "", cat_label: "", region: "",
  stars: 4, price_type: "De pago", price: "$$", badge: "", tagline: "",
  description: "", about: "",
  image: "",
  gallery_images: [],
  logo_url: "",
  address: "", phone: "",
  weekly_hours: emptyWeeklyHours(),
  cuisine: [],
  instagram: "", facebook: "", website: "", tiktok: "", twitter_x: "", google_maps_link: "",
  happy_hours: [], highlights_text: "",
  is_featured: false, is_sponsored: false, trending_tag: "",
  venue_type: [], music_genres: [],
  admission_type: "", start_datetime: "",
  show_frequency: "once",
  show_times: emptyShowSchedule(),
  show_dates: [],
  recurring_day_times: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] },
  recurring_date_from: "",
  recurring_date_to: "",
  recurring_exceptions: [],
  located_in_listing_id: "",
  google_place_id: "", google_maps_url: "",
  google_rating: "", google_user_ratings_total: "",
  order_online_url: "", reservation_url: "",
  affiliate_cta_label: "", affiliate_cta_url: "", affiliate_provider: "",
  highlight: "",
  property_type: "",
  recomendado_bullets_text: "",
  recomendacion_resumen: "",
  amenities: [],
  video_url: "",
  dress_code: "",
  best_time: "",
  popular_dishes: [],
  duration: "",
  ideal_for: [],
  experience_type: [],
  show_experience_type: [],
  experience_location: "",
  food_available: "",
  best_visit_time: "",
  price_from: "",
  price_min: "",
  price_max: "",
  attraction_type: "",
  minimum_age: "",
  show_type: "",
  useful_info: [],
};

function listingToForm(l: Listing): FormData {
  let weeklyHours = emptyWeeklyHours();
  if (l.hours) {
    try {
      const parsed = JSON.parse(l.hours);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        weeklyHours = jsonToWeeklyHours(parsed);
      }
    } catch {
      // legacy string format — leave default
    }
  }

  return {
    slug: l.slug, name: l.name, cat: l.cat, cat_label: l.catLabel,
    region: l.region || "", stars: l.stars, price_type: (l.price === "Gratis" || l.price === "gratis") ? "Gratis" : "De pago", price: l.price || "$$",
    badge: l.badge || "", tagline: (l as any).tagline || "",
    description: l.desc, about: l.about || "",
    image: l.image || "",
    gallery_images: (l as any).galleryImages || [l.image2, l.image3, l.image4, l.image5, l.image6].filter(Boolean),
    logo_url: (l as any).logoUrl || "",
    address: l.address || "", phone: l.phone || "",
    weekly_hours: weeklyHours,
    cuisine: Array.isArray(l.cuisine) ? l.cuisine : (l.cuisine ? [l.cuisine] : []),
    instagram: l.instagram || "", facebook: l.facebook || "",
    website: l.website || "", tiktok: (l as any).tiktok || "", twitter_x: (l as any).twitterX || "",
    google_maps_link: l.googleMapsLink || "",
    happy_hours: parseHappyHours(l.happyHourDays, l.happyHourDetails),
    highlights_text: l.highlights?.join(", ") || "",
    is_featured: l.isFeatured || false,
    is_sponsored: l.isSponsored || false,
    trending_tag: (l as any).trendingTag || "",
    venue_type: l.venueType || [],
    music_genres: l.musicGenres || [],
    admission_type: (l as any).admissionType || "",
    start_datetime: (l as any).startDatetime || "",
    show_frequency: (() => {
      if (l.cat !== "shows") return "once" as const;
      if (l.hours) {
        try {
          const parsed = JSON.parse(l.hours);
          if (parsed?.type === "recurring") return "recurring" as const;
          if (parsed?.type === "multi_dates") return "multiple" as const;
        } catch {}
      }
      if ((l as any).startDatetime && !l.hours) return "once" as const;
      return "multiple" as const;
    })(),
    show_times: (() => {
      if (l.cat === "shows" && l.hours) {
        try {
          const parsed = JSON.parse(l.hours);
          if (typeof parsed === "object" && parsed !== null && parsed.type !== "multi_dates" && parsed.type !== "recurring") return hoursJsonToShowSchedule(parsed);
        } catch {}
      }
      return emptyShowSchedule();
    })(),
    show_dates: (() => {
      if (l.cat === "shows" && l.hours) {
        try {
          const parsed = JSON.parse(l.hours);
          if (parsed?.type === "multi_dates" && Array.isArray(parsed.dates)) return parsed.dates;
        } catch {}
      }
      return [];
    })(),
    recurring_day_times: (() => {
      const base: Record<string, string[]> = { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
      if (l.cat === "shows" && l.hours) {
        try {
          const parsed = JSON.parse(l.hours);
          if (parsed?.type === "recurring") {
            if (parsed.day_times && typeof parsed.day_times === "object") {
              for (const k of Object.keys(base)) {
                if (Array.isArray(parsed.day_times[k])) base[k] = parsed.day_times[k];
              }
            } else if (Array.isArray(parsed.days) && Array.isArray(parsed.times)) {
              // Legacy: shared times across all selected days
              for (const d of parsed.days) { if (base[d] !== undefined) base[d] = [...parsed.times]; }
            }
          }
        } catch {}
      }
      return base;
    })(),
    recurring_date_from: (() => {
      if (l.cat === "shows" && l.hours) {
        try {
          const parsed = JSON.parse(l.hours);
          if (parsed?.type === "recurring") return parsed.date_from || "";
        } catch {}
      }
      return "";
    })(),
    recurring_date_to: (() => {
      if (l.cat === "shows" && l.hours) {
        try {
          const parsed = JSON.parse(l.hours);
          if (parsed?.type === "recurring") return parsed.date_to || "";
        } catch {}
      }
      return "";
    })(),
    recurring_exceptions: (() => {
      if (l.cat === "shows" && l.hours) {
        try {
          const parsed = JSON.parse(l.hours);
          if (parsed?.type === "recurring" && Array.isArray(parsed.exceptions)) return parsed.exceptions;
        } catch {}
      }
      return [];
    })(),
    located_in_listing_id: l.locatedInListingId || "",
    google_place_id: (l as any).googlePlaceId || "",
    google_maps_url: (l as any).googleMapsUrl || "",
    google_rating: (l as any).googleRating != null ? String((l as any).googleRating) : "",
    google_user_ratings_total: (l as any).googleUserRatingsTotal != null ? String((l as any).googleUserRatingsTotal) : "",
    order_online_url: (l as any).orderOnlineUrl || "",
    reservation_url: (l as any).reservationUrl || "",
    affiliate_cta_label: (l as any).affiliateCtaLabel || "",
    affiliate_cta_url: (l as any).affiliateCtaUrl || "",
    affiliate_provider: (l as any).affiliateProvider || "",
    highlight: (l as any).highlight || "",
    property_type: (l as any).propertyType || "",
    recomendado_bullets_text: (l as any).recomendadoBullets?.join(" | ") || "",
    recomendacion_resumen: (l as any).recomendacionResumen || "",
    amenities: (l as any).amenities || [],
    video_url: (l as any).videoUrl || "",
    dress_code: (l as any).dressCode || "",
    best_time: (l as any).bestTime || "",
    popular_dishes: (l as any).popularDishes || [],
    duration: (l as any).duration || "",
    ideal_for: (l as any).idealFor || [],
    experience_type: (l as any).experienceType || [],
    show_experience_type: (l as any).showExperienceType || [],
    experience_location: (l as any).experienceLocation || "",
    food_available: (l as any).foodAvailable || "",
    best_visit_time: (l as any).bestVisitTime || "",
    price_from: (l as any).priceFrom || "",
    price_min: (l as any).priceMin != null ? String((l as any).priceMin) : "",
    price_max: (l as any).priceMax != null ? String((l as any).priceMax) : "",
    attraction_type: l.cat === "atracciones" ? (l.catLabel || "") : "",
    minimum_age: (l as any).minimumAge || "",
    show_type: (l as any).showType || "",
    useful_info: Array.isArray((l as any).usefulInfo) ? (l as any).usefulInfo.map((i: any) => ({ icon: i.icon || "", text: i.text || "" })) : [],
  };
}

// No image limits — unlimited gallery images for all tiers

export function formToPayload(form: FormData): Record<string, any> {
  const isPremium = form.is_featured || form.is_sponsored;
  return {
    slug: form.slug, name: form.name, cat: form.cat,
    cat_label: form.cat === "atracciones" ? (form.experience_type[0] || form.attraction_type || form.cat_label) : form.cat_label,
    region: form.region || null,
    icon: categoryIcon(form.cat),
    stars: form.cat === "hoteles" ? Number(form.stars) : null,
    price: ["atracciones", "nocturna", "shows"].includes(form.cat) ? (form.price_type === "Gratis" ? "Gratis" : form.price) : form.price,
    badge: isPremium ? (form.badge || null) : null,
    tagline: form.tagline || null,
    description: form.description,
    about: isPremium ? (form.about || null) : null,
    image: form.image || null,
    gallery_images: form.gallery_images,
    image2: form.gallery_images[0] || null,
    image3: form.gallery_images[1] || null,
    image4: form.gallery_images[2] || null,
    image5: form.gallery_images[3] || null,
    image6: form.gallery_images[4] || null,
    address: form.address || null,
    phone: form.phone || null,
    hours: form.cat === "shows" && form.show_frequency === "recurring"
      ? JSON.stringify({
          type: "recurring",
          day_times: Object.fromEntries(
            Object.entries(form.recurring_day_times).filter(([, times]) => times.length > 0).map(([k, times]) => [k, times.filter(Boolean)])
          ),
          date_from: form.recurring_date_from || null,
          date_to: form.recurring_date_to || null,
          exceptions: form.recurring_exceptions.filter(e => e.date && e.times.length > 0),
        })
      : form.cat === "shows" && form.show_frequency === "multiple"
      ? JSON.stringify({ type: "multi_dates", dates: form.show_dates })
      : form.cat === "shows" ? null
      : JSON.stringify(weeklyHoursToJson(form.weekly_hours)),
    cuisine: form.cuisine.length > 0 ? form.cuisine : null,
    venue_type: form.venue_type.length > 0 ? form.venue_type : null,
    music_genres: form.music_genres.length > 0 ? form.music_genres : null,
    google_maps_link: form.google_maps_link || null,
    instagram: isPremium ? (form.instagram || null) : null,
    facebook: isPremium ? (form.facebook || null) : null,
    website: isPremium ? (form.website || null) : null,
    tiktok: isPremium ? (form.tiktok || null) : null,
    twitter_x: isPremium ? (form.twitter_x || null) : null,
    happy_hour_days: null,
    happy_hour_details: (form.cat === "restaurantes" || form.cat === "nocturna") ? serializeHappyHours(form.happy_hours) : null,
    highlights: isPremium && form.highlights_text ? form.highlights_text.split(",").map(s => s.trim()).filter(Boolean) : null,
    is_featured: form.is_featured,
    is_sponsored: form.is_sponsored,
    trending_tag: form.trending_tag || null,
    admission_type: (form.cat === "atracciones" || form.cat === "nocturna") ? (form.admission_type || null) : null,
    start_datetime: form.cat === "shows" && form.show_frequency === "once" ? (form.start_datetime || null) : null,

    located_in_listing_id: form.located_in_listing_id || null,
    logo_url: form.logo_url || null,
    google_place_id: form.google_place_id || null,
    google_maps_url: form.google_maps_url || null,
    order_online_url: isPremium && form.cat === "restaurantes" ? (form.order_online_url || null) : null,
    reservation_url: isPremium && form.cat === "restaurantes" ? (form.reservation_url || null) : null,
    affiliate_cta_label: form.cat !== "restaurantes" ? (form.affiliate_cta_label || null) : null,
    affiliate_cta_url: form.cat !== "restaurantes" ? (form.affiliate_cta_url || null) : null,
    affiliate_provider: form.cat !== "restaurantes" ? (form.affiliate_provider || null) : null,
    affiliate_last_updated: form.cat !== "restaurantes" && form.affiliate_cta_url ? new Date().toISOString() : null,
    highlight: form.is_sponsored ? (form.highlight || null) : null,
    property_type: form.cat === "hoteles" ? (form.property_type || null) : null,
    recomendado_bullets: form.cat === "hoteles" && form.recomendado_bullets_text
      ? form.recomendado_bullets_text.split("|").map(s => s.trim()).filter(Boolean).slice(0, 4)
      : null,
    recomendacion_resumen: form.cat === "hoteles" ? (form.recomendacion_resumen || null) : null,
    amenities: form.cat === "hoteles" && form.amenities.length > 0 ? form.amenities : null,
    video_url: form.video_url || null,
    dress_code: form.cat === "nocturna" ? (form.dress_code || null) : null,
    best_time: form.cat === "nocturna" ? (form.best_time || null) : null,
    popular_dishes: form.cat === "restaurantes" && form.popular_dishes.length > 0
      ? form.popular_dishes.filter(d => d.name.trim())
      : null,
    duration: (form.cat === "atracciones" || form.cat === "shows") ? (form.duration || null) : null,
    ideal_for: form.cat === "atracciones" && form.ideal_for.length > 0 ? form.ideal_for : null,
    experience_type: form.cat === "atracciones" && form.experience_type.length > 0 ? form.experience_type : null,
    show_experience_type: form.cat === "shows" && form.show_experience_type.length > 0 ? form.show_experience_type : null,
    experience_location: form.cat === "atracciones" ? (form.experience_location || null) : null,
    food_available: form.cat === "atracciones" ? (form.food_available || null) : null,
    best_visit_time: form.cat === "atracciones" ? (form.best_visit_time || null) : null,
    price_from: (form.cat === "atracciones" || form.cat === "shows") ? (form.price_from || null) : null,
    price_min: form.cat === "atracciones" && form.admission_type === "De pago" && form.price_min ? Number(form.price_min) : null,
    price_max: form.cat === "atracciones" && form.admission_type === "De pago" && form.price_max ? Number(form.price_max) : null,
    minimum_age: form.cat === "shows" ? (form.minimum_age || null) : null,
    show_type: form.cat === "shows" ? (form.show_type || null) : null,
    useful_info: form.cat === "shows" && form.useful_info.length > 0
      ? form.useful_info.filter(i => i.text.trim())
      : null,
  };
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingListing?: Listing | null;
  onSubmit: (payload: Record<string, any>, editingId: string | null) => Promise<void>;
  isPending: boolean;
}

export default function ListingFormDialog({ open, onOpenChange, editingListing, onSubmit, isPending }: Props) {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [resortSearch, setResortSearch] = useState("");
  const [resortOpen, setResortOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const { data: taxZones = [] } = useZones();
  const { data: taxCuisines = [] } = useCuisines();
  const { data: taxVenueTypes = [] } = useVenueTypes();
  const { data: taxMusicGenres = [] } = useMusicGenres();
  const { data: taxAmenities = [] } = useAmenities();
  const { data: taxAttractionTypes = [] } = useAttractionTypes();
  const { data: taxShowTypes = [] } = useShowTypes();
  const { data: allListings = [] } = useListings();

  const hotelListings = allListings.filter(l => l.cat === "hoteles" && String(l.id) !== (editingListing ? String(editingListing.id) : ""));
  const selectedResort = allListings.find(l => String(l.id) === form.located_in_listing_id);

  useEffect(() => {
    if (open) {
      setForm(editingListing ? listingToForm(editingListing) : emptyForm);
    }
  }, [open, editingListing]);

  const set = (key: keyof FormData, val: any) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.cat || !form.region) {
      toast.error("Nombre, categoría y zona son requeridos");
      return;
    }
    if (!form.slug) {
      toast.error("Slug es requerido");
      return;
    }
    if (!form.tagline) {
      toast.error("Tagline es requerido");
      return;
    }
    if (form.tagline.length > 60) {
      toast.error("Tagline debe tener máximo 60 caracteres");
      return;
    }
    // Affiliate validation: label and url must both be filled or both empty
    if ((form.affiliate_cta_label && !form.affiliate_cta_url) || (!form.affiliate_cta_label && form.affiliate_cta_url)) {
      toast.error("Si agregas un enlace de afiliado, llena tanto el texto como la URL");
      return;
    }
    if (form.cat === "hoteles" && !form.property_type) {
      toast.error("Tipo de Propiedad es requerido para Hoteles & Casinos");
      return;
    }
    if (form.cat === "atracciones" && form.experience_type.length === 0) {
      toast.error("Tipo de atracción es requerido para Atracciones");
      return;
    }
    const payload = formToPayload(form);
    await onSubmit(payload, editingListing ? String(editingListing.id) : null);
  };

  const handleSyncReviews = useCallback(async () => {
    if (!form.google_place_id) {
      toast.error("Ingresa un Google Place ID primero");
      return;
    }
    setSyncing(true);
    try {
      const listingId = editingListing ? String(editingListing.id) : null;
      if (!listingId) {
        toast.error("Guarda el listing primero antes de sincronizar reseñas");
        setSyncing(false);
        return;
      }
      // Save place ID first
      await supabase.from("listings").update({ google_place_id: form.google_place_id }).eq("id", listingId);
      const { data, error } = await supabase.functions.invoke("sync-google-reviews", {
        body: { listing_id: listingId },
      });
      if (error) throw error;
      if (data?.results?.[0]?.error) {
        toast.error(`Error: ${data.results[0].error}`);
      } else {
        const r = data?.results?.[0];
        if (r) {
          set("google_rating", r.rating != null ? String(r.rating) : "");
          set("google_user_ratings_total", r.total != null ? String(r.total) : "");
        }
        toast.success("Reseñas actualizadas");
      }
    } catch (e: any) {
      toast.error(`Error sincronizando: ${e.message || e}`);
    } finally {
      setSyncing(false);
    }
  }, [form.google_place_id, editingListing]);

  const cat = form.cat;
  const hasCat = !!cat;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingListing ? "Editar Listing" : "Nuevo Listing"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ═══════ SECTION: Información básica ═══════ */}
          <FormSection title="Información básica">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Nombre *</Label>
                <Input
                  value={form.name}
                  onChange={e => {
                    set("name", e.target.value);
                    if (!editingListing) set("slug", slugify(e.target.value));
                  }}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={e => set("slug", e.target.value)} required className="font-mono text-sm" />
                <p className="text-[11px] text-muted-foreground">Se genera del nombre</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label>Categoría *</Label>
                <Select value={cat} onValueChange={v => {
                  const c = CATEGORIES.find(c => c.value === v);
                  set("cat", v);
                  if (v === "atracciones") {
                    set("cat_label", "");
                    set("attraction_type", "");
                  } else if (c) {
                    set("cat_label", c.label);
                  }
                  set("cuisine", []);
                  set("venue_type", "");
                  set("music_genres", []);
                  set("admission_type", "");
                  set("start_datetime", "");
                  if (v !== "hoteles") set("property_type", "");
                }}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Zona *</Label>
                <Select value={form.region} onValueChange={v => set("region", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar zona…" /></SelectTrigger>
                  <SelectContent>
                    {taxZones.map(z => <SelectItem key={z.id} value={z.name}>{z.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {["atracciones", "nocturna", "shows"].includes(form.cat) ? (
                <>
                  <div className="space-y-1">
                    <Label>Tipo de precio</Label>
                    <Select value={form.price_type} onValueChange={v => { set("price_type", v); if (v === "Gratis") set("price", "Gratis"); else if (form.price === "Gratis") set("price", "$$"); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gratis">Gratis</SelectItem>
                        <SelectItem value="De pago">De pago</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>{form.price_type === "De pago" ? "Precio *" : "Precio"}</Label>
                    {form.price_type === "De pago" ? (
                      <Select value={form.price} onValueChange={v => set("price", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["$", "$$", "$$$", "$$$$"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input disabled value="Gratis" className="bg-muted" />
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <Label>Precio</Label>
                  <Select value={form.price} onValueChange={v => set("price", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["$", "$$", "$$$", "$$$$"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {cat === "hoteles" && (
                <div className="space-y-1">
                  <Label>Tipo de Propiedad *</Label>
                  <Select value={form.property_type} onValueChange={v => set("property_type", v)}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hotel">Hotel</SelectItem>
                      <SelectItem value="Hotel & Casino">Hotel & Casino</SelectItem>
                      <SelectItem value="Casino">Casino</SelectItem>
                      <SelectItem value="Resort">Resort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Tagline */}
            <div className="space-y-1">
              <Label>Tagline * <span className="text-muted-foreground font-normal">(micro-copy para cards, máx 60 caracteres)</span></Label>
              <div className="relative">
                <Input
                  value={form.tagline}
                  onChange={e => {
                    if (e.target.value.length <= 60) set("tagline", e.target.value);
                  }}
                  required
                  placeholder="Ej: El steakhouse más espectacular fuera del Strip"
                  maxLength={60}
                />
                <span className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 text-[11px] tabular-nums",
                  form.tagline.length >= 55 ? "text-destructive" : "text-muted-foreground"
                )}>
                  {form.tagline.length}/60
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Descripción * <span className="text-muted-foreground font-normal">(~60 palabras)</span></Label>
              <Textarea value={form.description} onChange={e => set("description", e.target.value)} required rows={2} />
            </div>
          </FormSection>

          {/* ═══════ SECTION: Detalles específicos (conditional) ═══════ */}
          {cat && (
            <FormSection title="Detalles específicos" subtitle={CATEGORIES.find(c => c.value === cat)?.label}>
              {cat === "hoteles" && (
                <div className="space-y-1">
                  <Label>Estrellas</Label>
                  <Select value={String(form.stars)} onValueChange={v => set("stars", Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5].map(s => <SelectItem key={s} value={String(s)}>{"★".repeat(s)} ({s})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {cat === "restaurantes" && (
                <div className="space-y-1">
                  <Label>Cocinas <span className="text-muted-foreground font-normal">(multi-select)</span></Label>
                  <ChipSelect
                    options={taxCuisines.map(c => ({ id: c.id, label: c.name, color: getCuisineColor(c.name) }))}
                    selected={form.cuisine}
                    onChange={v => set("cuisine", v)}
                  />
                </div>
              )}

              {cat === "nocturna" && (
                <>
                  <div className="space-y-1">
                    <Label>Tipo de lugar <span className="text-muted-foreground font-normal">(multi-select)</span></Label>
                    <ChipSelect
                      options={taxVenueTypes.map(t => ({ id: t.id, label: t.name }))}
                      selected={form.venue_type}
                      onChange={v => set("venue_type", v)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Géneros de música <span className="text-muted-foreground font-normal">(multi-select)</span></Label>
                    <ChipSelect
                      options={taxMusicGenres.map(g => ({ id: g.id, label: g.name }))}
                      selected={form.music_genres}
                      onChange={v => set("music_genres", v)}
                    />
                  </div>
                </>
              )}

              {cat === "shows" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label>Tipo de evento</Label>
                    <Select value={form.show_frequency} onValueChange={v => set("show_frequency", v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Evento único</SelectItem>
                        <SelectItem value="recurring">Evento recurrente</SelectItem>
                        <SelectItem value="multiple">Fechas múltiples (manual)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {form.show_frequency === "once" && (
                    <div className="space-y-1">
                      <Label>Fecha y hora del evento</Label>
                      <DateTimePicker
                        value={form.start_datetime}
                        onChange={v => set("start_datetime", v)}
                      />
                    </div>
                  )}

                  {form.show_frequency === "recurring" && (
                    <div className="space-y-4">
                      {/* Per-day schedule */}
                      <div className="space-y-2">
                        <Label>Horario por día</Label>
                        <p className="text-[12px] text-muted-foreground">Activa cada día y añade los horarios correspondientes</p>
                        <div className="space-y-2">
                          {([
                            { key: "mon", label: "Lun" },
                            { key: "tue", label: "Mar" },
                            { key: "wed", label: "Mié" },
                            { key: "thu", label: "Jue" },
                            { key: "fri", label: "Vie" },
                            { key: "sat", label: "Sáb" },
                            { key: "sun", label: "Dom" },
                          ] as const).map(day => {
                            const times = form.recurring_day_times[day.key] || [];
                            const isActive = times.length > 0;
                            return (
                              <div key={day.key} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = { ...form.recurring_day_times };
                                    if (isActive) {
                                      updated[day.key] = [];
                                    } else {
                                      updated[day.key] = ["20:00"];
                                    }
                                    set("recurring_day_times", updated);
                                  }}
                                  className={cn(
                                    "w-12 shrink-0 px-2 py-1.5 rounded-md text-xs font-semibold border transition-colors mt-0.5",
                                    isActive
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background text-muted-foreground border-input hover:bg-accent"
                                  )}
                                >
                                  {day.label}
                                </button>
                                {isActive && (
                                  <div className="flex flex-wrap items-center gap-2 flex-1">
                                    {times.map((time, idx) => (
                                      <div key={idx} className="flex items-center gap-1">
                                        <Input
                                          type="time"
                                          value={time}
                                          onChange={e => {
                                            const updated = { ...form.recurring_day_times };
                                            const newTimes = [...times];
                                            newTimes[idx] = e.target.value;
                                            updated[day.key] = newTimes;
                                            set("recurring_day_times", updated);
                                          }}
                                          className="w-[120px] h-8"
                                        />
                                        {times.length > 1 && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                              const updated = { ...form.recurring_day_times };
                                              updated[day.key] = times.filter((_, i) => i !== idx);
                                              set("recurring_day_times", updated);
                                            }}
                                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                          >✕</Button>
                                        )}
                                      </div>
                                    ))}
                                    {times.length < 4 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const updated = { ...form.recurring_day_times };
                                          updated[day.key] = [...times, ""];
                                          set("recurring_day_times", updated);
                                        }}
                                        className="h-7 text-xs text-muted-foreground"
                                      >+ Hora</Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Date range */}
                      <div className="space-y-2">
                        <Label>Rango de fechas <span className="text-muted-foreground font-normal">(opcional)</span></Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Desde</Label>
                            <Input
                              type="date"
                              value={form.recurring_date_from}
                              onChange={e => set("recurring_date_from", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Hasta</Label>
                            <Input
                              type="date"
                              value={form.recurring_date_to}
                              onChange={e => set("recurring_date_to", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Exceptions */}
                      <div className="space-y-2">
                        <Label>Fechas especiales / excepciones</Label>
                        {form.recurring_exceptions.length > 0 && (
                          <div className="space-y-2">
                            {form.recurring_exceptions.map((exc, idx) => (
                              <div key={idx} className="flex items-start gap-2 p-2 rounded-md border border-input bg-muted/30">
                                <div className="flex-1 space-y-2">
                                  <Input
                                    type="date"
                                    value={exc.date}
                                    onChange={e => {
                                      const updated = [...form.recurring_exceptions];
                                      updated[idx] = { ...updated[idx], date: e.target.value };
                                      set("recurring_exceptions", updated);
                                    }}
                                  />
                                  <div className="flex flex-wrap gap-2">
                                    {exc.times.map((t, ti) => (
                                      <div key={ti} className="flex items-center gap-1">
                                        <Input
                                          type="time"
                                          value={t}
                                          onChange={e => {
                                            const updated = [...form.recurring_exceptions];
                                            const times = [...updated[idx].times];
                                            times[ti] = e.target.value;
                                            updated[idx] = { ...updated[idx], times };
                                            set("recurring_exceptions", updated);
                                          }}
                                          className="w-[120px]"
                                        />
                                        {exc.times.length > 1 && (
                                          <Button
                                            type="button" variant="ghost" size="sm"
                                            onClick={() => {
                                              const updated = [...form.recurring_exceptions];
                                              updated[idx] = { ...updated[idx], times: exc.times.filter((_, i) => i !== ti) };
                                              set("recurring_exceptions", updated);
                                            }}
                                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                          >✕</Button>
                                        )}
                                      </div>
                                    ))}
                                    <Button
                                      type="button" variant="ghost" size="sm"
                                      onClick={() => {
                                        const updated = [...form.recurring_exceptions];
                                        updated[idx] = { ...updated[idx], times: [...exc.times, ""] };
                                        set("recurring_exceptions", updated);
                                      }}
                                      className="h-8 text-xs"
                                    >+ Hora</Button>
                                  </div>
                                </div>
                                <Button
                                  type="button" variant="ghost" size="sm"
                                  onClick={() => set("recurring_exceptions", form.recurring_exceptions.filter((_, i) => i !== idx))}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
                                >✕</Button>
                              </div>
                            ))}
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => set("recurring_exceptions", [...form.recurring_exceptions, { date: "", times: [""] }])}
                        >
                          + Añadir fecha especial
                        </Button>
                      </div>
                    </div>
                  )}

                  {form.show_frequency === "multiple" && (
                    <div className="space-y-3">
                      <Label>Fechas del show</Label>
                      <p className="text-[12px] text-muted-foreground">
                        Añade cada fecha y hora del evento
                      </p>
                      <div className="space-y-2">
                        {form.show_dates.map((entry, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input
                              type="date"
                              value={entry.date}
                              onChange={e => {
                                const updated = [...form.show_dates];
                                updated[idx] = { ...updated[idx], date: e.target.value };
                                set("show_dates", updated);
                              }}
                              className="flex-1"
                            />
                            <Input
                              type="time"
                              value={entry.time}
                              onChange={e => {
                                const updated = [...form.show_dates];
                                updated[idx] = { ...updated[idx], time: e.target.value };
                                set("show_dates", updated);
                              }}
                              className="w-[120px]"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updated = form.show_dates.filter((_, i) => i !== idx);
                                set("show_dates", updated);
                              }}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => set("show_dates", [...form.show_dates, { date: "", time: "20:00" }])}
                      >
                        + Añadir fecha
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {cat === "shows" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label>Tipo de experiencia</Label>
                    <MultiSelect
                      options={taxShowTypes.map(t => ({ label: t.name, value: t.name }))}
                      selected={form.show_experience_type}
                      onChange={(vals) => set("show_experience_type", vals)}
                      placeholder="Seleccionar tipos…"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Duración</Label>
                      <Input value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="Ej: 90 min" />
                    </div>
                    <div className="space-y-1">
                      <Label>Precio desde</Label>
                      <Input value={form.price_from} onChange={e => set("price_from", e.target.value)} placeholder="Ej: $69" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Edad mínima</Label>
                    <Input value={form.minimum_age} onChange={e => set("minimum_age", e.target.value)} placeholder="Ej: 5+" />
                  </div>
                </div>
              )}

              {cat === "shows" && (
                <FormSection title="Información útil" subtitle="Puntos prácticos que se muestran al visitante">
                  {form.useful_info.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No hay puntos configurados.</p>
                  )}
                  {form.useful_info.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        className="w-32 shrink-0 h-9 rounded-md border border-input bg-background px-2 text-sm"
                        value={item.icon}
                        onChange={e => {
                          setForm(f => {
                            const arr = [...f.useful_info];
                            arr[idx] = { ...arr[idx], icon: e.target.value };
                            return { ...f, useful_info: arr };
                          });
                        }}
                      >
                        <option value="">Auto</option>
                        {USEFUL_INFO_ICON_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <Input
                        className="flex-1"
                        value={item.text}
                        onChange={e => {
                          setForm(f => {
                            const arr = [...f.useful_info];
                            arr[idx] = { ...arr[idx], text: e.target.value };
                            return { ...f, useful_info: arr };
                          });
                        }}
                        placeholder="Ej: Llegar 20–30 min antes"
                      />
                      <div className="flex gap-1 shrink-0">
                        {idx > 0 && (
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                            setForm(f => {
                              const arr = [...f.useful_info];
                              [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                              return { ...f, useful_info: arr };
                            });
                          }}>↑</Button>
                        )}
                        {idx < form.useful_info.length - 1 && (
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                            setForm(f => {
                              const arr = [...f.useful_info];
                              [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
                              return { ...f, useful_info: arr };
                            });
                          }}>↓</Button>
                        )}
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => {
                          setForm(f => ({ ...f, useful_info: f.useful_info.filter((_, i) => i !== idx) }));
                        }}>✕</Button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                    setForm(f => ({ ...f, useful_info: [...f.useful_info, { icon: "", text: "" }] }));
                  }}>
                    + Agregar punto
                  </Button>
                </FormSection>
              )}

              {cat === "nocturna" && (
                <div className="space-y-1">
                  <Label>Código de vestimenta</Label>
                  <Input value={form.dress_code} onChange={e => set("dress_code", e.target.value)} />
                </div>
              )}

              {cat === "nocturna" && (
                <div className="space-y-1">
                  <Label>Tipo de entrada</Label>
                  <Input value={form.admission_type} onChange={e => set("admission_type", e.target.value)} />
                </div>
              )}

              {cat === "nocturna" && (
                <div className="space-y-1">
                  <Label>Mejor momento</Label>
                  <Input value={form.best_time} onChange={e => set("best_time", e.target.value)} />
                </div>
              )}

              {cat === "atracciones" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Tipo de atracción *</Label>
                      <MultiSelect
                        options={taxAttractionTypes.map(t => ({ label: t.name, value: t.name }))}
                        selected={form.experience_type}
                        onChange={(vals) => set("experience_type", vals)}
                        placeholder="Seleccionar tipos…"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Tipo de entrada</Label>
                      <Select value={form.admission_type} onValueChange={v => set("admission_type", v)}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gratis">Gratis</SelectItem>
                          <SelectItem value="De pago">De pago</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {form.admission_type === "De pago" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Precio mínimo ($)</Label>
                        <Input type="number" min="0" value={form.price_min} onChange={e => set("price_min", e.target.value)} placeholder="Ej: 25" />
                      </div>
                      <div className="space-y-1">
                        <Label>Precio máximo ($)</Label>
                        <Input type="number" min="0" value={form.price_max} onChange={e => set("price_max", e.target.value)} placeholder="Ej: 35" />
                      </div>
                    </div>
                  )}


                  {/* ── Detalles de la experiencia ── */}
                  <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-4 mt-2">
                    <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Detalles de la experiencia</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Duración estimada</Label>
                        <Select value={form.duration} onValueChange={v => set("duration", v)}>
                          <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="< 1 hora">&lt; 1 hora</SelectItem>
                            <SelectItem value="1–2 horas">1–2 horas</SelectItem>
                            <SelectItem value="2–3 horas">2–3 horas</SelectItem>
                            <SelectItem value="3–4 horas">3–4 horas</SelectItem>
                            <SelectItem value="4+ horas">4+ horas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label>Ubicación de la experiencia</Label>
                        <Select value={form.experience_location} onValueChange={v => set("experience_location", v)}>
                          <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Interior">Interior</SelectItem>
                            <SelectItem value="Exterior">Exterior</SelectItem>
                            <SelectItem value="Ambos">Ambos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Ideal para</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Parejas", "Familias", "Solo", "Grupos", "Turistas"].map(opt => (
                          <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                            <Checkbox
                              checked={form.ideal_for.includes(opt)}
                              onCheckedChange={(checked) => {
                                set("ideal_for", checked
                                  ? [...form.ideal_for, opt]
                                  : form.ideal_for.filter((v: string) => v !== opt)
                                );
                              }}
                            />
                            <span className="text-sm">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Comida o bebida disponible</Label>
                        <Select value={form.food_available} onValueChange={v => set("food_available", v)}>
                          <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sí">Sí</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label>Mejor horario para visitar <span className="text-muted-foreground font-normal">(opcional)</span></Label>
                        <Input value={form.best_visit_time} onChange={e => set("best_visit_time", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!["hoteles", "restaurantes", "nocturna", "shows", "atracciones"].includes(cat) && (
                <p className="text-sm text-muted-foreground">No hay campos específicos para esta categoría.</p>
              )}
            </FormSection>
          )}

          {/* ═══════ SECTION: Ubicación y contacto ═══════ */}
          <FormSection title="Ubicación y contacto">
            {/* Resort combobox — hide for hotels (they ARE the resort) */}
            {form.cat !== "hoteles" && (
              <div className="space-y-1">
                <Label>Ubicado en (Resort) <span className="text-muted-foreground font-normal">— opcional</span></Label>
                <Popover open={resortOpen} onOpenChange={setResortOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                      {selectedResort ? selectedResort.name : "Seleccionar resort…"}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput placeholder="Buscar hotel/casino…" value={resortSearch} onValueChange={setResortSearch} />
                      <div className="max-h-[260px] overflow-y-auto overscroll-contain" onWheel={e => e.stopPropagation()}>
                        {(() => {
                          const filtered = hotelListings.filter(h =>
                            h.name.toLowerCase().includes(resortSearch.toLowerCase())
                          );
                          if (filtered.length === 0 && !form.located_in_listing_id) {
                            return <p className="py-6 text-center text-sm text-muted-foreground">No se encontraron resorts.</p>;
                          }
                          return (
                            <CommandGroup>
                              {form.located_in_listing_id && (
                                <CommandItem value="__clear__" onSelect={() => { set("located_in_listing_id", ""); setResortOpen(false); }}>
                                  Quitar selección
                                </CommandItem>
                              )}
                              {filtered.map(h => (
                                <CommandItem
                                  key={String(h.id)}
                                  value={h.name}
                                  onSelect={() => { set("located_in_listing_id", String(h.id)); setResortOpen(false); }}
                                >
                                  {h.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          );
                        })()}
                      </div>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Dirección</Label>
                <Input value={form.address} onChange={e => set("address", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Teléfono</Label>
                <Input value={form.phone} onChange={e => set("phone", e.target.value)} />
              </div>
            </div>
            {form.cat === "hoteles" ? (
              <p className="text-xs text-muted-foreground italic py-2">Los hoteles operan 24/7 por defecto.</p>
            ) : form.cat === "shows" ? null : (
              <div className="space-y-1">
                <Label>Horario semanal</Label>
                <WeeklyHoursEditor value={form.weekly_hours} onChange={v => set("weekly_hours", v)} />
              </div>
            )}
          </FormSection>

          {/* ═══════ SECTION: Hotel extras ═══════ */}
          {cat === "hoteles" && (
            <FormSection title="Detalles del hotel" subtitle="Por qué lo recomendamos + comodidades">
              <div className="space-y-1">
                <Label>Resumen editorial <span className="text-muted-foreground font-normal">(1–2 frases antes de los bullets)</span></Label>
                <Input
                  value={form.recomendacion_resumen}
                  onChange={e => set("recomendacion_resumen", e.target.value)}
                  placeholder="Un resort que combina lujo accesible con una experiencia completa."
                />
              </div>
              <div className="space-y-1">
                <Label>Bullets de recomendación <span className="text-muted-foreground font-normal">(separados por | , máximo 4)</span></Label>
                <Input
                  value={form.recomendado_bullets_text}
                  onChange={e => set("recomendado_bullets_text", e.target.value)}
                  placeholder="Gran casino con mesas, slots y sportsbook | Restaurantes populares y bares elegantes"
                />
              </div>
              <div className="space-y-3">
                <Label>Comodidades</Label>
                {(() => {
                  const groups = new Map<string, typeof taxAmenities>();
                  for (const a of taxAmenities) {
                    if (!groups.has(a.parent_group)) groups.set(a.parent_group, []);
                    groups.get(a.parent_group)!.push(a);
                  }
                  return Array.from(groups.entries()).map(([group, items]) => (
                    <div key={group} className="space-y-1.5">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{group}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {items.map(item => (
                          <label key={item.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                            <Checkbox
                              checked={form.amenities.includes(item.name)}
                              onCheckedChange={(checked) => {
                                set("amenities", checked
                                  ? [...form.amenities, item.name]
                                  : form.amenities.filter(a => a !== item.name)
                                );
                              }}
                            />
                            <span className="text-sm">{item.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </FormSection>
          )}

          {(cat === "restaurantes" || cat === "nocturna") && (
            <FormSection title="Happy Hour">
              {form.happy_hours.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No hay happy hours configurados.</p>
              )}
              {form.happy_hours.map((hh, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wide uppercase text-muted-foreground">Happy Hour {idx + 1}</span>
                    <Button type="button" variant="ghost" size="sm" className="h-7 text-destructive hover:text-destructive" onClick={() => {
                      setForm(f => ({ ...f, happy_hours: f.happy_hours.filter((_, i) => i !== idx) }));
                    }}>Eliminar</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Días</Label>
                      <Input value={hh.days} onChange={e => {
                        setForm(f => {
                          const arr = [...f.happy_hours];
                          arr[idx] = { ...arr[idx], days: e.target.value };
                          return { ...f, happy_hours: arr };
                        });
                      }} placeholder="Lun–Vie" />
                    </div>
                    <div className="space-y-1">
                      <Label>Horario</Label>
                      <Input value={hh.hours} onChange={e => {
                        setForm(f => {
                          const arr = [...f.happy_hours];
                          arr[idx] = { ...arr[idx], hours: e.target.value };
                          return { ...f, happy_hours: arr };
                        });
                      }} placeholder="3pm – 6pm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Detalles</Label>
                    <Textarea value={hh.details} onChange={e => {
                      setForm(f => {
                        const arr = [...f.happy_hours];
                        arr[idx] = { ...arr[idx], details: e.target.value };
                        return { ...f, happy_hours: arr };
                      });
                    }} rows={2} placeholder="Descripción de ofertas..." />
                  </div>
                  <div className="space-y-1">
                    <Label>Imagen <span className="text-muted-foreground font-normal">(opcional)</span></Label>
                    <ImageUpload value={hh.image} onChange={url => {
                      setForm(f => {
                        const arr = [...f.happy_hours];
                        arr[idx] = { ...arr[idx], image: url };
                        return { ...f, happy_hours: arr };
                      });
                    }} folder="listings" previewSize="gallery" />
                  </div>
                </div>
              ))}
              {form.happy_hours.length < MAX_HAPPY_HOURS && (
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  setForm(f => ({ ...f, happy_hours: [...f.happy_hours, emptyHappyHour()] }));
                }}>
                  + Agregar Happy Hour
                </Button>
              )}
            </FormSection>
          )}

          {/* ═══════ SECTION: Nivel de visibilidad ═══════ */}
          <FormSection title="Nivel de visibilidad">
            {!hasCat && (
              <p className="text-xs text-muted-foreground italic">Selecciona una categoría para habilitar estos controles.</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                disabled={!hasCat}
                onClick={() => {
                  setForm(f => ({
                    ...f,
                    is_featured: !f.is_featured,
                    is_sponsored: !f.is_featured ? false : f.is_sponsored,
                  }));
                }}
                className={cn(
                  "flex-1 h-12 rounded-full border-2 font-semibold text-sm transition-all duration-150 cursor-pointer",
                  !hasCat && "opacity-40 cursor-not-allowed",
                  form.is_featured
                    ? "border-[#D9A441] bg-[#D9A441]/10 text-[#D9A441] shadow-sm"
                    : "border-[#D9A441]/40 text-[#D9A441]/70 bg-transparent hover:bg-[#D9A441]/5 hover:shadow-sm"
                )}
              >
                Destacado
              </button>
              <button
                type="button"
                disabled={!hasCat}
                onClick={() => {
                  setForm(f => ({
                    ...f,
                    is_sponsored: !f.is_sponsored,
                    is_featured: !f.is_sponsored ? false : f.is_featured,
                  }));
                }}
                className={cn(
                  "flex-1 h-12 rounded-full border-2 font-semibold text-sm transition-all duration-150 cursor-pointer",
                  !hasCat && "opacity-40 cursor-not-allowed",
                  form.is_sponsored
                    ? "border-[#111111] bg-[#111111]/10 text-[#111111] shadow-sm"
                    : "border-[#111111]/30 text-[#111111]/50 bg-transparent hover:bg-[#111111]/5 hover:shadow-sm"
                )}
              >
                Seleccionado
              </button>
            </div>
            {hasCat && (
              <div className="flex gap-3 -mt-1">
                <p className="flex-1 text-center text-[11px] text-muted-foreground">Mayor visibilidad y prioridad</p>
                <p className="flex-1 text-center text-[11px] text-muted-foreground">Curado y recomendado por LatinoLV</p>
              </div>
            )}

            {/* Trending Tag */}
            <div className="space-y-1 mt-3">
              <Label>Etiqueta Tendencia</Label>
              <Select value={form.trending_tag} onValueChange={v => set("trending_tag", v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Sin etiqueta" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin etiqueta</SelectItem>
                  <SelectItem value="trending">🔥 Trending</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">Aparecerá en la sección "Tendencias" del homepage. "Nuevo", "Oferta" y "Evento" se asignan automáticamente.</p>
            </div>

            {(form.is_featured || form.is_sponsored) && (
              <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4 mt-3">
                <p className="text-xs font-bold tracking-widest uppercase text-primary">
                  {form.is_sponsored ? "Seleccionado" : "Destacado"} — Campos premium
                </p>

                <div className="space-y-1">
                  <Label>Badge</Label>
                  <Input value={form.badge} onChange={e => set("badge", e.target.value)} placeholder="Top Rated, Destacado..." />
                </div>

                {/* Highlights — Seleccionado only */}
                {form.is_sponsored && (
                  <div className="space-y-1">
                    <Label>Highlights (separados por coma)</Label>
                    <Input value={form.highlights_text} onChange={e => set("highlights_text", e.target.value)} placeholder="Feature 1, Feature 2, Feature 3" />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1"><Label>Instagram</Label><Input value={form.instagram} onChange={e => set("instagram", e.target.value)} /></div>
                  <div className="space-y-1"><Label>Facebook</Label><Input value={form.facebook} onChange={e => set("facebook", e.target.value)} /></div>
                  <div className="space-y-1"><Label>Website</Label><Input value={form.website} onChange={e => set("website", e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label>TikTok</Label><Input value={form.tiktok} onChange={e => set("tiktok", e.target.value)} placeholder="https://tiktok.com/@..." /></div>
                  <div className="space-y-1"><Label>X (Twitter)</Label><Input value={form.twitter_x} onChange={e => set("twitter_x", e.target.value)} placeholder="https://x.com/..." /></div>
                </div>


                {/* Restaurant CTAs inside premium panel */}
                {cat === "restaurantes" && (
                  <div className="space-y-3 border-t border-primary/10 pt-3 mt-1">
                    <p className="text-[11px] font-semibold tracking-wide uppercase text-primary/70">Acciones del restaurante</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>URL para ordenar en línea</Label>
                        <Input
                          value={form.order_online_url}
                          onChange={e => set("order_online_url", e.target.value)}
                          placeholder="https://..."
                          type="url"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>URL para reservar mesa</Label>
                        <Input
                          value={form.reservation_url}
                          onChange={e => set("reservation_url", e.target.value)}
                          placeholder="https://..."
                          type="url"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </FormSection>

          {/* ═══════ SECTION: Platos populares (Restaurants) ═══════ */}
          {cat === "restaurantes" && (
            <FormSection title="Platos populares" subtitle="Lo más pedido y recomendado del lugar (máx. 5)">
              <div className="space-y-3">
                {form.popular_dishes.map((dish, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Input
                      className="w-16 text-center"
                      value={dish.emoji}
                      onChange={e => {
                        const updated = [...form.popular_dishes];
                        updated[i] = { ...updated[i], emoji: e.target.value };
                        set("popular_dishes", updated);
                      }}
                      placeholder="🍽️"
                      maxLength={4}
                    />
                    <Input
                      className="flex-1"
                      value={dish.name}
                      onChange={e => {
                        const updated = [...form.popular_dishes];
                        updated[i] = { ...updated[i], name: e.target.value };
                        set("popular_dishes", updated);
                      }}
                      placeholder="Nombre del plato"
                    />
                    <Input
                      className="flex-1"
                      value={dish.description}
                      onChange={e => {
                        const updated = [...form.popular_dishes];
                        updated[i] = { ...updated[i], description: e.target.value };
                        set("popular_dishes", updated);
                      }}
                      placeholder="Descripción corta (opcional)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = form.popular_dishes.filter((_, j) => j !== i);
                        set("popular_dishes", updated);
                      }}
                      className="text-destructive/60 hover:text-destructive text-sm mt-2"
                    >✕</button>
                  </div>
                ))}
                {form.popular_dishes.length < 5 && (
                  <button
                    type="button"
                    onClick={() => set("popular_dishes", [...form.popular_dishes, { emoji: "🍽️", name: "", description: "" }])}
                    className="text-sm text-primary/70 hover:text-primary font-medium"
                  >+ Agregar plato</button>
                )}
              </div>
            </FormSection>
          )}

          {/* ═══════ SECTION: Multimedia ═══════ */}
          <FormSection title="Multimedia">
            {/* Logo */}
            <div className="space-y-1">
              <Label>Logo <span className="text-muted-foreground font-normal">(opcional, 1:1 recomendado)</span></Label>
              <ImageUpload value={form.logo_url} onChange={url => set("logo_url", url)} folder="listings" previewSize="logo" />
            </div>

            {/* Main image */}
            <div className="space-y-1">
              <Label>Imagen principal *</Label>
              <ImageUpload value={form.image} onChange={url => set("image", url)} folder="listings" />
            </div>

            {/* Gallery images */}
            <div className="space-y-2">
              <Label>Galería</Label>
              <p className="text-[11px] text-muted-foreground">Puedes subir múltiples imágenes y arrastrar para reordenar.</p>
              <div className="max-h-[300px] overflow-y-auto">
                <SortableGallery
                  images={form.gallery_images}
                  onReorder={(newImages) => setForm(f => ({ ...f, gallery_images: newImages }))}
                  onRemove={(i) => setForm(f => {
                    const newGallery = [...f.gallery_images];
                    newGallery.splice(i, 1);
                    return { ...f, gallery_images: newGallery };
                  })}
                  onAdd={(url) => setForm(f => ({ ...f, gallery_images: [...f.gallery_images, url] }))}
                  canAddMore={true}
                />
              </div>
            </div>

            {/* Video URL */}
            <div className="space-y-1">
              <Label>Video de YouTube <span className="text-muted-foreground font-normal">(opcional)</span></Label>
              <Input
                value={form.video_url}
                onChange={e => set("video_url", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                type="url"
              />
              <p className="text-[11px] text-muted-foreground">Pega un enlace de YouTube. Se mostrará en la galería del listing.</p>
            </div>
          </FormSection>


          {/* ═══════ SECTION: Enlace de afiliado (non-restaurant) ═══════ */}
          {cat && cat !== "restaurantes" && (
            <FormSection title="Enlace de afiliado" subtitle="hoteles, shows, atracciones, nocturna">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Texto del botón</Label>
                  {cat === "atracciones" ? (
                    <Select value={form.affiliate_cta_label} onValueChange={v => set("affiliate_cta_label", v)}>
                      <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Comprar entradas">Comprar entradas</SelectItem>
                        <SelectItem value="Reservar ahora">Reservar ahora</SelectItem>
                        <SelectItem value="Ver disponibilidad">Ver disponibilidad</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={form.affiliate_cta_label}
                      onChange={e => set("affiliate_cta_label", e.target.value)}
                      placeholder={
                        cat === "hoteles" ? "Ver precios y disponibilidad" :
                        "Comprar boletos"
                      }
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <Label>URL del afiliado</Label>
                  <Input
                    value={form.affiliate_cta_url}
                    onChange={e => set("affiliate_cta_url", e.target.value)}
                    placeholder="https://..."
                    type="url"
                  />
                </div>
              </div>
            </FormSection>
          )}

          {/* ═══════ SECTION: Reseñas (Google) ═══════ */}
          <FormSection title="Reseñas (Google)">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Google Place ID</Label>
                <Input
                  value={form.google_place_id}
                  onChange={e => set("google_place_id", e.target.value)}
                  placeholder="ChIJ..."
                />
                <p className="text-[11px] text-muted-foreground">Encuéntralo en Google Maps → Compartir → Place ID</p>
              </div>
              <div className="space-y-1">
                <Label>Google Maps URL</Label>
                <Input
                  value={form.google_maps_url}
                  onChange={e => set("google_maps_url", e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
            {form.google_rating && (
              <div className="flex items-center gap-4 text-sm bg-card border border-border rounded-lg p-3">
                <span className="text-gold text-lg">★</span>
                <span className="font-bold">{form.google_rating}</span>
                {form.google_user_ratings_total && (
                  <span className="text-muted-foreground">({Number(form.google_user_ratings_total).toLocaleString()} reseñas)</span>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!form.google_place_id || syncing || !editingListing}
                onClick={handleSyncReviews}
              >
                {syncing ? "Sincronizando…" : "🔄 Actualizar reseñas"}
              </Button>
              {!editingListing && form.google_place_id && (
                <p className="text-[11px] text-muted-foreground self-center">Guarda primero para sincronizar</p>
              )}
            </div>
          </FormSection>




          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {editingListing ? "Guardar Cambios" : "Crear Listing"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Reusable sub-components ─── */

function FormSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-[11px] font-bold tracking-[1.5px] uppercase text-muted-foreground border-b border-border pb-1.5 w-full flex items-center gap-2">
        {title}
        {subtitle && <span className="text-[10px] font-normal normal-case tracking-normal text-muted-foreground/60">— {subtitle}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

function ChipSelect({ options, selected, onChange }: {
  options: { id: string; label: string; color?: string }[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap p-2 border border-border rounded-md bg-card min-h-[38px]">
      {options.length === 0 && <span className="text-xs text-muted-foreground">No hay opciones — agregar en Taxonomías</span>}
      {options.map(o => {
        const isSelected = selected.includes(o.label);
        const color = o.color;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              const next = isSelected ? selected.filter(v => v !== o.label) : [...selected, o.label];
              onChange(next);
            }}
            className={cn(
              "px-2.5 py-1 rounded-md text-[12px] font-semibold transition-all border",
              !isSelected && "bg-background border-[#E5E7EB] text-[#6B7280] hover:border-foreground/20"
            )}
            style={isSelected && color ? {
              borderColor: color,
              color: color,
              backgroundColor: `${color}1A`,
            } : isSelected ? {
              borderColor: 'hsl(var(--primary) / 0.4)',
              color: 'hsl(var(--primary))',
              backgroundColor: 'hsl(var(--primary) / 0.1)',
            } : undefined}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function DateTimePicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const dateObj = value ? new Date(value) : undefined;
  const timeStr = dateObj ? format(dateObj, "HH:mm") : "";

  const handleDateSelect = (d: Date | undefined) => {
    if (!d) return;
    const existing = dateObj || new Date();
    d.setHours(existing.getHours(), existing.getMinutes());
    onChange(d.toISOString());
  };

  const handleTimeChange = (t: string) => {
    const d = dateObj ? new Date(dateObj) : new Date();
    const [h, m] = t.split(":").map(Number);
    d.setHours(h, m);
    onChange(d.toISOString());
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal", !dateObj && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateObj ? format(dateObj, "PPP") : "Seleccionar fecha"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={dateObj} onSelect={handleDateSelect} initialFocus className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
      <Input type="time" value={timeStr} onChange={e => handleTimeChange(e.target.value)} className="w-[120px]" />
    </div>
  );
}

/* ─── Sortable Gallery ─── */

function SortableGalleryItem({ id, url, index, onRemove }: { id: string; url: string; index: number; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className={cn(
        "w-[100px] h-[100px] rounded-lg overflow-hidden border border-border bg-muted",
        isDragging && "shadow-lg ring-2 ring-primary/30"
      )}>
        <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center hover:opacity-80 z-10"
      >
        ✕
      </button>
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 w-5 h-5 bg-background/80 backdrop-blur-sm rounded flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </div>
    </div>
  );
}

function SortableGallery({ images, onReorder, onRemove, onAdd, canAddMore }: {
  images: string[];
  onReorder: (images: string[]) => void;
  onRemove: (index: number) => void;
  onAdd: (url: string) => void;
  canAddMore: boolean;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const ids = images.map((_, i) => `gallery-${i}`);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = ids.indexOf(String(active.id));
      const newIndex = ids.indexOf(String(over.id));
      onReorder(arrayMove(images, oldIndex, newIndex));
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={rectSortingStrategy}>
          {images.map((img, i) => (
            <SortableGalleryItem
              key={ids[i]}
              id={ids[i]}
              url={img}
              index={i}
              onRemove={() => onRemove(i)}
            />
          ))}
        </SortableContext>
      </DndContext>
      {canAddMore && (
        <MultiImageUpload
          onUploaded={urls => urls.forEach(url => onAdd(url))}
          folder="listings"
        />
      )}
    </div>
  );
}
