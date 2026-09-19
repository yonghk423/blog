"use client"

import {useEffect} from "react"
import {useRouter} from "next/navigation"

export function ChapterHashRedirect({slug}: {slug: string}) {
  const router = useRouter()

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "")
    if (!id) return
    router.replace(`/projects/${slug}/${id}`)
  }, [router, slug])

  return null
}
