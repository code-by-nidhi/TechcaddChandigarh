import type { Metadata } from "next";
import { AiHubTemplate } from "@/components/AiHubTemplate";
import { site } from "@/data/site";

const COURSE_IDS = [
  "ai-powered-marketing",
  "prompt-engineering",
  "generative-ai",
  "chatgpt-ai-tools",
  "agentic-ai",
  "rag",
];

const TITLE = "AI-Powered Courses in Chandigarh";
const DESCRIPTION =
  "Learn AI-Powered Marketing, Prompt Engineering, ChatGPT, Agentic AI, RAG and Generative AI at TechCadd Chandigarh.";

export const metadata: Metadata = {
  title: `${TITLE} | TechCadd`,
  description: DESCRIPTION,
  alternates: { canonical: `${site.url}/ai-powered-courses-in-chandigarh` },
  openGraph: { title: `${TITLE} | TechCadd`, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: `${TITLE} | TechCadd`, description: DESCRIPTION },
};

export default function AiPoweredCoursesPage() {
  return (
    <AiHubTemplate
      slug="ai-powered-courses-in-chandigarh"
      eyebrow="AI-Powered Learning"
      title={TITLE}
      summary={`Six hands-on programmes built around using AI as a working tool — for marketing, writing, automation and building on top of language models — rather than the research theory behind it. ${DESCRIPTION}`}
      breadcrumbLabel="AI-Powered Courses"
      courseIds={COURSE_IDS}
    />
  );
}
