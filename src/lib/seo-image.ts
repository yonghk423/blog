import type {SanityImageSource} from "@sanity/image-url"
import {urlFor} from "@/sanity/lib/image"

export function seoImageUrl(image: SanityImageSource | null | undefined) {
  if (!image) return null
  try {
    return urlFor(image).width(1200).height(630).fit("crop").url()
  } catch {
    return null
  }
}
