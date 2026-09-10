"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  courseCategories as staticCategories,
  courses as staticCourses,
  type CourseCategory,
  type CourseCategoryId,
} from "@/data/courses";

/**
 * The course catalogue, for the parts of the site that run in the browser.
 *
 * Four client components need it: the three enquiry forms, which offer a
 * course dropdown, and the categories showcase on the homepage. None of them
 * can fetch — they are client components — and none of them has a server
 * parent close enough to thread a prop through without touching a dozen files
 * in between.
 *
 * So the root layout resolves the catalogue once and seeds it here. The static
 * catalogue is the default, which means a component rendered outside the
 * provider still works and still shows every course that existed at build
 * time; it simply will not see one added in the CMS since.
 *
 * Only the fields the browser actually needs travel: a dropdown wants an id
 * and a name, not a syllabus of 764 topics.
 */

export interface CourseOption {
  id: string;
  name: string;
  category: CourseCategoryId;
  /**
   * Whether this course also publishes a training URL.
   *
   * Carried because `Footer` resolves the current path against this list and
   * `resolveSlug` reads it to tell `/python-course-in-chandigarh` from
   * `/python-training-in-chandigarh`. Without it every training page would
   * fail to resolve and get a duplicate closing call to action.
   */
  training?: boolean;
}

export interface Catalogue {
  courses: CourseOption[];
  categories: CourseCategory[];
}

const STATIC_CATALOGUE: Catalogue = {
  courses: staticCourses.map((course) => ({
    id: course.id,
    name: course.name,
    category: course.category,
    training: course.training,
  })),
  categories: staticCategories,
};

const CatalogueContext = createContext<Catalogue>(STATIC_CATALOGUE);

export function CatalogueProvider({
  catalogue,
  children,
}: {
  catalogue: Catalogue;
  children: ReactNode;
}) {
  return <CatalogueContext.Provider value={catalogue}>{children}</CatalogueContext.Provider>;
}

/** The whole catalogue — courses and the groups they are filed under. */
export function useCatalogue(): Catalogue {
  return useContext(CatalogueContext);
}

/** Just the dropdown options, which is all the enquiry forms need. */
export function useCourseOptions(): CourseOption[] {
  return useContext(CatalogueContext).courses;
}
