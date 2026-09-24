"use client"

import {useEffect, useState} from "react"
import {useTheme} from "./theme-provider"

export function ThemeToggle() {
  const {theme, toggleTheme} = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = theme === "dark"
  const label = !mounted ? "Theme" : isDark ? "Light" : "Dark"

  return (
    <button
      type="button"
      className="header__theme hover-line"
      onClick={toggleTheme}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={label}
    >
      <span>{label}</span>
    </button>
  )
}
