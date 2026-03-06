import type { MDXComponents } from "mdx/types"
import Link from "next/link"

import {
  Admonition,
  Note,
  Tip,
  Important,
  Warning,
  Caution,
  Danger,
} from "@/components/ui/admonition"

const components: MDXComponents = {
  Admonition,
  Note,
  Tip,
  Important,
  Warning,
  Caution,
  Danger,
  a: ({ href = "", ...props }) => (
    <Link
      href={href}
      className="font-medium text-primary underline underline-offset-4"
      {...props}
    />
  ),
  h1: (props) => (
    <h1 className="scroll-m-20 text-4xl font-black tracking-tight" {...props} />
  ),
  h2: (props) => (
    <h2 className="scroll-m-20 border-b border-border pb-2 text-3xl font-bold tracking-tight first:mt-0" {...props} />
  ),
  h3: (props) => (
    <h3 className="scroll-m-20 text-2xl font-bold tracking-tight" {...props} />
  ),
  p: (props) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
  ),
  ul: (props) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
  ),
  ol: (props) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  code: (props) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm" {...props} />
  ),
  pre: (props) => (
    <pre className="my-6 overflow-x-auto rounded-xl border bg-muted p-4" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground" {...props} />
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
