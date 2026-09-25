import {ImageResponse} from "next/og"
import {site} from "@/lib/site"

export const runtime = "edge"
export const alt = site.title
export const size = {width: 1200, height: 630}
export const contentType = "image/png"

export default function OpenGraphImage() {
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
          PORTFOLIO
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 18}}>
          <div style={{fontSize: 84, fontWeight: 700, lineHeight: 1.05}}>
            {site.name}
          </div>
          <div style={{fontSize: 32, color: "#374151", maxWidth: 820}}>
            {site.description}
          </div>
        </div>
        <div style={{display: "flex", fontSize: 24, color: "#737373"}}>
          www.yong-hee.com
        </div>
      </div>
    ),
    {...size},
  )
}
