import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Guías de Las Vegas en Español — Latino LV",
  description:
    "Guías curadas en español para visitar Las Vegas: restaurantes mexicanos, los mejores shows del Strip y la mejor vida nocturna latina.",
  openGraph: {
    title: "Guías de Las Vegas en Español — Latino LV",
    description:
      "Guías curadas en español para visitar Las Vegas: restaurantes, shows y vida nocturna latina.",
    url: "https://latinolasvegas.com/guia",
    siteName: "Latino Las Vegas",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guías de Las Vegas en Español — Latino LV",
    description:
      "Guías curadas en español para visitar Las Vegas",
  },
  alternates: {
    canonical: "https://latinolasvegas.com/guia",
  },
};

const guides = [
  {
    href: "/guia/restaurantes-mexicanos-las-vegas",
    eyebrow: "Comida",
    title: "Restaurantes Mexicanos en Las Vegas",
    desc: "Los mejores tacos, mariscos y cocina mexicana auténtica — del Strip a los barrios locales.",
  },
  {
    href: "/guia/mejores-shows-las-vegas",
    eyebrow: "Entretenimiento",
    title: "Los Mejores Shows de Las Vegas",
    desc: "Cirque du Soleil, conciertos en The Sphere y los espectáculos imperdibles del Strip en 2026.",
  },
  {
    href: "/guia/vida-nocturna-latina-las-vegas",
    eyebrow: "Vida Nocturna",
    title: "Vida Nocturna Latina en Las Vegas",
    desc: "Clubs, bares y noches latinas — reggaetón, salsa, bachata y todo lo que mueve el Strip de noche.",
  },
];

export default function GuiasIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Guías de Las Vegas en Español",
    description:
      "Guías curadas en español para visitar Las Vegas: restaurantes, shows y vida nocturna latina.",
    url: "https://latinolasvegas.com/guia",
    publisher: {
      "@type": "Organization",
      name: "Latino Las Vegas",
      url: "https://latinolasvegas.com",
    },
    hasPart: guides.map((g) => ({
      "@type": "Article",
      headline: g.title,
      url: `https://latinolasvegas.com${g.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <div className="pt-[140px] pb-12 text-center relative overflow-hidden bg-[linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,hsl(var(--red)/0.12)_0%,transparent_60%)]" />
        <div className="container relative">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link
              href="/"
              className="text-[12px] text-dark-text-muted hover:text-dark-text transition-colors"
            >
              Inicio
            </Link>
            <span className="text-dark-text-muted text-[12px]">›</span>
            <span className="text-[12px] text-red">Guías</span>
          </div>
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">
            Guías de Las Vegas
          </div>
          <h1 className="font-display text-[clamp(48px,8vw,96px)] tracking-[4px] leading-[0.9] mb-5 text-dark-text">
            GUÍAS<br />
            <span className="text-red">EN ESPAÑOL</span>
          </h1>
          <p className="text-[19px] text-dark-text-2 max-w-[640px] mx-auto leading-relaxed">
            Todo lo que necesitas saber sobre Las Vegas: sin filtros, escrito
            para la comunidad latina. Restaurantes, shows y vida nocturna,
            curados por nosotros.
          </p>
        </div>
      </div>

      {/* Guides grid */}
      <section className="py-20 bg-background">
        <div className="container ma[1100px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {guides.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group block rounded-xl border border-border bg-card shadow-card p-7 hover:border-red/30 hover:shadow-card-hover transition-all"
              >
                <span className="text-[11px] font-bold tracking-[2px] uppercase text-red mb-3 block">
                  {g.eyebrow}
                </span>
                <h2 className="font-condensed text-[24px] font-bold leading-tight group-hover:text-red transition-colors mb-3">
                  {g.title}
                </h2>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-0">
                  {g.desc}
                </p>
               
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-cream-2 border-t border-border">      <div className="container max-w-[640px] text-center">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">
            ¿Buscas algo específico?
          </div>
          <h2 className="font-display text-[clamp(28px,5vw,42px)] tracking-[2px] mb-4">
            EXPLORA TODOS LOS LUGARES
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Más de 85 negocios, restaurantes, hoteles y experiencias en Las
            Vegas — todos con información verificada.
          </p>
          <Link
            href="/explorar"
            className="inline-block font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 pyounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.25)] hover:bg-red-light hover:-translate-y-px transition-all"
          >
            Ir al explorador →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
