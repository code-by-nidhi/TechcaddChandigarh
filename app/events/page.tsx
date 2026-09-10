import type { Metadata } from "next";
import Link from "next/link";
import { CmsPageHeader } from "@/components/CmsPageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail } from "@/components/ui";
import { getEvents } from "@/lib/cms";
import type { CampusEvent } from "@/data/events";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Events — Summits, Workshops & Placement Drives in ${site.city}`,
  description: `AI summits, hands-on workshops, career seminars and on-campus placement drives at techcadd ${site.city}. Free and open to students from any institute.`,
  alternates: { canonical: `${site.url}/events` },
};

function EventCard({ event }: { event: CampusEvent }) {
  const photos = event.photos?.length ?? 0;

  return (
    <article className="card-hover relative grid gap-6 rounded-2xl border border-line bg-white p-7 sm:grid-cols-[auto_1fr] sm:gap-8">
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
          {/*
            * A photo count, because on a past event the pictures are the
            * reason to open the page — and the card should say they are there.
            */}
          {photos > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-muted">
              <Icon name="image" className="size-3.5" />
              {photos} photo{photos === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>
        <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-balance wrap-anywhere">
          <Link href={`/events/${event.slug}`} className="before:absolute before:inset-0">
            {event.title}
          </Link>
        </h2>
        <p className="mt-3 leading-relaxed text-muted">{event.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
          {photos > 0 ? "Photos and full details" : "Full details"}
          <Icon name="arrow-right" className="size-4" />
        </span>
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const all = await getEvents();

  /*
   * Compared as `YYYY-MM-DD` strings, the same way the event page does it: the
   * API stores a DATE, and building a Date from it introduces a timezone that
   * can shift the comparison across midnight either way. A multi-day event
   * counts as running until its last day.
   */
  const today = new Date().toISOString().slice(0, 10);
  const isPast = (event: CampusEvent) => (event.endDate || event.date) < today;

  // Upcoming reads forwards — soonest first, because that is the next thing to
  // turn up to. Past reads backwards, because the most recent is the most
  // relevant record of what the institute runs.
  const upcoming = all.filter((e) => !isPast(e)).sort((a, b) => a.date.localeCompare(b.date));
  const past = all.filter(isPast).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <CmsPageHeader
        route="events"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Events" }]}
        eyebrow="Events"
        title="Summits, workshops and placement drives"
        body={`Everything we run at the ${site.city} campus, and a record of what we have run before. Free and open to students from any institute.`}
        meta={[
          ...(upcoming.length > 0
            ? [{ label: "Coming up", value: String(upcoming.length) }]
            : []),
          ...(past.length > 0 ? [{ label: "Held so far", value: String(past.length) }] : []),
          { label: "Venue", value: `${site.city} campus` },
        ]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          {upcoming.length > 0 ? (
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Coming up</h2>
              <div className="mt-8 space-y-4">
                {upcoming.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>

              <p className="mt-8 text-sm text-muted">
                Dates are as scheduled at time of publishing. Call {site.contact.phone} to confirm
                before travelling.
              </p>
            </div>
          ) : null}

          {past.length > 0 ? (
            /* Spaced away from the upcoming set so the two do not read as one
               continuous calendar running into the past. */
            <div className={upcoming.length > 0 ? "mt-20 border-t border-line pt-16" : ""}>
              <h2 className="font-display text-2xl font-bold tracking-tight">Already held</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                What the campus has hosted — with photographs from the day.
              </p>
              <div className="mt-8 space-y-4">
                {past.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            </div>
          ) : null}

          {all.length === 0 ? (
            <p className="text-muted">
              Nothing scheduled just now. Call {site.contact.phone} and we will tell you what is
              next.
            </p>
          ) : null}
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
