import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory cache: placeId -> { data, fetchedAt }
const cache = new Map<string, { data: unknown; fetchedAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const placeId = url.searchParams.get("placeId");

    if (!placeId) {
      return new Response(
        JSON.stringify({ error: "placeId query parameter is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate placeId format (starts with "ChIJ" or similar Google place ID patterns)
    if (typeof placeId !== "string" || placeId.length < 5 || placeId.length > 300) {
      return new Response(
        JSON.stringify({ error: "Invalid placeId format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check cache
    const cached = cache.get(placeId);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      return new Response(JSON.stringify(cached.data), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "HIT" },
      });
    }

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!GOOGLE_API_KEY) {
      console.error("[google-place-details] GOOGLE_PLACES_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,rating,user_ratings_total,reviews&reviews_sort=most_relevant&language=es&key=${GOOGLE_API_KEY}`;

    const res = await fetch(apiUrl);
    const body = await res.json();

    if (!res.ok || body.status !== "OK") {
      console.error(`[google-place-details] Google API error: status=${body.status}, error_message=${body.error_message || "none"}`);
      return new Response(
        JSON.stringify({ error: "Failed to fetch place details from Google" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = body.result || {};
    const payload = {
      rating: result.rating ?? null,
      user_ratings_total: result.user_ratings_total ?? null,
      reviews: (result.reviews || []).map((r: any) => ({
      author_name: r.author_name,
        rating: r.rating,
        relative_time_description: r.relative_time_description,
        text: r.text,
        profile_photo_url: r.profile_photo_url,
        original_language: r.original_language ?? null,
      })),
    };

    // Store in cache
    cache.set(placeId, { data: payload, fetchedAt: Date.now() });

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "MISS" },
    });
  } catch (e) {
    console.error("[google-place-details] Unhandled error:", e);
    return new Response(
      JSON.stringify({ error: "An internal error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
