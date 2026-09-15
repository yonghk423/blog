import type {Metadata} from "next"
import {Inter, Noto_Sans_KR} from "next/font/google"
import {Header} from "@/components/header"
import {site} from "@/lib/site"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
})

const kr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-kr",
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
    <html lang="ko" className={`${inter.variable} ${kr.variable} h-full antialiased`}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
