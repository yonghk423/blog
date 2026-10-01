# SEO

이 사이트에 적용한 SEO 설정과 운영 방법을 정리한다.

## 공개 주소

| 항목 | 값 |
| --- | --- |
| Canonical 도메인 | `https://www.yong-hee.com` |
| Search Console 속성 | `yong-hee.com` (도메인 DNS 인증) |
| 사이트맵 | `https://www.yong-hee.com/sitemap.xml` |
| robots | `https://www.yong-hee.com/robots.txt` |
| Studio | `https://yonghee-blog.sanity.studio` |

환경 변수:

```bash
NEXT_PUBLIC_SITE_URL=https://www.yong-hee.com
```

코드 기본값: `src/lib/site.ts`의 `site.siteUrl`

> 사이트맵·canonical·OG URL은 모두 `site.siteUrl` 기준이다.  
> Vercel 기본 도메인(`*.vercel.app`)을 넣으면 Search Console에서 “URL이 허용되지 않음”이 난다.

## 적용한 항목

### 크롤링 / 색인

- `src/app/sitemap.ts` — 홈, About, Studies, Projects(챕터 포함) XML 사이트맵
- `src/app/robots.ts` — 전체 허용 + 사이트맵 URL 안내
- `seo.noIndex == true` 문서는 사이트맵에서 제외 (`SITEMAP_QUERY`)

### 메타데이터

- `src/app/layout.tsx` — `metadataBase`, 기본 title/description, Open Graph, Twitter, robots
- `src/lib/seo.ts` — `pageMetadata()`, `absoluteUrl()`, `truncateDescription()`
- 페이지별 `generateMetadata` / `pageMetadata`
  - About, Studies, Projects, Project chapters
- canonical: `alternates.canonical`
- description 우선순위: Sanity SEO 필드 → 요약/본문(`pt::text`) → 제목 조합

### Sanity SEO 필드

스키마: `studio/schemaTypes/seo.ts`  
적용 문서: Post, Project, Project Chapter, About

| 필드 | 용도 |
| --- | --- |
| `title` | 검색/공유용 제목 (비우면 문서 제목) |
| `description` | 메타 설명 (비우면 요약·본문) |
| `image` | 공유 이미지 1200×630 (비우면 자동 OG) |
| `noIndex` | `robots: noindex` + 사이트맵 제외 |

스키마 변경 후:

```bash
cd studio && npx sanity schema deploy
# Studio UI 반영이 필요하면
cd studio && npx sanity deploy
```

### Open Graph 이미지

자동 생성 (제목·설명 기반):

- `/opengraph-image`
- `/about/opengraph-image`
- `/studies/[slug]/opengraph-image`
- `/projects/[slug]/opengraph-image`
- `/projects/[slug]/[chapter]/opengraph-image`

공통 렌더: `src/lib/og.tsx`  
Sanity `seo.image`가 있으면 메타데이터의 `openGraph.images`로 CDN URL을 사용 (`src/lib/seo-image.ts`).

### JSON-LD

컴포넌트: `src/components/json-ld.tsx`

| 타입 | 위치 |
| --- | --- |
| `WebSite` (+ author `Person`) | `src/app/layout.tsx` |
| `Person` | `src/app/about/page.tsx` |
| `BlogPosting` | `src/app/studies/[slug]/page.tsx` |

### 의도적으로 하지 않은 것

- `verification.google` — Search Console을 **도메인 DNS**로 이미 인증함. HTML 메타 태그 불필요.
- `hreflang` — 한국어 단일 사이트.

## 파일 맵

```
src/lib/site.ts                 # siteUrl, 기본 description
src/lib/seo.ts                  # pageMetadata 헬퍼
src/lib/seo-image.ts            # Sanity 이미지 → OG URL
src/lib/og.tsx                  # OG ImageResponse 공통 UI
src/components/json-ld.tsx
src/app/layout.tsx
src/app/robots.ts
src/app/sitemap.ts
src/app/opengraph-image.tsx
src/app/about/page.tsx
src/app/about/opengraph-image.tsx
src/app/studies/[slug]/page.tsx
src/app/studies/[slug]/opengraph-image.tsx
src/app/projects/[slug]/page.tsx
src/app/projects/[slug]/opengraph-image.tsx
src/app/projects/[slug]/[chapter]/page.tsx
src/app/projects/[slug]/[chapter]/opengraph-image.tsx
src/sanity/queries.ts           # POST/PROJECT/ABOUT + SITEMAP_QUERY
studio/schemaTypes/seo.ts
```

## Search Console 체크리스트

1. 속성: `yong-hee.com` (소유권 확인됨)
2. 사이트맵 제출 경로: `sitemap.xml`  
   (전체 URL이면 `https://www.yong-hee.com/sitemap.xml`)
3. 제출 후 “발견된 페이지”가 0이 아닌지, “Sitemap이 HTML입니다” 오류가 없는지 확인
4. 새 글 배포 후 필요하면 URL 검사 → 색인 생성 요청

## 운영 팁

- **도메인을 바꾸면** `NEXT_PUBLIC_SITE_URL` / `site.siteUrl`을 함께 바꾸고 재배포한다.
- Studio에서 SEO를 비워 두면 자동 fallback이 동작한다. 중요한 글만 수동 오버라이드하면 된다.
- `noIndex`는 초안·비공개성 글에만 켠다.
- 로컬 확인:

```bash
curl -sI http://localhost:3000/sitemap.xml   # content-type: application/xml
curl -s http://localhost:3000/robots.txt
curl -sI http://localhost:3000/opengraph-image  # image/png
```
