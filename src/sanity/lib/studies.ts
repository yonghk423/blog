import type {Study} from "@/lib/site"

export type SanityStudy = {
  title: string | null
  field: string | null
  publishedAt: string | null
  href: string | null
  slug: string | null
}

type SanityProjectChapter = {
  title: string | null
  field: string | null
  publishedAt: string | null
  chapterSlug: string | null
}

type SanityProjectForStudies = {
  projectSlug: string | null
  projectTitle: string | null
  chapters: SanityProjectChapter[] | null
}

export type SanityStudiesPayload = {
  posts?: SanityStudy[] | null
  projects?: SanityProjectForStudies[] | null
}

export function toStudies(items: SanityStudy[]): Study[] {
  return items.flatMap((item) => {
    if (!item.title || !item.field || !item.publishedAt) return []
    const year = new Date(item.publishedAt).getFullYear()
    if (!Number.isFinite(year)) return []
    return [
      {
        title: item.title,
        field: item.field,
        year,
        href: item.href || undefined,
      },
    ]
  })
}

function chaptersToStudies(projects: SanityProjectForStudies[]): SanityStudy[] {
  return projects.flatMap((project) => {
    if (!project.projectSlug) return []
    return (project.chapters ?? []).flatMap((chapter) => {
      if (!chapter.title || !chapter.publishedAt || !chapter.chapterSlug) return []
      return [
        {
          title: chapter.title,
          field: chapter.field || project.projectTitle,
          publishedAt: chapter.publishedAt,
          href: `/projects/${project.projectSlug}/${chapter.chapterSlug}`,
          slug: `${project.projectSlug}/${chapter.chapterSlug}`,
        },
      ]
    })
  })
}

export function mergeStudies(payload: SanityStudiesPayload | null | undefined): Study[] {
  const posts = payload?.posts ?? []
  const fromProjects = chaptersToStudies(payload?.projects ?? [])
  return toStudies([...posts, ...fromProjects]).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return a.title.localeCompare(b.title, "ko")
  })
}
