import type {Study} from "@/lib/site"

export type SanityStudy = {
  id: string | null
  title: string | null
  field: string | null
  publishedAt: string | null
  href: string | null
  slug: string | null
}

export function toStudies(items: SanityStudy[]): Study[] {
  return items.flatMap((item) => {
    if (!item.id || !item.title || !item.field || !item.publishedAt) return []
    const year = new Date(item.publishedAt).getFullYear()
    if (!Number.isFinite(year)) return []
    return [
      {
        id: item.id,
        title: item.title,
        field: item.field,
        year,
        href: item.href || undefined,
      },
    ]
  })
}
