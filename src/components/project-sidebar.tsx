"use client"

import Link from "next/link"
import {useEffect, useState} from "react"

export type ProjectNavChapter = {
  _key: string
  title: string | null
  slug: string | null
}

export type ProjectNavItem = {
  _id: string
  title: string | null
  slug: string | null
  chapters: ProjectNavChapter[] | null
}

type ProjectSidebarProps = {
  projects: ProjectNavItem[]
  activeSlug?: string | null
  activeChapter?: string | null
}

export function ProjectSidebar({
  projects,
  activeSlug = null,
  activeChapter = null,
}: ProjectSidebarProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(activeSlug)

  useEffect(() => {
    if (activeSlug) setOpenSlug(activeSlug)
  }, [activeSlug])

  if (!projects.length) return null

  return (
    <aside className="about-sidebar">
      <p className="about-sidebar__label">Project</p>
      <nav aria-label="프로젝트 목록">
        <ul className="about-sidebar__list">
          {projects.map((project) => {
            if (!project.slug || !project.title) return null

            const chapters =
              project.chapters?.filter((chapter) => chapter.slug && chapter.title) ?? []
            const isOpen = openSlug === project.slug
            const isActive = activeSlug === project.slug

            return (
              <li key={project._id} className="about-sidebar__item">
                <div className="about-sidebar__project">
                  <button
                    type="button"
                    className="about-sidebar__toggle"
                    aria-expanded={isOpen}
                    aria-controls={`project-chapters-${project.slug}`}
                    onClick={() =>
                      setOpenSlug((current) => (current === project.slug ? null : project.slug))
                    }
                  >
                    <span className="about-sidebar__chevron" aria-hidden="true">
                      {isOpen ? "▾" : "▸"}
                    </span>
                    <span className="sr-only">{project.title} 챕터 목록</span>
                  </button>
                  <Link
                    className="about-sidebar__link"
                    href={`/projects/${project.slug}`}
                    aria-current={isActive && !activeChapter ? "page" : undefined}
                    onClick={() => setOpenSlug(project.slug)}
                  >
                    <span className="about-sidebar__title">{project.title}</span>
                  </Link>
                </div>

                {chapters.length > 0 ? (
                  <ul
                    id={`project-chapters-${project.slug}`}
                    className="about-sidebar__chapters"
                    hidden={!isOpen}
                  >
                    {chapters.map((chapter) => (
                      <li key={chapter._key}>
                        <Link
                          className="about-sidebar__chapter"
                          href={`/projects/${project.slug}/${chapter.slug}`}
                          aria-current={
                            isActive && activeChapter === chapter.slug ? "page" : undefined
                          }
                          onClick={() => setOpenSlug(project.slug)}
                        >
                          {chapter.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
