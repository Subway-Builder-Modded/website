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
import remarkAdmonitionDirectives from "@/lib/remark-admonition-directives"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { ReleaseTagBadge } from "@/components/updates/release-tag-badge"
import { cn } from "@/lib/utils"
import { UpdateSection } from "@/components/updates/update-section"
import { useMDXComponents } from "@/mdx-components"
import { getUpdateProjectById } from "@/lib/updates-config"
import {
  getAllUpdateParams,
  getUpdateFilePath,
  readUpdateFrontmatter,
  type UpdateFrontmatter,
} from "@/lib/updates.server"

export const dynamicParams = false

export async function generateStaticParams() {
  return getAllUpdateParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ project: string; version: string }>
}): Promise<Metadata> {
  const { project: projectId, version } = await params
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

// ── page ─────────────────────────────────────────────────────────────────────

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ project: string; version: string }>
}) {
  const { project: projectId, version } = await params
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
    components: useMDXComponents({
      UpdateSection: (props) => <UpdateSection {...props} themeId={project.id} />,
    }),
  })

  const title      = frontmatter?.title ?? `${project.label} ${version}`
  const date       = frontmatter?.date
  const tag        = frontmatter?.tag ?? "release"
  const githubUrl  = frontmatter?.githubUrl

  return (
    <section className="px-7 pb-8 pt-8">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href={project.basePath}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5",
            "text-sm font-semibold text-foreground",
            "transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out",
            "hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-sm",
          )}
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="mx-auto mb-8 -mt-10 max-w-2xl text-center">
        {/*
          Full-width title banner — mirrors the project hub card's title bar:
          a coloured pill spanning the content area. Optionally links to GitHub.
        */}
        {githubUrl ? (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mb-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 bg-[var(--project-secondary-light)] text-[var(--project-primary-light)] dark:bg-[var(--project-secondary-dark)] dark:text-[var(--project-primary-dark)]",
              "font-mta text-2xl font-bold",
              "transition-transform duration-200 hover:scale-[1.02]",
            )}
            style={{
              ["--project-secondary-light" as string]: project.secondaryHex.light,
              ["--project-secondary-dark" as string]: project.secondaryHex.dark,
              ["--project-primary-light" as string]: project.primaryHex.light,
              ["--project-primary-dark" as string]: project.primaryHex.dark,
            }}
          >
            <span>{title}</span>
            <ExternalLink className="size-5 shrink-0 opacity-60" />
          </a>
        ) : (
          <div
            className="mb-5 flex min-h-12 w-full items-center justify-center rounded-2xl px-6 py-3 font-mta text-2xl font-bold bg-[var(--project-secondary-light)] text-[var(--project-primary-light)] dark:bg-[var(--project-secondary-dark)] dark:text-[var(--project-primary-dark)]"
            style={{
              ["--project-secondary-light" as string]: project.secondaryHex.light,
              ["--project-secondary-dark" as string]: project.secondaryHex.dark,
              ["--project-primary-light" as string]: project.primaryHex.light,
              ["--project-primary-dark" as string]: project.primaryHex.dark,
            }}
          >
            {title}
          </div>
        )}

        {/* Date + tag badge row */}
        <div className="flex items-center justify-center gap-3">
          {date ? (
            <p className="text-sm text-muted-foreground">{date}</p>
          ) : null}

          {{
            release: (
              <ReleaseTagBadge kind="release" size="sm" />
            ),
            beta: (
              <ReleaseTagBadge kind="beta" size="sm" />
            ),
            alpha: (
              <ReleaseTagBadge kind="alpha" size="sm" />
            ),
          }[tag]}
        </div>

        {/* Separator */}
        <hr className="mt-6 border-border" />
      </header>

      {/* ── Changelog content ───────────────────────────────────────────────── */}
      <article className="mx-auto max-w-2xl pb-16">
        {content}
      </article>
    </section>
  )
}
