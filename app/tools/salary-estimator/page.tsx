import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { SalaryEstimator } from "@/components/tools/SalaryEstimator";
import { Rail } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Salary Estimator — Tech Salary Bands in the Tricity",
  description:
    "Indicative monthly and annual salary ranges for technology roles across Chandigarh, Mohali and Panchkula — adjusted for experience, employer type and portfolio strength.",
  alternates: { canonical: `${site.url}/tools/salary-estimator` },
};

export default function SalaryEstimatorPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Free Tools", href: "/tools" },
          { label: "Salary Estimator" },
        ]}
        eyebrow="Free tool"
        title="What does this role pay in the tricity?"
        body="Indicative bands built from local hiring conversations. Adjust for experience, employer type and what you can actually show — the last one moves the number more than people expect."
      />

      <section className="py-16 lg:py-20">
        <Rail>
          <SalaryEstimator />
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
