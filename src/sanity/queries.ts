import {defineQuery} from "next-sanity"

export const STUDIES_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  "id": studyId,
  title,
  field,
  publishedAt,
  "href": select(
    defined(externalUrl) => externalUrl,
    defined(slug.current) => "/studies/" + slug.current,
    null
  ),
  "slug": slug.current
}`)

export const PROJECTS_NAV_QUERY = defineQuery(`*[_type == "project" && defined(slug.current)] | order(order asc) {
  _id,
  title,
  "slug": slug.current
}`)

export const PROJECT_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  summary,
  tech,
  body,
  "slug": slug.current
}`)

export const ABOUT_QUERY = defineQuery(`*[_type == "about" && _id == "about"][0]{
  name,
  role,
  bio,
  phone,
  email,
  github,
  profileImage{
    _type,
    alt,
    hotspot,
    crop,
    asset->{
      _id,
      _type,
      url,
      metadata{
        lqip,
        dimensions
      }
    }
  },
  careers[]{
    _key,
    company,
    role,
    period,
    summary
  },
  workProjects[]{
    _key,
    title,
    summary,
    tech,
    highlights[]{
      _key,
      title,
      items
    }
  }
}`)
