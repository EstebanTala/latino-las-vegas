"use client";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/explorar", label: "Explorar" },
  { href: "/guia", label: "Guías" },
  { href: "/nosotros", label: "Nosotros" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] bg-[rgba(5,5,5,0.5)] backdrop-blur-lg border-b border-white/[0.08] transition-all">
      <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center px-6 md:px-12 h-[68px] gap-4">
        {/* Logo (left) */}
        <Link href="/" className="font-display text-xl tracking-[2px] flex items-center gap-2 justify-self-start">
          <div className="w-7 h-7 bg-red rounded-md flex items-center justify-center text-[11px] text-primary-foreground font-display tracking-[1px] shadow-[0_0_14px_hsl(var(--glow-red))] shrink-0">
            LLV
          </div>
          <span className="text-primary-foreground">Latino<span className="text-red">LV</span></span>
        </Link>

        {/* Desktop nav (center) */}
        <div className="hidden md:flex items-center justify-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-condensed text-[15px] font-bold tracking-[1.5px] uppercase text-dark-text-2 hover:text-dark-text transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA (right) */}
        <Link
          href="/anunciate"
          className="hidden md:inline-block justify-self-end font-condensed text-xs font-bold tracking-[1px] uppercase px-4 py-1.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.25)] hover:bg-red-light hover:-translate-y-px transition-all"
        >
          Agrega Tu Negocio
        </Link>

        {/* Mobile hamburger button */}
        <button
          aria-label={open ? "Cerrar menú" : "Arir menú"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
        >
          <span
            className={`block h-[2px] w-5 bg-dark-text transition-all duration-200 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-dark-text transition-all duration-200 ${
              open ? "opacity-0" : ""
           }`}
          />
          <span
            className={`block h-[2px] w-5 bg-dark-text transition-all duration-200 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.08] bg-[rgba(5,5,5,0.95)] backdrop-blur-lg">
          <div className="flex flex-col px-6 py-5 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-condensed text-[15px] font-bold tracking-[1.5px] uppercase text-dark-text-2 hover:text-dark-text transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/anunciate"
              onClick={() => setOpen(false)}
              className="font-condensed text-sm font-bold tracking-[1px] uppercase px-4 py-2.5 rounded-sm bg-red text-primary-foreground shadow-[0_2px_8px_hsl(var(--red)/0.25)] text-center mt-2"
            >
              Agrega Tu Negocio
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
