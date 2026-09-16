import {SolariBoard} from "@/components/solari-board"
import {StudiesList} from "@/components/studies-list"
import {studies as fallbackStudies, studiesByYear} from "@/lib/site"
import {toStudies, type SanityStudy} from "@/sanity/lib/studies"
import {sanityFetch} from "@/sanity/lib/live"
import {STUDIES_QUERY} from "@/sanity/queries"

export default async function HomePage() {
  const {data} = await sanityFetch({query: STUDIES_QUERY})
  const studies = toStudies((data as SanityStudy[] | null) ?? [])
  const groups = studiesByYear(studies.length ? studies : fallbackStudies)

  return (
    <main>
      <section className="studies-head">
        <div className="studies-head__contents site-grid">
          <div className="solari-hero">
            <SolariBoard />
          </div>
        </div>
      </section>

      <StudiesList groups={groups} />
    </main>
  )
}
