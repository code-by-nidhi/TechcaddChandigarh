import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection, FaqSection } from "@/components/sections/Home";
import { CourseCard } from "@/components/CourseCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ButtonLink, Icon, Rail, SectionHeading } from "@/components/ui";
import { branches, branchesBySlug, serviceAreas } from "@/data/branches";
import { featuredCourses } from "@/data/courses";
import { faqs } from "@/data/content";
import { site } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return branches.map((branch) => ({ branch: branch.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ branch: string }>;
}): Promise<Metadata> {
  const { branch: slug } = await params;
  const branch = branchesBySlug.get(slug);
  if (!branch) return {};

  return {
    title: `techcadd ${branch.name} — IT & AI Training Centre`,
    description: `${branch.blurb} ${branch.address}. Call ${branch.phone} to book a free demo class.`,
    alternates: { canonical: `${site.url}/branches/${branch.slug}` },
  };
}

export default async function BranchPage({ params }: { params: Promise<{ branch: string }> }) {
  const { branch: slug } = await params;
  const branch = branchesBySlug.get(slug);
  if (!branch) notFound();

  const nearbyAreas = serviceAreas.filter((a) => a.nearestBranch === branch.slug);
  const others = branches.filter((b) => b.slug !== branch.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: `techcadd ${branch.name}`,
    telephone: branch.phone,
    address: { "@type": "PostalAddress", streetAddress: branch.address },
    parentOrganization: { "@type": "EducationalOrganization", name: site.name },
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Branches", href: "/branches" },
          { label: branch.name },
        ]}
        eyebrow={branch.isHead ? "Head campus" : "Centre"}
        title={`techcadd ${branch.name}`}
        body={branch.blurb}
        meta={[
          { label: "Locality", value: branch.locality },
          { label: "Labs", value: branch.labs },
          { label: "Phone", value: branch.phone },
          { label: "Hours", value: site.contact.hours },
        ]}
      >
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/contact#enquire" variant="onDark" size="lg">
            Book a free demo
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
          <a
            href={branch.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-13 items-center gap-2 rounded-full border border-white/25 px-7 text-[15px] font-semibold backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-white/10"
          >
            <Icon name="map-pin" className="size-4" />
            Get directions
          </a>
        </div>
      </PageHeader>

      <section className="py-16 lg:py-20">
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <div className="space-y-14">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  About this centre
                </h2>
                <p className="mt-5 leading-relaxed text-muted">{branch.blurb}</p>
                <p className="mt-4 leading-relaxed text-muted">
                  All {branches.length} techcadd centres run the same syllabus, the same assessments
                  and the same placement process. You can attend any centre, switch between them
                  mid-course, or move to online classes if your circumstances change.
                </p>

                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {branch.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-3 rounded-xl border border-line bg-white p-5"
                    >
                      <Icon name="check" className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                      <span className="text-sm leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">Getting here</h2>
                <div className="mt-6 rounded-2xl border border-line bg-subtle p-7">
                  <address className="space-y-3 text-sm not-italic">
                    <p className="flex gap-3">
                      <Icon name="map-pin" className="mt-0.5 size-4 shrink-0 text-brand-600" />
                      <span className="text-muted">{branch.address}</span>
                    </p>
                    <p className="flex gap-3">
                      <Icon name="phone" className="size-4 shrink-0 text-brand-600" />
                      <a href={branch.phoneHref} className="text-muted hover:text-brand-600">
                        {branch.phone}
                      </a>
                    </p>
                    <p className="flex gap-3">
                      <Icon name="clock" className="size-4 shrink-0 text-brand-600" />
                      <span className="text-muted">{site.contact.hours}</span>
                    </p>
                  </address>
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"
                  >
                    Open in Google Maps
                    <Icon name="arrow-up-right" className="size-4" />
                  </a>
                </div>
              </div>

              {nearbyAreas.length ? (
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    Areas served from {branch.name}
                  </h2>
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {nearbyAreas.map((area) => (
                      <Link
                        key={area.slug}
                        href={`/computer-training-in/${area.slug}`}
                        className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-brand-600/30 hover:text-brand-600"
                      >
                        {area.name}
                        <span className="ml-2 text-xs text-muted">{area.distance}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">Other centres</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {others.map((other) => (
                    <Link
                      key={other.slug}
                      href={`/branches/${other.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-5 py-4 transition-colors hover:border-brand-600/30 hover:bg-brand-50/40"
                    >
                      <span>
                        <span className="block font-medium">{other.name}</span>
                        <span className="mt-0.5 block text-xs text-muted">{other.locality}</span>
                      </span>
                      <Icon
                        name="arrow-right"
                        className="size-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-600"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-line bg-white p-7 shadow-xl shadow-hero-950/5">
                <h2 className="font-display text-lg font-bold tracking-tight">
                  Visit {branch.name}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Book a free demo class and see the labs before you decide.
                </p>
                <div className="mt-6">
                  <EnquiryForm compact />
                </div>
              </div>
            </aside>
          </div>
        </Rail>
      </section>

      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="Popular here"
            title={`Courses running at ${branch.name}`}
            body="Every course in the catalogue is available at this centre. These are the ones most students enrol in."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="mt-12">
            <ButtonLink href="/courses" variant="secondary">
              All courses
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
          </div>
        </Rail>
      </section>

      <FaqSection items={faqs.slice(0, 6)} />
      <CtaSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
