import {formatFields} from "@/lib/fields"
import {createOgImage, ogContentType, ogSize} from "@/lib/og"
import {client} from "@/sanity/lib/client"

export const alt = "Study"
export const size = ogSize
export const contentType = ogContentType

type Props = {
  params: Promise<{slug: string}>
}

export default async function Image({params}: Props) {
  const {slug} = await params
  const post = await client.fetch<{
    title: string | null
    field: string | string[] | null
    seoTitle: string | null
  } | null>(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      field,
      "seoTitle": seo.title
    }`,
    {slug},
  )

  return createOgImage({
    eyebrow: "STUDY",
    title: post?.seoTitle || post?.title || "Study",
    description: formatFields(post?.field) || undefined,
  })
}
