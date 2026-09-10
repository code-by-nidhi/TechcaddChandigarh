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
import { getFaqs } from "@/lib/cms";
import { site } from "@/data/site";
import { faqPageSchema } from "@/lib/schema";

export default async function HomePage() {
  // Fetched once and passed to both the section and the schema, so the
  // structured data cannot describe a different set of questions from the one
  // on the page.
  const faqs = await getFaqs({ limit: 6 });
  const faqSchema = faqPageSchema(faqs);

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
      <FaqSection items={faqs} />
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
