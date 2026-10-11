import type { Bag } from "@/types/bag";
import { photoUrl } from "@/lib/bags";

// Photo-first tile used in the home and year-index grids.
export default function BagCard({ bag }: { bag: Bag }) {
  return (
    <a href={`/${bag.id}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-surface border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl(bag)}
          alt={`${bag.roaster} — ${bag.coffee}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-2">
        <span className="text-xs font-label text-accent uppercase tracking-wide">
          {bag.roaster}
        </span>
        <div className="font-display text-lg text-text-primary leading-tight">
          {bag.coffee}
        </div>
      </div>
    </a>
  );
}
