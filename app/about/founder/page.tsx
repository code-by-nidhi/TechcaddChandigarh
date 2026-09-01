import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail, SectionHeading, Stat } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Founder — The Story Behind ${site.name}`,
  description: `Why techcadd was founded in ${site.founded}, and the teaching principles that have not changed since.`,
  alternates: { canonical: `${site.url}/about/founder` },
};

const principles = [
  {
    title: "Teach the tool, not the theory about the tool",
    body: "A student who has configured a deployment pipeline once understands more than one who has read three chapters about continuous integration. Lab time is not a supplement to the lecture — it is the lecture.",
  },
  {
    title: "Trainers must still be practitioners",
    body: "The moment a trainer stops writing production code, their teaching starts drifting towards what was true a few years ago. Every technical trainer here works on client projects.",
  },
  {
    title: "Say no to the wrong student",
    body: "Enrolling someone in a course that does not fit their timeline or background is a short-term gain and a long-term loss. Free counselling exists so that conversation happens before money changes hands.",
  },
  {
    title: "Projects with real consequences",
    body: "A practice project has no deadline, no client and no cost to failing. A live project has all three, and it is the only kind that teaches what a job actually feels like.",
  },
];

export default function FounderPage() {
  const years = new Date().getFullYear() - site.founded;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Founder" },
        ]}
        eyebrow="Founder"
        title="The idea was simple: teach what companies actually hire for"
        body={`techcadd began in ${site.founded} with one classroom, a handful of machines and a conviction that most computer training was teaching the wrong things convincingly. ${years} years later that conviction has not softened.`}
      />

      <section className="py-16 lg:py-24">
        <Rail>
          <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <div className="space-y-6 leading-relaxed text-muted">
              <p className="text-lg text-foreground">
                &ldquo;Every year I met students who had done everything they were told to do — good
                marks, a degree, a certificate or two — and still could not build anything. That gap
                was not their fault. It was a teaching problem, and it was fixable.&rdquo;
              </p>
              <p>
                The first batches ran in a single room with second-hand machines. What made them
                work was not the equipment. It was that every session ended with students having
                built something that ran, and that the person teaching had shipped software for a
                living.
              </p>
              <p>
                That model scaled awkwardly at first. Hiring trainers who were both good engineers
                and willing to teach turned out to be the constraint on how fast we could grow, and
                it still is. We have consistently chosen to open a new centre slowly rather than
                staff it with people reading from a manual.
              </p>
              <p>
                The technologies have turned over completely — several times. Desktop publishing
                gave way to web development, which gave way to full-stack, which now shares the
                floor with AI and agent systems. The principles below are the part that has stayed
                fixed.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Stat value={String(site.founded)} label="Founded" />
              <Stat value={site.stats.alumni} label="Students trained" />
              <Stat value={site.stats.partners} label="Hiring partners" />
              <Stat value={`${site.stats.rating}★`} label={`${site.stats.reviews} Google reviews`} />
            </div>
          </div>
        </Rail>
      </section>

      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="Principles"
            title="Four rules we have not broken"
            body="These are the ones we return to whenever a decision about the syllabus, a hire or a new centre is genuinely difficult."
          />
          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            {principles.map((principle, i) => (
              <div key={principle.title} className="rounded-2xl border border-line bg-white p-7">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-hero-950 font-display text-sm font-bold text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">
                  {principle.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{principle.body}</p>
              </div>
            ))}
          </div>
        </Rail>
      </section>

      <section className="py-16 lg:py-24">
        <Rail>
          <div className="hero-surface rounded-3xl p-10 text-white lg:p-16">
            <Icon name="quote" className="size-9 text-brand-200" />
            <blockquote className="mt-6 max-w-3xl font-display text-xl leading-relaxed font-semibold text-balance lg:text-2xl">
              A certificate is worth exactly what the person holding it can demonstrate. Our job is
              to make sure that is a lot.
            </blockquote>
            <p className="mt-6 text-sm text-brand-100/70">Founder, techcadd Computer Education</p>
          </div>
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
