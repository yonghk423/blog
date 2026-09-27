/** Projects whose title is a label only; chapters are the entry points. */
const PROJECTS_WITHOUT_INDEX = new Set([
  "worklist",
  "viewer",
  "pokit",
  "pokitstory",
])

export function projectHasIndexPage(slug: string | null | undefined) {
  if (!slug) return false
  return !PROJECTS_WITHOUT_INDEX.has(slug)
}
