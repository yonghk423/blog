import type {Metadata} from "next"
import {about, projects} from "@/lib/site"

export const metadata: Metadata = {
  title: "About",
}

export default function AboutPage() {
  return (
    <main className="about">
      <section className="about-intro">
        {about.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="about-projects">
        <h1>Project</h1>
        {projects.length === 0 ? (
          <p className="about-projects__empty">아직 올린 프로젝트가 없습니다.</p>
        ) : (
          <ul className="about-projects__list">
            {projects.map((project) => (
              <li key={project.title} className="about-projects__item">
                {project.href ? (
                  <a href={project.href} target="_blank" rel="noreferrer">
                    <span className="about-projects__title">{project.title}</span>
                  </a>
                ) : (
                  <span className="about-projects__title">{project.title}</span>
                )}
                {project.period ? <span className="about-projects__period">{project.period}</span> : null}
                {project.role ? <span className="about-projects__role">{project.role}</span> : null}
                <p>{project.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
