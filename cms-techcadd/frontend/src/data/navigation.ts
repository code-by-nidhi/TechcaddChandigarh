import {
  Activity,
  Bot,
  CalendarDays,
  FileText,
  Folder,
  GraduationCap,
  Image,
  Images,
  LayoutDashboard,
  Mail,
  MessageSquare,
  MessageSquareQuote,
  Newspaper,
  CircleHelp,
  Search,
  Settings,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'

import type { NavSection } from '../types'

/**
 * Single source of truth for the sidebar, the routes and the header title.
 * Adding a module here wires it into all three.
 *
 * Scope note: this lists what the TechCADD Chandigarh website actually reads
 * from the CMS, plus the tools for running the CMS itself. A module appears
 * here only once something renders it — a sidebar link that manages content no
 * visitor will ever see is worse than no link at all.
 *
 * Two entries are deliberately absent rather than missing:
 *
 *   - **Categories.** Blog categories are now created and picked from inside
 *     the blog form, and one created there and left unused deletes itself, so
 *     the standalone page had nothing left to do. The route still exists at
 *     `/categories` for renaming or reorganising in bulk — it is off the menu,
 *     not gone.
 *   - **Newsletter.** Same treatment: subscribers still arrive and are still
 *     stored, and `/newsletter` still lists them. It is not part of the daily
 *     round, so it is not in the menu.
 *
 * Course Categories stays. It is a different thing from blog categories: seven
 * tracks the courses page is organised into, with a short name and an icon the
 * site draws. See the note in `features/course-categories`.
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
        icon: Folder,
      },
      { id: 'pages', label: 'Pages', path: '/pages', icon: FileText },
      { id: 'blogs', label: 'Blogs', path: '/blogs', icon: Newspaper },
      { id: 'faqs', label: 'FAQ', path: '/faqs', icon: CircleHelp },
    ],
  },
  {
    id: 'institute',
    title: 'Institute',
    items: [
      {
        id: 'testimonials',
        label: 'Testimonials',
        path: '/testimonials',
        icon: MessageSquareQuote,
      },
      { id: 'events', label: 'Events', path: '/events', icon: CalendarDays },
      { id: 'gallery', label: 'Gallery', path: '/gallery', icon: Image },
      { id: 'reviews', label: 'Reviews', path: '/reviews', icon: Star },
    ],
  },
  {
    id: 'engagement',
    title: 'Engagement',
    items: [
      { id: 'enquiries', label: 'Enquiries', path: '/enquiries', icon: Mail },
      { id: 'comments', label: 'Comments', path: '/comments', icon: MessageSquare },
    ],
  },
  {
    id: 'system',
    title: 'System',
    items: [
      { id: 'ai-knowledge', label: 'AI Knowledge', path: '/ai-knowledge', icon: Bot },
      { id: 'team', label: 'Team', path: '/team', icon: Users },
      {
        id: 'contributions',
        label: 'Team Contributions',
        path: '/contributions',
        icon: TrendingUp,
      },
      { id: 'activity', label: 'Activity Log', path: '/activity', icon: Activity },
      { id: 'media', label: 'Media Library', path: '/media', icon: Images },
      { id: 'seo', label: 'SEO', path: '/seo', icon: Search },
      { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
]

/** Flattened nav items — handy for route generation and title lookups. */
export const navItems = navSections.flatMap((section) => section.items)

/**
 * Modules that are reachable but not in the menu.
 *
 * Kept here so `getPageTitle` can still name them: landing on `/categories`
 * from a bookmark should show "Categories" in the header, not "Not Found".
 */
const unlistedItems = [
  { id: 'categories', label: 'Categories', path: '/categories' },
  { id: 'newsletter', label: 'Newsletter', path: '/newsletter' },
]

/** Resolves the page title shown in the header for a given pathname. */
export function getPageTitle(pathname: string): string {
  const titled = [...navItems, ...unlistedItems]

  const exact = titled.find((item) => item.path === pathname)
  if (exact) return exact.label

  // Nested routes (/blogs/new, /blogs/:id/edit) inherit their module title.
  // Longest match wins so a future /blogs/archive/x picks the deeper entry.
  const parent = titled
    .filter((item) => item.path !== '/' && pathname.startsWith(`${item.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0]

  return parent?.label ?? 'Not Found'
}
