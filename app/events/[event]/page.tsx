import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { ButtonLink, Icon, Rail } from "@/components/ui";
import { EventGallery } from "@/components/EventGallery";
import { getEvent, getEvents } from "@/lib/cms";
import { formatDate } from "@/data/blog";
import { site } from "@/data/site";

/**
 * An event published in the CMS after the last build must still resolve, so
 * unknown slugs render on demand. `getEvent` returns null for one neither the
 * CMS nor the static set knows, and that is what still produces a 404.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({ event: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ event: string }>;
}): Promise<Metadata> {
  const { event: slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};

  return {
    title: event.title,
    description: event.excerpt,
    alternates: { canonical: `${site.url}/events/${event.slug}` },
  };
}

export default async function EventPage({ params }: { params: Promise<{ event: string }> }) {
  const { event: slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const others = (await getEvents()).filter((e) => e.slug !== event.slug);

  const gallery = event.photos ?? [];

  /*
   * Compared as `YYYY-MM-DD` strings, not Dates: the API stores a DATE, and
   * building a Date from it introduces a timezone that can shift the
   * comparison across midnight either way. A multi-day event counts as running
   * until its last day.
   */
  const today = new Date().toISOString().slice(0, 10);
  const past = (event.endDate || event.date) < today;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    description: event.excerpt,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: event.location },
    organizer: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: event.type },
        ]}
        eyebrow={event.type}
        title={event.title}
        body={event.excerpt}
        /*
          * Built from what the CMS actually holds. This used to guess — "Free"
          * unless the type was Workshop — which was wrong for any paid seminar
          * and ignored the fee an editor had typed in.
          */
        meta={[
          {
            label: event.endDate ? "Dates" : "Date",
            value: event.endDate
              ? `${formatDate(event.date)} – ${formatDate(event.endDate)}`
              : formatDate(event.date),
          },
          ...(event.startTime ? [{ label: "Starts", value: event.startTime }] : []),
          ...(event.location ? [{ label: "Venue", value: event.location }] : []),
          { label: "Type", value: event.type },
        ]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <div className="space-y-14">
              {gallery.length > 0 ? (
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight wrap-anywhere">
                    {past ? "How it went" : "From previous editions"}
                  </h2>
                  <div className="mt-8">
                    <EventGallery photos={gallery} eventTitle={event.title} />
                  </div>
                </div>
              ) : null}

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight wrap-anywhere">About this event</h2>

                {/*
                  * A CMS event arrives as one rich-text document; the static
                  * ones are authored as paragraph arrays. Whichever the event
                  * has is what renders, so both kinds coexist.
                  */}
                {event.html ? (
                  <div
                    className="cms-prose mt-5"
                    dangerouslySetInnerHTML={{ __html: event.html }}
                  />
                ) : (
                  <div className="mt-5 space-y-5 leading-relaxed text-muted">
                    {event.body.map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>

              {event.agenda.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight wrap-anywhere">Agenda</h2>
                <ol className="mt-8 space-y-2">
                  {event.agenda.map((row, i) => (
                    <li
                      // A day-based agenda can repeat a label ("Day 1" twice),
                      // so the index is part of the key.
                      key={`${row.time}-${i}`}
                      className="flex gap-6 rounded-xl border border-line bg-white px-5 py-4"
                    >
                      <span className="w-16 shrink-0 font-display text-sm font-bold text-brand-600">
                        {row.time}
                      </span>
                      <span className="text-sm leading-relaxed">{row.item}</span>
                    </li>
                  ))}
                </ol>
              </div>
              )}

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight wrap-anywhere">Other events</h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {others.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/events/${other.slug}`}
                      className="card-hover rounded-xl border border-line bg-white p-5"
                    >
                      <p className="text-xs font-semibold text-brand-600">
                        {formatDate(other.date)}
                      </p>
                      <p className="mt-2 font-display font-bold leading-snug tracking-tight wrap-anywhere">
                        {other.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/*
              * Not sticky.
              *
              * It used to follow the scroll, which meant a short panel of
              * fixed facts — a date, a venue — rode down the page alongside
              * the photographs and the agenda, competing with whatever the
              * reader had actually scrolled to. It is reference material you
              * glance at once, so it stays where it was put.
              */}
            <aside className="lg:self-start">
              {/*
                * Details, not a booking form.
                *
                * An event here is a record of something the institute ran —
                * mostly one that has already happened. Nobody registers for
                * last September, so the panel says what it was and when, and
                * points at the events that are still ahead.
                */}
              <div className="rounded-2xl border border-line bg-white p-7 shadow-xl shadow-hero-950/5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon name="calendar" className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-bold tracking-tight">
                      {event.endDate
                        ? `${formatDate(event.date)} – ${formatDate(event.endDate)}`
                        : formatDate(event.date)}
                    </p>
                    <p className="text-xs text-muted">{past ? "Completed" : "Upcoming"}</p>
                  </div>
                </div>

                <dl className="mt-6 space-y-4 border-t border-line pt-6 text-sm">
                  {event.startTime ? (
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-widest text-muted">
                        Time
                      </dt>
                      <dd className="mt-1 wrap-anywhere">{event.startTime}</dd>
                    </div>
                  ) : null}
                  {event.location ? (
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-widest text-muted">
                        Venue
                      </dt>
                      <dd className="mt-1 wrap-anywhere">{event.location}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-widest text-muted">
                      Format
                    </dt>
                    <dd className="mt-1">{event.type}</dd>
                  </div>
                  {gallery.length > 0 ? (
                    <div>
                      <dt className="text-[11px] font-bold uppercase tracking-widest text-muted">
                        Photographs
                      </dt>
                      <dd className="mt-1">{gallery.length}</dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-7 border-t border-line pt-6">
                  <p className="text-sm leading-relaxed text-muted">
                    {past
                      ? "We run events like this through the year. See what is coming up next."
                      : "Open to students from any institute. Call us to confirm a place."}
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <ButtonLink href="/events" variant="secondary">
                      All events
                      <Icon name="arrow-right" className="size-4" />
                    </ButtonLink>
                    <a
                      href={site.contact.phoneHref}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line text-sm font-medium transition-colors hover:border-brand-600/30"
                    >
                      <Icon name="phone" className="size-4" />
                      {site.contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Rail>
      </section>

      <CtaSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
