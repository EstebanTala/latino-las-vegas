import type { Metadata } from "next";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

type Listing = {
  name: string;
  slug: string;
  description?: string;
  address?: string;
  image?: string;
  image2?: string;
  cat?: string;
  cat_label?: string;
  region?: string;
  google_rating?: number | null;
  google_user_ratings_total?: number | null;
  price?: string;
  phone?: string;
};

async function fetchListing(slug: string): Promise<Listing | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/listings?slug=eq.${encodeURIComponent(
        slug
      )}&select=name,slug,description,address,image,image2,cat,cat_label,region,google_rating,google_user_ratings_total,price,phone&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 3600 }, // cache for 1 hour, refetch hourly
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Listing[];
    return data[0] || null;
  } catch {
    return null;
  }
}

function truncate(text: string, max: number): string {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trim() + "\u2026";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = await fetchListing(slug);

  if (!listing) {
    return {
      title: "Lugar no encontrado \u2014 Latino Las Vegas",
      description: "Este lugar no existe en nuestra gu\u00eda.",
    };
  }

  const catLabel = listing.cat_label || "Las Vegas";
  const region = listing.region ? ` en ${listing.region}` : "";
  const title = `${listing.name} \u2014 ${catLabel}${region} | Latino Las Vegas`;

  const baseDesc =
    listing.description ||
    `${listing.name} en Las Vegas. Rese\u00f1as, informaci\u00f3n y recomendaciones de la comunidad latina.`;
  const description = truncate(baseDesc, 160);

  const url = `https://latinolasvegas.com/lugar/${listing.slug}`;
  const image = listing.image || listing.image2 || "https://latinolasvegas.com/og-default.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Latino Las Vegas",
      locale: "es_MX",
      type: "website",
      images: image ? [{ url: image, width: 1200, height: 630, alt: listing.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function LugarLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await fetchListing(slug);

  // Build JSON-LD structured data for rich results
  let jsonLd: any = null;
  if (listing) {
    const url = `https://latinolasvegas.com/lugar/${listing.slug}`;
    const schemaType =
      listing.cat === "hoteles"
        ? "Hotel"
        : listing.cat === "restaurantes"
        ? "Restaurant"
        : listing.cat === "nocturna"
        ? "NightClub"
        : listing.cat === "shows"
        ? "TheaterEvent"
        : "LocalBusiness";

    jsonLd = {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: listing.name,
      description: listing.description || undefined,
      url,
      image: listing.image || listing.image2 || undefined,
      address: listing.address
        ? {
            "@type": "PostalAddress",
            streetAddress: listing.address,
            addressLocality: "Las Vegas",
            addressRegion: "NV",
            addressCountry: "US",
          }
        : undefined,
      telephone: listing.phone || undefined,
      priceRange: listing.price || undefined,
      aggregateRating:
        listing.google_rating && listing.google_user_ratings_total
          ? {
              "@type": "AggregateRating",
              ratingValue: listing.google_rating,
              reviewCount: listing.google_user_ratings_total,
              bestRating: 5,
            }
          : undefined,
    };

    // Remove undefined keys for cleaner output
    jsonLd = JSON.parse(JSON.stringify(jsonLd));
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* SEO-visible server-rendered content. Hidden visually but readable by Google. */}
      {listing && (
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
          <h1>{listing.name}</h1>
          {listing.cat_label && <p>Categor\u00eda: {listing.cat_label}</p>}
          {listing.region && <p>Zona: {listing.region}</p>}
          {listing.address && <p>Direcci\u00f3n: {listing.address}</p>}
          {listing.description && <p>{listing.description}</p>}
          {listing.google_rating && (
            <p>
              Calificaci\u00f3n: {listing.google_rating} de 5 basado en{" "}
              {listing.google_user_ratings_total} rese\u00f1as.
            </p>
          )}
        </div>
      )}
      {children}
    </>
  );
}
