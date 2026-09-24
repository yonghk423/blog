"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {THEME_STORAGE_KEY} from "@/lib/theme"

export type Theme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "light" || stored === "dark") return stored
  } catch {
    // ignore
  }
  return null
}

function persistTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // ignore
  }
}

function commitTheme(next: Theme, setThemeState: (theme: Theme) => void) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const startViewTransition = document.startViewTransition?.bind(document)

  const update = () => {
    applyTheme(next)
    setThemeState(next)
    persistTheme(next)
  }

  if (!reduceMotion && startViewTransition) {
    startViewTransition(update)
    return
  }

  update()
}

export function ThemeProvider({children}: {children: ReactNode}) {
  const [theme, setThemeState] = useState<Theme>("light")

  useEffect(() => {
    const stored = readStoredTheme()
    const initial = stored ?? getSystemTheme()
    setThemeState(initial)
    applyTheme(initial)
    // Enable transitions only after the first paint so reload doesn't animate.
    const frame = requestAnimationFrame(() => {
      document.documentElement.classList.add("theme-animated")
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")

    function onSystemChange(event: MediaQueryListEvent) {
      if (readStoredTheme()) return
      commitTheme(event.matches ? "dark" : "light", setThemeState)
    }

    media.addEventListener("change", onSystemChange)
    return () => media.removeEventListener("change", onSystemChange)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    commitTheme(next, setThemeState)
  }, [])

  const toggleTheme = useCallback(() => {
    commitTheme(theme === "dark" ? "light" : "dark", setThemeState)
  }, [theme])

  return (
    <ThemeContext.Provider value={{theme, setTheme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
