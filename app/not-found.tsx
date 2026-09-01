import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ButtonLink, Icon, Rail } from "@/components/ui";
import { courseCategories } from "@/data/courses";

export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="404"
        title="We could not find that page"
        body="It may have moved, or the link may be mistyped. The catalogue below covers most of what people are looking for."
      >
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/" variant="onDark" size="lg">
            Back to home
            <Icon name="arrow-right" className="size-4" />
          </ButtonLink>
          <ButtonLink href="/courses" variant="onDarkGhost" size="lg">
            Browse courses
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="py-16 lg:py-24">
        <Rail>
          <h2 className="font-display text-xl font-bold tracking-tight">Course tracks</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courseCategories.map((category) => (
              <Link
                key={category.id}
                href={`/courses#${category.id}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-5 py-4 transition-colors hover:border-brand-600/30 hover:bg-brand-50/40"
              >
                <span className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon name={category.icon} className="size-4" />
                  </span>
                  <span className="font-medium">{category.short}</span>
                </span>
                <Icon
                  name="arrow-right"
                  className="size-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-600"
                />
              </Link>
            ))}
          </div>

          <h2 className="mt-14 font-display text-xl font-bold tracking-tight">Popular pages</h2>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {[
              { label: "All courses", href: "/courses" },
              { label: "Certificate programs", href: "/certificate-programs" },
              { label: "After 12th", href: "/after-12th-courses" },
              { label: "Internship program", href: "/internship-training" },
              { label: "Our centres", href: "/branches" },
              { label: "Reviews", href: "/reviews" },
              { label: "FAQs", href: "/faq" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-brand-600/30 hover:text-brand-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Rail>
      </section>
    </>
  );
}
