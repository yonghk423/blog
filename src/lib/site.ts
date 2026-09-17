export const site = {
  name: "김용희",
  title: "김용희 - Portfolio",
  description: "portfolio site by Yonghee Kim, based in Seoul.",
  email: "yonghk423423@gmail.com",
  github: "https://github.com/yonghk423",
}

export type Study = {
  title: string
  field: string
  year: number
  href?: string
}

export const studies: Study[] = []

export type Project = {
  title: string
  role?: string
  period?: string
  summary: string
  href?: string
}

export const about = {
  name: "김용희",
  intro: [
    "서울에서 활동하는 프론트엔드 개발자 김용희입니다.",
    "인터페이스와 인터랙션을 중심으로 웹을 만듭니다.",
  ],
}

export const projects: Project[] = []

export function studiesByYear(items: Study[]) {
  const years = [...new Set(items.map((item) => item.year))].sort((a, b) => b - a)
  return years.map((year) => ({
    year,
    items: items.filter((item) => item.year === year),
  }))
}
