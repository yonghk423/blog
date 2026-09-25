import type {Metadata} from "next"
import {JsonLd} from "@/components/json-ld"
import {SanityImage} from "@/components/sanity-image"
import {
  ProjectSidebar,
  type ProjectNavItem,
} from "@/components/project-sidebar"
import {pageMetadata, truncateDescription} from "@/lib/seo"
import {seoImageUrl} from "@/lib/seo-image"
import {about as aboutFallback, site} from "@/lib/site"
import {sanityFetch} from "@/sanity/lib/live"
import {ABOUT_QUERY, PROJECTS_NAV_QUERY} from "@/sanity/queries"

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

type AboutSeo = {
  title: string
  description: string
  noIndex: boolean
  image: Parameters<typeof seoImageUrl>[0] | null
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
    asset?: {
      _ref?: string
      _id?: string
      metadata?: {
        lqip?: string | null
        dimensions?: {width?: number; height?: number} | null
      } | null
    } | null
  } | null
  careers: AboutCareer[] | null
  workProjects: AboutWorkProject[] | null
  seo: AboutSeo | null
}

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({
    query: ABOUT_QUERY,
    stega: false,
  })
  const about = data as AboutData | null
  const title = about?.seo?.title || "About"
  const description =
    truncateDescription(about?.seo?.description) ||
    truncateDescription(about?.bio) ||
    site.description

  return pageMetadata({
    title,
    description,
    path: "/about",
    imageUrl: seoImageUrl(about?.seo?.image) || seoImageUrl(about?.profileImage),
    noIndex: about?.seo?.noIndex === true,
  })
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }
  return phone
}

const BIO_HIGHLIGHTS = ["서비스의 확장성", "팀의 생산성"] as const

function renderHighlightedText(text: string) {
  const pattern = new RegExp(`(${BIO_HIGHLIGHTS.map(escapeRegExp).join("|")})`, "g")
  const parts = text.split(pattern)

  return parts.map((part, index) =>
    BIO_HIGHLIGHTS.includes(part as (typeof BIO_HIGHLIGHTS)[number]) ? (
      <mark key={`${part}-${index}`} className="about-intro__mark">
        {part}
        <span className="about-intro__crayon-check" aria-hidden="true">
          <svg viewBox="0 0 28 24" fill="none">
            <path
              className="about-intro__crayon-check-soft"
              d="M3.2 12.6c2.4 2 5.1 5 7.2 7.8C15.2 12.8 20.4 7.4 25.2 3.2"
            />
            <path
              className="about-intro__crayon-check-stroke"
              d="M3.8 12.2c2.1 1.85 4.7 4.6 6.7 7.4C14.9 12.6 19.9 7.5 24.6 3.6"
            />
          </svg>
        </span>
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  )
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
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
    aboutFallback.intro.join("\n\n")
  const phone = about?.phone || null
  const email = about?.email || site.email
  const github = about?.github || site.github
  const careers = about?.careers?.filter((item) => item.company) ?? []
  const workProjects = about?.workProjects?.filter((item) => item.title) ?? []
  const projects =
    (nav as ProjectNavItem[] | null)?.filter((item) => item.slug && item.title) ?? []

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: role,
    description: bio.replace(/\n+/g, " ").trim(),
    url: site.siteUrl,
    email,
    sameAs: [github].filter(Boolean),
    ...(phone ? {telephone: phone} : {}),
  }

  return (
    <main className="about">
      <JsonLd data={personJsonLd} />
      <ProjectSidebar projects={projects} />

      <div className="about-content">
        <section className="about-intro">
          <div className="about-intro__body">
            <div className="about-intro__heading">
              <h1 className="about-intro__name">{name}</h1>
              {role ? (
                <>
                  <span className="about-intro__divider" aria-hidden="true">
                    |
                  </span>
                  <span className="about-intro__role">{role}</span>
                </>
              ) : null}
            </div>
            <div className="about-intro__copy">
              {bio
                .split(/\n\s*\n/)
                .map((paragraph) => paragraph.trim())
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph}>
                    {paragraph.split("\n").map((line, index, lines) => (
                      <span key={`${paragraph}-${index}`}>
                        {renderHighlightedText(line)}
                        {index < lines.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </p>
                ))}
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
                width={900}
                height={1260}
                className="about-intro__photo"
                priority
                sizes="(max-width: 767px) 88vw, 400px"
              />
            </div>
          ) : null}
        </section>

        {careers.length > 0 || workProjects.length > 0 ? (
          <div className="about-resume">
            {careers.map((career) => (
              <header key={career._key} className="about-career">
                <div className="about-career__heading">
                  <h2 className="about-career__company">{career.company}</h2>
                  {career.role ? (
                    <>
                      <span className="about-career__divider" aria-hidden="true">
                        |
                      </span>
                      <span className="about-career__role">{career.role}</span>
                    </>
                  ) : null}
                </div>
                <div className="about-career__meta">
                  {career.period ? (
                    <p>
                      <span className="about-career__label">근무 기간:</span> {career.period}
                    </p>
                  ) : null}
                  {career.summary ? (
                    <p>
                      <span className="about-career__label">주요 업무:</span> {career.summary}
                    </p>
                  ) : null}
                </div>
              </header>
            ))}

            {workProjects.map((project, index) => (
              <div key={project._key}>
                {index > 0 ? <hr className="about-resume__rule" /> : null}
                <article id={project._key} className="about-work">
                  <div className="about-work__header">
                    <h2 className="about-work__title">{project.title}</h2>
                    {project.summary ? (
                      <p className="about-work__summary">{project.summary}</p>
                    ) : null}
                    {project.tech?.length ? (
                      <p className="about-work__tech">
                        <span className="about-work__tech-label">주요 기술:</span>{" "}
                        {project.tech.join(", ")}
                      </p>
                    ) : null}
                  </div>
                  {project.highlights?.map((highlight) => (
                    <section key={highlight._key} className="about-work__highlight">
                      {highlight.title ? (
                        <h3 className="about-work__highlight-title">
                          <span className="pt-heading-mark">{highlight.title}</span>
                        </h3>
                      ) : null}
                      {highlight.items?.length ? (
                        <ul className="about-work__list">
                          {highlight.items.map((item) => (
                            <li key={item} className="about-work__item">
                              <span className="about-work__bullet" aria-hidden="true">
                                •
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  ))}
                </article>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  )
}
