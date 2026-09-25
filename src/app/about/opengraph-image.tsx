import {createOgImage, ogContentType, ogSize} from "@/lib/og"
import {site} from "@/lib/site"
import {client} from "@/sanity/lib/client"

export const alt = "About"
export const size = ogSize
export const contentType = ogContentType

export default async function Image() {
  const about = await client.fetch<{
    name: string | null
    role: string | null
  } | null>(`*[_type == "about" && _id == "about"][0]{name, role}`)

  return createOgImage({
    eyebrow: "ABOUT",
    title: about?.name || site.name,
    description: about?.role || site.description,
  })
}
