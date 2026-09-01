import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail, SectionHeading, Stat } from "@/components/ui";
import { testimonials } from "@/data/content";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Student Reviews — ${site.stats.rating}★ from ${site.stats.reviews} Ratings`,
  description: `What students say after finishing at techcadd ${site.city}: ${site.stats.rating} out of 5 across ${site.stats.reviews} Google reviews, from an alumni network of ${site.stats.alumni}.`,
  alternates: { canonical: `${site.url}/reviews` },
};

const moreReviews = [
  {
    name: "Karan Malhotra",
    role: "DevOps Engineer, Mohali",
    course: "Cloud Computing & DevOps",
    initials: "KM",
    quote:
      "I had been a support engineer for three years and was stuck. The Kubernetes and Terraform modules were what actually moved me — six weeks after finishing I was running deployments instead of tickets.",
  },
  {
    name: "Ishita Rana",
    role: "SEO Executive, Chandigarh",
    course: "Digital Marketing",
    initials: "IR",
    quote:
      "We ran real campaigns with real budgets. Losing money on a badly targeted ad in week four taught me more than any case study could have.",
  },
  {
    name: "Manpreet Kaur",
    role: "MERN Developer, Panchkula",
    course: "MERN Stack",
    initials: "MK",
    quote:
      "The code reviews were brutal in the best way. My first pull request came back with eleven comments. By the end of the course they came back with one or two.",
  },
  {
    name: "Aditya Nair",
    role: "BCA Student, Kharar",
    course: "6 Weeks Industrial Training",
    initials: "AN",
    quote:
      "I needed the six-week training for university and expected to sit through slides. Instead I built and deployed something. The viva was the easiest exam I have had.",
  },
  {
    name: "Preeti Sharma",
    role: "Accounts Executive, Zirakpur",
    course: "Tally with GST",
    initials: "PS",
    quote:
      "I was returning to work after a long break and needed something practical. GST filing was covered properly, not just in theory. I was handling live books within a month of joining a firm.",
  },
  {
    name: "Vikram Chauhan",
    role: "Flutter Developer, Ambala",
    course: "Flutter App Development",
    initials: "VC",
    quote:
      "Publishing to the Play Store as part of the course was the detail that mattered. Every other candidate had a demo app; I had a link.",
  },
];

const allReviews = [...testimonials, ...moreReviews];

const distribution = [
  { stars: 5, share: 88 },
  { stars: 4, share: 9 },
  { stars: 3, share: 2 },
  { stars: 2, share: 1 },
  { stars: 1, share: 0 },
];

export default function ReviewsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
        eyebrow="Student reviews"
        title="What students say afterwards"
        body={`${site.stats.rating} out of 5 across ${site.stats.reviews} Google reviews. The ones below are a representative sample — including a hiring manager, because their view matters as much as ours.`}
        meta={[
          { label: "Rating", value: `${site.stats.rating} / 5` },
          { label: "Reviews", value: site.stats.reviews },
          { label: "Alumni", value: site.stats.alumni },
          { label: "Placement rate", value: site.stats.placement },
        ]}
      />

      <section className="py-16 lg:py-20">
        <Rail>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <div>
              <div className="rounded-3xl border border-line bg-subtle p-8 text-center">
                <p className="font-display text-5xl font-extrabold tracking-tight">
                  {site.stats.rating}
                </p>
                <div className="mt-3 flex justify-center gap-1 text-accent-yellow">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" className="size-5" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted">
                  Based on {site.stats.reviews} Google reviews
                </p>

                <dl className="mt-8 space-y-2 text-left">
                  {distribution.map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <dt className="w-10 shrink-0 text-xs font-medium text-muted">
                        {row.stars}★
                      </dt>
                      <dd className="flex-1">
                        <span className="block h-2 overflow-hidden rounded-full bg-line">
                          <span
                            className="block h-full rounded-full bg-brand-600"
                            style={{ width: `${row.share}%` }}
                          />
                        </span>
                      </dd>
                      <span className="w-9 shrink-0 text-right text-xs text-muted">
                        {row.share}%
                      </span>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Stat value={site.stats.alumni} label="Students trained" />
                <Stat value={site.stats.partners} label="Hiring partners" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {allReviews.map((review) => (
                <figure
                  key={review.name}
                  className="flex flex-col rounded-2xl border border-line bg-white p-6"
                >
                  <div className="flex items-center gap-1 text-accent-yellow">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon key={i} name="star" className="size-4" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                    {review.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-hero-950 text-xs font-bold text-white">
                      {review.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{review.name}</span>
                      <span className="block truncate text-xs text-muted">{review.role}</span>
                      <span className="mt-0.5 block truncate text-[11px] font-medium text-brand-600">
                        {review.course}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Rail>
      </section>

      <section className="bg-subtle py-16 lg:py-20">
        <Rail>
          <SectionHeading
            align="center"
            title="Want to hear it unfiltered?"
            body="Book a demo class and talk to students already in the batch. We will not be in the room."
          />
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
