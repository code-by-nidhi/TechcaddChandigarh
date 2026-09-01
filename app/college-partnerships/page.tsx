import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Icon, Rail, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import { trainingFormats } from "@/data/programs";

export const metadata: Metadata = {
  title: `College Partnerships — Campus Training & MOUs`,
  description: `Industrial training, campus workshops, faculty development and placement drives for colleges across the tricity. Partner with techcadd ${site.city}.`,
  alternates: { canonical: `${site.url}/college-partnerships` },
};

const offerings = [
  {
    icon: "briefcase",
    title: "Industrial training batches",
    body: "45-day, six-week, four-month and six-month formats run against your university's requirements, with attendance records, project files and certificates in the format your department expects.",
  },
  {
    icon: "users",
    title: "On-campus workshops",
    body: "One to four day hands-on workshops delivered in your labs — AI tooling, Git and deployment, resume and interview preparation. We bring the curriculum and the trainers.",
  },
  {
    icon: "award",
    title: "Faculty development programs",
    body: "Short intensives for teaching staff on the tools that have entered industry recently, so departmental syllabi can be updated with first-hand knowledge rather than second-hand summaries.",
  },
  {
    icon: "target",
    title: "Joint placement drives",
    body: "We open our hiring partner drives to partner colleges, and run pre-placement training — aptitude, mock interviews, portfolio reviews — in the weeks before.",
  },
];

const process = [
  { step: "01", title: "Initial conversation", body: "We meet your placement or department head to understand the requirement, the cohort size and the academic calendar." },
  { step: "02", title: "Proposal & MOU", body: "A written proposal covering scope, duration, delivery mode, cost and outcomes. Nothing starts before both sides have signed." },
  { step: "03", title: "Delivery", body: "Training runs on campus, at our centre, or split between the two. A named coordinator is accountable throughout." },
  { step: "04", title: "Reporting", body: "Attendance, assessment results and a completion report for your records, plus certificates for every student who qualifies." },
];

export default function CollegePartnershipsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "College Partnerships" },
        ]}
        eyebrow="For institutions"
        title="Partner with us for training your students actually use"
        body="We work with colleges across the tricity on industrial training, campus workshops, faculty development and joint placement drives — structured against your academic calendar, not ours."
        meta={[
          { label: "Formats", value: `${trainingFormats.length} training durations` },
          { label: "Delivery", value: "On campus or at our centre" },
          { label: "Contact", value: site.contact.phone },
        ]}
      />

      <section className="py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="What we offer"
            title="Four ways colleges work with us"
            body="Most partnerships start with one of these and expand once a first cohort has been through."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {offerings.map((offering) => (
              <div key={offering.title} className="rounded-2xl border border-line bg-white p-7">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={offering.icon} className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">
                  {offering.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{offering.body}</p>
              </div>
            ))}
          </div>
        </Rail>
      </section>

      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <SectionHeading
            eyebrow="How it works"
            title="From first call to completion report"
          />
          <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <li key={item.step}>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-hero-950 font-display text-sm font-bold text-white">
                  {item.step}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </Rail>
      </section>

      <section className="py-16 lg:py-24">
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <SectionHeading
              eyebrow="Get in touch"
              title="Start a conversation"
              body="Tell us your cohort size, the semester window and what your department needs. We will come back with a written proposal rather than a brochure."
            />
            <div className="rounded-2xl border border-line bg-white p-7 lg:p-9">
              <EnquiryForm />
            </div>
          </div>
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
