"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon, cx } from "@/components/ui";

/**
 * The photographs from an event.
 *
 * The substance of an event page once the event has happened — a paragraph
 * describing a summit convinces nobody it took place. So this leads the page
 * rather than sitting under the copy.
 *
 * A client component only for the lightbox. The grid itself is plain markup
 * and renders on the server; without JavaScript every photo is still visible
 * at grid size, just not enlargeable.
 */

export interface EventPhoto {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

/**
 * The first photo runs full width, the rest tile beneath it.
 *
 * A uniform grid makes a set of event photos read as a contact sheet. Leading
 * with one gives the page an image to open on, which is what a visitor
 * actually looks at first.
 */
function spanFor(index: number, total: number): string {
  if (total === 1) return "sm:col-span-2 lg:col-span-3";
  if (index === 0) return "sm:col-span-2 lg:col-span-2 lg:row-span-2";
  return "";
}

export function EventGallery({
  photos,
  eventTitle,
}: {
  photos: EventPhoto[];
  eventTitle: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
      // Arrow keys wrap, so a viewer can page through without hunting for the
      // ends of the set.
      if (event.key === "ArrowRight") setOpen((i) => ((i ?? 0) + 1) % photos.length);
      if (event.key === "ArrowLeft") {
        setOpen((i) => ((i ?? 0) - 1 + photos.length) % photos.length);
      }
    };

    window.addEventListener("keydown", onKey);

    // The page behind must not scroll while the lightbox is open — on a phone
    // that reads as the photo sliding away under your finger.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, photos.length]);

  if (photos.length === 0) return null;

  const active = open === null ? null : photos[open];

  return (
    <>
      <div className="grid auto-rows-[13rem] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={`${photo.id}-${index}`}
            type="button"
            onClick={() => setOpen(index)}
            aria-label={`Open photo ${index + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ""}`}
            className={cx(
              "group relative overflow-hidden rounded-2xl border border-line bg-subtle",
              spanFor(index, photos.length),
            )}
          >
            <Image
              src={photo.url}
              alt={photo.caption || photo.alt || `${eventTitle} — photo ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {photo.caption ? (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hero-950/85 to-transparent p-4 pt-10 text-left">
                <span className="block text-sm font-medium text-white wrap-anywhere">
                  {photo.caption}
                </span>
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${eventTitle} — photo ${(open ?? 0) + 1} of ${photos.length}`}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-hero-950/90 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            // The backdrop closes on click; the photo itself must not, or every
            // click while looking at it would dismiss the lightbox.
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-black">
              <Image
                src={active.url}
                alt={active.caption || active.alt || eventTitle}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="min-w-0 text-sm text-white/80 wrap-anywhere">
                {active.caption ?? ""}
              </p>
              <p className="shrink-0 text-sm text-white/60">
                {(open ?? 0) + 1} / {photos.length}
              </p>
            </div>

            {photos.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() => setOpen(((open ?? 0) - 1 + photos.length) % photos.length)}
                  className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-hero-950/60 text-white transition-colors hover:bg-hero-950/80"
                >
                  <Icon name="chevron-right" className="size-5 rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => setOpen(((open ?? 0) + 1) % photos.length)}
                  className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-hero-950/60 text-white transition-colors hover:bg-hero-950/80"
                >
                  <Icon name="chevron-right" className="size-5" />
                </button>
              </>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Close"
            className="absolute top-5 right-5 grid size-11 place-items-center rounded-full bg-hero-950/60 text-white transition-colors hover:bg-hero-950/80"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>
      ) : null}
    </>
  );
}
