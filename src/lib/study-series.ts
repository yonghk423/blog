import type {StudySeriesItem} from "@/components/study-sidebar"

export type ResolvedStudySeries = {
  seriesTitle: string
  seriesHref: string | null
  seriesRootSlug: string | null
  items: StudySeriesItem[]
}

/**
 * Same `field` posts form a series.
 * - 1 post: field is the sidebar label, that post is the only item
 * - 2+ posts: earliest post is the series index (title + link), later posts are chapters
 */
export function resolveStudySeries(
  field: string | null,
  posts: StudySeriesItem[],
  fallback: StudySeriesItem,
): ResolvedStudySeries {
  const series = posts.filter((item) => item.slug && item.title)

  if (series.length <= 1) {
    const only = series[0] ?? fallback
    return {
      seriesTitle: field || only.title || "Study",
      seriesHref: null,
      seriesRootSlug: null,
      items: only.slug && only.title ? [only] : [],
    }
  }

  const [root, ...chapters] = series
  return {
    seriesTitle: root.title!,
    seriesHref: `/studies/${root.slug}`,
    seriesRootSlug: root.slug,
    items: chapters,
  }
}
