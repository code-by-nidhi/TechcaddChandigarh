import Link from "next/link";
import { courseSlug, getCategory, type Course } from "@/data/courses";
import { Badge, Icon, badgeTone } from "./ui";

export function CourseCard({ course, compact = false }: { course: Course; compact?: boolean }) {
  const category = getCategory(course.category);

  return (
    <article className="card-hover group relative flex flex-col rounded-2xl border border-line bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon name={category.icon} className="size-5" />
        </span>
        {course.badge ? <Badge tone={badgeTone(course.badge)}>{course.badge}</Badge> : null}
      </div>

      <h3 className="mt-5 font-display text-lg font-bold tracking-tight">
        <Link href={`/${courseSlug(course.id)}`} className="before:absolute before:inset-0">
          {course.name}
        </Link>
      </h3>

      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted">{course.summary}</p>

      {!compact ? (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {course.tools.slice(0, 4).map((tool) => (
            <span
              key={tool}
              className="rounded-md bg-subtle px-2 py-1 text-[11px] font-medium text-muted"
            >
              {tool}
            </span>
          ))}
          {course.tools.length > 4 ? (
            <span className="rounded-md bg-subtle px-2 py-1 text-[11px] font-medium text-muted">
              +{course.tools.length - 4}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-xs font-medium text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="clock" className="size-3.5" />
          {course.duration}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="target" className="size-3.5" />
          {course.level}
        </span>
      </div>

      {course.fee ? (
        <div className="mt-4 flex items-baseline gap-2 border-t border-line pt-4">
          <span className="font-display text-lg font-bold text-foreground">
            ₹{course.fee.offer.toLocaleString("en-IN")}
          </span>
          <span className="text-sm text-muted line-through">
            ₹{course.fee.original.toLocaleString("en-IN")}
          </span>
          <span className="ml-auto text-xs font-semibold text-emerald-600">
            Save ₹{(course.fee.original - course.fee.offer).toLocaleString("en-IN")}
          </span>
        </div>
      ) : null}

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-transform duration-300 group-hover:translate-x-1">
        View syllabus
        <Icon name="arrow-right" className="size-4" />
      </span>
    </article>
  );
}

export function CourseListRow({ course }: { course: Course }) {
  return (
    <Link
      href={`/${courseSlug(course.id)}`}
      className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-white px-5 py-4 transition-colors hover:border-brand-600/30 hover:bg-brand-50/40"
    >
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="truncate font-medium">{course.name}</span>
          {course.badge ? <Badge tone={badgeTone(course.badge)}>{course.badge}</Badge> : null}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted">
          {course.duration} · {course.level}
        </span>
      </span>
      <Icon
        name="arrow-right"
        className="size-4 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-600"
      />
    </Link>
  );
}
