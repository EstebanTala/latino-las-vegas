"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ListingGalleryProps {
  galleryImages: string[];
  name: string;
  icon?: string;
  onActiveImageChange?: (src: string) => void;
}

export default function ListingGallery({ galleryImages, name, icon, onActiveImageChange }: ListingGalleryProps) {
  const allImages = galleryImages.filter(Boolean);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (onActiveImageChange && allImages[0]) {
      onActiveImageChange(allImages[0]);
    }
  }, [allImages[0], onActiveImageChange]);

  if (allImages.length === 0) {
    return (
      <div className="h-[430px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(232,39,42,0.1)_0%,transparent_70%)]" />
        <div className="relative z-10 text-8xl animate-icon-float drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">{icon}</div>
      </div>
    );
  }

  const getLayout = () => {
    const count = allImages.length;

    if (count === 1) return "single";
    if (count === 2) return "two";
    if (count === 3) return "three";
    if (count === 4) return "four";
    if (count === 5) return "five";
    return "six-plus";
  };

  const layout = getLayout();
  const visibleCount = Math.min(allImages.length, layout === "six-plus" ? 5 : allImages.length);
  const visibleImages = allImages.slice(0, visibleCount);
  const extraCount = allImages.length - visibleCount;

  return (
    <>
      <div className="relative select-none">
        {/* Desktop layout */}
        <div className={`hidden md:grid gap-1.5 rounded-xl overflow-hidden ${getDesktopGridClass(layout)}`}>
          {visibleImages.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden cursor-pointer group ${getDesktopCellClass(layout, i)}`}
              onClick={() => setLightboxIndex(i)}
            >
              <img
                src={img}
                alt={i === 0 ? name : `${name} ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                loading={i === 0 ? undefined : "lazy"}
              />
              {i === visibleCount - 1 && extraCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">+{extraCount} más</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile layout */}
        <div className="md:hidden">
          <div
            className="relative h-[360px] rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setLightboxIndex(0)}
          >
            <img
              src={allImages[0]}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-1.5 mt-1.5">
              {allImages.slice(1, 3).map((img, i) => (
                <div
                  key={i}
                  className="relative flex-1 h-[120px] rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => setLightboxIndex(i + 1)}
                >
                  <img
                    src={img}
                    alt={`${name} ${i + 2}`}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    loading="lazy"
                  />
                  {i === 1 && allImages.length > 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">+{allImages.length - 3} más</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox images={allImages} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onChange={setLightboxIndex} />
      )}
    </>
  );
}

/* ── Layout helpers ── */

function getDesktopGridClass(layout: string): string {
  switch (layout) {
    case "single":
      return "grid-cols-1 h-[480px]";
    case "two":
      return "grid-cols-2 h-[480px]";
    case "three":
      return "grid-cols-[1fr_0.5fr] grid-rows-2 h-[480px]";
    case "four":
      return "grid-cols-[1fr_0.5fr] grid-rows-2 h-[480px]";
    case "five":
      return "grid-cols-2 grid-rows-[1fr_1fr_0.7fr] h-[580px]";
    case "six-plus":
      return "grid-cols-[1fr_0.25fr_0.25fr] grid-rows-2 h-[480px]";
    default:
      return "grid-cols-1 h-[480px]";
  }
}

function getDesktopCellClass(layout: string, index: number): string {
  switch (layout) {
    case "single":
      return "";
    case "two":
      return "";
    case "three":
      return index === 0 ? "row-span-2" : "";
    case "four":
      if (index === 0) return "row-span-2";
      if (index === 1) return "";
      if (index === 2) return "col-start-2 row-start-2";
      return "";
    case "five":
      // 3 rows, 2 cols: img0 spans left col rows 1+2, img1 right row1, img2 right row2, img3+img4 bottom row
      if (index === 0) return "row-span-2";
      // img3 and img4 are auto-placed into row 3
      return "";
    case "six-plus":
      if (index === 0) return "row-span-2";
      return "";
    default:
      return "";
  }
}

/* ── Lightbox ── */

function Lightbox({ images, index, onClose, onChange }: {
  images: string[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const prev = () => onChange(index === 0 ? images.length - 1 : index - 1);
  const next = () => onChange(index === images.length - 1 ? 0 : index + 1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  });

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    setTouchStart(null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-5 right-5 text-white/70 hover:text-white z-10 transition-colors">
        <X className="w-7 h-7" strokeWidth={1.5} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10 transition-colors">
        <ChevronLeft className="w-9 h-9" strokeWidth={1.5} />
      </button>
      <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10 transition-colors">
        <ChevronRight className="w-9 h-9" strokeWidth={1.5} />
      </button>
      <div className="max-w-[92vw] max-h-[88vh]" onClick={(e) => e.stopPropagation()}>
        <img src={images[index]} alt={`Image ${index + 1}`} className="max-w-full max-h-[88vh] object-contain" />
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 text-white/80 text-xs font-semibold px-3.5 py-1.5 rounded-full tracking-wide">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
