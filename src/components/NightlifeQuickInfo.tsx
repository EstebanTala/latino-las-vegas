import { Music, Ticket, Shirt, Clock } from "lucide-react";
import { formatStructuredHours, type FormattedHours } from "@/lib/formatHours";
import type { Listing } from "@/data/listings";

interface Props {
  listing: Listing;
}

export default function NightlifeQuickInfo({ listing }: Props) {
  const items: { icon: typeof Music; label: string; value: string }[] = [];

  // Music — only if data exists
  if (listing.musicGenres?.length) {
    items.push({ icon: Music, label: "Música", value: listing.musicGenres.join(", ") });
  }

  // Admission — only if data exists
  if (listing.admissionType) {
    items.push({ icon: Ticket, label: "Entrada", value: listing.admissionType });
  }

  // Dress code — only if data exists
  if (listing.dressCode) {
    items.push({ icon: Shirt, label: "Vestimenta", value: listing.dressCode });
  }

  // Hours — only if meaningful data exists
  if (listing.hours) {
    const structured: FormattedHours | null = formatStructuredHours(listing.hours);
    let hoursValue: string | null = null;
    if (structured && structured.lines.length > 0) {
      hoursValue = structured.lines[0];
    } else if (!listing.hours.trim().startsWith("{")) {
      hoursValue = listing.hours.length > 40 ? listing.hours.slice(0, 40) + "…" : listing.hours;
    }
    if (hoursValue) {
      items.push({ icon: Clock, label: "Horario", value: hoursValue });
    }
  }

  // Don't render the component at all if no items have data
  if (items.length === 0) return null;

  return (
    <div className="border-y border-border/40 bg-muted/30">
      <div className="container">
        <div className={`grid grid-cols-${Math.min(items.length, 4)} md:grid-cols-${Math.min(items.length, 4)} divide-x divide-border/30`}>
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 py-5 px-3 text-center">
              <item.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {item.label}
              </span>
              <span className="text-sm font-medium text-foreground leading-snug">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
