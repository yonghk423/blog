"use client"

import Link from "next/link"
import {useState} from "react"
import {SolariLine} from "@/components/solari-board"
import type {Study} from "@/lib/site"

type Group = {
  year: number
  items: Study[]
}

function StudyRow({study, year}: {study: Study; year?: string}) {
  const [hover, setHover] = useState(false)

  const inner = (
    <>
      <p className="year">
        <span>{year}</span>
      </p>
      <p className="title">
        {hover ? (
          <SolariLine text={study.title} className="solari-line--list" stagger={48} tickMs={92} flipMs={130} gapSpaces />
        ) : (
          <span className="title-inner">{study.title}</span>
        )}
      </p>
      <p className="field">
        <span>{study.field}</span>
      </p>
    </>
  )

  const events = {
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => setHover(false),
  }

  if (study.href) {
    const isExternal = /^https?:\/\//.test(study.href)

    if (isExternal) {
      return (
        <a href={study.href} className="list-link" target="_blank" rel="noreferrer" {...events}>
          {inner}
        </a>
      )
    }

    return (
      <Link href={study.href} className="list-link" {...events}>
        {inner}
      </Link>
    )
  }

  return (
    <div className="list-link" {...events}>
      {inner}
    </div>
  )
}

export function StudiesList({groups}: {groups: Group[]}) {
  return (
    <section className="studies-lists">
      <div className="studies-lists__head">
        <p className="year" />
        <p className="title">
          <span className="rise" style={{animationDelay: "200ms"}}>
            title
          </span>
        </p>
        <p className="field">
          <span className="rise" style={{animationDelay: "240ms"}}>
            field
          </span>
        </p>
      </div>

      <div className="studies-lists__contents">
        {groups.map((group) => (
          <div key={group.year} className="studies-lists__group">
            {group.items.map((study, index) => (
              <StudyRow
                key={study.href || `${study.year}-${study.title}`}
                study={study}
                year={index === 0 ? `${group.year} (${group.items.length})` : undefined}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
