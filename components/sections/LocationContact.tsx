import Link from "next/link";
import { Icon, Rail } from "@/components/ui";
import { site } from "@/data/site";

const fullAddress = `${site.shortName}, ${site.address.line1}, ${site.address.line2}, ${site.address.city} ${site.address.postalCode}`;
const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

const details = [
  {
    icon: "map-pin",
    label: "Address",
    value: (
      <>
        {site.address.line1}
        <br />
        {site.address.line2}
        <br />
        {site.address.city}, {site.state} {site.address.postalCode}
      </>
    ),
    action: { label: "Get Directions", href: site.address.mapUrl },
  },
  {
    icon: "phone",
    label: "Phone",
    value: site.contact.phone,
    action: { label: "Call Now", href: site.contact.phoneHref },
  },
  {
    icon: "mail",
    label: "Email",
    value: site.contact.email,
    action: { label: "Send Email", href: `mailto:${site.contact.email}` },
  },
  {
    icon: "clock",
    label: "Office Hours",
    value: site.contact.hours,
    action: null,
  },
];

export function LocationContact() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Rail>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-line">
            <iframe
              title={`${site.shortName} location map`}
              src={mapEmbedSrc}
              className="aspect-[4/3] w-full lg:aspect-auto lg:h-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {details.map((detail) => (
                <div key={detail.label} className="rounded-2xl border border-line bg-subtle p-5">
                  <div className="flex items-center gap-2 text-muted">
                    <Icon name={detail.icon} className="size-4 text-brand-600" />
                    <span className="text-xs font-semibold tracking-widest uppercase">
                      {detail.label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed font-semibold text-ink">
                    {detail.value}
                  </p>
                  {detail.action ? (
                    <a
                      href={detail.action.href}
                      target={detail.action.href.startsWith("http") ? "_blank" : undefined}
                      rel={detail.action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
                    >
                      {detail.action.label}
                      <Icon name="arrow-right" className="size-3.5" />
                    </a>
                  ) : null}
                </div>
              ))}
            </div>

            <Link
              href={site.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 transition-colors duration-200 hover:bg-emerald-100"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-500 text-white transition-transform duration-300 group-hover:scale-105">
                <Icon name="whatsapp" className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-emerald-800">Chat on WhatsApp</span>
                <span className="block text-xs text-emerald-700/80">
                  Get instant replies during office hours
                </span>
              </span>
            </Link>
          </div>
        </div>
      </Rail>
    </section>
  );
}
