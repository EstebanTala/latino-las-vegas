"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const clubs = [
  {
    name: "La Jolla Nightclub",
    zona: "Near The Strip (Flamingo Rd)",
    precio: "Cover $10-20",
    musica: "Salsa, Merengue, Cumbia, Reggaeton, Latin EDM",
    mejorNoche: "Sábados (Famous Latin Saturday)",
    descripcion:
      "La Jolla es probablemente el club latino más popular de Las Vegas. Está a 5 minutos del Strip pero con precios que no te van a destrozar la cartera. Los DJs rotan entre salsa, merengue, cumbia, reggaeton y hasta rock en español. Tiene bar completo, hookah, y botanas. El ambiente es 100% latino — escuchas español por todos lados y la pista siempre está llena.",
    tip: "Los jueves (Fuego Thursday) son la mejor noche para ir si quieres menos gente y mejores precios en bebidas. Los sábados son más llenos pero la energía es increíble.",
    dressCode: "Casual elegante. No tenis, no shorts.",
  },
  {
    name: "Mango Tango Nightclub",
    zona: "Near The Strip (Decatur Blvd)",
    precio: "Cover $10-15",
    musica: "Reggaeton, Latin Pop, Bachata, Cumbia",
    mejorNoche: "Viernes y sábados",
    descripcion:
      "Mango Tango es más moderno y lujoso que la mayoría de clubs latinos en Vegas. Tiene mesas VIP con servicio de botella, cocina abierta toda la noche, y un sistema de sonido de primer nivel. Los servidores son atentos y el ambiente es para gente que quiere salir bien vestida y pasarla bien sin el caos de un club del Strip. A pocas cuadras del Strip pero con precios mucho más razonables.",
    tip: "Reserva mesa si van en grupo — el servicio de botella es sorprendentemente accesible comparado con los clubs del Strip. Dress to impress aquí.",
    dressCode: "Elegante. Camisa con botones recomendada para hombres.",
  },
  {
    name: "La Hacienda Nightclub",
    zona: "North Las Vegas (Daley St)",
    precio: "Cover $5-15",
    musica: "Banda, Regional Mexicano, Norteño, Cumbia",
    mejorNoche: "Sábados",
    descripcion:
      "Si lo tuyo es la música regional mexicana — banda, norteño, sierreño — La Hacienda es tu lugar. Está en North Las Vegas, lejos del Strip, y eso es parte del encanto: es un club para la comunidad local, no para turistas. Los DJs saben exactamente qué poner y cuándo. Hay noches temáticas diferentes cada día de la semana. Es el club donde los locales van a bailar de verdad.",
    tip: "Los domingos tienen eventos especiales con bandas en vivo. Es más lejos del Strip pero vale el viaje si te gusta la regional mexicana.",
    dressCode: "Casual. Botas y sombrero bienvenidos.",
  },
  {
    name: "Las Toxicas Gentlemen's Club",
    zona: "Near The Strip (Western Ave)",
    precio: "Cover varies",
    musica: "Reggaeton, Perreo, Latin Trap, Corridos Tumbados",
    mejorNoche: "Viernes y sábados",
    descripcion:
      "Un concepto diferente: un gentlemen's club completamente enfocado en la cultura latina. La música no es decoración aquí — es el corazón del lugar. Reggaeton, perreo, corridos tumbados. Las performers entienden los ritmos y la cultura. Es el spot que estaba reclamando la comunidad: entretenimiento para adultos pero con la vibra latina que los clubs americanos nunca han logrado capturar.",
    tip: "A minutos del norte del Strip. El ambiente es completamente diferente a cualquier otro gentlemen's club en Vegas.",
    dressCode: "Casual.",
  },
  {
    name: "Noches latinas en clubs del Strip",
    zona: "The Strip (varios venues)",
    precio: "Cover $30-75+",
    musica: "Varía por evento",
    mejorNoche: "Depende del evento",
    descripcion:
      "Varios clubs en el Strip organizan noches latinas especiales — Hakkasan, Omnia, XS, y otros rotan eventos con DJs latinos y artistas de reggaeton. Estos son eventos especiales, no noches fijas, así que hay que estar pendiente de las redes sociales para enterarte. La producción es de primer nivel (es el Strip, después de todo) pero los precios también lo son. Cover puede superar los $50 y las bebidas arrancan en $18+.",
    tip: "Sigue a @HakkasanLV, @OmniaLV y @XSlasvegas en Instagram para enterarte de las noches latinas. Compra boletos por adelantado — en puerta siempre es más caro. Las guest lists a veces dan entrada gratis antes de cierta hora.",
    dressCode: "Elegante. Código de vestimenta estricto — no tenis, no jeans rotos.",
  },
];

export default function VidaNocturnaLatinaGuide() {
  useEffect(() => {
    document.title =
      "Clubs y Discotecas Latinas en Las Vegas — Guía 2026 | Latino Las Vegas";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "Guía completa de la vida nocturna latina en Las Vegas. Clubs, discotecas, noches de salsa, reggaeton y más — con recomendaciones de un local."
      );
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Clubs y Discotecas Latinas en Las Vegas — Guía 2026",
    description:
      "Guía de la vida nocturna latina en Las Vegas. Los mejores clubs, discotecas y noches latinas con música en español.",
    author: { "@type": "Organization", name: "Latino Las Vegas" },
    publisher: {
      "@type": "Organization",
      name: "Latino Las Vegas",
      url: "https://latinolasvegas.com",
    },
    datePublished: "2026-04-14",
    dateModified: "2026-04-14",
    url: "https://latinolasvegas.com/guia/vida-nocturna-latina-las-vegas",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <div className="pt-[140px] pb-20 text-center relative overflow-hidden bg-[linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(192,132,252,0.12)_0%,transparent_60%)]" />
        <div className="container relative">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link href="/" className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors">Inicio</Link>
            <span className="text-dark-text-muted text-[12px]">›</span>
            <Link href="/explorar?cat=nocturna" className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors">Vida Nocturna</Link>
            <span className="text-dark-text-muted text-[12px]">›</span>
            <span className="text-[12px] text-[#C084FC]">Latina</span>
          </div>
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#C084FC] mb-2.5">
            Guía nocturna · 2026
          </div>
          <h1 className="font-display text-[clamp(48px,8vw,96px)] tracking-[4px] leading-[0.9] mb-5 text-dark-text">
            VIDA NOCTURNA<br /><span className="text-[#C084FC]">LATINA</span>
          </h1>
          <p className="text-[19px] text-dark-text-2 max-w-[640px] mx-auto mb-9 leading-relaxed">
            Clubs, discotecas y noches latinas en Las Vegas — reggaeton, salsa,
            banda y más. Dónde ir, qué esperar, y cuánto vas a gastar.
          </p>
        </div>
      </div>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container max-w-[800px]">
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">
            La vida nocturna latina en Las Vegas ha explotado en los últimos
            años. Ya no tienes que conformarte con un club del Strip donde
            ponen reggaeton una canción de cada diez. Ahora hay clubs dedicados
            100% a la música latina, con DJs que saben la diferencia entre
            perreo y dembow, y donde pedir en español es lo normal.
          </p>
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">
            Esta guía cubre los mejores spots latinos de la ciudad — desde
            clubs de salsa elegantes hasta antros de reggaeton que no paran
            hasta las 4am. También incluimos las noches latinas especiales en
            los mega-clubs del Strip, porque cuando Hakkasan o Omnia hacen una
            noche latina, la producción es de otro mundo.
          </p>
          <p className="text-[17px] text-muted-foreground leading-relaxed">
            <strong>Consejo general:</strong> Los clubs latinos en Vegas están
            fuera del Strip — eso significa precios más accesibles, menos
            turistas, y un ambiente más auténtico. Uber o Lyft es la mejor
            forma de llegar.
          </p>
        </div>
      </section>

      {/* Club List */}
      <section className="pb-20 bg-background">
        <div className="container max-w-[900px]">
          <div className="space-y-10">
            {clubs.map((c, i) => (
              <article
                key={i}
                className="border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold tracking-[1.5px] uppercase bg-[rgba(192,132,252,0.1)] text-[#C084FC] border border-[rgba(192,132,252,0.25)] rounded-full px-2.5 py-0.5">
                          {c.mejorNoche}
                        </span>
                        <span className="text-[10px] font-bold tracking-[1.5px] uppercase bg-[rgba(255,255,255,0.05)] text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                          {c.precio}
                        </span>
                      </div>
                      <h2 className="font-condensed text-[28px] font-bold leading-tight">
                        {c.name}
                      </h2>
                    </div>
                    <div className="text-right text-[13px] text-muted-foreground">
                      <div>{c.zona}</div>
                      <div className="text-[11px] mt-1">{c.dressCode}</div>
                    </div>
                  </div>

                  <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-muted-foreground mb-3">
                    {c.musica}
                  </div>

                  <p className="text-[15px] text-foreground/80 leading-relaxed mb-5">
                    {c.descripcion}
                  </p>

                  <div className="bg-cream-2 rounded-lg p-4 border border-border">
                    <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C084FC] mb-1">
                      Consejo local
                    </div>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                      {c.tip}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Safety tips */}
      <section className="py-16 bg-cream-2">
        <div className="container max-w-[800px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">
            Antes de salir
          </div>
          <h2 className="font-display text-[48px] tracking-[2px] mb-6">
            Tips Para La Noche
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { titulo: "Transporte", texto: "Siempre usa Uber/Lyft. Nunca manejes después de beber. Los clubs latinos están fuera del Strip así que no puedes caminar." },
              { titulo: "Efectivo", texto: "Lleva efectivo — algunos clubs cobran cover solo en cash. ATMs dentro de clubs cobran fees de $5-10." },
              { titulo: "Dress code", texto: "Cada club tiene su código. En general: nada de tenis, shorts, o camisetas sin mangas para hombres. Mejor ir un poco más arreglado." },
              { titulo: "Reservaciones", texto: "Para servicio de botella o mesas VIP, reserva por Instagram DM o teléfono. Casi todos los clubs latinos responden rápido por IG." },
            ].map((t) => (
              <div
                key={t.titulo}
                className="bg-background border border-border rounded-lg p-5"
              >
                <div className="font-condensed text-[16px] font-bold mb-1">
                  {t.titulo}
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {t.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-dark-2 text-center">
        <div className="container max-w-[600px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#C084FC] mb-2.5">
            Sigue explorando
          </div>
          <h2 className="font-display text-[48px] tracking-[2px] text-dark-text mb-4">
            Más Para Descubrir
          </h2>
          <p className="text-dark-text-2 leading-relaxed mb-8">
            La noche es solo el comienzo. Explora restaurantes, shows y
            atracciones para completar tu experiencia en Las Vegas.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/explorar?cat=nocturna"
              className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-light hover:-translate-y-px transition-all"
            >
              Ver toda la vida nocturna →
            </Link>
            <Link
              href="/guia/restaurantes-mexicanos-las-vegas"
              className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm border border-[rgba(255,255,255,0.15)] text-dark-text-2 hover:text-dark-text hover:border-[rgba(255,255,255,0.3)] transition-all"
            >
              Restaurantes mexicanos →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
