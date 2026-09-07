"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon, Rail, cx } from "@/components/ui";
import { site } from "@/data/site";

interface Desk {
  id: string;
  tab: string;
  icon: string;
  initials: string;
  name: string;
  body: string;
  link?: { href: string; label: string };
}

const desks: Desk[] = [
  {
    id: "student",
    tab: "Student Support",
    icon: "graduation-cap",
    initials: "SD",
    name: "Student Desk",
    body: "For enrolled and prospective students — courses, batch timing and general enquiries.",
  },
  {
    id: "college",
    tab: "College Support",
    icon: "layers",
    initials: "CS",
    name: "College Desk",
    body: "For colleges and universities exploring training partnerships and campus workshops.",
    link: { href: "/college-partnerships", label: "See how we work with colleges" },
  },
  {
    id: "placement",
    tab: "Placement Cell",
    icon: "briefcase",
    initials: "PC",
    name: "Placement Desk",
    body: "For recruiters and hiring partners looking to hire from our current batches.",
  },
  {
    id: "franchise",
    tab: "Franchise Enquiry",
    icon: "rocket",
    initials: "FE",
    name: "Franchise Desk",
    body: "For entrepreneurs interested in opening a techcadd centre in their city.",
  },
];

/**
 * Every desk routes through the same phone/email/WhatsApp — this is a small
 * organisation with one central line, not four separate departments, so we
 * don't invent contact details that don't exist.
 */
export function SupportDesks() {
  const [activeId, setActiveId] = useState(desks[0].id);
  const desk = desks.find((d) => d.id === activeId) ?? desks[0];

  return (
    <section className="bg-subtle py-16 lg:py-24">
      <Rail>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-brand-600 sm:text-4xl">
            Support &amp; Assistance
          </h2>
          <p className="mt-3 text-base text-muted">
            Get personalised support for your educational journey.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_60px_-35px_rgba(15,23,42,0.3)] lg:grid lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col gap-2.5 bg-gradient-to-br from-brand-600 to-brand-500 p-5">
            {desks.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveId(d.id)}
                aria-pressed={d.id === activeId}
                className={cx(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-white transition-colors duration-200",
                  d.id === activeId ? "bg-white/25" : "bg-white/10 hover:bg-white/15",
                )}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/15">
                  <Icon name={d.icon} className="size-4.5" />
                </span>
                {d.tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center lg:p-9">
            <span className="grid size-20 shrink-0 place-items-center self-start rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-display text-xl font-bold text-white shadow-[0_16px_32px_-10px_rgba(37,99,235,0.55)] sm:self-center">
              {desk.initials}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-xl font-bold tracking-tight text-ink">{desk.name}</h3>
              <p className="text-sm font-semibold text-brand-600">{desk.tab}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{desk.body}</p>

              <div className="mt-4 space-y-1.5 text-sm text-muted">
                <p className="flex items-center gap-2">
                  <Icon name="phone" className="size-4 shrink-0 text-brand-600" />
                  {site.contact.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="mail" className="size-4 shrink-0 text-brand-600" />
                  {site.contact.email}
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="map-pin" className="size-4 shrink-0 text-brand-600" />
                  {site.shortName} {site.city} Campus
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <a
                  href={site.contact.phoneHref}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-brand-700"
                >
                  <Icon name="phone" className="size-3.5" />
                  Call Now
                </a>
                <a
                  href={site.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-emerald-600"
                >
                  <Icon name="whatsapp" className="size-3.5" />
                  WhatsApp
                </a>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-amber-600"
                >
                  <Icon name="mail" className="size-3.5" />
                  Email
                </a>
              </div>

              {desk.link ? (
                <Link
                  href={desk.link.href}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                >
                  {desk.link.label}
                  <Icon name="arrow-right" className="size-3" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_45px_-30px_rgba(15,23,42,0.25)]">
          <span aria-hidden="true" className="block h-1 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-400" />
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                <Icon name="calendar" className="size-5" />
              </span>
              <div>
                <h3 className="font-display font-bold tracking-tight text-ink">
                  Schedule Virtual Counselling
                </h3>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-muted">
                  Book a free 1:1 virtual counselling session. Pick your date and time slot — a{" "}
                  {site.shortName} advisor will call you personally.
                </p>
              </div>
            </div>
            <Link
              href="/contact#enquire"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-700"
            >
              Book Counselling Session
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        </div>
      </Rail>
    </section>
  );
}
