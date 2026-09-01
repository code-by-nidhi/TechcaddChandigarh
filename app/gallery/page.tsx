import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail, SectionHeading, cx } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Gallery — Campus, Labs & Events`,
  description: `Inside the techcadd ${site.city} campus: classrooms, labs, workshops, summits and placement drives.`,
  alternates: { canonical: `${site.url}/gallery` },
};

/**
 * Photography is not yet supplied for the Chandigarh centre. Each tile below is
 * a captioned placeholder — drop a real image into `public/assets/gallery/` and
 * swap the tile for a <Image> with the same caption to go live.
 */
const tiles = [
  { caption: "Main lab, Sector 34-A", group: "Campus", span: "lg:col-span-2 lg:row-span-2" },
  { caption: "AI & GPU lab", group: "Campus" },
  { caption: "Cyber security range", group: "Campus" },
  { caption: "Classroom, morning batch", group: "Campus" },
  { caption: "Code review session", group: "Classroom", span: "lg:row-span-2" },
  { caption: "AI Summit keynote", group: "Events" },
  { caption: "App development workshop", group: "Events", span: "lg:col-span-2" },
  { caption: "Placement drive, interview hall", group: "Events" },
  { caption: "Student project showcase", group: "Events" },
  { caption: "Certificate distribution", group: "Students" },
  { caption: "Alumni meet", group: "Students" },
  { caption: "Doubt-clearing session", group: "Classroom" },
];

const groups = ["Campus", "Classroom", "Events", "Students"];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        eyebrow="Gallery"
        title="Inside the campus"
        body="Labs, classrooms, workshops and the events that fill the calendar between batches. Come and see it in person — walk-ins are welcome during working hours."
        meta={[
          { label: "Labs", value: "6 · 140 seats" },
          { label: "Location", value: "Sector 34-A" },
          { label: "Hours", value: site.contact.hours },
        ]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          <div className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <span
                key={group}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-muted"
              >
                {group}
              </span>
            ))}
          </div>

          <div className="mt-10 grid auto-rows-[11rem] grid-cols-2 gap-3 lg:grid-cols-4">
            {tiles.map((tile) => (
              <figure
                key={tile.caption}
                className={cx(
                  "group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-line bg-subtle p-5",
                  tile.span,
                )}
              >
                <span
                  aria-hidden="true"
                  className="hero-surface absolute inset-0 opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.14]"
                />
                <Icon
                  name="monitor"
                  className="absolute top-5 left-5 size-6 text-brand-600/40"
                  aria-hidden="true"
                />
                <figcaption className="relative">
                  <span className="block text-[11px] font-semibold uppercase tracking-widest text-brand-600">
                    {tile.group}
                  </span>
                  <span className="mt-1 block font-display text-sm font-bold tracking-tight">
                    {tile.caption}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted">
            Photographs of the {site.city} centre are being added. In the meantime, book a demo and
            see the labs yourself — there is no substitute for standing in the room.
          </p>
        </Rail>
      </section>

      <section className="bg-subtle py-16 lg:py-20">
        <Rail>
          <SectionHeading
            align="center"
            title="Visit the campus"
            body="Walk in during working hours, or book a demo class and sit through a full session."
          />
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
