import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 md:px-12 h-[52px] bg-[rgba(5,5,5,0.5)] backdrop-blur-lg border-b border-white/[0.08] transition-all">
      <Link href="/" className="font-display text-xl tracking-[2px] flex items-center gap-2">
        <div className="w-7 h-7 bg-red rounded-md flex items-center justify-center text-[11px] text-primary-foreground font-display tracking-[1px] shadow-[0_0_14px_hsl(var(--glow-red))] shrink-0">
          LLV
        </div>
        <span className="text-primary-foreground">Latino<span className="text-red">LV</span></span>
      </Link>

      <div className="hidden md:flex items-center">
        <Link href="/anunciate" className="font-condensed text-xs font-bold tracking-[1px] uppercase px-4 py-1.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.25)] hover:bg-red-light hover:-translate-y-px transition-all">
          Agrega Tu Negocio
        </Link>
      </div>
    </nav>
  );
}
