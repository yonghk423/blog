"use client"

import Link from "next/link"
import {useEffect, useId, useState} from "react"
import {MobileSidebar} from "@/components/mobile-sidebar"
import {formatStudyDate} from "@/lib/site"

export type StudySeriesItem = {
  title: string | null
  slug: string | null
  publishedAt: string | null
}

type StudySidebarProps = {
  seriesTitle: string | null
  seriesHref?: string | null
  seriesRootSlug?: string | null
  items: StudySeriesItem[]
  activeSlug: string
  activePublishedAt?: string | null
}

export function StudySidebar({
  seriesTitle,
  seriesHref = null,
  seriesRootSlug = null,
  items,
  activeSlug,
  activePublishedAt,
}: StudySidebarProps) {
  const series = items.filter((item) => item.slug && item.title)
  const date = activePublishedAt ? formatStudyDate(activePublishedAt) : null
  const hasSeries = Boolean(seriesTitle) && (series.length > 0 || Boolean(seriesHref))
  const chaptersId = useId()
  const [isOpen, setIsOpen] = useState(true)
  const canToggle = series.length > 0

  useEffect(() => {
    setIsOpen(true)
  }, [activeSlug])

  if (!hasSeries || !seriesTitle) {
    return (
      <MobileSidebar label="Study">
        <aside className="about-sidebar">
          <p className="about-sidebar__label">Study</p>
          {date ? <p className="about-sidebar__meta">{date}</p> : null}
        </aside>
      </MobileSidebar>
    )
  }

  return (
    <MobileSidebar label="Study">
      <aside className="about-sidebar">
        <p className="about-sidebar__label">Study</p>
        <nav aria-label={`${seriesTitle} 시리즈`}>
          <ul className="about-sidebar__list">
            <li className="about-sidebar__item">
              <div className="about-sidebar__project">
                {canToggle ? (
                  <button
                    type="button"
                    className="about-sidebar__toggle"
                    aria-expanded={isOpen}
                    aria-controls={chaptersId}
                    onClick={() => setIsOpen((current) => !current)}
                  >
                    <span
                      className={`about-sidebar__chevron${isOpen ? " is-open" : ""}`}
                      aria-hidden="true"
                    >
                      ▸
                    </span>
                    <span className="sr-only">{seriesTitle} 시리즈 목록</span>
                  </button>
                ) : (
                  <span className="about-sidebar__toggle about-sidebar__toggle--static" aria-hidden="true">
                    <span className="about-sidebar__chevron">▸</span>
                  </span>
                )}
                {seriesHref ? (
                  <Link
                    className="about-sidebar__link"
                    href={seriesHref}
                    aria-current={activeSlug === seriesRootSlug ? "page" : undefined}
                    onClick={() => setIsOpen(true)}
                  >
                    <span className="about-sidebar__title">{seriesTitle}</span>
                  </Link>
                ) : canToggle ? (
                  <button
                    type="button"
                    className="about-sidebar__title-button"
                    aria-expanded={isOpen}
                    aria-controls={chaptersId}
                    onClick={() => setIsOpen((current) => !current)}
                  >
                    <span className="about-sidebar__title">{seriesTitle}</span>
                  </button>
                ) : (
                  <span className="about-sidebar__title">{seriesTitle}</span>
                )}
              </div>

              {canToggle ? (
                <div
                  id={chaptersId}
                  className={`about-sidebar__chapters${isOpen ? " is-open" : ""}`}
                  aria-hidden={!isOpen}
                >
                  <ul className="about-sidebar__chapters-inner">
                    {series.map((item) => (
                      <li key={item.slug}>
                        <Link
                          className="about-sidebar__chapter"
                          href={`/studies/${item.slug}`}
                          tabIndex={isOpen ? undefined : -1}
                          aria-current={item.slug === activeSlug ? "page" : undefined}
                          onClick={() => setIsOpen(true)}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </li>
          </ul>
        </nav>
        {date ? <p className="about-sidebar__meta">{date}</p> : null}
      </aside>
    </MobileSidebar>
  )
}
