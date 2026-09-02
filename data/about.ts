import { site } from "./site";

/**
 * Content for the About page. Section order and copy mirror the techcadd group
 * about page; every number and locality reference is pulled from `site` so the
 * Chandigarh centre stays the single source of truth.
 */

/* --------------------------------- Hero stats --------------------------------- */

export const aboutStats = [
  { label: "Years of Excellence", value: `${new Date().getFullYear() - site.founded}+` },
  { label: "Students Trained", value: site.stats.alumni },
  { label: "Certified Courses", value: "50+" },
  { label: "Placement Success", value: site.stats.placement },
];

/* -------------------------------- What we teach -------------------------------- */

export const teachChips = [
  "Artificial Intelligence",
  "Data Science",
  "Machine Learning",
  "Cyber Security",
  "Cloud Computing",
  "Full Stack Development",
  "MERN Stack",
  "Python",
  "Web Development",
  "Mobile App Development",
  "Digital Marketing",
  "Graphic Designing",
  "UI/UX",
  "Animation",
  "Video Editing",
  "CAD/CAM",
];

/* --------------------------------- Numbered lists --------------------------------- */

export interface NumberedItem {
  step: string;
  title: string;
  body: string;
}

export const learnerSegments: NumberedItem[] = [
  {
    step: "01",
    title: "School & College Students",
    body: "Looking to develop technology skills early.",
  },
  {
    step: "02",
    title: "Graduates & Job Seekers",
    body: "Preparing for technology careers.",
  },
  {
    step: "03",
    title: "Engineering & IT Students",
    body: "Seeking practical exposure and industrial training.",
  },
  {
    step: "04",
    title: "Working Professionals",
    body: "Looking to upgrade or diversify their skills.",
  },
  {
    step: "05",
    title: "Career Switchers",
    body: "Exploring opportunities in the technology sector.",
  },
  {
    step: "06",
    title: "Entrepreneurs & Freelancers",
    body: "Seeking digital and technology capabilities.",
  },
];

export const learnSteps: NumberedItem[] = [
  { step: "01", title: "Learn", body: "Understand the concepts and fundamentals." },
  {
    step: "02",
    title: "Practice",
    body: "Apply knowledge through hands-on exercises and guided learning.",
  },
  { step: "03", title: "Build", body: "Work on projects and practical applications." },
  {
    step: "04",
    title: "Grow",
    body: "Develop professional confidence and career-oriented skills.",
  },
];

export const approachPrinciples: NumberedItem[] = [
  {
    step: "01",
    title: "Relevance",
    body: "Learn technologies and skills that connect with evolving industry requirements.",
  },
  {
    step: "02",
    title: "Application",
    body: "Turn concepts into practical skills through projects, exercises and hands-on learning.",
  },
  {
    step: "03",
    title: "Growth",
    body: "Develop the mindset and adaptability required to keep learning in a rapidly changing technology landscape.",
  },
];

/* --------------------------------- The difference --------------------------------- */

export const differencePoints = [
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

/* ------------------------------- What you can learn ------------------------------- */

export interface LearnDomain {
  name: string;
  items: string[];
}

export const learnDomains: LearnDomain[] = [
  {
    name: "Technology",
    items: [
      "AI",
      "Machine Learning",
      "Data Science",
      "Cyber Security",
      "Cloud Computing",
      "DevOps",
    ],
  },
  {
    name: "Development",
    items: ["Python", "Full Stack", "MERN", "Web Development", "Mobile App Development"],
  },
  {
    name: "Digital & Creative",
    items: ["Digital Marketing", "UI/UX", "Graphic Designing", "Video Editing", "Animation"],
  },
  {
    name: "Professional & Technical Skills",
    items: ["Advanced Excel", "CAD/CAM", "Accounting", "Other career-focused programs"],
  },
];

/* ------------------------------ Awards & recognition ------------------------------ */

export interface Credential {
  icon: string;
  title: string;
  since: string;
  body: string;
  points: string[];
}

export const credentials: Credential[] = [
  {
    icon: "shield",
    title: "ISO 9001:2015 Certified",
    since: "Since 2022",
    body: `${site.shortName} is ISO 9001:2015 certified, demonstrating commitment to quality management systems, structured training processes, and continuous improvement.`,
    points: [
      "Annual quality audits",
      "Documented training processes",
      "Regular curriculum reviews",
      "Continuous quality improvement",
    ],
  },
  {
    icon: "briefcase",
    title: "MSME Registered",
    since: "Since 2019",
    body: "Techcadd is registered under the Ministry of Micro, Small & Medium Enterprises, recognizing it as a legitimate and professionally managed training organization.",
    points: [
      "Government-recognized institution",
      "Industry-focused skill development",
      "Supports employability initiatives",
      "Verified business registration",
    ],
  },
  {
    icon: "rocket",
    title: "Startup India Recognised",
    since: "Since 2020",
    body: "Recognised under the Startup India initiative, acknowledging contributions toward innovation, technology education, and skill development.",
    points: [
      "DPIIT-recognised startup",
      "Focus on innovation and education",
      "Supports entrepreneurship ecosystem",
      "Industry and technology driven",
    ],
  },
];

export interface AccreditationBenefit {
  title: string;
  body: string;
}

export const accreditationBenefits: AccreditationBenefit[] = [
  {
    title: "Employer Trust",
    body: "Recruiters value certifications issued by institutions with verified registrations and quality standards.",
  },
  {
    title: "Education & Finance Support",
    body: "Recognized institutions often provide greater credibility for educational and financing opportunities.",
  },
  {
    title: "Quality Assurance",
    body: "Structured quality management ensures updated curriculum and better learning outcomes.",
  },
  {
    title: "Government Eligibility",
    body: "Certain government schemes and programs prefer certifications from registered institutions.",
  },
];

export const reviewTrustIndicators = [
  "Verified Student Reviews",
  "Career-Focused Training",
  "Industry-Relevant Learning",
  "Trusted by Thousands of Learners",
];

export const careerCtaBenefits = [
  "Free Career Counselling",
  "No Registration Fee",
  "Placement Support Included",
];

/* ---------------------------------- Our journey ---------------------------------- */

export interface Milestone {
  year: number;
  title: string;
  body: string;
}

export const journey: Milestone[] = [
  {
    year: 2007,
    title: `${site.shortName} is founded`,
    body: `${site.founder.name} starts ${site.shortName} to close the gap between academic learning and industry needs.`,
  },
  {
    year: 2010,
    title: "Industrial training at scale",
    body: "Six-week, 45-day and six-month tracks become full programmes.",
  },
  {
    year: 2013,
    title: "A placement cell",
    body: "Hiring support becomes its own team rather than a trainer's side task.",
  },
  {
    year: 2016,
    title: "Colleges come on board",
    body: "Formal training partnerships begin with universities across the region.",
  },
  {
    year: 2018,
    title: `Labs across ${site.city}`,
    body: "The centre network expands across the tricity, each campus with its own specialisation.",
  },
  {
    year: 2020,
    title: "Teaching through lockdown",
    body: "Live online batches launch in weeks, and no cohort loses a term.",
  },
  {
    year: 2021,
    title: "Data on the syllabus",
    body: "Analytics and data science join the catalogue as full tracks.",
  },
  {
    year: 2022,
    title: "Cloud and DevOps",
    body: "AWS, Docker and CI pipelines are added to the developer paths.",
  },
  {
    year: 2023,
    title: "After-12th pathways",
    body: "Career tracks built for school leavers, not just graduates.",
  },
  {
    year: 2024,
    title: "AI on the syllabus",
    body: "Generative and agentic AI arrive, taught on real projects.",
  },
  {
    year: 2025,
    title: "Fifteen thousand alumni",
    body: "The trained-student count passes five figures across all tracks.",
  },
  {
    year: 2026,
    title: "Today and beyond",
    body: "New labs, new tracks, and the same rule: you learn it by building it.",
  },
];
