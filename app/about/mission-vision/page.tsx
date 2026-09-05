import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { FutureCareerForm } from "@/components/sections/FutureCareerForm";
import { Icon, Rail, SectionHeading, cx } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Mission & Vision — ${site.name}`,
  description: `What ${site.name} is working towards: employable graduates, a current curriculum, and training that is affordable for the students who need it most.`,
  alternates: { canonical: `${site.url}/about/mission-vision` },
};

const pillars = [
  {
    icon: "target",
    title: "Our mission",
    paragraphs: [
      "To close the gap between what students are taught and what employers actually need — by teaching current tools in real labs, on real projects, with trainers who still practise what they teach.",
      "Every decision about a syllabus, a batch size or a new centre gets checked against one question: does this make our graduates more employable, or does it just make us bigger?",
    ],
  },
  {
    icon: "rocket",
    title: "Our vision",
    paragraphs: [
      "A tricity where a student from any background — any degree, any college, any family income — can reach a genuine technology career within a year, without leaving the region to do it.",
      "That means keeping training affordable, keeping the curriculum ahead of local hiring, and building enough employer trust that a techcadd portfolio is taken seriously on its own.",
    ],
  },
];

/**
 * Left to right the row alternates top/bottom for the zigzag timeline; the
 * "top" set is the three primary pillars, the "bottom" set the two
 * supporting ones — same five items, just interleaved for the visual.
 */
const missionFramework = [
  {
    icon: "compass",
    nodeIcon: "globe",
    title: "Make Technology Accessible",
    body: "Keeping fees honest and pathways open, so a real tech career isn't limited by where a student started.",
    position: "top" as const,
  },
  {
    icon: "code",
    nodeIcon: "code",
    title: "Prioritize Practical Learning",
    body: "Real labs, real projects, and trainers who still ship production work — not slides read aloud.",
    position: "bottom" as const,
  },
  {
    icon: "briefcase",
    nodeIcon: "briefcase",
    title: "Build Industry-Ready Talent",
    body: "Training built around what companies are hiring for right now, not what was current when the syllabus was written.",
    position: "top" as const,
  },
  {
    icon: "rocket",
    nodeIcon: "refresh",
    title: "Encourage Continuous Upskilling",
    body: "Technology keeps moving, so the curriculum — and the habit of learning — never really stops.",
    position: "bottom" as const,
  },
  {
    icon: "layers",
    nodeIcon: "network",
    title: "Expand the Learning Ecosystem",
    body: "Growing the centre network and course catalogue without diluting the one thing that matters: employability.",
    position: "top" as const,
  },
];

const visionPillars = [
  { icon: "graduation-cap", text: "Creating future-ready technology professionals" },
  { icon: "monitor", text: "Promoting practical and industry-oriented education" },
  { icon: "sparkles", text: "Encouraging innovation and continuous learning" },
  { icon: "cloud", text: "Supporting India's digital transformation" },
  { icon: "shield", text: "Building a trusted name in software, services, and technology education" },
];

export default function MissionVisionPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Mission & Vision" },
        ]}
        eyebrow="Mission & vision"
        title="What we are actually trying to build"
        body="Not the largest training network in the region — the one whose graduates are most obviously employable. Those are different goals and they occasionally conflict."
      />

      {/* ------------------------------ Mission & vision framework ------------------------------ */}
      <section className="relative isolate overflow-hidden bg-white py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: "radial-gradient(rgba(30,136,255,0.14) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
          }}
        />
        <div
          aria-hidden="true"
          className="drift-slow pointer-events-none absolute top-10 left-[6%] -z-10 size-40 rounded-full border border-brand-300/40"
        />
        <div
          aria-hidden="true"
          className="drift-slow-reverse pointer-events-none absolute right-[8%] bottom-6 -z-10 size-28 rounded-full border border-accent-400/30"
        />

        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Our mission"
            title="Bridging Education with Industry"
            body={pillars[0].paragraphs[0]}
          />

          {/* Desktop: horizontal alternating timeline */}
          <Reveal className="relative mt-20 hidden lg:block">
            <div
              aria-hidden="true"
              className="absolute top-1/2 right-[6%] left-[6%] h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-brand-400/70 to-transparent"
            />
            <div className="relative grid grid-cols-5 gap-4">
              {missionFramework.map((item) => (
                <div key={item.title} className="relative flex h-[380px] flex-col items-center">
                  <div className="group absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {/* crosshair marks */}
                    <span aria-hidden="true" className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2">
                      <span className="absolute top-0 left-1/2 h-2.5 w-px -translate-x-1/2 bg-brand-300/50 transition-colors duration-300 group-hover:bg-brand-400/80" />
                      <span className="absolute bottom-0 left-1/2 h-2.5 w-px -translate-x-1/2 bg-brand-300/50 transition-colors duration-300 group-hover:bg-brand-400/80" />
                      <span className="absolute top-1/2 left-0 h-px w-2.5 -translate-y-1/2 bg-brand-300/50 transition-colors duration-300 group-hover:bg-brand-400/80" />
                      <span className="absolute top-1/2 right-0 h-px w-2.5 -translate-y-1/2 bg-brand-300/50 transition-colors duration-300 group-hover:bg-brand-400/80" />
                    </span>

                    {/* floating particles */}
                    <span aria-hidden="true" className="float-slow absolute -top-5 -left-3 size-1.5 rounded-full bg-brand-400/50" />
                    <span
                      aria-hidden="true"
                      className="float-slow absolute -right-4 -bottom-4 size-1 rounded-full bg-accent-400/60"
                      style={{ animationDelay: "1.2s" }}
                    />

                    {/* outer glow */}
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-xl transition-opacity duration-300 ease-out group-hover:opacity-100"
                      style={{ background: "radial-gradient(circle, rgba(0,212,255,0.6), transparent 70%)" }}
                    />

                    {/* node circle */}
                    <span
                      className="relative grid size-16 place-items-center rounded-full bg-gradient-to-br from-[#1E88FF] to-[#00D4FF] shadow-[0_0_0_6px_rgba(30,136,255,0.12),0_10px_28px_-8px_rgba(30,136,255,0.6),inset_0_1px_2px_rgba(255,255,255,0.5),inset_0_-6px_10px_rgba(5,11,29,0.15)] ring-1 ring-white/30 transition-transform duration-300 ease-out group-hover:scale-105"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-white/0 to-transparent"
                      />
                      <Icon
                        name={item.nodeIcon}
                        className="relative size-7 text-white drop-shadow-[0_1px_3px_rgba(5,11,29,0.4)]"
                      />
                    </span>
                  </div>

                  <div
                    className={cx(
                      "absolute flex w-[92%] flex-col items-center rounded-[20px] border border-hero-950/5 bg-white p-5 text-center shadow-[0_20px_45px_-25px_rgba(8,27,58,0.35)] transition-transform duration-300 hover:-translate-y-1",
                      item.position === "top" ? "bottom-[calc(50%+3rem)]" : "top-[calc(50%+3rem)]",
                    )}
                  >
                    <span
                      className={cx(
                        "grid size-12 place-items-center rounded-2xl text-white",
                        item.position === "top"
                          ? "bg-[#050B1D]"
                          : "bg-gradient-to-br from-[#1E88FF] to-[#00D4FF]",
                      )}
                    >
                      <Icon name={item.icon} className="size-6" />
                    </span>
                    <h3 className="mt-3 font-display text-sm leading-snug font-bold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink-soft">{item.body}</p>
                  </div>

                  <span
                    aria-hidden="true"
                    className={cx(
                      "absolute left-1/2 w-px -translate-x-1/2 bg-brand-300/60",
                      item.position === "top"
                        ? "top-[calc(50%-2.6rem)] h-[2.6rem]"
                        : "top-1/2 h-[2.6rem]",
                    )}
                  />
                </div>
              ))}
            </div>
          </Reveal>

          {/* Tablet: simple 2-column grid */}
          <div className="mt-16 hidden sm:grid sm:grid-cols-2 sm:gap-6 lg:hidden">
            {missionFramework.map((item) => (
              <div
                key={item.title}
                className="rounded-[20px] border border-hero-950/5 bg-white p-6 shadow-[0_20px_45px_-25px_rgba(8,27,58,0.35)]"
              >
                <span
                  className={cx(
                    "grid size-12 place-items-center rounded-2xl text-white",
                    item.position === "top"
                      ? "bg-[#050B1D]"
                      : "bg-gradient-to-br from-[#1E88FF] to-[#00D4FF]",
                  )}
                >
                  <Icon name={item.icon} className="size-6" />
                </span>
                <h3 className="mt-4 font-display text-sm leading-snug font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Mobile: vertical connected timeline */}
          <div className="relative mt-14 space-y-8 sm:hidden">
            <div
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-6 w-px bg-gradient-to-b from-transparent via-brand-400/70 to-transparent"
            />
            {missionFramework.map((item) => (
              <div key={item.title} className="relative flex gap-4 pl-0">
                <span
                  className={cx(
                    "relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl text-white",
                    item.position === "top"
                      ? "bg-[#050B1D]"
                      : "bg-gradient-to-br from-[#1E88FF] to-[#00D4FF]",
                  )}
                >
                  <Icon name={item.icon} className="size-6" />
                </span>
                <div className="rounded-[20px] border border-hero-950/5 bg-white p-5 shadow-[0_20px_45px_-25px_rgba(8,27,58,0.35)]">
                  <h3 className="font-display text-sm leading-snug font-bold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Rail>
      </section>

      {/* ------------------------------------ Our vision ------------------------------------ */}
      <section className="relative isolate overflow-hidden bg-white py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: "radial-gradient(rgba(30,136,255,0.14) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
          }}
        />

        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Our vision"
            title="Building India's Future-Ready Technology Workforce"
            body="techcadd envisions contributing to an India where skilled engineers, technology professionals, and digitally capable young people are prepared to participate confidently in the evolving technology economy."
          />

          <Reveal className="mx-auto mt-14 flex max-w-md items-center gap-4 rounded-3xl bg-gradient-to-br from-[#050B1D] to-[#081B3A] p-6 text-white shadow-[0_30px_60px_-25px_rgba(5,11,29,0.55)]">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#1E88FF] to-[#00D4FF]">
              <Icon name="target" className="size-7 text-white" />
            </span>
            <span>
              <span className="block text-[11px] font-bold tracking-[0.2em] text-brand-300 uppercase">
                Our vision
              </span>
              <span className="block font-display text-xl leading-tight font-bold tracking-tight">
                Future-ready by 2030
              </span>
            </span>
          </Reveal>

          <ul className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {visionPillars.map((pillar, index) => (
              <li
                key={pillar.text}
                className={cx(
                  "flex flex-col items-start gap-4 rounded-[20px] border border-hero-950/5 bg-white p-6 shadow-[0_20px_45px_-25px_rgba(8,27,58,0.35)] transition-transform duration-300 hover:-translate-y-1",
                  index < 3 ? "lg:col-span-2" : "lg:col-span-3",
                )}
              >
                <span
                  className={cx(
                    "grid size-12 shrink-0 place-items-center rounded-2xl text-white",
                    index % 2 === 0
                      ? "bg-[#050B1D]"
                      : "bg-gradient-to-br from-[#1E88FF] to-[#00D4FF]",
                  )}
                >
                  <Icon name={pillar.icon} className="size-6" />
                </span>
                <p className="text-sm leading-relaxed font-semibold text-ink">{pillar.text}</p>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-14 max-w-2xl text-center text-sm leading-relaxed text-ink-soft">
            The organization&rsquo;s publicly stated vision is to help make India a hub of
            well-trained engineers and technical professionals and establish a globally trusted
            name in software and services.
          </p>
        </Rail>
      </section>

      {/* ------------------------------------ Our future ------------------------------------ */}
      <section className="relative isolate overflow-hidden bg-subtle py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-8 left-[8%] size-8 rounded-full border border-brand-300/60"
        />
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Our future"
            title="From learning technology to creating technology."
            body="techcadd aims to keep evolving with emerging fields such as Artificial Intelligence, Cloud Computing, Cyber Security, Data Science, Automation and other future-facing technologies, helping learners stay relevant in a rapidly changing digital world."
          />
        </Rail>
      </section>

      {/* --------------------------------- Ready to get started --------------------------------- */}
      <section className="relative isolate overflow-hidden border-t border-line bg-subtle py-20 lg:py-24">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Ready to get started?"
            title="Start building your career today."
            body="Talk to a counsellor today. One call is usually enough to know which track fits your degree, your schedule and the job you want."
          />

          <div className="mt-10">
            <FutureCareerForm />
          </div>

          <a
            href={site.contact.phoneHref}
            className="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full bg-gradient-to-r from-[#1E88FF] to-[#00D4FF] px-6 py-3 text-white shadow-[0_16px_32px_-12px_rgba(30,136,255,0.55)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/20">
              <Icon name="phone" className="size-4" />
            </span>
            <span className="text-left">
              <span className="block text-[10px] font-bold tracking-[0.2em] uppercase">
                Call now
              </span>
              <span className="block text-sm font-bold">{site.contact.phone}</span>
            </span>
          </a>

          <ul className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted">
            {[
              "Free career counselling",
              "No registration fee",
              "Placement support included",
            ].map((label) => (
              <li key={label} className="flex items-center gap-1.5">
                <Icon name="check" className="size-3.5 shrink-0 text-brand-500" />
                {label}
              </li>
            ))}
          </ul>
        </Rail>
      </section>

    </>
  );
}
