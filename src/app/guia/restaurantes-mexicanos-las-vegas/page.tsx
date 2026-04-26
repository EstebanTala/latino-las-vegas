import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Los Mejores Restaurantes Mexicanos en Las Vegas (2026) \u2014 Latino LV",
  description: "Gu\u00eda con los mejores restaurantes mexicanos en Las Vegas. Tacos, birria, mariscos y m\u00e1s. Rese\u00f1as de la comunidad, precios y consejos.",
  openGraph: {
    title: "Los Mejores Restaurantes Mexicanos en Las Vegas (2026)",
    description: "Gu\u00eda con los mejores restaurantes mexicanos en Las Vegas. Tacos, birria, mariscos y m\u00e1s.",
    url: "https://latinolasvegas.com/guia/restaurantes-mexicanos-las-vegas",
    siteName: "Latino Las Vegas",
    locale: "es_MX",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Los Mejores Restaurantes Mexicanos en Las Vegas (2026)",
    description: "Gu\u00eda con los mejores restaurantes mexicanos en Las Vegas.",
  },
  alternates: {
    canonical: "https://latinolasvegas.com/guia/restaurantes-mexicanos-las-vegas",
  },
};

export const revalidate = 3600; // Revalidate every hour

async function getRestaurants() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const res = await fetch(
    `${url}/rest/v1/listings?cuisine=cs.{Mexicana}&order=google_rating.desc.nullslast&limit=10&select=name,slug,image,image2,google_rating,price,region,description,cuisine,recomendacion_resumen,recomendado_bullets`,
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

export default async function RestaurantesMexicanosGuide() {
  const restaurants = await getRestaurants();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Los Mejores Restaurantes Mexicanos en Las Vegas (2026)",
    description: "Gu\u00eda con los mejores restaurantes mexicanos en Las Vegas.",
    author: { "@type": "Organization", name: "Latino Las Vegas" },
    publisher: { "@type": "Organization", name: "Latino Las Vegas", url: "https://latinolasvegas.com" },
    url: "https://latinolasvegas.com/guia/restaurantes-mexicanos-las-vegas",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: restaurants.map((r: any, i: number) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "Restaurant", name: r.name, priceRange: r.price },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Navbar />

      {/* Hero */}
      <div className="pt-[140px] pb-20 text-center relative overflow-hidden bg-[linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(232,39,42,0.12)_0%,transparent_60%)]" />
        <div className="container relative">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link href="/" className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors">Inicio</Link>
            <span className="text-dark-text-muted text-[12px]">{"\u203A"}</span>
            <Link href="/explorar?cat=restaurantes" className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors">Restaurantes</Link>
            <span className="text-dark-text-muted text-[12px]">{"\u203A"}</span>
            <span className="text-[12px] text-dark-text-muted">Mexicanos</span>
          </div>
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">{"Gu\u00eda local"}</div>
          <h1 className="font-display text-[clamp(48px,8vw,96px)] tracking-[4px] leading-[0.9] mb-5 text-dark-text">
            RESTAURANTES<br /><span className="text-red">MEXICANOS</span>
          </h1>
          <p className="text-[19px] text-dark-text-2 max-w-[640px] mx-auto mb-9 leading-relaxed">
            {"Los mejores restaurantes mexicanos en Las Vegas \u2014 desde taquer\u00edas callejeras hasta alta cocina. Rese\u00f1as honestas de un local que realmente come aqu\u00ed."}
          </p>
        </div>
      </div>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container max-w-[800px]">
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">{"Las Vegas es una de las ciudades con m\u00e1s opciones de comida mexicana fuera de M\u00e9xico. Desde taquer\u00edas abiertas hasta las 3am hasta restaurantes de alta cocina en el Strip \u2014 hay opciones para todos los gustos y presupuestos."}</p>
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">{"Esta gu\u00eda re\u00fane los restaurantes mexicanos m\u00e1s populares y mejor calificados de Las Vegas. Investigamos rese\u00f1as, hablamos con la comunidad, y seleccionamos los que consistentemente reciben las mejores recomendaciones."}</p>
          <p className="text-[17px] text-muted-foreground leading-relaxed">{"Si ya visitaste alguno de estos lugares, d\u00e9janos saber tu experiencia \u2014 esta gu\u00eda crece con la comunidad."}</p>
        </div>
      </section>

      {/* Restaurant List */}
      <section className="pb-20 bg-background">
        <div className="container max-w-[900px]">
          {restaurants.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No se encontraron restaurantes mexicanos.</div>
          ) : (
            <div className="space-y-10">
              {restaurants.map((r: any, i: number) => (
                <article key={r.slug} className="border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                  {(r.image || r.image2) && (
                    <div className="flex gap-0 overflow-hidden">
                      {r.image && (
                        <div className={`relative ${r.image2 ? "w-1/2" : "w-full"} h-[220px] md:h-[260px]`}>
                          <Image fill src={r.image} alt={`${r.name} \u2014 restaurante mexicano en Las Vegas`} className="w-full h-full object-cover" />
                        </div>
                      )}
                      {r.image2 && (
                        <div className={`relative ${r.image ? "w-1/2" : "w-full"} h-[220px] md:h-[260px]`}>
                          <Image fill src={r.image2} alt={`${r.name} \u2014 comida y ambiente`} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    <div className="mb-4">
                      <span className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-1 block">#{i + 1}</span>
                      <h2 className="font-condensed text-[28px] font-bold leading-tight mb-2">
                        <Link href={`/lugar/${r.slug}`} className="hover:text-red transition-colors">{r.name}</Link>
                      </h2>
                      <div className="flex items-center gap-1.5 text-[14px]">
                        {r.google_rating && <span className="font-bold text-gold">{`\u2605 ${r.google_rating}`}</span>}
                        {r.google_rating && <span className="text-muted-foreground">{"\u00b7"}</span>}
                        {r.price && <span className="text-muted-foreground">{r.price}</span>}
                        {r.region && <span className="text-muted-foreground">{`\u00b7 ${r.region}`}</span>}
                      </div>
                    </div>
                    <p className="text-[15px] text-foreground/80 leading-relaxed mb-5">{r.description}</p>
                    {(r.recomendacion_resumen || r.recomendado_bullets) && (
                      <div className="bg-cream-2 rounded-lg p-4 border border-border">
                        <div className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-1">Lo que dice la comunidad</div>
                        <p className="text-[14px] text-muted-foreground leading-relaxed">{r.recomendacion_resumen || r.recomendado_bullets}</p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="container max-w-[800px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">Preguntas frecuentes</div>
          <h2 className="font-display text-[clamp(28px,5vw,42px)] tracking-[2px] mb-8">SOBRE COMIDA MEXICANA EN LAS VEGAS</h2>
          <div className="space-y-3">
            <details className="group bg-cream-2 border border-border rounded-lg">
              <summary className="cursor-pointer px-5 py-4 text-[15px] font-medium list-none flex items-center justify-between gap-4">{"¿Cuáles son los mejores restaurantes mexicanos en Las Vegas?"}<span className="text-muted-foreground text-[18px] group-open:rotate-45 transition-transform">+</span></summary>
              <div className="px-5 pb-4 text-[14px] text-muted-foreground leading-relaxed">Los restaurantes mexicanos mejor calificados en Las Vegas incluyen Rosa Mexicano en el Strip, Tacos El Gordo con varias ubicaciones, y varios spots locales en West Las Vegas y East Las Vegas que sirven comida auténtica a precios accesibles.</div>
            </details>
            <details className="group bg-cream-2 border border-border rounded-lg">
              <summary className="cursor-pointer px-5 py-4 text-[15px] font-medium list-none flex items-center justify-between gap-4">{"¿Dónde encontrar tacos auténticos en Las Vegas?"}<span className="text-muted-foreground text-[18px] group-open:rotate-45 transition-transform">+</span></summary>
              <div className="px-5 pb-4 text-[14px] text-muted-foreground leading-relaxed">Las mejores taquerías están fuera del Strip, especialmente en West Las Vegas y North Las Vegas. Busca lugares donde los locales comen — si el menú está en español y hay familias comiendo, es buena señal.</div>
            </details>
            <details className="group bg-cream-2 border border-border rounded-lg">
              <summary className="cursor-pointer px-5 py-4 text-[15px] font-medium list-none flex items-center justify-between gap-4">{"¿Cuánto cuesta comer en un restaurante mexicano en Las Vegas?"}<span className="text-muted-foreground text-[18px] group-open:rotate-45 transition-transform">+</span></summary>
              <div className="px-5 pb-4 text-[14px] text-muted-foreground leading-relaxed">Los precios varían mucho. Taquerías callejeras y spots locales cuestan $8-15 por persona. Restaurantes mexicanos en el Strip o de alta cocina pueden costar $30-60+ por persona.</div>
            </details>
            <details className="group bg-cream-2 border border-border rounded-lg">
              <summary className="cursor-pointer px-5 py-4 text-[15px] font-medium list-none flex items-center justify-between gap-4">{"¿Hay restaurantes mexicanos abiertos las 24 horas en Las Vegas?"}<span className="text-muted-foreground text-[18px] group-open:rotate-45 transition-transform">+</span></summary>
              <div className="px-5 pb-4 text-[14px] text-muted-foreground leading-relaxed">Sí, varios restaurantes y taquerías en Las Vegas están abiertos hasta muy tarde o las 24 horas, especialmente cerca del Strip y en zonas como East Las Vegas.</div>
            </details>
          </div>
        </div>
      </section>


      {/* Related Guides */}
      <section className="py-10 bg-background border-t border-border">
        <div className="container max-w-[900px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5 text-center">{"Gu\u00edas relacionadas"}</div>
          <h2 className="font-display text-[clamp(28px,5vw,42px)] tracking-[2px] text-center mb-10">{"EXPLORA M\u00c1S DE LAS VEGAS"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/guia/mejores-shows-las-vegas" className="group block rounded-xl border border-border bg-card shadow-card p-6 hover:border-red/30 hover:shadow-card-hover transition-all">
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-2 block">{"Gu\u00eda"}</span>
              <span className="font-condensed text-[22px] font-bold group-hover:text-red transition-colors block mb-2">{"Mejores Shows de Las Vegas"}</span>
              <span className="text-[13px] text-muted-foreground">{"Conciertos, Cirque du Soleil y los mejores espect\u00e1culos en el Strip \u2014 con consejos para hispanohablantes."}</span>
            </Link>
            <Link href="/guia/vida-nocturna-latina-las-vegas" className="group block rounded-xl border border-border bg-card shadow-card p-6 hover:border-red/30 hover:shadow-card-hover transition-all">
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-2 block">{"Gu\u00eda"}</span>
              <span className="font-condensed text-[22px] font-bold group-hover:text-red transition-colors block mb-2">Vida Nocturna Latina</span>
              <span className="text-[13px] text-muted-foreground">{"Clubs, bares y noches latinas \u2014 reggaet\u00f3n, salsa, bachata y m\u00e1s en Las Vegas."}</span>
            </Link>
          </div>
        </div>
      </section>


      {/* Directory CTA */}
      <section className="py-10 bg-cream-2">
        <div className="container max-w-[900px]">
          <div className="rounded-xl bg-[rgba(5,5,5,0.95)] border border-white/[0.08] p-10 text-center">
            <p className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-3">Directorio completo</p>
            <h3 className="font-display text-[clamp(22px,4vw,32px)] tracking-[2px] text-white mb-3">{"\u00bfBUSCAS M\u00c1S OPCIONES?"}</h3>
            <p className="text-[14px] text-[rgba(255,255,255,0.55)] max-w-[500px] mx-auto mb-6 leading-relaxed">{"Explora todos los restaurantes en nuestro directorio \u2014 con filtros por ubicaci\u00f3n, precio y tipo de cocina."}</p>
            <Link href="/explorar?cat=restaurantes" className="inline-block font-condensed text-[15px] font-bold tracking-[1px] uppercase px-8 py-3.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-light hover:-translate-y-px transition-all">
              {"Explorar todos los restaurantes \u2192"}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
