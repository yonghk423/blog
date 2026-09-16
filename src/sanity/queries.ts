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
