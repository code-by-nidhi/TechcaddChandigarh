"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  navItems,
  type AiPanelColumn,
  type NavCard,
  type NavColumn,
  type NavFooter,
  type NavItem,
  type NavLink,
  type NavTile,
} from "@/data/nav";
import { site as staticSite } from "@/data/site";
import type { SiteConfig } from "@/lib/cms";

import { BookDemoModal } from "./BookDemoModal";
import { Logo } from "./Logo";
import { Badge, Button, Icon, badgeTone, cx } from "./ui";

/* -------------------------------------------------------------------------- */
/*                              Mega panel pieces                              */
/* -------------------------------------------------------------------------- */

function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="menu-panel-in overflow-hidden rounded-3xl border border-white/60 bg-[#f3f5f9] shadow-[0_32px_80px_-24px_rgba(6,14,43,0.45)] ring-1 ring-hero-950/5">
      {children}
    </div>
  );
}

function PanelFooter({ footer }: { footer: NavFooter }) {
  return (
    <div className="flex flex-col gap-3 border-t border-hero-950/5 bg-white px-7 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2.5 text-sm text-muted">
        <Icon name="quote" className="mt-0.5 size-4 shrink-0 text-brand-200" />
        <span>
          <em className="not-italic italic">{footer.quote}</em>
          {footer.attribution ? (
            <span className="ml-1.5 font-semibold text-foreground">— {footer.attribution}</span>
          ) : null}
        </span>
      </p>
      <Link
        href={footer.cta.href}
        className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-600"
      >
        {footer.cta.label}
        <Icon
          name="arrow-right"
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}

function ColumnsPanel({
  columns,
  footer,
  backgroundText,
  subtitle,
}: {
  columns: NavColumn[];
  footer?: NavFooter;
  backgroundText?: string;
  subtitle?: string;
}) {
  return (
    <PanelShell>
      <div className="relative overflow-hidden">
        {backgroundText ? (
          <p
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-7 text-center text-2xl leading-tight font-extrabold tracking-tight whitespace-nowrap text-hero-950/[0.04] select-none lg:text-4xl"
          >
            {backgroundText}
          </p>
        ) : null}
        {subtitle ? (
          <p className="relative px-7 pt-7 text-sm leading-relaxed text-muted">{subtitle}</p>
        ) : null}
        <div
          className={cx(
            "relative grid gap-x-8 gap-y-8 px-7 pb-7",
            subtitle ? "pt-5" : "pt-7",
          )}
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          {columns.map((column, i) => (
            <div key={column.title}>
              <p className="text-xs font-medium text-muted/70">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-hero-950">
                {column.title}
              </h3>
              {column.subtitle ? (
                <p className="mt-1 text-[13px] leading-snug text-muted">{column.subtitle}</p>
              ) : null}
              <hr className="mt-4 border-hero-950/10" />
              <ul className="mt-4 space-y-0.5">
                {column.links.map((item) => (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      className="group -mx-2 flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-hero-950/85 transition-colors hover:bg-white hover:text-brand-600"
                    >
                      <span className="truncate">{item.label}</span>
                      {item.badge ? (
                        <Badge tone={badgeTone(item.badge)} className="shrink-0">
                          {item.badge}
                        </Badge>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {footer ? <PanelFooter footer={footer} /> : null}
    </PanelShell>
  );
}

function TilesPanel({ tiles, footer }: { tiles: NavTile[]; footer?: NavFooter }) {
  return (
    <PanelShell>
      <div className="grid gap-2.5 px-7 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className="group flex items-center gap-3 rounded-xl border border-transparent bg-white/70 px-3.5 py-3 transition-all duration-300 hover:border-brand-600/20 hover:bg-white hover:shadow-lg hover:shadow-hero-950/5"
          >
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
              <Icon name={item.icon} className="size-4.5" />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-hero-950">
              {item.label}
            </span>
            {item.badge ? (
              <Badge tone={badgeTone(item.badge)} className="shrink-0">
                {item.badge}
              </Badge>
            ) : null}
          </Link>
        ))}
      </div>
      {footer ? <PanelFooter footer={footer} /> : null}
    </PanelShell>
  );
}

/** A short, plain link list in a small rounded card — e.g. Branches. No mega-panel width. */
/** Fixed width of `SimplePanel`, in px — kept in sync with its `w-56` class so
 * the header can centre the panel under its nav item before it ever renders. */
const SIMPLE_PANEL_WIDTH = 224;

function SimplePanel({ links }: { links: NavLink[] }) {
  return (
    <div className="menu-panel-in w-56 rounded-3xl border border-white/60 bg-[#f3f5f9] p-3 shadow-[0_32px_80px_-24px_rgba(6,14,43,0.45)] ring-1 ring-hero-950/5">
      <ul className="max-h-[70vh] overflow-y-auto">
        {links.map((item) => {
          const className =
            "flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-hero-950/85 transition-colors hover:bg-white hover:text-brand-600";
          return (
            <li key={item.href}>
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
                  {item.label}
                  <Icon name="arrow-up-right" className="size-3.5 shrink-0 opacity-60" />
                </a>
              ) : (
                <Link href={item.href} className={className}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Distinct backdrops per featured card, so a row of 3 doesn't read as one repeated tile. */
const CARD_TREATMENTS = [
  "from-hero-950 via-hero-900 to-hero-800",
  "from-[#0B1E4D] via-[#123285] to-[#1E6FD9]",
  "from-[#08243D] via-[#0E4A63] to-[#0EA5A0]",
];

function CardsPanel({
  links,
  cta,
  cards,
}: {
  links: NavLink[];
  cta: NavLink;
  cards: NavCard[];
}) {
  return (
    <PanelShell>
      <div className="grid gap-7 px-7 py-7 lg:grid-cols-[minmax(0,14rem)_1px_1fr] lg:gap-9">
        <div>
          <ul className="space-y-1">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="-mx-2 flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-hero-950/85 transition-colors hover:bg-white hover:text-brand-600"
                >
                  <span className="truncate">{item.label}</span>
                  {item.badge ? (
                    <Badge tone={badgeTone(item.badge)} className="shrink-0">
                      {item.badge}
                    </Badge>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={cta.href}
            className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600"
          >
            {cta.label}
            <Icon
              name="arrow-right"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>


        <div aria-hidden="true" className="hidden bg-hero-950/10 lg:block" />

        <div className="grid gap-4 sm:grid-cols-3">
          {CARD_TREATMENTS.map((treatment, i) => {
            const card = cards[i];
            if (!card) return null;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-2xl transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.02]"
              >
                <span
                  className={cx(
                    "relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br shadow-sm transition-shadow duration-300 group-hover:shadow-xl",
                    treatment,
                  )}
                >
                  {card.image ? (
                    // Decorative: the tile's title is real text directly below.
                    <img
                      src={card.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1.5px)] [background-size:16px_16px]"
                      />
                      <Icon
                        name={card.icon}
                        className="relative size-9 text-white/90 transition-transform duration-500 group-hover:scale-110"
                      />
                    </>
                  )}
                </span>
                <span className="mt-3 block font-display text-sm font-bold tracking-tight text-hero-950">
                  {card.title}
                </span>
                <span className="mt-1.5 flex items-center gap-2">
                  <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                    {card.badge}
                  </span>
                  <span className="truncate text-[11px] uppercase tracking-wider text-muted">
                    {card.meta}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </PanelShell>
  );
}

/** Solid dark-panel badge colors — the shared `Badge` tones are tuned for light backgrounds. */
const AI_BADGE_STYLES: Record<string, string> = {
  Hot: "bg-orange-500 text-white",
  New: "bg-violet-500 text-white",
  Trending: "bg-cyan-500 text-hero-950",
};

function AiBadge({ badge }: { badge: string }) {
  return (
    <span
      className={cx(
        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        AI_BADGE_STYLES[badge] ?? "bg-white/15 text-white",
      )}
    >
      {badge}
    </span>
  );
}

function AiMegaPanel({
  heading,
  subtitle,
  columns,
  featured,
  cta,
}: {
  heading: string;
  subtitle: string;
  columns: AiPanelColumn[];
  featured: { title: string; badge: string; href: string; icon: string; image?: string };
  cta: { heading: string; buttonLabel: string; href: string };
}) {
  return (
    <div className="menu-panel-in hero-surface relative isolate overflow-hidden rounded-[32px] border border-white/10 shadow-[0_40px_100px_-24px_rgba(6,14,43,0.65)]">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full opacity-[0.1]"
      >
        <defs>
          <pattern id="ai-menu-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ai-menu-grid)" />
      </svg>
      <span
        aria-hidden="true"
        className="drift-slow pointer-events-none absolute -top-10 right-24 -z-10 size-56 rounded-full bg-[#00D4FF]/20 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="drift-slow-reverse pointer-events-none absolute bottom-0 left-1/3 -z-10 size-64 rounded-full bg-brand-600/25 blur-3xl"
      />

      <div className="grid gap-8 p-8 lg:grid-cols-[1.7fr_1fr_1fr]">
        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight text-white lg:text-[1.75rem]">
            {heading}
          </h3>
          <p className="mt-2.5 max-w-md text-sm leading-relaxed text-white/65">{subtitle}</p>

          <div className="mt-7 grid gap-8 sm:grid-cols-2">
            {columns.map((column) => (
              <div key={column.title}>
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-[#00D4FF] text-white">
                    <Icon name={column.icon} className="size-4" />
                  </span>
                  <h4 className="font-display text-sm font-bold tracking-tight text-white">
                    {column.title}
                  </h4>
                </div>
                <ul className="mt-4 space-y-0.5">
                  {column.links.map((item) => (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        className="group -mx-2 flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-white/75 transition-all duration-200 hover:translate-x-1 hover:bg-white/5 hover:text-white"
                      >
                        <span className="leading-snug">{item.label}</span>
                        {item.badge ? <AiBadge badge={item.badge} /> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Link
          href={featured.href}
          className="group block overflow-hidden rounded-[24px] bg-white shadow-[0_20px_45px_-15px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-15px_rgba(0,212,255,0.35)]"
        >
          <span className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-hero-950 via-hero-900 to-hero-800">
            <span
              aria-hidden="true"
              className="absolute inset-0 z-10 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1.5px)] [background-size:18px_18px]"
            />
            {featured.image ? (
              <Image
                src={featured.image}
                alt=""
                fill
                sizes="320px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Icon
                name={featured.icon}
                className="relative size-10 text-white/80 transition-transform duration-500 group-hover:scale-110"
              />
            )}
          </span>
          <span className="block p-4">
            <span className="inline-flex items-center rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {featured.badge}
            </span>
            <span className="mt-2.5 block font-display text-sm leading-snug font-bold tracking-tight text-hero-950">
              {featured.title}
            </span>
          </span>
        </Link>

        <div className="flex flex-col justify-between rounded-[24px] bg-gradient-to-br from-brand-600 to-[#00D4FF] p-6">
          <p className="font-display text-lg leading-snug font-bold tracking-tight text-white">
            {cta.heading}
          </p>
          <Link
            href={cta.href}
            className="group mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition-shadow duration-300 hover:shadow-[0_0_0_6px_rgba(255,255,255,0.2)]"
          >
            {cta.buttonLabel}
            <Icon
              name="arrow-right"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

function MegaPanel({ item }: { item: NavItem }) {
  if (!item.panel) return null;
  switch (item.panel.kind) {
    case "columns":
      return (
        <ColumnsPanel
          columns={item.panel.columns}
          footer={item.panel.footer}
          backgroundText={item.panel.backgroundText}
          subtitle={item.panel.subtitle}
        />
      );
    case "tiles":
      return <TilesPanel tiles={item.panel.tiles} footer={item.panel.footer} />;
    case "cards":
      return (
        <CardsPanel links={item.panel.links} cta={item.panel.cta} cards={item.panel.cards} />
      );
    case "ai":
      return (
        <AiMegaPanel
          heading={item.panel.heading}
          subtitle={item.panel.subtitle}
          columns={item.panel.columns}
          featured={item.panel.featured}
          cta={item.panel.cta}
        />
      );
    case "simple":
      return <SimplePanel links={item.panel.links} />;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Header                                    */
/* -------------------------------------------------------------------------- */

/** See the note on `Footer` — the contact details are resolved upstream. */
export function Header({ site = staticSite as SiteConfig }: { site?: SiteConfig }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const dropdownRailRef = useRef<HTMLDivElement>(null);
  const [simpleLeft, setSimpleLeft] = useState(0);

  // A "simple" panel (e.g. Branches) is narrow, so it anchors under its own
  // nav item instead of stretching the full width like the mega panels.
  useEffect(() => {
    const item = navItems.find((i) => i.label === open);
    if (!open || item?.panel?.kind !== "simple") return;

    const update = () => {
      const li = itemRefs.current[open];
      const rail = dropdownRailRef.current;
      if (!li || !rail) return;
      // `margin-left` on the child starts from the rail's padding box, so its
      // own padding-left has to come back out of the raw edge-to-edge delta.
      const railPaddingLeft = parseFloat(getComputedStyle(rail).paddingLeft) || 0;
      const liRect = li.getBoundingClientRect();
      const railRect = rail.getBoundingClientRect();
      const liCenter = liRect.left + liRect.width / 2 - railRect.left - railPaddingLeft;
      setSimpleLeft(liCenter - SIMPLE_PANEL_WIDTH / 2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  /**
   * Inner pages open on a navy banner, so the bar starts transparent there too;
   * the capsule appears as soon as the page moves.
   */
  useEffect(() => {
    // Separate on/off thresholds: a single boundary makes the bar flicker when
    // the user creeps across it or a trackpad settles right on the line.
    const onScroll = () =>
      setScrolled((was) => (was ? window.scrollY > 8 : window.scrollY > 32));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(null);
      setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  };

  /** Capsule mode: scrolled, or the mobile drawer is showing — opening a
   * desktop dropdown must never touch the navbar's own background, only the
   * dropdown panel itself changes. */
  const solid = scrolled || mobileOpen;

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    if (base === "/") return pathname === "/";
    return base.length > 1 && pathname.startsWith(base);
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      onMouseLeave={scheduleClose}
    >
      <div className="rail pt-3 lg:pt-4">
        <div className="relative flex h-14 items-center justify-between gap-2 lg:h-[68px] xl:gap-4">
          {/* The glass pill lives on its own layer and only cross-fades in.
              The bar keeps one height and the content never moves between the
              two states — animating height, padding, margin or backdrop-filter
              on the bar itself forces layout every frame and visibly stutters,
              so everything that changes here is paint-only. */}
          <div
            aria-hidden="true"
            className={cx(
              "pointer-events-none absolute inset-y-0 -left-3 -right-3 transition-opacity duration-300 ease-in-out lg:-left-6 lg:-right-6",
              solid ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="size-full rounded-full border border-white/60 bg-white/88 shadow-[0_16px_44px_-18px_rgba(6,14,43,0.4)] backdrop-blur-2xl backdrop-saturate-150" />
            {/* Highlight along the top edge — the detail that sells the glass. */}
            <div className="absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/75 to-transparent" />
          </div>

          <Logo onDark={!solid} className="relative" />

          {/* Desktop navigation */}
          <nav aria-label="Main" className="relative hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => {
                const hasPanel = Boolean(item.panel);
                const active = isActive(item.href);

                return (
                  <li
                    key={item.label}
                    ref={(el) => {
                      itemRefs.current[item.label] = el;
                    }}
                    onMouseEnter={() => hasPanel && openMenu(item.label)}
                  >
                    <Link
                      href={item.href}
                      aria-expanded={hasPanel ? open === item.label : undefined}
                      aria-current={active && !item.highlight ? "page" : undefined}
                      onFocus={() => hasPanel && openMenu(item.label)}
                      className={cx(
                        "inline-flex items-center gap-1 rounded-full text-sm font-medium transition-colors duration-300 ease-in-out",
                        item.highlight
                          ? "bg-gradient-to-b from-brand-500 to-brand-600 px-4 py-1.5 font-semibold text-white shadow-[0_0_20px_-2px_rgba(47,125,255,0.65)] hover:from-brand-400 hover:to-brand-600"
                          : cx(
                              "px-2 py-2 2xl:px-2.5",
                              solid
                                ? active
                                  ? "text-brand-600"
                                  : "text-hero-950/80 hover:text-brand-600"
                                : active
                                  ? "text-white"
                                  : "text-white/85 hover:text-white",
                            ),
                      )}
                    >
                      {item.label}
                      {item.highlight ? (
                        <Icon name="spark" className="size-3 text-white/90" />
                      ) : null}
                      {hasPanel && !item.highlight ? (
                        <Icon
                          name="chevron-down"
                          className={cx(
                            "size-3 opacity-60 transition-transform duration-300",
                            open === item.label && "rotate-180",
                          )}
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative flex items-center gap-2">
            <a
              href={site.contact.phoneHref}
              className={cx(
                "hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300 ease-in-out lg:inline-flex xl:hidden",
                solid ? "text-hero-950/80 hover:text-brand-600" : "text-white/85 hover:text-white",
              )}
            >
              <Icon name="phone" className="size-4" />
              {site.contact.phone}
            </a>

            {/* Kept on phones too — it is the page's primary action — but tucked
                away on the narrowest handsets where the logo needs the room. */}
            <Button
              type="button"
              onClick={() => setDemoOpen(true)}
              variant={solid ? "primary" : "onDark"}
              size="sm"
              className="hidden shrink-0 px-4 min-[380px]:inline-flex sm:px-5"
            >
              Book Demo
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className={cx(
                "inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ease-in-out xl:hidden",
                solid
                  ? "border-hero-950/10 text-hero-950 hover:bg-subtle"
                  : "border-white/30 text-white hover:bg-white/10",
              )}
            >
              <Icon name={mobileOpen ? "close" : "menu"} className="size-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop mega panel — one wide, centred sheet for every menu, except a
          "simple" panel (e.g. Branches), which anchors under its own item. */}
      {open
        ? (() => {
            const item = navItems.find((i) => i.label === open)!;
            const isSimple = item.panel?.kind === "simple";
            return (
              <div className="absolute inset-x-0 top-full hidden pt-2 xl:block">
                <div className="rail" ref={dropdownRailRef}>
                  {isSimple ? (
                    <div style={{ marginLeft: simpleLeft }} className="w-fit">
                      <MegaPanel item={item} />
                    </div>
                  ) : (
                    <div className="-mx-3 lg:-mx-6">
                      <MegaPanel item={item} />
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        : null}

      {mobileOpen ? (
        <MobileMenu
          site={site}
          onNavigate={() => setMobileOpen(false)}
          onBookDemo={() => {
            setMobileOpen(false);
            setDemoOpen(true);
          }}
        />
      ) : null}

      {demoOpen ? <BookDemoModal onClose={() => setDemoOpen(false)} /> : null}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Mobile drawer                                */
/* -------------------------------------------------------------------------- */

/** Flattens any panel shape into simple label/href groups for the drawer. */
function flatten(item: NavItem): { title?: string; links: NavLink[] }[] {
  if (!item.panel) return [];
  switch (item.panel.kind) {
    case "columns":
      return item.panel.columns.map((c) => ({ title: c.title, links: c.links }));
    case "tiles":
      return [{ links: item.panel.tiles.map((t) => ({ label: t.label, href: t.href, badge: t.badge })) }];
    case "cards":
      return [{ links: [...item.panel.links, item.panel.cta] }];
    case "ai":
      return item.panel.columns.map((c) => ({ title: c.title, links: c.links }));
    case "simple":
      return [{ links: item.panel.links }];
  }
}

function MobileMenu({
  onNavigate,
  onBookDemo,
  site,
}: {
  onNavigate: () => void;
  onBookDemo: () => void;
  site: SiteConfig;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rail pt-2 xl:hidden">
      <div className="fade-up -mx-3 max-h-[calc(100dvh-5rem)] lg:-mx-6 overflow-y-auto overscroll-contain rounded-3xl border border-white/70 bg-white p-5 shadow-[0_24px_60px_-20px_rgba(6,14,43,0.45)]">
        <ul className="divide-y divide-line">
          {navItems.map((item) => {
            const groups = flatten(item);

            const isOpen = expanded === item.label;

            if (!groups.length) {
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cx(
                      "flex items-center gap-2 py-3.5 font-medium",
                      item.highlight && "text-brand-600",
                    )}
                  >
                    {item.label}
                    {item.highlight ? <Icon name="spark" className="size-3.5" /> : null}
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 py-3.5 text-left font-medium"
                >
                  <span
                    className={cx(
                      "inline-flex items-center gap-2",
                      item.highlight &&
                        "rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-3.5 py-1 text-sm text-white",
                    )}
                  >
                    {item.label}
                    {item.highlight ? <Icon name="spark" className="size-3.5" /> : null}
                  </span>
                  <Icon name={isOpen ? "minus" : "plus"} className="size-4 shrink-0 text-muted" />
                </button>

                <div
                  className={cx(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-5 pb-4">
                      {groups.map((group, i) => (
                        <div key={group.title ?? i}>
                          {group.title ? (
                            <p className="pb-1.5 text-[11px] font-bold uppercase tracking-widest text-muted">
                              {group.title}
                            </p>
                          ) : null}
                          <div className="grid gap-0.5 sm:grid-cols-2">
                            {group.links.map((linkItem) => {
                              const linkClass =
                                "flex items-center justify-between gap-3 rounded-lg py-2 pl-3 text-sm text-muted transition-colors hover:text-brand-600";
                              const body = (
                                <>
                                  <span className="truncate">{linkItem.label}</span>
                                  {linkItem.badge ? (
                                    <Badge tone={badgeTone(linkItem.badge)} className="shrink-0">
                                      {linkItem.badge}
                                    </Badge>
                                  ) : null}
                                  {linkItem.external ? (
                                    <Icon
                                      name="arrow-up-right"
                                      className="size-3.5 shrink-0 opacity-60"
                                    />
                                  ) : null}
                                </>
                              );
                              return linkItem.external ? (
                                <a
                                  key={linkItem.href + linkItem.label}
                                  href={linkItem.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={onNavigate}
                                  className={linkClass}
                                >
                                  {body}
                                </a>
                              ) : (
                                <Link
                                  key={linkItem.href + linkItem.label}
                                  href={linkItem.href}
                                  onClick={onNavigate}
                                  className={linkClass}
                                >
                                  {body}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        className="inline-flex items-center gap-1.5 pl-3 text-sm font-semibold text-brand-600"
                      >
                        View all {item.label.toLowerCase()}
                        <Icon name="arrow-right" className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 grid gap-2.5">
          <Button type="button" onClick={onBookDemo} size="lg">
            Book Free Demo
            <Icon name="arrow-right" className="size-4" />
          </Button>
          <a
            href={site.contact.phoneHref}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line text-sm font-medium"
          >
            <Icon name="phone" className="size-4" />
            {site.contact.phone}
          </a>
          <p className="pt-1 text-center text-xs text-muted">
            {site.stats.rating}★ on Google · {site.contact.hours}
          </p>
        </div>
      </div>
    </div>
  );
}
