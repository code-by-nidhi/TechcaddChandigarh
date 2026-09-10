import Link from "next/link";
import { site } from "@/data/site";
import {
  processCadence,
  processSteps,
} from "@/data/content";
import { formatDate } from "@/data/blog";
import { getFaqs, getRecentPosts, getReviews } from "@/lib/cms";
import { CategoriesShowcase } from "@/components/sections/CategoriesShowcase";
import { FeaturedShowcase } from "@/components/sections/FeaturedShowcase";
import { TechBurst } from "@/components/sections/TechBurst";
import { Accordion } from "@/components/Accordion";
import { QuickDemoForm } from "@/components/EnquiryForm";
import { ButtonLink, cx, Eyebrow, Icon, Rail, SectionHeading } from "@/components/ui";
import { CountUp, Reveal } from "@/components/motion/Reveal";

/* ------------------------------- How it works ------------------------------- */

export function ProcessSection() {
  return (
    <section className="panel-surface py-20 text-white lg:py-28">
      <Rail>
        <SectionHeading
          onDark
          eyebrow="How it works"
          title="From Your First Step to Your Career Goal"
          body="Choosing a technology career can feel overwhelming. Which course should you choose? What skills do you need? How do you gain practical experience? How do you prepare for interviews?"
        />
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-pretty text-white lg:text-lg">
          techcadd makes the journey structured and easier to understand.
        </p>

        {/*
          Three across rather than the reference's single row of six: these
          steps carry two paragraphs each, and at six columns the measure drops
          below anything readable. The oversized ghosted numeral is what makes
          the layout, and it survives the wrap.
        */}
        <Reveal as="ol" stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step) => (
            <li
              key={step.step}
              className="group relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] p-7 backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-[1200ms] ease-[cubic-bezier(0.37,0,0.63,1)] hover:border-accent-400/40 hover:bg-white/[0.07] hover:shadow-[0_24px_70px_-30px_rgba(34,211,238,0.55)] motion-reduce:transition-none"
            >
              {/* Glow bloom, parked off the top edge and clipped by the card. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 left-1/2 size-52 -translate-x-1/2 rounded-full bg-accent-400/20 opacity-0 blur-[70px] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.37,0,0.63,1)] group-hover:opacity-100 motion-reduce:transition-none"
              />

              {/*
                The clip window is exactly one line box tall, so shifting the
                numeral down by half its own height hides its bottom half and
                leaves the layout height unchanged. Hover returns it to 0 and
                the whole glyph rises into view.

                Transition `translate`, NOT `transform`: Tailwind v4 compiles
                `translate-y-*` to the standalone `translate` property, so a
                transition listing only `transform` never fires and the numeral
                snaps. (`transition-transform` would also work — v4 expands it
                to transform, translate, scale, rotate — but the colour has to
                ride along here, so the pair is spelled out.)
              */}
              <span aria-hidden="true" className="relative block overflow-hidden">
                <span className="block translate-y-1/2 font-display text-[5.5rem] leading-[0.9] font-extrabold tracking-tighter text-white/10 transition-[translate,color] duration-[1400ms] ease-[cubic-bezier(0.37,0,0.63,1)] will-change-transform group-hover:translate-y-0 group-hover:text-accent-400 motion-reduce:transition-none lg:text-[6.5rem] wrap-anywhere">
                  {step.step}
                </span>
              </span>

              <h3 className="relative mt-5 font-display text-lg font-bold tracking-tight text-balance wrap-anywhere">
                {step.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-brand-100/85">{step.body}</p>
              <p className="relative mt-2.5 text-sm leading-relaxed text-brand-100/60">
                {step.note}
              </p>
            </li>
          ))}
        </Reveal>

        {/* -------------------------------- Cadence -------------------------------- */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 border-t border-white/12 pt-10">
          {processCadence.map((word, i) => (
            <span key={word} className="flex items-center gap-4">
              <span className="font-display text-xl font-bold tracking-tight lg:text-2xl wrap-anywhere">
                {word}
              </span>
              {i < processCadence.length - 1 ? (
                <Icon name="arrow-right" className="size-4 text-accent-400" />
              ) : null}
            </span>
          ))}
        </div>
      </Rail>
    </section>
  );
}

/* ------------------------------- Categories ------------------------------- */

export function CategoriesSection() {
  return (
    <section className="relative isolate overflow-hidden py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="drift-slow pointer-events-none absolute -top-1/4 left-1/2 -z-10 size-[46rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[150px]"
      />
      <Rail>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Course categories"
            title="Seven tracks, fifty-plus courses"
            body="Pick a direction first, then a duration. Counselling is free if you want help choosing."
          />
          <ButtonLink href="/courses" variant="secondary">
            All courses
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
        </div>
      </Rail>

      <div className="mt-12">
        <CategoriesShowcase />
      </div>

      <Rail>
        <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-line bg-subtle p-6 text-center sm:flex-row sm:text-left">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon name="rocket" className="size-5" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-base font-bold tracking-tight wrap-anywhere">
              Not sure which track?
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Answer four questions and we will suggest a track, a duration and a first project to
              build.
            </p>
          </div>
          <ButtonLink href="/tools/career-track-finder" variant="primary" size="sm" className="shrink-0">
            Find my track
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
        </div>
      </Rail>
    </section>
  );
}

/* ----------------------------- Featured courses ----------------------------- */

export function FeaturedSection() {
  return (
    <section className="relative isolate overflow-hidden py-20 lg:py-28">
      <Rail>
        <SectionHeading
          align="center"
          eyebrow="Featured courses"
          title="What most students are enrolling in"
          body="Every one of these runs with lab hours, a live client project and placement support."
        />
      </Rail>

      {/* Full-bleed on purpose: the outer cards should run off both edges. */}
      <div className="mt-12 lg:mt-16">
        <FeaturedShowcase />
      </div>

      <Rail>
        <div className="mt-12 text-center">
          <ButtonLink href="/courses" variant="primary" size="lg">
            Browse all courses
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
        </div>
      </Rail>
    </section>
  );
}

/* ------------------------------- Testimonials ------------------------------- */

export async function TestimonialsSection() {
  // Capped at nine: the grid is three columns, and the wall lives on /reviews.
  const testimonials = await getReviews({ limit: 9 });

  return (
    <section className="py-20 lg:py-28">
      <Rail>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Student reviews"
            title="What students say afterwards"
            body={`${site.stats.rating} out of 5 across ${site.stats.reviews} Google reviews, from an alumni network of ${site.stats.alumni}.`}
          />
          <div className="flex items-center gap-1 text-accent-yellow">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="star" className="size-5" />
            ))}
            <span className="ml-2 font-display text-lg font-bold text-foreground">
              {site.stats.rating}
            </span>
          </div>
        </div>

        <Reveal stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={`${testimonial.name}-${testimonial.quote.slice(0, 24)}`}
              className="flex flex-col rounded-2xl border border-line bg-white p-6"
            >
              <Icon name="quote" className="size-7 text-brand-200" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted wrap-anywhere">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-hero-950 text-xs font-bold text-white">
                  {testimonial.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{testimonial.name}</span>
                  <span className="block truncate text-xs text-muted">{testimonial.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </Reveal>

        <div className="mt-12 text-center">
          <ButtonLink href="/reviews" variant="secondary">
            Read all reviews
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
        </div>
      </Rail>
    </section>
  );
}

/* ------------------------------- Technologies ------------------------------- */

export function TechnologiesSection() {
  return (
    <section className="overflow-hidden py-20 lg:py-28">
      <Rail>
        <SectionHeading
          align="center"
          eyebrow="Technologies"
          title={`${site.stats.technologies} technologies taught and growing`}
          body="The stack changes constantly. We add tools when the job descriptions do, and remove them when hiring stops asking."
        />
      </Rail>

      <Rail className="mt-14">
        <TechBurst />
      </Rail>
    </section>
  );
}

/* ----------------------------------- FAQ ----------------------------------- */

/**
 * `items` stays a prop so a course page can pass its own shortlist. Left
 * unset, the questions come from the CMS — which is the homepage case.
 *
 * Dark is opt-in rather than the default: the homepage runs a strict
 * light/dark alternation and needs this block dark, but every other page that
 * uses it drops it directly above the dark {@link CtaSection}, where two dark
 * bands in a row would flatten the seam.
 */
export async function FaqSection({
  items,
  tone = "light",
}: {
  items?: { question: string; answer: string }[];
  tone?: "light" | "dark";
}) {
  const questions = items ?? (await getFaqs({ limit: 8 }));
  const onDark = tone === "dark";

  return (
    <section
      className={cx(
        "py-20 lg:py-28",
        onDark ? "panel-surface text-white" : "bg-subtle",
      )}
    >
      <Rail>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <SectionHeading
              onDark={onDark}
              eyebrow="FAQs"
              title="Questions we get every week"
              body="If yours is not here, call us — counselling is free and there is no obligation to enrol."
            />
            <ButtonLink
              href="/faq"
              variant={onDark ? "onDarkGhost" : "secondary"}
              className="mt-8"
            >
              All FAQs
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
          </div>
          <Accordion items={questions} onDark={onDark} />
        </div>
      </Rail>
    </section>
  );
}

/* ----------------------------------- Blog ----------------------------------- */

export async function BlogSection() {
  const recentPosts = await getRecentPosts(3);

  return (
    <section className="py-20 lg:py-28">
      <Rail>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="From the blog"
            title="Notes from the classroom and the codebase"
            body="Course guides, career scope and honest takes on what is actually changing."
          />
          <ButtonLink href="/blogs" variant="secondary">
            All articles
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
        </div>

        <Reveal stagger className="mt-14 grid gap-4 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <article
              key={post.slug}
              className="card-hover group relative flex flex-col rounded-2xl border border-line bg-white p-6"
            >
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
                  {post.category}
                </span>
                <span>{formatDate(post.date)}</span>
              </div>
              <h3 className="mt-5 font-display text-lg leading-snug font-bold tracking-tight wrap-anywhere">
                <Link href={`/blogs/${post.slug}`} className="before:absolute before:inset-0">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted wrap-anywhere">
                {post.excerpt}
              </p>
              <span className="mt-6 flex items-center justify-between border-t border-line pt-5 text-xs text-muted">
                {post.readTime}
                <Icon
                  name="arrow-right"
                  className="size-4 text-brand-600 transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </article>
          ))}
        </Reveal>
      </Rail>
    </section>
  );
}

/* ----------------------------------- CTA ----------------------------------- */

export function CtaSection() {
  return (
    <section className="hero-surface py-20 text-white lg:py-28">
      <Rail>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <Eyebrow onDark className="mb-5">
              Ready to get started?
            </Eyebrow>
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance lg:text-[2.75rem] lg:leading-[1.1] wrap-anywhere">
              Start building your career today
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-brand-100/80">
              Free counselling, no registration fee, and placement support included in every
              program. Leave your number and a counsellor will call you within one working day.
            </p>
            <div className="mt-8">
              <QuickDemoForm />
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Free career counselling", value: "No obligation to enrol", icon: "users" },
              { label: "No registration fee", value: "Pay only for the course", icon: "briefcase" },
              { label: "EMI options", value: "On programs of 6 months+", icon: "award" },
              { label: "Placement support", value: "Until you are placed", icon: "target" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/12 bg-white/[0.06] p-6 backdrop-blur-sm"
              >
                <Icon name={item.icon} className="size-6 text-accent-400" />
                <dt className="mt-4 font-display font-bold tracking-tight wrap-anywhere">{item.label}</dt>
                <dd className="mt-1 text-sm text-brand-100/70">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Rail>
    </section>
  );
}
