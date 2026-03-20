import fs from "node:fs/promises"
import path from "node:path"
import type { Metadata } from "next"
import { compileMDX } from "next-mdx-remote/rsc"
import { Scale } from "lucide-react"
import remarkGfm from "remark-gfm"
import type { CSSProperties } from "react"

import { PageHeader } from "@/components/page/page-header"
import { SHARED_TEXT_COLOR } from "@/config/theme/colors"
import { hexAlpha } from "@/lib/color"
import { useMDXComponents as getMDXComponents } from "@/mdx-components"

type LicenseFrontmatter = {
  title?: string
  description?: string
}

const LICENSE_MDX_PATH = path.join(process.cwd(), "content", "license", "gpl-3.0.mdx")
const NEUTRAL_ACCENT = SHARED_TEXT_COLOR

export const metadata: Metadata = {
  title: "License | Subway Builder Modded",
  description: "GNU General Public License v3.0 for Subway Builder Modded projects.",
}

export default async function LicensePage() {
  const source = await fs.readFile(LICENSE_MDX_PATH, "utf8")

  const { content, frontmatter } = await compileMDX<LicenseFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: getMDXComponents(),
  })

  const title = frontmatter?.title ?? "GNU General Public License v3.0"
  const description = frontmatter?.description

  return (
    <section className="relative px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
      <div className="mx-auto w-full max-w-screen-xl">
        <PageHeader
          icon={Scale}
          title="License"
          description="Terms and licensing information for Subway Builder Modded projects."
        />

        <header
          className="relative mx-auto mb-8 max-w-4xl overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6"
          style={
            {
              ["--license-accent-light" as string]: NEUTRAL_ACCENT.light,
              ["--license-accent-dark" as string]: NEUTRAL_ACCENT.dark,
              ["--license-soft-light" as string]: hexAlpha(NEUTRAL_ACCENT.light, 0.14),
              ["--license-soft-dark" as string]: hexAlpha(NEUTRAL_ACCENT.dark, 0.18),
            } as CSSProperties
          }
        >
          <span className="absolute inset-x-0 top-0 h-0.5 bg-[var(--license-accent-light)] dark:bg-[var(--license-accent-dark)]" />
          <span className="pointer-events-none absolute -right-16 -top-20 size-40 rounded-full bg-[var(--license-soft-light)] blur-3xl dark:bg-[var(--license-soft-dark)]" />

          <div className="relative">
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">{title}</h1>
            {description ? <p className="mt-3 text-sm text-muted-foreground">{description}</p> : null}
          </div>
        </header>

        <article className="prose prose-zinc prose-code:before:content-none prose-code:after:content-none mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card/55 p-5 shadow-sm dark:prose-invert sm:p-7">
          {content}
        </article>
      </div>
    </section>
  )
}

