"use client";
import { useState, useMemo } from "react";
import { type Listing } from "@/data/listings";
import { type FilterState } from "@/components/FilterBar";
import { type CategoryFilterState, emptyCategoryFilters, applyCategoryFilters } from "@/components/CategoryFilters";
import { isOpenNow } from "@/lib/hours";

export function useListingFilters(listings: Listing[], activeCat: string = "") {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    prices: new Set(),
    zones: new Set(),
    highlights: new Set(),
    openNow: false,
    sort: "stars",
    resorts: new Set(),
  });
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilterState>(emptyCategoryFilters);

  const results = useMemo(() => {
    let r = [...listings];

    if (search) {
      const q = search.toLowerCase();
      r = r.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.desc.toLowerCase().includes(q) ||
        l.catLabel.toLowerCase().includes(q)
      );
    }

    if (filters.prices.size) r = r.filter(l => filters.prices.has(l.price));
    if (filters.zones.size) r = r.filter(l => l.region && filters.zones.has(l.region));
    if (filters.highlights.size) r = r.filter(l => l.highlights?.some(h => filters.highlights.has(h)));
    if (filters.openNow) r = r.filter(l => isOpenNow(l.hours));
    if (filters.resorts.size) r = r.filter(l => l.locatedInListingId && filters.resorts.has(l.locatedInListingId));

    // Apply category-specific filters
    r = applyCategoryFilters(r, activeCat, categoryFilters);

    // Tier score: paid listings first
    const tierScore = (l: Listing) => (l.isSponsored ? 2 : l.isFeatured ? 1 : 0);

    const pm: Record<string, number> = { "Gratis": 0, "gratis": 0, "$": 1, "$$": 2, "$$$": 3, "$$$$": 4 };
    if (filters.sort === "name") {
      r.sort((a, b) => tierScore(b) - tierScore(a) || a.name.localeCompare(b.name));
    } else if (filters.sort === "stars") {
      r.sort((a, b) => {
        const tier = tierScore(b) - tierScore(a);
        if (tier !== 0) return tier;
        const ratingDiff = (b.googleRating ?? b.stars) - (a.googleRating ?? a.stars);
        if (ratingDiff !== 0) return ratingDiff;
        return (b.googleUserRatingsTotal ?? 0) - (a.googleUserRatingsTotal ?? 0);
      });
    } else if (filters.sort === "price-low") {
      r.sort((a, b) => tierScore(b) - tierScore(a) || (pm[a.price] ?? 0) - (pm[b.price] ?? 0));
    } else if (filters.sort === "price-high") {
      r.sort((a, b) => tierScore(b) - tierScore(a) || (pm[b.price] ?? 0) - (pm[a.price] ?? 0));
    }

    return r;
  }, [listings, search, filters, categoryFilters, activeCat]);

  const clearAll = () => {
    setFilters({ prices: new Set(), zones: new Set(), highlights: new Set(), openNow: false, sort: "stars", resorts: new Set() });
    setCategoryFilters({ ...emptyCategoryFilters });
    setSearch("");
  };

  return { search, setSearch, filters, setFilters, categoryFilters, setCategoryFilters, clearAll, results };
}
