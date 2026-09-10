import { site } from "@/data/site";
import { courses as staticCourses, courseSlug, trainingSlug, type Course } from "@/data/courses";
import {
  after12CoursesBySlug,
  programsBySlug,
  trainingFormatsBySlug,
  type After12Course,
  type Program,
  type TrainingFormat,
} from "@/data/programs";

/**
 * The site publishes flat, SEO-shaped slugs at the root (`/python-course-in-
 * chandigarh`). This resolver turns one of those into the record behind it.
 *
 * Order matters: the exact-match maps are checked before the suffix patterns,
 * because slugs such as `45-days-training-in-chandigarh` would otherwise be
 * mistaken for a course training variant.
 */
/**
 * Generic in the course type because two very different callers resolve the
 * same slugs: the server pages, which hold full `Course` records, and the
 * footer, which holds only the id-and-name options the browser was sent.
 */
export type Resolved<T = Course> =
  | { kind: "course"; course: T; variant: "course" | "training" }
  | { kind: "program"; program: Program }
  | { kind: "training-format"; format: TrainingFormat }
  | { kind: "after-12th"; entry: After12Course; course: T };

const COURSE_SUFFIX = `-course-in-${site.citySlug}`;
const TRAINING_SUFFIX = `-training-in-${site.citySlug}`;

/**
 * Resolves against a catalogue the caller supplies rather than importing one.
 *
 * Required, not defaulted: the two callers hold different things — the server
 * pages have full `Course` records, the footer has only the id-and-name
 * options the browser was sent — and a default would quietly resolve against
 * the build-time catalogue in the one place that most needs the live one.
 */
export function resolveSlug<T extends { id: string; training?: boolean }>(
  slug: string,
  catalogue: readonly T[],
): Resolved<T> | null {
  const getCourse = (id: string) => catalogue.find((course) => course.id === id);

  const program = programsBySlug.get(slug);
  if (program) return { kind: "program", program };

  const format = trainingFormatsBySlug.get(slug);
  if (format) return { kind: "training-format", format };

  const after12 = after12CoursesBySlug.get(slug);
  if (after12) {
    const course = getCourse(after12.courseId);
    if (course) return { kind: "after-12th", entry: after12, course };
  }

  if (slug.endsWith(COURSE_SUFFIX)) {
    const course = getCourse(slug.slice(0, -COURSE_SUFFIX.length));
    if (course) return { kind: "course", course, variant: "course" };
  }

  if (slug.endsWith(TRAINING_SUFFIX)) {
    const course = getCourse(slug.slice(0, -TRAINING_SUFFIX.length));
    if (course?.training) return { kind: "course", course, variant: "training" };
  }

  return null;
}

/** Every root-level slug the site generates, for `generateStaticParams`. */
export function allRootSlugs(catalogue: Course[] = staticCourses): string[] {
  return [
    ...catalogue.map((c) => courseSlug(c.id)),
    ...catalogue.filter((c) => c.training).map((c) => trainingSlug(c.id)),
    ...programsBySlug.keys(),
    ...trainingFormatsBySlug.keys(),
    ...after12CoursesBySlug.keys(),
  ];
}

/**
 * Related courses from the same track, excluding the one being viewed.
 *
 * Superseded by `relatedFrom` in `lib/catalogue.ts`, which takes the resolved
 * catalogue. Kept as a thin wrapper over the static one for any caller that
 * cannot await.
 */
export function relatedCourses(course: Course, limit = 3, catalogue: Course[] = staticCourses): Course[] {
  const sameTrack = catalogue.filter((c) => c.category === course.category && c.id !== course.id);
  if (sameTrack.length >= limit) return sameTrack.slice(0, limit);
  const others = catalogue.filter((c) => c.category !== course.category && c.featured);
  return [...sameTrack, ...others].slice(0, limit);
}

export const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;
