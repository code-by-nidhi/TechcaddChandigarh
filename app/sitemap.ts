import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { allRootSlugs } from "@/lib/routes";
import { branches, serviceAreas } from "@/data/branches";
import { getBlogPosts, getCustomPages, getEvents } from "@/lib/cms";
import { getCourses } from "@/lib/catalogue";
import { freeTools } from "@/data/tools";

const staticRoutes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/courses", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/certificate-programs", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/after-12th-courses", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/about/founder", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/about/mission-vision", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/branches", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/blogs", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/events", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/gallery", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/reviews", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/placement", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/internship-training", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/college-partnerships", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/tools", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/cookie-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  // From the CMS when one is configured, so a post published there is
  // discoverable without waiting for a rebuild.
  const [posts, events, pages, courses] = await Promise.all([
    getBlogPosts(),
    getEvents(),
    getCustomPages(),
    getCourses(),
  ]);

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...allRootSlugs(courses).map((slug) => ({
      url: `${site.url}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...branches.map((branch) => ({
      url: `${site.url}/branches/${branch.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...serviceAreas.map((area) => ({
      url: `${site.url}/computer-training-in/${area.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/blogs/${post.slug}`,
      // A CMS post can be saved with no publish date; today is a better
      // answer for a crawler than an invalid one.
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...events.map((event) => ({
      url: `${site.url}/events/${event.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    // Editor-authored pages. Overrides are deliberately absent — they change
    // copy on a route that is already listed above, and are not URLs of their
    // own to crawl.
    ...pages.map((page) => ({
      url: `${site.url}/pages/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...freeTools.map((tool) => ({
      url: `${site.url}/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
