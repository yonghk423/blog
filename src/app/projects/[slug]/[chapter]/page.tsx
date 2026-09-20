import type {Metadata} from "next"
import Link from "next/link"
import {notFound, redirect} from "next/navigation"
import {projectHasIndexPage} from "@/lib/projects"
import {PortableText, stegaClean, type PortableTextBlock} from "next-sanity"
import {
  ProjectSidebar,
  type ProjectNavItem,
} from "@/components/project-sidebar"
import {sanityFetch} from "@/sanity/lib/live"
import {PROJECT_CHAPTER_QUERY, PROJECTS_NAV_QUERY} from "@/sanity/queries"

type ChapterData = {
  _id: string
  title: string | null
  slug: string | null
  chapter: {
    _key: string
    title: string | null
    slug: string | null
    externalUrl?: string | null
    body: PortableTextBlock[] | null
  } | null
}

type Props = {
  params: Promise<{slug: string; chapter: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug, chapter: chapterSlug} = await params
  const {data} = await sanityFetch({
    query: PROJECT_CHAPTER_QUERY,
    params: {slug, chapter: chapterSlug},
    stega: false,
  })
  const project = data as ChapterData | null

  return {
    title: project?.chapter?.title || project?.title || "Project",
  }
}

export default async function ProjectChapterPage({params}: Props) {
  const {slug, chapter: chapterSlug} = await params
  const [{data}, {data: nav}] = await Promise.all([
    sanityFetch({
      query: PROJECT_CHAPTER_QUERY,
      params: {slug, chapter: chapterSlug},
    }),
    sanityFetch({query: PROJECTS_NAV_QUERY}),
  ])
  const project = data as ChapterData | null
  const chapter = project?.chapter
  const projects =
    (nav as ProjectNavItem[] | null)?.filter((item) => item.slug && item.title) ?? []

  if (!project?.title || !chapter?.title) notFound()

  const externalUrl = stegaClean(chapter.externalUrl)
  if (externalUrl) {
    redirect(externalUrl)
  }

  return (
    <main className="about">
      <ProjectSidebar
        projects={projects}
        activeSlug={slug}
        activeChapter={chapter.slug || chapterSlug}
      />

      <div className="about-content">
        <article className="project-page">
          <p className="project-page__back">
            {projectHasIndexPage(slug) ? (
              <Link href={`/projects/${slug}`}>← {project.title}</Link>
            ) : (
              <Link href="/about">← About</Link>
            )}
          </p>
          <h1 className="project-page__title">{chapter.title}</h1>
          {chapter.body?.length ? (
            <div className="project-page__body">
              <PortableText value={chapter.body} />
            </div>
          ) : null}
        </article>
      </div>
    </main>
  )
}
