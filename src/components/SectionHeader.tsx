import Link from "next/link";

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllLabel?: string;
}

export default function SectionHeader({ eyebrow, title, subtitle, viewAllLink, viewAllLabel = "Ver todos →" }: Props) {
  return (
    <div className="flex items-end justify-between mb-9">
      <div>
        <div className="text-[11px] font-bold tracking-[3px] uppercase text-red mb-2.5">{eyebrow}</div>
        <div className="font-display text-[52px] tracking-[2px] leading-[0.95]">{title}</div>
        {subtitle && (
          <p className="text-[15px] text-muted-foreground leading-relaxed mt-3 max-w-[720px]">{subtitle}</p>
        )}
      </div>
      {viewAllLink && (
        <Link
          href={viewAllLink}
          className="text-xs font-bold tracking-[1.5px] uppercase text-foreground/60 border-b border-foreground/20 pb-0.5 hover:text-foreground hover:border-foreground/40 transition-all whitespace-nowrap"
        >
          {viewAllLabel}
        </Link>
      )}
    </div>
  );
}
