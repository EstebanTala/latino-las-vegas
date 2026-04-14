interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

const STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

export default function StarRating({ rating, size = 22, className = "" }: StarRatingProps) {
  const clampedRating = Math.max(0, Math.min(5, rating));

  const stars = Array.from({ length: 5 }, (_, i) => i);
  const clipId = `star-clip-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div
      className={`inline-flex items-center gap-[3px] ${className}`}
      role="img"
      aria-label={`Calificación ${clampedRating.toFixed(1)} de 5`}
    >
      {stars.map(i => {
        // Per-star fill: 0 to 1
        const starFill = Math.max(0, Math.min(1, clampedRating - i));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id={`${clipId}-${i}`}>
                <rect x="0" y="0" width={24 * starFill} height="24" />
              </clipPath>
            </defs>
            {/* Empty star */}
            <path d={STAR_PATH} fill="#E6E6E6" stroke="#E6E6E6" strokeWidth={0.5} />
            {/* Filled portion */}
            {starFill > 0 && (
              <path d={STAR_PATH} fill="#C89B3C" stroke="#C89B3C" strokeWidth={0.5} clipPath={`url(#${clipId}-${i})`} />
            )}
          </svg>
        );
      })}
    </div>
  );
}
