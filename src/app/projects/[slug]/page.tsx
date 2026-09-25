import type {Metadata} from "next"
import Link from "next/link"
import {notFound, redirect} from "next/navigation"
import {projectHasIndexPage} from "@/lib/projects"
import {pageMetadata} from "@/lib/seo"
import {type PortableTextBlock} from "next-sanity"
import {PortableBody} from "@/components/portable-body"
import {
  ProjectSidebar,
  type ProjectNavItem,
} from "@/components/project-sidebar"
import {ChapterHashRedirect} from "@/components/chapter-hash-redirect"
import {sanityFetch} from "@/sanity/lib/live"
import {PROJECT_QUERY, PROJECTS_NAV_QUERY} from "@/sanity/queries"

type ProjectChapter = {
  _key: string
  title: string | null
  slug: string | null
}

type ProjectData = {
  _id: string
  title: string | null
  summary: string | null
  tech: string[] | null
  body: PortableTextBlock[] | null
  slug: string | null
  chapters: ProjectChapter[] | null
}

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: PROJECT_QUERY,
    params: {slug},
    stega: false,
  })
  const project = data as ProjectData | null

  return pageMetadata({
    title: project?.title || "Project",
    description: project?.summary || undefined,
    path: `/projects/${slug}`,
    type: "article",
  })
}

export default async function ProjectPage({params}: Props) {
  const {slug} = await params
  const [{data}, {data: nav}] = await Promise.all([
    sanityFetch({query: PROJECT_QUERY, params: {slug}}),
    sanityFetch({query: PROJECTS_NAV_QUERY}),
  ])
  const project = data as ProjectData | null
  const projects =
    (nav as ProjectNavItem[] | null)?.filter((item) => item.slug && item.title) ?? []
  const chapters =
    project?.chapters?.filter((chapter) => chapter.title && chapter.slug) ?? []

  if (!project?.title) notFound()

  if (!projectHasIndexPage(slug)) {
    const firstChapter = chapters[0]
    if (!firstChapter?.slug) notFound()
    redirect(`/projects/${slug}/${firstChapter.slug}`)
  }

  return (
    <main className="about">
      <ChapterHashRedirect slug={slug} />
      <ProjectSidebar projects={projects} activeSlug={slug} />

      <div className="about-content">
        <article className="project-page">
          <p className="project-page__back">
            <Link href="/about">← About</Link>
          </p>
          <h1 className="project-page__title">{project.title}</h1>
          {project.summary ? <p className="project-page__summary">{project.summary}</p> : null}
          {project.tech?.length ? (
            <p className="project-page__tech">
              <span className="project-page__tech-label">주요 기술:</span>{" "}
              {project.tech.join(", ")}
            </p>
          ) : null}
          {project.body?.length ? (
            <div className="project-page__body">
              <PortableBody value={project.body} />
            </div>
          ) : null}

          {chapters.length > 0 ? (
            <ul className="project-page__index">
              {chapters.map((chapter) => (
                <li key={chapter._key}>
                  <Link href={`/projects/${slug}/${chapter.slug}`}>{chapter.title}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      </div>
    </main>
  )
}
