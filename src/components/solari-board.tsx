"use client"

import {useEffect, useState, type CSSProperties} from "react"

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()-."
const HANGUL_FLIPS = "가나다라마바사아자차카타파하"
const HANGUL = /[\uAC00-\uD7A3\u1100-\u11FF\u3131-\u318E]/
const LINES = ["HELLO", "THIS IS THE BLOG OF", "FRONTEND DEVELOPER", "YONGHEE KIM"]
const TICK_MS = 28
const STAGGER_MS = 18
const LINE_STAGGER_MS = 90
const HOLD_MS = 2000

function charsetFor(target: string) {
  if (CHARS.includes(target)) return CHARS
  if (HANGUL.test(target)) {
    return HANGUL_FLIPS.includes(target) ? ` ${HANGUL_FLIPS}` : ` ${HANGUL_FLIPS}${target}`
  }
  return ` ${target}`
}

function nextChar(current: string, target: string) {
  if (current === target) return current
  const charset = charsetFor(target)
  const from = charset.includes(current) ? current : charset[0] ?? " "
  const index = charset.indexOf(from)
  return charset[(index + 1) % charset.length]
}

function stepsFromSpace(letter: string) {
  return charsetFor(letter).indexOf(letter)
}

function toSolariLetter(letter: string) {
  const upper = letter.toUpperCase()
  return CHARS.includes(upper) ? upper : letter
}

function boardDuration() {
  return Math.max(
    ...LINES.flatMap((line, lineIndex) =>
      line.split("").map((letter, index) => lineIndex * LINE_STAGGER_MS + index * STAGGER_MS + stepsFromSpace(letter) * TICK_MS),
    ),
  )
}

function SolariCell({
  target,
  delay,
  cycle,
  tickMs = TICK_MS,
  flipMs = 70,
}: {
  target: string
  delay: number
  cycle: number
  tickMs?: number
  flipMs?: number
}) {
  const goal = target
  const [char, setChar] = useState(" ")
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setChar(goal)
      return
    }

    setChar(" ")
    setFlipping(false)
    let current = " "
    const timers: number[] = []

    const start = window.setTimeout(function tick() {
      if (current === goal) return
      current = nextChar(current, goal)
      setFlipping(true)
      setChar(current)
      timers.push(window.setTimeout(() => setFlipping(false), flipMs))
      if (current !== goal) timers.push(window.setTimeout(tick, tickMs))
    }, delay)
    timers.push(start)

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [goal, delay, cycle, tickMs, flipMs])

  return (
    <span
      className={`solari-cell${flipping ? " is-flipping" : ""}${HANGUL.test(goal) ? " solari-cell--kr" : ""}`}
      aria-hidden="true"
      style={{"--solari-flip-ms": `${flipMs}ms`} as CSSProperties}
    >
      <span className="solari-cell__top">
        <span>{char}</span>
      </span>
      <span className="solari-cell__bottom">
        <span>{char}</span>
      </span>
    </span>
  )
}

export function SolariLine({
  text,
  cycle = 0,
  stagger = STAGGER_MS,
  delayOffset = 0,
  tickMs,
  flipMs,
  gapSpaces = false,
  className,
}: {
  text: string
  cycle?: number
  stagger?: number
  delayOffset?: number
  tickMs?: number
  flipMs?: number
  gapSpaces?: boolean
  className?: string
}) {
  const letters = Array.from(text, toSolariLetter)

  return (
    <span className={className ? `solari-line ${className}` : "solari-line"}>
      {letters.map((letter, index) =>
        gapSpaces && letter === " " ? (
          <span key={`${index}-space`} className="solari-space" aria-hidden="true" />
        ) : (
          <SolariCell
            key={`${index}-${letter}`}
            target={letter}
            delay={delayOffset + index * stagger}
            cycle={cycle}
            tickMs={tickMs}
            flipMs={flipMs}
          />
        ),
      )}
    </span>
  )
}

export function SolariBoard() {
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const timer = window.setInterval(() => {
      setCycle((value) => value + 1)
    }, boardDuration() + HOLD_MS)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="solari-board" aria-label="Hello, this is the blog of frontend developer Yonghee Kim.">
      {LINES.map((line, index) => (
        <SolariLine key={line} text={line} cycle={cycle} delayOffset={index * LINE_STAGGER_MS} />
      ))}
    </div>
  )
}
