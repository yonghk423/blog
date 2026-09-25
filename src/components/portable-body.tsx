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

type CodeBlockValue = {
  _type?: string
  language?: string | null
  filename?: string | null
  code?: string | null
}

type TableValue = {
  _type?: string
  headers?: string[] | null
  rows?: Array<{_key?: string; cells?: string[] | null} | null> | null
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

function CodeBlock({value}: {value: CodeBlockValue}) {
  const code = value.code ?? ""
  if (!code) return null

  const label = value.filename || value.language

  return (
    <figure className="pt-code">
      {label ? <figcaption className="pt-code__meta">{label}</figcaption> : null}
      <pre className="pt-code__pre">
        <code className="pt-code__code">{code}</code>
      </pre>
    </figure>
  )
}

function ContentTable({value}: {value: TableValue}) {
  const headers = value.headers?.filter((cell) => cell != null) ?? []
  const rows =
    value.rows?.filter((row): row is NonNullable<typeof row> => Boolean(row)) ?? []

  if (!headers.length && !rows.length) return null

  return (
    <div className="pt-table-wrap">
      <table className="pt-table">
        {headers.length ? (
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={`h-${index}`}>{header}</th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, rowIndex) => {
            const cells = row.cells ?? []
            return (
              <tr key={row._key || `r-${rowIndex}`}>
                {cells.map((cell, cellIndex) => (
                  <td key={`${row._key || rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const components = {
  block: {
    h2: ({children}) => <HeadingMark as="h2">{children}</HeadingMark>,
    h3: ({children}) => <HeadingMark as="h3">{children}</HeadingMark>,
  },
  marks: {
    link: ({children, value}) => {
      const href = typeof value?.href === "string" ? value.href : undefined
      const external = href?.startsWith("http")
      return (
        <a
          href={href}
          className="pt-link"
          {...(external
            ? {target: "_blank", rel: "noopener noreferrer"}
            : undefined)}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    codeBlock: ({value}) => <CodeBlock value={value as CodeBlockValue} />,
    table: ({value}) => <ContentTable value={value as TableValue} />,
  },
} satisfies Partial<PortableTextReactComponents> as PortableTextComponents

export function PortableBody({value}: {value: PortableTextBlock[]}) {
  return <PortableText value={trimHeadingBlocks(value)} components={components} />
}
