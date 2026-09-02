import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/sections/Home";
import { MediaFrame } from "@/components/MediaFrame";
import { DemandGapChart } from "@/components/sections/DemandGapChart";
import { ButtonLink, Icon, Rail } from "@/components/ui";
import { CountUp, Parallax } from "@/components/motion/Reveal";
import { RevealScope } from "@/components/motion/RevealScope";
import { Words, revealDelay, wordDelay } from "@/components/motion/Words";
import { Timeline } from "@/components/motion/Timeline";
import { site } from "@/data/site";
import {
  aboutStats,
  approachPrinciples,
  differencePoints,
  journey,
  learnDomains,
  learnerSegments,
  learnSteps,
  recognitions,
  teachChips,
} from "@/data/about";

export const metadata: Metadata = {
  title: `About ${site.name} — IT & AI Training Since ${site.founded}`,
  description: `${site.name} is an IT training and skill-development institute bridging academic learning and industry requirements — AI, data, development, digital, creative and CAD/CAM programs with projects, industrial training and placement support.`,
  alternates: { canonical: `${site.url}/about` },
};

/* --------------------------- Small shared pieces --------------------------- */

function Eyebrow({ children, onDark }: { children: string; onDark?: boolean }) {
  return (
    <p
      data-reveal
      className={`font-mono text-xs tracking-[0.22em] uppercase ${
        onDark ? "text-accent-400" : "text-brand-600"
      }`}
    >
      {children}
    </p>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="mt-0.5 size-5 shrink-0 text-accent-400"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m8.25 12.25 2.5 2.5 5-5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The dark decorative wash shared by the panel sections. */
function PanelGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="panel-dots absolute inset-0" />
      <div className="drift-slow absolute -top-1/3 -left-1/4 h-[140%] w-[70%] -rotate-12 bg-gradient-to-br from-brand-500/25 via-brand-600/10 to-transparent blur-[120px]" />
      <div className="drift-slow-reverse absolute -right-1/4 -bottom-1/3 h-[120%] w-[55%] -rotate-12 bg-gradient-to-tl from-accent-500/20 to-transparent blur-[120px]" />
      <div className="panel-noise absolute inset-0" />
    </div>
  );
}

export default function AboutPage() {
  const years = new Date().getFullYear() - site.founded;

  return (
    <RevealScope>
      {/* ---------------------------------- Hero ---------------------------------- */}
      <section className="hero-surface relative isolate flex min-h-screen items-center overflow-hidden pt-32 pb-20 text-white lg:pt-40 lg:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-hero-950/60 via-hero-800/10 to-hero-950/95"
        />
        <div
          aria-hidden="true"
          className="drift-slow pointer-events-none absolute -top-40 -right-32 size-[42rem] rounded-full bg-accent-500/12 blur-[140px]"
        />
        <Rail className="relative">
          <span
            data-reveal
            className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-md"
          >
            About us
          </span>
          <h1
            data-reveal-words
            className="mt-7 max-w-4xl font-display text-4xl leading-[1.08] font-bold tracking-tight text-balance text-white/40 sm:text-5xl lg:text-6xl"
          >
            <Words
              delay={120}
              segments={[
                { text: "Learn about" },
                { text: "our people,", className: "text-white" },
                { text: "our story and" },
                { text: "how we turn skills into careers.", className: "text-white" },
              ]}
            />
          </h1>

          <dl className="mt-14 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {aboutStats.map((stat, i) => (
              <div
                key={stat.label}
                data-reveal
                style={revealDelay(i, 110)}
                className="relative flex flex-col-reverse pl-5"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-gradient-to-b from-accent-400 to-brand-600"
                />
                <dt className="mt-2 text-sm text-white/55">{stat.label}</dt>
                <dd className="font-display text-4xl leading-none font-bold tracking-tight lg:text-5xl">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Rail>

        <span
          aria-hidden="true"
          className="scroll-hint absolute bottom-10 left-1/2 hidden h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/50 to-transparent lg:block"
        />
      </section>

      {/* -------------------------------- Who we are -------------------------------- */}
      <section className="bg-subtle py-20 lg:py-28">
        <Rail>
          <Eyebrow>Who we are</Eyebrow>
          <h2
            data-reveal-words
            className="mt-4 max-w-4xl font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl"
          >
            <Words
              segments={[
                { text: "Empowering Skills. Enabling Careers." },
                { text: "Building the Future.", className: "text-brand-600" },
              ]}
            />
          </h2>

          <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
            <div>
              <div
                data-reveal
                className="space-y-5 text-base leading-relaxed text-muted lg:text-[17px]"
              >
                <p>
                  Founded in {site.founded} by{" "}
                  <Link
                    href="/about/founder"
                    className="font-semibold text-foreground underline decoration-brand-600/40 underline-offset-4 transition-colors duration-200 hover:text-brand-600 hover:decoration-brand-600"
                  >
                    {site.founder.name}
                  </Link>
                  , {site.shortName} is an IT training and skill-development organization focused on
                  bridging the gap between academic learning and evolving industry requirements. The
                  organization combines practical exposure, emerging technologies, project-based
                  learning and career-oriented training to help learners develop relevant skills and
                  greater confidence for the professional world.
                </p>
                <p>
                  From Artificial Intelligence, Data Science, Machine Learning, Cyber Security and
                  Cloud Computing to Full Stack Development, MERN Stack, Python, Web Development,
                  Mobile App Development, Digital Marketing, Graphic Designing, UI/UX, Animation,
                  Video Editing, CAD/CAM and other technology-focused disciplines, {site.shortName}{" "}
                  provides learners with opportunities to explore diverse career pathways in the
                  digital economy.
                </p>
              </div>

              <h3
                data-reveal
                style={revealDelay(1)}
                className="mt-9 font-display text-sm font-bold tracking-tight text-ink"
              >
                What we teach
              </h3>
              <p
                data-reveal
                style={revealDelay(2)}
                className="mt-2 text-sm leading-relaxed text-muted"
              >
                From Artificial Intelligence to CAD/CAM and other technology-focused disciplines, we
                teach skills for the evolving digital economy.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {teachChips.map((chip, i) => (
                  <li
                    key={chip}
                    data-reveal
                    style={revealDelay(i, 35)}
                    className="rounded-full border border-line bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-300 hover:border-brand-600/40 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
              <p
                data-reveal
                className="mt-7 border-t border-line pt-5 text-sm text-muted"
              >
                Headquartered in {site.address.city}, {site.state}.
              </p>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="drift-slow pointer-events-none absolute -top-10 -right-10 size-64 rounded-full bg-brand-500/15 blur-[90px]"
              />
              <Parallax amount={-48} className="relative grid grid-cols-2 gap-4">
                <MediaFrame
                  reveal
                  caption={`The ${site.shortName} team with faculty at a partner college`}
                  icon="users"
                  className="col-span-2 aspect-[16/10]"
                />
                <MediaFrame
                  reveal
                  delay={120}
                  caption="Workshop participants working through LangChain on their laptops"
                  icon="code"
                  className="aspect-[4/3]"
                />
                <MediaFrame
                  reveal
                  delay={240}
                  caption="A live demonstration on screen during the Agentic AI workshop"
                  icon="monitor"
                  className="aspect-[4/3]"
                />
              </Parallax>
            </div>
          </div>
        </Rail>
      </section>

      {/* ----------------------------- More than training ----------------------------- */}
      <section className="relative isolate overflow-hidden bg-panel py-20 text-white lg:py-28">
        <PanelGlow />
        <Rail className="relative">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
            <div>
              <Eyebrow onDark>More than training</Eyebrow>
              <h2
                data-reveal-words
                className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl"
              >
                <Words segments={[{ text: "A skill-building ecosystem." }]} step={70} />
              </h2>
              <div
                data-reveal
                style={revealDelay(2)}
                className="mt-6 space-y-5 text-base leading-relaxed text-white/70 lg:text-[17px]"
              >
                <p>
                  At {site.shortName}, technology education is designed to go beyond textbooks and
                  conventional classroom learning. The focus is on helping learners{" "}
                  <strong className="font-semibold text-white">learn, implement and grow</strong> by
                  combining conceptual understanding with practical application.
                </p>
                <p>
                  Students work on assignments, projects, industrial training and
                  internship-oriented learning experiences that help them understand how technology
                  is applied in real-world environments — from mobile application development and
                  cloud computing to AI/ML, DevOps and data-related skills.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <MediaFrame
                reveal
                caption={`A ${site.shortName} trainer taking questions during a campus session`}
                icon="megaphone"
                className="aspect-[4/3] self-start"
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 100vw"
              />
              <MediaFrame
                reveal
                delay={150}
                caption={`Students meeting a ${site.shortName} counsellor after a campus session`}
                icon="users"
                className="hidden aspect-[4/3] self-start sm:mt-12 sm:block"
                sizes="(min-width: 1024px) 24vw, 45vw"
              />
            </div>
          </div>
        </Rail>
      </section>

      {/* ------------------------------- Why it matters ------------------------------- */}
      <section className="relative isolate overflow-hidden py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="drift-slow pointer-events-none absolute top-1/4 -right-40 -z-10 size-[36rem] rounded-full bg-brand-500/8 blur-[130px]"
        />
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
            <div>
              <Eyebrow>Why it matters</Eyebrow>
              <h2
                data-reveal-words
                className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem]"
              >
                <Words
                  segments={[
                    { text: "Preparing learners for a" },
                    { text: "changing digital world", className: "text-brand-600" },
                  ]}
                />
              </h2>

              <div
                data-reveal
                style={revealDelay(2)}
                className="mt-6 space-y-5 text-base leading-relaxed text-muted lg:text-[17px]"
              >
                <p>
                  Technology is evolving rapidly. Artificial Intelligence, automation, cloud
                  platforms, cybersecurity, data and software development are continuously changing
                  the way businesses operate.
                </p>
                <p>
                  {site.shortName} aims to keep its learning ecosystem aligned with this changing
                  environment by introducing learners to emerging technologies and industry-relevant
                  tools, helping them develop the adaptability required to continue learning
                  throughout their careers.
                </p>
              </div>

              <figure
                data-reveal
                style={revealDelay(3)}
                className="mt-9 border-l-2 border-brand-600 pl-6"
              >
                <Icon name="quote" className="size-6 text-brand-600/25" />
                <blockquote className="mt-2 font-display text-lg leading-relaxed font-medium tracking-tight text-balance text-ink lg:text-xl">
                  The objective is not simply to teach a technology, but to develop the ability to
                  understand problems, build solutions, use technology effectively and keep
                  upgrading one&rsquo;s skills.
                </blockquote>
              </figure>
            </div>

            <DemandGapChart />
          </div>
        </Rail>
      </section>

      {/* ------------------------------- Who we teach ------------------------------- */}
      <section className="relative isolate overflow-hidden bg-panel py-20 text-white lg:py-28">
        <PanelGlow />
        <Rail className="relative">
          <div className="max-w-3xl">
            <Eyebrow onDark>Who we teach</Eyebrow>
            <h2
              data-reveal-words
              className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl"
            >
              <Words segments={[{ text: "Learning for every stage of the career journey" }]} />
            </h2>
            <p data-reveal style={revealDelay(2)} className="mt-5 text-base leading-relaxed text-white/70">
              {site.shortName}&rsquo;s training ecosystem is designed to serve a diverse learner
              base, including:
            </p>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {learnerSegments.map((item, i) => (
              <li
                key={item.step}
                data-reveal
                style={revealDelay(i)}
                className="group rounded-2xl border border-white/15 bg-white/[0.07] p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.12]"
              >
                <span className="font-mono text-[11px] tracking-[0.18em] text-accent-400">
                  {item.step}
                </span>
                <h3 className="mt-3 font-display text-base font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{item.body}</p>
              </li>
            ))}
          </ul>
        </Rail>
      </section>

      {/* -------------------------- Learn Practice Build Grow -------------------------- */}
      <section className="bg-subtle py-20 lg:py-28">
        <Rail>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>From classroom to practical experience</Eyebrow>
            <h2
              data-reveal-words
              className="mt-4 font-display text-3xl leading-[1.1] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl"
            >
              {learnSteps.map((step, i) => (
                <span key={step.title} className="sh-clip">
                  {i > 0 ? (
                    <>
                      <Icon
                        name="arrow-right"
                        className="sh-word inline-block size-[0.7em] shrink-0 align-middle text-brand-600"
                        style={wordDelay(i * 110 - 55)}
                      />{" "}
                    </>
                  ) : null}
                  <span
                    className="sh-word"
                    style={wordDelay(i * 110)}
                  >
                    {step.title}
                  </span>{" "}
                </span>
              ))}
            </h2>
          </div>

          <div className="relative mt-14 lg:mt-20">
            <span
              aria-hidden="true"
              data-reveal-line
              className="absolute top-7 right-[12.5%] left-[12.5%] hidden border-t border-dashed border-line lg:block"
            />
            <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {learnSteps.map((step, i) => (
                <li
                  key={step.title}
                  data-reveal
                  style={revealDelay(i, 110)}
                  className="group lg:flex lg:flex-col lg:items-center lg:text-center"
                >
                  <span className="grid size-14 place-items-center rounded-full border border-line bg-background font-display text-base font-bold tracking-tight text-brand-600 shadow-[0_12px_28px_-16px_rgba(15,23,42,0.55)] transition-all duration-300 group-hover:border-brand-600/40 group-hover:bg-brand-600 group-hover:text-white">
                    {step.step}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>

          <p data-reveal className="mx-auto mt-14 max-w-3xl text-center text-sm leading-relaxed text-muted lg:mt-16">
            This practical orientation runs through every format we offer — live projects,
            industrial training programs and internship opportunities.
          </p>
        </Rail>
      </section>

      {/* ------------------------------- The difference ------------------------------- */}
      <section className="relative isolate overflow-hidden bg-panel py-20 text-white lg:py-28">
        <PanelGlow />
        <Rail className="relative">
          <div className="max-w-3xl">
            <Eyebrow onDark>The difference</Eyebrow>
            <h2
              data-reveal-words
              className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl"
            >
              <Words segments={[{ text: `What makes ${site.shortName} different?` }]} step={70} />
            </h2>
          </div>
          <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {differencePoints.map((item, i) => (
              <li key={item.title} data-reveal style={revealDelay(i, 70)} className="flex gap-3.5">
                <CheckIcon />
                <div>
                  <h3 className="font-display text-base font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/65">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Rail>
      </section>

      {/* ----------------------------- What you can learn ----------------------------- */}
      <section className="py-20 lg:py-28">
        <Rail>
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div className="max-w-3xl">
              <Eyebrow>What you can learn</Eyebrow>
              <h2
                data-reveal-words
                className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl"
              >
                <Words segments={[{ text: "Building skills across technology domains" }]} />
              </h2>
              <p data-reveal style={revealDelay(2)} className="mt-5 text-base leading-relaxed text-muted">
                Whether a learner wants to code an application, analyse data, build an AI solution,
                secure a network, manage cloud infrastructure, design a digital experience, create
                visual content or grow a business online, {site.shortName} provides multiple
                learning pathways.
              </p>
            </div>
            <div data-reveal style={revealDelay(3)} className="lg:justify-self-end">
              <ButtonLink href="/courses" variant="secondary">
                Browse the full catalogue
                <Icon name="arrow-right" className="size-4" />
              </ButtonLink>
            </div>
          </div>

          {/*
            A bento rather than four equal cards: one wide dark tile carries the
            weight, and every tile pins its footer with `mt-auto` so the taller
            cells fill instead of leaving a hole under a short list.
          */}
          <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            {learnDomains.map((domain, i) => {
              const dark = i === 0;
              const place = [
                "lg:col-span-2 lg:col-start-1 lg:row-start-1",
                "lg:col-start-3 lg:row-start-1 lg:row-span-2",
                "lg:col-start-1 lg:row-start-2",
                "lg:col-start-2 lg:row-start-2",
              ][i];

              return (
                <article
                  key={domain.name}
                  data-reveal
                  style={revealDelay(i, 90)}
                  className={`group relative isolate flex flex-col overflow-hidden rounded-3xl p-7 transition-all duration-500 lg:p-8 ${place} ${
                    dark
                      ? "panel-surface text-white"
                      : "border border-line bg-subtle hover:-translate-y-1 hover:border-brand-600/35 hover:shadow-[0_30px_60px_-38px_rgba(15,23,42,0.55)]"
                  }`}
                >
                  {dark ? (
                    <>
                      <span aria-hidden="true" className="panel-dots absolute inset-0 -z-10" />
                      <span
                        aria-hidden="true"
                        className="drift-slow absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-accent-500/20 blur-[90px]"
                      />
                    </>
                  ) : null}

                  {/* Oversized index, sunk into the corner */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -top-4 right-4 -z-10 font-display text-[7rem] leading-none font-bold tracking-tight ${
                      dark ? "text-white/[0.07]" : "text-ink/[0.05]"
                    }`}
                  >
                    0{i + 1}
                  </span>

                  <div className="flex items-center gap-4">
                    <span
                      className={`grid size-12 shrink-0 place-items-center rounded-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${
                        dark
                          ? "bg-white/12 text-accent-400 ring-1 ring-white/15"
                          : "bg-brand-600 text-white shadow-[0_14px_32px_-14px_rgba(37,99,235,0.9)]"
                      }`}
                    >
                      <Icon name={domain.icon} className="size-6" />
                    </span>
                    <h3
                      className={`font-display text-xl font-bold tracking-tight lg:text-2xl ${
                        dark ? "text-white" : "text-ink"
                      }`}
                    >
                      {domain.name}
                    </h3>
                  </div>

                  <p
                    className={`mt-4 max-w-md text-sm leading-relaxed ${
                      dark ? "text-white/65" : "text-muted"
                    }`}
                  >
                    {domain.blurb}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {domain.items.map((item) => (
                      <li
                        key={item}
                        className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-300 ${
                          dark
                            ? "border border-white/15 bg-white/[0.07] text-white/85 hover:border-white/35 hover:bg-white/15"
                            : "border border-line bg-background text-foreground group-hover:border-brand-600/25"
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`mt-8 flex items-center justify-between gap-4 border-t pt-5 lg:mt-auto lg:pt-6 ${
                      dark ? "border-white/12" : "border-line"
                    }`}
                  >
                    <span
                      className={`font-mono text-[11px] tracking-[0.18em] uppercase ${
                        dark ? "text-accent-400" : "text-brand-600"
                      }`}
                    >
                      {domain.items.length} focus areas
                    </span>
                    <Icon
                      name="arrow-up-right"
                      className={`size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        dark ? "text-white/45" : "text-muted"
                      }`}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </Rail>
      </section>

      {/* -------------------------------- Our approach -------------------------------- */}
      <section className="bg-panel py-20 text-white lg:py-28">
        <Rail>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow onDark>Our approach</Eyebrow>
            <h2
              data-reveal-words
              className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl"
            >
              <Words
                segments={[
                  { text: "Practical. Future-Focused." },
                  { text: "Career-Oriented.", className: "text-accent-400" },
                ]}
                step={70}
              />
            </h2>
            <p data-reveal style={revealDelay(3)} className="mt-5 text-base leading-relaxed text-white/70">
              {site.shortName}&rsquo;s approach is built around three principles.
            </p>
          </div>

          <ol className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-3 lg:gap-12">
            {approachPrinciples.map((item, i) => (
              <li
                key={item.step}
                data-reveal
                style={revealDelay(i, 130)}
                className="border-t-2 border-white/15 pt-6"
              >
                <p className="font-mono text-xs tracking-[0.22em] text-accent-400">{item.step}</p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65 lg:text-base">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </Rail>
      </section>

      {/* ------------------------------ Industry engagement ------------------------------ */}
      <section className="bg-subtle py-20 lg:py-28">
        <Rail>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <Parallax amount={-32}>
              <MediaFrame
                reveal
                caption={`The Agentic AI workshop run with a partner institution near ${site.city}`}
                icon="sparkles"
                className="aspect-[4/3] lg:aspect-[5/4]"
                sizes="(min-width: 1024px) 42vw, 92vw"
              />
            </Parallax>
            <div>
              <Eyebrow>Industry engagement</Eyebrow>
              <h2
                data-reveal-words
                className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl"
              >
                <Words segments={[{ text: "Connecting education with industry" }]} />
              </h2>
              <div
                data-reveal
                style={revealDelay(2)}
                className="mt-6 space-y-5 text-base leading-relaxed text-muted lg:text-[17px]"
              >
                <p>
                  A major part of {site.shortName}&rsquo;s broader ecosystem is its engagement with
                  educational institutions and industry-oriented initiatives — campus placement
                  activities and technology workshops that give students opportunities for industry
                  interaction and practical exposure.
                </p>
                <p>
                  These interactions help strengthen the bridge between what students learn and how
                  technology is applied professionally.
                </p>
                <p>
                  <Link
                    href="/college-partnerships"
                    className="group inline-flex items-center font-semibold text-brand-600 hover:underline"
                  >
                    See how we work with colleges
                    <Icon
                      name="arrow-right"
                      className="ml-1.5 size-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Rail>
      </section>

      {/* --------------------------- Awards & recognition --------------------------- */}
      <section className="py-20 lg:py-28">
        <Rail>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Awards, Recognition &amp; Accreditation</Eyebrow>
            <h2
              data-reveal-words
              className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-5xl"
            >
              <Words
                segments={[
                  { text: "Recognition built through learning, innovation and industry engagement" },
                ]}
                step={45}
              />
            </h2>
            <p data-reveal style={revealDelay(3)} className="mt-5 text-base leading-relaxed text-muted lg:text-lg">
              {site.shortName}&rsquo;s credibility is supported not only by its training programs
              but also by its participation in industry-academia initiatives, campus placements,
              workshops, technology events and institutional collaborations.
            </p>
          </div>

          <ul className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2">
            {recognitions.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                style={revealDelay(i, 90)}
                className="group flex gap-5 rounded-2xl border border-line bg-subtle p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-600/30 hover:shadow-[0_24px_48px_-32px_rgba(15,23,42,0.45)] lg:p-8"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-[0_14px_32px_-14px_rgba(37,99,235,0.9)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  <Icon name={item.icon} className="size-6" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <p data-reveal className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-muted">
            The recognitions above are drawn from publicly available information, institutional
            announcements and {site.shortName}&rsquo;s own published profiles.
          </p>
        </Rail>
      </section>

      {/* --------------------------------- Our journey --------------------------------- */}
      <section className="relative isolate overflow-hidden bg-panel py-20 text-white lg:py-28">
        <PanelGlow />
        <Rail className="relative">
          <div className="text-center">
            <Eyebrow onDark>Our journey</Eyebrow>
            <h2
              data-reveal-words
              className="mt-3 font-display text-3xl font-bold tracking-tight lg:text-4xl"
            >
              <Words segments={[{ text: `${years} years of building careers` }]} step={70} />
            </h2>
            <p
              data-reveal
              style={revealDelay(2)}
              className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/65 lg:text-base"
            >
              What began in {site.founded} has evolved into a technology-focused training ecosystem
              with an expanding portfolio of courses and practical learning initiatives, and the
              focus keeps moving towards emerging areas such as Artificial Intelligence, automation,
              cloud technologies, cybersecurity, data and modern software development.
            </p>
          </div>

          <Timeline className="relative mt-14 lg:mt-16">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-[7px] w-px bg-white/15 sm:left-1/2"
            />
            <ol className="space-y-12 lg:space-y-16">
              {journey.map((item, i) => {
                const left = i % 2 === 0;
                return (
                  <li
                    key={item.year}
                    data-timeline-item
                    className="relative pl-9 sm:grid sm:grid-cols-2 sm:items-center sm:gap-x-12 sm:pl-0"
                  >
                    <span
                      aria-hidden="true"
                      className="timeline-dot absolute top-1/2 left-1 size-2.5 -translate-y-1/2 rounded-full bg-brand-500 ring-4 ring-brand-500/25 sm:left-1/2 sm:-translate-x-1/2"
                    />
                    <span
                      aria-hidden="true"
                      className={`absolute top-1/2 hidden h-px w-6 -translate-y-1/2 bg-white/15 sm:block ${
                        left ? "right-1/2" : "left-1/2"
                      }`}
                    />
                    <div
                      className={`flex items-center gap-4 ${
                        left ? "sm:col-start-1 sm:flex-row-reverse sm:text-right" : "sm:col-start-2"
                      }`}
                    >
                      <div className="timeline-card w-14 shrink-0 overflow-hidden rounded-xl border border-brand-600 bg-brand-600 text-white shadow-[0_14px_30px_-14px_rgba(37,99,235,0.75)]">
                        <div className="timeline-card__era bg-white/20 py-0.5 text-center font-mono text-[10px] tracking-widest text-white">
                          {String(item.year).slice(0, 2)}
                        </div>
                        <div className="py-1.5 text-center font-display text-xl leading-none font-bold">
                          {String(item.year).slice(2)}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-sm font-bold tracking-tight lg:text-[15px]">
                          {item.year}: {item.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-white/60">{item.body}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Timeline>
        </Rail>
      </section>

      {/* --------------------------------- Our belief --------------------------------- */}
      <section className="relative isolate overflow-hidden bg-subtle py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="drift-slow pointer-events-none absolute -top-32 -left-40 -z-10 size-[40rem] rounded-full bg-brand-500/10 blur-[140px]"
        />

        <Rail>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
            <div>
              <Eyebrow>Our belief</Eyebrow>
              <h2 className="mt-7 font-display text-4xl leading-[1.04] font-bold tracking-tight text-ink sm:text-5xl lg:text-[4.25rem]">
                <span data-reveal-words className="block">
                  <Words segments={[{ text: "Technology changes." }]} step={70} />
                </span>
                <span data-reveal-words className="block">
                  <Words segments={[{ text: "Skills evolve." }]} step={70} delay={200} />
                </span>
                {/*
                  Not word-split: `background-clip: text` and the per-word
                  `filter: blur()` fight each other, so this line rises as a
                  block instead.
                */}
                <span
                  data-reveal
                  style={revealDelay(5, 100)}
                  className="block bg-gradient-to-r from-brand-600 via-brand-500 to-accent-400 bg-clip-text text-transparent"
                >
                  Learning never stops.
                </span>
              </h2>
            </div>

            {/* Sits against the foot of the type block, so no column of dead space */}
            <div
              data-reveal
              style={revealDelay(6, 110)}
              className="space-y-5 border-l-2 border-brand-600/30 pl-6 text-base leading-relaxed text-muted lg:pb-4 lg:text-[17px]"
            >
              <p>
                We believe that meaningful technology education should not end when a course ends.
              </p>
              <p>
                It should give learners the knowledge to understand, the skills to build, the
                confidence to perform and the curiosity to keep growing.
              </p>
            </div>
          </div>
        </Rail>

        {/* The brand's three words, full bleed — the section's visual signature. */}
        <div className="relative mt-16 border-y border-line bg-background py-7 lg:mt-20 lg:py-9">
          {/* The track repeats; the phrase is announced once instead. */}
          <p className="sr-only">Learn. Implement. Grow.</p>
          <div
            aria-hidden="true"
            className="flex overflow-hidden select-none [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]"
          >
            {/*
              Twelve items = four cycles, so the two halves the -50% translate
              swaps between are identical and the track still outruns an
              ultra-wide viewport.
            */}
            <div className="marquee-track flex shrink-0 items-center gap-10 pr-10 lg:gap-14 lg:pr-14">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => {
              const word = ["Learn.", "Implement.", "Grow."][n % 3];
              return (
                <span key={n} className="flex shrink-0 items-center gap-10 lg:gap-14">
                  <span
                    className={`font-display text-4xl font-bold tracking-tight whitespace-nowrap lg:text-6xl ${
                      n % 3 === 1
                        ? "text-transparent [-webkit-text-stroke:1.5px_var(--color-ink)]"
                        : "text-ink"
                    }`}
                  >
                    {word}
                  </span>
                  <span className="size-2 shrink-0 rounded-full bg-gradient-to-br from-brand-600 to-accent-400" />
                </span>
              );
            })}
            </div>
          </div>
        </div>

        <Rail>
          {/* Closing lockup — one bar, not a floating box */}
          <div
            data-reveal
            className="mt-14 overflow-hidden rounded-3xl border border-line bg-background shadow-[0_30px_70px_-46px_rgba(15,23,42,0.45)] lg:mt-16"
          >
            <span
              aria-hidden="true"
              data-reveal-line
              style={revealDelay(2)}
              className="block h-1 origin-left bg-gradient-to-r from-brand-600 via-brand-500 to-accent-400"
            />
            <div className="grid gap-10 p-8 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16 lg:p-12">
              <div>
                <p className="font-mono text-xs tracking-[0.22em] text-brand-600 uppercase">
                  {site.shortName} today
                </p>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted lg:text-[17px]">
                  With a focus on practical technology education, emerging skills, industry
                  engagement and career development, {site.shortName} continues its journey towards
                  creating a stronger ecosystem of future-ready technology professionals.
                </p>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-brand-600">
                  {[
                    { href: "/about/founder", label: "Meet the founder" },
                    { href: "/about/mission-vision", label: "Mission & vision" },
                    { href: "/branches", label: "Our centres" },
                    { href: "/placement", label: "Placement support" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 hover:underline"
                    >
                      {item.label}
                      <Icon
                        name="arrow-up-right"
                        className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-line pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
                <p className="font-display text-3xl font-bold tracking-tight text-ink">
                  {site.shortName}
                </p>
                <p className="mt-3 text-xs tracking-[0.14em] text-muted uppercase">
                  {site.tagline}
                </p>
                <p className="mt-4 font-display text-lg leading-snug font-medium tracking-tight text-balance text-ink">
                  Where Your Tech Journey Begins.
                </p>
              </div>
            </div>
          </div>
        </Rail>
      </section>

      <CtaSection />
    </RevealScope>
  );
}
