"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { Listing } from "@/data/listings";

interface Props {
  items: Listing[];
}

function usePerPage() {
  const getPerPage = () => {
    if (typeof window === "undefined") return 4;
    const w = window.innerWidth;
    if (w < 768) return 1;
    if (w < 1024) return 2;
    return 4;
  };

  const [perPage, setPerPage] = useState(getPerPage);

  useEffect(() => {
    const handler = () => setPerPage(getPerPage());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return perPage;
}

export default function ResortCategoryCarousel({ items }: Props) {
  const perPage = usePerPage();
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(items.length / perPage);
  const showNav = items.length > perPage;

  const gridClass =
    perPage === 1
      ? "grid grid-cols-1 gap-4"
      : perPage === 2
        ? "grid grid-cols-2 gap-4"
        : "grid grid-cols-2 gap-4";

  const goPrev = () => setPage(p => Math.max(0, p - 1));
  const goNext = () => setPage(p => Math.min(totalPages - 1, p + 1));

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  // All items in DOM for SEO, only current page visible
  const pageItems = useMemo(() => {
    const pages: Listing[][] = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(items.slice(i * perPage, i * perPage + perPage));
    }
    return pages;
  }, [items, perPage, totalPages]);

  // Lock container height to prevent reflow scroll jumps
  const viewportRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number | undefined>(undefined);

  const measureHeight = useCallback(() => {
    if (viewportRef.current) {
      const h = viewportRef.current.scrollHeight;
      setMinHeight(prev => (prev === undefined || h > prev) ? h : prev);
    }
  }, []);

  useEffect(() => {
    measureHeight();
  }, [page, perPage, measureHeight]);

  return (
    <div className="relative">
      <div
        ref={viewportRef}
        style={minHeight ? { minHeight } : undefined}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {pageItems.map((pageGroup, idx) => (
          <div
            key={idx}
            className={idx === page ? gridClass : "hidden"}
            aria-hidden={idx !== page}
            style={idx !== page ? { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" } : undefined}
          >
            {pageGroup.map(l => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ))}
      </div>

      {showNav && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goPrev(); }}
            disabled={page === 0}
            className="p-2 rounded-full border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs text-muted-foreground/60 font-medium tracking-wide tabular-nums">
            {page + 1} / {totalPages}
          </span>

          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goNext(); }}
            disabled={page === totalPages - 1}
            className="p-2 rounded-full border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
