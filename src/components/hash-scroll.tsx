"use client"

import {useEffect} from "react"

export function HashScroll() {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, "")
      if (!id) return
      document.getElementById(id)?.scrollIntoView({behavior: "smooth", block: "start"})
    }

    scrollToHash()
    window.addEventListener("hashchange", scrollToHash)
    return () => window.removeEventListener("hashchange", scrollToHash)
  }, [])

  return null
}
