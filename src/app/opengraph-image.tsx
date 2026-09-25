import {createOgImage, ogContentType, ogSize} from "@/lib/og"
import {site} from "@/lib/site"

export const alt = site.title
export const size = ogSize
export const contentType = ogContentType

export default function OpenGraphImage() {
  return createOgImage({
    title: site.name,
    description: site.description,
  })
}
