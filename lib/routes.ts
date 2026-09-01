import { site } from "@/data/site";
import { courses, courseSlug, trainingSlug, getCourse, type Course } from "@/data/courses";
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
export type Resolved =
  | { kind: "course"; course: Course; variant: "course" | "training" }
  | { kind: "program"; program: Program }
  | { kind: "training-format"; format: TrainingFormat }
  | { kind: "after-12th"; entry: After12Course; course: Course };

const COURSE_SUFFIX = `-course-in-${site.citySlug}`;
const TRAINING_SUFFIX = `-training-in-${site.citySlug}`;

export function resolveSlug(slug: string): Resolved | null {
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
export function allRootSlugs(): string[] {
  return [
    ...courses.map((c) => courseSlug(c.id)),
    ...courses.filter((c) => c.training).map((c) => trainingSlug(c.id)),
    ...programsBySlug.keys(),
    ...trainingFormatsBySlug.keys(),
    ...after12CoursesBySlug.keys(),
  ];
}

/** Related courses from the same track, excluding the one being viewed. */
export function relatedCourses(course: Course, limit = 3): Course[] {
  const sameTrack = courses.filter((c) => c.category === course.category && c.id !== course.id);
  if (sameTrack.length >= limit) return sameTrack.slice(0, limit);
  const others = courses.filter((c) => c.category !== course.category && c.featured);
  return [...sameTrack, ...others].slice(0, limit);
}

export const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;
