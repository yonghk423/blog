import type {Metadata} from "next"
import {SanityImage} from "@/components/sanity-image"
import {about as aboutFallback, site} from "@/lib/site"
import {sanityFetch} from "@/sanity/lib/live"
import {ABOUT_QUERY} from "@/sanity/queries"

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

type AboutData = {
  name: string | null
  role: string | null
  bio: string | null
  phone: string | null
  email: string | null
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
  const {data} = await sanityFetch({query: ABOUT_QUERY})
  const about = data as AboutData | null
  const name = about?.name || aboutFallback.name
  const role = about?.role || "프론트엔드 개발자"
  const bio =
    about?.bio ||
    aboutFallback.intro.join(" ")
  const phone = about?.phone || null
  const email = about?.email || site.email
  const careers = about?.careers?.filter((item) => item.company) ?? []
  const workProjects = about?.workProjects?.filter((item) => item.title) ?? []

  return (
    <main className="about">
      {workProjects.length > 0 ? (
        <aside className="about-sidebar">
          <p className="about-sidebar__label">Project</p>
          <nav aria-label="프로젝트 목록">
            <ul className="about-sidebar__list">
              {workProjects.map((project) => (
                <li key={project._key}>
                  <a className="about-sidebar__link" href={`#${project._key}`}>
                    <span className="about-sidebar__title">{project.title}</span>
                  </a>
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
            {(phone || email) && (
              <ul className="about-intro__contacts">
                {phone ? (
                  <li>
                    <a href={`tel:${phone.replace(/\D/g, "")}`}>{formatPhone(phone)}</a>
                  </li>
                ) : null}
                {email ? (
                  <li>
                    <a href={`mailto:${email}`}>{email}</a>
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
