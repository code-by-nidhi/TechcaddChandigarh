import {
  CalendarDays,
  GraduationCap,
  FolderTree,
  FileText,
  Folder,
  Image,
  Images,
  LayoutDashboard,
  Mail,
  MailOpen,
  MessageSquareQuote,
  Newspaper,
  CircleHelp,
  Settings,
  Star,
} from 'lucide-react'

import type { NavSection } from '../types'

/**
 * Single source of truth for the sidebar, the routes and the header title.
 * Adding a module here wires it into all three.
 *
 * Scope note: this lists what the TechCADD Chandigarh website actually reads
 * from the CMS, and nothing else. A module appears here only once the site has
 * something that renders it — a sidebar link that manages content no visitor
 * will ever see is worse than no link at all.
 *
 * Testimonials sits beside Reviews rather than merging into it because the two
 * render as different things on this site: Reviews is the quote-and-stars wall,
 * Testimonials is the video wall, and a testimonial carries a YouTube link that
 * a review has no use for. On the Hoshiarpur site, which had no video wall,
 * keeping both really was duplication.
 *
 * Courses are back, on the opposite reasoning to the one that removed them.
 * They were dropped because the old schema had no columns for what the site
 * renders, so a course entered here reached no visitor. The schema now matches
 * the site's own catalogue field for field, and the website reads it — so the
 * form publishes real pages, roughly 150 of them.
 *
 * Course Categories sits beside it rather than merging into the blog's
 * Categories: a blog category has a description and a post count, a course
 * category has a short label for a filter pill, a blurb and an icon.
 *
 * Banners, faculty, branches and redirects stay out — nothing on the site
 * reads them.
 */
export const navSections: NavSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    items: [{ id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard }],
  },
  {
    id: 'content',
    title: 'Content',
    items: [
      { id: 'courses', label: 'Courses', path: '/courses', icon: GraduationCap },
      {
        id: 'course-categories',
        label: 'Course Categories',
        path: '/course-categories',
        icon: FolderTree,
      },
      { id: 'blogs', label: 'Blogs', path: '/blogs', icon: Newspaper },
      { id: 'categories', label: 'Categories', path: '/categories', icon: Folder },
      { id: 'faqs', label: 'FAQ', path: '/faqs', icon: CircleHelp },
      { id: 'reviews', label: 'Reviews', path: '/reviews', icon: Star },
      {
        id: 'testimonials',
        label: 'Testimonials',
        path: '/testimonials',
        icon: MessageSquareQuote,
      },
      { id: 'events', label: 'Events', path: '/events', icon: CalendarDays },
      { id: 'gallery', label: 'Gallery', path: '/gallery', icon: Image },
      { id: 'pages', label: 'Pages', path: '/pages', icon: FileText },
    ],
  },
  {
    id: 'engagement',
    title: 'Engagement',
    items: [
      { id: 'enquiries', label: 'Enquiries', path: '/enquiries', icon: Mail },
      { id: 'newsletter', label: 'Newsletter', path: '/newsletter', icon: MailOpen },
    ],
  },
  {
    id: 'system',
    title: 'System',
    items: [
      { id: 'media', label: 'Media Library', path: '/media', icon: Images },
      { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
]

/** Flattened nav items — handy for route generation and title lookups. */
export const navItems = navSections.flatMap((section) => section.items)

/** Resolves the page title shown in the header for a given pathname. */
export function getPageTitle(pathname: string): string {
  const exact = navItems.find((item) => item.path === pathname)
  if (exact) return exact.label

  // Nested routes (/courses/new, /courses/:id/edit) inherit their module title.
  // Longest match wins so a future /courses/archive/x picks the deeper entry.
  const parent = navItems
    .filter((item) => item.path !== '/' && pathname.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]

  return parent?.label ?? 'Not Found'
}
