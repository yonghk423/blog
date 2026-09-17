import type {Metadata} from "next"
import Link from "next/link"
import {SanityImage} from "@/components/sanity-image"
import {about as aboutFallback, site} from "@/lib/site"
import {sanityFetch} from "@/sanity/lib/live"
import {ABOUT_QUERY, PROJECTS_NAV_QUERY} from "@/sanity/queries"

export const metadata: Metadata = {
  title: "About",
}

type AboutHighlight = {
  _key: string
  title: string | null
  items: string[] | null
}

type AboutWorkProject = {
  _key: string
  title: string | null
  summary: string | null
  tech: string[] | null
  highlights: AboutHighlight[] | null
}

type AboutCareer = {
  _key: string
  company: string | null
  role: string | null
  period: string | null
  summary: string | null
}

type ProjectNavItem = {
  _id: string
  title: string | null
  slug: string | null
}

type AboutData = {
  name: string | null
  role: string | null
  bio: string | null
  phone: string | null
  email: string | null
  github: string | null
  profileImage: {
    alt?: string | null
    asset?: {_ref?: string; _id?: string} | null
  } | null
  careers: AboutCareer[] | null
  workProjects: AboutWorkProject[] | null
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }
  return phone
}

export default async function AboutPage() {
  const [{data}, {data: nav}] = await Promise.all([
    sanityFetch({query: ABOUT_QUERY}),
    sanityFetch({query: PROJECTS_NAV_QUERY}),
  ])
  const about = data as AboutData | null
  const name = about?.name || aboutFallback.name
  const role = about?.role || "프론트엔드 개발자"
  const bio =
    about?.bio ||
    aboutFallback.intro.join(" ")
  const phone = about?.phone || null
  const email = about?.email || site.email
  const github = about?.github || site.github
  const careers = about?.careers?.filter((item) => item.company) ?? []
  const workProjects = about?.workProjects?.filter((item) => item.title) ?? []
  const projects = (nav as ProjectNavItem[] | null)?.filter((item) => item.slug && item.title) ?? []

  return (
    <main className="about">
      {projects.length > 0 ? (
        <aside className="about-sidebar">
          <p className="about-sidebar__label">Project</p>
          <nav aria-label="프로젝트 목록">
            <ul className="about-sidebar__list">
              {projects.map((project) => (
                <li key={project._id}>
                  <Link className="about-sidebar__link" href={`/projects/${project.slug}`}>
                    <span className="about-sidebar__title">{project.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      ) : null}

      <div className="about-content">
        <section className="about-intro">
          <div className="about-intro__body">
            <h1 className="about-intro__name">
              {name} <span className="about-intro__role">{role}</span>
            </h1>
            <div className="about-intro__copy">
              <p>{bio}</p>
            </div>
            {(phone || email || github) && (
              <ul className="about-intro__contacts">
                {phone ? (
                  <li>
                    <a href={`tel:${phone.replace(/\D/g, "")}`}>
                      <span className="about-intro__contact-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M6.6 10.8c1.4 2.7 3.9 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2Z" />
                        </svg>
                      </span>
                      {formatPhone(phone)}
                    </a>
                  </li>
                ) : null}
                {email ? (
                  <li>
                    <a href={`mailto:${email}`}>
                      <span className="about-intro__contact-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="m4 7 8 6 8-6" />
                        </svg>
                      </span>
                      {email}
                    </a>
                  </li>
                ) : null}
                {github ? (
                  <li>
                    <a href={github} target="_blank" rel="noreferrer">
                      <span className="about-intro__contact-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.8c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
                        </svg>
                      </span>
                      {github.replace(/^https?:\/\//, "")}
                    </a>
                  </li>
                ) : null}
              </ul>
            )}
          </div>

          {about?.profileImage ? (
            <div className="about-intro__media">
              <SanityImage
                value={about.profileImage}
                width={1100}
                height={1541}
                className="about-intro__photo"
                priority
                sizes="(max-width: 767px) 100vw, 340px"
              />
            </div>
          ) : null}
        </section>

        {careers.length > 0 ? (
          <section className="about-section">
            <h2 className="about-section__label">경력 사항</h2>
            <ul className="about-career__list">
              {careers.map((career) => (
                <li key={career._key} className="about-career__item">
                  <h3 className="about-career__company">
                    {career.company}
                    {career.role ? <span> | {career.role}</span> : null}
                  </h3>
                  {career.period ? <p className="about-career__meta">근무 기간: {career.period}</p> : null}
                  {career.summary ? <p className="about-career__summary">주요 업무: {career.summary}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {workProjects.map((project) => (
          <section key={project._key} id={project._key} className="about-section about-work">
            <h2 className="about-work__title">{project.title}</h2>
            {project.summary ? <p className="about-work__summary">{project.summary}</p> : null}
            {project.tech?.length ? (
              <p className="about-work__tech">주요 기술: {project.tech.join(", ")}</p>
            ) : null}
            {project.highlights?.length ? (
              <ul className="about-work__highlights">
                {project.highlights.map((highlight) => (
                  <li key={highlight._key} className="about-work__highlight">
                    <h3>{highlight.title}</h3>
                    {highlight.items?.length ? (
                      <ul>
                        {highlight.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  )
}
