import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";
import { getCustomPages, getEvents, getSite } from "@/lib/cms";
import { getCourseCategories, getCourses } from "@/lib/catalogue";
import { CatalogueProvider } from "@/components/CatalogueProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Best IT & AI Courses in ${site.city} | Industry-Level Hands-On Training | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    `best IT courses in ${site.city}`,
    `best AI course in ${site.city}`,
    `IT training centre ${site.city}`,
    `software training company ${site.city}`,
    "industry ready IT courses",
    "hands on AI training",
    "live project based training",
    `job oriented courses ${site.city}`,
    `computer course ${site.city}`,
    `techcadd ${site.city}`,
    `data science course ${site.city}`,
    `python training ${site.city}`,
    `web development course ${site.city}`,
    `digital marketing course ${site.city}`,
    `full stack development ${site.city}`,
    `6 months industrial training ${site.city}`,
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: `Best IT & AI Courses in ${site.city} | ${site.name}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Best IT & AI Courses in ${site.city} | ${site.name}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060e2b",
  width: "device-width",
  initialScale: 1,
};

/**
 * Built from a resolved config rather than the static one, so a phone number
 * or address changed in the CMS also changes what search engines are told.
 */
function organizationSchemaFor(site: Awaited<ReturnType<typeof getSite>>) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.name,
    url: site.url,
    description: site.description,
    telephone: site.contact.phone,
    email: site.contact.email,
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.stats.rating,
      reviewCount: site.stats.reviews.replace("+", ""),
    },
    sameAs: Object.values(site.social),
  };
}

/*
 * Browsers restore the previous scroll position on reload. On a page whose
 * sections are driven by scroll position that drops you into the middle of a
 * pinned animation, so a reload is sent back to the top instead.
 *
 * Scoped to reloads only, via the Navigation Timing entry: back/forward still
 * restore normally, and a URL carrying a hash still lands on its anchor.
 * `scrollRestoration` is handed back to the browser once the load is done, so
 * nothing after this point behaves differently.
 */
const scrollResetScript = `(function(){try{
var n=performance.getEntriesByType("navigation")[0];
var reload=n?n.type==="reload":(performance.navigation&&performance.navigation.type===1);
if(!reload||location.hash)return;
if("scrollRestoration" in history)history.scrollRestoration="manual";
addEventListener("load",function(){scrollTo(0,0);
if("scrollRestoration" in history)history.scrollRestoration="auto";});
}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  /*
   * One CMS read for the whole tree. Header and Footer are client components,
   * so they cannot fetch this themselves — and doing it here means one request
   * per render rather than one per component that prints a phone number.
   */
  const [resolvedSite, events, pages, courses, categories] = await Promise.all([
    getSite(),
    getEvents(),
    getCustomPages({ inNav: true }),
    getCourses(),
    getCourseCategories(),
  ]);

  /*
   * The Resources menu lists every published event and every page an editor
   * ticked into the nav. Built here rather than in the header because the
   * header is a client component — and once, for the whole tree, rather than
   * per render of each menu panel.
   */
  const resources = {
    events: [...events]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((event) => ({ label: event.title, href: `/events/${event.slug}` })),
    pages: pages.map((page) => ({ label: page.title, href: `/pages/${page.slug}` })),
  };

  /*
   * Only what a browser needs. The enquiry dropdowns want an id and a name,
   * not a syllabus of 764 topics — sending the whole catalogue would put all
   * of it in the RSC payload of every page on the site.
   */
  const catalogue = {
    courses: courses.map((course) => ({
      id: course.id,
      name: course.name,
      category: course.category,
      training: course.training,
    })),
    categories,
  };

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh">
        {/* Runs during parse, before the browser restores the old offset. */}
        <script dangerouslySetInnerHTML={{ __html: scrollResetScript }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-brand-600 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <CatalogueProvider catalogue={catalogue}>
          <Header site={resolvedSite} resources={resources} />
          <main id="main">{children}</main>
          <Footer site={resolvedSite} />
        </CatalogueProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchemaFor(resolvedSite)) }}
        />
      </body>
    </html>
  );
}
