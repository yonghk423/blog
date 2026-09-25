import type {Metadata} from "next"
import Link from "next/link"
import {notFound} from "next/navigation"
import type {PortableTextBlock} from "next-sanity"
import {JsonLd} from "@/components/json-ld"
import {PortableBody} from "@/components/portable-body"
import {absoluteUrl, pageMetadata, truncateDescription} from "@/lib/seo"
import {seoImageUrl} from "@/lib/seo-image"
import {formatStudyDate, site} from "@/lib/site"
import {sanityFetch} from "@/sanity/lib/live"
import {POST_QUERY} from "@/sanity/queries"

type StudySeo = {
  title: string
  description: string
  noIndex: boolean
  image: Parameters<typeof seoImageUrl>[0] | null
}

type StudyPost = {
  title: string | null
  field: string | null
  publishedAt: string | null
  body: PortableTextBlock[] | null
  plainText: string | null
  slug: string | null
  seo: StudySeo | null
}

type Props = {
  params: Promise<{slug: string}>
}

function studyDescription(post: StudyPost | null) {
  if (!post) return undefined
  return (
    truncateDescription(post.seo?.description) ||
    truncateDescription(post.plainText) ||
    (post.title ? `${post.title}${post.field ? ` · ${post.field}` : ""}` : undefined)
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
    title: post?.seo?.title || post?.title || "Study",
    description: studyDescription(post),
    path: `/studies/${slug}`,
    type: "article",
    publishedTime: post?.publishedAt,
    imageUrl: seoImageUrl(post?.seo?.image),
    noIndex: post?.seo?.noIndex === true,
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
  const image = seoImageUrl(post.seo?.image)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo?.title || post.title,
    description,
    datePublished: post.publishedAt || undefined,
    inLanguage: "ko-KR",
    mainEntityOfPage: absoluteUrl(`/studies/${slug}`),
    ...(image ? {image} : {}),
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
