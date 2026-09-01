import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { CareerTrackFinder } from "@/components/tools/CareerTrackFinder";
import { Rail } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Career Track Finder — Which Course Fits You?",
  description:
    "Answer four questions about your background, interests, available time and goals. Get a recommended technology track, a duration and a first project to build.",
  alternates: { canonical: `${site.url}/tools/career-track-finder` },
};

export default function CareerTrackFinderPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Free Tools", href: "/tools" },
          { label: "Career Track Finder" },
        ]}
        eyebrow="Free tool"
        title="Which track actually fits you?"
        body="Four questions, no sign-up, and a straight answer at the end — including the two runners-up, so you can see what the trade-off was."
      />

      <section className="py-16 lg:py-20">
        <Rail>
          <div className="mx-auto max-w-3xl">
            <CareerTrackFinder />
            <p className="mt-6 text-center text-sm text-muted">
              This runs entirely in your browser. Nothing you select is sent anywhere.
            </p>
          </div>
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
