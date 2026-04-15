import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-[hsl(var(--dark-border))] pt-14 pb-7">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-14 mb-12">
          <div>
            <Link href="/" className="font-display text-2xl tracking-[2px] flex items-center gap-2.5 text-dark-text">
              <div className="w-9 h-9 bg-red rounded-lg flex items-center justify-center text-[15px] text-primary-foreground font-display tracking-[1px] shadow-[0_0_20px_hsl(var(--glow-red))]">LLV</div>
              Latino<span className="text-red">LV</span>
            </Link>
            <p className="text-sm text-dark-text-muted leading-[1.75] max-w-[280px] mt-4">Tu guía en español para descubrir lo mejor de Las Vegas — hoteles, restaurantes, shows y vida nocturna.</p>
          </div>
          <div>
            <h4 className="font-condensed text-xs font-bold tracking-[2.5px] uppercase text-dark-text-muted mb-4">Explorar</h4>
            <ul className="space-y-3">
              <li><Link href="/explorar?cat=hoteles" className="text-sm font-normal text-dark-text-muted/70 hover:text-dark-text transition-colors">Hoteles & Casinos</Link></li>
              <li><Link href="/explorar?cat=restaurantes" className="text-sm font-normal text-dark-text-muted/70 hover:text-dark-text transition-colors">Restaurantes</Link></li>
              <li><Link href="/explorar?cat=shows" className="text-sm font-normal text-dark-text-muted/70 hover:text-dark-text transition-colors">Shows & Eventos</Link></li>
              <li><Link href="/explorar?cat=nocturna" className="text-sm font-normal text-dark-text-muted/70 hover:text-dark-text transition-colors">Vida Nocturna</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-condensed text-xs font-bold tracking-[2.5px] uppercase text-dark-text-muted mb-4">Guías</h4>
            <ul className="space-y-3">
              <li><Link href="/guia/restaurantes-mexicanos-las-vegas" className="text-sm font-normal text-dark-text-muted/70 hover:text-dark-text transition-colors">Restaurantes Mexicanos</Link></li>
              <li><Link href="/guia/mejores-shows-las-vegas" className="text-sm font-normal text-dark-text-muted/70 hover:text-dark-text transition-colors">Mejores Shows</Link></li>
              <li><Link href="/guia/vida-nocturna-latina-las-vegas" className="text-sm font-normal text-dark-text-muted/70 hover:text-dark-text transition-colors">Vida Nocturna Latina</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-condensed text-xs font-bold tracking-[2.5px] uppercase text-dark-text-muted mb-4">Sitio</h4>
            <ul className="space-y-3">
              <li><Link href="/nosotros" className="text-sm font-normal text-dark-text-muted/70 hover:text-dark-text transition-colors">Nosotros</Link></li>
              <li><Link href="/nosotros#contacto" className="text-sm font-normal text-dark-text-muted/70 hover:text-dark-text transition-colors">Contacto</Link></li>
              <li><Link href="/anunciate" className="text-sm font-normal text-dark-text-muted/70 hover:text-dark-text transition-colors">Anúnciate</Link></li>
              <li><Link href="/agregar-negocio" className="text-sm font-normal text-dark-text-muted/70 hover:text-dark-text transition-colors">Agregar Negocio</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-condensed text-xs font-bold tracking-[2.5px] uppercase text-dark-text-muted mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><span className="text-sm font-normal text-dark-text-muted/70">Privacidad</span></li>
              <li><span className="text-sm font-normal text-dark-text-muted/70">Términos de uso</span></li>
              <li><span className="text-sm font-normal text-dark-text-muted/70">Cookies</span></li>
            </ul>
          </div>
        </div>

        <div className="bg-red/[0.12] border border-red/25 rounded-lg p-5 mb-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <strong className="text-sm text-dark-text block mb-0.5">¿Tienes un negocio en Las Vegas?</strong>
            <span className="text-xs text-dark-text-muted">Aparece en nuestra guía y llega a la comunidad latina.</span>
          </div>
          <Link href="/anunciate" className="bg-red text-primary-foreground border-none rounded-md px-4 py-2 text-xs font-bold tracking-[0.5px] hover:opacity-85 transition-opacity whitespace-nowrap">
            Anúnciate con nosotros →
          </Link>
        </div>

        <div className="pt-6 border-t border-[hsl(var(--dark-border))] flex justify-between items-center text-[13px] text-dark-text-muted">
          <span>© 2025 Latino Las Vegas · Guía en español de Las Vegas</span>
          <div className="flex gap-2.5">
            {['📘', '📸', '🎵', '▶️'].map((icon, i) => (
              <div key={i} className="w-[34px] h-[34px] rounded-lg bg-[rgba(255,255,255,0.05)] border border-[hsl(var(--dark-border))] flex items-center justify-center text-[15px] hover:bg-[rgba(255,255,255,0.1)] transition-all cursor-pointer">
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
