type ListingMetaRowProps = {
  rating?: string | null;
  price?: string | null;
  zone?: string | null;
};

export default function ListingMetaRow({ rating, price, zone }: ListingMetaRowProps) {
  return (
    <div className="hidden lg:flex items-center gap-0 text-[12px] mt-auto pt-4">
      {/* Price — left */}
      <div className="flex basis-1/3 shrink-0 grow-0 items-center justify-start">
      {price && (
          <span className="font-bold tracking-[1.5px] text-foreground/65">{price}</span>
        )}
      </div>

      {/* Rating — center */}
      <div className="flex basis-1/3 shrink-0 grow-0 items-center justify-center">
        {rating && (
          <span className="text-[12px] font-semibold tracking-[0.5px] text-foreground/55">
            <span className="text-gold">★</span> {rating}
          </span>
        )}
      </div>

      {/* Zone — right */}
      <div className="flex basis-1/3 shrink-0 grow-0 items-center justify-end">
        {zone && (
          <span className="text-[12px] text-foreground/45">{zone}</span>
        )}
      </div>
    </div>
  );
}
