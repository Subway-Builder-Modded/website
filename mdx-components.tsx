import * as React from "react"
import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import * as LucideIcons from "lucide-react"
import type { LucideIcon, LucideProps } from "lucide-react"
import { Tabs, TabItem } from "@/components/mdx/mdx-tabs"
import { IconList, IconItem } from "@/components/mdx/icon-list"
import { WikiCardGrid, WikiCard } from "@/components/wiki/wiki-home-cards"
import { UpdateSection } from "@/components/updates/update-section"

import {
  Admonition,
  Note,
  Tip,
  Important,
  Warning,
  Caution,
  Danger,
  Info,
  Success,
  Deprecated,
  Bug as BugAdmonition,
  Example,
  Announcement,
} from "@/components/ui/admonition"

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function textFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(textFromChildren).join("")

  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return textFromChildren(children.props.children)
  }

  return ""
}

function MdxLink({
  href = "",
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isHash = href.startsWith("#")
  const isInternal = href.startsWith("/")
  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")

  if (isHash) {
    return (
      <a
        href={href}
        className="font-medium text-primary underline underline-offset-4"
        {...props}
      >
        {children}
      </a>
    )
  }

  if (isInternal) {
    return (
      <Link
        href={href}
        className="font-medium text-primary underline underline-offset-4"
        {...props}
      >
        {children}
      </Link>
    )
  }

  if (isExternal) {
    return (
      <a
        href={href}
        className="font-medium text-primary underline underline-offset-4"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-4"
      {...props}
    >
      {children}
    </a>
  )
}

const lucideComponents: MDXComponents = Object.fromEntries(
  Object.entries(LucideIcons)
    .filter(([name, component]) => /^[A-Z]/.test(name) && component)
    .map(([name, icon]) => {
      const Icon = icon as LucideIcon

      const InlineLucideIcon = ({
        className,
        size = "1em",
        ...props
      }: LucideProps) => (
        <Icon
          aria-hidden="true"
          className={`inline-block align-[-0.125em] ${className ?? ""}`.trim()}
          size={size}
          {...props}
        />
      )

      InlineLucideIcon.displayName = `${name}Inline`

      return [name, InlineLucideIcon]
    })
)

const baseComponents: MDXComponents = {
  ...lucideComponents,
  Admonition,
  Note,
  Tip,
  Important,
  Warning,
  Caution,
  Danger,
  Info,
  Success,
  Deprecated,
  BugAdmonition,
  Example,
  Announcement,
  Tabs,
  TabItem,
  WikiCardGrid,
  WikiCard,
  UpdateSection,
  IconList,
  IconItem,

  a: MdxLink,

  h1: ({ children, id, ...props }) => {
    const headingId = id ?? slugify(textFromChildren(children))
    return (
      <h1
        id={headingId}
        className="scroll-m-20 text-4xl font-black tracking-tight"
        {...props}
      >
        {children}
      </h1>
    )
  },

  h2: ({ children, id, ...props }) => {
    const headingId = id ?? slugify(textFromChildren(children))
    return (
      <h2
        id={headingId}
        className="mt-10 scroll-m-20 border-b border-border pb-2 text-3xl font-bold tracking-tight first:mt-0"
        {...props}
      >
        {children}
      </h2>
    )
  },

  h3: ({ children, id, ...props }) => {
    const headingId = id ?? slugify(textFromChildren(children))
    return (
      <h3
        id={headingId}
        className="mt-8 scroll-m-20 text-2xl font-bold tracking-tight"
        {...props}
      >
        {children}
      </h3>
    )
  },

  h4: ({ children, id, ...props }) => {
    const headingId = id ?? slugify(textFromChildren(children))
    return (
      <h4
        id={headingId}
        className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight"
        {...props}
      >
        {children}
      </h4>
    )
  },

  p: (props) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
  ),

  ul: (props) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
  ),

  ol: (props) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),

  li: (props) => <li className="leading-7" {...props} />,

  strong: (props) => <strong className="font-semibold" {...props} />,

  hr: (props) => <hr className="my-8 border-border" {...props} />,

  table: (props) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),

  thead: (props) => <thead className="[&_tr]:border-b" {...props} />,

  tbody: (props) => <tbody className="[&_tr:last-child]:border-0" {...props} />,

  tr: (props) => <tr className="border-b transition-colors" {...props} />,

  th: (props) => (
    <th
      className="h-10 px-2 text-left align-middle font-medium text-foreground"
      {...props}
    />
  ),

  td: (props) => <td className="p-2 align-middle" {...props} />,

  code: ({ className, ...props }) => {
    if (className) {
      return <code className={className} {...props} />
    }

    return (
      <code
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
        {...props}
      />
    )
  },

  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-xl border bg-muted p-4 text-sm"
      {...props}
    />
  ),

  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 pl-6 italic text-muted-foreground"
      {...props}
    />
  ),
}

export function useMDXComponents(
  components: MDXComponents = {}
): MDXComponents {
  return {
    ...baseComponents,
    ...components,
  }
}
