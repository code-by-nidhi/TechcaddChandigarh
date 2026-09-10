import { cache } from "react";
import {
  courseCategories as staticCategories,
  courses as staticCourses,
  type Course,
  type CourseBadge,
  type CourseCategory,
  type CourseCategoryId,
} from "@/data/courses";

/**
 * The course catalogue, from the CMS when there is one.
 *
 * Kept apart from `lib/cms.ts` because this module carries a constraint none
 * of the other content types have: roughly 150 of the site's URLs are derived
 * from this catalogue by `lib/routes.ts`, and every one of them is resolved
 * during the build. A naive getter would refetch the whole catalogue once per
 * page — a few hundred identical requests — so every read here goes through
 * React's `cache`, which dedupes them to one per request.
 *
 * Everything returns the site's own `Course` and `CourseCategory` types rather
 * than a CMS shape, so the twenty-odd components that render courses did not
 * have to change when this was introduced.
 */

const BASE = (process.env.CMS_API_URL ?? "").replace(/\/+$/, "");
const PUBLIC = BASE ? `${BASE}/api/public` : "";

export const catalogueFromCms = Boolean(BASE);

const REVALIDATE_SECONDS = Number(process.env.CMS_REVALIDATE_SECONDS ?? 300);
const TIMEOUT_MS = 10_000;

/** Shares the CMS tag, so one revalidation ping refreshes courses too. */
const CMS_TAG = "cms";

const warned = new Set<string>();

function warnOnce(key: string, error: unknown) {
  if (warned.has(key)) return;
  warned.add(key);
  const reason = error instanceof Error ? error.message : String(error);
  console.warn(`[catalogue] ${key} unavailable (${reason}) - falling back to the static catalogue.`);
}

async function fetchJson<T>(path: string, search?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${PUBLIC}${path}`);
  for (const [key, value] of Object.entries(search ?? {})) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS, tags: [CMS_TAG] },
  });

  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${path}`);
  return (await response.json()) as T;
}

/* ------------------------------------------------------------------ */
/* CMS shapes                                                          */
/* ------------------------------------------------------------------ */

interface CmsCourseCategory {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  blurb: string;
  icon: string;
  courseCount: number;
}

interface CmsCourse {
  id: string;
  courseKey: string;
  name: string;
  category?: { slug: string };
  duration: string;
  level: Course["level"];
  summary: string;
  badge?: string;
  featured: boolean;
  hasTraining: boolean;
  heroImage?: { url: string };
  fee?: { original: number; offer: number };
  tools: string[];
  modules: { title: string; topics: string[] }[];
  outcomes: string[];
  careers: string[];
}

/**
 * The badges the site's card component knows how to draw.
 *
 * The CMS stores a free-text badge so a new ribbon does not need a migration;
 * anything the site has no style for is dropped rather than rendered as an
 * unstyled box.
 */
const KNOWN_BADGES = new Set<CourseBadge>(["Hot", "New", "Trending"]);

const toBadge = (badge?: string): CourseBadge | undefined =>
  badge && KNOWN_BADGES.has(badge as CourseBadge) ? (badge as CourseBadge) : undefined;

function toCourse(course: CmsCourse): Course {
  return {
    // The course key is the site's `id` — every slug is derived from it.
    id: course.courseKey,
    name: course.name,
    // An uncategorised course still has a page; it just falls outside the
    // filter groups until someone files it.
    category: (course.category?.slug ?? "ai") as CourseCategoryId,
    duration: course.duration,
    level: course.level,
    summary: course.summary,
    badge: toBadge(course.badge),
    featured: course.featured,
    training: course.hasTraining,
    heroImage: course.heroImage?.url,
    tools: course.tools,
    modules: course.modules,
    outcomes: course.outcomes,
    careers: course.careers,
    fee: course.fee,
  };
}

function toCategory(category: CmsCourseCategory): CourseCategory {
  return {
    id: category.slug as CourseCategoryId,
    name: category.name,
    short: category.shortName,
    blurb: category.blurb,
    icon: category.icon,
  };
}

/* ------------------------------------------------------------------ */
/* Loaders                                                             */
/* ------------------------------------------------------------------ */

/**
 * The whole catalogue, once per request.
 *
 * `cache` is what makes this affordable: `generateStaticParams`,
 * `generateMetadata` and the page body of every course route all ask for it,
 * and without deduping that is three requests per course page.
 */
export const getCourses = cache(async (): Promise<Course[]> => {
  if (!catalogueFromCms) return staticCourses;

  try {
    const { items } = await fetchJson<{ items: CmsCourse[] }>("/courses", { limit: 100 });
    // An empty catalogue is a fresh install, not a decision to sell nothing.
    if (items.length === 0) return staticCourses;
    return items.map(toCourse);
  } catch (error) {
    warnOnce("courses", error);
    return staticCourses;
  }
});

export const getCourseCategories = cache(async (): Promise<CourseCategory[]> => {
  if (!catalogueFromCms) return staticCategories;

  try {
    const { items } = await fetchJson<{ items: CmsCourseCategory[] }>("/course-categories", {
      limit: 50,
    });
    if (items.length === 0) return staticCategories;
    return items.map(toCategory);
  } catch (error) {
    warnOnce("course categories", error);
    return staticCategories;
  }
});

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

/**
 * The same helpers `data/courses.ts` exports, over the resolved catalogue.
 *
 * They take the catalogue rather than fetching it so a caller that already has
 * it does not pay for a second lookup, and so they stay pure and testable.
 */

export const findCourse = (courses: Course[], id: string): Course | undefined =>
  courses.find((course) => course.id === id);

export const coursesInCategory = (courses: Course[], category: CourseCategoryId): Course[] =>
  courses.filter((course) => course.category === category);

export const featuredFrom = (courses: Course[]): Course[] =>
  courses.filter((course) => course.featured);

export const trainingFrom = (courses: Course[]): Course[] =>
  courses.filter((course) => course.training);

/**
 * Related courses from the same track, topped up with featured ones.
 *
 * Topped up rather than left short: a category with one course in it would
 * otherwise render an empty rail at the foot of that course's page.
 */
export function relatedFrom(courses: Course[], course: Course, limit = 3): Course[] {
  const sameTrack = courses.filter((c) => c.category === course.category && c.id !== course.id);
  if (sameTrack.length >= limit) return sameTrack.slice(0, limit);

  const others = courses.filter((c) => c.category !== course.category && c.featured);
  return [...sameTrack, ...others].slice(0, limit);
}

/** Convenience for the many pages that want one course and nothing else. */
export const getCourseByKey = cache(async (id: string): Promise<Course | undefined> =>
  findCourse(await getCourses(), id),
);

/**
 * One category, resolved safely.
 *
 * `getCategory` in `data/courses.ts` ends in a non-null assertion, which was
 * fine when the seven categories were a hard-coded union. They are editable
 * now, so a course can outlive the category it was filed under — and a card
 * whose group was deleted should still render its name and price rather than
 * crash the page it is on. Falls back to the static list, then to a neutral
 * label.
 */
export const getCategoryFor = cache(async (id: CourseCategoryId): Promise<CourseCategory> => {
  const categories = await getCourseCategories();
  return (
    categories.find((category) => category.id === id) ??
    staticCategories.find((category) => category.id === id) ?? {
      id,
      name: "Courses",
      short: "Courses",
      blurb: "",
      icon: "sparkles",
    }
  );
});
