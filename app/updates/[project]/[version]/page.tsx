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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
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

function hexAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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
          [rehypePrettyCode, { theme: "github-dark", keepBackground: false }],
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
    components: useMDXComponents(),
  })

  const title = frontmatter?.title ?? `${project.label} ${version}`
  const date = frontmatter?.date
  const tag = frontmatter?.tag ?? "release"
  const githubUrl = frontmatter?.githubUrl

  const borderColor = hexAlpha(project.primaryHex, 0.35)

  return (
    <div className="px-7 pb-8 pt-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={project.basePath}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2",
            "text-sm font-semibold text-foreground transition-all duration-200",
            "hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-sm",
          )}
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        {/* Colored title pill — optionally linked to GitHub */}
        {githubUrl ? (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-flex items-center gap-2 rounded-[20px] px-6 py-3 transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: project.midHex }}
          >
            <span className="text-2xl font-bold sm:text-3xl" style={{ color: "#E3E3E3" }}>
              {title}
            </span>
            <ExternalLink className="size-4 opacity-70" style={{ color: "#E3E3E3" }} />
          </a>
        ) : (
          <div
            className="mb-4 inline-flex items-center rounded-[20px] px-6 py-3"
            style={{ backgroundColor: project.midHex }}
          >
            <span className="text-2xl font-bold sm:text-3xl" style={{ color: "#E3E3E3" }}>
              {title}
            </span>
          </div>
        )}

        {/* Date + badges */}
        <div className="mt-2 flex items-center justify-center gap-2">
          {date ? (
            <p className="text-base text-muted-foreground">{date}</p>
          ) : null}
          {tag === "beta" ? (
            <Badge
              className="font-semibold"
              style={{ backgroundColor: "#F5CF46", color: "#000000", border: "none" }}
            >
              beta
            </Badge>
          ) : (
            <Badge
              className="font-semibold"
              style={{ backgroundColor: project.primaryHex, color: project.secondaryHex, border: "none" }}
            >
              release
            </Badge>
          )}
        </div>

        {/* Divider */}
        <hr className="mt-6 border-border" style={{ borderColor }} />
      </div>

      {/* Changelog content */}
      <article className="mx-auto max-w-2xl space-y-2">
        {content}
      </article>
    </div>
  )
}
