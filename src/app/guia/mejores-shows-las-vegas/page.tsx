import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Los Mejores Shows en Las Vegas (2026) \u2014 Qu\u00e9 Ver \u2014 Latino LV",
  description: "Gu\u00eda con los mejores shows y espect\u00e1culos en Las Vegas. Cirque du Soleil, conciertos, magia y m\u00e1s. Precios, rese\u00f1as y consejos.",
  openGraph: {
    title: "Los Mejores Shows en Las Vegas (2026) \u2014 Qu\u00e9 Ver",
    description: "Gu\u00eda con los mejores shows y espect\u00e1culos en Las Vegas. Cirque du Soleil, conciertos, magia y m\u00e1s.",
    url: "https://latinolasvegas.com/guia/mejores-shows-las-vegas",
    siteName: "Latino Las Vegas",
    locale: "es_MX",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Los Mejores Shows en Las Vegas (2026) \u2014 Qu\u00e9 Ver",
    description: "Gu\u00eda con los mejores shows y espect\u00e1culos en Las Vegas.",
  },
  alternates: {
    canonical: "https://latinolasvegas.com/guia/mejores-shows-las-vegas",
  },
};

export const revalidate = 3600;

async function getShows() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const res = await fetch(
    `${url}/rest/v1/listings?cat_label=eq.Shows %26 Eventos&order=google_rating.desc.nullslast,google_user_ratings_total.desc.nullslast&limit=15&select=name,slug,image,image2,google_rating,price_from,region,description,show_experience_type,recomendacion_resumen,recomendado_bullets`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return [];
  return res.json();
}

export default async function MejoresShowsGuide() {
  const shows = await getShows();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Los Mejores Shows en Las Vegas (2026)",
    description: "Gu\u00eda con los mejores shows y espect\u00e1culos en Las Vegas.",
    author: { "@type": "Organization", name: "Latino Las Vegas" },
    publisher: { "@type": "Organization", name: "Latino Las Vegas", url: "https://latinolasvegas.com" },
    url: "https://latinolasvegas.com/guia/mejores-shows-las-vegas",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: shows.map((s: any, i: number) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "Event", name: s.name },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Navbar />

      {/* Hero */}
      <div className="pt-[140px] pb-20 text-center relative overflow-hidden bg-[linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(251,146,60,0.12)_0%,transparent_60%)]" />
        <div className="container relative">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link href="/" className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors">Inicio</Link>
            <span className="text-dark-text-muted text-[12px]">{"\u203A"}</span>
            <Link href="/shows" className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors">Shows</Link>
            <span className="text-dark-text-muted text-[12px]">{"\u203A"}</span>
            <span className="text-[12px] text-dark-text-muted">{"Qu\u00e9 Ver"}</span>
          </div>
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#FB923C] mb-2.5">{"Gu\u00eda local"}</div>
          <h1 className="font-display text-[clamp(48px,8vw,96px)] tracking-[4px] leading-[0.9] mb-5 text-dark-text">
            {"QU\u00c9 VER EN"}<br /><span className="text-[#FB923C]">LAS VEGAS</span>
          </h1>
          <p className="text-[19px] text-dark-text-2 max-w-[640px] mx-auto mb-9 leading-relaxed">
            {"Los mejores shows y espect\u00e1culos en Las Vegas \u2014 desde Cirque du Soleil hasta conciertos y experiencias \u00fanicas."}
          </p>
        </div>
      </div>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container max-w-[800px]">
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">{"Las Vegas es la capital mundial del entretenimiento. Cada noche hay decenas de shows compitiendo por tu atenci\u00f3n \u2014 y no todos valen lo que cuestan."}</p>
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">{"Esta gu\u00eda re\u00fane los shows mejor calificados y m\u00e1s recomendados por la comunidad. Investigamos rese\u00f1as, comparamos precios, y seleccionamos los que consistentemente entregan una experiencia que vale cada d\u00f3lar."}</p>
          <p className="text-[17px] text-muted-foreground leading-relaxed">{"Si ya viste alguno de estos shows, d\u00e9janos saber tu experiencia \u2014 esta gu\u00eda crece con la comunidad."}</p>
        </div>
      </section>

      {/* Shows List */}
      <section className="pb-20 bg-background">
        <div className="container max-w-[900px]">
          {shows.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No se encontraron shows.</div>
          ) : (
            <div className="space-y-10">
              {shows.map((s: any, i: number) => (
                <article key={s.slug} className="border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                  {(s.image || s.image2) && (
                    <div className="flex gap-0 overflow-hidden">
                      {s.image && (
                        <div className={`relative ${s.image2 ? "w-1/2" : "w-full"} h-[220px] md:h-[260px]`}>
                          <img src={s.image} alt={`${s.name} \u2014 show en Las Vegas`} className="w-full h-full object-cover" loading={i < 3 ? "eager" : "lazy"} />
                        </div>
                      )}
                      {s.image2 && (
                        <div className={`relative ${s.image ? "w-1/2" : "w-full"} h-[220px] md:h-[260px]`}>
                          <img src={s.image2} alt={`${s.name} \u2014 espect\u00e1culo`} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    <div className="mb-4">
                      <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#FB923C] mb-1 block">#{i + 1}</span>
                      <h2 className="font-condensed text-[28px] font-bold leading-tight mb-2">
                        <Link href={`/lugar/${s.slug}`} className="hover:text-[#FB923C] transition-colors">{s.name}</Link>
                      </h2>
                      <div className="flex items-center gap-1.5 text-[14px] flex-wrap">
                        {s.show_experience_type && Array.isArray(s.show_experience_type) && s.show_experience_type.length > 0 && (
                          <span className="text-[11px] font-bold tracking-[1.5px] uppercase bg-[#FB923C]/10 text-[#FB923C] px-2 py-0.5 rounded-sm mr-1">{s.show_experience_type.join(", ")}</span>
                        )}
                        {s.google_rating && <span className="font-bold text-gold">{`\u2605 ${s.google_rating}`}</span>}
                        {s.google_rating && s.price_from && <span className="text-muted-foreground">{"\u00b7"}</span>}
                        {s.price_from && <span className="text-muted-foreground">{`Desde ${s.price_from}`}</span>}
                        {s.region && <span className="text-muted-foreground">{`\u00b7 ${s.region}`}</span>}
                      </div>
                    </div>
                    <p className="text-[15px] text-foreground/80 leading-relaxed mb-5">{s.description}</p>
                    {(s.recomendacion_resumen || s.recomendado_bullets) && (
                      <div className="bg-cream-2 rounded-lg p-4 border border-border">
                        <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#FB923C] mb-1">Lo que dice la comunidad</div>
                        <p className="text-[14px] text-muted-foreground leading-relaxed">{s.recomendacion_resumen || s.recomendado_bullets}</p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="container max-w-[800px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#FB923C] mb-2.5">Preguntas frecuentes</div>
          <h2 className="font-display text-[clamp(28px,5vw,42px)] tracking-[2px] mb-8">SOBRE SHOWS EN LAS VEGAS</h2>
          <div className="space-y-3">
            <details className="group bg-cream-2 border border-border rounded-lg">
              <summary className="cursor-pointer px-5 py-4 text-[15px] font-medium list-none flex items-center justify-between gap-4">{"¿Cuáles son los mejores shows en Las Vegas?"}<span className="text-muted-foreground text-[18px] group-open:rotate-45 transition-transform">+</span></summary>
              <div className="px-5 pb-4 text-[14px] text-muted-foreground leading-relaxed">Los shows mejor calificados incluyen espectáculos de Cirque du Soleil como "O" y Mystere, shows de comedia, conciertos de artistas en residencia, y experiencias inmersivas como Meow Wolf. La mejor opción depende de tus gustos y presupuesto.</div>
            </details>
            <details className="group bg-cream-2 border border-border rounded-lg">
              <summary className="cursor-pointer px-5 py-4 text-[15px] font-medium list-none flex items-center justify-between gap-4">{"¿Cuánto cuestan los shows en Las Vegas?"}<span className="text-muted-foreground text-[18px] group-open:rotate-45 transition-transform">+</span></summary>
              <div className="px-5 pb-4 text-[14px] text-muted-foreground leading-relaxed">Los precios varían desde $30-50 para shows más pequeños hasta $150-300+ para Cirque du Soleil y conciertos de artistas grandes. Comprar boletos por adelantado suele ser más barato que en taquilla.</div>
            </details>
            <details className="group bg-cream-2 border border-border rounded-lg">
              <summary className="cursor-pointer px-5 py-4 text-[15px] font-medium list-none flex items-center justify-between gap-4">{"¿Hay shows en español en Las Vegas?"}<span className="text-muted-foreground text-[18px] group-open:rotate-45 transition-transform">+</span></summary>
              <div className="px-5 pb-4 text-[14px] text-muted-foreground leading-relaxed">La mayoría de los shows son en inglés, pero muchos espectáculos visuales como Cirque du Soleil no requieren idioma. También hay conciertos de artistas latinos y eventos especiales en español durante todo el año.</div>
            </details>
            <details className="group bg-cream-2 border border-border rounded-lg">
              <summary className="cursor-pointer px-5 py-4 text-[15px] font-medium list-none flex items-center justify-between gap-4">{"¿Dónde comprar boletos para shows en Las Vegas?"}<span className="text-muted-foreground text-[18px] group-open:rotate-45 transition-transform">+</span></summary>
              <div className="px-5 pb-4 text-[14px] text-muted-foreground leading-relaxed">Puedes comprar boletos en los sitios oficiales de cada show, en plataformas como Ticketmaster, o en taquillas de descuento en el Strip. Para los mejores precios, compra con anticipación o busca ofertas de último momento en apps como TodayTix.</div>
            </details>
          </div>
        </div>
      </section>
      {/* Related Guides */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container max-w-[900px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5 text-center">{"Gu\u00edas relacionadas"}</div>
          <h2 className="font-display text-[clamp(28px,5vw,42px)] tracking-[2px] text-center mb-10">{"EXPLORA M\u00c1S DE LAS VEGAS"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/guia/restaurantes-mexicanos-las-vegas" className="group block rounded-xl border border-border p-6 hover:border-red/30 hover:shadow-card transition-all">
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-2 block">{"Gu\u00eda"}</span>
              <span className="font-condensed text-[22px] font-bold group-hover:text-red transition-colors block mb-2">Restaurantes Mexicanos</span>
              <span className="text-[13px] text-muted-foreground">{"Los mejores restaurantes mexicanos en Las Vegas \u2014 tacos, birria, mariscos y m\u00e1s."}</span>
            </Link>
            <Link href="/guia/vida-nocturna-latina-las-vegas" className="group block rounded-xl border border-border p-6 hover:border-red/30 hover:shadow-card transition-all">
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-2 block">{"Gu\u00eda"}</span>
              <span className="font-condensed text-[22px] font-bold group-hover:text-red transition-colors block mb-2">Vida Nocturna Latina</span>
              <span className="text-[13px] text-muted-foreground">{"Clubs, bares y noches latinas \u2014 reggaet\u00f3n, salsa, bachata y m\u00e1s en Las Vegas."}</span>
            </Link>
          </div>
        </div>
      </section>

      
          {/* Directory CTA */}
          <div className="mt-16 rounded-xl bg-[rgba(5,5,5,0.95)] border border-white/[0.08] p-10 text-center">
            <p className="text-[11px] font-bold tracking-[3px] uppercase text-[#FB923C] mb-3">Directorio completo</p>
            <h3 className="font-display text-[clamp(22px,4vw,32px)] tracking-[2px] text-white mb-3">{"\u00bfQUIERES VER M\u00c1S SHOWS?"}</h3>
            <p className="text-[14px] text-[rgba(255,255,255,0.55)] max-w-[500px] mx-auto mb-6 leading-relaxed">{"Explora todos los shows y eventos en nuestro directorio \u2014 con fechas, precios y rese\u00f1as de la comunidad."}</p>
            <Link href="/explorar?cat=shows" className="inline-block font-condensed text-[15px] font-bold tracking-[1px] uppercase px-8 py-3.5 rounded-sm bg-[#FB923C] text-white shadow-[0_2px_8px_rgba(251,146,60,0.3)] hover:brightness-110 hover:-translate-y-px transition-all">
              {"Explorar todos los shows \u2192"}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
