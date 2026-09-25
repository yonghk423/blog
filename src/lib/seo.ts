import type {Metadata} from "next"
import {site} from "@/lib/site"

export function absoluteUrl(path = "/") {
  return new URL(path, site.siteUrl).toString()
}

export function truncateDescription(text: string | null | undefined, max = 160) {
  if (!text) return undefined
  const normalized = text.replace(/\s+/g, " ").trim()
  if (!normalized) return undefined
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1).trimEnd()}…`
}

type PageSeoInput = {
  title: string
  description?: string
  path: string
  type?: "website" | "article"
  publishedTime?: string | null
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
}: PageSeoInput): Metadata {
  const desc = truncateDescription(description) || site.description
  const url = path

  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: site.name,
      locale: "ko_KR",
      type,
      ...(type === "article" && publishedTime
        ? {publishedTime}
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
  }
}
