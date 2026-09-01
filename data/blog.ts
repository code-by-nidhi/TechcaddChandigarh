import { site } from "./site";

export interface BlogSection {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  sections: BlogSection[];
}

const city = site.city;

export const blogPosts: BlogPost[] = [
  {
    slug: `best-digital-marketing-course-in-${site.citySlug}-2026-2027`,
    title: `Best Digital Marketing Course in ${city} (2026–2027): Curriculum, Fees and Career Guide`,
    excerpt:
      "What a digital marketing course should actually cover in 2026, how to spot a syllabus that has not been updated, and what the roles pay in the tricity.",
    category: "Digital Marketing",
    date: "2026-08-18",
    readTime: "9 min read",
    author: "techcadd Faculty",
    sections: [
      {
        paragraphs: [
          `Most digital marketing syllabuses in ${city} still look like they were written in 2019. They spend three weeks on Facebook page management and a single afternoon on analytics. Meanwhile the roles people are hiring for want someone who can set up conversion tracking, read attribution honestly and use AI tools without producing obvious slop.`,
          "This guide covers what a current syllabus should include, what questions to ask before you pay, and what the tricity market is paying for each role.",
        ],
      },
      {
        heading: "What a 2026 syllabus must include",
        paragraphs: [
          "If any of these are missing, the course is behind the market:",
        ],
        bullets: [
          "GA4 event-based tracking — not Universal Analytics, which has been gone for years",
          "Google Tag Manager, including server-side basics",
          "Performance Max and AI-driven bidding, with an honest treatment of their limitations",
          "AI-assisted creative production with brand guardrails",
          "Attribution beyond last click, and how to explain it to a client",
          "A live campaign with real budget, however small",
        ],
      },
      {
        heading: "The question that separates good courses from bad ones",
        paragraphs: [
          "Ask this: 'On which day do I run my first real campaign with real money?' If the answer is 'in the final project' or worse, 'we use a simulator', keep looking. Campaign management is a skill you build by watching your own budget burn and correcting it, not by watching someone else's screen recording.",
          "The second question: 'Who teaches this, and what did they run last month?' A trainer who is actively managing accounts will answer immediately and specifically.",
        ],
      },
      {
        heading: "Salary expectations in the tricity",
        paragraphs: [
          "Entry-level digital marketing executive roles in Chandigarh and Mohali typically start between ₹18,000 and ₹25,000 a month. With one year of demonstrable campaign results, performance marketer roles move to ₹35,000–₹50,000. SEO specialists with technical skills and PPC leads managing real budgets go higher, and agency-side roles tend to pay less than in-house product companies but teach you faster.",
          "The variable that moves your salary most is not the certificate. It is whether you can show an account you managed, the numbers before you touched it, and the numbers after.",
        ],
      },
      {
        heading: "How to choose",
        paragraphs: [
          "Sit in on a class before you pay. Any institute confident in its teaching will let you. Watch whether students are working or watching, whether the trainer is answering specific questions or reading slides, and whether the lab machines have the actual tools installed.",
          `If you want to see ours, book a free demo at our ${city} centre and sit through a full session before deciding.`,
        ],
      },
    ],
  },
  {
    slug: `how-ai-is-changing-careers-in-${site.citySlug}-2026-27`,
    title: `How AI Is Changing Careers in ${city} (2026–27)`,
    excerpt:
      "Which local roles are being reshaped by AI, which are growing, and what to learn if you are starting now.",
    category: "AI & Careers",
    date: "2026-08-04",
    readTime: "8 min read",
    author: "techcadd Faculty",
    sections: [
      {
        paragraphs: [
          "The honest version of the AI careers story is less dramatic than the headlines and more demanding than the reassurances. Very few roles in the tricity have disappeared. A lot of roles have quietly changed what they expect on day one.",
        ],
      },
      {
        heading: "What actually changed",
        paragraphs: [
          "Content roles moved from producing volume to editing and directing. A content executive is now expected to generate a first draft in minutes and spend their time on judgement — is this accurate, is this on brand, does this argument hold. The people struggling are the ones who were being paid for the typing.",
          "Junior development roles kept their headcount but raised the bar. Teams assume you can use an AI assistant, so the interview now tests whether you can review what it produces. Reading code carefully has become more valuable than writing it quickly.",
          "Support and operations roles absorbed automation. The person who set up the automation kept their job and got a better one.",
        ],
      },
      {
        heading: "Where the new roles are",
        paragraphs: ["Locally, we see consistent hiring for:"],
        bullets: [
          "AI application engineers — people who can wire an LLM into a product with retrieval and evaluation",
          "Data engineers, because every AI project turns out to be a data plumbing project first",
          "Automation specialists in operations-heavy companies",
          "Security analysts, as AI-assisted attacks have raised the baseline",
        ],
      },
      {
        heading: "What to learn first",
        paragraphs: [
          "Python, then data handling, then one applied specialisation. That order matters. People who skip straight to prompt engineering hit a ceiling within a few months because they cannot debug what is happening underneath.",
          "If you are already working in a non-technical role, the highest-leverage first step is learning to automate your own job. It is a real project, you have the domain knowledge, and it is something concrete to discuss in an interview.",
        ],
      },
    ],
  },
  {
    slug: `why-data-analytics-is-in-demand-skill-${site.citySlug}-2026-27`,
    title: `Why Data Analytics Is the Most In-Demand Skill in ${city} Right Now`,
    excerpt:
      "Every company has more data than it can read. That gap is where the hiring is — and the entry barrier is lower than people assume.",
    category: "Data",
    date: "2026-07-22",
    readTime: "7 min read",
    author: "techcadd Faculty",
    sections: [
      {
        paragraphs: [
          "Data analytics keeps topping local hiring lists for an unglamorous reason: every business now collects far more data than anyone in the building can interpret, and most of them do not need a data scientist. They need someone who can write SQL, build a dashboard and explain what changed last month.",
        ],
      },
      {
        heading: "The barrier is lower than you think",
        paragraphs: [
          "Analytics is one of the few technical roles genuinely open to people from commerce, arts and non-engineering backgrounds. The core skills are Excel, SQL and one BI tool. None of them require a maths degree.",
          "What does matter is business sense. The best analysts we place are often the ones who worked in sales or operations first, because they already know which questions are worth asking.",
        ],
      },
      {
        heading: "A realistic skill sequence",
        paragraphs: ["Learn in this order and you will be employable at each step:"],
        bullets: [
          "Excel to a genuine level — pivot tables, Power Query, lookups",
          "SQL, including joins and window functions",
          "Power BI or Tableau, with proper data modelling rather than drag-and-drop",
          "Python with Pandas, for anything the BI tool cannot do",
          "Statistics for A/B testing and forecasting",
        ],
      },
      {
        heading: "Build a portfolio, not a certificate collection",
        paragraphs: [
          "Four case studies beat four certificates every time. Take a public dataset, ask a real business question, build the dashboard and write a paragraph on what you would do about it. That last paragraph is what interviewers actually read.",
        ],
      },
    ],
  },
  {
    slug: `search-engine-optimization-seo-in-${site.citySlug}-2026-2027`,
    title: `SEO in ${city} (2026–2027): What Still Works After AI Search`,
    excerpt:
      "AI overviews changed the click-through economics of search. Here is what still drives traffic and revenue.",
    category: "SEO",
    date: "2026-07-09",
    readTime: "8 min read",
    author: "techcadd Faculty",
    sections: [
      {
        paragraphs: [
          "AI-generated answers at the top of search results took a meaningful bite out of informational traffic. Anyone telling you nothing has changed is not looking at their own analytics. But the conclusion that SEO is finished is equally wrong — commercial and local intent queries still convert, and they still go to websites.",
        ],
      },
      {
        heading: "What lost traffic",
        paragraphs: [
          "Thin definitional content — 'what is X' pages — largely stopped earning clicks, because the answer now sits above the results. If your content strategy was built on that, it needs rebuilding.",
        ],
      },
      {
        heading: "What still works",
        paragraphs: ["Three categories held up or grew:"],
        bullets: [
          "Local intent — 'near me', service-plus-city queries, and Google Business Profile results",
          "Commercial comparison — pricing, alternatives, reviews, where people want to verify before spending",
          "Genuine expertise and original data that an AI summary cannot fabricate",
        ],
      },
      {
        heading: "The technical side got more important, not less",
        paragraphs: [
          "Structured data, clean crawlability and Core Web Vitals now influence whether you are cited in AI answers at all. Being the source an AI summary quotes is the new version of ranking first — and it is earned with the same technical hygiene plus something original to say.",
          `For local businesses in ${city}, the highest-return work is still the least glamorous: a complete Google Business Profile, real reviews, consistent citations and a fast site.`,
        ],
      },
    ],
  },
  {
    slug: `best-python-course-in-${site.citySlug}-2026-curriculum-duration-fees`,
    title: `Best Python Course in ${city} (2026): Curriculum, Duration and Fees`,
    excerpt:
      "How long Python actually takes to learn properly, what a good syllabus covers, and where students usually stall.",
    category: "Programming",
    date: "2026-06-27",
    readTime: "7 min read",
    author: "techcadd Faculty",
    sections: [
      {
        paragraphs: [
          "Python is the default first language for a good reason — it stays out of your way while you learn to think. But 'learn Python in 30 days' courses produce people who can follow a tutorial and freeze at an empty file.",
        ],
      },
      {
        heading: "How long it really takes",
        paragraphs: [
          "Two to three months of consistent daily practice gets most people to genuine working competence: comfortable with data structures, able to read documentation, able to build something small without a tutorial open. Faster than that is possible only if you already program in another language.",
        ],
      },
      {
        heading: "What the syllabus should cover",
        paragraphs: [],
        bullets: [
          "Core syntax, control flow and functions",
          "Data structures and comprehensions, with attention to complexity",
          "Object-oriented programming and module organisation",
          "Virtual environments and dependency management — skipped far too often",
          "Files, JSON and consuming REST APIs",
          "Testing with Pytest, and using a debugger instead of print statements",
        ],
      },
      {
        heading: "Where students stall",
        paragraphs: [
          "Almost always at the transition from exercises to projects. Solving a problem someone else defined is a different skill from deciding what to build and structuring it yourself. The fix is starting projects earlier than feels comfortable — week three, not week ten.",
          "The second common stall is environments. A student who cannot explain what a virtual environment does will eventually break their setup and lose a weekend. Spending an hour on it early saves that.",
        ],
      },
    ],
  },
  {
    slug: `ai-and-data-analytics-jobs-career-scope-in-${site.citySlug}-2026-2027`,
    title: `AI and Data Jobs in ${city}: Career Scope for 2026–2027`,
    excerpt: "Who is hiring locally, what they test in interviews, and realistic salary bands by experience.",
    category: "Careers",
    date: "2026-06-12",
    readTime: "6 min read",
    author: "techcadd Faculty",
    sections: [
      {
        paragraphs: [
          "The tricity has a genuine AI and data job market now — product companies in Mohali, services firms across Chandigarh, and a growing set of startups in the IT park. It is smaller than Bangalore or Gurgaon, but it is real, and the competition per role is lower.",
        ],
      },
      {
        heading: "What interviews actually test",
        paragraphs: [
          "Consistently, three things: can you write SQL without an autocomplete crutch, can you explain a model or a pipeline you built, and can you say what you would do differently. The third question sinks more candidates than the first two, because it exposes whether the project was yours or a tutorial's.",
        ],
      },
      {
        heading: "Salary bands",
        paragraphs: [
          "Approximate monthly figures for the local market: data analyst freshers ₹20,000–₹30,000; two to three years ₹45,000–₹70,000. AI and ML engineer freshers with a strong project portfolio ₹30,000–₹45,000, rising quickly with demonstrable production experience. Remote roles for national companies pay above these bands and are increasingly open to tricity candidates.",
        ],
      },
    ],
  },
  {
    slug: `social-media-marketing-in-${site.citySlug}-2026-2027`,
    title: `Social Media Marketing in ${city} (2026–2027)`,
    excerpt: "Platform-by-platform reality check, what content formats are working, and how to measure without fooling yourself.",
    category: "Digital Marketing",
    date: "2026-05-30",
    readTime: "6 min read",
    author: "techcadd Faculty",
    sections: [
      {
        paragraphs: [
          "Social media marketing has settled into something more measurable than it was five years ago, which is good news for anyone who wants to treat it as a career rather than a hobby.",
        ],
      },
      {
        heading: "Where attention actually is",
        paragraphs: [
          "Short vertical video still dominates reach on Instagram and YouTube. LinkedIn has become genuinely valuable for B2B and recruitment in the tricity — local companies get more qualified inbound from LinkedIn than from anywhere else. Facebook remains the most effective paid channel for local service businesses despite its reputation among younger marketers.",
        ],
      },
      {
        heading: "Measuring honestly",
        paragraphs: [
          "Follower count is the vanity metric everyone knows to distrust, and yet it still appears at the top of most client reports. Replace it with saves and shares for reach, click-through for intent, and tracked conversions for outcome. If you cannot connect a campaign to a business result, you will struggle to justify a budget increase.",
        ],
      },
    ],
  },
  {
    slug: `ai-in-graphic-design-and-creative-careers-in-${site.citySlug}`,
    title: `AI in Graphic Design and Creative Careers in ${city}`,
    excerpt: "What AI image tools changed for working designers, and what clients still pay a human for.",
    category: "Design",
    date: "2026-05-14",
    readTime: "6 min read",
    author: "techcadd Faculty",
    sections: [
      {
        paragraphs: [
          "Generative image tools removed the floor from a certain kind of design work — the quick social post, the stock-photo composite, the placeholder mockup. Designers who were selling only that felt it immediately.",
        ],
      },
      {
        heading: "What clients still pay for",
        paragraphs: [
          "Judgement, consistency and accountability. A brand system that holds together across fifty touchpoints is not a prompt. Print production with correct colour profiles and bleed is not a prompt. And when something goes wrong at the printer, a client wants a person who will fix it.",
          "The designers doing well locally added AI to their workflow for ideation and iteration, then kept their own hands on the final craft. Their output went up and their rates held.",
        ],
      },
      {
        heading: "What to learn now",
        paragraphs: [
          "Fundamentals first — typography, colour, layout, hierarchy — because they are what let you tell a good AI output from a bad one. Then production skills for print and web. Then the AI tools, as an accelerator rather than a replacement for taste.",
        ],
      },
    ],
  },
];

export const blogBySlug = new Map(blogPosts.map((p) => [p.slug, p]));

export const recentPosts = [...blogPosts]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 3);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
