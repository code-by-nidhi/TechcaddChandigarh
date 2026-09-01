import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaSection } from "@/components/sections/Home";
import { Icon, Rail } from "@/components/ui";
import { site } from "@/data/site";
import { freeTools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Free Tools — Track Finder, Salary Estimator & Training Matcher",
  description: `Three free tools to help you decide: find the right course track, estimate salary bands in the tricity, and match a training format to your semester window.`,
  alternates: { canonical: `${site.url}/tools` },
};


export default function ToolsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Free Tools" }]}
        eyebrow="Free tools"
        title="Three tools to help you decide"
        body="No sign-up, no email capture, no results held back behind a form. They run in your browser and nothing is sent anywhere."
        meta={[
          { label: "Tools", value: "3" },
          { label: "Cost", value: "Free" },
          { label: "Sign-up", value: "Not required" },
        ]}
      />

      <section className="py-16 lg:py-24">
        <Rail>
          <div className="grid gap-4 lg:grid-cols-3">
            {freeTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="card-hover flex flex-col rounded-2xl border border-line bg-white p-7"
              >
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon name={tool.icon} className="size-6" />
                </span>
                <h2 className="mt-6 font-display text-lg font-bold tracking-tight">{tool.title}</h2>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{tool.blurb}</p>
                <span className="mt-6 flex items-center justify-between border-t border-line pt-5 text-sm">
                  <span className="text-xs text-muted">{tool.time}</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-brand-600">
                    Open tool
                    <Icon name="arrow-right" className="size-4" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Rail>
      </section>

      <CtaSection />
    </>
  );
}
