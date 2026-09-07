import Link from "next/link";
import type { Course } from "@/data/courses";
import { site } from "@/data/site";
import { testimonials } from "@/data/content";
import { Icon, SectionHeading, ButtonLink } from "./ui";

/* ------------------------------ Stats strip ------------------------------ */

export function CourseStatsStrip() {
  const stats = [
    { value: site.stats.alumni, label: "Students trained" },
    { value: `${site.stats.rating}★`, label: "Google rating" },
    { value: String(site.founded), label: "Training since" },
    { value: "100%", label: "Practical, project-based" },
  ];
  return (
    <div className="relative isolate overflow-hidden rounded-[24px] bg-gradient-to-br from-[#050B1D] via-[#081B3A] to-[#0F2E6D] p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_15%_10%,rgba(30,136,255,0.25),transparent_70%),radial-gradient(50%_70%_at_90%_90%,rgba(0,212,255,0.18),transparent_70%)]"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-2xl font-extrabold tracking-tight text-[#00D4FF]">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium text-white/65">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Toolchain -------------------------------- */

export function ToolchainPanel({ course }: { course: Course }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[24px] bg-gradient-to-br from-[#050B1D] via-[#081B3A] to-[#0F2E6D] p-7 lg:p-9">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_85%_15%,rgba(0,212,255,0.2),transparent_70%)]"
      />
      <h2 className="font-display text-2xl font-bold tracking-tight text-white">
        The toolchain behind the craft
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
        Everything below is installed on the lab machines and used on live client work, not shown
        once in a slide and forgotten.
      </p>
      <div className="mt-7 flex flex-wrap gap-2.5">
        {course.tools.map((tool) => (
          <span
            key={tool}
            className="rounded-lg border border-[#00D4FF]/25 bg-white/5 px-3.5 py-2 text-sm font-medium text-[#00D4FF]"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Eligibility -------------------------------- */

const PERSONAS: { icon: string; title: string; body: (name: string) => string }[] = [
  {
    icon: "graduation-cap",
    title: "Students after 12th",
    body: (name) =>
      `Join from any stream. You start ${name} from fundamentals with no assumed knowledge, and most students run it alongside a degree using the weekday or weekend batch.`,
  },
  {
    icon: "award",
    title: "Graduates & final-year students",
    body: (name) =>
      `If you are finishing a degree, ${name} is a short route from graduation to a job application with something to show. Enter placement season with project work in hand instead of a blank CV.`,
  },
  {
    icon: "briefcase",
    title: "Working professionals",
    body: () =>
      "The weekend and evening batches exist for people already earning. Career switchers typically become interview-ready within five to six months without leaving their current job.",
  },
  {
    icon: "target",
    title: "Business owners & freelancers",
    body: (name) =>
      `Owners take ${name} to stop outsourcing work they cannot judge for themselves. Freelancers take it to bill clients beyond ${site.city}, since a remote skill is not limited by location.`,
  },
  {
    icon: "refresh",
    title: "Career restarters",
    body: () =>
      "A gap on the CV counts for less than work you can point at. The course starts at zero and finishes with a portfolio and a documented internship letter — what an interviewer actually asks about after a break.",
  },
  {
    icon: "sparkles",
    title: "Self-taught learners",
    body: () =>
      "If free videos left you with notes but nothing finished, what changes here is a trainer who reviews what you built this week, and a deadline attached to every module.",
  },
];

export function EligibilitySection({ course }: { course: Course }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight">Who can do this course</h2>
      <p className="mt-4 leading-relaxed text-muted">
        {course.name} is built for people at several different starting points, and the batch is
        deliberately mixed. What matters more than your background is turning up consistently and
        finishing what each module asks you to build.
      </p>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2">
        {PERSONAS.map((persona, i) => (
          <li key={persona.title} className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 font-display text-xs font-bold text-brand-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-base font-bold tracking-tight">
                  {persona.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {persona.body(course.name)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------ The case for it ------------------------------ */

export function CaseForCourse({ course }: { course: Course }) {
  const cards = [
    {
      icon: "target",
      title: "Real local demand",
      body: `${course.name} sits behind roles that keep appearing on ${site.city} job boards. That gap is the whole argument for a structured course: there is local demand, and there are very few trained people to hand the work to.`,
    },
    {
      icon: "users",
      title: "Supervised live work",
      body: "What separates this from a playlist of tutorials is supervision on real work. You build on live client briefs with a trainer beside you, make decisions that have consequences, and correct them the following week. No employer takes your word for it without work they can inspect.",
    },
    {
      icon: "chart",
      title: "Honest pay expectations",
      body: `Roles this opens include ${course.careers.slice(0, 3).join(", ")}. Pay depends on the portfolio you can show, not the certificate alone — use the free salary estimator below for an honest range rather than a brochure number.`,
      cta: { href: "/tools/salary-estimator", label: "Open the salary estimator" },
    },
    {
      icon: "shield",
      title: "A structured alternative",
      body: "The alternative is what most people try first: free videos, a cheap online course, months of drifting, and knowledge you cannot demonstrate. A live-project mentor, an internship letter and a placement cell that actually calls employers is the difference between knowing the subject and being hired to do it.",
    },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight">
        Why this course is worth your time
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <div key={card.title} className="rounded-2xl border border-line bg-white p-6">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name={card.icon} className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-bold tracking-tight">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
            {card.cta ? (
              <Link
                href={card.cta.href}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600"
              >
                {card.cta.label}
                <Icon name="arrow-right" className="size-3.5" />
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- What you will build --------------------------- */

export function ProjectsSection({ course }: { course: Course }) {
  const modules = course.modules;
  const first = modules[0];
  const second = modules[1] ?? first;
  const last = modules[modules.length - 1];

  const projects = [
    {
      step: "01",
      title: `${first?.title ?? "Foundations"} build`,
      body: `Your first working piece, applying ${(first?.topics ?? []).slice(0, 2).join(" and ").toLowerCase()} end to end rather than as isolated exercises.`,
      tags: (first?.topics ?? []).slice(0, 2),
    },
    {
      step: "02",
      title: `${second?.title ?? "Applied"} challenge`,
      body: `Work with a real, messier brief covering ${(second?.topics ?? []).slice(0, 2).join(" and ").toLowerCase()}, and defend the choices you made to a trainer.`,
      tags: (second?.topics ?? []).slice(0, 2),
    },
    {
      step: "03",
      title: "Live client brief",
      body: "A genuine requirement from techcadd's delivery pipeline, scoped, built and shipped under supervision. This is the one interviewers ask about.",
      tags: ["Live work", "Supervised"],
    },
    {
      step: "04",
      title: "Portfolio capstone",
      body: `A ${course.name.toLowerCase()} project you specify yourself, covering ${(last?.topics ?? []).slice(0, 2).join(" and ").toLowerCase()}, presented as your final piece.`,
      tags: (last?.topics ?? []).slice(0, 2),
    },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight">
        What you will actually build
      </h2>
      <p className="mt-4 leading-relaxed text-muted">
        The syllabus is arranged so every module produces something you keep rather than a set of
        notes. Modules run in the order a real project runs: foundations first, then applied work,
        then supervised client work, then the portfolio piece that turns all of it into an offer
        letter.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <div key={project.step} className="rounded-2xl border border-line bg-white p-6">
            <span className="font-display text-xs font-bold text-brand-600">{project.step}</span>
            <h3 className="mt-2 font-display text-base font-bold tracking-tight">
              {project.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.body}</p>
            {project.tags.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-line bg-subtle px-2.5 py-1 text-xs font-medium text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Working loop -------------------------------- */

export function WorkingLoopSection() {
  const steps = [
    {
      title: "Understand",
      body: "Break a real requirement into a clear plan and the right tools.",
      project: "Foundations build",
    },
    {
      title: "Build",
      body: "Work hands-on with trainer feedback while the decisions are still easy to change.",
      project: "Applied challenge",
    },
    {
      title: "Present",
      body: "Turn the finished work into a portfolio story you can defend in an interview.",
      project: "Live client brief",
    },
  ];
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight">
        Learn it. Build it. Make it yours.
      </h2>
      <p className="mt-4 leading-relaxed text-muted">
        Every project moves through the same loop: understand the brief, build with guidance, then
        explain the decisions behind your work.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-2xl border border-line bg-subtle p-6">
            <span className="grid size-9 place-items-center rounded-full bg-brand-600 font-display text-xs font-bold text-white">
              {i + 1}
            </span>
            <h3 className="mt-4 font-display text-base font-bold tracking-tight">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            <p className="mt-3 text-xs font-semibold text-brand-600">{step.project}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Career FAQs ------------------------------- */

export function CareerFaqSection({ course }: { course: Course }) {
  const roles = course.careers.join(", ");
  const qas = [
    {
      q: `What job roles open up after ${course.name}?`,
      a: `Graduates typically move into ${roles}. These sit behind roles that keep appearing on ${site.city} job listings, so demand is real rather than assumed.`,
    },
    {
      q: "What can I earn, and how fast does it grow?",
      a: "Pay depends on the portfolio you can show more than the certificate alone. Use the free salary estimator for an honest range by role, experience and employer type rather than a brochure number.",
    },
    {
      q: "Can I freelance or work remotely with this skill?",
      a: `Yes. A ${site.city} address costs you nothing on a remote brief. The course covers client handling and reporting so you can price and defend your work, not just do it.`,
    },
    {
      q: `Which industries hire for this around ${site.city}?`,
      a: "IT services firms, product startups and a growing set of local businesses across the tricity now hire directly for these skills, not only large employers.",
    },
    {
      q: "Can I continue to higher studies or a specialisation later?",
      a: "The certificate and portfolio stand on their own, and they stack. Most students move on to an adjacent techcadd track — the tools overlap, so the second course is faster than the first.",
    },
  ];
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight">Where this course takes you</h2>
      <div className="mt-8 space-y-4">
        {qas.map((qa) => (
          <div key={qa.q} className="rounded-2xl border border-line bg-white p-6">
            <p className="font-display text-base font-bold tracking-tight">{qa.q}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{qa.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Why techcadd ------------------------------ */

export function WhyTechcaddSection() {
  const years = new Date().getFullYear() - site.founded;
  const cards = [
    {
      title: "Trainers who still do the work",
      body: "Your trainer is not a full-time lecturer. They deliver client projects alongside teaching, so examples in class are current rather than a case study from years ago.",
    },
    {
      title: "Live projects, real consequences",
      body: "You work on genuine client requirements under supervision. This is where a portfolio comes from, and it is the first thing an interviewer asks to see.",
    },
    {
      title: "Small batches and open lab hours",
      body: "Batches stay small enough that a trainer sees your screen daily. Lab time runs outside class hours and doubt sessions continue until the concept lands.",
    },
    {
      title: "Internship letter and certificate",
      body: "Every student finishes with an industry-recognised certificate and a documented internship on real work, accepted for university industrial training requirements.",
    },
    {
      title: "A placement cell that persists",
      body: `Mock interviews, CV reviews and drives with ${site.stats.partners} hiring partners, repeated after a rejection, not abandoned.`,
    },
    {
      title: `Since ${site.founded}, ${site.stats.alumni} students`,
      body: `${years}+ years of hiring relationships in the region is why a call from our placement cell gets answered and why local employers know what our certificate means.`,
    },
  ];
  return (
    <div>
      <SectionHeading
        eyebrow="Why techcadd"
        title="Why students choose techcadd"
        body={`There are many places to learn this in ${site.city}, and the brochure syllabus looks similar at all of them. What differs is who teaches, whether you ever touch real work, and whether anyone picks up the phone after you have paid.`}
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className="rounded-2xl border border-line bg-white p-6">
            <h3 className="font-display text-base font-bold tracking-tight">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- Comparison table ---------------------------- */

const COMPARISON_ROWS = [
  { feature: "Curriculum", techcadd: "Industry-aligned, updated regularly", other: "Often outdated or generic" },
  { feature: "Learning style", techcadd: "100% hands-on, project-based", other: "Mostly theory-heavy" },
  { feature: "Trainers", techcadd: "Industry-experienced, still deliver client work", other: "Mixed experience levels" },
  { feature: "Real projects", techcadd: "Multiple real-world projects plus a capstone", other: "Limited or simulated projects" },
  { feature: "Code review", techcadd: "Every assignment reviewed line by line by a mentor", other: "Assignments marked pass or fail" },
  { feature: "Placement support", techcadd: "Dedicated career and interview preparation", other: "Often limited or absent" },
  { feature: "Batch flexibility", techcadd: "Weekday, evening and weekend options", other: "Fixed schedules" },
  { feature: "Certification", techcadd: "Industry-recognised certificate plus internship letter", other: "Varies" },
];

export function ComparisonTable({ course }: { course: Course }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight">How techcadd compares</h2>
      <p className="mt-4 leading-relaxed text-muted">
        {course.name} is taught in many places, which is exactly why the differences matter. These
        are the things worth asking before you pay any institute, including this one.
      </p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-subtle text-left">
              <th className="p-4 font-display font-bold">Feature</th>
              <th className="p-4 font-display font-bold text-brand-600">techcadd</th>
              <th className="p-4 font-display font-bold text-muted">Other institutes</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={row.feature} className={i % 2 ? "bg-subtle/50" : undefined}>
                <td className="border-t border-line p-4 font-medium">{row.feature}</td>
                <td className="border-t border-line p-4 text-ink">{row.techcadd}</td>
                <td className="border-t border-line p-4 text-muted">{row.other}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        The right-hand column describes what is commonly offered in the market, not any particular
        institute. Ask any institute you are considering — this one included — to show you the work
        its students actually produced.
      </p>
    </div>
  );
}

/* ------------------------------- Testimonials ------------------------------- */

export function CourseTestimonials({ course }: { course: Course }) {
  const nameLower = course.name.toLowerCase();
  const matches = testimonials.filter(
    (t) =>
      t.course.toLowerCase().includes(nameLower.split(" ")[0]) ||
      nameLower.includes(t.course.toLowerCase()) ||
      t.course.toLowerCase() === nameLower,
  );
  if (!matches.length) return null;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight">
        What our students say
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {matches.slice(0, 4).map((t) => (
          <figure key={t.name} className="rounded-2xl border border-line bg-white p-6">
            <blockquote className="text-sm leading-relaxed text-muted">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                {t.initials}
              </span>
              <span>
                <span className="block text-xs font-bold">{t.name}</span>
                <span className="block text-[11px] text-muted">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Staged syllabus ----------------------------- */

export function StagedSyllabus({ course }: { course: Course }) {
  const modules = course.modules;
  const mid = Math.ceil(modules.length / 2);
  const stage1 = modules.slice(0, mid);
  const stage2 = modules.slice(mid);
  const stage3Items = [
    "A live client project you keep in your portfolio",
    "Documented internship on real work",
    "CV review, mock interviews and aptitude drills",
    "Placement drives with our hiring partner network",
  ];

  const rows: { title: string; stages: [boolean, boolean, boolean] }[] = [
    ...stage1.map((m) => ({ title: m.title, stages: [true, true, true] as [boolean, boolean, boolean] })),
    ...stage2.map((m) => ({ title: m.title, stages: [false, true, true] as [boolean, boolean, boolean] })),
    ...stage3Items.map((title) => ({ title, stages: [false, false, true] as [boolean, boolean, boolean] })),
  ];

  const stageMeta = [
    { title: "Foundations & Core Skills", count: stage1.length },
    { title: "Applied Work", count: stage2.length },
    { title: "Live Project & Placement Prep", count: stage3Items.length },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight">How the course is staged</h2>
      <p className="mt-4 leading-relaxed text-muted">
        {course.name} runs as three stages inside one enrolment. A tick shows the stage each
        capability first appears in — the ladder is cumulative, so a later stage builds on the
        earlier ones instead of replacing them.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stageMeta.map((s, i) => (
          <div key={s.title} className="rounded-2xl border border-line bg-white p-5 text-center">
            <span className="font-display text-xs font-bold text-brand-600">Stage {i + 1}</span>
            <p className="mt-1 font-display text-sm font-bold tracking-tight">{s.title}</p>
            <p className="mt-1 text-xs text-muted">{s.count} capabilities</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[500px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-subtle text-left">
              <th className="p-4 font-display font-bold">Module</th>
              <th className="p-4 text-center font-display font-bold">Stage 1</th>
              <th className="p-4 text-center font-display font-bold">Stage 2</th>
              <th className="p-4 text-center font-display font-bold">Stage 3</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.title} className={i % 2 ? "bg-subtle/50" : undefined}>
                <td className="border-t border-line p-4 font-medium">
                  <span className="mr-2 font-display text-xs text-brand-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {row.title}
                </td>
                {row.stages.map((on, si) => (
                  <td key={si} className="border-t border-line p-4 text-center">
                    {on ? (
                      <Icon name="check" className="mx-auto size-4 text-emerald-600" />
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Every stage sits inside the one programme: nothing is dropped as you move up, and nothing
        is charged for twice.
      </p>
    </div>
  );
}

/* -------------------------------- Get started -------------------------------- */

export function GetStartedStrip({ course }: { course: Course }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[24px] bg-gradient-to-br from-[#050B1D] via-[#081B3A] to-[#0F2E6D] p-8 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(30,136,255,0.25),transparent_70%)]"
      />
      <h2 className="font-display text-xl font-bold tracking-tight text-white">
        Get started today
      </h2>
      <p className="mt-2 text-sm text-white/65">Not sure if {course.name} is the right fit?</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/65">
        One call with a counsellor is usually enough to find out. Book a free demo class and see
        the lab before you decide.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <a
          href={site.contact.phoneHref}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium text-white transition-colors hover:border-[#00D4FF]/50 hover:bg-white/5"
        >
          <Icon name="phone" className="size-4 text-[#00D4FF]" />
          {site.contact.phone}
        </a>
        <ButtonLink href="/contact#enquire" size="lg" variant="onDark">
          Book a free demo
          <Icon name="arrow-right" className="size-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
