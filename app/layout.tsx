import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";
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

const organizationSchema = {
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-brand-600 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
