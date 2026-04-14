"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const restaurants = [
  {
    name: "Tacos El Gordo",
    slug: "tacos-el-gordo",
    zona: "The Strip",
    precio: "$",
    rating: 4.3,
    especialidad: "Tacos al Pastor, Adobada",
    descripcion:
      "Si solo puedes comer en un lugar mexicano en Las Vegas, que sea Tacos El Gordo. Abierto hasta las 3am, este local sobre el Strip sirve tacos al estilo Tijuana que compiten con cualquier taquería en México. La fila los fines de semana es larga — pero se mueve rápido y vale cada minuto. Pide el taco de adobada con todo y no te arrepentirás.",
    tip: "Ve entre semana después de las 10pm para evitar la fila. El de adobada es el rey, pero el de lengua también es increíble.",
    hablanEspanol: true,
  },
  {
    name: "El Dorado Cantina",
    slug: "el-dorado-cantina",
    zona: "The Strip",
    precio: "$$",
    rating: 4.5,
    especialidad: "Comida orgánica mexicana, Margaritas",
    descripcion:
      "El Dorado Cantina es lo que pasa cuando un restaurante mexicano decide usar ingredientes orgánicos sin perder el sabor auténtico. Ubicado a pasos del Strip, es perfecto para una cena más formal sin el precio de los restaurantes dentro de los casinos. Las margaritas son fuertes y bien hechas, y los tacos de birria son de los mejores de la ciudad.",
    tip: "Pide la margarita de tamarindo y los nachos con carne asada como entrada. Hay estacionamiento compartido con Sapphire — gratis.",
    hablanEspanol: true,
  },
  {
    name: "Casa Playa",
    slug: "casa-playa",
    zona: "The Strip (Wynn)",
    precio: "$$$$",
    rating: 4.7,
    especialidad: "Cocina costera mexicana, Mariscos",
    descripcion:
      "Casa Playa en el Wynn es la experiencia mexicana de lujo en Las Vegas. La Chef Sarah Thompson — finalista del James Beard Award 2026 — creó un menú inspirado en la costa de Baja California con mariscos frescos, tortillas hechas a mano y un programa de masa artesanal. El pork belly al pastor y el huachinango entero en tempura son para compartir en familia. No es barato, pero es una experiencia que no vas a olvidar.",
    tip: "Haz reservación con al menos una semana de anticipación. El brunch de fin de semana es más accesible que la cena y igual de bueno.",
    hablanEspanol: true,
  },
  {
    name: "Lindo Michoacán",
    slug: "lindo-michoacan",
    zona: "East Las Vegas",
    precio: "$$",
    rating: 4.4,
    especialidad: "Mariscos, Comida michoacana",
    descripcion:
      "Lindo Michoacán es una institución en Las Vegas. Lleva décadas sirviendo a la comunidad latina y sigue siendo uno de los favoritos para familias. Los mariscos son frescos, las porciones son generosas, y el ambiente te hace sentir como si estuvieras en una fiesta familiar en Michoacán. El cóctel de camarón y el molcajete son imperdibles.",
    tip: "El buffet de domingo es una de las mejores ofertas en la ciudad. Llega temprano porque se llena rápido.",
    hablanEspanol: true,
  },
  {
    name: "Mariscos Playa Escondida",
    slug: "mariscos-playa-escondida",
    zona: "North Las Vegas",
    precio: "$$",
    rating: 4.5,
    especialidad: "Mariscos estilo Sinaloa",
    descripcion:
      "Si extrañas los mariscos de la playa, este es tu lugar. Mariscos Playa Escondida sirve aguachile, ceviches y torres de mariscos que rivalizan con cualquier restaurante costero en México. El ambiente es casual y familiar — no es un lugar para impresionar una cita, pero sí para comer como si estuvieras en Mazatlán.",
    tip: "El aguachile negro es la especialidad de la casa. Pide la torre de mariscos si van tres o más personas.",
    hablanEspanol: true,
  },
  {
    name: "Il Toro E La Capra",
    slug: "il-toro-e-la-capra",
    zona: "Downtown (Fremont)",
    precio: "$$$",
    rating: 4.6,
    especialidad: "Birria gourmet, Tacos creativos",
    descripcion:
      "Una joya escondida en Downtown que fusiona sabores mexicanos con técnicas italianas. La birria aquí no es la típica — está elevada a otro nivel con quesos artesanales y presentaciones que parecen de fine dining. Es el lugar perfecto para alguien que quiere probar algo diferente sin alejarse de los sabores que conoce.",
    tip: "Los tacos de birria con consomé para mojar son obligatorios. El lugar es pequeño así que ve temprano o haz reservación.",
    hablanEspanol: true,
  },
  {
    name: "La Neta Cocina y Lounge",
    slug: "la-neta-cocina",
    zona: "Southeast (Sunset Rd)",
    precio: "$$",
    rating: 4.3,
    especialidad: "Cocina mexicana moderna, Cocktails",
    descripcion:
      "La Neta es para cuando quieres comida mexicana con un toque moderno y un ambiente de lounge. Los platos son creativos pero respetuosos de la tradición, y la carta de cocktails es de las mejores que hemos probado en un restaurante mexicano en Vegas. Buen lugar para una salida con amigos o una cita casual.",
    tip: "Los jueves tienen especiales en cocktails. La cochinita pibil y los esquites son lo mejor del menú.",
    hablanEspanol: true,
  },
  {
    name: "Casa El Desayuno",
    slug: "casa-el-desayuno",
    zona: "Multiple locations",
    precio: "$",
    rating: 4.4,
    especialidad: "Desayuno y brunch mexicano",
    descripcion:
      "El mejor desayuno mexicano de Las Vegas, punto. Chorizo con huevo, chilaquiles, huevos rancheros — todo lo que extrañas de los desayunos en casa de la abuela. El ambiente es vibrante y familiar, y las porciones son enormes por el precio. Si tienes cruda después de una noche en el Strip, este es tu lugar de recuperación.",
    tip: "El plato de fajitas de desayuno es el más popular. Las tortillas son hechas a mano y se nota.",
    hablanEspanol: true,
  },
];

export default function RestaurantesMexicanosGuide() {
  useEffect(() => {
    document.title =
      "Los Mejores Restaurantes Mexicanos en Las Vegas (2026) — Latino Las Vegas";
    const meta = document.querySelector('meta[name="description"]');
    if (meta)
      meta.setAttribute(
        "content",
        "Guía local de los mejores restaurantes mexicanos en Las Vegas. Tacos, mariscos, birria y más — con reseñas honestas, precios y tips de un local."
      );
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Los Mejores Restaurantes Mexicanos en Las Vegas (2026)",
    description:
      "Guía local de los mejores restaurantes mexicanos en Las Vegas con reseñas, precios y recomendaciones.",
    author: { "@type": "Organization", name: "Latino Las Vegas" },
    publisher: {
      "@type": "Organization",
      name: "Latino Las Vegas",
      url: "https://latinolasvegas.com",
    },
    datePublished: "2026-04-14",
    dateModified: "2026-04-14",
    url: "https://latinolasvegas.com/guia/restaurantes-mexicanos-las-vegas",
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(232,39,42,0.12)_0%,transparent_60%)]" />
        <div className="container relative">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link
              href="/"
              className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors"
            >
              Inicio
            </Link>
            <span className="text-dark-text-muted text-[12px]">›</span>
            <Link
              href="/restaurantes"
              className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors"
            >
              Restaurantes
            </Link>
            <span className="text-dark-text-muted text-[12px]">›</span>
            <span className="text-[12px] text-red">Mexicanos</span>
          </div>
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">
            Guía local · Actualizada 2026
          </div>
          <h1 className="font-display text-[clamp(48px,8vw,96px)] tracking-[4px] leading-[0.9] mb-5 text-dark-text">
            RESTAURANTES
            <br />
            <span className="text-red">MEXICANOS</span>
          </h1>
          <p className="text-[19px] text-dark-text-2 max-w-[640px] mx-auto mb-9 leading-relaxed">
            Los mejores restaurantes mexicanos en Las Vegas — desde taquerías
            callejeras hasta alta cocina. Reseñas honestas de un local que
            realmente come aquí.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/explorar?cat=restaurantes"
              className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-light hover:-translate-y-px transition-all"
            >
              Ver todos los restaurantes
            </Link>
            <Link
              href="/explorar?cat=restaurantes&cocina=mexicano"
              className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm border border-[rgba(255,255,255,0.15)] text-dark-text-2 hover:text-dark-text hover:border-[rgba(255,255,255,0.3)] transition-all"
            >
              Filtrar por mexicano →
            </Link>
          </div>
        </div>
      </div>

      {/* Intro */}
      <section className="py-16 bg-background">
        <div className="container max-w-[800px]">
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">
            Las Vegas tiene más de 30 restaurantes mexicanos que valen la pena
            visitar — pero no todos son iguales. Algunos son perfectos para un
            taco rápido después de un show a las 2am. Otros son experiencias de
            cena completa que rivalizan con restaurantes en la Ciudad de México.
          </p>
          <p className="text-[17px] text-muted-foreground leading-relaxed mb-6">
            Esta guía está escrita por alguien que vive en Las Vegas y come en
            estos lugares regularmente — no por alguien que visitó una vez y
            escribió un artículo. Cada restaurante aquí ha sido probado
            personalmente, y las recomendaciones son honestas: si algo no está
            bueno, lo decimos.
          </p>
          <p className="text-[17px] text-muted-foreground leading-relaxed">
            <strong>Todos los restaurantes en esta lista tienen personal que
            habla español.</strong> Ese es uno de los criterios que usamos — porque
            sabemos que para nuestra comunidad, poder pedir en tu idioma es
            parte de la experiencia.
          </p>
        </div>
      </section>

      {/* Restaurant List */}
      <section className="pb-20 bg-background">
        <div className="container max-w-[900px]">
          <div className="space-y-10">
            {restaurants.map((r, i) => (
              <article
                key={r.slug}
                className="border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold tracking-[2px] uppercase text-red">
                          #{i + 1}
                        </span>
                        {r.hablanEspanol && (
                          <span className="text-[10px] font-bold tracking-[1.5px] uppercase bg-[rgba(74,222,128,0.1)] text-[#4ADE80] border border-[rgba(74,222,128,0.25)] rounded-full px-2.5 py-0.5">
                            Hablan español
                          </span>
                        )}
                      </div>
                      <h2 className="font-condensed text-[28px] font-bold leading-tight">
                        {r.name}
                      </h2>
                    </div>
                    <div className="text-right">
                      <div className="text-[15px] font-bold text-gold">
                        ★ {r.rating}
                      </div>
                      <div className="text-[13px] text-muted-foreground">
                        {r.precio} · {r.zona}
                      </div>
                    </div>
                  </div>

                  {/* Especialidad */}
                  <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-muted-foreground mb-3">
                    {r.especialidad}
                  </div>

                  {/* Description */}
                  <p className="text-[15px] text-foreground/80 leading-relaxed mb-5">
                    {r.descripcion}
                  </p>

                  {/* Tip */}
                  <div className="bg-cream-2 rounded-lg p-4 border border-border">
                    <div className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-1">
                      Consejo local
                    </div>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                      {r.tip}
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
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">
            Explora más
          </div>
          <h2 className="font-display text-[48px] tracking-[2px] text-dark-text mb-4">
            ¿Buscas Más Opciones?
          </h2>
          <p className="text-dark-text-2 leading-relaxed mb-8">
            Nuestra guía tiene más de 30 restaurantes en Las Vegas — desde
            comida peruana y colombiana hasta los mejores buffets.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/explorar?cat=restaurantes"
              className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-light hover:-translate-y-px transition-all"
            >
              Ver todos los restaurantes →
            </Link>
            <Link
              href="/hoteles"
              className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm border border-[rgba(255,255,255,0.15)] text-dark-text-2 hover:text-dark-text hover:border-[rgba(255,255,255,0.3)] transition-all"
            >
              Hoteles en Las Vegas
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
