import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { TrainingMatcher } from "@/components/tools/TrainingMatcher";
import { Rail } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Training Matcher — Find Your Industrial Training Format",
  description:
    "Match your available semester window, chosen technology and goal to the right industrial training format and certificate program.",
  alternates: { canonical: `${site.url}/tools/training-matcher` },
};

export default function TrainingMatcherPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Free Tools", href: "/tools" },
          { label: "Training Matcher" },
        ]}
        eyebrow="Free tool"
        title="Which training format fits your semester?"
        body="Three questions — your available window, the technology you want, and what you need out of it. We will tell you which format matches, and where the trade-offs are."
      />

      <section className="py-16 lg:py-20">
        <Rail>
          <TrainingMatcher />
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
