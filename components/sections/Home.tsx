import Link from "next/link";
import { site } from "@/data/site";
import {
  differences,
  formatCards,
  includedItems,
  processSteps,
  techGroups,
  testimonials,
  faqs,
} from "@/data/content";
import { featuredCourses } from "@/data/courses";
import { recentPosts, formatDate } from "@/data/blog";
import { CourseCard } from "@/components/CourseCard";
import { Accordion } from "@/components/Accordion";
import { QuickDemoForm } from "@/components/EnquiryForm";
import { ButtonLink, Eyebrow, Icon, Rail, SectionHeading } from "@/components/ui";
import { CountUp, Reveal } from "@/components/motion/Reveal";

/* ---------------------------------- About ---------------------------------- */

export function AboutSection() {
  const years = new Date().getFullYear() - site.founded;

  return (
    <section className="panel-surface py-20 text-white lg:py-28">
      <Rail>
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-20">
          <div>
            <SectionHeading
              onDark
              eyebrow="About techcadd"
              title={`Two decades of turning students into engineers`}
              body={`Since ${site.founded} we have taught the tools companies are hiring for right now — not the ones that were current when the syllabus was written. Every technical trainer here still writes production code on client projects, which is why the answer to "how is this done in a real company" is a demonstration rather than a guess.`}
            />
            <p className="mt-5 max-w-2xl leading-relaxed text-brand-100/70">
              {years} years, {site.stats.alumni} alumni and {site.stats.partners} hiring partners
              later, the format has not changed much: small batches, a trainer in the room, and a
              live project you can actually talk about in an interview.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/about" variant="onDark">
                Our story
                <Icon name="arrow-right" className="size-4" />
              </ButtonLink>
              <ButtonLink href="/about/founder" variant="onDarkGhost">
                Meet the founder
              </ButtonLink>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-200">
              Training formats
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {formatCards.map((card) => (
                <Link
                  key={card.duration}
                  href={card.href}
                  className="group rounded-2xl border border-white/12 bg-white/[0.06] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10"
                >
                  <p className="font-display text-xl font-bold tracking-tight">{card.duration}</p>
                  <p className="mt-1 text-sm font-medium text-brand-100">{card.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-brand-100/60">{card.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-400 transition-transform duration-300 group-hover:translate-x-1">
                    Details
                    <Icon name="arrow-right" className="size-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Rail>
    </section>
  );
}

/* ------------------------------- How it works ------------------------------- */

export function ProcessSection() {
  return (
    <section className="py-20 lg:py-28">
      <Rail>
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="From first enquiry to first offer"
          body="Four stages, in the same order for every student, with a person accountable at each one."
        />

        <Reveal as="ol" stagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <li key={step.step} className="relative">
              {i < processSteps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-6 left-14 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r from-line to-transparent lg:block"
                />
              ) : null}
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-hero-950 font-display text-sm font-bold text-white">
                {step.step}
              </span>
              <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </Reveal>
      </Rail>
    </section>
  );
}

/* ----------------------------- Featured courses ----------------------------- */

export function FeaturedSection() {
  return (
    <section className="py-20 lg:py-28">
      <Rail>
        <SectionHeading
          align="center"
          eyebrow="Featured courses"
          title="What most students are enrolling in"
          body="Every one of these runs with lab hours, a live client project and placement support."
        />
        <Reveal stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.slice(0, 9).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </Reveal>
        <div className="mt-12 text-center">
          <ButtonLink href="/courses" variant="secondary" size="lg">
            Browse all courses
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
        </div>
      </Rail>
    </section>
  );
}

/* ------------------------------- Differences ------------------------------- */

export function DifferenceSection() {
  return (
    <section className="bg-subtle py-20 lg:py-28">
      <Rail>
        <SectionHeading
          eyebrow="Why techcadd"
          title="The techcadd difference"
          body="Four things we do differently, and how you can verify each one before you enrol."
        />
        <Reveal stagger className="mt-14 grid gap-4 lg:grid-cols-2">
          {differences.map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-white p-7">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-lg font-bold tracking-tight">{item.title}</h3>
                {item.stat ? (
                  <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-700">
                    {item.stat}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </Reveal>
      </Rail>
    </section>
  );
}

/* ------------------------------- Testimonials ------------------------------- */

export function TestimonialsSection() {
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
              key={testimonial.name}
              className="flex flex-col rounded-2xl border border-line bg-white p-6"
            >
              <Icon name="quote" className="size-7 text-brand-200" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">
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

/* --------------------------------- Included --------------------------------- */

export function IncludedSection() {
  return (
    <section className="panel-surface py-20 text-white lg:py-28">
      <Rail>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading
            onDark
            eyebrow="Included, not extra"
            title="Five things in every program"
            body="No upsells at the end of the course. These are part of what you already paid for."
          />
          <Reveal as="ul" stagger className="space-y-3">
            {includedItems.map((item, i) => (
              <li
                key={item.title}
                className="flex gap-5 rounded-2xl border border-white/12 bg-white/[0.06] p-5 backdrop-blur-sm"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-400 font-display text-sm font-bold text-hero-950">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-display font-bold tracking-tight">{item.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-brand-100/70">
                    {item.body}
                  </span>
                </span>
              </li>
            ))}
          </Reveal>
        </div>
      </Rail>
    </section>
  );
}

/* ------------------------------- Technologies ------------------------------- */

export function TechnologiesSection() {
  const marquee = techGroups.flatMap((g) => g.items).slice(0, 40);

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

      <div
        className="relative mt-14 flex select-none gap-3 overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
        aria-hidden="true"
      >
        <div className="marquee-track flex shrink-0 gap-3">
          {[...marquee, ...marquee].map((tool, i) => (
            <span
              key={`${tool}-${i}`}
              className="shrink-0 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium whitespace-nowrap text-muted"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      <Rail className="mt-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {techGroups.map((group) => (
            <div key={group.name}>
              <h3 className="font-display text-sm font-bold tracking-tight">{group.name}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{group.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </Rail>
    </section>
  );
}

/* ----------------------------------- FAQ ----------------------------------- */

export function FaqSection({ items = faqs }: { items?: typeof faqs }) {
  return (
    <section className="bg-subtle py-20 lg:py-28">
      <Rail>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="FAQs"
              title="Questions we get every week"
              body="If yours is not here, call us — counselling is free and there is no obligation to enrol."
            />
            <ButtonLink href="/faq" variant="secondary" className="mt-8">
              All FAQs
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
          </div>
          <Accordion items={items} />
        </div>
      </Rail>
    </section>
  );
}

/* ----------------------------------- Blog ----------------------------------- */

export function BlogSection() {
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
              <h3 className="mt-5 font-display text-lg leading-snug font-bold tracking-tight">
                <Link href={`/blogs/${post.slug}`} className="before:absolute before:inset-0">
                  {post.title}
                </Link>
              </h3>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
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
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance lg:text-[2.75rem] lg:leading-[1.1]">
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
                <dt className="mt-4 font-display font-bold tracking-tight">{item.label}</dt>
                <dd className="mt-1 text-sm text-brand-100/70">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Rail>
    </section>
  );
}
