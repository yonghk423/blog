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

export type ResolvedSeo = {
  title: string
  description?: string | null
  imageUrl?: string | null
  noIndex?: boolean
}

type PageSeoInput = {
  title: string
  description?: string | null
  path: string
  type?: "website" | "article"
  publishedTime?: string | null
  imageUrl?: string | null
  noIndex?: boolean
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  imageUrl,
  noIndex = false,
}: PageSeoInput): Metadata {
  const desc = truncateDescription(description) || site.description
  const images = imageUrl
    ? [{url: imageUrl, width: 1200, height: 630}]
    : undefined

  return {
    title,
    description: desc,
    alternates: {
      canonical: path,
    },
    robots: noIndex
      ? {index: false, follow: false}
      : {index: true, follow: true},
    openGraph: {
      title,
      description: desc,
      url: path,
      siteName: site.name,
      locale: "ko_KR",
      type,
      ...(images ? {images} : {}),
      ...(type === "article" && publishedTime ? {publishedTime} : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      ...(imageUrl ? {images: [imageUrl]} : {}),
    },
  }
}
