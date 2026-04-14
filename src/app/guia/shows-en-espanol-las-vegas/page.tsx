"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const shows = [
  {
    name: "Carín León en The Sphere",
    tipo: "Concierto",
    fecha: "4-6 y 11-13 de septiembre, 2026",
    venue: "The Sphere at The Venetian",
    precio: "Desde ~$150",
    descripcion:
      "El evento latino más grande de 2026 en Las Vegas. Carín León será el primer artista latino en la historia en tocar en The Sphere — el venue más tecnológicamente avanzado del mundo. Seis noches durante la celebración del Día de la Independencia de México. La Sphere tiene 17,000 asientos, pantallas LED que envuelven toda la audiencia, y un sistema de audio con 167,000 altavoces. Si solo vas a un concierto este año, que sea este.",
    tip: "Los boletos se están agotando rápido. Compra en Ticketmaster directamente para evitar sobrecargos de reventa. Las fechas del 4-6 de septiembre (Labor Day weekend) se agregaron por la alta demanda.",
    idioma: "Español",
    linkTexto: "Ver boletos en Ticketmaster",
  },
  {
    name: "Michael Jackson ONE (Cirque du Soleil)",
    tipo: "Show permanente",
    fecha: "Múltiples funciones por semana",
    venue: "Mandalay Bay Resort and Casino",
    precio: "Desde ~$80",
    descripcion:
      "No necesitas hablar inglés para disfrutar este show — es 100% visual, musical y acrobático. Michael Jackson ONE combina las canciones más icónicas de MJ con acrobacias de Cirque du Soleil en un espectáculo que te pone la piel de gallina. La producción es impecable y la música habla por sí sola. Perfecto para familias y parejas.",
    tip: "Los asientos más baratos están atrás pero el show se ve bien desde cualquier lugar. Compra con anticipación — los precios suben cerca de la fecha.",
    idioma: "Visual (sin barrera de idioma)",
    linkTexto: "Ver disponibilidad",
  },
  {
    name: "KÀ (Cirque du Soleil)",
    tipo: "Show permanente",
    fecha: "Múltiples funciones por semana",
    venue: "MGM Grand Hotel and Casino",
    precio: "Desde ~$75",
    descripcion:
      "KÀ es el show más épico de Cirque du Soleil — cuenta la historia de gemelos imperiales en una aventura llena de artes marciales, acrobacias aéreas, pirotecnia y efectos que desafían la gravedad. El escenario se mueve, gira y se transforma frente a tus ojos. No hay diálogos, así que no hay barrera de idioma. Es puro espectáculo visual.",
    tip: "Busca asientos en la sección central para la mejor vista del escenario giratorio. Es más impactante que O pero menos conocido — aprovecha eso para conseguir mejores precios.",
    idioma: "Visual (sin barrera de idioma)",
    linkTexto: "Ver disponibilidad",
  },
  {
    name: "Blue Man Group",
    tipo: "Show permanente",
    fecha: "Múltiples funciones por semana",
    venue: "Luxor Hotel and Casino",
    precio: "Desde ~$60",
    descripcion:
      "Tres hombres pintados de azul hacen música, comedia y arte en un show que no se parece a nada que hayas visto antes. No hablan en ningún idioma — todo es percusión, luces y humor visual. Es perfecto para toda la familia incluyendo niños. Vas a salir cubierto de papel y con una sonrisa enorme.",
    tip: "Si quieres la experiencia completa, siéntate en las primeras filas (te dan un poncho de plástico por una razón). Los boletos de último minuto en taquilla suelen ser más baratos.",
    idioma: "Visual (sin barrera de idioma)",
    linkTexto: "Ver disponibilidad",
  },
  {
    name: "Tournament of Kings",
    tipo: "Cena y espectáculo",
    fecha: "Miércoles a lunes, 6pm",
    venue: "Excalibur Hotel and Casino",
    precio: "Desde ~$70 (incluye cena)",
    descripcion:
      "Una cena medieval con torneo de caballeros, caballos reales, y un banquete que comes con las manos (en serio, no hay cubiertos). Es entretenimiento puro — peleas con espadas, fuego, y mucha energía. No necesitas entender inglés porque la acción habla por sí sola. Perfecto para familias con niños que quieren algo diferente.",
    tip: "El precio incluye la cena completa (pollo, papas, sopa) y el show. Es una de las mejores ofertas de entretenimiento en el Strip considerando que incluye comida.",
    idioma: "Visual (mínimo inglés)",
    linkTexto: "Ver disponibilidad",
  },
  {
    name: "No Doubt en The Sphere",
    tipo: "Residencia de temporada",
    fecha: "6 de mayo - 13 de junio, 2026",
    venue: "The Sphere at The Venetian",
    precio: "Desde ~$120",
    descripcion:
      "Gwen Stefani y No Doubt regresan con una residencia exclusiva en The Sphere. Aunque el show es en inglés, la energía de No Doubt trasciende el idioma — éxitos como 'Don't Speak' y 'Just a Girl' son himnos universales. La experiencia inmersiva de The Sphere lleva cualquier concierto a otro nivel.",
    tip: "Las fechas más baratas suelen ser las de entre semana (martes y miércoles). Si puedes ir en mayo antes de que empiece la temporada alta, los precios son mejores.",
    idioma: "Inglés (música universal)",
    linkTexto: "Ver disponibilidad",
  },
];

export default function ShowsEnEspanolGuide() {
  useEffect(() => {
    document.title =
      "Shows y Espectáculos en Español en Las Vegas (2026) — Latino Las Vegas";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "Guía completa de shows en Las Vegas para hispanohablantes. Conciertos latinos, Cirque du Soleil y espectáculos sin barrera de idioma."
      );
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Shows y Espectáculos en Español en Las Vegas (2026)",
    description:
      "Guía de shows y espectáculos para hispanohablantes en Las Vegas — conciertos latinos, Cirque du Soleil, y shows visuales sin barrera de idioma.",
    author: { "@type": "Organization", name: "Latino Las Vegas" },
    publisher: {
      "@type": "Organization",
      name: "Latino Las Vegas",
      url: "https://latinolasvegas.com",
    },
    datePublished: "2026-04-14",
    dateModified: "2026-04-14",
    url: "https://latinolasvegas.com/guia/shows-en-espanol-las-vegas",
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(251,146,60,0.12)_0%,transparent_60%)]" />
        <div className="container relative">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link href="/" className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors">Inicio</Link>
            <span className="text-dark-text-muted text-[12px]">›</span>
            <Link href="/explorar?cat=shows" className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors">Shows</Link>
            <span className="text-dark-text-muted text-[12px]">›</span>
            <span className="text-[12px] text-[#FB923C]">En Español</span>
          </div>
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#FB923C] mb-2.5">
            Guía de espectáculos · 2026
          </div>
          <h1 className="font-display text-[clamp(48px,8vw,96px)] tracking-[4px] leading-[0.9] mb-5 text-dark-text">
            SHOWS EN<br /><span className="text-[#FB923C]">ESPAÑOL</span>
          </h1>
          <p className="text-[19px] text-dark-text-2 max-w-[640px] mx-auto mb-9 leading-relaxed">
            Conciertos latinos, espectáculos de Cirque du Soleil, y shows que
            puedes disfrutar sin hablar inglés. Guía actualizada para 2026.
          </p>
        </div>
      </div>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container max-w-[800px]">
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">
            Una de las preguntas más comunes que recibimos es: "¿Hay shows en
            español en Las Vegas?" La respuesta corta es: sí — y cada vez más.
            Pero la realidad es que la mayoría de los mejores shows en Vegas no
            necesitan idioma. Cirque du Soleil, Blue Man Group, y muchos otros
            son experiencias visuales puras donde la acción, la música y las
            acrobacias hablan por sí solas.
          </p>
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">
            Además, 2026 es un año especial para la comunidad latina en Las
            Vegas: <strong>Carín León hará historia como el primer artista
            latino en tocar en The Sphere</strong>, el venue más avanzado del
            mundo. Eso solo ya vale el viaje.
          </p>
          <p className="text-[17px] text-muted-foreground leading-relaxed">
            Aquí te dejamos nuestra selección de los mejores shows para
            hispanohablantes — desde conciertos en español hasta espectáculos
            visuales que no necesitan traducción.
          </p>
        </div>
      </section>

      {/* Show List */}
      <section className="pb-20 bg-background">
        <div className="container max-w-[900px]">
          <div className="space-y-10">
            {shows.map((s, i) => (
              <article
                key={i}
                className="border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold tracking-[1.5px] uppercase bg-[rgba(251,146,60,0.1)] text-[#FB923C] border border-[rgba(251,146,60,0.25)] rounded-full px-2.5 py-0.5">
                          {s.tipo}
                        </span>
                        <span className="text-[10px] font-bold tracking-[1.5px] uppercase bg-[rgba(96,165,250,0.1)] text-[#60A5FA] border border-[rgba(96,165,250,0.25)] rounded-full px-2.5 py-0.5">
                          {s.idioma}
                        </span>
                      </div>
                      <h2 className="font-condensed text-[28px] font-bold leading-tight">
                        {s.name}
                      </h2>
                    </div>
                    <div className="text-right text-[13px] text-muted-foreground">
                      <div className="font-bold text-foreground">{s.precio}</div>
                      <div>{s.venue}</div>
                    </div>
                  </div>

                  <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-muted-foreground mb-3">
                    {s.fecha}
                  </div>

                  <p className="text-[15px] text-foreground/80 leading-relaxed mb-5">
                    {s.descripcion}
                  </p>

                  <div className="bg-cream-2 rounded-lg p-4 border border-border">
                    <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#FB923C] mb-1">
                      Consejo local
                    </div>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                      {s.tip}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-dark-2 text-center">
        <div className="container max-w-[600px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#FB923C] mb-2.5">
            Más entretenimiento
          </div>
          <h2 className="font-display text-[48px] tracking-[2px] text-dark-text mb-4">
            Explora Más Shows
          </h2>
          <p className="text-dark-text-2 leading-relaxed mb-8">
            Nuestra guía incluye todos los shows y eventos en Las Vegas —
            actualizados cada semana.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/explorar?cat=shows"
              className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-light hover:-translate-y-px transition-all"
            >
              Ver todos los shows →
            </Link>
            <Link
              href="/guia/vida-nocturna-latina-las-vegas"
              className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm border border-[rgba(255,255,255,0.15)] text-dark-text-2 hover:text-dark-text hover:border-[rgba(255,255,255,0.3)] transition-all"
            >
              Vida nocturna latina →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
