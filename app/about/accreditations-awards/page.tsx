import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { QuickDemoFormLight } from "@/components/EnquiryForm";
import { Badge, ButtonLink, Eyebrow, Icon, Rail, SectionHeading } from "@/components/ui";
import {
  accreditationBenefits,
  careerCtaBenefits,
  credentials,
  reviewTrustIndicators,
} from "@/data/about";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Accreditations & Awards — ${site.name}`,
  description: `${site.name}'s ISO 9001:2015 certification, MSME registration and Startup India recognition — verifiable credentials behind the certificate.`,
  alternates: { canonical: `${site.url}/about/accreditations-awards` },
};

/** Google's four-colour "G" mark — used once here to badge the rating card. */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default function AccreditationsAwardsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Accreditations & Awards" },
        ]}
        eyebrow="Accreditations & Awards"
        title="Recognised for the training, not just for saying so."
        body={`${site.shortName}'s ISO certification, its MSME registration and its Startup India recognition — the record behind the certificate.`}
      />

      <section className="py-16 lg:py-24">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Why it matters"
            title="Why accreditation matters for your career"
            body="Not all certificates are equal. Here's why techcadd's accreditation gives your certificate real weight."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {accreditationBenefits.map((item) => (
              <div key={item.title} className="rounded-2xl border border-line bg-subtle p-7">
                <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Rail>
      </section>

      <section className="bg-subtle py-16 lg:py-24">
        <Rail>
          <SectionHeading
            align="center"
            eyebrow="Our Certifications"
            title="Three credentials, verifiable against their issuers"
            body="All accreditations below are current and can be independently verified through their respective authorities."
          />

          <ul className="mt-14 grid gap-6 lg:grid-cols-3">
            {credentials.map((item) => (
              <li
                key={item.title}
                className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 lg:p-8"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                  <Icon name={item.icon} className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-ink">
                  {item.title}
                </h3>
                <Badge className="mt-2 self-start">{item.since}</Badge>
                <p className="mt-4 text-sm leading-relaxed text-muted">{item.body}</p>
                <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand-600"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-muted">
            These recognitions reflect our commitment to quality education, industry relevance, and
            learner success.
          </p>
        </Rail>
      </section>

      {/* ------------------------------ Google reviews & trust ------------------------------ */}
      <section className="py-16 lg:py-24">
        <Rail>
          <div className="mx-auto max-w-[800px] overflow-hidden rounded-3xl border border-line bg-white text-center shadow-[0_30px_70px_-40px_rgba(15,23,42,0.4)]">
            <span
              aria-hidden="true"
              className="block h-1 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-400"
            />
            <div className="px-7 py-12 sm:px-12 lg:py-14">
              <GoogleMark className="mx-auto h-9 w-9" />
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="font-display text-4xl font-extrabold tracking-tight text-ink">
                  {site.stats.rating}
                </span>
                <div className="flex gap-1 text-accent-yellow">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" className="size-5" />
                  ))}
                </div>
              </div>
              <p className="mx-auto mt-5 max-w-lg leading-relaxed text-muted">
                Based on hundreds of verified student reviews across Google. Read authentic
                feedback from learners who have completed training programs and built successful
                careers.
              </p>
              <div className="mt-8">
                <ButtonLink href="/reviews" variant="primary">
                  Read Reviews
                  <Icon name="arrow-right" className="size-4" />
                </ButtonLink>
              </div>

              <ul className="mt-10 grid gap-3 border-t border-line pt-8 text-left sm:grid-cols-2">
                {reviewTrustIndicators.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm font-medium text-foreground"
                  >
                    <Icon name="check" className="size-4 shrink-0 text-brand-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Rail>
      </section>

      {/* --------------------------- Career counselling CTA --------------------------- */}
      <section className="bg-subtle py-20 lg:py-28">
        <Rail>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>Ready to get started?</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem]">
              Start building your career today.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted lg:text-lg">
              Talk to a career counsellor today. One conversation is often enough to identify the
              right learning path, understand career opportunities, and plan your next step with
              confidence.
            </p>
          </div>

          <div className="mx-auto mt-9 max-w-md">
            <QuickDemoFormLight />
          </div>

          <div className="mt-7 flex justify-center">
            <a
              href={site.contact.phoneHref}
              className="inline-flex items-center gap-3 rounded-full bg-brand-600 px-6 py-3 text-white shadow-lg shadow-brand-600/25 transition-colors duration-300 hover:bg-brand-700"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15">
                <Icon name="phone" className="size-4" />
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-100">
                  Call Now
                </span>
                <span className="block font-display text-sm font-bold">
                  {site.contact.phone}
                </span>
              </span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {careerCtaBenefits.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <Icon name="check" className="size-4 text-brand-600" />
                {item}
              </span>
            ))}
          </div>
        </Rail>
      </section>
    </>
  );
}
