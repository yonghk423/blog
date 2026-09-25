import type {MetadataRoute} from "next"
import {projectHasIndexPage} from "@/lib/projects"
import {site} from "@/lib/site"
import {client} from "@/sanity/lib/client"
import {SITEMAP_QUERY} from "@/sanity/queries"

type SitemapData = {
  posts: Array<{slug: string; _updatedAt: string}> | null
  projects: Array<{
    slug: string
    _updatedAt: string
    chapters: Array<{slug: string | null; externalUrl?: string | null}> | null
  }> | null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.siteUrl
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  try {
    const data = await client.fetch<SitemapData>(SITEMAP_QUERY)
    const posts = (data.posts ?? []).map((post) => ({
      url: `${base}/studies/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

    const projects: MetadataRoute.Sitemap = []
    for (const project of data.projects ?? []) {
      if (!project.slug) continue

      if (projectHasIndexPage(project.slug)) {
        projects.push({
          url: `${base}/projects/${project.slug}`,
          lastModified: new Date(project._updatedAt),
          changeFrequency: "monthly",
          priority: 0.6,
        })
      }

      for (const chapter of project.chapters ?? []) {
        if (!chapter.slug || chapter.externalUrl) continue
        projects.push({
          url: `${base}/projects/${project.slug}/${chapter.slug}`,
          lastModified: new Date(project._updatedAt),
          changeFrequency: "monthly",
          priority: 0.6,
        })
      }
    }

    return [...staticRoutes, ...posts, ...projects]
  } catch (error) {
    console.error("Sitemap generation failed:", error)
    return staticRoutes
  }
}
