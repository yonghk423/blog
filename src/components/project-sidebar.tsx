"use client"

import Link from "next/link"
import {useEffect, useState} from "react"
import {projectHasIndexPage} from "@/lib/projects"

export type ProjectNavChapter = {
  _key: string
  title: string | null
  slug: string | null
  externalUrl?: string | null
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

  function toggleProject(slug: string) {
    setOpenSlug((current) => (current === slug ? null : slug))
  }

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
            const hasIndex = projectHasIndexPage(project.slug)
            const canToggle = chapters.length > 0
            const chaptersId = `project-chapters-${project.slug}`

            return (
              <li key={project._id} className="about-sidebar__item">
                <div className="about-sidebar__project">
                  {canToggle ? (
                    <button
                      type="button"
                      className="about-sidebar__toggle"
                      aria-expanded={isOpen}
                      aria-controls={chaptersId}
                      onClick={() => toggleProject(project.slug!)}
                    >
                      <span
                        className={`about-sidebar__chevron${isOpen ? " is-open" : ""}`}
                        aria-hidden="true"
                      >
                        ▸
                      </span>
                      <span className="sr-only">{project.title} 챕터 목록</span>
                    </button>
                  ) : (
                    <span className="about-sidebar__toggle about-sidebar__toggle--static" aria-hidden="true">
                      <span className="about-sidebar__chevron">▸</span>
                    </span>
                  )}
                  {hasIndex ? (
                    <Link
                      className="about-sidebar__link"
                      href={`/projects/${project.slug}`}
                      aria-current={isActive && !activeChapter ? "page" : undefined}
                      onClick={() => setOpenSlug(project.slug)}
                    >
                      <span className="about-sidebar__title">{project.title}</span>
                    </Link>
                  ) : canToggle ? (
                    <button
                      type="button"
                      className="about-sidebar__title-button"
                      aria-expanded={isOpen}
                      aria-controls={chaptersId}
                      onClick={() => toggleProject(project.slug!)}
                    >
                      <span className="about-sidebar__title">{project.title}</span>
                    </button>
                  ) : (
                    <span className="about-sidebar__title">{project.title}</span>
                  )}
                </div>

                {canToggle ? (
                  <div
                    id={chaptersId}
                    className={`about-sidebar__chapters${isOpen ? " is-open" : ""}`}
                    aria-hidden={!isOpen}
                  >
                    <ul className="about-sidebar__chapters-inner">
                      {chapters.map((chapter) => {
                        const external = Boolean(chapter.externalUrl)
                        const href =
                          chapter.externalUrl ||
                          `/projects/${project.slug}/${chapter.slug}`

                        return (
                          <li key={chapter._key}>
                            <Link
                              className="about-sidebar__chapter"
                              href={href}
                              target={external ? "_blank" : undefined}
                              rel={external ? "noreferrer" : undefined}
                              tabIndex={isOpen ? undefined : -1}
                              aria-current={
                                !external &&
                                isActive &&
                                activeChapter === chapter.slug
                                  ? "page"
                                  : undefined
                              }
                              onClick={() => setOpenSlug(project.slug)}
                            >
                              {chapter.title}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
