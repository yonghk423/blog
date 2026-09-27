import Link from "next/link"
import {formatStudyDate} from "@/lib/site"

export type StudySeriesItem = {
  title: string | null
  slug: string | null
  publishedAt: string | null
}

type StudySidebarProps = {
  seriesTitle: string | null
  items: StudySeriesItem[]
  activeSlug: string
  activePublishedAt?: string | null
}

export function StudySidebar({
  seriesTitle,
  items,
  activeSlug,
  activePublishedAt,
}: StudySidebarProps) {
  const series = items.filter((item) => item.slug && item.title)
  const date = activePublishedAt ? formatStudyDate(activePublishedAt) : null
  const hasSeries = Boolean(seriesTitle) && series.length > 0

  return (
    <aside className="about-sidebar">
      <p className="about-sidebar__label">Study</p>

      {hasSeries ? (
        <nav aria-label={`${seriesTitle} 시리즈`}>
          <p className="about-sidebar__title">{seriesTitle}</p>
          <ul className="about-sidebar__chapters-inner study-sidebar__series">
            {series.map((item) => (
              <li key={item.slug}>
                <Link
                  className="about-sidebar__chapter"
                  href={`/studies/${item.slug}`}
                  aria-current={item.slug === activeSlug ? "page" : undefined}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {date ? <p className="about-sidebar__meta">{date}</p> : null}
    </aside>
  )
}
