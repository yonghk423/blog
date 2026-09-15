import {SolariBoard} from "@/components/solari-board"
import {site, studies, studiesByYear} from "@/lib/site"

export default function HomePage() {
  const groups = studiesByYear(studies)

  return (
    <main>
      <section className="studies-head">
        <div className="studies-head__contents site-grid">
          <div className="solari-hero">
            <SolariBoard count={studies.length} titles={studies.map((study) => study.title)} />
          </div>
          <div className="studies-head__read">
            <p className="studies-head__read-text">
              <span className="rise-clip">
                <span className="rise" style={{animationDelay: "280ms"}}>
                  수년간 쌓아 온 아이디어와 실험.
                </span>
              </span>{" "}
              <span className="rise-clip">
                <span className="rise" style={{animationDelay: "340ms"}}>
                  작업의 생각과 스타일이 여기에 있습니다.
                </span>
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="studies-lists">
        <div className="studies-lists__head site-grid">
          <p data-item="1">
            <span className="rise" style={{animationDelay: "200ms"}}>
              id
            </span>
          </p>
          <p data-item="2">
            <span className="rise" style={{animationDelay: "240ms"}}>
              title
            </span>
          </p>
          <p data-item="3">
            <span className="rise" style={{animationDelay: "280ms"}}>
              field
            </span>
          </p>
        </div>

        <div className="studies-lists__contents">
          {groups.map((group) => (
            <ul key={group.year} className="studies-lists__group">
              <li className="studies-lists__year">
                <span className="rise-clip">
                  <span className="rise" style={{animationDelay: "320ms"}}>
                    {group.year} ({group.items.length})
                  </span>
                </span>
              </li>
              <li className="studies-lists__items">
                {group.items.map((study) => {
                  const inner = (
                    <>
                      <p className="id">
                        <span>{study.id}</span>
                      </p>
                      <p className="title">
                        <span className="title-inner">{study.title}</span>
                      </p>
                      <p className="field">
                        <span>{study.field}</span>
                      </p>
                      <span className="line" />
                    </>
                  )

                  return study.href ? (
                    <a key={study.id} href={study.href} className="list-link" target="_blank" rel="noreferrer">
                      {inner}
                    </a>
                  ) : (
                    <div key={study.id} className="list-link">
                      {inner}
                    </div>
                  )
                })}
              </li>
            </ul>
          ))}
        </div>
      </section>

      <section className="studies-block" id="about">
        <p>
          이곳에 올린 작업은 개인 프로젝트입니다. 디자인부터 구현까지 맡습니다.
        </p>
        <p>
          <small>© {site.name}</small>
        </p>
      </section>
    </main>
  )
}
