# Yonghee Blog

Next.js portfolio + Sanity CMS blog.

## Setup

1. Copy `.env.example` to `.env.local` and fill in Sanity values.
2. Install dependencies:

```bash
npm install
cd studio && npm install
```

## Develop

Terminal 1 — site:

```bash
npm run dev
```

Terminal 2 — Sanity Studio:

```bash
npm run studio
```

- Site: http://localhost:3000
- Studio (local): http://localhost:3333
- Studio (deployed): https://yonghee-blog.sanity.studio

## Sanity

- Project: **Yonghee Blog**
- Project ID: `757pylzv`
- Dataset: `production`
- Manage: https://www.sanity.io/manage/project/757pylzv

Schema lives in `studio/schemaTypes`. After schema changes:

```bash
cd studio && npx sanity schema deploy
```
