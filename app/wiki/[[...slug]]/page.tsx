import fs from "node:fs/promises"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"

import {
  Admonition,
  Note,
  Tip,
  Important,
  Warning,
  Caution,
  Danger,
} from "@/components/ui/admonition"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  getWikiBreadcrumbs,
  getWikiDocTitle,
  resolveWikiDocFilePath,
  type WikiFrontmatter,
} from "@/lib/wiki.server"
import { WIKI_INSTANCES } from "@/lib/wiki-config"
import { buildBaseHomeHref, buildDocHref, resolveWikiRoute } from "@/lib/wiki-shared"

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

export default async function WikiPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params

  if (!slug?.length) {
    redirect(buildBaseHomeHref(WIKI_INSTANCES[0]))
  }

  const resolved = resolveWikiRoute(slug)

  if (!resolved) notFound()

  if (!resolved.docSlug) {
    redirect(buildDocHref(resolved.instance, resolved.version, "home"))
  }

  const filePath = await resolveWikiDocFilePath(slug)
  if (!filePath) notFound()

  const source = await fs.readFile(filePath, "utf8")
  const breadcrumbs = await getWikiBreadcrumbs(slug)

  const { content, frontmatter } = await compileMDX<WikiFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
    },
    components: {
      Admonition,
      Note,
      Tip,
      Important,
      Warning,
      Caution,
      Danger,
    },
  })

  return (
    <article className="max-w-3xl">
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
  )
}
