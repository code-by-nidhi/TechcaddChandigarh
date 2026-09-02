import Image from "next/image";
import { Icon } from "./ui/Icon";
import { cx } from "./ui";
import { revealDelay } from "./motion/Words";

/**
 * A photo slot on the About page.
 *
 * The centre has no photography in the repository yet, so without a `src` the
 * frame renders a branded panel carrying the caption. Drop a file into
 * `public/assets/images/` and pass `src` — the layout does not move.
 */
export function MediaFrame({
  caption,
  src,
  icon = "spark",
  className,
  sizes = "(min-width: 1024px) 40vw, 92vw",
  reveal,
  delay = 0,
}: {
  caption: string;
  src?: string;
  icon?: string;
  className?: string;
  sizes?: string;
  /** Float the frame in on scroll (needs a `RevealScope` above it). */
  reveal?: boolean;
  /** Milliseconds to hold before this frame moves, for staggering a collage. */
  delay?: number;
}) {
  return (
    <figure
      {...(reveal ? { "data-reveal": true, style: revealDelay(delay, 1) } : {})}
      className={cx(
        "group relative isolate overflow-hidden rounded-2xl ring-1 ring-line/70 transition-shadow duration-500 hover:shadow-[0_30px_60px_-32px_rgba(11,26,77,0.55)]",
        className,
      )}
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={caption}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-hero-950/85 to-transparent p-5 text-xs leading-relaxed text-white/85">
            {caption}
          </figcaption>
        </>
      ) : (
        <>
          <span aria-hidden="true" className="panel-surface absolute inset-0 -z-10" />
          <span aria-hidden="true" className="panel-dots absolute inset-0 -z-10" />
          <span
            aria-hidden="true"
            className="sheen absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <div className="flex size-full flex-col justify-end gap-3 p-6">
            <Icon
              name={icon}
              className="float-slow size-7 text-accent-400 transition-transform duration-500 group-hover:scale-110"
            />
            <figcaption className="text-xs leading-relaxed text-white/70">{caption}</figcaption>
          </div>
        </>
      )}
    </figure>
  );
}
