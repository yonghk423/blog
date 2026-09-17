import Image from "next/image"
import type {SanityImageSource} from "@sanity/image-url"
import {urlFor} from "@/sanity/lib/image"

type SanityImageValue = SanityImageSource & {
  alt?: string | null
  asset?: {
    _ref?: string
    _id?: string
    metadata?: {
      lqip?: string | null
      dimensions?: {width?: number; height?: number} | null
    } | null
  } | null
}

type SanityImageProps = {
  value: SanityImageValue | null | undefined
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  quality?: number
}

export function SanityImage({
  value,
  width = 800,
  height,
  className,
  priority,
  sizes,
  fill = false,
  quality = 75,
}: SanityImageProps) {
  if (!value?.asset) return null

  const lqip = value.asset.metadata?.lqip || undefined
  const resolvedHeight =
    height ??
    value.asset.metadata?.dimensions?.height ??
    Math.round(width / 1.5)

  let builder = urlFor(value).width(width).quality(quality).auto("format")
  if (height && !fill) {
    builder = builder.height(height).fit("max")
  }
  const src = builder.url()

  const shared = {
    className,
    src,
    alt: value.alt || "",
    priority,
    sizes,
    quality,
    placeholder: (lqip ? "blur" : "empty") as "blur" | "empty",
    ...(lqip ? {blurDataURL: lqip} : {}),
  }

  if (fill) {
    return <Image {...shared} fill />
  }

  return <Image {...shared} width={width} height={resolvedHeight} />
}
