import type { Metadata } from "next";

const CUISINES: Record<string, { label: string; desc: string }> = {
  "mexicana": { label: "Cocina Mexicana", desc: "Los mejores restaurantes de cocina mexicana en Las Vegas." },
  "cubana": { label: "Cocina Cubana", desc: "Restaurantes de cocina cubana autentica en Las Vegas." },
  "colombiana": { label: "Cocina Colombiana", desc: "Sabores colombianos autenticos en Las Vegas." },
  "steakhouse": { label: "Steakhouse", desc: "Los mejores steakhouses de Las Vegas." },
  "italiana": { label: "Cocina Italiana", desc: "Restaurantes italianos en Las Vegas." },
  "peruana": { label: "Cocina Peruana", desc: "Ceviche, lomo saltado y mas sabores peruanos en Las Vegas." },
  "mariscos": { label: "Mariscos", desc: "Los mejores mariscos de Las Vegas." },
};

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function fetchCuisineListings(cuisineSlug: string) {
  if (!SB_URL || !SB_KEY) return [];
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/listings?select=name,slug,google_rating,google_user_ratings_total,region&order=google_user_ratings_total.desc.nullslast&limit=20`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ cuisine: string }> }): Promise<Metadata> {
  const { cuisine } = await params;
  const config = CUISINES[cuisine];
  const label = config?.label || cuisine;
  const desc = config?.desc || `Restaurantes de ${label} en Las Vegas.`;
  const title = `${label} en Las Vegas - Restaurantes Recomendados | Latino Las Vegas`;
  return {
    title, description: desc,
    alternates: { canonical: `https://latinolasvegas.com/cocina/${cuisine}` },
    openGraph: { title, description: desc, url: `https://latinolasvegas.com/cocina/${cuisine}`, siteName: "Latino Las Vegas", locale: "es_MX" },
  };
}

export default async function CocinaLayout({ children, params }: { children: React.ReactNode; params: Promise<{ cuisine: string }> }) {
  const { cuisine } = await params;
  const config = CUISINES[cuisine];
  const label = config?.label || cuisine;
  const listings = await fetchCuisineListings(cuisine);
  return (
    <>
      <div style={{ position:"absolute",width:"1px",height:"1px",padding:0,margin:"-1px",overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap",border:0 }} aria-hidden="true">
        <h1>{label} en Las Vegas</h1>
        <p>{config?.desc || `Restaurantes de ${label} en Las Vegas.`}</p>
        <ul>
          {listings.map((l: any) => (
            <li key={l.slug}><a href={`/lugar/${l.slug}`}>{l.name}{l.region ? ` en ${l.region}` : ""}{l.google_rating ? ` - ${l.google_rating}/5` : ""}</a></li>
          ))}
        </ul>
      </div>
      {children}
    </>
  );
}
