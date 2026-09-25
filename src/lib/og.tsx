import {ImageResponse} from "next/og"
import {site} from "@/lib/site"

export const ogSize = {width: 1200, height: 630}
export const ogContentType = "image/png"

type OgFrameProps = {
  eyebrow?: string
  title: string
  description?: string
}

export function createOgImage({
  eyebrow = "PORTFOLIO",
  title,
  description,
}: OgFrameProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#f2f2f2",
          color: "#050505",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{display: "flex", fontSize: 28, letterSpacing: "0.08em"}}>
          {eyebrow}
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 18}}>
          <div
            style={{
              fontSize: title.length > 28 ? 64 : 84,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          {description ? (
            <div style={{fontSize: 28, color: "#374151", maxWidth: 900}}>
              {description}
            </div>
          ) : null}
        </div>
        <div style={{display: "flex", fontSize: 24, color: "#737373"}}>
          {site.name} · www.yong-hee.com
        </div>
      </div>
    ),
    {...ogSize},
  )
}
