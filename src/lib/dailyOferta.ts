import type { Listing } from "@/data/listings";

/**
 * Deterministic daily seed based on UTC date.
 * Produces the same number for the entire day, resets at midnight UTC.
 */
function dailySeed(): number {
  const d = new Date();
  return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}

/**
 * Simple seeded pseudo-random (mulberry32).
 */
function seededRandom(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns true if a listing has a valid Happy Hour configuration.
 */
function hasValidHappyHour(listing: Listing): boolean {
  if (!listing.happyHourDetails) return false;
  const details = listing.happyHourDetails.trim();
  if (!details) return false;

  // Try parsing as JSON array (structured happy hours)
  try {
    const parsed = JSON.parse(details);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.some(
        (entry: any) => entry.days?.trim() && entry.hours?.trim() && entry.details?.trim()
      );
    }
  } catch {
    // Plain text happy hour — valid if non-empty
  }

  return details.length > 0;
}

/**
 * From all listings with valid Happy Hour, pick a daily-rotating subset.
 * Selection is stable within the same UTC day and rotates daily.
 *
 * @param listings  All listings to evaluate
 * @param count     How many to pick (default 1)
 * @returns         Selected listings for today's "Oferta" rotation
 */
export function getDailyOfertaListings(listings: Listing[], count = 1): Listing[] {
  const eligible = listings.filter(l => !!l.image && hasValidHappyHour(l));
  if (eligible.length === 0) return [];
  if (eligible.length <= count) return eligible;

  // Sort deterministically by id so the base order is always the same
  const sorted = [...eligible].sort((a, b) => String(a.id).localeCompare(String(b.id)));

  const rand = seededRandom(dailySeed());

  // Fisher-Yates shuffle with seeded random, then take first `count`
  const shuffled = [...sorted];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Try to maximize category variety
  const picked: Listing[] = [];
  const usedCats = new Set<string>();

  // Pass 1: unique categories
  for (const l of shuffled) {
    if (picked.length >= count) break;
    if (!usedCats.has(l.cat)) {
      usedCats.add(l.cat);
      picked.push(l);
    }
  }

  // Pass 2: fill remaining regardless of category
  if (picked.length < count) {
    const pickedIds = new Set(picked.map(l => l.id));
    for (const l of shuffled) {
      if (picked.length >= count) break;
      if (!pickedIds.has(l.id)) {
        picked.push(l);
      }
    }
  }

  return picked;
}
