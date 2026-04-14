"use client";
import { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { X } from "lucide-react";

export interface GalleryVideoHandle {
  pause: () => void;
}

interface GalleryVideoPlayerProps {
  videoUrl: string;
  poster?: string;
  name: string;
  className?: string;
  /** When false, video is force-paused and returns to thumbnail */
  active?: boolean;
  /** When true, YouTube videos play inline instead of opening a modal */
  inline?: boolean;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

const GalleryVideoPlayer = forwardRef<GalleryVideoHandle, GalleryVideoPlayerProps>(
  function GalleryVideoPlayer({ videoUrl, poster, name, className = "", active = true, inline = false }, ref) {
    const youtubeId = extractYouTubeId(videoUrl);
    const isYouTube = !!youtubeId;

    const [playing, setPlaying] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Expose pause to parent via ref
    useImperativeHandle(ref, () => ({
      pause: () => {
        setPlaying(false);
        setModalOpen(false);
        videoRef.current?.pause();
      },
    }));

    // Force-pause when active becomes false
    useEffect(() => {
      if (!active && (playing || modalOpen)) {
        setPlaying(false);
        setModalOpen(false);
        videoRef.current?.pause();
      }
    }, [active, playing, modalOpen]);

    // Lock body scroll when modal is open
    useEffect(() => {
      if (modalOpen) {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
      }
    }, [modalOpen]);

    // Escape key closes modal
    useEffect(() => {
      if (!modalOpen) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") setModalOpen(false);
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, [modalOpen]);

    // Intersection observer — pause when off-screen
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => setVisible(entry.isIntersecting),
        { threshold: 0.4 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    // Pause native video when scrolled away
    useEffect(() => {
      if (!playing || isYouTube) return;
      const vid = videoRef.current;
      if (!vid) return;
      if (!visible) {
        vid.pause();
      } else {
        vid.play().catch(() => {});
      }
    }, [visible, playing, isYouTube]);

    const handlePlay = useCallback(() => {
      if (!active) return;
      if (isYouTube) {
        if (inline) {
          setPlaying(true);
        } else {
          setModalOpen(true);
        }
      } else {
        setPlaying(true);
        requestAnimationFrame(() => {
          const vid = videoRef.current;
          if (vid) {
            vid.muted = true;
            vid.play().catch(() => {});
          }
        });
      }
    }, [isYouTube, active, inline]);

    const thumbnailSrc = isYouTube
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : poster;

    return (
      <>
        <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
          {!playing ? (
            <div
              className="relative w-full h-full cursor-pointer group"
              onClick={handlePlay}
            >
              {thumbnailSrc ? (
                <img
                  src={thumbnailSrc}
                  alt={`${name} - Video`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Video</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-6 h-6 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-sm">
                Video
              </div>
            </div>
          ) : (
            /* Inline playback — YouTube iframe or native video */
            isYouTube && inline ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&controls=1&iv_load_policy=3`}
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title={`${name} - Video`}
              />
            ) : (
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                controls
                preload="none"
              />
            )
          )}
        </div>

        {/* YouTube video modal lightbox */}
        {modalOpen && isYouTube && (
          <div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setModalOpen(false)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setModalOpen(false); }}
              className="absolute top-5 right-5 text-white/70 hover:text-white z-10 transition-colors"
            >
              <X className="w-7 h-7" strokeWidth={1.5} />
            </button>
            <div
              className="w-[92vw] max-w-[1100px] aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1&showinfo=0&controls=1&iv_load_policy=3`}
                className="w-full h-full rounded-xl"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title={`${name} - Video`}
              />
            </div>
          </div>
        )}
      </>
    );
  }
);

export default GalleryVideoPlayer;
