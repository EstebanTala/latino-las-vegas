"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";

export default function AboutPage() {
  const [formSent, setFormSent] = useState(false);
  const [listingCount, setListingCount] = useState<number | null>(null);
  useEffect(() => {
    fetch("https://sxwmeoujphvnnxggiqzp.supabase.co/rest/v1/listings?select=id", {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        Prefer: "count=exact",
      },
    }).then(res => {
      const range = res.headers.get("content-range");
      if (range) setListingCount(parseInt(range.split("/")[1]));
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setFormSent(true), 800);
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="pt-[140px] pb-20 text-center relative overflow-hidden bg-[linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(232,39,42,0.12)_0%,transparent_60%)]" />
        <div className="container relative">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">Conoce la comunidad</div>
          <h1 className="font-display text-[96px] tracking-[4px] leading-[0.9] mb-5 text-dark-text">SOMOS<br/><span className="text-red">LATINOS LV</span></h1>
          <p className="text-[19px] text-dark-text-2 max-w-[600px] mx-auto mb-9 leading-relaxed">La guía en español más completa para conectar a la comunidad latina con lo mejor que Las Vegas tiene para ofrecer.</p>
          <div className="flex gap-3 justify-center">
            <a href="#contacto" className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm border border-white/20 text-dark-text hover:border-white/40 hover:-translate-y-px transition-all">Contáctanos</a>
            <Link href="/explorar" className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-light hover:-translate-y-px transition-all">Explorar guía →</Link>
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[72px] items-center">
            <div>
              <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">Nuestra misión</div>
              <div className="font-display text-[60px] tracking-[2px] leading-[0.95] mb-5">Por La Comunidad,<br/>Para La Comunidad</div>
              <p className="text-foreground/80 text-base leading-[1.8] mb-5">Latino Las Vegas nació de una necesidad real: los visitantes y residentes latinos en Las Vegas merecen una guía completa, confiable y en su idioma.</p>
              <p className="text-foreground/80 text-base leading-[1.8] mb-5">Somos más que un directorio. Somos un puente entre la comunidad latina y las mejores experiencias que esta ciudad icónica tiene para ofrecer.</p>
              <Link href="/explorar" className="inline-flex font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-gold text-foreground shadow-[0_2px_8px_hsl(var(--gold)/0.3)] hover:bg-gold-light hover:-translate-y-px transition-all mt-2">Explorar la guía →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              {[
                { icon: "📍", num: listingCount ? `${listingCount}+` : "83+", label: "Lugares" },
                { icon: "📖", num: "3", label: "Guías publicadas" },
                { icon: "🇲🇽", num: "100%", label: "En español" },
                { icon: "🔄", num: "↑", label: "Actualización semanal" },
              ].map(c => (
                <div key={c.label} className="bg-card border border-border rounded-lg p-7 text-center shadow-card hover:border-red/25 hover:-translate-y-[3px] hover:shadow-card-hover transition-all">
                  <div className="text-4xl mb-3">{c.icon}</div>
                  <div className="font-display text-5xl text-gold tracking-[1px] leading-none mb-1">{c.num}</div>
                  <div className="text-xs uppercase tracking-[2px] text-muted-foreground">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <div className="h-px bg-border" />
      <div className="py-20 bg-cream-2 border-y border-border">
        <div className="container">
          <SectionHeader eyebrow="La historia detrás del proyecto" title="¿Por Qué Nació Latino LV?" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="bg-card border border-border rounded-lg p-10 shadow-card">
              <div className="text-6xl mb-6">🎰</div>
              <p className="text-foreground/80 text-base leading-[1.9] mb-5">
                Latino Las Vegas nació porque no existía una guía confiable, en español, que ayudara a la comunidad latina a navegar todo lo que esta ciudad ofrece.
              </p>
              <p className="text-foreground/80 text-base leading-[1.9] mb-5">
                Desde encontrar un restaurante con auténtica comida mexicana hasta saber qué shows tienen opciones en español — toda esa información estaba dispersa o simplemente no existía.
              </p>
              <p className="text-foreground/80 text-base leading-[1.9]">
                Este proyecto es un esfuerzo independiente, construido con dedicación para resolver esa necesidad real. Lo construimos para la comunidad latina — con honestidad, sin contenido genérico.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: "🎯", title: "Un solo objetivo", text: "Ser la guía #1 en español de Las Vegas — sin atajos, sin contenido genérico." },
                { icon: "🔨", title: "Proyecto independiente", text: "Sin inversores ni corporaciones. Hecho por y para la comunidad latina." },
                { icon: "📈", title: "En constante crecimiento", text: "Nuevos lugares, reseñas actualizadas y funciones añadidas cada semana." },
              ].map(item => (
                <div key={item.title} className="bg-card border border-border rounded-lg p-6 shadow-card hover:border-red/25 hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl shrink-0">{item.icon}</div>
                    <div>
                      <div className="font-condensed text-lg font-bold mb-1">{item.title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{item.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="h-px bg-border" />
      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeader eyebrow="En qué creemos" title="Nuestros Valores" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "🤝", title: "Comunidad Primero", text: "Todo lo que hacemos está pensado para servir a la comunidad latina de Las Vegas." },
              { icon: "✅", title: "Contenido Verificado", text: "Información verificada y actualizada con fuentes confiables y revisiones periódicas." },
              { icon: "🗣️", title: "Siempre en Español", text: "El español es nuestra lengua de trabajo. Todo escrito por hablantes nativos." },
              { icon: "🔍", title: "Transparencia Total", text: "Nunca aceptamos pagos por reseñas positivas." },
              { icon: "🌎", title: "Diversidad Latina", text: "Mexicanos, cubanos, colombianos, venezolanos y más." },
              { icon: "💡", title: "Innovación Constante", text: "Mejoramos la guía cada semana con nuevos lugares y funciones." },
            ].map(v => (
              <div key={v.title} className="bg-card border border-border rounded-lg p-8 shadow-card hover:border-red/25 hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                <div className="text-4xl mb-4">{v.icon}</div>
                <div className="font-condensed text-[22px] font-bold mb-2.5">{v.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{v.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <div id="contacto" className="py-20 bg-dark border-t border-[hsl(var(--dark-border))]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-[72px] items-start">
            <div>
              <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">Hablemos</div>
              <div className="font-display text-[52px] tracking-[2px] leading-[0.95] text-dark-text mb-4">Contáctanos</div>
              <p className="text-dark-text-2 text-base leading-[1.75] mb-9">¿Quieres agregar tu negocio, reportar información incorrecta o colaborar? Escríbenos.</p>
              <div className="space-y-4">
                {[
                  { icon: "✉️", label: "Email", value: "hola@latinolasvegas.com" },
                  { icon: "📍", label: "Ubicación", value: "Las Vegas, Nevada" },
                  { icon: "⏰", label: "Respuesta", value: "Menos de 24 horas" },
                ].map(c => (
                  <div key={c.label} className="flex items-start gap-4 p-4 bg-[rgba(255,255,255,0.06)] border border-[hsl(var(--dark-border))] rounded-sm hover:border-[hsl(var(--dark-border-2))] transition-colors">
                    <span className="text-[22px] shrink-0">{c.icon}</span>
                    <div>
                      <div className="text-[11px] uppercase tracking-[1.5px] text-dark-text-muted font-bold mb-0.5">{c.label}</div>
                      <div className="text-[15px] text-dark-text-2">{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.06)] border border-[hsl(var(--dark-border))] rounded-xl p-9">
              <div className="font-condensed text-[28px] font-bold text-dark-text mb-7 tracking-[0.5px]">Envíanos un mensaje</div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3.5 mb-4">
                  <div>
                    <label className="block text-xs font-bold tracking-[1.5px] uppercase text-dark-text-muted mb-2">Nombre</label>
                    <input type="text" required placeholder="Tu nombre" className="w-full bg-[rgba(255,255,255,0.07)] border border-[hsl(var(--dark-border))] rounded-sm px-4 py-3 text-dark-text font-body text-[15px] outline-none focus:border-red/45 focus:shadow-[0_0_0_3px_rgba(196,34,41,0.1)] transition-all placeholder:text-dark-text-muted" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-[1.5px] uppercase text-dark-text-muted mb-2">Email</label>
                    <input type="email" required placeholder="tu@email.com" className="w-full bg-[rgba(255,255,255,0.07)] border border-[hsl(var(--dark-border))] rounded-sm px-4 py-3 text-dark-text font-body text-[15px] outline-none focus:border-red/45 focus:shadow-[0_0_0_3px_rgba(196,34,41,0.1)] transition-all placeholder:text-dark-text-muted" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-bold tracking-[1.5px] uppercase text-dark-text-muted mb-2">Asunto</label>
                  <select className="w-full bg-[rgba(255,255,255,0.07)] border border-[hsl(var(--dark-border))] rounded-sm px-4 py-3 text-dark-text font-body text-[15px] outline-none cursor-pointer focus:border-red/45 transition-all">
                    <option>Selecciona un asunto…</option>
                    <option>Agregar mi negocio</option>
                    <option>Información incorrecta</option>
                    <option>Colaboración o patrocinio</option>
                    <option>Sugerencia de lugar</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-bold tracking-[1.5px] uppercase text-dark-text-muted mb-2">Mensaje</label>
                  <textarea required placeholder="Cuéntanos en qué podemos ayudarte…" className="w-full bg-[rgba(255,255,255,0.07)] border border-[hsl(var(--dark-border))] rounded-sm px-4 py-3 text-dark-text font-body text-[15px] outline-none min-h-[120px] resize-y leading-relaxed focus:border-red/45 focus:shadow-[0_0_0_3px_rgba(196,34,41,0.1)] transition-all placeholder:text-dark-text-muted" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-red text-primary-foreground border-none rounded-sm font-condensed text-base font-bold tracking-[1.5px] uppercase cursor-pointer hover:bg-red-light transition-all shadow-[0_2px_8px_hsl(var(--red)/0.35)]">
                  Enviar mensaje →
                </button>
                {formSent && (
                  <div className="text-center p-5 bg-green-500/10 border border-green-500/20 rounded-sm mt-3 text-green-400 font-semibold">
                    ✅ ¡Mensaje enviado! Te responderemos en menos de 24 horas.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeader eyebrow="Preguntas frecuentes" title="FAQ" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: "¿Cómo agrego mi negocio a la guía?", a: "Usa el formulario de contacto y cuéntanos sobre tu lugar." },
              { q: "¿La guía es gratuita?", a: "Sí, completamente gratuita para usuarios." },
              { q: "¿Con qué frecuencia actualizan la info?", a: "Revisamos cada lugar al menos una vez al mes." },
              { q: "¿Solo incluyen lugares en el Strip?", a: "No. Cubrimos toda el área de Las Vegas." },
              { q: "¿Puedo dejar reseñas?", a: "¡Sí! Crea una cuenta gratuita." },
              { q: "¿Aceptan publicidad patrocinada?", a: "Ofrecemos listados destacados, siempre claramente marcados." },
            ].map(f => (
              <div key={f.q} className="bg-card border border-border rounded-lg p-6 shadow-card hover:border-red/20 hover:shadow-card-hover transition-all">
                <div className="font-condensed text-lg font-bold mb-2.5">{f.q}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
