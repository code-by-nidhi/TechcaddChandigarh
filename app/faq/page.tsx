import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Accordion } from "@/components/Accordion";
import { Rail, SectionHeading } from "@/components/ui";
import { faqs } from "@/data/content";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `FAQs — Fees, Batches, Certificates & Placement`,
  description: `Answers to the questions we get every week about course duration, fees, EMI, batch timings, certificates, internships and placement support at techcadd ${site.city}.`,
  alternates: { canonical: `${site.url}/faq` },
};

const extraFaqs = [
  {
    question: "Do you offer online classes?",
    answer:
      "Yes, and you can switch between campus and online mid-course without paying again. Online students get the same recordings, doubt sessions and project supervision. Lab-heavy tracks like cyber security and CAD genuinely work better on campus, and we will tell you that during counselling rather than after you enrol.",
  },
  {
    question: "What is the batch size?",
    answer:
      "Most batches run between 12 and 20 students. That is the range where a trainer can still get to everyone during lab hours. We do not run 60-seat lecture batches for technical courses.",
  },
  {
    question: "Can I pay in instalments?",
    answer:
      "Yes. EMI options are available on programs of six months and longer, and we can split fees across the duration of shorter courses. There is no registration fee, so nothing is payable before you have sat through a demo class.",
  },
  {
    question: "What if I miss classes?",
    answer:
      "Session recordings are available for every batch, and you can attend the same module with another batch to catch up. If you need to pause entirely — exams, a family situation — we hold your seat and you rejoin a later batch at no extra cost.",
  },
  {
    question: "Do you provide a laptop or do I need my own?",
    answer:
      "Lab machines are provided and are what most students use. You are welcome to bring your own laptop, and for the cloud and AI tracks we recommend it, so your environment stays set up between sessions.",
  },
  {
    question: "Is the certificate recognised?",
    answer:
      "Our industry certificate is issued by techcadd and is verifiable online. For university training requirements, we provide the format your college asks for, including attendance records and the project file. We also prepare students for external certifications such as AWS, Azure and CEH, which are issued by those vendors directly.",
  },
  {
    question: "How soon can I start?",
    answer:
      "New batches start every two to three weeks across the main tracks, and more frequently before semester breaks. Call us and we will tell you the next start date for the course you are considering.",
  },
  {
    question: "Do you help with resume and interview preparation?",
    answer:
      "Yes, it is part of every program rather than an add-on. That includes CV review, portfolio polish, mock technical and HR interviews, and aptitude practice. Support continues after your course finishes until you are placed.",
  },
];

const allFaqs = [...faqs, ...extraFaqs];

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
        eyebrow="FAQs"
        title="Questions we get every week"
        body="Fees, batch timings, certificates, internships and placement — answered plainly. If yours is not here, call us; counselling is free and there is no obligation to enrol."
        meta={[
          { label: "Questions", value: String(allFaqs.length) },
          { label: "Phone", value: site.contact.phone },
        ]}
      />

      <section className="py-16 lg:py-24">
        <Rail>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <SectionHeading
                title="Still unsure?"
                body="The fastest way to get a straight answer is a phone call. Most enquiries are resolved in five minutes."
              />
              <div className="mt-8 space-y-3">
                <a
                  href={site.contact.phoneHref}
                  className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-5 py-4 text-sm font-medium transition-colors hover:border-brand-600/30"
                >
                  {site.contact.phone}
                  <span className="text-xs text-muted">{site.contact.hours}</span>
                </a>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-5 py-4 text-sm font-medium transition-colors hover:border-brand-600/30"
                >
                  {site.contact.email}
                  <span className="text-xs text-muted">1 working day</span>
                </a>
              </div>
            </div>

            <Accordion items={allFaqs} />
          </div>
        </Rail>
      </section>

      <CtaSection />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
