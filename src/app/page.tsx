import { SolariBoard } from "@/components/solari-board"
import { StudiesHeadLettering } from "@/components/studies-head-lettering"
import { StudiesList } from "@/components/studies-list"
import { studies as fallbackStudies, studiesByYear } from "@/lib/site"
import { mergeStudies, type SanityStudiesPayload } from "@/sanity/lib/studies"
import { sanityFetch } from "@/sanity/lib/fetch"
import { STUDIES_QUERY } from "@/sanity/queries"

export default async function HomePage() {
  const { data } = await sanityFetch({ query: STUDIES_QUERY })
  const studies = mergeStudies(data as SanityStudiesPayload | null)
  const groups = studiesByYear(studies.length ? studies : fallbackStudies)

  return (
    <main>
      <section className="studies-head">
        <div className="studies-head__contents site-grid">
          <div className="solari-hero">
            <SolariBoard />
          </div>
          <StudiesHeadLettering />
        </div>
      </section>

      <StudiesList groups={groups} />
    </main>
  )
}
