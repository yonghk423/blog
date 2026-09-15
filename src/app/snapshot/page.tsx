import type {Metadata} from "next"

export const metadata: Metadata = {
  title: "Snapshot",
}

export default function SnapshotPage() {
  return (
    <main>
      <section className="snapshot-head">
        <p>
          <span className="rise">(0)</span>
        </p>
      </section>
      <p className="snapshot-empty">아직 올린 스냅샷이 없습니다.</p>
    </main>
  )
}
