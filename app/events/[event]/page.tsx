import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Icon, Rail } from "@/components/ui";
import { events, eventsBySlug } from "@/data/events";
import { formatDate } from "@/data/blog";
import { site } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((event) => ({ event: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ event: string }>;
}): Promise<Metadata> {
  const { event: slug } = await params;
  const event = eventsBySlug.get(slug);
  if (!event) return {};

  return {
    title: event.title,
    description: event.excerpt,
    alternates: { canonical: `${site.url}/events/${event.slug}` },
  };
}

export default async function EventPage({ params }: { params: Promise<{ event: string }> }) {
  const { event: slug } = await params;
  const event = eventsBySlug.get(slug);
  if (!event) notFound();

  const others = events.filter((e) => e.slug !== event.slug);

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
        meta={[
          { label: "Date", value: formatDate(event.date) },
          { label: "Venue", value: event.location },
          { label: "Entry", value: event.type === "Workshop" ? "Limited seats" : "Free" },
        ]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <div className="space-y-14">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">About this event</h2>
                <div className="mt-5 space-y-5 leading-relaxed text-muted">
                  {event.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">Agenda</h2>
                <ol className="mt-8 space-y-2">
                  {event.agenda.map((row) => (
                    <li
                      key={row.time}
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

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">Other events</h2>
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
                      <p className="mt-2 font-display font-bold leading-snug tracking-tight">
                        {other.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-line bg-white p-7 shadow-xl shadow-hero-950/5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon name="calendar" className="size-5" />
                  </span>
                  <div>
                    <p className="font-display font-bold tracking-tight">
                      {formatDate(event.date)}
                    </p>
                    <p className="text-xs text-muted">{event.location}</p>
                  </div>
                </div>
                <h2 className="mt-6 font-display text-lg font-bold tracking-tight">
                  Register your interest
                </h2>
                <p className="mt-2 text-sm text-muted">
                  We will confirm your seat and send directions.
                </p>
                <div className="mt-6">
                  <EnquiryForm compact />
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
