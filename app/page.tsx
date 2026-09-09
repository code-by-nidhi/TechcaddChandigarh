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
import { faqs } from "@/data/content";
import { site } from "@/data/site";
import { faqPageSchema } from "@/lib/schema";

const faqSchema = faqPageSchema(faqs.slice(0, 6));

export default function HomePage() {
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
      <FaqSection items={faqs.slice(0, 6)} tone="dark" />
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
