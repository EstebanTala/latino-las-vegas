const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

type ListingSummary = {
  name: string;
  slug: string;
  description?: string;
  cat_label?: string;
  google_rating?: number | null;
  google_user_ratings_total?: number | null;
  region?: string;
};

async function fetchTopListings(): Promise<ListingSummary[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/listings?select=name,slug,description,cat_label,google_rating,google_user_ratings_total,region&order=google_user_ratings_total.desc.nullslast&limit=20`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    return (await res.json()) as ListingSummary[];
  } catch {
    return [];
  }
}

async function fetchCategoryCounts(): Promise<Record<string, number>> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return {};
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/listings?select=cat_label`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return {};
    const data = (await res.json()) as { cat_label: string }[];
    const counts: Record<string, number> = {};
    for (const row of data) {
      if (row.cat_label) {
        counts[row.cat_label] = (counts[row.cat_label] || 0) + 1;
      }
    }
    return counts;
  } catch {
    return {};
  }
}

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [listings, categoryCounts] = await Promise.all([
    fetchTopListings(),
    fetchCategoryCounts(),
  ]);

  const totalListings = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Los lugares mas populares en Las Vegas",
    numberOfItems: listings.length,
    itemListElement: listings.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: l.name,
      url: `https://latinolasvegas.com/lugar/${l.slug}`,
    })),
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Latino Las Vegas",
    url: "https://latinolasvegas.com",
    description: "La guia mas completa de Las Vegas en espanol. Hoteles, restaurantes, shows, vida nocturna y atracciones para la comunidad latina.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <div
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        aria-hidden="true"
      >
        <h1>Latino Las Vegas - Guia en Espanol de Las Vegas</h1>
        <p>
          La guia mas completa de Las Vegas en espanol.
          Descubre {totalListings} hoteles, restaurantes, shows, vida nocturna y
          atracciones recomendados por la comunidad latina.
        </p>
        <h2>Categorias</h2>
        <ul>
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <li key={cat}>{cat}: {count} lugares</li>
          ))}
        </ul>
        <h2>Lugares populares en Las Vegas</h2>
        <ul>
          {listings.map((l) => (
            <li key={l.slug}>
              <a href={`/lugar/${l.slug}`}>
                {l.name}
                {l.cat_label ? ` - ${l.cat_label}` : ""}
                {l.region ? ` en ${l.region}` : ""}
                {l.google_rating ? ` - ${l.google_rating}/5 (${l.google_user_ratings_total} resenas)` : ""}
              </a>
            </li>
          ))}
        </ul>
        <h2>Guias destacadas</h2>
        <ul>
          <li><a href="/guia/restaurantes-mexicanos-las-vegas">Los Mejores Restaurantes Mexicanos en Las Vegas</a></li>
          <li><a href="/guia/mejores-shows-las-vegas">Los Mejores Shows en Las Vegas</a></li>
          <li><a href="/guia/vida-nocturna-latina-las-vegas">Vida Nocturna Latina en Las Vegas</a></li>
        </ul>
      </div>
      {children}
    </>
  );
}
