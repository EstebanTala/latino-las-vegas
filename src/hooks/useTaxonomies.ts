import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TaxonomyItem {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  sort_order: number;
  created_at: string;
}

type TaxonomyTable = "taxonomy_zones" | "taxonomy_cuisines" | "taxonomy_venue_types" | "taxonomy_music_genres" | "taxonomy_amenities" | "taxonomy_attraction_types" | "taxonomy_show_types";

function fetchTaxonomy(table: TaxonomyTable, activeOnly: boolean) {
  return async (): Promise<TaxonomyItem[]> => {
    let query = supabase.from(table).select("*").order("sort_order", { ascending: true });
    if (activeOnly) query = query.eq("active", true);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as TaxonomyItem[];
  };
}

// Public hooks — active items only, ordered
export function useZones() {
  return useQuery({ queryKey: ["taxonomy", "zones"], queryFn: fetchTaxonomy("taxonomy_zones", true) });
}
export function useCuisines() {
  return useQuery({ queryKey: ["taxonomy", "cuisines"], queryFn: fetchTaxonomy("taxonomy_cuisines", true) });
}
export function useVenueTypes() {
  return useQuery({ queryKey: ["taxonomy", "venue_types"], queryFn: fetchTaxonomy("taxonomy_venue_types", true) });
}
export function useMusicGenres() {
  return useQuery({ queryKey: ["taxonomy", "music_genres"], queryFn: fetchTaxonomy("taxonomy_music_genres", true) });
}
export function useAttractionTypes() {
  return useQuery({ queryKey: ["taxonomy", "attraction_types"], queryFn: fetchTaxonomy("taxonomy_attraction_types", true) });
}
export function useShowTypes() {
  return useQuery({ queryKey: ["taxonomy", "show_types"], queryFn: fetchTaxonomy("taxonomy_show_types", true) });
}
/** @deprecated Use useAttractionTypes or useShowTypes instead */
export const useExperienceTypes = useAttractionTypes;

export interface AmenityItem extends TaxonomyItem {
  parent_group: string;
  icon: string | null;
}

export function useAmenities() {
  return useQuery({
    queryKey: ["taxonomy", "amenities"],
    queryFn: async (): Promise<AmenityItem[]> => {
      const { data, error } = await supabase
        .from("taxonomy_amenities")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as AmenityItem[];
    },
  });
}

// Admin hooks — all items
export function useAllTaxonomy(table: TaxonomyTable) {
  return useQuery({ queryKey: ["taxonomy_admin", table], queryFn: fetchTaxonomy(table, false) });
}

// Count listings per taxonomy value for a given field
export function useTaxonomyUsageCounts(listingField: string) {
  return useQuery({
    queryKey: ["taxonomy_usage", listingField],
    queryFn: async (): Promise<Record<string, number>> => {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/listings?select=${encodeURIComponent(listingField)}`;
      const res = await fetch(url, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      });
      if (!res.ok) return {};
      const rows: Record<string, any>[] = await res.json();
      const counts: Record<string, number> = {};
      for (const row of rows) {
        const val = row[listingField];
        if (val == null) continue;
        // Handle array fields (music_genres)
        if (Array.isArray(val)) {
          for (const v of val) { counts[v] = (counts[v] || 0) + 1; }
        } else {
          counts[val] = (counts[val] || 0) + 1;
        }
      }
      return counts;
    },
  });
}

export function useCreateTaxonomyItem(table: TaxonomyTable) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: { name: string; slug: string; sort_order: number }) => {
      const { error } = await supabase.from(table).insert(item);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["taxonomy_admin", table] });
      qc.invalidateQueries({ queryKey: ["taxonomy"] });
    },
  });
}

export function useUpdateTaxonomyItem(table: TaxonomyTable) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TaxonomyItem> & { id: string }) => {
      const { error } = await supabase.from(table).update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["taxonomy_admin", table] });
      qc.invalidateQueries({ queryKey: ["taxonomy"] });
    },
  });
}

export function useDeleteTaxonomyItem(table: TaxonomyTable) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["taxonomy_admin", table] });
      qc.invalidateQueries({ queryKey: ["taxonomy"] });
    },
  });
}

// Check if a taxonomy value is used by listings
export function useCheckTaxonomyUsage() {
  return useMutation({
    mutationFn: async ({ field, value }: { field: string; value: string }): Promise<number> => {
      // For array fields, use 'cs' (contains); for scalar fields, use 'eq'
      const arrayFields = ["cuisine", "music_genres", "highlights", "amenities", "venue_type", "experience_type", "show_experience_type"];
      const op = arrayFields.includes(field) ? "cs" : "eq";
      const filterValue = op === "cs" ? `{${value}}` : value;
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/listings?select=id&${encodeURIComponent(field)}=${op}.${encodeURIComponent(filterValue)}&limit=1`;
      const res = await fetch(url, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          Prefer: "count=exact",
        },
      });
      const countHeader = res.headers.get("content-range");
      const total = countHeader ? parseInt(countHeader.split("/")[1] || "0", 10) : 0;
      return total;
    },
  });
}
