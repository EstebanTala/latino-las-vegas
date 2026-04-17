"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AnunciatePage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const nombreRef = useRef<HTMLInputElement>(null);
  const negocioRef = useRef<HTMLInputElement>(null);
  const categoriaRef = useRef<HTMLSelectElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telefonoRef = useRef<HTMLInputElement>(null);
  const mensajeRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nombreRef.current?.value,
        email: emailRef.current?.value,
        asunto: `Nuevo negocio: ${negocioRef.current?.value} (${categoriaRef.current?.value})`,
        mensaje: `Teléfono: ${telefonoRef.current?.value}\n\n${mensajeRef.current?.value}`,
      }),
    });
    setLoading(false);
    if (res.ok) setSent(true);
    else setError(true);
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="pt-[140px] pb-20 text-center relative overflow-hidden bg-[linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(232,39,42,0.12)_0%,transparent_60%)]" />
        <div className="container relative max-w-[700px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-4">Para negocios</div>
          <h1 className="font-display text-[clamp(42px,7vw,80px)] tracking-[3px] leading-[0.95] mb-5 text-dark-text">
            LLEGA A LA<br /><span className="text-red">COMUNIDAD LATINA</span>
          </h1>
          <p className="text-[18px] text-dark-text-2 max-w-[560px] mx-auto leading-relaxed">
            {`Latino Las Vegas es la guía en español para visitantes y residentes latinos en Las Vegas. Agrega tu negocio gratis.`}
          </p>
        </div>
      </div>

      {/* Why list */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container max-w-[900px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5 text-center">Por qué estar aquí</div>
          <h2 className="font-display text-[clamp(28px,5vw,42px)] tracking-[2px] text-center mb-10">TU NEGOCIO, SU IDIOMA</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Audiencia específica",
                text: "Conectamos directamente con visitantes y residentes latinos que buscan negocios como el tuyo.",
              },
              {
                icon: "🗣️",
                title: "En español",
                text: "Toda nuestra guía está en español. Tu negocio llega a quien realmente lo necesita.",
              },
              {
                icon: "📍",
                title: "100% local",
                text: "No somos una plataforma nacional. Somos una guía hecha específicamente para Las Vegas.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-xl p-7 shadow-card hover:border-red/25 hover:-translate-y-[3px] hover:shadow-card-hover transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="font-condensed text-[20px] font-bold mb-2">{item.title}</div>
                <div className="text-[14px] text-muted-foreground leading-relaxed">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-16 bg-cream-2 border-b border-border">
        <div className="container max-w-[900px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5 text-center">Listado gratuito</div>
          <h2 className="font-display text-[clamp(28px,5vw,42px)] tracking-[2px] text-center mb-3">\u00bfQU\u00c9 INCLUYE?</h2>
          <p className="text-center text-muted-foreground text-[15px] mb-10">Tu listado básico es completamente gratis, siempre.</p>
          <div className="grid md:grid-cols-2 gap-4 max-w-[700px] mx-auto">
            {[
              "Nombre, categoría y descripción",
              "Dirección, teléfono y horarios",
              "Hasta 2 fotos del negocio",
              "Link a Google Maps",
              "Aparece en búsquedas y filtros",
              "Link a tu sitio web o redes sociales",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-background border border-border rounded-lg px-5 py-4">
                <span className="text-red font-bold text-[18px]">✓</span>
                <span className="text-[15px] text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="inline-block bg-card border border-border rounded-xl px-8 py-5 text-center shadow-card">
              <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-1">Próximamente</div>
              <div className="font-condensed text-[18px] font-bold mb-1">Listados Destacados</div>
              <div className="text-[13px] text-muted-foreground">Mayor visibilidad, posición prioritaria y más fotos. En desarrollo.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-background">
        <div className="container max-w-[700px]">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5 text-center">Empieza hoy</div>
          <h2 className="font-display text-[clamp(28px,5vw,42px)] tracking-[2px] text-center mb-3">AGREGA TU NEGOCIO</h2>
          <p className="text-center text-muted-foreground text-[15px] mb-10">{"Te tenemos en el directorio en menos de 48 horas. Sin costo, sin contratos."}</p>

          {sent ? (
            <div className="text-center p-10 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="text-4xl mb-4">✅</div>
              <div className="font-condensed text-[24px] font-bold mb-2">{"u00a1Recibido!"}</div>
              <div className="text-muted-foreground text-[15px]">{"Te contactaremos en menos de 48 horas para agregar tu negocio al directorio."}</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 shadow-card space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold tracking-[1.5px] uppercase text-muted-foreground mb-2">Tu nombre</label>
                  <input ref={nombreRef} type="text" required placeholder="Tu nombre completo" className="w-full bg-background border border-border rounded-sm px-4 py-3 text-[15px] outline-none focus:border-red/45 focus:shadow-[0_0_0_3px_rgba(196,34,41,0.1)] transition-all placeholder:text-muted-foreground/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[1.5px] uppercase text-muted-foreground mb-2">Nombre del negocio</label>
                  <input ref={negocioRef} type="text" required placeholder="Nombre de tu negocio" className="w-full bg-background border border-border rounded-sm px-4 py-3 text-[15px] outline-none focus:border-red/45 focus:shadow-[0_0_0_3px_rgba(196,34,41,0.1)] transition-all placeholder:text-muted-foreground/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-[1.5px] uppercase text-muted-foreground mb-2">Categoría</label>
                <select ref={categoriaRef} required className="w-full bg-background border border-border rounded-sm px-4 py-3 text-[15px] outline-none focus:border-red/45 transition-all cursor-pointer">
                  <option value="">Selecciona una categoría...</option>
                  <option>Restaurante</option>
                  <option>Bar / Nightclub</option>
                  <option>Hotel / Casino</option>
                  <option>Show / Entretenimiento</option>
                  <option>Servicios profesionales</option>
                  <option>Tienda / Retail</option>
                  <option>Belleza / Spa</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold tracking-[1.5px] uppercase text-muted-foreground mb-2">Email</label>
                  <input ref={emailRef} type="email" required placeholder="tu@email.com" className="w-full bg-background border border-border rounded-sm px-4 py-3 text-[15px] outline-none focus:border-red/45 focus:shadow-[0_0_0_3px_rgba(196,34,41,0.1)] transition-all placeholder:text-muted-foreground/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[1.5px] uppercase text-muted-foreground mb-2">Teléfono (opcional)</label>
                  <input ref={telefonoRef} type="tel" placeholder="(702) 000-0000" className="w-full bg-background border border-border rounded-sm px-4 py-3 text-[15px] outline-none focus:border-red/45 focus:shadow-[0_0_0_3px_rgba(196,34,41,0.1)] transition-all placeholder:text-muted-foreground/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-[1.5px] uppercase text-muted-foreground mb-2">Algo más que debamos saber (opcional)</label>
                <textarea ref={mensajeRef} placeholder="Dirección, horarios, sitio web, redes sociales..." className="w-full bg-background border border-border rounded-sm px-4 py-3 text-[15px] outline-none min-h-[100px] resize-y leading-relaxed focus:border-red/45 focus:shadow-[0_0_0_3px_rgba(196,34,41,0.1)] transition-all placeholder:text-muted-foreground/50" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-red text-primary-foreground border-none rounded-sm font-condensed text-[16px] font-bold tracking-[1.5px] uppercase cursor-pointer hover:bg-red-light transition-all shadow-[0_2px_8px_hsl(var(--red)/0.35)] disabled:opacity-60">
                {loading ? "Enviando..." : "Agregar mi negocio →"}
              </button>
              {error && (
                <div className="text-center p-4 bg-red/10 border border-red/20 rounded-sm text-red text-[14px] font-semibold">
                  {"❌ Hubo un error. Inténtalo de nuevo o escríbenos a hola@latinolasvegas.com"}
                </div>
              )}
              <p className="text-center text-[12px] text-muted-foreground">{"Sin costo · Sin contratos · Respondemos en menos de 48 horas"}</p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
