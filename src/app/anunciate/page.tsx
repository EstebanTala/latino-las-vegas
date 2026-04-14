"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdsPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="pt-[100px] pb-[60px] text-center relative overflow-hidden bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(232,39,42,0.1)_0%,transparent_70%)]">
        <div className="container">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">Para negocios</div>
          <h1 className="font-display text-[clamp(52px,8vw,96px)] tracking-[3px] leading-[0.9] mb-4">
            LLEGA A LA<br/><span className="text-red">COMUNIDAD LATINA</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-[540px] mx-auto mb-10 leading-relaxed">Latino Las Vegas es la guía de referencia en español para visitantes y residentes latinos en Las Vegas.</p>

          <div className="flex gap-0 justify-center mb-14 border border-border rounded-xl overflow-hidden max-w-[600px] mx-auto bg-card">
            {[
              { num: "50+", label: "Lugares listados" },
              { num: "100%", label: "En español" },
              { num: "LV", label: "Mercado local" },
            ].map((s, i) => (
              <div key={s.label} className={`flex-1 py-7 px-5 text-center ${i < 2 ? 'border-r border-border' : ''}`}>
                <div className="font-display text-[42px] text-red tracking-[1px] leading-none">{s.num}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-[1.5px] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="container">
        <div className="text-center mb-4">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">Opciones de visibilidad</div>
          <div className="font-display text-[52px] tracking-[2px] leading-[0.95]">Elige Tu Plan</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-14">
          {[
            {
              icon: "📋", name: "Listado Básico", price: "Gratis", period: "/siempre", featured: false,
              desc: "Aparece en nuestro directorio con información esencial.",
              features: ["Nombre y categoría", "Dirección y teléfono", "Horarios de apertura", "Descripción básica", "Hasta 2 imágenes", "Link a Google Maps", "Aparece en resultados de búsqueda"],
              btnLabel: "Solicitar listado", btnStyle: "secondary" as const,
            },
            {
              icon: "⭐", name: "Listado Destacado", price: "$79", period: "/mes", featured: true, badge: "Más Popular",
              desc: "Destaca sobre la competencia con posición prioritaria y galería completa.",
              features: ["Todo lo del plan básico", "Badge 'Destacado' visible", "Posición prioritaria en categoría", "Galería de hasta 6 fotos", "Links a redes sociales", "Descripción extendida", "Sección Happy Hour"],
              btnLabel: "Empezar ahora", btnStyle: "primary" as const,
            },
            {
              icon: "🏆", name: "Seleccionado", price: "$199", period: "/mes", featured: false,
              desc: "Máxima visibilidad. Tu negocio en la página de inicio y primero en búsquedas.",
              features: ["Todo lo del plan destacado", "Aparición en página de inicio", "Primera posición en categorías", "Primera posición en búsquedas", "Etiqueta 'Seleccionado' elegante", "Diseño de tarjeta elevado", "Reporte mensual de rendimiento", "Soporte prioritario"],
              btnLabel: "Contactar", btnStyle: "secondary" as const,
            },
          ].map(plan => (
            <div key={plan.name} className={`relative bg-card border rounded-xl p-9 transition-all hover:border-red/40 hover:-translate-y-[3px] ${plan.featured ? 'border-red bg-[linear-gradient(135deg,rgba(232,39,42,0.06)_0%,hsl(var(--card))_100%)]' : 'border-border'}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red text-primary-foreground text-[11px] font-bold tracking-[1.5px] uppercase px-3.5 py-1 rounded-full whitespace-nowrap">{plan.badge}</div>
              )}
              <div className="text-[32px] mb-4">{plan.icon}</div>
              <div className="font-condensed text-[22px] font-bold tracking-[0.5px] mb-1.5">{plan.name}</div>
              <div className="font-display text-5xl text-red leading-none mb-1">{plan.price}<span className="text-lg text-muted-foreground font-body font-normal">{plan.period}</span></div>
              <div className="text-[13px] text-muted-foreground mb-6 leading-relaxed">{plan.desc}</div>
              <ul className="space-y-0 mb-7">
                {plan.features.map(f => (
                  <li key={f} className="text-[13px] text-muted-foreground py-[7px] border-b border-border last:border-b-0 flex items-center gap-2">
                    <span className="text-red font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/nosotros#contacto"
                className={`block w-full text-center font-condensed text-sm font-bold tracking-[1px] uppercase px-5 py-3 rounded-sm transition-all ${
                  plan.btnStyle === 'primary'
                    ? 'bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-light'
                    : 'bg-card text-foreground border border-border-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:border-foreground/20'
                }`}
              >
                {plan.btnLabel}
              </Link>
            </div>
          ))}
        </div>

        {/* Why */}
        <div className="text-center mt-14 mb-4">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">Por qué elegirnos</div>
          <div className="font-display text-[52px] tracking-[2px] leading-[0.95]">Tu Negocio, Su Idioma</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          {[
            { icon: "🎯", title: "Audiencia Específica", text: "Llegamos directamente a visitantes y residentes latinos." },
            { icon: "✅", title: "Contenido Verificado", text: "Todos los listados son revisados por nuestro equipo." },
            { icon: "📈", title: "Sin Contratos Largos", text: "Paga mes a mes, cancela cuando quieras." },
          ].map(w => (
            <div key={w.title} className="bg-card border border-border rounded-lg p-7 text-center">
              <div className="text-[28px] mb-3">{w.icon}</div>
              <div className="font-condensed text-lg font-bold mb-2">{w.title}</div>
              <div className="text-[13px] text-muted-foreground leading-relaxed">{w.text}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-card border border-border rounded-xl p-12 text-center my-10">
          <h3 className="font-display text-[42px] tracking-[2px] mb-3">¿LISTO PARA EMPEZAR?</h3>
          <p className="text-muted-foreground text-[15px] mb-7 max-w-[440px] mx-auto">Escríbenos y te tenemos en el directorio en menos de 48 horas.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="mailto:hola@latinolasvegas.com" className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-light transition-all">✉️ Escribir ahora</a>
            <Link href="/nosotros#contacto" className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-card text-foreground border border-border-2 shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:border-foreground/20 transition-all">Ver contacto</Link>
          </div>
          <p className="text-xs text-muted-foreground mt-5">Respondemos en menos de 24 horas · Lunes a Viernes</p>
        </div>
      </div>

      <Footer />
    </>
  );
}
