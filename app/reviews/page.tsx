import type { Metadata } from "next";
import { CmsPageHeader } from "@/components/CmsPageHeader";
import { CtaSection } from "@/components/sections/Home";
import { ButtonLink, Icon, Rail, SectionHeading, Stat } from "@/components/ui";
import { EmptyState } from "@/components/EmptyState";
import { getReviews, getTestimonials } from "@/lib/cms";
import { TestimonialWall } from "@/components/sections/TestimonialWall";
import { GoogleMark } from "@/components/GoogleMark";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Student Reviews — ${site.stats.rating}★ from ${site.stats.reviews} Ratings`,
  description: `What students say after finishing at techcadd ${site.city}: ${site.stats.rating} out of 5 across ${site.stats.reviews} Google reviews, from an alumni network of ${site.stats.alumni}.`,
  alternates: { canonical: `${site.url}/reviews` },
};

const distribution = [
  { stars: 5, share: 88 },
  { stars: 4, share: 9 },
  { stars: 3, share: 2 },
  { stars: 2, share: 1 },
  { stars: 1, share: 0 },
];

export default async function ReviewsPage() {
  // Two walls, one page: the videos lead because a face carries further than a
  // paragraph, and the written reviews follow as the volume behind them.
  const [allReviews, testimonials] = await Promise.all([getReviews(), getTestimonials()]);

  return (
    <>
      <CmsPageHeader
        route="reviews"
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

      {testimonials.length > 0 && (
        <section className="py-16 lg:py-20">
          <Rail>
            <SectionHeading
              eyebrow="In their own words"
              title="Hear it from the students"
              body="Short films recorded on campus. They play here on the page — you will not be sent anywhere."
            />
            <div className="mt-10">
              <TestimonialWall testimonials={testimonials} />
            </div>
          </Rail>
        </section>
      )}

      <section className={testimonials.length > 0 ? "bg-subtle py-16 lg:py-20" : "py-16 lg:py-20"}>
        <Rail>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <div>
              <div className="rounded-3xl border border-line bg-subtle p-8 text-center">
                <p className="font-display text-5xl font-extrabold tracking-tight wrap-anywhere">
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

            {allReviews.length === 0 ? (
              <EmptyState
                icon="quote"
                title="No written reviews published yet"
                body="None have been added to the site so far. The rating beside this is what students have left on Google, and you can read every one of them there — or book a demo and ask the batch yourself."
                action={
                  <ButtonLink href="/contact" variant="primary">
                    Book a demo class
                    <Icon name="arrow-right" className="size-4" />
                  </ButtonLink>
                }
              />
            ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {allReviews.map((review) => (
                <figure
                  key={`${review.name}-${review.quote.slice(0, 24)}`}
                  className="flex flex-col rounded-2xl border border-line bg-white p-6"
                >
                  {/* The stars the student actually gave. A review saved before
                      the rating field existed carries none and shows five. */}
                  <div className="flex items-center gap-1 text-accent-yellow">
                    {Array.from({ length: review.rating ?? 5 }).map((_, i) => (
                      <Icon key={i} name="star" className="size-4" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted wrap-anywhere">
                    {review.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-hero-950 text-xs font-bold text-white">
                      {review.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{review.name}</span>
                      <span className="block truncate text-xs text-muted">{review.role}</span>
                      <span className="mt-0.5 block truncate text-[11px] font-medium text-brand-600">
                        {review.course}
                      </span>
                    </span>

                    {/*
                      * Only when the editor has linked one. A card with no link
                      * is still a real review — it just cannot be checked at
                      * the source, so it does not pretend it can.
                      */}
                    {review.googleUrl ? (
                      <a
                        href={review.googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Read this review on Google"
                        aria-label={`Read the Google review from ${review.name}`}
                        className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition-colors hover:border-brand-600/30"
                      >
                        <GoogleMark className="size-4" />
                      </a>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
            )}
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
