import { site } from "@/data/site";

/**
 * JSON-LD builders shared across pages. Kept as plain object builders (not a
 * React component) so callers can pass the result straight into a `<script
 * type="application/ld+json">` — the one DOM shape every page already uses.
 */

export function breadcrumbListSchema(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${site.url}${item.href}` } : {}),
    })),
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function courseSchema({
  name,
  description,
  url,
  priceInr,
}: {
  name: string;
  description: string;
  url: string;
  priceInr?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url,
    provider: {
      "@type": "EducationalOrganization",
      name: site.name,
      sameAs: site.url,
    },
    ...(priceInr
      ? {
          offers: {
            "@type": "Offer",
            price: priceInr,
            priceCurrency: "INR",
            category: "Paid",
          },
        }
      : {}),
  };
}
