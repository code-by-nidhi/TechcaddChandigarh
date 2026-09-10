import { lazy, Suspense, type ReactNode } from 'react'

import { SkeletonTable } from '../components/feedback/Skeleton'

// Split per route. Every form page pulls in the rich text editor, which is far
// too large to sit in the initial bundle.
export const BlogsListPage = lazy(() => import('../features/blogs/BlogsListPage'))
export const BlogFormPage = lazy(() => import('../features/blogs/BlogFormPage'))

export const CategoriesListPage = lazy(() => import('../features/categories/CategoriesListPage'))
export const CategoryFormPage = lazy(() => import('../features/categories/CategoryFormPage'))

export const CoursesListPage = lazy(() => import('../features/courses/CoursesListPage'))
export const CourseFormPage = lazy(() => import('../features/courses/CourseFormPage'))

export const CourseCategoriesListPage = lazy(
  () => import('../features/course-categories/CourseCategoriesListPage'),
)
export const CourseCategoryFormPage = lazy(
  () => import('../features/course-categories/CourseCategoryFormPage'),
)

export const FaqsListPage = lazy(() => import('../features/faqs/FaqsListPage'))
export const FaqFormPage = lazy(() => import('../features/faqs/FaqFormPage'))

export const ReviewsListPage = lazy(() => import('../features/reviews/ReviewsListPage'))
export const ReviewFormPage = lazy(() => import('../features/reviews/ReviewFormPage'))

export const TestimonialsListPage = lazy(
  () => import('../features/testimonials/TestimonialsListPage'),
)
export const TestimonialFormPage = lazy(
  () => import('../features/testimonials/TestimonialFormPage'),
)

export const EventsListPage = lazy(() => import('../features/events/EventsListPage'))
export const EventFormPage = lazy(() => import('../features/events/EventFormPage'))

export const GalleryListPage = lazy(() => import('../features/gallery/GalleryListPage'))
export const AlbumFormPage = lazy(() => import('../features/gallery/AlbumFormPage'))

export const PagesListPage = lazy(() => import('../features/pages/PagesListPage'))
export const PageFormPage = lazy(() => import('../features/pages/PageFormPage'))


export const EnquiriesListPage = lazy(() => import('../features/enquiries/EnquiriesListPage'))
export const NewsletterListPage = lazy(() => import('../features/newsletter/NewsletterListPage'))

export const MediaLibraryPage = lazy(() => import('../features/media/MediaLibraryPage'))
export const SettingsPage = lazy(() => import('../features/settings/SettingsPage'))

export const LoginPage = lazy(() => import('../features/auth/LoginPage'))

/** Route-level suspense boundary — a skeleton, never a bare spinner. */
export function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<SkeletonTable />}>{children}</Suspense>
}
