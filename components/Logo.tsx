import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { cx } from "./ui";

import logo from "@/public/assets/logo.png";

const size = "h-9 w-auto lg:h-10";

/**
 * Official wordmark. The artwork is navy on transparent, so the header's white
 * copy is a knocked-out duplicate stacked on top and cross-faded.
 *
 * Animating `filter` between `none` and `brightness(0) invert(1)` would pass
 * through a muddy grey at the midpoint; cross-fading two layers keeps both ends
 * of the transition clean and composites on the GPU.
 */
export function Logo({
  onDark = false,
  className,
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={cx("relative inline-flex shrink-0 items-center", className)}
    >
      <Image src={logo} alt={`techcadd — ${site.tagline}`} priority sizes="200px" className={size} />
      <Image
        src={logo}
        alt=""
        aria-hidden="true"
        priority
        sizes="200px"
        className={cx(
          "absolute top-0 left-0 brightness-0 invert transition-opacity duration-300 ease-in-out",
          size,
          onDark ? "opacity-100" : "opacity-0",
        )}
      />
    </Link>
  );
}
