"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {site} from "@/lib/site"
import {MailButton} from "./mail-button"

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
            <li>
              <Link
                href="/snapshot"
                className="hover-line"
                aria-current={pathname === "/snapshot" ? "page" : undefined}
              >
                <span>Snapshot</span>
              </Link>
            </li>
          </ul>
        </nav>
        <a href="/#about" className="header__about hover-line">
          <span>About</span>
          <span className="arrow">→</span>
        </a>
        <MailButton email={site.email} />
      </div>
    </header>
  )
}
