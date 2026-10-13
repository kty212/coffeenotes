"use client";

import { useCallback, useEffect, useState } from "react";

export interface GalleryPhoto {
  src: string;
  alt: string;
}

/**
 * Bag photos as a grid (single photo full-width, multiples side by side).
 * Click any photo to open a full-screen lightbox; Esc / backdrop / × closes,
 * and arrow keys (or on-screen arrows) step through when there's more than one.
 */
export default function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const many = photos.length > 1;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: number) =>
      setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <>
      <div
        className={
          many
            ? "grid grid-cols-2 gap-3"
            : "overflow-hidden rounded-2xl bg-surface border border-border"
        }
      >
        {photos.map((p, i) =>
          many ? (
            <button
              key={p.src}
              type="button"
              onClick={() => setOpen(i)}
              className="overflow-hidden rounded-2xl bg-surface border border-border aspect-[4/5] cursor-zoom-in"
              aria-label="View larger photo"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                loading={i > 0 ? "lazy" : undefined}
                className="h-full w-full object-cover"
              />
            </button>
          ) : (
            <button
              key={p.src}
              type="button"
              onClick={() => setOpen(i)}
              className="block w-full cursor-zoom-in"
              aria-label="View larger photo"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} className="w-full" />
            </button>
          ),
        )}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[open].src}
            alt={photos[open].alt}
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-lg"
          />

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white hover:bg-white/20"
          >
            ×
          </button>

          {many && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous photo"
                className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white hover:bg-white/20"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next photo"
                className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white hover:bg-white/20"
              >
                ›
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-label text-white/70">
                {open + 1} / {photos.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
