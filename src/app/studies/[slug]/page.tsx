import {notFound} from "next/navigation"
import {PortableText} from "next-sanity"
import {defineQuery} from "next-sanity"
import {sanityFetch} from "@/sanity/lib/live"

const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  title,
  studyId,
  field,
  publishedAt,
  excerpt,
  body,
  "slug": slug.current
}`)

type Props = {
  params: Promise<{slug: string}>
}

export default async function StudyPage({params}: Props) {
  const {slug} = await params
  const {data: post} = await sanityFetch({
    query: POST_QUERY,
    params: {slug},
  })

  if (!post) notFound()

  return (
    <main className="about">
      <section className="about-intro">
        <p>
          {post.studyId} · {post.field}
        </p>
        <p style={{fontSize: "20px", marginTop: "12px"}}>{post.title}</p>
        {post.excerpt ? <p style={{marginTop: "16px", opacity: 0.75}}>{post.excerpt}</p> : null}
        {post.body ? (
          <div style={{marginTop: "32px", maxWidth: "40rem"}}>
            <PortableText value={post.body} />
          </div>
        ) : null}
      </section>
    </main>
  )
}
