export const site = {
  name: "김용희",
  title: "김용희 - Portfolio",
  description: "portfolio site by Yonghee Kim, based in Seoul.",
  email: "",
}

export type Study = {
  id: string
  title: string
  field: string
  year: number
  href?: string
}

export const studies: Study[] = [
  {id: "S-001", title: "Grove", field: "Next.js", year: 2026},
  {id: "S-002", title: "Split Text Index", field: "CSS", year: 2026},
  {id: "S-003", title: "Cursor Collision", field: "JavaScript", year: 2026},
  {id: "S-004", title: "ASCII Grid", field: "JavaScript", year: 2026},
  {id: "S-005", title: "Scroll Overlap", field: "CSS", year: 2026},
  {id: "S-006", title: "Notes OS", field: "TypeScript", year: 2025},
  {id: "S-007", title: "Signal Board", field: "JavaScript", year: 2025},
  {id: "S-008", title: "Hold Change", field: "JavaScript", year: 2025},
  {id: "S-009", title: "Clip Visual", field: "CSS", year: 2025},
  {id: "S-010", title: "Mouse Trail", field: "WebGL", year: 2025},
  {id: "S-011", title: "Fixed BG Cards", field: "JavaScript", year: 2025},
  {id: "S-012", title: "Domain Warp", field: "WebGL", year: 2025},
  {id: "S-013", title: "Pull to Switch", field: "JavaScript", year: 2025},
  {id: "S-014", title: "Afterimage Text", field: "JavaScript", year: 2025},
  {id: "S-015", title: "Lens Distortion", field: "WebGL", year: 2025},
  {id: "S-016", title: "Infinite Image", field: "JavaScript", year: 2024},
  {id: "S-017", title: "Parallax Slider", field: "JavaScript", year: 2024},
  {id: "S-018", title: "Noise Texture", field: "WebGL", year: 2024},
  {id: "S-019", title: "Glass Cube", field: "WebGL", year: 2024},
  {id: "S-020", title: "Circle Animation", field: "CSS", year: 2024},
]

export function studiesByYear(items: Study[]) {
  const years = [...new Set(items.map((item) => item.year))].sort((a, b) => b - a)
  return years.map((year) => ({
    year,
    items: items.filter((item) => item.year === year),
  }))
}
