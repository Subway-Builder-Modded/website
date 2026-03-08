import fs from "node:fs/promises"

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import { remarkHeadingId } from "remark-custom-heading-id"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import remarkFlexibleCodeTitles from "remark-flexible-code-titles"
import rehypeExternalLinks from "rehype-external-links"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import remarkDirective from "remark-directive"

import { FooterBars } from "@/components/ui/footer-bars"
import { getUpdateProjectById, type UpdateProjectId } from "@/lib/updates-config"
import {
  getAllUpdateParams,
  getUpdateEntry,
  type UpdateFrontmatter,
} from "@/lib/updates.server"
import { useMDXComponents as getMDXComponents } from "@/mdx-components"

export const dynamicParams = false

type UpdatePageProps = {
  params: Promise<{ project: string; version: string }>
}

export async function generateStaticParams() {
  return getAllUpdateParams()
}

export async function generateMetadata({ params }: UpdatePageProps): Promise<Metadata> {
  const { project, version } = await params
  const projectConfig = getUpdateProjectById(project)

  if (!projectConfig) {
    return { title: "Update | Subway Builder Modded" }
  }

  const entry = await getUpdateEntry(project as UpdateProjectId, version)

  return {
    title: entry?.frontmatter.title
      ? `${entry.frontmatter.title} | ${projectConfig.label} | Subway Builder Modded`
      : `${projectConfig.label} Update | Subway Builder Modded`,
    description: entry?.frontmatter.summary ?? `Release notes for ${projectConfig.label}.`,
  }
}

export default async function UpdateVersionPage({ params }: UpdatePageProps) {
  const { project, version } = await params
  const projectConfig = getUpdateProjectById(project)
  if (!projectConfig) notFound()

  const entry = await getUpdateEntry(project as UpdateProjectId, version)
  if (!entry) notFound()

  const source = await fs.readFile(entry.filePath, "utf8")

  const { content, frontmatter } = await compileMDX<UpdateFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkHeadingId, remarkFlexibleCodeTitles, remarkDirective],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "github-dark",
              keepBackground: false,
            },
          ],
          [
            rehypeExternalLinks,
            {
              target: "_blank",
              rel: ["nofollow", "noopener", "noreferrer"],
            },
          ],
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                className: ["heading-anchor"],
                ariaLabel: "Link to section",
              },
              content: {
                type: "text",
                value: "#",
              },
            },
          ],
        ],
      },
    },
    components: getMDXComponents(),
  })

  return (
    <main className="px-7 py-8">
      <article className="mx-auto max-w-3xl">
        <Link
          href={`/updates/${projectConfig.id}`}
          className="mb-5 inline-flex text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          ← Back to {projectConfig.label}
        </Link>

        <header className="mb-8 border-b border-border pb-5" style={{ borderColor: `${projectConfig.accent}66` }}>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: projectConfig.base }}>{frontmatter.title ?? entry.version}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{frontmatter.date}</p>
        </header>

        <div className="max-w-none space-y-1">{content}</div>
      </article>

      <FooterBars className="mt-8" />
    </main>
  )
}
