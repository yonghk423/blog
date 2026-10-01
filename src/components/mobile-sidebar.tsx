"use client"

import {useEffect, useId, useState, type ReactNode} from "react"
import {usePathname} from "next/navigation"

type MobileSidebarProps = {
  label: string
  children: ReactNode
}

function useIsMobile(query = "(max-width: 767px)") {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [query])

  return isMobile
}

export function MobileSidebar({label, children}: MobileSidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const isMobile = useIsMobile()
  const drawerClosed = isMobile && !open

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open || !isMobile) return

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
  }, [open, isMobile])

  return (
    <div className={`mobile-sidebar${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="mobile-sidebar__toggle hover-line"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${label} 목차`}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{label}</span>
        <span className="mobile-sidebar__toggle-arrow" aria-hidden="true">
          →
        </span>
      </button>

      <div
        id={panelId}
        className={`mobile-sidebar__panel${open ? " is-open" : ""}`}
        aria-hidden={drawerClosed || undefined}
        inert={drawerClosed}
        onClick={(event) => {
          if (!isMobile) return
          const target = event.target as HTMLElement
          if (target.closest("a")) setOpen(false)
        }}
      >
        <div className="mobile-sidebar__drawer-head">
          <p className="mobile-sidebar__drawer-label">{label}</p>
          <button
            type="button"
            className="mobile-sidebar__close hover-line"
            aria-label="사이드바 닫기"
            onClick={() => setOpen(false)}
          >
            <span>Close</span>
          </button>
        </div>
        {children}
      </div>

      {open && isMobile ? (
        <button
          type="button"
          className="mobile-sidebar__backdrop"
          aria-label="사이드바 닫기"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </div>
  )
}
