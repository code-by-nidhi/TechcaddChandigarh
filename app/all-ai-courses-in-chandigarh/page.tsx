import type { Metadata } from "next";
import { AiHubTemplate } from "@/components/AiHubTemplate";
import { site } from "@/data/site";

const COURSE_IDS = [
  "artificial-intelligence",
  "machine-learning",
  "deep-learning",
  "data-science",
  "data-analytics",
  "power-bi",
  "tableau",
  "generative-ai",
  "prompt-engineering",
  "agentic-ai",
  "ai-powered-marketing",
  "chatgpt-ai-tools",
  "rag",
];

const TITLE = "All AI Courses in Chandigarh";
const DESCRIPTION =
  "Explore Artificial Intelligence, Machine Learning, Data Science, Deep Learning, Generative AI, Prompt Engineering and more AI courses in Chandigarh.";

export const metadata: Metadata = {
  title: `${TITLE} | TechCadd`,
  description: DESCRIPTION,
  alternates: { canonical: `${site.url}/all-ai-courses-in-chandigarh` },
  openGraph: { title: `${TITLE} | TechCadd`, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: `${TITLE} | TechCadd`, description: DESCRIPTION },
};

export default function AllAiCoursesPage() {
  return (
    <AiHubTemplate
      slug="all-ai-courses-in-chandigarh"
      eyebrow="Every AI & Data Track"
      title={TITLE}
      summary={`Every AI and data programme we run in one place — foundational AI, machine learning and deep learning, the data and BI tools, and the newer generative-AI and agent-building tracks. ${DESCRIPTION}`}
      breadcrumbLabel="All AI Courses"
      courseIds={COURSE_IDS}
      heroImage="/images/courses/all-ai-courses.webp"
    />
  );
}
