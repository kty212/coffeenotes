import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllBags,
  getBagById,
  getBagsByYear,
  getYears,
  photoUrl,
  photoUrls,
  notesParagraphs,
  formatDate,
  yearOf,
} from "@/lib/bags";
import type { Bag } from "@/types/bag";
import BagCard from "@/components/BagCard";
import StarRow from "@/components/StarRow";

const YEAR_PATTERN = /^\d{4}$/;
const BAG_PATTERN = /^\d{4}-\d{3}$/;

export function generateStaticParams() {
  const years = getYears().map((slug) => ({ slug }));
  const bags = getAllBags().map((bag) => ({ slug: bag.id }));
  return [...years, ...bags];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (YEAR_PATTERN.test(slug)) {
    return { title: slug, description: `Every coffee bag logged in ${slug}.` };
  }

  const bag = getBagById(slug);
  if (!bag) return { title: "Not found" };

  const description =
    bag.tastingNotes || `${bag.roaster} — ${bag.coffee}.`;
  return {
    title: `${bag.coffee} · ${bag.roaster}`,
    description,
    openGraph: {
      title: `${bag.coffee} — ${bag.roaster}`,
      description,
      images: [photoUrl(bag)],
    },
  };
}

export default async function LogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (YEAR_PATTERN.test(slug)) return <YearIndex year={slug} />;
  if (BAG_PATTERN.test(slug)) {
    const bag = getBagById(slug);
    if (!bag) notFound();
    return <BagPage bag={bag} />;
  }
  notFound();
}

function YearIndex({ year }: { year: string }) {
  const bags = getBagsByYear(year);
  if (bags.length === 0) notFound();

  return (
    <div className="space-y-6">
      <div>
        <a
          href="/"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors"
        >
          ← Coffee Log
        </a>
        <h1 className="font-display text-3xl text-text-primary mt-2">{year}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {bags.length} {bags.length === 1 ? "bag" : "bags"}, newest first.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {bags.map((bag) => (
          <BagCard key={bag.id} bag={bag} />
        ))}
      </div>
    </div>
  );
}

/** Reads the build-time generated inline QR SVG, if present. */
function readQrSvg(bag: Bag): string | null {
  const file = path.join(
    process.cwd(),
    "public",
    "bags",
    yearOf(bag),
    `${bag.id}.svg`,
  );
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
}

function BagPage({ bag }: { bag: Bag }) {
  const year = yearOf(bag);
  const qrSvg = readQrSvg(bag);
  const paragraphs = notesParagraphs(bag);

  const details: { label: string; value: string }[] = [
    bag.origin && { label: "Origin", value: bag.origin },
    bag.process && { label: "Process", value: bag.process },
    bag.varietal && { label: "Varietal", value: bag.varietal },
    bag.roastLevel && { label: "Roast", value: bag.roastLevel },
    bag.roastDate && { label: "Roasted", value: formatDate(bag.roastDate) },
    bag.brewMethod && { label: "Brew", value: bag.brewMethod },
    bag.grindSetting && { label: "Grind", value: bag.grindSetting },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="space-y-6">
      <a
        href={`/${year}`}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors"
      >
        ← {year}
      </a>

      {/* Photos (cover first, then any extras e.g. the back of the bag).
          Single photo spans full width; multiples sit side by side. */}
      {(() => {
        const urls = photoUrls(bag);
        return (
          <div
            className={
              urls.length > 1
                ? "grid grid-cols-2 gap-3"
                : "overflow-hidden rounded-2xl bg-surface border border-border"
            }
          >
            {urls.map((src, i) =>
              urls.length > 1 ? (
                <div
                  key={src}
                  className="overflow-hidden rounded-2xl bg-surface border border-border aspect-[4/5]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${bag.roaster} — ${bag.coffee}${i > 0 ? ` (${i + 1})` : ""}`}
                    loading={i > 0 ? "lazy" : undefined}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={`${bag.roaster} — ${bag.coffee}`}
                  className="w-full"
                />
              ),
            )}
          </div>
        );
      })()}

      {/* Header */}
      <div>
        <span className="text-xs font-label font-medium text-accent uppercase tracking-wide">
          {bag.roaster}
        </span>
        <h1 className="font-display text-3xl text-text-primary mt-1">
          {bag.coffee}
        </h1>
        {bag.rating != null && (
          <div className="mt-2">
            <StarRow value={bag.rating} />
          </div>
        )}
      </div>

      {/* Tasting notes */}
      {bag.tastingNotes && (
        <div className="flex items-start gap-2">
          <span className="text-xs font-label text-text-secondary uppercase tracking-wide mt-0.5">
            Tasting
          </span>
          <span className="text-sm font-medium text-text-primary">
            {bag.tastingNotes}
          </span>
        </div>
      )}

      {/* Detail grid */}
      {details.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {details.map((d) => (
            <div
              key={d.label}
              className="bg-surface border border-border rounded-xl px-3 py-3"
            >
              <div className="text-xs text-text-secondary font-label">
                {d.label}
              </div>
              <div className="text-sm font-medium text-text-primary mt-0.5 leading-tight">
                {d.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My notes */}
      {paragraphs.length > 0 && (
        <div className="bg-warm-white border border-border rounded-2xl p-5">
          <h3 className="font-label text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
            Notes
          </h3>
          <div className="space-y-3 text-sm text-text-primary leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      )}

      {/* QR code */}
      <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col items-center">
        {qrSvg ? (
          <div
            className="w-40 h-40 [&>svg]:w-full [&>svg]:h-full"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        ) : (
          <div className="w-40 h-40 grid place-items-center text-xs text-text-secondary text-center">
            QR generates on build
          </div>
        )}
        <p className="mt-3 text-xs font-label text-text-secondary text-center">
          {bag.id} · log.coffeenotes.fyi
        </p>
        <div className="mt-3 flex flex-col items-center gap-1">
          <span className="text-xs font-label text-text-secondary uppercase tracking-wide">
            Print label
          </span>
          <div className="flex items-center gap-3">
            <a
              href={`/bags/${year}/${bag.id}-label.png`}
              download
              className="text-xs text-text-secondary hover:text-accent transition-colors"
            >
              PNG
            </a>
            <a
              href={`/bags/${year}/${bag.id}-label.svg`}
              download
              className="text-xs text-text-secondary hover:text-accent transition-colors"
            >
              SVG
            </a>
            <span className="text-border">·</span>
            <a
              href={`/bags/${year}/${bag.id}.svg`}
              download
              className="text-xs text-text-secondary hover:text-accent transition-colors"
            >
              QR only
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
