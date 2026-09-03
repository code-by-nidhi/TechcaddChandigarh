import { Hero, OrbitStrip } from "@/components/sections/Hero";
import { NeuralCourseNetwork } from "@/components/sections/NeuralCourseNetwork";
import {
  AboutSection,
  BlogSection,
  CtaSection,
  DifferenceSection,
  FaqSection,
  FeaturedSection,
  IncludedSection,
  ProcessSection,
  TechnologiesSection,
  TestimonialsSection,
} from "@/components/sections/Home";
import { faqs } from "@/data/content";
import { site } from "@/data/site";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <OrbitStrip />
      <AboutSection />
      <ProcessSection />
      <NeuralCourseNetwork />
      <FeaturedSection />
      <DifferenceSection />
      <TestimonialsSection />
      <IncludedSection />
      <TechnologiesSection />
      <FaqSection items={faqs.slice(0, 6)} />
      <BlogSection />
      <CtaSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

export const metadata = {
  alternates: { canonical: site.url },
};
