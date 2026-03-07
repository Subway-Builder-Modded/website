import fs from "node:fs/promises"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import { remarkHeadingId } from "remark-custom-heading-id"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import remarkFlexibleCodeTitles from "remark-flexible-code-titles"
import rehypeExternalLinks from "rehype-external-links"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import remarkDirective from "remark-directive"
import remarkAdmonitionDirectives from "@/lib/remark-admonition-directives"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { WikiOnThisPage } from "@/components/ui/on-this-page"
import { useMDXComponents } from "@/mdx-components"
import {
  extractTocHeadings,
  getWikiBreadcrumbs,
  getWikiDocTitle,
  getAllWikiDocSlugs,
  resolveWikiDocFilePath,
  type WikiFrontmatter,
} from "@/lib/wiki.server"
import { WIKI_INSTANCES } from "@/lib/wiki-config"
import { buildBaseHomeHref, buildDocHref, resolveWikiRoute } from "@/lib/wiki-shared"
import { WikiHubPage } from "@/components/wiki/wiki-hub-page"

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getAllWikiDocSlugs()

  const baseRouteSlugs = WIKI_INSTANCES.flatMap((instance) => {
    if (!instance.versioned) return [[instance.id]]

    const versionRoots = (instance.versions ?? []).flatMap((version) => [
      [instance.id, version.value],
      [instance.id, "latest"],
    ])

    return [[instance.id], ...versionRoots]
  })

  const latestAliasSlugs = WIKI_INSTANCES.flatMap((instance) => {
    if (!instance.versioned) return []

    return slugs
      .filter(
        (parts) =>
          parts[0] === instance.id &&
          parts[1] &&
          instance.versions?.some((version) => version.value === parts[1])
      )
      .map((parts) => [parts[0], "latest", ...parts.slice(2)])
  })

  const allParamKeys = new Set<string>([
    "",
    ...baseRouteSlugs.map((parts) => parts.join("/")),
    ...slugs.map((parts) => parts.join("/")),
    ...latestAliasSlugs.map((parts) => parts.join("/")),
  ])

  return Array.from(allParamKeys).map((key) => ({
    slug: key === "" ? [""] : key.split("/"),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const normalizedSlug = slug?.filter(Boolean)

  if (!normalizedSlug?.length) {
    return {
      title: "Wiki | Subway Builder Modded",
    }
  }

  const resolved = resolveWikiRoute(normalizedSlug)

  if (!resolved?.docSlug) {
    return {
      title: resolved
        ? `${resolved.instance.label} | Subway Builder Modded`
        : "Wiki | Subway Builder Modded",
    }
  }

  const title = await getWikiDocTitle(normalizedSlug)

  return {
    title: title
      ? `${title} | ${resolved.instance.label} | Subway Builder Modded`
      : "Wiki | Subway Builder Modded",
  }
}

function WikiIndexPage() {
  return <WikiHubPage />
}

export default async function WikiPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const normalizedSlug = slug?.filter(Boolean)

  if (!normalizedSlug?.length) {
    return <WikiIndexPage />
  }

  const resolved = resolveWikiRoute(normalizedSlug)
  if (!resolved) notFound()

  if (resolved.instance.versioned && resolved.requestedVersion === "latest") {
    if (resolved.docSlug) {
      redirect(buildDocHref(resolved.instance, resolved.version, resolved.docSlug))
    }

    redirect(buildBaseHomeHref(resolved.instance, resolved.version))
  }

  if (!resolved.docSlug) {
    redirect(buildBaseHomeHref(resolved.instance, resolved.version))
  }

  const filePath = await resolveWikiDocFilePath(normalizedSlug)
  if (!filePath) notFound()

  const source = await fs.readFile(filePath, "utf8")
  const breadcrumbs = await getWikiBreadcrumbs(normalizedSlug)
  const toc = await extractTocHeadings(filePath)

  const { content, frontmatter } = await compileMDX<WikiFrontmatter>({
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
    components: useMDXComponents(),
  })

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_19rem] xl:gap-14 2xl:gap-20">
      <article className="min-w-0 flex-1">
        <Breadcrumb className="mb-5">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1

              return (
                <BreadcrumbItem key={`${crumb.label}-${index}`}>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href ?? "#"}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                  {!isLast ? <BreadcrumbSeparator /> : null}
                </BreadcrumbItem>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>

        {frontmatter?.title ? (
          <header className="mb-8">
            <h1 className="text-4xl font-black tracking-tight">
              {frontmatter.title}
            </h1>
          </header>
        ) : null}

        <div className="max-w-none space-y-1">
          {content}
        </div>
      </article>

      <aside className="hidden xl:block">
        <div className="sticky top-20 max-h-[calc(100svh-5rem)] overflow-y-auto">
          <WikiOnThisPage headings={toc} />
        </div>
      </aside>
    </div>
  )
}
