import { site } from "./site";
import { courseSlug, courses, courseCategories, trainingSlug } from "./courses";
import { programDurations, programTracks, trainingFormats, after12Courses } from "./programs";
import { branches } from "./branches";

export interface NavLink {
  label: string;
  href: string;
  badge?: "Hot" | "New" | "Trending";
  description?: string;
}

/** A numbered column in the wide mega panel. */
export interface NavColumn {
  title: string;
  subtitle?: string;
  links: NavLink[];
}

/** An icon tile in the grid-style mega panel. */
export interface NavTile {
  label: string;
  href: string;
  icon: string;
  badge?: "Hot" | "New" | "Trending";
}

/** A preview card in the About-style panel. */
export interface NavCard {
  title: string;
  href: string;
  badge: string;
  meta: string;
  icon: string;
}

/** Quote strip along the bottom of a mega panel. */
export interface NavFooter {
  quote: string;
  attribution?: string;
  cta: { label: string; href: string };
}

/** A link column with a lead icon — the AI panel's two "Fundamentals / Development" groups. */
export interface AiPanelColumn {
  icon: string;
  title: string;
  links: NavLink[];
}

export type NavPanel =
  | { kind: "columns"; columns: NavColumn[]; footer?: NavFooter }
  | { kind: "tiles"; tiles: NavTile[]; footer?: NavFooter }
  | { kind: "cards"; links: NavLink[]; cta: NavLink; cards: NavCard[] }
  | {
      kind: "ai";
      heading: string;
      subtitle: string;
      columns: AiPanelColumn[];
      featured: { title: string; badge: string; href: string; icon: string };
      cta: { heading: string; buttonLabel: string; href: string };
    };

export interface NavItem {
  label: string;
  href: string;
  /** Renders the AI item as a filled blue pill, as on the reference nav. */
  highlight?: boolean;
  panel?: NavPanel;
}

const link = (id: string, label?: string): NavLink => {
  const course = courses.find((c) => c.id === id)!;
  return { label: label ?? course.name, href: `/${courseSlug(id)}`, badge: course.badge };
};

const tile = (id: string, icon: string, label?: string): NavTile => {
  const course = courses.find((c) => c.id === id)!;
  return {
    label: label ?? course.name,
    href: `/${courseSlug(id)}`,
    icon,
    badge: course.badge === "New" ? "New" : undefined,
  };
};

const programmingQuote: NavFooter = {
  quote: "Everybody should learn to program a computer, because it teaches you how to think.",
  attribution: "Steve Jobs",
  cta: { label: "Browse all courses", href: "/courses" },
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    panel: {
      kind: "cards",
      links: [
        { label: "About techcadd", href: "/about" },
        { label: "Mission and Vision", href: "/about/mission-vision" },
        { label: "Accreditations & Awards", href: "/about/accreditations-awards" },
        { label: "College Partnerships", href: "/college-partnerships" },
        { label: "Founder", href: "/about/founder" },
      ],
      cta: { label: "Talk to a counsellor", href: "/contact#enquire" },
      cards: [
        {
          title: "About techcadd",
          href: "/about",
          badge: "Story",
          meta: `Since ${site.founded}`,
          icon: "users",
        },
        {
          title: "Mission and Vision",
          href: "/about/mission-vision",
          badge: "Purpose",
          meta: "Our direction",
          icon: "target",
        },
        {
          title: "Our Founder",
          href: "/about/founder",
          badge: "Profile",
          meta: site.founder.name,
          icon: "award",
        },
      ],
    },
  },
  { label: "Founder", href: "/about/founder" },
  {
    label: "AI",
    href: "/courses#ai",
    highlight: true,
    panel: {
      kind: "ai",
      heading: "Learn AI Skills.",
      subtitle: "Build projects with machine learning, data science, automation, and generative AI.",
      columns: [
        {
          icon: "sparkles",
          title: "AI Fundamentals",
          links: [
            link("generative-ai"),
            link("artificial-intelligence"),
            link("prompt-engineering"),
            link("chatgpt-ai-tools"),
          ],
        },
        {
          icon: "rocket",
          title: "AI Development",
          links: [
            link("agentic-ai"),
            link("ai-powered-marketing"),
            link("rag-development", "RAG (Retrieval-Augmented Generation)"),
            { label: "AI-Powered Courses", href: "/courses#ai" },
            { label: `All AI Courses in ${site.city}`, href: "/courses#ai" },
          ],
        },
      ],
      featured: {
        title: `Artificial Intelligence Training in ${site.city}`,
        badge: "Featured AI Course",
        href: `/${trainingSlug("artificial-intelligence")}`,
        icon: "sparkles",
      },
      cta: {
        heading: "Start with AI fundamentals, then move into real projects and career-ready tools.",
        buttonLabel: "Explore AI",
        href: "/courses#ai",
      },
    },
  },
  {
    label: "Courses",
    href: "/courses",
    panel: {
      kind: "columns",
      columns: [
        {
          title: "Programming",
          subtitle: "Core languages and full-stack engineering",
          links: [
            link("python", "Python"),
            link("java", "Java"),
            link("c-plus-plus", "C & C++"),
            link("kotlin", "Kotlin"),
            link("flutter-app-development", "Flutter App Development"),
            link("web-designing", "Web Designing"),
            link("web-development", "Web Development"),
            link("full-stack-development", "Full Stack Development"),
            link("mern-stack-development", "MERN Stack"),
            link("mean-stack-development", "MEAN Stack"),
            link("php-full-stack", "PHP Full Stack"),
          ],
        },
        {
          title: "AI & Data",
          subtitle: "Models, analytics and decision intelligence",
          links: [
            link("artificial-intelligence", "Artificial Intelligence"),
            link("machine-learning", "Machine Learning"),
            link("deep-learning", "Deep Learning"),
            link("data-science", "Data Science"),
            link("data-analytics", "Data Analytics"),
            link("power-bi", "Power BI"),
            link("tableau", "Tableau"),
          ],
        },
        {
          title: "Digital Marketing",
          subtitle: "Growth, performance and commerce",
          links: [
            link("digital-marketing"),
            link("social-media-marketing"),
            link("google-ads"),
            link("seo", "SEO"),
            link("wordpress"),
            link("shopify"),
          ],
        },
        {
          title: "Cyber & Cloud",
          subtitle: "Secure, resilient infrastructure",
          links: [
            link("cyber-security", "Cybersecurity"),
            link("ethical-hacking", "Ethical Hacking"),
            link("cloud-computing", "Cloud Computing"),
            link("linux", "Linux"),
          ],
        },
      ],
      footer: programmingQuote,
    },
  },
  {
    label: "Certificate Programs",
    href: "/certificate-programs",
    panel: {
      kind: "tiles",
      tiles: [
        tile("cloud-computing", "cloud", "Cloud Computing"),
        tile("flutter-app-development", "smartphone"),
        tile("mern-stack-development", "code"),
        tile("agentic-ai", "sparkles"),
        tile("digital-marketing", "megaphone"),
        tile("data-analytics", "chart"),
        tile("data-science", "chart"),
        tile("cyber-security", "shield", "Cyber Security"),
        tile("artificial-intelligence", "sparkles", "Artificial Intelligence"),
        tile("full-stack-development", "layers", "Full Stack Development"),
        tile("basic-computer", "monitor", "Basic Skills and Programs"),
        tile("autocad", "box", "Civil / Mechanical"),
      ],
      footer: {
        quote: "Three depths, one syllabus — certificate, advanced certificate or diploma.",
        cta: { label: "See all training formats", href: "/certificate-programs" },
      },
    },
  },
  {
    label: "After 12th",
    href: "/after-12th-courses",
    panel: {
      kind: "columns",
      columns: [
        {
          title: "AI & Data",
          subtitle: "Foundation-first, no background needed",
          links: after12Courses
            .filter((c) =>
              ["generative-ai", "data-science", "data-analytics", "machine-learning"].includes(
                c.courseId,
              ),
            )
            .map((c) => ({ label: c.title.replace(` in ${site.city}`, ""), href: `/${c.slug}` })),
        },
        {
          title: "Development",
          subtitle: "Build and ship from day one",
          links: after12Courses
            .filter((c) =>
              [
                "python",
                "full-stack-development",
                "web-development",
                "flutter-app-development",
              ].includes(c.courseId),
            )
            .map((c) => ({ label: c.title.replace(` in ${site.city}`, ""), href: `/${c.slug}` })),
        },
        {
          title: "Marketing & Security",
          subtitle: "Campaigns, labs and design",
          links: after12Courses
            .filter((c) =>
              ["digital-marketing", "cyber-security", "ethical-hacking", "web-designing"].includes(
                c.courseId,
              ),
            )
            .map((c) => ({ label: c.title.replace(` in ${site.city}`, ""), href: `/${c.slug}` })),
        },
        {
          title: "Longer programs",
          subtitle: "Certificate and diploma routes",
          links: programDurations.map((duration) => ({
            label: `${duration.label} · ${duration.tier}`,
            href: `/after-12th-${duration.slug}-${programTracks[0].id}-program-in-${site.citySlug}`,
          })),
        },
      ],
      footer: {
        quote: "Straight out of school into a technology career, without a degree first.",
        cta: { label: "See all after-12th courses", href: "/after-12th-courses" },
      },
    },
  },
  {
    label: "Resources",
    href: "/blogs",
    panel: {
      kind: "cards",
      links: [
        { label: "Find My Career Track", href: "/tools/career-track-finder", badge: "New" },
        { label: "Training Matcher", href: "/tools/training-matcher", badge: "New" },
        { label: "Salary Estimator", href: "/tools/salary-estimator", badge: "New" },
        { label: "Blogs", href: "/blogs" },
        { label: "Events", href: "/events" },
        { label: "Gallery", href: "/gallery" },
        { label: "FAQ", href: "/faq" },
        { label: "Reviews", href: "/reviews" },
        { label: "College Partnerships", href: "/college-partnerships" },
      ],
      cta: { label: "Ask us a question", href: "/contact#enquire" },
      cards: [
        {
          title: "Find My Career Track",
          href: "/tools/career-track-finder",
          badge: "Free tool",
          meta: "4 questions",
          icon: "target",
        },
        {
          title: "Training Matcher",
          href: "/tools/training-matcher",
          badge: "Free tool",
          meta: "Instant match",
          icon: "refresh",
        },
        {
          title: "Salary Estimator",
          href: "/tools/salary-estimator",
          badge: "Free tool",
          meta: "Tricity market",
          icon: "chart",
        },
      ],
    },
  },
  {
    label: "Branches",
    href: "/branches",
    panel: {
      kind: "tiles",
      tiles: branches.map((branch) => ({
        label: branch.name,
        href: `/branches/${branch.slug}`,
        icon: "map-pin",
      })),
      footer: {
        quote: "Same syllabus, same assessments, same placement process at every centre.",
        cta: { label: "See all centres", href: "/branches" },
      },
    },
  },
  { label: "Contact", href: "/contact" },
];

/* --------------------------------- Footer --------------------------------- */

export const footerColumns: NavColumn[] = [
  {
    title: "Courses",
    links: [
      link("python"),
      link("full-stack-development"),
      link("artificial-intelligence"),
      link("data-analytics"),
      link("digital-marketing"),
      link("cyber-security"),
      link("cloud-computing"),
      { label: "All courses", href: "/courses" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "Internship Program", href: "/internship-training" },
      { label: "After 12th Courses", href: "/after-12th-courses" },
      { label: "Certificate Programs", href: "/certificate-programs" },
      ...trainingFormats.slice(0, 4).map((t) => ({ label: `${t.label} Training`, href: `/${t.slug}` })),
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Founder", href: "/about/founder" },
      { label: "Mission & Vision", href: "/about/mission-vision" },
      { label: "College Partnerships", href: "/college-partnerships" },
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
      { label: "Blogs", href: "/blogs" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQs", href: "/faq" },
      { label: "Placement Support", href: "/placement" },
      { label: "Free Tools", href: "/tools" },
      { label: "Branches", href: "/branches" },
      { label: "Contact", href: "/contact" },
      { label: "Enquire Now", href: "/contact#enquire" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
];

export const categoryNav = courseCategories.map((c) => ({
  label: c.short,
  href: `/courses#${c.id}`,
}));
