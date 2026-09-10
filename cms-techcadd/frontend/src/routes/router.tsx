import type { ReactElement } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { AdminLayout } from '../components/layout/AdminLayout'
import Dashboard from '../pages/Dashboard'
import NotFound from '../pages/NotFound'
import Forbidden from '../pages/Forbidden'
import { ProtectedRoute } from './ProtectedRoute'
import { DevGalleryRoute } from './DevGalleryRoute'
import {
  AlbumFormPage,
  BlogFormPage,
  BlogsListPage,
  CategoriesListPage,
  CategoryFormPage,
  CourseCategoriesListPage,
  CourseCategoryFormPage,
  CourseFormPage,
  CoursesListPage,
  EnquiriesListPage,
  EventFormPage,
  EventsListPage,
  FaqFormPage,
  FaqsListPage,
  GalleryListPage,
  Lazy,
  LoginPage,
  MediaLibraryPage,
  NewsletterListPage,
  PageFormPage,
  PagesListPage,
  ReviewFormPage,
  ReviewsListPage,
  SettingsPage,
  TestimonialFormPage,
  TestimonialsListPage,
} from './lazyPages'

/** List, create and edit routes for one module, all lazily loaded. */
function crudRoutes(segment: string, list: ReactElement, form: ReactElement) {
  return [
    { path: segment, element: <Lazy>{list}</Lazy> },
    { path: `${segment}/new`, element: <Lazy>{form}</Lazy> },
    { path: `${segment}/:id/edit`, element: <Lazy>{form}</Lazy> },
  ]
}

/**
 * A data router, not `<BrowserRouter>` — `useBlocker`, which powers the
 * unsaved-changes guard on every form, only exists on this router.
 *
 * Every entry in the sidebar now resolves to a real page, so the "not built
 * yet" placeholder that stood in for unfinished Jalandhar modules is gone. A
 * sidebar link that leads to a stub is worse than no link at all.
 */
export const router = createBrowserRouter([
  { path: 'login', element: <Lazy><LoginPage /></Lazy> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },

          ...crudRoutes('blogs', <BlogsListPage />, <BlogFormPage />),
          ...crudRoutes('categories', <CategoriesListPage />, <CategoryFormPage />),
          ...crudRoutes('courses', <CoursesListPage />, <CourseFormPage />),
          ...crudRoutes(
            'course-categories',
            <CourseCategoriesListPage />,
            <CourseCategoryFormPage />,
          ),
          ...crudRoutes('faqs', <FaqsListPage />, <FaqFormPage />),
          ...crudRoutes('reviews', <ReviewsListPage />, <ReviewFormPage />),
          ...crudRoutes('testimonials', <TestimonialsListPage />, <TestimonialFormPage />),
          ...crudRoutes('events', <EventsListPage />, <EventFormPage />),
          ...crudRoutes('gallery', <GalleryListPage />, <AlbumFormPage />),
          ...crudRoutes('pages', <PagesListPage />, <PageFormPage />),

          // Enquiries arrive from the public site — no create/edit page, the
          // detail drawer handles everything editable.
          { path: 'enquiries', element: <Lazy><EnquiriesListPage /></Lazy> },

          // Likewise read-only: subscribers add themselves from the website.
          { path: 'newsletter', element: <Lazy><NewsletterListPage /></Lazy> },

          { path: 'media', element: <Lazy><MediaLibraryPage /></Lazy> },
          { path: 'settings', element: <Lazy><SettingsPage /></Lazy> },

          { path: '403', element: <Forbidden /> },

          ...(import.meta.env.DEV
            ? [{ path: 'dev/primitives', element: <DevGalleryRoute /> }]
            : []),

          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
])
