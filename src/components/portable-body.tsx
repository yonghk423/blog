import type {ReactNode} from "react"
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
  type PortableTextReactComponents,
} from "next-sanity"

type SpanChild = {
  _type?: string
  _key?: string
  text?: string
  marks?: string[]
}

type BlockNode = PortableTextBlock & {
  style?: string
  children?: SpanChild[]
}

function trimHeadingBlocks(blocks: PortableTextBlock[]): PortableTextBlock[] {
  return blocks.map((block) => {
    const node = block as BlockNode
    if (node._type !== "block") return block
    if (node.style !== "h2" && node.style !== "h3") return block

    const children = node.children?.map((child) => {
      if (child._type !== "span" || typeof child.text !== "string") return child
      return {...child, text: child.text.replace(/^\n+|\n+$/g, "")}
    })

    return {...node, children} as PortableTextBlock
  })
}

function HeadingMark({
  as: Tag,
  children,
}: {
  as: "h2" | "h3"
  children: ReactNode
}) {
  return (
    <Tag>
      <span className="pt-heading-mark">{children}</span>
    </Tag>
  )
}

const components = {
  block: {
    h2: ({children}) => <HeadingMark as="h2">{children}</HeadingMark>,
    h3: ({children}) => <HeadingMark as="h3">{children}</HeadingMark>,
  },
} satisfies Partial<PortableTextReactComponents> as PortableTextComponents

export function PortableBody({value}: {value: PortableTextBlock[]}) {
  return <PortableText value={trimHeadingBlocks(value)} components={components} />
}
