import { site } from "./site";
import { courses, getCourse } from "./courses";

/* ---------------------------------------------------------------------------
   Certificate programs — a track × duration matrix, the same structure the
   flagship centre publishes. Every page is generated from this data, so adding
   a track or a duration adds a whole set of routes.
   --------------------------------------------------------------------------- */

export interface ProgramTrack {
  /** Matches a Course id, so syllabus and tooling are reused. */
  id: string;
  name: string;
  blurb: string;
}

export interface ProgramDuration {
  /** Slug fragment, e.g. "3-month". */
  slug: string;
  months: 3 | 6 | 9;
  label: string;
  tier: "Certificate" | "Advanced Certificate" | "Diploma";
  hours: string;
  summary: string;
  includes: string[];
}

export const programTracks: ProgramTrack[] = [
  { id: "artificial-intelligence", name: "Artificial Intelligence", blurb: "Machine learning, deep learning and generative AI on real datasets." },
  { id: "agentic-ai", name: "Agentic AI", blurb: "Autonomous agents that plan, use tools and finish multi-step work." },
  { id: "data-science", name: "Data Science", blurb: "Statistics, Python, SQL and modelling for decision-making roles." },
  { id: "data-analytics", name: "Data Analytics", blurb: "Excel, SQL, Power BI and Python for reporting and insight roles." },
  { id: "full-stack-development", name: "Full-Stack Development", blurb: "Front-end, back-end, databases and deployment end to end." },
  { id: "mern-stack", name: "MERN Stack", blurb: "MongoDB, Express, React and Node in one JavaScript stack." },
  { id: "flutter-app-development", name: "Flutter App Development", blurb: "Cross-platform Android and iOS apps from a single codebase." },
  { id: "cyber-security", name: "Cyber Security", blurb: "Offensive and defensive security in authorised lab ranges." },
  { id: "cloud-computing", name: "Cloud Computing", blurb: "AWS, Azure, containers, CI/CD and infrastructure as code." },
  { id: "digital-marketing", name: "Digital Marketing", blurb: "SEO, paid ads, social and analytics on live campaigns." },
];

export const programDurations: ProgramDuration[] = [
  {
    slug: "3-month",
    months: 3,
    label: "3 Months",
    tier: "Certificate",
    hours: "≈ 180 hours",
    summary:
      "A focused certificate for students and working professionals who need job-ready skills quickly. Core syllabus plus one guided project.",
    includes: [
      "Core syllabus with daily lab practice",
      "One guided portfolio project",
      "Industry certificate on completion",
      "Interview preparation workshop",
    ],
  },
  {
    slug: "6-month",
    months: 6,
    label: "6 Months",
    tier: "Advanced Certificate",
    hours: "≈ 380 hours",
    summary:
      "The most popular format. Full syllabus, advanced modules and a supervised internship on live client work.",
    includes: [
      "Complete syllabus including advanced modules",
      "Live client project with mentor code review",
      "Internship letter for real project work",
      "Industry certificate on completion",
      "Placement drives and mock interviews",
    ],
  },
  {
    slug: "9-month",
    months: 9,
    label: "9 Months",
    tier: "Diploma",
    hours: "≈ 560 hours",
    summary:
      "Our expert track. Everything in the six-month program plus specialisation electives, a second client project and extended placement support.",
    includes: [
      "Full syllabus plus specialisation electives",
      "Two live client projects",
      "Extended internship with a team lead",
      "Diploma certificate on completion",
      "Priority placement support for 12 months",
      "Soft skills and communication training",
    ],
  },
];

export interface Program {
  slug: string;
  track: ProgramTrack;
  duration: ProgramDuration;
  /** After-12th variants add foundation modules before the core syllabus. */
  after12th: boolean;
  title: string;
  summary: string;
}

const buildProgram = (
  track: ProgramTrack,
  duration: ProgramDuration,
  after12th: boolean,
): Program => {
  const prefix = after12th ? "after-12th-" : "";
  const kind = after12th ? "Program After 12th" : "Program";
  return {
    slug: `${prefix}${duration.slug}-${track.id}-program-in-${site.citySlug}`,
    track,
    duration,
    after12th,
    title: `${duration.label} ${track.name} ${kind} in ${site.city}`,
    summary: after12th
      ? `Built for students straight out of school. Starts with computer and programming foundations, then moves into the full ${track.name.toLowerCase()} syllabus over ${duration.label.toLowerCase()}.`
      : `${duration.summary} ${track.blurb}`,
  };
};

export const programs: Program[] = programTracks.flatMap((track) =>
  programDurations.flatMap((duration) => [
    buildProgram(track, duration, false),
    buildProgram(track, duration, true),
  ]),
);

export const programsBySlug = new Map(programs.map((p) => [p.slug, p]));

export const getProgram = (slug: string) => programsBySlug.get(slug);

export const programsForTrack = (trackId: string) =>
  programs.filter((p) => p.track.id === trackId);

/** Course record behind a program, for syllabus reuse. */
export const programCourse = (program: Program) => getCourse(program.track.id);

/* ---------------------------------------------------------------------------
   Industrial training formats — the university-mandated and summer/winter
   durations, published as their own landing pages.
   --------------------------------------------------------------------------- */

export interface TrainingFormat {
  slug: string;
  label: string;
  title: string;
  audience: string;
  summary: string;
  highlights: string[];
}

export const trainingFormats: TrainingFormat[] = [
  {
    slug: `45-days-training-in-${site.citySlug}`,
    label: "45 Days",
    title: `45 Days Industrial Training in ${site.city}`,
    audience: "Summer and winter break, B.Tech / BCA / MCA 2nd and 3rd year",
    summary:
      "A short, intense track that fits inside a semester break. You pick one technology, build one complete project and leave with a training certificate your university accepts.",
    highlights: [
      "One technology, one shipped project",
      "Daily lab hours with a trainer present",
      "University-format training report and certificate",
      "Weekend batches available",
    ],
  },
  {
    slug: `6-weeks-training-in-${site.citySlug}`,
    label: "6 Weeks",
    title: `6 Weeks Industrial Training in ${site.city}`,
    audience: "University-mandated 6-week training requirement",
    summary:
      "Designed against the standard university six-week training requirement — attendance records, project file, presentation and certificate included.",
    highlights: [
      "Meets PTU / Panjab University training norms",
      "Project file and viva preparation",
      "Attendance and completion documentation",
      "Choice of 12+ technology tracks",
    ],
  },
  {
    slug: `4-months-training-in-${site.citySlug}`,
    label: "4 Months",
    title: `4 Months Industrial Training in ${site.city}`,
    audience: "Final-year students with a semester-long training slot",
    summary:
      "A semester-length track with enough runway to cover a full syllabus and a supervised project, with weekly mentor reviews.",
    highlights: [
      "Full syllabus, not a condensed version",
      "Supervised project with weekly reviews",
      "Internship experience letter",
      "Placement drive access",
    ],
  },
  {
    slug: `6-months-training-in-${site.citySlug}`,
    label: "6 Months",
    title: `6 Months Industrial Training in ${site.city}`,
    audience: "Final-year B.Tech / MCA industrial training semester",
    summary:
      "The standard final-semester industrial training. Core syllabus, live client project, internship letter and placement support in one program.",
    highlights: [
      "Live client project, not a sample app",
      "Mentor code review every week",
      "Internship letter and industry certificate",
      "Interview preparation and placement drives",
    ],
  },
  {
    slug: `9-months-training-in-${site.citySlug}`,
    label: "9 Months",
    title: `9 Months Industrial Training in ${site.city}`,
    audience: "Students who want maximum depth before their first job",
    summary:
      "Our longest format. Two client projects, specialisation electives and a full year of placement support after completion.",
    highlights: [
      "Two live client projects",
      "Specialisation electives",
      "Extended internship with a team lead",
      "12 months of placement support",
    ],
  },
  {
    slug: `industrial-training-in-${site.citySlug}`,
    label: "All Formats",
    title: `Industrial Training in ${site.city}`,
    audience: "All engineering and computer applications students",
    summary:
      "Every industrial training format we run, from a 45-day break project to a nine-month diploma track — with the documentation universities ask for.",
    highlights: [
      "45 days, 6 weeks, 4, 6 and 9 month formats",
      "University-accepted certificates and reports",
      "Live projects across 12+ technology tracks",
      "Placement assistance included",
    ],
  },
  {
    slug: `internship-program-in-${site.citySlug}`,
    label: "Internship",
    title: `Internship Program in ${site.city}`,
    audience: "Students and freshers who need real work experience",
    summary:
      "A supervised internship on live client work — sprint planning, code review, deployment and a written experience letter at the end.",
    highlights: [
      "Real client tickets, not practice exercises",
      "Daily stand-ups and sprint reviews",
      "Code review from working engineers",
      "Internship experience letter",
    ],
  },
];

export const trainingFormatsBySlug = new Map(trainingFormats.map((t) => [t.slug, t]));

/* ---------------------------------------------------------------------------
   After-12th course pages — shorter, foundation-first tracks for school leavers.
   --------------------------------------------------------------------------- */

export interface After12Course {
  slug: string;
  title: string;
  courseId: string;
  duration: string;
  summary: string;
}

const after12Tracks: { courseId: string; duration: string }[] = [
  { courseId: "python", duration: "3 months" },
  { courseId: "generative-ai", duration: "4 months" },
  { courseId: "machine-learning", duration: "4 months" },
  { courseId: "deep-learning", duration: "4 months" },
  { courseId: "data-science", duration: "6 months" },
  { courseId: "data-analytics", duration: "4 months" },
  { courseId: "full-stack-development", duration: "6 months" },
  { courseId: "web-development", duration: "3 months" },
  { courseId: "digital-marketing", duration: "4 months" },
  { courseId: "cyber-security", duration: "6 months" },
  { courseId: "ethical-hacking", duration: "4 months" },
  { courseId: "cloud-computing", duration: "6 months" },
  { courseId: "flutter-app-development", duration: "4 months" },
  { courseId: "web-designing", duration: "3 months" },
];

export const after12Courses: After12Course[] = after12Tracks.map(({ courseId, duration }) => {
  const course = getCourse(courseId)!;
  return {
    slug: `after-12th-${courseId}-course-in-${site.citySlug}`,
    title: `${course.name} Course After 12th in ${site.city}`,
    courseId,
    duration,
    summary: `A ${duration} ${course.name.toLowerCase()} track designed for students straight out of school — no prior experience assumed. Starts with computer and programming foundations, then covers the full professional syllabus.`,
  };
});

export const after12CoursesBySlug = new Map(after12Courses.map((c) => [c.slug, c]));

/** Every course that appears anywhere in the after-12th section. */
export const after12Highlights = after12Courses
  .map((a) => ({ ...a, course: getCourse(a.courseId)! }))
  .filter((a) => Boolean(a.course));

export const allProgramSlugs = [
  ...programs.map((p) => p.slug),
  ...trainingFormats.map((t) => t.slug),
  ...after12Courses.map((c) => c.slug),
];

/** Guard against a track id that no longer matches a course. */
export const orphanedTracks = programTracks.filter((t) => !courses.some((c) => c.id === t.id));
