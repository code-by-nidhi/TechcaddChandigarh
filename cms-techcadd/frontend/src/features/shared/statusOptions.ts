/**
 * The publish states every content module shares.
 *
 * Blogs, categories, FAQs and reviews all render the same three-way select, so
 * the list lives here rather than in any one of them. It used to sit in the
 * Courses module's schema and was imported from there by the other four — which
 * meant removing Courses took the status dropdown out of every form with it.
 *
 * Ordered by how far along the workflow each state is, so the select reads as a
 * progression rather than as an alphabetical accident.
 */
export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'In Review' },
  { value: 'published', label: 'Published' },
]
