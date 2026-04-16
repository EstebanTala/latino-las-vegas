/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://latinolasvegas.com",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/admin", "/admin/*", "/login", "/restaurantes", "/shows", "/vida-nocturna", "/hoteles", "/atracciones", "/guia/shows-en-espanol-las-vegas"],
  additionalPaths: async (config) => {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sxwmeoujphvnnxggiqzp.supabase.co";
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const paths = [];

    // Fetch all listings
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/listings?select=slug&limit=500`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      if (res.ok) {
        const listings = await res.json();
        for (const listing of listings) {
          if (listing.slug) {
            paths.push({
              loc: `/lugar/${listing.slug}`,
              changefreq: "weekly",
              priority: 0.8,
              lastmod: new Date().toISOString(),
            });
          }
        }
      }
    } catch (e) {
      console.error("Sitemap: failed to fetch listings", e);
    }

    return paths;
  },
};
