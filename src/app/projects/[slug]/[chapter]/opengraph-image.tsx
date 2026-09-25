import {createOgImage, ogContentType, ogSize} from "@/lib/og"
import {client} from "@/sanity/lib/client"

export const alt = "Project chapter"
export const size = ogSize
export const contentType = ogContentType

type Props = {
  params: Promise<{slug: string; chapter: string}>
}

export default async function Image({params}: Props) {
  const {slug, chapter} = await params
  const data = await client.fetch<{
    title: string | null
    chapterTitle: string | null
    seoTitle: string | null
  } | null>(
    `*[_type == "project" && slug.current == $slug][0]{
      title,
      "chapterTitle": chapters[slug.current == $chapter][0].title,
      "seoTitle": chapters[slug.current == $chapter][0].seo.title
    }`,
    {slug, chapter},
  )

  return createOgImage({
    eyebrow: "PROJECT",
    title: data?.seoTitle || data?.chapterTitle || "Chapter",
    description: data?.title || undefined,
  })
}
