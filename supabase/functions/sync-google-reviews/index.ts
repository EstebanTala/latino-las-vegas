import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // --- Authentication & Authorization ---
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const anonClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
  if (claimsError || !claimsData?.claims) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const userId = claimsData.claims.sub;

  // Service-role client for data operations
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Check admin role
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleData) {
    return new Response(JSON.stringify({ error: "Admin access required" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // --- Business Logic ---
  const GOOGLE_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!GOOGLE_API_KEY) {
    return new Response(JSON.stringify({ error: "GOOGLE_PLACES_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { listing_id, bulk } = await req.json();

    let listings: { id: string; google_place_id: string }[] = [];

    if (bulk) {
      const { data, error } = await supabase
        .from("listings")
        .select("id, google_place_id")
        .not("google_place_id", "is", null)
        .neq("google_place_id", "");
      if (error) throw error;
      listings = data || [];
    } else if (listing_id) {
      // Validate listing_id is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (typeof listing_id !== "string" || !uuidRegex.test(listing_id)) {
        return new Response(
          JSON.stringify({ error: "Invalid listing_id format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("listings")
        .select("id, google_place_id")
        .eq("id", listing_id)
        .single();
      if (error) throw error;
      if (!data?.google_place_id) {
        return new Response(
          JSON.stringify({ error: "No google_place_id set for this listing" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      listings = [data];
    } else {
      return new Response(
        JSON.stringify({ error: "Provide listing_id or bulk: true" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: { id: string; rating?: number; total?: number; error?: string }[] = [];

    for (const listing of listings) {
      try {
        const url = `https://places.googleapis.com/v1/places/${listing.google_place_id}?fields=rating,userRatingCount,googleMapsUri&key=${GOOGLE_API_KEY}`;
        const res = await fetch(url);

        if (!res.ok) {
          const errBody = await res.text();
          console.error(`[sync-reviews] Google API error for listing ${listing.id}: ${res.status} ${errBody}`);
          results.push({ id: listing.id, error: "Failed to fetch reviews from Google" });
          continue;
        }

        const place = await res.json();

        const updates: Record<string, unknown> = {
          google_last_synced_at: new Date().toISOString(),
        };
        if (place.rating != null) updates.google_rating = place.rating;
        if (place.userRatingCount != null) updates.google_user_ratings_total = place.userRatingCount;
        if (place.googleMapsUri) updates.google_maps_url = place.googleMapsUri;

        const { error: updateError } = await supabase
          .from("listings")
          .update(updates)
          .eq("id", listing.id);
        if (updateError) throw updateError;

        results.push({ id: listing.id, rating: place.rating, total: place.userRatingCount });
      } catch (e) {
        console.error(`[sync-reviews] Error processing listing ${listing.id}:`, e);
        results.push({ id: listing.id, error: "Failed to sync reviews" });
      }
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[sync-reviews] Unhandled error:", e);
    return new Response(JSON.stringify({ error: "An internal error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
