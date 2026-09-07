import { site } from "./site";

/**
 * Shared content for the About section of the site. The main `/about` page
 * writes its own copy directly; what's left here is what `/about/
 * accreditations-awards` still depends on.
 */

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
