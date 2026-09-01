import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail } from "@/components/ui";
import { upcomingEvents } from "@/data/events";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Events — Summits, Workshops & Placement Drives in ${site.city}`,
  description: `AI summits, hands-on workshops, career seminars and on-campus placement drives at techcadd ${site.city}. Most are free and open to students from any institute.`,
  alternates: { canonical: `${site.url}/events` },
};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
        eyebrow="Events"
        title="Summits, workshops and placement drives"
        body="Most of these are free and open to students from any institute. The hands-on workshops have limited seats because they are limited by lab machines."
        meta={[
          { label: "Scheduled", value: String(upcomingEvents.length) },
          { label: "Venue", value: `${site.city} campus` },
        ]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <article
                key={event.slug}
                className="card-hover relative grid gap-6 rounded-2xl border border-line bg-white p-7 sm:grid-cols-[auto_1fr] sm:gap-8"
              >
                <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl bg-hero-950 px-6 py-5 text-white sm:w-24">
                  <span className="font-display text-2xl font-extrabold">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-brand-200">
                    {new Date(event.date).toLocaleDateString("en-IN", { month: "short" })}
                  </span>
                  <span className="mt-0.5 text-[11px] text-brand-100/60">
                    {new Date(event.date).getFullYear()}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
                      {event.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-muted">
                      <Icon name="map-pin" className="size-3.5" />
                      {event.location}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-balance">
                    <Link href={`/events/${event.slug}`} className="before:absolute before:inset-0">
                      {event.title}
                    </Link>
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted">{event.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                    Full agenda
                    <Icon name="arrow-right" className="size-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-10 text-sm text-muted">
            Dates shown are as scheduled at time of publishing. Call {site.contact.phone} to confirm
            before travelling, and to reserve a seat for the limited-capacity workshops.
          </p>
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
