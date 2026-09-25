import type {Metadata} from "next"
import {Inter, Nanum_Myeongjo, Noto_Sans_KR} from "next/font/google"
import {Header} from "@/components/header"
import {JsonLd} from "@/components/json-ld"
import {ThemeProvider} from "@/components/theme-provider"
import {absoluteUrl} from "@/lib/seo"
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
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.title,
    template: `%s - ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
    siteName: site.name,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.siteUrl,
  description: site.description,
  inLanguage: "ko-KR",
  author: {
    "@type": "Person",
    name: site.name,
    url: absoluteUrl("/about"),
    email: site.email,
    sameAs: [site.github],
  },
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
        <JsonLd data={websiteJsonLd} />
        <ThemeProvider>
          <Header />
          {children}
          <SanityLive />
        </ThemeProvider>
      </body>
    </html>
  )
}
