import {site} from "@/lib/site"

type Spot = {
  text: string
  href?: string
  delayMs: number
  spot: string
}

const SPOTS: Spot[] = [
  {text: "skills", delayMs: 120, spot: "skills"},
  {text: "React", delayMs: 200, spot: "react"},
  {text: "TypeScript", delayMs: 270, spot: "ts"},
  {text: "Next.js", delayMs: 340, spot: "next"},
  {text: "React Native", delayMs: 410, spot: "rn"},
  {text: "Zustand", delayMs: 480, spot: "zustand"},
  {text: "React Query", delayMs: 550, spot: "query"},
  {text: "contact", delayMs: 640, spot: "contact"},
  {text: "GitHub", href: site.github, delayMs: 720, spot: "github"},
  {text: "Email", href: `mailto:${site.email}`, delayMs: 790, spot: "email"},
]

function RiseWord({text, delayMs}: {text: string; delayMs: number}) {
  return (
    <span className="char-cover">
      <span className="char" style={{animationDelay: `${delayMs}ms`}}>
        {text}
      </span>
    </span>
  )
}

export function StudiesHeadLettering() {
  return (
    <aside className="studies-head__aside" aria-label="Skills and contact">
      {SPOTS.map((item) => {
        const className = `studies-head__spot studies-head__spot--${item.spot}`
        const content = (
          <>
            <RiseWord text={item.text} delayMs={item.delayMs} />
            {item.href ? (
              <span className="studies-head__spot-arrow" aria-hidden="true">
                <RiseWord text="→" delayMs={item.delayMs + 40} />
              </span>
            ) : null}
          </>
        )

        if (item.href) {
          const external = item.href.startsWith("http")
          return (
            <a
              key={item.spot}
              className={`${className} studies-head__spot-link`}
              href={item.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
            >
              {content}
            </a>
          )
        }

        return (
          <p key={item.spot} className={className}>
            {content}
          </p>
        )
      })}
    </aside>
  )
}
