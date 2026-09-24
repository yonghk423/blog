import type {QueryParams} from "next-sanity"
import {client} from "./client"

type SanityFetchOptions = {
  query: string
  params?: QueryParams
  /** Seconds. `false` = cache forever until tagged revalidation. Default: 60 */
  revalidate?: number | false
  tags?: string[]
  /** Kept for call-site compatibility; unused without Live/Visual Editing. */
  stega?: boolean
}

/**
 * Cached Sanity fetch for the public site (CDN + Next revalidate).
 * Prefer this over defineLive for published portfolio content.
 */
export async function sanityFetch<T = unknown>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: SanityFetchOptions): Promise<{data: T}> {
  const data = await client.fetch<T>(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  })

  return {data}
}
