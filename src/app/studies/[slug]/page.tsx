import type {Metadata} from "next"
import Link from "next/link"
import {notFound} from "next/navigation"
import {PortableText, type PortableTextBlock} from "next-sanity"
import {defineQuery} from "next-sanity"
import {formatStudyDate} from "@/lib/site"
import {sanityFetch} from "@/sanity/lib/live"

const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  title,
  field,
  publishedAt,
  excerpt,
  body,
  "slug": slug.current
}`)

type StudyPost = {
  title: string | null
  field: string | null
  publishedAt: string | null
  excerpt: string | null
  body: PortableTextBlock[] | null
  slug: string | null
}

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: POST_QUERY,
    params: {slug},
    stega: false,
  })
  const post = data as StudyPost | null

  return {
    title: post?.title || "Study",
  }
}

export default async function StudyPage({params}: Props) {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: POST_QUERY,
    params: {slug},
  })
  const post = data as StudyPost | null

  if (!post?.title) notFound()

  const date = post.publishedAt ? formatStudyDate(post.publishedAt) : null

  return (
    <main className="about">
      <aside className="about-sidebar">
        <p className="about-sidebar__label">Study</p>
        {post.field ? <p className="about-sidebar__title">{post.field}</p> : null}
        {date ? <p className="about-sidebar__meta">{date}</p> : null}
      </aside>

      <div className="about-content">
        <article className="project-page">
          <p className="project-page__back">
            <Link href="/">← Studies</Link>
          </p>
          <h1 className="project-page__title">{post.title}</h1>
          {post.excerpt ? <p className="project-page__summary">{post.excerpt}</p> : null}
          {post.body?.length ? (
            <div className="project-page__body">
              <PortableText value={post.body} />
            </div>
          ) : null}
        </article>
      </div>
    </main>
  )
}
