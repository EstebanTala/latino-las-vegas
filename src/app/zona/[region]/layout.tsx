import type { Metadata } from "next";

const REGIONS: Record<string, { label: string; desc: string }> = {
  "the-strip": { label: "The Strip", desc: "Los mejores hoteles, casinos, restaurantes y shows del famoso Strip de Las Vegas." },
  "henderson": { label: "Henderson", desc: "Restaurantes, spas y entretenimiento en Henderson, a minutos de Las Vegas." },
  "spring-valley": { label: "Spring Valley", desc: "Experiencias locales y restaurantes en Spring Valley, Las Vegas." },
  "downtown": { label: "Downtown", desc: "La zona historica de Las Vegas con Fremont Street, museos y restaurantes autenticos." },
  "west-las-vegas": { label: "West Las Vegas", desc: "La comunidad latina mas vibrante de Las Vegas con restaurantes y entretenimiento local." },
  "east-las-vegas": { label: "East Las Vegas", desc: "Steakhouses, cocina regional y experiencias autenticas en el este de Las Vegas." },
  "north-las-vegas": { label: "North Las Vegas", desc: "Sabores colombianos, peruanos y mas en la zona norte de Las Vegas." },
  "south-las-vegas": { label: "South Las Vegas", desc: "Hoteles locales y entretenimiento fuera del Strip en el sur de Las Vegas." },
  "summerlin": { label: "Summerlin", desc: "Spas, restaurantes y vida relajada en la exclusiva comunidad de Summerlin." },
  "excursion": { label: "Excursion", desc: "Excursiones desde Las Vegas al Gran Canon, Hoover Dam y mas." },
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function fetchRegionListings(regionLabel: string) {
  if (!SUPABASE_URL || !SUPABASE_KEY || !regionLabel) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/listings?select=name,slug,cat_label,google_rating,google_user_ratings_total&region=eq.${encodeURIComponent(regionLabel)}&order=google_user_ratings_total.desc.nullslast&limit=20`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region } = await params;
  const config = REGIONS[region];
  const label = config?.label || region;
  const desc = config?.desc || `Descubre lo mejor de ${label} en Las Vegas.`;
  const title = `${label} - Que hacer y donde ir | Latino Las Vegas`;
  return {
    title,
    description: desc,
    alternates: { canonical: `https://latinolasvegas.com/zona/${region}` },
    openGraph: { title, description: desc, url: `https://latinolasvegas.com/zona/${region}`, siteName: "Latino Las Vegas", locale: "es_MX" },
  };
}

export default async function ZonaLayout({ children, params }: { children: React.ReactNode; params: Promise<{ region: string }> }) {
  const { region } = await params;
  const config = REGIONS[region];
  const label = config?.label || region;
  const desc = config?.desc || `Descubre lo mejor de ${label} en Las Vegas.`;
  const listings = await fetchRegionListings(label);

  return (
    <>
      <div style={{ position:"absolute",width:"1px",height:"1px",padding:0,margin:"-1px",overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap",border:0 }} aria-hidden="true">
        <h1>{label} - Las Vegas</h1>
        <p>{desc}</p>
        <h2>Lugares en {label}</h2>
        <ul>
          {listings.map((l: any) => (
            <li key={l.slug}><a href={`/lugar/${l.slug}`}>{l.name}{l.cat_label ? ` - ${l.cat_label}` : ""}{l.google_rating ? ` - ${l.google_rating}/5` : ""}</a></li>
          ))}
        </ul>
      </div>
      {children}
    </>
  );
}
