import Image from "next/image"
import type {SanityImageSource} from "@sanity/image-url"
import {urlFor} from "@/sanity/lib/image"

type SanityImageValue = SanityImageSource & {
  alt?: string | null
  asset?: {_ref?: string} | null
}

type SanityImageProps = {
  value: SanityImageValue | null | undefined
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
}

export function SanityImage({
  value,
  width = 800,
  height,
  className,
  priority,
  sizes,
  fill = false,
}: SanityImageProps) {
  if (!value?.asset) return null

  const builder = urlFor(value).width(width)
  const src = (
    height && !fill ? builder.height(height).fit("max") : builder
  ).url()

  if (fill) {
    return (
      <Image
        className={className}
        src={src}
        alt={value.alt || ""}
        fill
        priority={priority}
        sizes={sizes}
      />
    )
  }

  const resolvedHeight = height ?? Math.round(width / 1.5)

  return (
    <Image
      className={className}
      src={src}
      alt={value.alt || ""}
      width={width}
      height={resolvedHeight}
      priority={priority}
      sizes={sizes}
    />
  )
}
