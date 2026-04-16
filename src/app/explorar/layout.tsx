import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorar Las Vegas en Espanol - Hoteles, Restaurantes, Shows y Mas | Latino Las Vegas",
  description: "Explora el directorio completo de Las Vegas en espanol. Filtra por categoria, zona, precio y tipo de cocina. Hoteles, restaurantes, shows, vida nocturna y atracciones.",
  alternates: { canonical: "https://latinolasvegas.com/explorar" },
  openGraph: {
    title: "Explorar Las Vegas en Espanol",
    description: "Directorio completo de Las Vegas en espanol. Filtra por categoria, zona, precio y mas.",
    url: "https://latinolasvegas.com/explorar",
    siteName: "Latino Las Vegas",
    locale: "es_MX",
  },
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function fetchAllListings() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/listings?select=name,slug,cat_label,region,google_rating&order=google_user_ratings_total.desc.nullslast&limit=30`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

export default async function ExplorarLayout({ children }: { children: React.ReactNode }) {
  const listings = await fetchAllListings();

  return (
    <>
      <div style={{ position:"absolute",width:"1px",height:"1px",padding:0,margin:"-1px",overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap",border:0 }} aria-hidden="true">
        <h1>Explorar Las Vegas en Espanol</h1>
        <p>Directorio completo con hoteles, restaurantes, shows, vida nocturna y atracciones en Las Vegas. Todos recomendados por la comunidad latina.</p>
        <ul>
          {listings.map((l: any) => (
            <li key={l.slug}><a href={`/lugar/${l.slug}`}>{l.name}{l.cat_label ? ` - ${l.cat_label}` : ""}{l.region ? ` en ${l.region}` : ""}</a></li>
          ))}
        </ul>
      </div>
      {children}
    </>
  );
}
