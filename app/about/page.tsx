import type { Metadata } from "next";
import Link from "next/link";
import { QuickDemoFormLight } from "@/components/EnquiryForm";
import { MediaFrame } from "@/components/MediaFrame";
import { ScrambleButton } from "@/components/ScrambleButton";
import { ButtonLink, Eyebrow as UiEyebrow, Icon, Rail } from "@/components/ui";
import { CountUp, Reveal } from "@/components/motion/Reveal";
import { RevealScope } from "@/components/motion/RevealScope";
import { Words, revealDelay } from "@/components/motion/Words";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `About ${site.name} — Building Careers, Creating Future-Ready Professionals`,
  description: `${site.name} turns skills into real-world opportunities through industry-focused training, practical projects and career mentorship — for learners who want a technology career, not just a certificate.`,
  alternates: { canonical: `${site.url}/about` },
};

/* ---------------------------------------------------------------------------
   Content
   --------------------------------------------------------------------------- */

const heroStats = [
  { label: "Courses", value: "50+" },
  { label: "Learners", value: "15K+" },
  { label: "Hiring Partners", value: "120+" },
  { label: "Student Satisfaction", value: "98%" },
];

/** Fixed positions (not random) so server and client render identically. */
const ECOSYSTEM_PARTICLES = [
  { x: 8, y: 18, delay: 0.2 },
  { x: 92, y: 12, delay: 1.1 },
  { x: 14, y: 82, delay: 2.3 },
  { x: 88, y: 78, delay: 0.6 },
  { x: 50, y: 6, delay: 1.7 },
  { x: 6, y: 50, delay: 2.9 },
  { x: 94, y: 46, delay: 0.9 },
  { x: 48, y: 94, delay: 1.4 },
];

/**
 * Eight-card masonry collage for "Who we are". Spans are chosen so the areas
 * sum to whole grid rows both at the 2-column mobile width (2+2+1+1+2+2+2+2 =
 * 14 = 7 rows × 2 cols) and at `lg` (2×2 + 1×2 + 1+1 + 2+2+2+2 = 16 = 4 cols
 * × 4 rows) — the same area-accounting trick as the bento grid further down
 * the page, so the CSS auto-placement algorithm never leaves a gap either way.
 */
const collageCards = [
  {
    icon: "users",
    title: "The techcadd team with faculty at a partner college",
    body: "Collaborating with academic experts to deliver industry-aligned learning experiences.",
    span: "col-span-2 lg:col-span-2 lg:row-span-2",
    size: "lg" as const,
  },
  {
    icon: "code",
    title: "Live project review during a lab session",
    body: "Hands-on learning with real-world projects and expert feedback.",
    span: "col-span-2 lg:col-span-1 lg:row-span-2",
    size: "md" as const,
  },
  {
    icon: "briefcase",
    title: "A hiring drive on campus",
    body: "Connecting learners with top recruiters.",
    span: "",
    size: "sm" as const,
  },
  {
    icon: "layers",
    title: "Industry-relevant curriculum",
    body: "Skills companies actually hire for, updated often.",
    span: "",
    size: "sm" as const,
  },
  {
    icon: "monitor",
    title: "Practical, project-based learning",
    body: "Build real projects, solve real problems, and gain job-ready skills.",
    span: "col-span-2 lg:col-span-2",
    size: "md" as const,
  },
  {
    icon: "target",
    title: "Career-focused outcomes",
    body: "From learning to getting hired — we're with you at every step.",
    span: "col-span-2 lg:col-span-2",
    size: "md" as const,
  },
  {
    icon: "rocket",
    title: "Internship opportunities on real teams",
    body: "Structured internships with real deliverables and real deadlines.",
    span: "col-span-2 lg:col-span-2",
    size: "lg" as const,
  },
  {
    icon: "award",
    title: "Mentorship from working professionals",
    body: "Guidance from trainers who still ship production work.",
    span: "col-span-2 lg:col-span-2",
    size: "lg" as const,
  },
];

/**
 * Positioned in the gaps the two overlapping panels leave open, not over
 * either panel's own text corner (top-left icon, bottom-left caption).
 */
const skillFloatCards = [
  { icon: "target", label: "Practical Learning", style: { right: "-3%", top: "-4%" } },
  { icon: "graduation-cap", label: "From Learning", style: { left: "1%", bottom: "6%" } },
  { icon: "chart", label: "Real-World Exposure", style: { right: "-3%", bottom: "-10%" } },
] as const;

const learnerSegments = [
  {
    step: "01",
    title: "School & College Students",
    body: "Looking to develop technology skills early.",
    icon: "graduation-cap",
  },
  {
    step: "02",
    title: "Graduates & Job Seekers",
    body: "Preparing for technology careers.",
    icon: "briefcase",
  },
  {
    step: "03",
    title: "Engineering & IT Students",
    body: "Seeking practical exposure and industrial training.",
    icon: "code",
  },
  {
    step: "04",
    title: "Working Professionals",
    body: "Looking to upgrade or diversify their skills.",
    icon: "monitor",
  },
  {
    step: "05",
    title: "Career Switchers",
    body: "Exploring opportunities in the technology sector.",
    icon: "arrow-up-right",
  },
  {
    step: "06",
    title: "Entrepreneurs & Freelancers",
    body: "Seeking digital and technology capabilities.",
    icon: "rocket",
  },
];

/** Card-center coordinates for the connector lines, in the grid's own 0-100 viewBox. */
const LEARNER_LINE_ROWS = [
  { y: 22, xs: [16.7, 50, 83.3] },
  { y: 78, xs: [16.7, 50, 83.3] },
];

const journeySteps = [
  {
    step: "01",
    title: "Learn",
    body: "Structured lessons and live sessions build the fundamentals — the concepts, tools and reasoning every track is built on.",
  },
  {
    step: "02",
    title: "Practice",
    body: "Guided exercises and lab hours turn theory into muscle memory, with a trainer in the room to correct course early.",
  },
  {
    step: "03",
    title: "Build",
    body: "Live projects and industrial training replace toy examples — the kind of work you can actually describe in an interview.",
  },
  {
    step: "04",
    title: "Grow",
    body: "Career guidance, mock interviews and placement support carry that portfolio into an offer, not just a completion certificate.",
  },
];

/** Icon and status-badge chrome for the journey cards — visual only, not copy. */
const journeyIcons = ["layers", "target", "code", "rocket"] as const;
const journeyBadges = ["Foundations", "Hands-on", "Real projects", "Career-ready"];

const differencePoints = [
  {
    title: "Industry-Oriented Curriculum",
    body: "Training is designed around practical skills and technologies relevant to today's digital workplace.",
  },
  {
    title: "Hands-On Learning",
    body: "Students get opportunities to apply concepts rather than relying solely on theoretical instruction.",
  },
  {
    title: "Emerging Technology Programs",
    body: "Learners can explore domains including AI, Machine Learning, Data Science, Cyber Security, Cloud Computing and other modern technologies.",
  },
  {
    title: "Projects & Industrial Exposure",
    body: "Project-based learning and industrial training help students connect classroom concepts with practical applications.",
  },
  {
    title: "Experienced Trainers & Mentors",
    body: "Guidance from trainers and mentors helps learners understand technical concepts and their real-world applications.",
  },
  {
    title: "Career Guidance",
    body: "Students can receive guidance related to course selection, skill development, resumes, interviews and career pathways.",
  },
  {
    title: "Placement Assistance",
    body: `${site.shortName} provides placement assistance and career support to eligible learners; actual employment decisions remain with recruiting organizations.`,
  },
  {
    title: "Modern Learning Infrastructure",
    body: "Technology-focused learning environments are designed to support practical training and hands-on work.",
  },
  {
    title: "Industry & Academic Engagement",
    body: `${site.shortName} has participated in workshops, training initiatives and placement activities with educational institutions, strengthening the connection between academic learning and industry-oriented skills.`,
  },
];

const learnDomains = [
  {
    name: "Technology",
    icon: "sparkles",
    items: ["AI", "Machine Learning", "Data Science", "Cyber Security", "Cloud Computing", "DevOps"],
  },
  {
    name: "Development",
    icon: "code",
    items: ["Python", "Full Stack", "MERN", "Web Development", "Mobile App Development"],
  },
  {
    name: "Digital & Creative",
    icon: "compass",
    items: ["Digital Marketing", "UI/UX", "Graphic Designing", "Video Editing", "Animation"],
  },
  {
    name: "Professional & Technical Skills",
    icon: "briefcase",
    items: ["Advanced Excel", "CAD/CAM", "Accounting", "Other career-focused programs"],
  },
];

const approachPrinciples = [
  {
    step: "01",
    title: "Relevance",
    body: "Learn technologies and skills that connect with evolving industry requirements.",
    icon: "compass",
  },
  {
    step: "02",
    title: "Application",
    body: "Turn concepts into practical skills through projects, exercises and hands-on learning.",
    icon: "code",
  },
  {
    step: "03",
    title: "Growth",
    body: "Develop the mindset and adaptability required to keep learning in a rapidly changing technology landscape.",
    icon: "chart",
  },
];

const accreditations = [
  {
    step: "01",
    title: "ISO 9001 Certified",
    body: `${site.shortName}'s public LinkedIn profile describes the organization as an ISO 9001-certified and government-registered IT institute.`,
    icon: "shield",
  },
  {
    step: "02",
    title: "Academic Collaboration",
    body: `Publicly available information also records ${site.shortName}'s collaboration with educational institutions for skill development, workshops and experiential learning initiatives.`,
    icon: "graduation-cap",
  },
  {
    step: "03",
    title: "Industry-Academia Engagement",
    body: `${site.shortName} has participated in institutional initiatives and placement activities, including a joint campus placement drive hosted by I.K. Gujral Punjab Technical University in November 2025.`,
    icon: "briefcase",
  },
  {
    step: "04",
    title: "Technology & Innovation Initiatives",
    body: `${site.shortName} has participated in AI and robotics-focused initiatives, including demonstrations involving its AI robotic dog Chi-Chi at educational and technology events.`,
    icon: "sparkles",
  },
];

/* ---------------------------------------------------------------------------
   Small shared pieces
   --------------------------------------------------------------------------- */

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

/* ---------------------------------------------------------------------------
   Page
   --------------------------------------------------------------------------- */

export default function AboutPage() {
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
        <div
          aria-hidden="true"
          className="drift-slow-reverse pointer-events-none absolute -bottom-40 -left-32 size-[36rem] rounded-full bg-brand-500/14 blur-[130px]"
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
            className="mt-7 max-w-4xl font-display text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            <Words
              delay={120}
              segments={[
                { text: "Building Careers." },
                { text: "Creating Future-Ready Professionals.", className: "text-accent-400" },
              ]}
            />
          </h1>
          <p
            data-reveal
            style={revealDelay(3)}
            className="mt-7 max-w-2xl text-base leading-relaxed text-white/70 lg:text-lg"
          >
            {site.shortName} helps learners transform skills into real-world opportunities through
            industry-focused training, practical projects and career mentorship.
          </p>

          <div data-reveal style={revealDelay(4)} className="mt-9 flex flex-wrap gap-4">
            <ButtonLink href="/courses" variant="onDark" size="lg">
              Explore courses
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
            <ScrambleButton href="/contact#enquire" className="h-13 px-7 text-[15px]">
              Book free counselling
            </ScrambleButton>
          </div>

          <dl className="mt-14 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {heroStats.map((stat, i) => (
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
      <section className="relative isolate overflow-hidden bg-[#f7f8fc] py-20 lg:py-28">
        <Rail>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <UiEyebrow>Who we are</UiEyebrow>
              <h2 className="mt-5 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem]">
                More Than A
                <br />
                <span className="text-brand-600">Training Institute</span>
              </h2>
              <Reveal className="mt-6 space-y-5 text-base leading-relaxed text-muted lg:text-[17px]">
                <p>
                  Most technology education stops at theory. {site.shortName} exists to close the
                  distance between what a classroom teaches and what a hiring manager actually
                  expects on day one — a gap that shows up quietly, in interviews learners are
                  otherwise qualified for.
                </p>
                <p>
                  That means practical learning over passive lectures, direct industry exposure
                  instead of secondhand descriptions of it, and a syllabus built from the modern
                  technologies companies are hiring for — reviewed and rebuilt as those companies
                  change their minds.
                </p>
                <p>
                  Every course ends the same way it should: with a project a learner built
                  themselves, and the outcome that project was meant to produce — a real,
                  defensible step into a technology career.
                </p>
              </Reveal>
              <div className="mt-9 grid grid-cols-3 gap-4 border-t border-line pt-7">
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight text-brand-600">
                    <CountUp value={`${new Date().getFullYear() - 2016}+`} />
                  </p>
                  <p className="mt-1 text-xs text-muted">Years building careers</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight text-brand-600">
                    <CountUp value={site.stats.technologies} />
                  </p>
                  <p className="mt-1 text-xs text-muted">Technologies taught</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight text-brand-600">
                    <CountUp value={site.stats.placement} />
                  </p>
                  <p className="mt-1 text-xs text-muted">Placement rate</p>
                </div>
              </div>
            </div>

            <div className="relative lg:col-span-7">
              <div
                aria-hidden="true"
                className="drift-slow pointer-events-none absolute -top-10 -right-10 size-64 rounded-full bg-brand-500/10 blur-[90px]"
              />
              <Reveal className="relative grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-[172px_172px_205px_250px] lg:gap-5">
                {collageCards.map((card, i) => (
                  <div
                    key={card.title}
                    data-reveal
                    style={revealDelay(i, 60)}
                    className={`group relative isolate flex min-h-[185px] flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-hero-900 to-hero-950 p-5 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-400/50 hover:shadow-[0_30px_60px_-25px_rgba(34,211,238,0.35)] ${card.span}`}
                  >
                    <span aria-hidden="true" className="panel-dots absolute inset-0 opacity-50" />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-hero-950 via-hero-950/10 to-transparent"
                    />
                    <span className="pointer-events-none absolute right-4 bottom-4 grid size-8 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition-all duration-300 group-hover:border-accent-400/60 group-hover:bg-accent-400/20">
                      <Icon name="arrow-right" className="size-3.5" />
                    </span>

                    <span className="relative grid size-10 shrink-0 place-items-center rounded-xl border border-white/25 bg-white/10 text-accent-400 backdrop-blur-sm">
                      <Icon name={card.icon} className="size-4.5" />
                    </span>

                    <div className="relative pr-9">
                      <h3
                        className={`font-display leading-snug font-bold tracking-tight text-white ${
                          card.size === "lg" ? "text-lg lg:text-xl" : card.size === "md" ? "text-sm lg:text-base" : "text-xs lg:text-sm"
                        }`}
                      >
                        {card.title}
                      </h3>
                      <p
                        className={`mt-1.5 leading-relaxed text-white/60 ${
                          card.size === "sm" ? "text-[10px]" : "text-[11px] lg:text-xs"
                        }`}
                      >
                        {card.body}
                      </p>
                    </div>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </Rail>
      </section>

      {/* ------------------------------ Skill-building ecosystem ------------------------------ */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#050b1d] via-[#081b3a] to-[#0f2e6d] py-20 text-white lg:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <svg
            className="absolute inset-0 size-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path d="M0 20 L15 20 L22 12 L40 12" fill="none" stroke="#ffffff" strokeOpacity={0.08} strokeWidth={0.15} />
            <path d="M100 35 L80 35 L72 45 L55 45" fill="none" stroke="#ffffff" strokeOpacity={0.08} strokeWidth={0.15} />
            <path d="M62 0 L62 15 L77 15 L77 30" fill="none" stroke="#ffffff" strokeOpacity={0.08} strokeWidth={0.15} />
            <path d="M0 72 L20 72 L20 87 L35 87" fill="none" stroke="#ffffff" strokeOpacity={0.08} strokeWidth={0.15} />
            <path d="M100 82 L85 82 L85 97" fill="none" stroke="#ffffff" strokeOpacity={0.08} strokeWidth={0.15} />
            {[
              [15, 20], [22, 12], [40, 12], [80, 35], [72, 45], [55, 45],
              [62, 15], [77, 15], [77, 30], [20, 72], [20, 87], [35, 87], [85, 82], [85, 97],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={0.6} fill="#00d4ff" fillOpacity={0.5} />
            ))}
          </svg>
          <div className="drift-slow absolute -top-20 right-0 size-[30rem] rounded-full bg-[#1e88ff]/14 blur-[150px]" />
          <div className="absolute top-8 right-8 hidden text-right xl:block">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase">
              Skills &nbsp; Projects
            </p>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase">
              Opportunities &nbsp; Careers
            </p>
          </div>
        </div>

        <Rail className="relative">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <p className="font-mono text-xs font-bold tracking-[0.22em] text-[#00d4ff] uppercase">
                More than training
              </p>
              <h2 className="mt-5 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
                A Skill-Building
                <br />
                <span className="bg-gradient-to-r from-[#1e88ff] to-[#00d4ff] bg-clip-text text-transparent">
                  Ecosystem.
                </span>
              </h2>
              <Reveal className="mt-6 space-y-5 text-base leading-relaxed text-white/65 lg:text-[17px]">
                <p>
                  At {site.shortName}, technology education is designed to go beyond textbooks and
                  conventional classroom learning. The focus is on helping learners{" "}
                  <strong className="font-semibold text-white">learn, implement and grow</strong>{" "}
                  by combining conceptual understanding with practical application.
                </p>
                <p>
                  Through expert mentorship, real projects, industrial training and placement
                  support, learners gain hands-on experience that shows them how technology
                  actually works — not just how it is described in a slide.
                </p>
              </Reveal>
              <div className="mt-9 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-7">
                <div>
                  <p className="font-display text-2xl font-bold tracking-tight text-[#00d4ff]">
                    <CountUp value="5K+" />
                  </p>
                  <p className="mt-1 text-xs text-white/50">Students Trained</p>
                </div>
                <div className="pl-5">
                  <p className="font-display text-2xl font-bold tracking-tight text-[#00d4ff]">
                    <CountUp value={site.stats.partners} />
                  </p>
                  <p className="mt-1 text-xs text-white/50">Hiring Partners</p>
                </div>
                <div className="pl-5">
                  <p className="font-display text-2xl font-bold tracking-tight text-[#00d4ff]">
                    <CountUp value="95%" />
                  </p>
                  <p className="mt-1 text-xs text-white/50">Placement Support</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Overlapping panels — desktop and tablet */}
              <Reveal className="relative hidden h-[480px] md:block lg:h-[500px] xl:h-[560px]">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 size-full overflow-visible"
                  aria-hidden="true"
                >
                  <circle cx={4} cy={10} r={0.9} fill="#00d4ff" className="twinkle" />
                  <circle cx={96} cy={22} r={0.9} fill="#00d4ff" className="twinkle" style={{ ["--twinkle-delay" as string]: "0.6s" }} />
                  <circle cx={8} cy={92} r={0.9} fill="#00d4ff" className="twinkle" style={{ ["--twinkle-delay" as string]: "1.2s" }} />
                  <path d="M0 18 L20 18 L28 8" fill="none" stroke="#ffffff" strokeOpacity={0.12} strokeWidth={0.3} />
                  <path d="M100 30 L82 30 L76 42" fill="none" stroke="#ffffff" strokeOpacity={0.12} strokeWidth={0.3} />
                </svg>

                <div className="absolute top-0 left-0 aspect-[16/11] w-[64%] overflow-hidden rounded-[24px] border border-white/12 bg-gradient-to-br from-hero-900 to-hero-950 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)]">
                  <span aria-hidden="true" className="panel-dots absolute inset-0 opacity-50" />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-hero-950 via-hero-950/20 to-transparent"
                  />
                  <Icon name="monitor" className="absolute top-5 left-5 size-6 text-[#00d4ff]/70" />
                  <p className="absolute bottom-5 left-5 font-display text-2xl leading-[1.05] font-bold tracking-tight text-white sm:text-3xl">
                    Learn
                    <br />
                    Build
                    <br />
                    Grow
                  </p>
                </div>

                <div className="absolute right-0 bottom-0 z-10 aspect-[16/11] w-[64%] overflow-hidden rounded-[24px] border border-white/12 bg-gradient-to-br from-[#0f2b6e] to-hero-950 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.75)]">
                  <span aria-hidden="true" className="panel-dots absolute inset-0 opacity-50" />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-hero-950 via-hero-950/20 to-transparent"
                  />
                  <Icon name="users" className="absolute top-5 left-5 size-6 text-[#00d4ff]/70" />
                  <p className="absolute bottom-5 left-5 max-w-[62%] font-display text-base leading-snug font-bold tracking-tight text-white sm:text-lg">
                    Building Career-Ready Developers
                  </p>
                </div>

                {skillFloatCards.map((card) => (
                  <div
                    key={card.label}
                    className="absolute z-20 flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                    style={card.style}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#1e88ff] to-[#00d4ff] text-white">
                      <Icon name={card.icon} className="size-4.5" />
                    </span>
                    <span className="text-xs font-semibold whitespace-nowrap text-white sm:text-sm">
                      {card.label}
                    </span>
                  </div>
                ))}
              </Reveal>

              {/* Stacked panels — mobile */}
              <div className="space-y-4 md:hidden">
                <div className="relative aspect-[16/11] overflow-hidden rounded-[24px] border border-white/12 bg-gradient-to-br from-hero-900 to-hero-950">
                  <span aria-hidden="true" className="panel-dots absolute inset-0 opacity-50" />
                  <Icon name="monitor" className="absolute top-5 left-5 size-6 text-[#00d4ff]/70" />
                  <p className="absolute bottom-5 left-5 font-display text-xl leading-[1.05] font-bold tracking-tight text-white">
                    Learn
                    <br />
                    Build
                    <br />
                    Grow
                  </p>
                </div>
                <div className="relative aspect-[16/11] overflow-hidden rounded-[24px] border border-white/12 bg-gradient-to-br from-[#0f2b6e] to-hero-950">
                  <span aria-hidden="true" className="panel-dots absolute inset-0 opacity-50" />
                  <Icon name="users" className="absolute top-5 left-5 size-6 text-[#00d4ff]/70" />
                  <p className="absolute bottom-5 left-5 max-w-[85%] font-display text-lg leading-snug font-bold tracking-tight text-white">
                    Building Career-Ready Developers
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {skillFloatCards.map((card) => (
                    <div
                      key={card.label}
                      className="flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#1e88ff] to-[#00d4ff] text-white">
                        <Icon name={card.icon} className="size-4.5" />
                      </span>
                      <span className="text-xs font-semibold whitespace-nowrap text-white sm:text-sm">
                        {card.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Rail>
      </section>

      {/* -------------------------------- Why it matters -------------------------------- */}
      <section className="relative isolate overflow-hidden py-20 lg:py-28">
        <Rail>
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs font-bold tracking-[0.22em] text-brand-600 uppercase">
              Why it matters
            </p>
            <h2 className="relative mt-4 inline-block font-display text-3xl leading-[1.15] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem]">
              Preparing learners for a changing digital world
              <span
                aria-hidden="true"
                className="absolute top-0 -right-10 hidden size-7 rounded-full border border-brand-300 lg:block"
              />
            </h2>
            <Reveal className="mt-7 space-y-5 text-base leading-relaxed text-muted lg:text-[17px]">
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
            </Reveal>
            <Reveal className="mt-10 rounded-2xl border border-line bg-subtle px-7 py-8 sm:px-10">
              <p className="font-display text-lg leading-relaxed font-semibold text-balance text-ink lg:text-xl">
                The objective is not simply to teach a technology, but to develop the ability to
                understand problems, build solutions, use technology effectively and keep
                upgrading one&rsquo;s skills.
              </p>
            </Reveal>
          </div>
        </Rail>
      </section>

      {/* -------------------------------- Who we teach -------------------------------- */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#050b1d] to-[#081b3a] py-20 text-white lg:py-32">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(70% 60% at 50% 40%, #000 40%, transparent 100%)",
            }}
          />
          <div className="drift-slow absolute top-0 left-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#1e88ff]/14 blur-[170px]" />
          <div className="drift-slow-reverse absolute bottom-0 left-0 size-[26rem] rounded-full bg-[#00d4ff]/10 blur-[140px]" />
          <div className="drift-slow-reverse absolute right-0 bottom-0 size-[26rem] rounded-full bg-[#1e88ff]/10 blur-[140px]" />
          <div className="panel-noise absolute inset-0" />
          {ECOSYSTEM_PARTICLES.map((p, i) => (
            <span
              key={i}
              className="twinkle absolute size-1 rounded-full bg-accent-400"
              style={{ left: `${p.x}%`, top: `${p.y}%`, ["--twinkle-delay" as string]: `${p.delay}s` }}
            />
          ))}
        </div>

        <Rail className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-accent-400 uppercase shadow-[0_0_24px_-6px_rgba(0,212,255,0.6)]">
              Who we teach
            </span>
            <h2 className="mt-6 font-display text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl lg:text-[4rem]">
              Learning for every stage of the{" "}
              <span className="text-[#00d4ff]">career journey</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 lg:text-lg">
              {site.shortName}&rsquo;s training ecosystem is designed to serve a diverse learner
              base, including:
            </p>
          </div>

          <div className="relative mt-16 lg:mt-20">
            <svg
              className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {LEARNER_LINE_ROWS.map((row, i) => (
                <line
                  key={i}
                  x1={row.xs[0]}
                  y1={row.y}
                  x2={row.xs[2]}
                  y2={row.y}
                  stroke="#00d4ff"
                  strokeOpacity={0.18}
                  strokeWidth={0.15}
                  className="neural-flow"
                  style={{ ["--flow-delay" as string]: `${i * 0.6}s` }}
                />
              ))}
            </svg>

            <ul className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
              {learnerSegments.map((item, i) => (
                <li
                  key={item.step}
                  data-reveal
                  style={revealDelay(i, 70)}
                  className={`group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-400/40 hover:bg-white/[0.06] hover:shadow-[0_30px_60px_-30px_rgba(0,212,255,0.4)] ${
                    i % 3 === 1 ? "lg:translate-y-6" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-accent-400/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <span className="absolute top-6 right-6 rounded-full bg-gradient-to-br from-[#1e88ff] to-[#00d4ff] px-2.5 py-1 font-mono text-[10px] font-bold tracking-wide text-white shadow-[0_0_16px_-2px_rgba(0,212,255,0.65)]">
                    {item.step}
                  </span>
                  <span className="relative grid size-12 place-items-center rounded-2xl border border-accent-400/40 bg-accent-400/5 text-accent-400 shadow-[0_0_20px_-6px_rgba(0,212,255,0.5)]">
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <h3 className="relative mt-5 font-display text-lg font-bold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-white/60">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Rail>
      </section>

      {/* -------------------------- Learn / Practice / Build / Grow -------------------------- */}
      <section className="bg-white py-[72px] lg:py-[120px]">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs font-bold tracking-[0.22em] text-brand-600 uppercase">
              From classroom to practical experience
            </p>
            <h2 className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem]">
              Learn <span aria-hidden="true" className="text-brand-300">→</span> Practice{" "}
              <span aria-hidden="true" className="text-brand-300">→</span> Build{" "}
              <span aria-hidden="true" className="text-brand-300">→</span> Grow
            </h2>
          </div>

          <div className="relative mt-16 lg:mt-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-8 right-[12%] left-[12%] hidden lg:block"
            >
              <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-gradient-to-r from-[#1e88ff]/15 via-[#1e88ff]/40 to-[#00d4ff]/15">
                <div className="line-sweep absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-[#1e88ff] to-[#00d4ff]" />
              </div>
              {[0, 33.33, 66.66, 100].map((pct, i) => (
                <span
                  key={pct}
                  className="twinkle absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#1e88ff] to-[#00d4ff] shadow-[0_0_12px_rgba(30,136,255,0.6)] ring-[3px] ring-white"
                  style={{ left: `${pct}%`, ["--twinkle-delay" as string]: `${i * 0.4}s` }}
                />
              ))}
            </div>

            <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {journeySteps.map((step, i) => (
                <li
                  key={step.title}
                  data-reveal
                  style={revealDelay(i, 110)}
                  className="group relative z-10 flex flex-col items-center"
                >
                  <div className="relative z-10 grid size-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#1e88ff] to-[#00d4ff] font-display text-xl font-bold text-white shadow-[0_15px_35px_-8px_rgba(30,136,255,0.55)] ring-4 ring-white transition-transform duration-300 group-hover:scale-105">
                    {step.step}
                  </div>
                  <div className="-mt-8 flex w-full flex-1 flex-col items-center rounded-[24px] border border-[rgba(30,136,255,0.1)] bg-white/70 px-6 pt-12 pb-8 text-center shadow-[0_20px_60px_rgba(30,136,255,0.08)] backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-[rgba(30,136,255,0.3)] group-hover:shadow-[0_30px_70px_-10px_rgba(30,136,255,0.18)]">
                    <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name={journeyIcons[i]} className="size-5" />
                    </span>
                    <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.body}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-subtle px-3 py-1 text-[11px] font-semibold text-muted">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      {journeyBadges[i]}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ------------------------------- The difference ------------------------------- */}
      <section className="relative isolate overflow-hidden bg-panel py-20 text-white lg:py-28">
        <PanelGlow />
        <Rail className="relative">
          <div className="max-w-3xl">
            <UiEyebrow onDark>The difference</UiEyebrow>
            <h2 className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              What makes {site.shortName} different?
            </h2>
          </div>
          <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {differencePoints.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                style={revealDelay(i, 70)}
                className="flex gap-3.5"
              >
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-accent-400/50 text-accent-400">
                  <Icon name="check" className="size-3.5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/65">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Rail>
      </section>

      {/* -------------------------------- What you can learn -------------------------------- */}
      <section className="relative isolate overflow-hidden bg-white py-[72px] lg:py-[120px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="drift-slow absolute -top-24 -right-32 size-[30rem] rounded-full bg-[#1e88ff]/8 blur-[130px]" />
          <div className="drift-slow-reverse absolute -bottom-24 -left-24 size-[26rem] rounded-full bg-[#00d4ff]/8 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-4">
              <p className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-[0.22em] text-brand-600 uppercase">
                What you can learn
                <span aria-hidden="true" className="h-px w-8 bg-brand-300" />
              </p>
              <h2 className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
                <span className="text-[#081b3a]">Building skills across</span>{" "}
                <span className="bg-gradient-to-r from-[#1e88ff] to-[#00d4ff] bg-clip-text text-transparent">
                  technology domains
                </span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#64748b]">
                Whether a learner wants to code an application, analyse data, build an AI
                solution, secure a network, manage cloud infrastructure, design a digital
                experience, create visual content or grow a business online, {site.shortName}{" "}
                provides multiple learning pathways.
              </p>
              <ButtonLink href="/courses" size="lg" className="mt-8">
                View All Courses
                <Icon name="arrow-right" className="size-4" />
              </ButtonLink>
            </div>

            <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
              {learnDomains.map((domain, i) => (
                <li
                  key={domain.name}
                  data-reveal
                  style={revealDelay(i, 90)}
                  className="group rounded-[24px] border border-[rgba(30,136,255,0.1)] bg-white/70 p-6 shadow-[0_20px_60px_rgba(30,136,255,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(30,136,255,0.3)] hover:shadow-[0_30px_70px_-10px_rgba(30,136,255,0.18)]"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-[#1e88ff] group-hover:to-[#00d4ff] group-hover:text-white">
                    <Icon name={domain.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold tracking-tight text-ink">
                    {domain.name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-0.5 w-8 rounded-full bg-gradient-to-r from-[#1e88ff] to-[#00d4ff] transition-all duration-300 group-hover:w-12"
                  />
                  <ul className="mt-4 space-y-2.5">
                    {domain.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#081b3a]">
                        <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------- Our approach ------------------------------- */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#050b1d] to-[#081b3a] py-20 text-white lg:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(70% 60% at 50% 30%, #000 40%, transparent 100%)",
            }}
          />
          <div className="drift-slow absolute top-0 left-1/4 size-[36rem] rounded-full bg-[#1e88ff]/12 blur-[160px]" />
          <div className="drift-slow-reverse absolute right-0 bottom-0 size-[30rem] rounded-full bg-[#00d4ff]/10 blur-[150px]" />
          {ECOSYSTEM_PARTICLES.map((p, i) => (
            <span
              key={i}
              className="twinkle absolute size-1 rounded-full bg-accent-400"
              style={{ left: `${p.x}%`, top: `${p.y}%`, ["--twinkle-delay" as string]: `${p.delay}s` }}
            />
          ))}
        </div>

        <Rail className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-bold tracking-[0.22em] text-[#00d4ff] uppercase">
              Our approach
            </p>
            <h2 className="mt-4 font-display text-3xl leading-[1.15] font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              Practical. Future-
              <br />
              Focused.{" "}
              <span className="bg-gradient-to-r from-[#1e88ff] to-[#00d4ff] bg-clip-text text-transparent">
                Career-Oriented.
              </span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/60">
              {site.shortName}&rsquo;s approach is built around three principles.
            </p>
          </div>

          <div className="relative mt-16 lg:mt-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-11 right-[16%] left-[16%] hidden lg:block"
            >
              <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-gradient-to-r from-[#1e88ff]/15 via-[#1e88ff]/40 to-[#00d4ff]/15">
                <div className="line-sweep absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-[#1e88ff] to-[#00d4ff]" />
              </div>
              {[0, 50, 100].map((pct, i) => (
                <span
                  key={pct}
                  className="twinkle absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#1e88ff] to-[#00d4ff] shadow-[0_0_12px_rgba(0,212,255,0.6)] ring-2 ring-[#081b3a]"
                  style={{ left: `${pct}%`, ["--twinkle-delay" as string]: `${i * 0.4}s` }}
                />
              ))}
            </div>

            <ol className="relative grid gap-8 lg:grid-cols-3">
              {approachPrinciples.map((item, i) => (
                <li
                  key={item.step}
                  data-reveal
                  style={revealDelay(i, 110)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[rgba(0,212,255,0.2)] bg-[rgba(15,46,109,0.75)] p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#00d4ff] hover:shadow-[0_30px_60px_-20px_rgba(0,212,255,0.35)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-[#1e88ff] to-[#00d4ff] text-white shadow-[0_10px_24px_-6px_rgba(0,212,255,0.6)]">
                      <Icon name={item.icon} className="size-6" />
                    </span>
                    <span className="font-display text-3xl font-bold text-white/15">{item.step}</span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/65">{item.body}</p>
                  <span aria-hidden="true" className="mt-6 block h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full w-2/5 rounded-full bg-gradient-to-r from-[#1e88ff] to-[#00d4ff]" />
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Rail>
      </section>

      {/* ----------------------------- Industry engagement ----------------------------- */}
      <section className="relative isolate overflow-hidden bg-white py-20 lg:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 size-[28rem] rounded-full bg-brand-400/8 blur-[130px]" />
          <div
            className="absolute top-1/4 right-8 hidden size-40 opacity-40 lg:block"
            style={{
              backgroundImage: "radial-gradient(rgba(37,99,235,0.35) 1px, transparent 0)",
              backgroundSize: "14px 14px",
            }}
          />
        </div>

        <Rail className="relative">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <div
                aria-hidden="true"
                className="drift-slow pointer-events-none absolute -top-8 -left-8 size-56 rounded-full bg-brand-400/15 blur-[90px]"
              />
              <MediaFrame
                reveal
                caption={`Screen-side during the Agentic AI workshop near ${site.city}`}
                icon="sparkles"
                className="relative aspect-[4/3] lg:aspect-[5/4]"
                sizes="(min-width: 1024px) 42vw, 92vw"
              />
              <div className="absolute top-6 -left-4 flex items-center gap-2.5 rounded-2xl bg-white/80 px-4 py-3 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.35)] backdrop-blur-md">
                <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name="graduation-cap" className="size-4.5" />
                </span>
                <span className="text-xs font-semibold whitespace-nowrap text-ink sm:text-sm">
                  Industry Interaction
                </span>
              </div>
              <div className="absolute top-1/2 -right-4 flex -translate-y-1/2 items-center gap-2.5 rounded-2xl bg-white/80 px-4 py-3 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.35)] backdrop-blur-md">
                <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name="users" className="size-4.5" />
                </span>
                <span className="text-xs font-semibold whitespace-nowrap text-ink sm:text-sm">
                  Real-World Exposure
                </span>
              </div>
            </div>

            <div className="relative border-l-2 border-brand-100 pl-7">
              <p className="font-mono text-xs font-bold tracking-[0.22em] text-brand-600 uppercase">
                Industry engagement
              </p>
              <h2 className="mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl">
                Connecting education with industry
              </h2>
              <Reveal className="mt-6 space-y-5 text-base leading-relaxed text-muted lg:text-[17px]">
                <p>
                  A major part of {site.shortName}&rsquo;s broader ecosystem is its engagement with
                  educational institutions and industry-oriented initiatives. Public records show{" "}
                  {site.shortName} participating in campus placement activities and technology
                  workshops with educational institutions, providing students with opportunities
                  for industry interaction and practical exposure.
                </p>
                <p>
                  These interactions help strengthen the bridge between what students learn and
                  how technology is applied professionally.
                </p>
              </Reveal>
              <ButtonLink href="/college-partnerships" size="lg" className="mt-8">
                Explore Industry Connect
                <Icon name="arrow-right" className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </Rail>
      </section>

      {/* ------------------------- Awards, recognition & accreditation ------------------------- */}
      <section className="relative isolate overflow-hidden bg-white py-20 lg:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/3 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400/8 blur-[160px]" />
          <div className="absolute -top-24 -left-24 hidden size-72 rounded-full border border-brand-100 lg:block" />
          <div className="absolute -right-24 -bottom-24 hidden size-72 rounded-full border border-brand-100 lg:block" />
        </div>

        <Rail className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs font-bold tracking-[0.22em] text-brand-600 uppercase">
              Awards, recognition & accreditation
            </p>
            <h2 className="mt-4 font-display text-3xl leading-[1.15] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem]">
              Recognition built through learning, innovation and{" "}
              <span className="bg-gradient-to-r from-[#1e88ff] to-[#00d4ff] bg-clip-text text-transparent">
                industry engagement
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted">
              {site.shortName}&rsquo;s credibility is supported not only by its training programs
              but also by its participation in industry-academia initiatives, campus placements,
              workshops, technology events and institutional collaborations.
            </p>
          </div>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16">
            {accreditations.map((item, i) => (
              <li
                key={item.step}
                data-reveal
                style={revealDelay(i, 90)}
                className="group relative overflow-hidden rounded-[24px] border border-[rgba(30,136,255,0.12)] bg-white p-7 shadow-[0_15px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[0_30px_60px_-20px_rgba(30,136,255,0.25)]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-3 right-4 font-display text-6xl font-extrabold text-brand-50 select-none"
                >
                  {item.step}
                </span>
                <div className="relative flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#1e88ff] to-[#00d4ff] text-white shadow-[0_10px_24px_-8px_rgba(30,136,255,0.6)]">
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-muted italic">
            The recognitions above are drawn from publicly available information, institutional
            announcements and {site.shortName}&rsquo;s own published profiles.
          </p>
        </Rail>
      </section>

      {/* --------------------------------- Our belief --------------------------------- */}
      <section className="relative isolate overflow-hidden bg-white py-20 lg:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 size-[28rem] rounded-full bg-[#1e88ff]/8 blur-[130px]" />
          <div className="absolute -right-24 -bottom-24 size-[26rem] rounded-full bg-[#00d4ff]/8 blur-[120px]" />
          <div
            className="absolute top-1/3 right-10 hidden size-48 opacity-50 lg:block"
            style={{
              backgroundImage: "radial-gradient(rgba(30,136,255,0.3) 1px, transparent 0)",
              backgroundSize: "16px 16px",
            }}
          />
          <span className="absolute top-20 left-[8%] hidden size-16 rotate-12 rounded-2xl border border-brand-100 lg:block" />
          <span className="absolute right-[10%] bottom-24 hidden size-20 -rotate-6 rounded-full border border-brand-100 lg:block" />
        </div>

        <Rail className="relative">
          <UiEyebrow>Our belief</UiEyebrow>

          <div className="mt-8 grid gap-12 lg:mt-12 lg:grid-cols-2 lg:gap-16">
            <h2 className="font-display tracking-tight">
              {[
                { text: "Technology changes.", accent: false },
                { text: "Skills evolve.", accent: false },
                { text: "Learning never stops.", accent: true },
              ].map((line, i) => (
                <span
                  key={line.text}
                  data-reveal
                  style={revealDelay(i, 140)}
                  className={`block border-b border-line py-4 text-4xl leading-[1.1] font-extrabold text-balance first:pt-0 last:border-0 last:pb-0 sm:text-5xl lg:text-[4rem] ${
                    line.accent
                      ? "bg-gradient-to-r from-[#00d4ff] to-[#1e88ff] bg-clip-text text-transparent"
                      : "text-[#081b3a]"
                  }`}
                >
                  {line.text}
                </span>
              ))}
            </h2>

            <div
              data-reveal
              style={revealDelay(3, 100)}
              className="relative self-start rounded-[24px] border border-[rgba(30,136,255,0.12)] bg-[#f8fafc]/70 p-8 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)] backdrop-blur-md lg:mt-6"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-6 left-0 w-1 rounded-full bg-gradient-to-b from-[#00d4ff] to-[#1e88ff] shadow-[0_0_14px_rgba(0,212,255,0.5)]"
              />
              <div className="space-y-5 pl-4 text-base leading-relaxed text-muted lg:text-[17px]">
                <p>
                  We believe that meaningful technology education should not end when a course
                  ends.
                </p>
                <p>
                  It should give learners the knowledge to understand, the skills to build, the
                  confidence to perform and the curiosity to keep growing.
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-24 max-w-3xl lg:mt-28">
            <div className="absolute -top-6 -left-6 z-20 hidden items-center gap-2.5 rounded-full border border-line bg-white/90 px-4 py-2.5 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.3)] backdrop-blur-md sm:flex">
              <span className="grid size-7 place-items-center rounded-full bg-brand-50 text-brand-600">
                <Icon name="briefcase" className="size-3.5" />
              </span>
              <span className="text-xs font-semibold whitespace-nowrap text-ink">Industry Ready</span>
            </div>
            <div className="absolute -top-6 -right-6 z-20 hidden items-center gap-2.5 rounded-full border border-line bg-white/90 px-4 py-2.5 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.3)] backdrop-blur-md lg:flex">
              <span className="grid size-7 place-items-center rounded-full bg-brand-50 text-brand-600">
                <Icon name="target" className="size-3.5" />
              </span>
              <span className="text-xs font-semibold whitespace-nowrap text-ink">Practical Skills</span>
            </div>
            <div className="absolute -right-4 -bottom-6 z-20 hidden items-center gap-2.5 rounded-full border border-line bg-white/90 px-4 py-2.5 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.3)] backdrop-blur-md sm:flex">
              <span className="grid size-7 place-items-center rounded-full bg-brand-50 text-brand-600">
                <Icon name="rocket" className="size-3.5" />
              </span>
              <span className="text-xs font-semibold whitespace-nowrap text-ink">Career Growth</span>
            </div>

            <div
              data-reveal
              className="group relative overflow-hidden rounded-[28px] border border-[rgba(30,136,255,0.12)] bg-white text-center shadow-[0_40px_80px_-40px_rgba(15,23,42,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_50px_90px_-35px_rgba(30,136,255,0.35)]"
            >
              <span
                aria-hidden="true"
                className="block h-1.5 bg-gradient-to-r from-[#1e88ff] via-brand-500 to-[#00d4ff]"
              />
              <div className="px-7 py-12 sm:px-12 lg:py-16">
                <UiEyebrow>{`${site.shortName} today`}</UiEyebrow>
                <div className="mt-9 grid grid-cols-3 divide-x divide-line gap-4 sm:gap-8">
                  {[
                    { label: "Learn", icon: "layers" },
                    { label: "Implement", icon: "code" },
                    { label: "Grow", icon: "chart" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-3">
                      <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#1e88ff] to-[#00d4ff] text-white shadow-[0_14px_28px_-10px_rgba(30,136,255,0.55)]">
                        <Icon name={item.icon} className="size-6" />
                      </span>
                      <span className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mx-auto mt-9 max-w-xl text-sm leading-relaxed text-muted lg:text-base">
                  With a focus on practical technology education, emerging skills, industry
                  engagement and career development, {site.shortName} continues its journey
                  towards creating a stronger ecosystem of future-ready technology professionals.
                </p>
                <div className="mt-10 border-t border-line pt-8">
                  <p className="text-xs tracking-[0.14em] text-muted uppercase">{site.tagline}</p>
                  <p className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
                    {site.shortName}
                  </p>
                  <p className="mt-2 text-sm text-muted">Where Your Tech Journey Begins.</p>
                </div>
              </div>
            </div>
          </div>
        </Rail>
      </section>

      {/* ------------------------------ Ready to get started ------------------------------ */}
      <section className="relative isolate overflow-hidden bg-subtle py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="drift-slow pointer-events-none absolute top-1/3 -right-32 -z-10 size-[30rem] rounded-full bg-brand-400/10 blur-[130px]"
        />
        <Rail>
          <div className="relative mx-auto max-w-2xl text-center">
            <span
              aria-hidden="true"
              className="absolute top-1/2 -left-14 hidden size-9 -translate-y-1/2 rounded-full border border-brand-200 lg:block"
            />
            <p className="font-mono text-xs font-bold tracking-[0.22em] text-brand-600 uppercase">
              Ready to get started?
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.1] font-bold tracking-tight text-balance text-ink sm:text-5xl">
              Start building your career today.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted lg:text-lg">
              Talk to a counsellor today. One call is usually enough to know which track fits
              your degree, your schedule and the job you want.
            </p>

            <div className="mx-auto mt-9 max-w-md">
              <QuickDemoFormLight />
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                href={site.contact.phoneHref}
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 py-3 pr-6 pl-4 text-white shadow-[0_16px_32px_-12px_rgba(37,99,235,0.55)] transition-all duration-300 hover:shadow-[0_20px_40px_-12px_rgba(37,99,235,0.65)]"
              >
                <span className="grid size-9 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:scale-105">
                  <Icon name="phone" className="size-4" />
                </span>
                <span className="text-left">
                  <span className="block text-[10px] font-bold tracking-[0.18em] text-white/75 uppercase">
                    Call now
                  </span>
                  <span className="block text-base leading-tight font-bold">
                    {site.contact.phone}
                  </span>
                </span>
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {["Free career counselling", "No registration fee", "Placement support included"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full border border-brand-200 text-brand-600">
                      <Icon name="check" className="size-3" />
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </Rail>
      </section>
    </RevealScope>
  );
}
