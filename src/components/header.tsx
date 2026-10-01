"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {useEffect, useId, useState} from "react"
import {site} from "@/lib/site"
import {MailButton} from "./mail-button"
import {ThemeToggle} from "./theme-toggle"

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <header className={`header${open ? " is-open" : ""}`}>
      <div className="header__inner site-grid">
        <button
          type="button"
          className="header__menu-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="header__burger" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav className="header__nav header__desktop" aria-label="주요 메뉴">
          <ul className="header__list">
            <li>
              <Link href="/" className="hover-line" aria-current={pathname === "/" ? "page" : undefined}>
                <span>Studies</span>
              </Link>
            </li>
          </ul>
        </nav>

        <Link
          href="/about"
          className="header__about header__desktop hover-line"
          aria-current={pathname === "/about" ? "page" : undefined}
        >
          <span>About</span>
          <span className="arrow">→</span>
        </Link>

        <div className="header__actions header__desktop">
          <ThemeToggle />
          <MailButton email={site.email} />
        </div>
      </div>

      <div
        id={menuId}
        className={`header__panel${open ? " is-open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <nav aria-label="모바일 메뉴">
          <ul className="header__panel-list">
            <li>
              <Link
                href="/"
                className="header__panel-link hover-line"
                aria-current={pathname === "/" ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>Studies</span>
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="header__panel-link hover-line"
                aria-current={pathname === "/about" ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span>About</span>
                <span className="arrow">→</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="header__panel-actions">
          <ThemeToggle />
          <MailButton email={site.email} />
        </div>
      </div>

      {open ? (
        <button
          type="button"
          className="header__backdrop"
          aria-label="메뉴 닫기"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </header>
  )
}
