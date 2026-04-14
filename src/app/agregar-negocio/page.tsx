"use client";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CATEGORIES = [
  { value: "restaurantes", label: "Restaurante" },
  { value: "hoteles", label: "Hotel / Casino" },
  { value: "shows", label: "Show / Evento" },
  { value: "nocturna", label: "Vida Nocturna" },
  { value: "atracciones", label: "Atracción / Tour" },
  { value: "otro", label: "Otro" },
];

interface FormData {
  business_name: string;
  category: string;
  address: string;
  phone: string;
  website: string;
  instagram: string;
  contact_name: string;
  contact_email: string;
  notes: string;
}

const initial: FormData = {
  business_name: "",
  category: "",
  address: "",
  phone: "",
  website: "",
  instagram: "",
  contact_name: "",
  contact_email: "",
  notes: "",
};

export default function AgregarNegocioPage() {
  const [form, setForm] = useState<FormData>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error: err } = await supabase.from("business_submissions").insert({
      business_name: form.business_name.trim(),
      category: form.category,
      address: form.address.trim() || null,
      phone: form.phone.trim() || null,
      website: form.website.trim() || null,
      instagram: form.instagram.trim() || null,
      contact_name: form.contact_name.trim(),
      contact_email: form.contact_email.trim(),
      notes: form.notes.trim() || null,
    });

    setSubmitting(false);
    if (err) {
      setError("Hubo un error. Intenta de nuevo.");
      return;
    }
    setSuccess(true);
    setForm(initial);
  };

  const inputClass =
    "w-full bg-[rgba(255,255,255,0.07)] border border-[hsl(var(--dark-border))] rounded-sm px-4 py-3 text-dark-text font-body text-[15px] outline-none focus:border-red/45 focus:shadow-[0_0_0_3px_rgba(196,34,41,0.1)] transition-all placeholder:text-dark-text-muted";

  const labelClass = "block text-xs font-bold tracking-[1.5px] uppercase text-dark-text-muted mb-2";

  return (
    <>
      <Navbar />

      <div className="pt-[140px] pb-20 relative overflow-hidden bg-[linear-gradient(180deg,hsl(var(--dark))_0%,hsl(var(--dark-2))_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_80%,rgba(232,39,42,0.12)_0%,transparent_60%)]" />
        <div className="container relative max-w-[720px]">
          <div className="text-center mb-12">
            <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">Crece con nosotros</div>
            <h1 className="font-display text-[64px] md:text-[80px] tracking-[4px] leading-[0.9] mb-5 text-dark-text">
              AGREGA TU<br /><span className="text-red">NEGOCIO</span>
            </h1>
            <p className="text-[17px] text-dark-text-muted max-w-[500px] mx-auto leading-relaxed">
              Completa el formulario y nuestro equipo revisará tu negocio. Si cumple nuestros estándares, aparecerá en la guía.
            </p>
          </div>

          {success ? (
            <div className="bg-green-500/10 border border-green-500/25 rounded-xl p-10 text-center">
              <div className="text-5xl mb-4">✅</div>
              <div className="font-display text-[36px] tracking-[2px] text-dark-text mb-3">¡Solicitud Enviada!</div>
              <p className="text-dark-text-muted text-base leading-relaxed max-w-[400px] mx-auto mb-6">
                Revisaremos tu negocio y te contactaremos por email en las próximas 48 horas.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="font-condensed text-[15px] font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.3)] hover:bg-red-light hover:-translate-y-px transition-all"
              >
                Enviar otro negocio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[rgba(255,255,255,0.06)] border border-[hsl(var(--dark-border))] rounded-xl p-8 md:p-10 space-y-5">
              <div className="font-condensed text-[28px] font-bold text-dark-text tracking-[0.5px] mb-2">Información del negocio</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nombre del negocio *</label>
                  <input type="text" required value={form.business_name} onChange={set("business_name")} placeholder="Ej: Tacos El Gordo" className={inputClass} maxLength={200} />
                </div>
                <div>
                  <label className={labelClass}>Categoría *</label>
                  <select required value={form.category} onChange={set("category")} className={`${inputClass} cursor-pointer`}>
                    <option value="">Selecciona una categoría…</option>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Dirección</label>
                <input type="text" value={form.address} onChange={set("address")} placeholder="Ej: 3049 Las Vegas Blvd S" className={inputClass} maxLength={300} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input type="tel" value={form.phone} onChange={set("phone")} placeholder="(702) 555-0000" className={inputClass} maxLength={30} />
                </div>
                <div>
                  <label className={labelClass}>Sitio web</label>
                  <input type="url" value={form.website} onChange={set("website")} placeholder="https://..." className={inputClass} maxLength={500} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Instagram</label>
                <input type="text" value={form.instagram} onChange={set("instagram")} placeholder="@tunegocio" className={inputClass} maxLength={100} />
              </div>

              <div className="h-px bg-[hsl(var(--dark-border))] my-2" />
              <div className="font-condensed text-[22px] font-bold text-dark-text tracking-[0.5px]">Tu información de contacto</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Tu nombre *</label>
                  <input type="text" required value={form.contact_name} onChange={set("contact_name")} placeholder="Nombre completo" className={inputClass} maxLength={100} />
                </div>
                <div>
                  <label className={labelClass}>Tu email *</label>
                  <input type="email" required value={form.contact_email} onChange={set("contact_email")} placeholder="tu@email.com" className={inputClass} maxLength={255} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Notas adicionales</label>
                <textarea value={form.notes} onChange={set("notes")} placeholder="Horarios, especialidades, lo que quieras que sepamos…" className={`${inputClass} min-h-[120px] resize-y leading-relaxed`} maxLength={2000} />
              </div>

              {error && (
                <div className="text-center p-4 bg-red/10 border border-red/25 rounded-sm text-red font-semibold text-sm">
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-red text-primary-foreground border-none rounded-sm font-condensed text-base font-bold tracking-[1.5px] uppercase cursor-pointer hover:bg-red-light transition-all shadow-[0_2px_8px_hsl(var(--red)/0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Enviando…" : "Enviar solicitud →"}
              </button>

              <p className="text-xs text-dark-text-muted text-center leading-relaxed">
                Al enviar, aceptas que revisemos la información. Solo publicamos negocios que cumplen nuestros estándares de calidad.
              </p>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
