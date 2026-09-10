"use client";

import { useEffect, useState } from "react";
import { Icon, cx } from "@/components/ui";
import type { CmsTestimonial } from "@/lib/cms";
import { GoogleMark } from "@/components/GoogleMark";

/**
 * The video testimonial wall.
 *
 * A client component because of the player dialog: the video opens on the page
 * the visitor is already reading rather than sending them to YouTube, which is
 * the whole point — a tab that lands on YouTube is a visitor lost to the
 * sidebar of related videos.
 *
 * Nothing is embedded until someone presses play. Twelve iframes would load
 * YouTube's player twelve times on a page nobody has interacted with yet; the
 * grid shows thumbnails, and exactly one iframe exists at a time.
 */

/**
 * The video id inside any YouTube URL, or null.
 *
 * Mirrors the helper in the CMS form, so what an editor previews there is what
 * plays here. Returns null rather than throwing on an address it does not
 * recognise: the card then renders without a play button instead of breaking
 * the wall.
 */
export function youtubeId(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") return parsed.pathname.slice(1).split("/")[0] || null;

    if (host.endsWith("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return v;
      const match = /^\/(?:embed|shorts|live|v)\/([^/?#]+)/.exec(parsed.pathname);
      if (match) return match[1] ?? null;
    }
  } catch {
    // Not an address we can parse — the caller shows the card without a video.
  }
  return null;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Player                                                              */
/* ------------------------------------------------------------------ */

function PlayerDialog({
  testimonial,
  videoId,
  onClose,
}: {
  testimonial: CmsTestimonial;
  videoId: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    // The page behind must not scroll while the dialog is open — on a phone
    // that reads as the video sliding away under your finger.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Video testimonial from ${testimonial.authorName}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-hero-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        // The backdrop closes on click; the panel must not, or every click
        // inside the dialog would dismiss it.
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative aspect-video bg-black">
          <iframe
            // `autoplay=1` is honest here: the visitor pressed play to get this
            // dialog open, so the video starting is what they asked for.
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={`Video testimonial from ${testimonial.authorName}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4 p-6">
          <div className="min-w-0">
            <p className="font-display font-bold">{testimonial.authorName}</p>
            <p className="text-sm text-muted">
              {testimonial.role}
              {testimonial.courseName ? ` · ${testimonial.courseName}` : ""}
            </p>
          </div>

          {testimonial.googleUrl ? (
            <a
              href={testimonial.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium transition-colors hover:border-brand-600/30"
            >
              <GoogleMark className="size-4" />
              Read on Google
            </a>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-hero-950/60 text-white transition-colors hover:bg-hero-950/80"
        >
          <Icon name="close" className="size-5" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wall                                                                */
/* ------------------------------------------------------------------ */

function Card({
  testimonial,
  onPlay,
}: {
  testimonial: CmsTestimonial;
  onPlay: (testimonial: CmsTestimonial, videoId: string) => void;
}) {
  const videoId = youtubeId(testimonial.youtubeUrl);

  return (
    <figure className="card-hover flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
      {videoId ? (
        <button
          type="button"
          onClick={() => onPlay(testimonial, videoId)}
          className="group relative block aspect-video w-full overflow-hidden bg-hero-950"
          aria-label={`Play the video testimonial from ${testimonial.authorName}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- i.ytimg.com is not in next.config images.remotePatterns, and adding YouTube as a remote host to optimise a thumbnail is not worth the config. */}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 grid place-items-center bg-hero-950/25 transition-colors group-hover:bg-hero-950/10">
            <span className="grid size-14 place-items-center rounded-full bg-white/95 shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Icon name="play" className="ml-0.5 size-6 text-brand-600" />
            </span>
          </span>
        </button>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-1 text-accent-yellow">
          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
            <Icon key={i} name="star" className="size-4" />
          ))}
        </div>

        <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted wrap-anywhere">
          {testimonial.quote}
        </blockquote>

        <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-hero-950 text-xs font-bold text-white">
            {initialsOf(testimonial.authorName)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">
              {testimonial.authorName}
            </span>
            <span className="block truncate text-xs text-muted">{testimonial.role}</span>
            {testimonial.courseName ? (
              <span className="mt-0.5 block truncate text-[11px] font-medium text-brand-600">
                {testimonial.courseName}
              </span>
            ) : null}
          </span>

          {testimonial.googleUrl ? (
            <a
              href={testimonial.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Read this review on Google"
              aria-label={`Read the Google review from ${testimonial.authorName}`}
              className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition-colors hover:border-brand-600/30"
            >
              <GoogleMark className="size-4" />
            </a>
          ) : null}
        </figcaption>
      </div>
    </figure>
  );
}

export function TestimonialWall({ testimonials }: { testimonials: CmsTestimonial[] }) {
  const [playing, setPlaying] = useState<{ testimonial: CmsTestimonial; videoId: string } | null>(
    null,
  );

  if (testimonials.length === 0) return null;

  return (
    <>
      <div
        className={cx(
          "grid gap-4",
          // Video cards are tall, so three across only once there is room.
          "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            testimonial={testimonial}
            onPlay={(record, videoId) => setPlaying({ testimonial: record, videoId })}
          />
        ))}
      </div>

      {playing ? (
        <PlayerDialog
          testimonial={playing.testimonial}
          videoId={playing.videoId}
          onClose={() => setPlaying(null)}
        />
      ) : null}
    </>
  );
}
