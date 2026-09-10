import { Hero } from "@/components/sections/Hero";
import {
  BlogSection,
  CategoriesSection,
  CtaSection,
  FaqSection,
  FeaturedSection,
  ProcessSection,
  TechnologiesSection,
  TestimonialsSection,
} from "@/components/sections/Home";
import { AboutStage } from "@/components/sections/AboutStage";
import { ModulesStack } from "@/components/sections/ModulesStack";
import { WhyZoom } from "@/components/sections/WhyZoom";
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
      <AboutStage />
      <ProcessSection />
      <CategoriesSection />
      <FeaturedSection />
      <WhyZoom />
      <TestimonialsSection />
      <ModulesStack />
      <TechnologiesSection />
      <FaqSection items={faqs} tone="dark" />
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
