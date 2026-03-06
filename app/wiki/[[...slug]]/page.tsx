import fs from "node:fs/promises"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { WikiOnThisPage } from "@/components/ui/on-this-page"
import {
  extractTocHeadings,
  getWikiBreadcrumbs,
  getWikiDocTitle,
  resolveWikiDocFilePath,
  type WikiFrontmatter,
} from "@/lib/wiki.server"
import { WIKI_INSTANCES } from "@/lib/wiki-config"
import { buildBaseHomeHref, resolveWikiRoute } from "@/lib/wiki-shared"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { slug } = await params

  if (!slug?.length) {
    return {
      title: "Wiki | Subway Builder Modded",
    }
  }

  const resolved = resolveWikiRoute(slug)

  if (!resolved?.docSlug) {
    return {
      title: resolved
        ? `${resolved.instance.label} | Subway Builder Modded`
        : "Wiki | Subway Builder Modded",
    }
  }

  const title = await getWikiDocTitle(slug)

  return {
    title: title
      ? `${title} | ${resolved.instance.label} | Subway Builder Modded`
      : "Wiki | Subway Builder Modded",
  }
}

function WikiIndexPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight">Wiki</h1>
        <p className="mt-3 text-muted-foreground">
          Browse documentation for Subway Builder Modded projects.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {WIKI_INSTANCES.map((instance) => (
          <Link
            key={instance.id}
            href={buildBaseHomeHref(instance)}
            className="rounded-2xl border border-border bg-card p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="text-lg font-semibold">{instance.label}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Open the {instance.label} documentation.
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default async function WikiPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params

  if (!slug?.length) {
    return <WikiIndexPage />
  }

  const resolved = resolveWikiRoute(slug)
  if (!resolved) notFound()

  if (!resolved.docSlug) {
    redirect(buildBaseHomeHref(resolved.instance, resolved.version))
  }

  const filePath = await resolveWikiDocFilePath(slug)
  if (!filePath) notFound()

  const source = await fs.readFile(filePath, "utf8")
  const breadcrumbs = await getWikiBreadcrumbs(slug)
  const toc = await extractTocHeadings(filePath)

  const { content, frontmatter } = await compileMDX<WikiFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
    },
  })

  return (
    <div className="flex gap-10">
      <article className="min-w-0 max-w-3xl flex-1">
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
            <h1 className="text-4xl font-black tracking-tight">{frontmatter.title}</h1>
          </header>
        ) : null}

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {content}
        </div>
      </article>

      <WikiOnThisPage headings={toc} />
    </div>
  )
}
