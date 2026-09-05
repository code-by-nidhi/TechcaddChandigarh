import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { FutureCareerForm } from "@/components/sections/FutureCareerForm";
import { TeamCarousel } from "@/components/sections/TeamCarousel";
import { ButtonLink, Icon, Rail, SectionHeading, cx } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Founder — Mr. Gourav Gupta | ${site.name}`,
  description:
    "Mr. Gourav Gupta founded techcadd in 2016 with a vision of making young people more capable and confident in using technology and building careers in the digital economy.",
  alternates: { canonical: `${site.url}/about/founder` },
};

const roleDescriptors = [
  "Visionary Entrepreneur",
  "Technology Educator",
  "Skill Development Advocate",
];

const leadershipPillars = [
  {
    icon: "cloud",
    title: "Emerging Technologies",
    body: "Moving the catalogue beyond conventional computer education into AI, cloud, cyber security and automation.",
  },
  {
    icon: "code",
    title: "Practical Training",
    body: "Learning built on projects and hands-on work rather than theory alone.",
  },
  {
    icon: "briefcase",
    title: "Industry Engagement",
    body: "Working with employers and institutions so what is taught tracks what is actually hired for.",
  },
  {
    icon: "compass",
    title: "Career Development",
    body: "Counselling, placement support and career pathways treated as part of the programme, not an afterthought.",
  },
  {
    icon: "sparkles",
    title: "Innovation",
    body: "Bringing new technology into the classroom early, while it is still emerging.",
  },
];

const engagementItems = [
  {
    icon: "graduation-cap",
    label: "IKGPTU · 2025",
    title: "Pre-placement talk at I.K. Gujral Punjab Technical University",
    body: "IKGPTU identifies Mr. Gourav Gupta as Founder & CEO of techcadd, and hosted him for a pre-placement talk and interaction with students during techcadd's 2025 campus placement drive.",
  },
  {
    icon: "megaphone",
    label: "Workshops",
    title: "Technology workshops at educational institutions",
    body: "He has participated in technology-focused workshops and discussions covering Artificial Intelligence, robotics, cyber security and other emerging technologies.",
  },
];

const founderStory = [
  {
    label: "Before 2016",
    icon: "target",
    title: "The gap he kept seeing",
    body: "Working alongside technical graduates, one pattern repeated: strong marks, complete syllabi, and no evidence. Students could describe a technology without ever having shipped anything with it, and interviewers in Jalandhar had learned to stop asking about coursework.",
  },
  {
    label: "2016",
    icon: "rocket",
    title: "techcadd opens in Jalandhar",
    body: "The institute started with a single principle carried over from that observation: a student should leave with work an employer can open and inspect. Live client briefs went into the syllabus from the beginning rather than being added as a capstone at the end.",
  },
  {
    label: "The model",
    icon: "users",
    title: "Practitioners in the classroom",
    body: "Trainers stayed on live delivery work instead of moving into full-time teaching, so the examples in class came from the current quarter. Small batches kept it possible for a trainer to look at every student's screen, which is what makes correction daily rather than occasional.",
  },
  {
    label: "Today",
    icon: "globe",
    title: "A network across Punjab",
    body: "techcadd now runs across Jalandhar, Ludhiana, Hoshiarpur, Phagwara, Amritsar, Patiala, Bathinda and Mukerian, works with universities on industrial training and placement drives, and continues under Mr. Gourav Gupta as Founder and CEO.",
  },
];

const team = [
  { name: "Gourav Gupta", title: "Founder & CEO" },
  { name: "Shilpa Gupta", title: "Team Member" },
  { name: "Asmita Sehgal", title: "Team Member" },
  { name: "Daljeet Singh", title: "Team Member" },
  { name: "Amit Sharma", title: "Team Member" },
  { name: "Harrachneet Kaur", title: "Team Member" },
  { name: "Alam", title: "Team Member" },
  { name: "Tanisha", title: "Team Member" },
  { name: "Sandeep Chugh", title: "Team Member" },
  { name: "Anita Sharma", title: "Team Member" },
  { name: "Shiv", title: "Team Member" },
  { name: "Aman Sharma", title: "Team Member" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function FounderPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Founder" },
        ]}
        eyebrow="Founder"
        title="Mr. Gourav Gupta"
        body="Founder & CEO, techcadd"
      >
        <ul className="flex flex-wrap gap-2.5">
          {roleDescriptors.map((role) => (
            <li
              key={role}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm"
            >
              {role}
            </li>
          ))}
        </ul>
      </PageHeader>

      {/* ---------------------------------- The founder ---------------------------------- */}
      <section className="py-20 lg:py-28">
        <Rail>
          <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <Reveal className="relative isolate mx-auto w-full max-w-sm overflow-hidden rounded-[32px] bg-gradient-to-br from-[#050B1D] to-[#081B3A] p-10 text-center text-white shadow-[0_40px_90px_-40px_rgba(5,11,29,0.55)]">
              <span
                aria-hidden="true"
                className="panel-dots pointer-events-none absolute inset-0 opacity-60"
              />
              <span
                aria-hidden="true"
                className="drift-slow pointer-events-none absolute -top-16 -right-10 size-52 rounded-full bg-brand-500/20 blur-[100px]"
              />
              <span className="relative mx-auto grid size-28 place-items-center rounded-full bg-gradient-to-br from-[#1E88FF] to-[#00D4FF] font-display text-4xl font-bold shadow-[0_20px_45px_-15px_rgba(30,136,255,0.6)]">
                {initials("Gourav Gupta")}
              </span>
              <h2 className="relative mt-6 font-display text-xl font-bold tracking-tight">
                Mr. Gourav Gupta
              </h2>
              <p className="relative mt-1 text-sm font-medium text-brand-200/80">
                Founder & CEO, techcadd
              </p>
            </Reveal>

            <Reveal>
              <SectionHeading
                eyebrow="The founder"
                title="Making young people capable and confident with technology."
              />
              <div className="mt-6 space-y-4 leading-relaxed text-muted">
                <p>
                  Mr. Gourav Gupta founded techcadd in 2016 with a vision of making young people
                  more capable and confident in using technology and building careers in the
                  digital economy.
                </p>
                <p>
                  Under his leadership, techcadd has expanded its focus beyond conventional
                  computer education into emerging technologies, practical training, industry
                  engagement, career development and innovation.
                </p>
              </div>
            </Reveal>
          </div>
        </Rail>
      </section>

      {/* ----------------------------------- His vision ----------------------------------- */}
      <section className="bg-subtle py-20 lg:py-28">
        <Rail>
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink lg:text-3xl">
              His vision
            </h2>
            <p className="mt-4 text-muted">His vision centres on one fundamental idea:</p>
            <blockquote className="relative mt-8 rounded-[28px] border border-line bg-white p-9 shadow-[0_30px_60px_-35px_rgba(15,23,42,0.25)] lg:p-12">
              <Icon name="quote" className="mx-auto size-8 text-brand-300" />
              <p className="mt-5 font-display text-xl leading-snug font-semibold text-balance text-ink lg:text-2xl">
                &ldquo;Bridge the gap between academics and industry through practical,
                future-ready skills.&rdquo;
              </p>
            </blockquote>
          </Reveal>
        </Rail>
      </section>

      {/* ----------------------------------- Leadership ----------------------------------- */}
      <section className="py-20 lg:py-28">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Leadership"
            title="Under his leadership"
          />
          <ul className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {leadershipPillars.map((pillar, index) => (
              <li
                key={pillar.title}
                className={cx(
                  "flex flex-col items-start gap-4 rounded-[20px] border border-line bg-white p-6 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_30px_60px_-30px_rgba(37,99,235,0.3)]",
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
                <div>
                  <h3 className="font-display text-base font-bold tracking-tight text-ink">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{pillar.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Rail>
      </section>

      {/* ----------------------------------- Engagement ----------------------------------- */}
      <section className="bg-subtle py-20 lg:py-28">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Engagement"
            title="Present where students are"
            body="His involvement extends into technology awareness and industry-academia engagement, on campus and at technology events."
          />
          <ul className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
            {engagementItems.map((item) => (
              <li
                key={item.title}
                className="rounded-[20px] border border-line bg-white p-7 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.25)]"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-hero-950 text-white">
                  <Icon name={item.icon} className="size-5" />
                </span>
                <p className="mt-4 text-xs font-bold tracking-[0.15em] text-brand-600 uppercase">
                  {item.label}
                </p>
                <h3 className="mt-2 font-display text-base leading-snug font-bold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Rail>
      </section>

      {/* ------------------------------------- Belief ------------------------------------- */}
      <section className="py-20 lg:py-28">
        <Rail>
          <Reveal className="hero-surface relative isolate mx-auto max-w-3xl overflow-hidden rounded-[32px] p-10 text-center text-white lg:p-14">
            <span
              aria-hidden="true"
              className="panel-dots pointer-events-none absolute inset-0 opacity-40"
            />
            <Icon name="quote" className="relative mx-auto size-8 text-brand-200" />
            <p className="relative mt-6 font-display text-xl leading-snug font-semibold text-balance lg:text-2xl">
              &ldquo;The future belongs to learners who continuously adapt, innovate and
              build.&rdquo;
            </p>
            <p className="relative mt-6 text-sm text-brand-100/70">
              Mr. Gourav Gupta, Founder & CEO
            </p>
          </Reveal>
        </Rail>
      </section>

      {/* --------------------------------- Our founder story --------------------------------- */}
      <section className="bg-subtle py-20 lg:py-28">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Our founder story"
            title="From one classroom in Jalandhar to a network across Punjab"
            body="techcadd began with a single observation that has not changed since: students were finishing technical degrees without ever having built anything someone would pay for."
          />

          <div className="relative mt-16">
            <span
              aria-hidden="true"
              className="absolute top-7 right-[6%] left-[6%] hidden h-px bg-gradient-to-r from-brand-100 via-brand-400 to-accent-400 lg:block"
            />
            <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {founderStory.map((stage) => (
                <li key={stage.label} className="lg:flex lg:flex-col lg:items-center lg:text-center">
                  <span className="grid size-14 place-items-center rounded-full border border-line bg-white text-brand-600 shadow-[0_16px_32px_-16px_rgba(37,99,235,0.4)]">
                    <Icon name={stage.icon} className="size-6" />
                  </span>
                  <p className="mt-4 text-xs font-bold tracking-[0.15em] text-brand-600 uppercase">
                    {stage.label}
                  </p>
                  <h3 className="mt-2 font-display text-base font-bold tracking-tight text-ink">
                    {stage.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted lg:mx-auto">
                    {stage.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Rail>
      </section>

      {/* --------------------------------- Founder quote --------------------------------- */}
      <section className="py-20 lg:py-28">
        <Rail>
          <Reveal className="hero-surface relative isolate mx-auto max-w-3xl overflow-hidden rounded-[32px] p-10 text-center text-white lg:p-14">
            <span
              aria-hidden="true"
              className="panel-dots pointer-events-none absolute inset-0 opacity-40"
            />
            <Icon name="quote" className="relative mx-auto size-8 text-brand-200" />
            <p className="relative mt-6 font-display text-xl leading-snug font-semibold text-balance lg:text-2xl">
              &ldquo;A certificate says you attended. A project someone can open says you can do
              the work. We built techcadd around the second.&rdquo;
            </p>
            <p className="relative mt-6 text-sm text-brand-100/70">
              Mr. Gourav Gupta, Founder & CEO
            </p>
          </Reveal>
        </Rail>
      </section>

      {/* --------------------------------- A growing legacy --------------------------------- */}
      <section className="bg-subtle py-20 lg:py-28">
        <Rail>
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink lg:text-3xl">
              A growing legacy
            </h2>
            <p className="mt-4 bg-gradient-to-r from-brand-700 via-brand-600 to-accent-500 bg-clip-text font-display text-4xl font-extrabold tracking-tight text-transparent lg:text-5xl">
              2016—Today
            </p>
            <p className="mt-6 leading-relaxed text-muted">
              From a vision to make technology education more accessible, to today&rsquo;s focus
              on AI, automation, cloud, cyber security and industry-ready skills, techcadd
              continues to evolve with the technology landscape.
            </p>
          </Reveal>
        </Rail>
      </section>

      {/* ------------------------------------ Our team ------------------------------------ */}
      <section className="relative isolate flex min-h-[720px] flex-col justify-center overflow-hidden bg-gradient-to-b from-[#050B1D] via-[#081B3A] to-[#0F2E6D] py-20 lg:min-h-[800px] lg:py-24">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 size-full opacity-[0.12]"
        >
          <defs>
            <pattern id="team-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#team-grid)" />
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_35%_at_20%_15%,rgba(30,136,255,0.25),transparent_70%),radial-gradient(40%_35%_at_85%_80%,rgba(0,212,255,0.2),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="drift-slow pointer-events-none absolute top-14 left-[6%] size-9 rounded-full border border-white/20"
        />
        <div
          aria-hidden="true"
          className="drift-slow-reverse pointer-events-none absolute right-[8%] bottom-16 size-14 rounded-full border border-[#00D4FF]/25"
        />
        {[
          { top: "18%", left: "12%", delay: "0s" },
          { top: "30%", left: "80%", delay: "0.8s" },
          { top: "68%", left: "25%", delay: "1.6s" },
          { top: "75%", left: "60%", delay: "2.4s" },
          { top: "45%", left: "50%", delay: "1.2s" },
        ].map((particle, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="float-slow pointer-events-none absolute size-1.5 rounded-full bg-[#00D4FF]/60 blur-[1px]"
            style={{ top: particle.top, left: particle.left, animationDelay: particle.delay }}
          />
        ))}

        <Rail>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold tracking-[0.25em] text-brand-300 uppercase">
              Our team
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-white lg:text-[2.75rem] lg:leading-[1.1]">
              Meet the people who{" "}
              <span className="bg-gradient-to-r from-[#00D4FF] to-[#1E88FF] bg-clip-text text-transparent">
                teach here
              </span>
            </h2>
            <p className="mt-5 leading-relaxed text-white/65 lg:text-lg">
              Trainers, mentors and counsellors who keep the classrooms running and the students
              moving.
            </p>
            <span className="mx-auto mt-6 block h-0.5 w-10 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#1E88FF]" />
            <Link
              href="/contact#enquire"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-hero-950 transition-transform duration-300 hover:-translate-y-0.5"
            >
              Talk to a counsellor
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>
        </Rail>

        <TeamCarousel team={team} />
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

      {/* ------------------------------- Ready to start your career ------------------------------- */}
      <section className="border-t border-line bg-white">
        <Rail>
          <div className="flex flex-col items-start gap-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:py-12">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight lg:text-2xl">
                Ready to start your career in tech?
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                Book a free demo class and see the lab before you decide.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/contact#enquire">Book Free Demo</ButtonLink>
              <a
                href={site.contact.phoneHref}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-foreground/15 px-5 text-sm font-medium transition-colors duration-300 hover:border-brand-600/30 hover:bg-brand-50"
              >
                <Icon name="phone" className="size-4" />
                {site.contact.phone}
              </a>
            </div>
          </div>
        </Rail>
      </section>
    </>
  );
}
