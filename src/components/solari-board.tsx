"use client"

import {useEffect, useState} from "react"

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()-."

function padLine(value: string, length: number) {
  return value.toUpperCase().slice(0, length).padEnd(length, " ")
}

function nextChar(current: string, target: string) {
  if (current === target) return current
  const from = CHARS.includes(current) ? current : " "
  const index = CHARS.indexOf(from)
  return CHARS[(index + 1) % CHARS.length]
}

function SolariCell({target, delay}: {target: string; delay: number}) {
  const goal = CHARS.includes(target) ? target : " "
  const [char, setChar] = useState(" ")
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setChar(goal)
      return
    }

    let current = char
    let timer = window.setTimeout(function tick() {
      if (current === goal) return
      current = nextChar(current, goal)
      setFlipping(true)
      setChar(current)
      window.setTimeout(() => setFlipping(false), 70)
      if (current !== goal) timer = window.setTimeout(tick, 42)
    }, delay)

    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the target letter changes
  }, [goal, delay])

  return (
    <span className={`solari-cell${flipping ? " is-flipping" : ""}`} aria-hidden="true">
      <span className="solari-cell__top">
        <span>{char}</span>
      </span>
      <span className="solari-cell__bottom">
        <span>{char}</span>
      </span>
    </span>
  )
}

function SolariLine({text, length, stagger = 28}: {text: string; length: number; stagger?: number}) {
  const letters = padLine(text, length).split("")

  return (
    <p className="solari-line">
      {letters.map((letter, index) => (
        <SolariCell key={`${index}-${length}`} target={letter} delay={index * stagger} />
      ))}
    </p>
  )
}

export function SolariBoard({count, titles}: {count: number; titles: string[]}) {
  const [titleIndex, setTitleIndex] = useState(0)
  const current = titles[titleIndex] ?? "STUDIES"

  useEffect(() => {
    if (titles.length < 2) return
    const timer = window.setInterval(() => {
      setTitleIndex((value) => (value + 1) % titles.length)
    }, 3600)
    return () => window.clearInterval(timer)
  }, [titles.length])

  return (
    <div className="solari-board" aria-label={`index of studies, ${count}. current ${current}`}>
      <div className="solari-board__row">
        <SolariLine text="STUDIES" length={7} />
        <SolariLine text={`(${count})`} length={4} stagger={40} />
      </div>
      <SolariLine text={current} length={16} stagger={18} />
    </div>
  )
}
