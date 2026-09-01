import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { FaqSection } from "@/components/sections/Home";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Icon, Rail, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { branches } from "@/data/branches";
import { faqs } from "@/data/content";

export const metadata: Metadata = {
  title: `Contact — Book a Free Demo Class in ${site.city}`,
  description: `Call ${site.contact.phone}, email ${site.contact.email}, or visit our ${site.city} campus. Free career counselling with no obligation to enrol.`,
  alternates: { canonical: `${site.url}/contact` },
};

const channels = [
  {
    icon: "phone",
    label: "Call us",
    value: site.contact.phone,
    href: site.contact.phoneHref,
    note: site.contact.hours,
  },
  {
    icon: "whatsapp",
    label: "WhatsApp",
    value: "Message us",
    href: site.contact.whatsapp,
    note: "Usually answered within an hour",
  },
  {
    icon: "mail",
    label: "Email",
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
    note: "Replies within one working day",
  },
  {
    icon: "map-pin",
    label: "Visit",
    value: `${site.address.line1}, ${site.address.city}`,
    href: site.address.mapUrl,
    note: "Walk in during working hours",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Contact"
        title="Talk to a counsellor before you decide anything"
        body="Career counselling is free and there is no obligation to enrol. Tell us your background and what you want to do next — if a course is wrong for you, we will say so."
        meta={[
          { label: "Phone", value: site.contact.phone },
          { label: "Hours", value: site.contact.hours },
          { label: "Centres", value: String(branches.length) },
        ]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="card-hover rounded-2xl border border-line bg-white p-6"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={channel.icon} className="size-5" />
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted">
                  {channel.label}
                </p>
                <p className="mt-1.5 font-display font-bold tracking-tight break-words">
                  {channel.value}
                </p>
                <p className="mt-2 text-xs text-muted">{channel.note}</p>
              </a>
            ))}
          </div>
        </Rail>
      </section>

      <section id="enquire" className="scroll-mt-24 bg-subtle py-16 lg:py-24">
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <SectionHeading
                eyebrow="Book a demo"
                title="Sit through a real class first"
                body="Any institute confident in its teaching will let you watch a session before you pay. Book a demo, see the lab, talk to students already in the batch, and decide afterwards."
              />

              <ul className="mt-10 space-y-3">
                {[
                  "Free career counselling with a senior trainer",
                  "No registration fee to book",
                  "Sit through a full class, not a sales pitch",
                  "Honest advice on duration and fit",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Icon name="check" className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                    <span className="text-sm leading-relaxed text-muted">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl border border-line bg-white p-6">
                <h3 className="font-display font-bold tracking-tight">Head campus</h3>
                <address className="mt-4 space-y-2.5 text-sm not-italic text-muted">
                  <p className="flex gap-3">
                    <Icon name="map-pin" className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    <span>
                      {site.address.line1}
                      <br />
                      {site.address.line2}
                      <br />
                      {site.address.city} {site.address.postalCode}
                    </span>
                  </p>
                  <p className="flex gap-3">
                    <Icon name="clock" className="size-4 shrink-0 text-brand-600" />
                    {site.contact.hours}
                  </p>
                </address>
                <a
                  href={site.address.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
                >
                  Open in Google Maps
                  <Icon name="arrow-up-right" className="size-4" />
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-7 lg:p-9">
              <h2 className="font-display text-xl font-bold tracking-tight">
                Request a call back
              </h2>
              <p className="mt-2 text-sm text-muted">
                A counsellor will call you within one working day.
              </p>
              <div className="mt-7">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </Rail>
      </section>

      <section className="py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="All centres"
            title="Prefer a campus closer to you?"
            body="Every centre runs the same syllabus and the same placement process."
          />
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <Link
                key={branch.slug}
                href={`/branches/${branch.slug}`}
                className="card-hover rounded-2xl border border-line bg-white p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display font-bold tracking-tight">{branch.name}</h3>
                  {branch.isHead ? (
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                      Head
                    </span>
                  ) : null}
                </div>
                <p className="mt-2.5 text-sm text-muted">{branch.address}</p>
                <p className="mt-4 text-sm font-medium text-brand-600">{branch.phone}</p>
              </Link>
            ))}
          </div>
        </Rail>
      </section>

      <FaqSection items={faqs} />
    </>
  );
}
