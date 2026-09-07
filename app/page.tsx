import { Hero, OrbitStrip } from "@/components/sections/Hero";
import {
  AboutSection,
  BlogSection,
  CategoriesSection,
  CtaSection,
  DifferenceSection,
  FaqSection,
  IncludedSection,
  ProcessSection,
  TechnologiesSection,
  TestimonialsSection,
} from "@/components/sections/Home";
import { faqs } from "@/data/content";
import { site } from "@/data/site";
import { faqPageSchema } from "@/lib/schema";

const faqSchema = faqPageSchema(faqs.slice(0, 6));

export default function HomePage() {
  return (
    <>
      <Hero />
      <OrbitStrip />
      <AboutSection />
      <ProcessSection />
      <CategoriesSection />
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
