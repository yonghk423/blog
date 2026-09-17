import type {Metadata} from "next"
import Link from "next/link"
import {notFound} from "next/navigation"
import {PortableText, type PortableTextBlock} from "next-sanity"
import {sanityFetch} from "@/sanity/lib/live"
import {PROJECT_QUERY, PROJECTS_NAV_QUERY} from "@/sanity/queries"

type ProjectNavItem = {
  _id: string
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

  return {
    title: project?.title || "Project",
  }
}

export default async function ProjectPage({params}: Props) {
  const {slug} = await params
  const [{data}, {data: nav}] = await Promise.all([
    sanityFetch({query: PROJECT_QUERY, params: {slug}}),
    sanityFetch({query: PROJECTS_NAV_QUERY}),
  ])
  const project = data as ProjectData | null
  const projects = (nav as ProjectNavItem[] | null)?.filter((item) => item.slug && item.title) ?? []

  if (!project?.title) notFound()

  return (
    <main className="about">
      {projects.length > 0 ? (
        <aside className="about-sidebar">
          <p className="about-sidebar__label">Project</p>
          <nav aria-label="프로젝트 목록">
            <ul className="about-sidebar__list">
              {projects.map((item) => (
                <li key={item._id}>
                  <Link
                    className="about-sidebar__link"
                    href={`/projects/${item.slug}`}
                    aria-current={item.slug === slug ? "page" : undefined}
                  >
                    <span className="about-sidebar__title">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      ) : null}

      <div className="about-content">
        <article className="project-page">
          <p className="project-page__back">
            <Link href="/about">← About</Link>
          </p>
          <h1 className="project-page__title">{project.title}</h1>
          {project.summary ? <p className="project-page__summary">{project.summary}</p> : null}
          {project.tech?.length ? (
            <p className="project-page__tech">주요 기술: {project.tech.join(", ")}</p>
          ) : null}
          {project.body?.length ? (
            <div className="project-page__body">
              <PortableText value={project.body} />
            </div>
          ) : (
            <p className="project-page__empty">프로젝트 소개 본문은 Sanity Studio에서 작성할 수 있습니다.</p>
          )}
        </article>
      </div>
    </main>
  )
}
