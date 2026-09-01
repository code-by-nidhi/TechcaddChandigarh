import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection, FaqSection } from "@/components/sections/Home";
import { CourseListRow } from "@/components/CourseCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ButtonLink, Icon, Rail, SectionHeading } from "@/components/ui";
import { branchFor, serviceAreas, serviceAreasBySlug } from "@/data/branches";
import { courseCategories, coursesByCategory } from "@/data/courses";
import { faqs } from "@/data/content";
import { site } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceAreas.map((area) => ({ area: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area: slug } = await params;
  const area = serviceAreasBySlug.get(slug);
  if (!area) return {};
  const branch = branchFor(area);

  return {
    title: `Computer Training in ${area.name} — IT & AI Courses`,
    description: `Computer, IT and AI training for students in ${area.name}. ${area.note} Nearest centre: techcadd ${branch.name}, ${branch.locality}.`,
    alternates: { canonical: `${site.url}/computer-training-in/${area.slug}` },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area: slug } = await params;
  const area = serviceAreasBySlug.get(slug);
  if (!area) notFound();

  const branch = branchFor(area);
  const otherAreas = serviceAreas.filter((a) => a.slug !== area.slug).slice(0, 8);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Branches", href: "/branches" },
          { label: area.name },
        ]}
        eyebrow="Local training"
        title={`Computer training in ${area.name}`}
        body={`${area.note} Students from ${area.name} train at our ${branch.name} centre — the same syllabus, assessments and placement support as every other techcadd campus.`}
        meta={[
          { label: "Nearest centre", value: branch.name },
          { label: "Distance", value: area.distance },
          { label: "Labs", value: branch.labs },
        ]}
      >
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/contact#enquire" variant="onDark" size="lg">
            Book a free demo
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
          <ButtonLink href={`/branches/${branch.slug}`} variant="onDarkGhost" size="lg">
            About the {branch.name} centre
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="py-16 lg:py-20">
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <div className="space-y-14">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Training for students from {area.name}
                </h2>
                <div className="mt-5 space-y-4 leading-relaxed text-muted">
                  <p>
                    We have trained students from {area.name} since long before we had a centre this
                    close. {area.note}
                  </p>
                  <p>
                    Batch timings at {branch.name} are set with commuters in mind — morning and
                    evening slots either side of college hours, plus weekend batches for anyone
                    travelling further. If commuting is genuinely difficult, the same courses run
                    online with the same trainers and the same project supervision.
                  </p>
                </div>

                <div className="mt-8 rounded-2xl border border-line bg-subtle p-7">
                  <h3 className="font-display font-bold tracking-tight">
                    Nearest centre: techcadd {branch.name}
                  </h3>
                  <address className="mt-4 space-y-2.5 text-sm not-italic text-muted">
                    <p className="flex gap-3">
                      <Icon name="map-pin" className="mt-0.5 size-4 shrink-0 text-brand-600" />
                      {branch.address}
                    </p>
                    <p className="flex gap-3">
                      <Icon name="phone" className="size-4 shrink-0 text-brand-600" />
                      <a href={branch.phoneHref} className="hover:text-brand-600">
                        {branch.phone}
                      </a>
                    </p>
                  </address>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <ButtonLink href={`/branches/${branch.slug}`} size="sm">
                      Centre details
                    </ButtonLink>
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-4 text-[13px] font-semibold transition-colors hover:border-brand-600/30 hover:bg-brand-50"
                    >
                      Directions
                      <Icon name="arrow-up-right" className="size-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Courses available
                </h2>
                <p className="mt-4 leading-relaxed text-muted">
                  The full catalogue is open to students from {area.name}. These are the tracks that
                  fill fastest.
                </p>
                <div className="mt-8 space-y-8">
                  {courseCategories.slice(0, 4).map((category) => (
                    <div key={category.id}>
                      <h3 className="font-display text-sm font-bold uppercase tracking-widest text-muted">
                        {category.short}
                      </h3>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {coursesByCategory(category.id)
                          .slice(0, 4)
                          .map((course) => (
                            <CourseListRow key={course.id} course={course} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
                <ButtonLink href="/courses" variant="secondary" className="mt-10">
                  All courses
                  <Icon name="arrow-right" className="size-4" />
                </ButtonLink>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-line bg-white p-7 shadow-xl shadow-hero-950/5">
                <h2 className="font-display text-lg font-bold tracking-tight">
                  Enquire from {area.name}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Free counselling — we will suggest a track and the nearest batch timing.
                </p>
                <div className="mt-6">
                  <EnquiryForm compact />
                </div>
              </div>
            </aside>
          </div>
        </Rail>
      </section>

      <section className="bg-subtle py-16 lg:py-20">
        <Rail>
          <SectionHeading eyebrow="Nearby" title="Other areas we serve" />
          <div className="mt-10 flex flex-wrap gap-2.5">
            {otherAreas.map((other) => (
              <Link
                key={other.slug}
                href={`/computer-training-in/${other.slug}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-brand-600/30 hover:text-brand-600"
              >
                {other.name}
              </Link>
            ))}
          </div>
        </Rail>
      </section>

      <FaqSection items={faqs.slice(0, 6)} />
      <CtaSection />
    </>
  );
}
