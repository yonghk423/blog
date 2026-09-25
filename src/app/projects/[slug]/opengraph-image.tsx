import {createOgImage, ogContentType, ogSize} from "@/lib/og"
import {client} from "@/sanity/lib/client"

export const alt = "Project"
export const size = ogSize
export const contentType = ogContentType

type Props = {
  params: Promise<{slug: string}>
}

export default async function Image({params}: Props) {
  const {slug} = await params
  const project = await client.fetch<{
    title: string | null
    summary: string | null
    seoTitle: string | null
  } | null>(
    `*[_type == "project" && slug.current == $slug][0]{
      title,
      summary,
      "seoTitle": seo.title
    }`,
    {slug},
  )

  return createOgImage({
    eyebrow: "PROJECT",
    title: project?.seoTitle || project?.title || "Project",
    description: project?.summary || undefined,
  })
}
