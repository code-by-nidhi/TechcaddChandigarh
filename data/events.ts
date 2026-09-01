import { site } from "./site";

export interface CampusEvent {
  slug: string;
  title: string;
  date: string;
  location: string;
  type: "Summit" | "Workshop" | "Seminar" | "Drive";
  excerpt: string;
  body: string[];
  agenda: { time: string; item: string }[];
}

export const events: CampusEvent[] = [
  {
    slug: "techcadd-ai-summit",
    title: "techcadd AI Summit — Artificial Intelligence & Innovation",
    date: "2026-10-11",
    location: `${site.city} campus, Sector 34-A`,
    type: "Summit",
    excerpt:
      "A full day on where applied AI actually stands — live agent demos, a hiring panel, and student project showcases.",
    body: [
      "Our annual AI summit brings together working engineers, hiring managers and students for a day that stays deliberately practical. No keynote slides about the future of everything — demos that run, systems that fail on stage and get debugged, and honest conversation about what companies are actually paying for.",
      "The afternoon hiring panel is the part students consistently rate highest. Four hiring managers review anonymised candidate portfolios in front of the room and say what they would do with each one. It is uncomfortable and extremely useful.",
    ],
    agenda: [
      { time: "09:30", item: "Registration and campus tour" },
      { time: "10:00", item: "Opening: what shipped in AI this year that matters" },
      { time: "11:15", item: "Live build: an agent with tools, memory and evaluation" },
      { time: "13:00", item: "Lunch and student project showcase" },
      { time: "14:30", item: "Hiring panel: portfolios reviewed live" },
      { time: "16:00", item: "Open Q&A and counselling desks" },
    ],
  },
  {
    slug: "4-day-app-development-workshop",
    title: "4-Day App Development Workshop",
    date: "2026-09-22",
    location: `${site.city} campus, Lab 3`,
    type: "Workshop",
    excerpt:
      "Build and publish a working Flutter app in four days — from empty project to a store listing.",
    body: [
      "A compressed, hands-on workshop where every participant leaves with an app on their own phone and a build uploaded to the Play Console. Laptops provided if you do not have one.",
      "Open to students of any background. We cover just enough Dart on day one to get moving, then spend the rest of the time building.",
    ],
    agenda: [
      { time: "Day 1", item: "Dart essentials and your first Flutter screen" },
      { time: "Day 2", item: "Layout, navigation and state" },
      { time: "Day 3", item: "Firebase auth and live data" },
      { time: "Day 4", item: "Polish, build signing and Play Console upload" },
    ],
  },
  {
    slug: "seminar-on-future-with-ai",
    title: "Seminar: Building a Career With AI, Not Against It",
    date: "2026-09-06",
    location: `${site.city} campus, Auditorium`,
    type: "Seminar",
    excerpt:
      "A free two-hour session for students and parents on which skills hold value as AI tooling improves.",
    body: [
      "Aimed squarely at students choosing a direction and the parents helping them decide. We go through which roles have genuinely changed, which are growing, and what a realistic first-job path looks like from here.",
      "No enrolment pitch. Counselling desks are open afterwards for anyone who wants to talk specifics.",
    ],
    agenda: [
      { time: "17:00", item: "What actually changed in the job market" },
      { time: "17:45", item: "Skill paths that hold value" },
      { time: "18:15", item: "Q&A with trainers and alumni" },
      { time: "18:45", item: "Open counselling desks" },
    ],
  },
  {
    slug: "tricity-placement-drive",
    title: "Tricity Placement Drive",
    date: "2026-11-08",
    location: `${site.city} campus, Placement Hall`,
    type: "Drive",
    excerpt:
      "On-campus interviews with hiring partners across development, data, marketing and support roles.",
    body: [
      "Our largest quarterly drive, open to current students and alumni. Companies interview on site across the day, with offers typically confirmed within a fortnight.",
      "Bring printed copies of your CV and be ready to walk through one project in depth. Portfolio review desks open an hour before interviews start.",
    ],
    agenda: [
      { time: "09:00", item: "Portfolio and CV review desks" },
      { time: "10:00", item: "Company presentations" },
      { time: "11:00", item: "Technical rounds begin" },
      { time: "15:00", item: "HR rounds" },
      { time: "17:00", item: "Wrap-up and next steps" },
    ],
  },
];

export const eventsBySlug = new Map(events.map((e) => [e.slug, e]));

export const upcomingEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));
