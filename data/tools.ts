export interface FreeTool {
  slug: string;
  icon: string;
  title: string;
  blurb: string;
  time: string;
}

export const freeTools: FreeTool[] = [
  {
    slug: "career-track-finder",
    icon: "compass",
    title: "Career Track Finder",
    blurb:
      "Four questions about your background, interests, time and goals — and a recommended track with a first project to build.",
    time: "2 minutes",
  },
  {
    slug: "salary-estimator",
    icon: "target",
    title: "Salary Estimator",
    blurb:
      "Indicative monthly and annual salary bands for technology roles in the tricity, adjusted for experience, employer type and portfolio strength.",
    time: "1 minute",
  },
  {
    slug: "training-matcher",
    icon: "calendar",
    title: "Training Matcher",
    blurb:
      "Tell us your available window, technology and goal, and we will match the training format and certificate program that fit.",
    time: "1 minute",
  },
];

export const toolsBySlug = new Map(freeTools.map((t) => [t.slug, t]));
