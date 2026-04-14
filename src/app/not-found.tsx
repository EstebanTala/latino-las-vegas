"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display text-[80px] tracking-[3px] mb-2">404</h1>
        <p className="text-muted-foreground text-lg mb-6">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-flex font-condensed text-sm font-bold tracking-[1px] uppercase px-7 py-3.5 rounded-sm bg-red text-primary-foreground hover:bg-red-light transition-all"
        >
          Volver al inicio
        </Link>
      </div>
      <Footer />
    </>
  );
}
