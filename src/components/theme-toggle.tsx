"use client"

import {useTheme} from "./theme-provider"

export function ThemeToggle() {
  const {theme, toggleTheme} = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      className="header__theme hover-line"
      onClick={toggleTheme}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={isDark ? "Light" : "Dark"}
    >
      <span className="header__theme-label" aria-hidden="true" />
    </button>
  )
}
