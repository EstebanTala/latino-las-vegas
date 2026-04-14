"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const PAGE_TITLE = "Los Mejores Restaurantes Mexicanos en Las Vegas (2026) \u2014 Latino LV";
const PAGE_DESCRIPTION = "Gu\u00eda con los mejores restaurantes mexicanos en Las Vegas. Tacos, birria, mariscos y m\u00e1s. Rese\u00f1as de la comunidad, precios y consejos.";

const faqItems = [
  {
    question: "\u00bfCu\u00e1l es el mejor restaurante mexicano en Las Vegas?",
    answer: "Depende de lo que busques. Para tacos aut\u00e9nticos estilo Tijuana, Tacos El Gordo es la opci\u00f3n m\u00e1s popular. Para una experiencia de lujo, Casa Playa en el Wynn es dif\u00edcil de superar.",
  },
  {
    question: "\u00bfD\u00f3nde puedo encontrar tacos baratos en Las Vegas?",
    answer: "Tacos El Gordo en el Strip ofrece tacos aut\u00e9nticos a buen precio y est\u00e1 abierto hasta las 3am. Casa El Desayuno tiene opciones de desayuno mexicano muy accesibles.",
  },
  {
    question: "\u00bfCu\u00e1l es el mejor restaurante mexicano cerca del Strip?",
    answer: "Tacos El Gordo est\u00e1 directamente en el Strip. El Dorado Cantina est\u00e1 a pasos del Strip con estacionamiento gratis. Casa Playa est\u00e1 dentro del Wynn.",
  },
  {
    question: "\u00bfHay opciones de comida mexicana de lujo en Las Vegas?",
    answer: "S\u00ed. Casa Playa en el Wynn ofrece cocina costera mexicana de alta calidad. Il Toro E La Capra en Downtown fusiona sabores mexicanos con t\u00e9cnicas italianas.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function RestaurantesMexicanosGuide() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = PAGE_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", PAGE_DESCRIPTION);

    async function fetchRestaurants() {
      const { data } = await supabase
        .from("listings")
        .select("name, slug, image, image2, google_rating, price, region, description, cuisine, recomendacion_resumen, recomendado_bullets")
        .eq("cuisine", "Mexicana")
        .order("google_rating", { ascending: false })
        .limit(10);

      if (data) {
        setRestaurants(data);
      }
      setLoading(false);
    }
    fetchRestaurants();
  }, []);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    author: { "@type": "Organization", name: "Latino Las Vegas" },
    publisher: { "@type": "Organization", name: "Latino Las Vegas", url: "https://latinolasvegas.com" },
    url: "https://latinolasvegas.com/guia/restaurantes-mexicanos-las-vegas",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: restaurants.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "Restaurant", name: r.name, priceRange: r.price },
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />

      {/* Hero */}
      <div className="pt-[140px] pb-20 text-center relative overflow-hidden bg-[linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(232,39,42,0.12)_0%,transparent_60%)]" />
        <div className="container relative">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link href="/" className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors">Inicio</Link>
            <span className="text-dark-text-muted text-[12px]">{"\u203A"}</span>
            <Link href="/restaurantes" className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors">Restaurantes</Link>
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
          <div className="flex justify-center">
            <Link href="/explorar?cat=restaurantes&cocina=mexicano" className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-light hover:-translate-y-px transition-all">
              {"Explorar restaurantes mexicanos \u2192"}
            </Link>
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container max-w-[800px]">
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">{"Las Vegas es una de las ciudades con m\u00e1s opciones de comida mexicana fuera de M\u00e9xico. Desde taquer\u00edas abiertas hasta las 3am hasta restaurantes de alta cocina en el Strip \u2014 hay opciones para todos los gustos y presupuestos."}</p>
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">{"Esta gu\u00eda re\u00fane los restaurantes mexicanos m\u00e1s populares y mejor calificados de Las Vegas. Investigamos rese\u00f1as, hablamos con la comunidad, y seleccionamos los que consistentemente reciben las mejores recomendaciones."}</p>
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">{"Si ya visitaste alguno de estos lugares, d\u00e9janos saber tu experiencia \u2014 esta gu\u00eda crece con la comunidad."}</p>
          <p className="text-[13px] text-muted-foreground/60">{"\u00daltima actualizaci\u00f3n: abril 2026"}</p>
        </div>
      </section>

      {/* Restaurant List */}
      <section className="pb-20 bg-background">
        <div className="container max-w-[900px]">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Cargando restaurantes...</div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No se encontraron restaurantes mexicanos.</div>
          ) : (
            <div className="space-y-10">
              {restaurants.map((r, i) => (
                <article key={r.slug} className="border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                  {(r.image || r.image2) && (
                    <div className="flex gap-0 overflow-hidden">
                      {r.image && (
                        <div className={`relative ${r.image2 ? "w-1/2" : "w-full"} h-[220px] md:h-[260px]`}>
                          <img src={r.image} alt={`${r.name} \u2014 restaurante mexicano en Las Vegas`} className="w-full h-full object-cover" loading={i < 3 ? "eager" : "lazy"} />
                        </div>
                      )}
                      {r.image2 && (
                        <div className={`relative ${r.image ? "w-1/2" : "w-full"} h-[220px] md:h-[260px]`}>
                          <img src={r.image2} alt={`${r.name} \u2014 comida y ambiente`} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <span className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-1 block">#{i + 1}</span>
                        <h2 className="font-condensed text-[28px] font-bold leading-tight">
                          <Link href={`/lugar/${r.slug}`} className="hover:text-red transition-colors">{r.name}</Link>
                        </h2>
                      </div>
                      <div className="text-right">
                        {r.google_rating && (
                          <div className="text-[15px] font-bold text-gold">{`\u2605 ${r.google_rating}`}</div>
                        )}
                        <div className="text-[13px] text-muted-foreground">{r.price || ""}{r.region ? ` \u00b7 ${r.region}` : ""}</div>
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
      <section className="py-16 bg-dark-2 border-t border-white/5">
        <div className="container max-w-[700px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5 text-center">Preguntas frecuentes</div>
          <h2 className="font-display text-[clamp(28px,5vw,42px)] tracking-[2px] text-dark-text text-center mb-10">COMIDA MEXICANA EN LAS VEGAS</h2>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <details key={i} className="group bg-[rgba(255,255,255,0.03)] rounded-lg border border-white/5 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer text-[15px] font-bold text-dark-text hover:text-red transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-4">{faq.question}</span>
                  <span className="text-red text-[20px] shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-[14px] text-dark-text-2 leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Guides */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container max-w-[900px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5 text-center">{"Gu\u00edas relacionadas"}</div>
          <h2 className="font-display text-[clamp(28px,5vw,42px)] tracking-[2px] text-center mb-10">{"EXPLORA M\u00c1S DE LAS VEGAS"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/guia/shows-en-espanol-las-vegas" className="group block rounded-xl border border-border p-6 hover:border-red/30 hover:shadow-card transition-all">
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-2 block">{"Gu\u00eda"}</span>
              <span className="font-condensed text-[22px] font-bold group-hover:text-red transition-colors block mb-2">{"Shows en Espa\u00f1ol"}</span>
              <span className="text-[13px] text-muted-foreground">{"Los mejores espect\u00e1culos y shows que puedes disfrutar en espa\u00f1ol en Las Vegas."}</span>
            </Link>
            <Link href="/guia/vida-nocturna-latina-las-vegas" className="group block rounded-xl border border-border p-6 hover:border-red/30 hover:shadow-card transition-all">
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-2 block">{"Gu\u00eda"}</span>
              <span className="font-condensed text-[22px] font-bold group-hover:text-red transition-colors block mb-2">Vida Nocturna Latina</span>
              <span className="text-[13px] text-muted-foreground">{"Clubs, bares y noches latinas \u2014 reggaet\u00f3n, salsa, bachata y m\u00e1s en Las Vegas."}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-dark-2 text-center">
        <div className="container max-w-[600px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">{"Explora m\u00e1s"}</div>
          <h2 className="font-display text-[48px] tracking-[2px] text-dark-text mb-4">{"\u00bfBuscas M\u00e1s Opciones?"}</h2>
          <p className="text-dark-text-2 leading-relaxed mb-8">{"Nuestro directorio tiene restaurantes de todo tipo en Las Vegas \u2014 desde comida peruana y colombiana hasta los mejores buffets."}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/explorar?cat=restaurantes" className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-light hover:-translate-y-px transition-all">{"Ver todos los restaurantes \u2192"}</Link>
            <Link href="/hoteles" className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm border border-[rgba(255,255,255,0.15)] text-dark-text-2 hover:text-dark-text hover:border-[rgba(255,255,255,0.3)] transition-all">Hoteles en Las Vegas</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
