export const site = {
  name: "김용희",
  title: "김용희 - Portfolio",
  description: "portfolio site by Yonghee Kim, based in Seoul.",
  email: "yonghk423423@gmail.com",
  github: "https://github.com/yonghk423",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://yonghee-blog.vercel.app",
}

export type Study = {
  title: string
  field: string
  year: number
  publishedAt: string
  href?: string
}

const SEOUL_TZ = "Asia/Seoul"

function seoulDateParts(iso: string) {
  const date = new Date(iso)
  if (!Number.isFinite(date.getTime())) return null
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SEOUL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ""
  return {
    year: Number(value("year")),
    month: value("month"),
    day: value("day"),
  }
}

export function studyYear(iso: string) {
  return seoulDateParts(iso)?.year ?? Number.NaN
}

export function formatStudyDate(iso: string) {
  const parts = seoulDateParts(iso)
  if (!parts) return ""
  return `${parts.year}.${parts.month}.${parts.day}`
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
