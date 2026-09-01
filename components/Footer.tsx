import Link from "next/link";
import { site } from "@/data/site";
import { footerColumns, legalLinks } from "@/data/nav";
import { branches } from "@/data/branches";
import { Logo } from "./Logo";
import { ButtonLink, Icon } from "./ui";

const socials = [
  { name: "Instagram", icon: "instagram", href: site.social.instagram },
  { name: "YouTube", icon: "youtube", href: site.social.youtube },
  { name: "LinkedIn", icon: "linkedin", href: site.social.linkedin },
  { name: "Facebook", icon: "facebook", href: site.social.facebook },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-subtle">
      {/* Closing call to action */}
      <div className="border-b border-line bg-white">
        <div className="rail">
          <div className="flex flex-col items-start gap-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:py-12">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight lg:text-2xl">
                Ready to start your career in tech?
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                Book a free demo class and see the lab before you decide.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/contact#enquire">Book Free Demo</ButtonLink>
              <a
                href={site.contact.phoneHref}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-foreground/15 px-5 text-sm font-medium transition-colors duration-300 hover:border-brand-600/30 hover:bg-brand-50"
              >
                <Icon name="phone" className="size-4" />
                {site.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Oversized wordmark watermark */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 190"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-auto w-full select-none"
      >
        <defs>
          <linearGradient id="footer-wordmark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-ink)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--color-brand-600)" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <text
          x="16"
          y="176"
          textAnchor="start"
          textLength="918"
          lengthAdjust="spacingAndGlyphs"
          className="font-display"
          style={{ fontSize: 200, fontWeight: 700 }}
          fill="url(#footer-wordmark)"
        >
          techcadd
        </text>
        <text
          x="926"
          y="176"
          textAnchor="start"
          className="font-display"
          style={{ fontSize: 200, fontWeight: 700 }}
          fill="url(#footer-wordmark)"
        >
          .
        </text>
      </svg>

      <div className="rail relative pt-16 pb-8 lg:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:gap-8">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {site.tagline}. An industry-focused IT and AI training centre in {site.city},
              training students and professionals since {site.founded}.
            </p>

            <address className="mt-6 space-y-3 text-sm not-italic text-muted">
              <a
                href={site.address.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2.5 transition-colors hover:text-brand-600"
              >
                <Icon name="map-pin" className="mt-0.5 size-4 shrink-0 text-brand-600" />
                <span>
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.address.city} {site.address.postalCode}
                </span>
              </a>
              <a
                href={site.contact.phoneHref}
                className="flex items-center gap-2.5 transition-colors hover:text-brand-600"
              >
                <Icon name="phone" className="size-4 shrink-0 text-brand-600" />
                {site.contact.phone}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-brand-600"
              >
                <Icon name="mail" className="size-4 shrink-0 text-brand-600" />
                {site.contact.email}
              </a>
              <p className="flex items-center gap-2.5">
                <Icon name="clock" className="size-4 shrink-0 text-brand-600" />
                {site.contact.hours}
              </p>
            </address>

            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-line bg-white text-muted transition-all duration-300 hover:border-brand-600/30 hover:text-brand-600"
                >
                  <Icon name={social.icon} className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="font-display text-sm font-bold tracking-tight">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Branch strip */}
        <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-8 text-sm">
          <span className="font-medium text-foreground">Our centres:</span>
          {branches.map((branch, i) => (
            <span key={branch.slug} className="text-muted">
              <Link
                href={`/branches/${branch.slug}`}
                className="transition-colors hover:text-brand-600"
              >
                {branch.name}
              </Link>
              {i < branches.length - 1 ? <span className="ml-3 opacity-40">·</span> : null}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-4 border-t border-line pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} techcadd Computer Education. All rights reserved. Built in {site.city}.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-brand-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating WhatsApp action */}
      <a
        href={site.contact.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed right-4 bottom-4 z-40 inline-flex size-13 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 transition-transform duration-300 hover:scale-105 lg:right-6 lg:bottom-6"
      >
        <Icon name="whatsapp" className="size-6" />
      </a>
    </footer>
  );
}
