import {SolariBoard} from "@/components/solari-board"
import {StudiesList} from "@/components/studies-list"
import {studies, studiesByYear} from "@/lib/site"

export default function HomePage() {
  const groups = studiesByYear(studies)

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
