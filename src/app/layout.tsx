import type {Metadata} from "next"
import {Inter, Nanum_Myeongjo, Noto_Sans_KR} from "next/font/google"
import {Header} from "@/components/header"
import {ThemeProvider} from "@/components/theme-provider"
import {site} from "@/lib/site"
import {themeInitScript} from "@/lib/theme"
import {SanityLive} from "@/sanity/lib/live"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

const kr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kr",
})

const serifKr = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-serif-kr",
})

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s - ${site.name}`,
  },
  description: site.description,
}

export default function RootLayout({children}: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${kr.variable} ${serifKr.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{__html: themeInitScript}} />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          {children}
          <SanityLive />
        </ThemeProvider>
      </body>
    </html>
  )
}
