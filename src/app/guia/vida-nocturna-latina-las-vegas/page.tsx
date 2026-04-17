import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Vida Nocturna Latina en Las Vegas (2026) \u2014 Clubs, Discotecas y M\u00e1s | Latino LV",
  description:
    "Gu\u00eda completa de la vida nocturna latina en Las Vegas. Clubs de salsa, reggaeton, bachata y m\u00e1s. D\u00f3nde ir, qu\u00e9 esperar y cu\u00e1nto vas a gastar.",
  openGraph: {
    title: "Vida Nocturna Latina en Las Vegas (2026)",
    description:
      "Clubs, discotecas y noches latinas en Las Vegas \u2014 reggaeton, salsa, banda y m\u00e1s.",
    url: "https://latinolasvegas.com/guia/vida-nocturna-latina-las-vegas",
    siteName: "Latino Las Vegas",
    locale: "es_MX",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vida Nocturna Latina en Las Vegas (2026)",
    description:
      "Clubs, discotecas y noches latinas en Las Vegas \u2014 reggaeton, salsa, banda y m\u00e1s.",
  },
  alternates: {
    canonical: "https://latinolasvegas.com/guia/vida-nocturna-latina-las-vegas",
  },
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

type VenueDB = {
  name: string;
  slug: string;
  image?: string;
  google_rating?: number | null;
  google_user_ratings_total?: number | null;
  region?: string;
  price?: string;
  description?: string;
  recomendacion_resumen?: string;
  recomendado_bullets?: string;
};

async function fetchNightlifeVenues(): Promise<VenueDB[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/listings?select=name,slug,image,google_rating,google_user_ratings_total,region,price,description,recomendacion_resumen,recomendado_bullets&cat_label=eq.Vida%20Nocturna&order=google_user_ratings_total.desc.nullslast`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    return (await res.json()) as VenueDB[];
  } catch {
    return [];
  }
}

/* ── Hardcoded Latin clubs (not in Supabase yet) ── */
const latinClubs = [
  {
    name: "La Jolla Nightclub",
    zona: "Near The Strip (Flamingo Rd)",
    precio: "Cover $10-20",
    musica: "Salsa, Merengue, Cumbia, Reggaeton, Latin EDM",
    mejorNoche: "S\u00e1bados (Famous Latin Saturday)",
    descripcion:
      "La Jolla es probablemente el club latino m\u00e1s popular de Las Vegas. Est\u00e1 a 5 minutos del Strip pero con precios que no te van a destrozar la cartera. Los DJs rotan entre salsa, merengue, cumbia, reggaeton y hasta rock en espa\u00f1ol. Tiene bar completo, hookah, y botanas. El ambiente es 100% latino \u2014 escuchas espa\u00f1ol por todos lados y la pista siempre est\u00e1 llena.",
    tip: "Los jueves (Fuego Thursday) son la mejor noche para ir si quieres menos gente y mejores precios en bebidas. Los s\u00e1bados son m\u00e1s llenos pero la energ\u00eda es incre\u00edble.",
    dressCode: "Casual elegante. No tenis, no shorts.",
  },
  {
    name: "Mango Tango Nightclub",
    zona: "Near The Strip (Decatur Blvd)",
    precio: "Cover $10-15",
    musica: "Reggaeton, Latin Pop, Bachata, Cumbia",
    mejorNoche: "Viernes y s\u00e1bados",
    descripcion:
      "Mango Tango es m\u00e1s moderno y lujoso que la mayor\u00eda de clubs latinos en Vegas. Tiene mesas VIP con servicio de botella, cocina abierta toda la noche, y un sistema de sonido de primer nivel. Los servidores son atentos y el ambiente es para gente que quiere salir bien vestida y pasarla bien sin el caos de un club del Strip.",
    tip: "Reserva mesa si van en grupo \u2014 el servicio de botella es sorprendentemente accesible comparado con los clubs del Strip. Dress to impress aqu\u00ed.",
    dressCode: "Elegante. Camisa con botones recomendada para hombres.",
  },
  {
    name: "La Hacienda Nightclub",
    zona: "North Las Vegas (Daley St)",
    precio: "Cover $5-15",
    musica: "Banda, Regional Mexicano, Norte\u00f1o, Cumbia",
    mejorNoche: "S\u00e1bados",
    descripcion:
      "Si lo tuyo es la m\u00fasica regional mexicana \u2014 banda, norte\u00f1o, sierre\u00f1o \u2014 La Hacienda es tu lugar. Est\u00e1 en North Las Vegas, lejos del Strip, y eso es parte del encanto: es un club para la comunidad local, no para turistas. Los DJs saben exactamente qu\u00e9 poner y cu\u00e1ndo.",
    tip: "Los domingos tienen eventos especiales con bandas en vivo. Es m\u00e1s lejos del Strip pero vale el viaje si te gusta la regional mexicana.",
    dressCode: "Casual. Botas y sombrero bienvenidos.",
  },
  {
    name: "Noches latinas en clubs del Strip",
    zona: "The Strip (varios venues)",
    precio: "Cover $30-75+",
    musica: "Var\u00eda por evento",
    mejorNoche: "Depende del evento",
    descripcion:
      "Varios clubs en el Strip organizan noches latinas especiales \u2014 Hakkasan, Omnia, XS, y otros rotan eventos con DJs latinos y artistas de reggaeton. Estos son eventos especiales, no noches fijas. La producci\u00f3n es de primer nivel pero los precios tambi\u00e9n lo son. Cover puede superar los $50 y las bebidas arrancan en $18+.",
    tip: "Sigue a @HakkasanLV, @OmniaLV y @XSlasvegas en Instagram para enterarte de las noches latinas. Compra boletos por adelantado \u2014 en puerta siempre es m\u00e1s caro.",
    dressCode: "Elegante. C\u00f3digo de vestimenta estricto.",
  },
];

function stars(rating: number | null | undefined) {
  if (!rating) return null;
  const full = Math.floor(rating);
  return "\u2605".repeat(full) + (rating % 1 >= 0.5 ? "\u00bd" : "");
}

export default async function VidaNocturnaLatinaGuide() {
  const venues = await fetchNightlifeVenues();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Vida Nocturna Latina en Las Vegas \u2014 Gu\u00eda 2026",
    description:
      "Gu\u00eda de la vida nocturna latina en Las Vegas. Los mejores clubs, discotecas y noches latinas con m\u00fasica en espa\u00f1ol.",
    author: { "@type": "Organization", name: "Latino Las Vegas" },
    publisher: {
      "@type": "Organization",
      name: "Latino Las Vegas",
      url: "https://latinolasvegas.com",
    },
    datePublished: "2026-04-14",
    dateModified: new Date().toISOString().split("T")[0],
    url: "https://latinolasvegas.com/guia/vida-nocturna-latina-las-vegas",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "\u00bfCu\u00e1les son los mejores clubs latinos en Las Vegas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Los clubs latinos m\u00e1s populares en Las Vegas incluyen La Jolla Nightclub (salsa, merengue, reggaeton), Mango Tango (reggaeton, bachata) y La Hacienda (banda, regional mexicano). Tambi\u00e9n hay noches latinas en clubs del Strip como Hakkasan y XS.",
        },
      },
      {
        "@type": "Question",
        name: "\u00bfCu\u00e1nto cuesta salir de noche en Las Vegas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Los clubs latinos fuera del Strip cobran cover de $5-20. Los clubs del Strip pueden cobrar $30-75+. Bebidas en clubs latinos cuestan $8-15, mientras que en el Strip arrancan en $18+.",
        },
      },
      {
        "@type": "Question",
        name: "\u00bfHay clubs con m\u00fasica reggaeton en Las Vegas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "S\u00ed. La Jolla, Mango Tango y varios clubs del Strip tienen noches de reggaeton. Los clubs latinos lo ponen toda la noche, mientras que en el Strip son eventos especiales.",
        },
      },
      {
        "@type": "Question",
        name: "\u00bfCu\u00e1l es el dress code en los clubs latinos de Las Vegas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La mayor\u00eda de clubs latinos piden casual elegante: nada de tenis, shorts o camisetas sin mangas para hombres. Los clubs del Strip son m\u00e1s estrictos. En La Hacienda, el dress code es m\u00e1s relajado.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <div className="pt-[140px] pb-20 text-center relative overflow-hidden bg-[linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(192,132,252,0.12)_0%,transparent_60%)]" />
        <div className="container relative">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link href="/" className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors">Inicio</Link>
            <span className="text-dark-text-muted text-[12px]">{"\u203A"}</span>
            <Link href="/explorar?cat=nocturna" className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors">Vida Nocturna</Link>
            <span className="text-dark-text-muted text-[12px]">{"\u203A"}</span>
            <span className="text-[12px] text-dark-text-muted">Latina</span>
          </div>
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#C084FC] mb-2.5">
            {"Gu\u00eda local"}
          </div>
          <h1 className="font-display text-[clamp(48px,8vw,96px)] tracking-[4px] leading-[0.9] mb-5 text-dark-text">
            VIDA NOCTURNA<br /><span className="text-[#C084FC]">LATINA</span>
          </h1>
          <p className="text-[19px] text-dark-text-2 max-w-[640px] mx-auto mb-9 leading-relaxed">
            Clubs, discotecas y noches latinas en Las Vegas — reggaeton, salsa,
            banda y m&aacute;s. D&oacute;nde ir, qu&eacute; esperar, y cu&aacute;nto vas a gastar.
          </p>

        </div>
      </div>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container max-w-[800px]">
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">Las Vegas tiene una escena nocturna latina que no para de crecer. Desde clubs dedicados 100% a la música latina hasta noches especiales de reggaeton en los mega-clubs del Strip — hay opciones para todos los gustos y presupuestos.</p>
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">Esta guía reúne los clubs y spots nocturnos más populares y mejor calificados por la comunidad. Investigamos reseñas, hablamos con la gente, y seleccionamos los que consistentemente ofrecen la mejor experiencia.</p>
          <p className="text-[17px] text-muted-foreground leading-relaxed">Si ya saliste a alguno de estos lugares, déjanos saber tu experiencia — esta guía crece con la comunidad.</p>
        </div>
      </section>

      {/* Latin Clubs */}
      <section className="pb-20 bg-background">
        <div className="container max-w-[900px]">
          <div className="space-y-10">
            {latinClubs.map((club, i) => (
              <article key={club.name} className="bg-background border border-border rounded-xl overflow-hidden shadow-card">
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-[#C084FC] font-bold text-[13px]">#{i + 1}</span>
                      <h3 className="font-condensed text-[clamp(20px,4vw,28px)] font-bold leading-tight">{club.name}</h3>
                    </div>
                    <span className="text-[13px] text-muted-foreground whitespace-nowrap">{club.precio}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[12px] bg-[rgba(192,132,252,0.1)] border border-[rgba(192,132,252,0.25)] text-[#C084FC] px-2.5 py-1 rounded-full">{club.zona}</span>
                    <span className="text-[12px] bg-[rgba(192,132,252,0.1)] border border-[rgba(192,132,252,0.25)] text-[#C084FC] px-2.5 py-1 rounded-full">{"Mejor noche: " + club.mejorNoche}</span>
                  </div>
                  <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">{club.descripcion}</p>
                  <div className="text-[13px] text-muted-foreground mb-2"><strong>{"M\u00fasica:"}</strong> {club.musica}</div>
                  <div className="text-[13px] text-muted-foreground mb-4"><strong>Dress code:</strong> {club.dressCode}</div>
                  <div className="bg-[rgba(192,132,252,0.06)] border border-[rgba(192,132,252,0.15)] rounded-lg p-4">
                    <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C084FC] mb-1">{"Lo que dice la comunidad"}</div>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">{club.tip}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>



      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="container max-w-[800px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#C084FC] mb-2.5">Preguntas frecuentes</div>
          <h2 className="font-display text-[clamp(28px,5vw,42px)] tracking-[2px] mb-8">SOBRE LA VIDA NOCTURNA LATINA</h2>
          <div className="space-y-3">
            {(faqJsonLd.mainEntity as any[]).map((faq: any, i: number) => (
              <details key={i} className="group bg-cream-2 border border-border rounded-lg">
                <summary className="cursor-pointer px-5 py-4 text-[15px] font-medium list-none flex items-center justify-between gap-4">
                  {faq.name}
                  <span className="text-muted-foreground text-[18px] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-4 text-[14px] text-muted-foreground leading-relaxed">{faq.acceptedAnswer.text}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
      {/* Related Guides */}
      <section className="py-10 bg-background border-t border-border">
        <div className="container max-w-[900px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5 text-center">{"Gu\u00edas relacionadas"}</div>
          <h2 className="font-display text-[clamp(28px,5vw,42px)] tracking-[2px] text-center mb-6">{"EXPLORA M\u00c1S DE LAS VEGAS"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/guia/restaurantes-mexicanos-las-vegas" className="group block rounded-xl border border-border bg-card shadow-card p-6 hover:border-red/30 hover:shadow-card-hover transition-all">
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-2 block">{"Gu\u00eda"}</span>
              <span className="font-condensed text-[22px] font-bold group-hover:text-red transition-colors block mb-2">Restaurantes Mexicanos</span>
              <span className="text-[13px] text-muted-foreground">{"Los mejores tacos, birria, mariscos y m\u00e1s \u2014 recomendados por la comunidad."}</span>
            </Link>
            <Link href="/guia/mejores-shows-las-vegas" className="group block rounded-xl border border-border bg-card shadow-card p-6 hover:border-red/30 hover:shadow-card-hover transition-all">
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-2 block">{"Gu\u00eda"}</span>
              <span className="font-condensed text-[22px] font-bold group-hover:text-red transition-colors block mb-2">Mejores Shows</span>
              <span className="text-[13px] text-muted-foreground">{"Los mejores espect\u00e1culos y shows que puedes disfrutar en Las Vegas."}</span>
            </Link>
          </div>
        </div>
      </section>

      

      {/* Directory CTA */}
      <section className="py-10 bg-cream-2">
        <div className="container max-w-[900px]">
          <div className="rounded-xl bg-[rgba(5,5,5,0.95)] border border-white/[0.08] p-10 text-center">
            <p className="text-[11px] font-bold tracking-[3px] uppercase text-[#C084FC] mb-3">Directorio completo</p>
            <h3 className="font-display text-[clamp(22px,4vw,32px)] tracking-[2px] text-white mb-3">¿LISTO PARA LA NOCHE?</h3>
            <p className="text-[14px] text-[rgba(255,255,255,0.55)] max-w-[500px] mx-auto mb-6 leading-relaxed">
              Descubre todos los bares, lounges y clubs en nuestro directorio — con filtros, reseñas y recomendaciones de la comunidad.
            </p>
            <Link href="/explorar?cat=nocturna" className="inline-block font-condensed text-[15px] font-bold tracking-[1px] uppercase px-8 py-3.5 rounded-sm bg-[#C084FC] text-white shadow-[0_2px_8px_rgba(192,132,252,0.3)] hover:brightness-110 hover:-translate-y-px transition-all">
              Explorar vida nocturna →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
