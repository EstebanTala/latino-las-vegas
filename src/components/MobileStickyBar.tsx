"use client";
import { useEffect, useState } from "react";

interface MobileStickyBarProps {
  address?: string | null;
  googleMapsUrl?: string | null;
  reservationUrl?: string | null;
  isPaidTier: boolean;
}

export default function MobileStickyBar({ address, googleMapsUrl, reservationUrl, isPaidTier }: MobileStickyBarProps) {
  const mapsUrl = googleMapsUrl || (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : null);
  const showReservar = isPaidTier && !!reservationUrl;

  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsCompact(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const btnBase =
    "flex-1 min-w-0 flex items-center justify-center rounded-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-150 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden rounded-t-2xl backdrop-blur-xl transition-all duration-200 ease-out"
      style={{
        background: "rgba(8,8,8,0.72)",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: isCompact ? 7 : 9,
        paddingBottom: isCompact
          ? "calc(7px + env(safe-area-inset-bottom, 0px))"
          : "calc(9px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="flex w-full gap-3">
        {/* Secondary — Cómo llegar */}
        <a
          href={mapsUrl || "#"}
          target="_blank"
          rel="noreferrer"
          className={`${btnBase} active:brightness-90 ${isCompact ? "h-[38px] text-[12.5px]" : "h-[42px] text-[13px]"}`}
          style={{
            color: "rgba(255,255,255,0.88)",
            background: "rgba(255,255,255,0.09)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.25)",
          }}
        >
          Cómo llegar
        </a>

        {/* Primary CTA — Reservar mesa */}
        {showReservar && (
          <a
            href={reservationUrl!}
            target="_blank"
            rel="noreferrer"
            className={`${btnBase} active:brightness-90 ${isCompact ? "h-[38px] text-[12.5px]" : "h-[42px] text-[13px]"}`}
            style={{
              color: "rgba(28,18,6,0.95)",
              background: "linear-gradient(180deg, #D4AF37 0%, #B8962E 100%)",
              border: "1px solid rgba(160,120,30,0.35)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.22), 0 1px 4px rgba(180,130,30,0.18)",
            }}
          >
            Reservar mesa
          </a>
        )}
      </div>
    </div>
  );
}
