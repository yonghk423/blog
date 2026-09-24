"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {site} from "@/lib/site"
import {MailButton} from "./mail-button"
import {ThemeToggle} from "./theme-toggle"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="header">
      <div className="header__inner site-grid">
        <nav className="header__nav">
          <ul className="header__list">
            <li>
              <Link href="/" className="hover-line" aria-current={pathname === "/" ? "page" : undefined}>
                <span>Studies</span>
              </Link>
            </li>
          </ul>
        </nav>
        <Link href="/about" className="header__about hover-line" aria-current={pathname === "/about" ? "page" : undefined}>
          <span>About</span>
          <span className="arrow">→</span>
        </Link>
        <div className="header__actions">
          <ThemeToggle />
          <MailButton email={site.email} />
        </div>
      </div>
    </header>
  )
}
