import fs from "node:fs/promises"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeExternalLinks from "rehype-external-links"
import rehypePrettyCode from "rehype-pretty-code"
import { ArrowLeft, ExternalLink } from "lucide-react"
import remarkDirective from "remark-directive"
import remarkFlexibleCodeTitles from "remark-flexible-code-titles"
import remarkGfm from "remark-gfm"
import { remarkHeadingId } from "remark-custom-heading-id"
import type { CSSProperties } from "react"

import { ReleaseTagBadge } from "@/components/updates/release-tag-badge"
import { UpdateSection } from "@/components/updates/update-section"
import { getUpdateProjectById } from "@/config/content/updates"
import { hexAlpha } from "@/lib/color"
import { useMDXComponents as getMDXComponents } from "@/mdx-components"
import remarkAdmonitionDirectives from "@/lib/remark-admonition-directives"
import {
  getAllUpdateParams,
  getUpdateFilePath,
  readUpdateFrontmatter,
  type UpdateFrontmatter,
} from "@/lib/updates.server"

export const dynamicParams = false

export async function generateStaticParams() {
  const params = await getAllUpdateParams()
  return params.map((entry) => ({ instance: entry.project, version: entry.version }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ instance: string; version: string }>
}): Promise<Metadata> {
  const { instance: projectId, version } = await params
  const project = getUpdateProjectById(projectId)
  if (!project) return { title: "Update | Subway Builder Modded" }

  const filePath = getUpdateFilePath(projectId, version)
  if (!filePath) return { title: `${project.label} | Subway Builder Modded` }

  const frontmatter = await readUpdateFrontmatter(filePath)
  const title = frontmatter?.title ?? `${project.label} ${version}`

  return {
    title: `${title} | Subway Builder Modded`,
    description: `Release notes for ${title}.`,
  }
}

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ instance: string; version: string }>
}) {
  const { instance: projectId, version } = await params
  const project = getUpdateProjectById(projectId)
  if (!project) notFound()

  const filePath = getUpdateFilePath(projectId, version)
  if (!filePath) notFound()

  const source = await fs.readFile(filePath, "utf8")
  const { content, frontmatter } = await compileMDX<UpdateFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          remarkHeadingId,
          remarkFlexibleCodeTitles,
          remarkDirective,
          remarkAdmonitionDirectives,
        ],
        rehypePlugins: [
          [rehypePrettyCode, { theme: { dark: "github-dark", light: "github-light-high-contrast" }, keepBackground: false }],
          [
            rehypeExternalLinks,
            { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] },
          ],
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: { className: ["heading-anchor"], ariaLabel: "Link to section" },
              content: { type: "text", value: "#" },
            },
          ],
        ],
      },
    },
    components: getMDXComponents({
      UpdateSection: (props) => <UpdateSection {...props} themeId={project.id} />,
    }),
  })

  const title = frontmatter?.title ?? `${project.label} ${version}`
  const date = frontmatter?.date
  const tag = frontmatter?.tag ?? "release"
  const githubUrl = frontmatter?.githubUrl

  return (
    <section className="relative px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
      <div className="mx-auto w-full max-w-screen-xl">
        <header
          className="relative mx-auto mb-8 max-w-4xl overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6"
          style={
            {
              ["--update-accent-light" as string]: project.accentColor.light,
              ["--update-accent-dark" as string]: project.accentColor.dark,
              ["--update-soft-light" as string]: hexAlpha(project.accentColor.light, 0.22),
              ["--update-soft-dark" as string]: hexAlpha(project.accentColor.dark, 0.26),
              ["--button-accent-light" as string]: project.accentColor.light,
              ["--button-accent-dark" as string]: project.accentColor.dark,
              ["--button-soft-light" as string]: hexAlpha(project.accentColor.light, 0.14),
              ["--button-soft-dark" as string]: hexAlpha(project.accentColor.dark, 0.2),
            } as CSSProperties
          }
        >
          <span className="absolute inset-x-0 top-0 h-0.5 bg-[var(--update-accent-light)] dark:bg-[var(--update-accent-dark)]" />
          <span className="pointer-events-none absolute -right-16 -top-20 size-40 rounded-full bg-[var(--update-soft-light)] blur-3xl dark:bg-[var(--update-soft-dark)]" />

          <div className="relative">
            <div className="mb-4">
              <Link
                href={`/${project.id}/updates`}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--button-accent-light)] px-3 text-xs font-semibold text-[var(--button-accent-light)] transition-all duration-200 hover:bg-[var(--button-soft-light)] dark:border-[var(--button-accent-dark)] dark:text-[var(--button-accent-dark)] dark:hover:bg-[var(--button-soft-dark)]"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back</span>
              </Link>
            </div>

            {githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-2xl font-black tracking-tight text-foreground transition-colors hover:text-primary sm:text-3xl"
              >
                <span>{title}</span>
                <ExternalLink className="size-5 opacity-65 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : (
              <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h2>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {date ? <p className="text-sm text-muted-foreground">{date}</p> : null}
              {{
                release: <ReleaseTagBadge kind="release" size="sm" />,
                beta: <ReleaseTagBadge kind="beta" size="sm" />,
                alpha: <ReleaseTagBadge kind="alpha" size="sm" />,
              }[tag]}
            </div>
          </div>
        </header>

        <article className="prose prose-zinc prose-code:before:content-none prose-code:after:content-none mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card/55 p-5 shadow-sm dark:prose-invert sm:p-7">
          {content}
        </article>
      </div>
    </section>
  )
}
