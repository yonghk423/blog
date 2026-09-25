import type {Metadata} from "next"
import Link from "next/link"
import {notFound} from "next/navigation"
import {defineQuery, type PortableTextBlock} from "next-sanity"
import {JsonLd} from "@/components/json-ld"
import {PortableBody} from "@/components/portable-body"
import {absoluteUrl, pageMetadata, truncateDescription} from "@/lib/seo"
import {formatStudyDate, site} from "@/lib/site"
import {sanityFetch} from "@/sanity/lib/live"

const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  title,
  field,
  publishedAt,
  body,
  "plainText": pt::text(body),
  "slug": slug.current
}`)

type StudyPost = {
  title: string | null
  field: string | null
  publishedAt: string | null
  body: PortableTextBlock[] | null
  plainText: string | null
  slug: string | null
}

type Props = {
  params: Promise<{slug: string}>
}

function studyDescription(post: StudyPost | null) {
  if (!post?.title) return undefined
  return (
    truncateDescription(post.plainText) ||
    `${post.title}${post.field ? ` · ${post.field}` : ""}`
  )
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: POST_QUERY,
    params: {slug},
    stega: false,
  })
  const post = data as StudyPost | null

  return pageMetadata({
    title: post?.title || "Study",
    description: studyDescription(post),
    path: `/studies/${slug}`,
    type: "article",
    publishedTime: post?.publishedAt,
  })
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
  const description = studyDescription(post) || site.description
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    datePublished: post.publishedAt || undefined,
    inLanguage: "ko-KR",
    mainEntityOfPage: absoluteUrl(`/studies/${slug}`),
    author: {
      "@type": "Person",
      name: site.name,
      url: absoluteUrl("/about"),
    },
    publisher: {
      "@type": "Person",
      name: site.name,
      url: site.siteUrl,
    },
    about: post.field || undefined,
  }

  return (
    <main className="about">
      <JsonLd data={articleJsonLd} />
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
          {post.body?.length ? (
            <div className="project-page__body">
              <PortableBody value={post.body} />
            </div>
          ) : null}
        </article>
      </div>
    </main>
  )
}
