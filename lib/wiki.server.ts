import "server-only"

import fs from "node:fs"
import path from "node:path"
import { compileMDX } from "next-mdx-remote/rsc"

import { WIKI_INSTANCES, getSidebarOrder, type WikiInstance } from "@/lib/wiki-config"
import {
  buildBaseHomeHref,
  buildDocHref,
  resolveWikiRoute,
  type WikiSidebarCategory,
  type WikiSidebarEntry,
  type WikiSidebarPage,
  type WikiSidebarTree,
} from "@/lib/wiki-shared"

const CONTENT_ROOT = path.join(process.cwd(), "content", "wiki")

export type WikiFrontmatter = {
  title: string
  description?: string
}

export type WikiBreadcrumbItem = {
  label: string
  href?: string
}

export type WikiTocHeading = {
  id: string
  text: string
  level: number
}

function exists(filePath: string) {
  return fs.existsSync(filePath)
}

function humanizeSegment(segment: string) {
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function getInstanceContentDir(instance: WikiInstance, version: string | null) {
  return instance.versioned
    ? path.join(CONTENT_ROOT, instance.id, version ?? "")
    : path.join(CONTENT_ROOT, instance.id)
}

async function readSource(filePath: string) {
  return fs.promises.readFile(filePath, "utf8")
}

async function readFrontmatter(filePath: string) {
  const source = await readSource(filePath)
  const { frontmatter } = await compileMDX<WikiFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
    },
  })
  return frontmatter
}

export async function extractTocHeadings(filePath: string): Promise<WikiTocHeading[]> {
  const source = await readSource(filePath)
  const lines = source.split("\n")
  const headings: WikiTocHeading[] = []

  for (const line of lines) {
    const match = /^(##|###|####)\s+(.*)$/.exec(line.trim())
    if (!match) continue

    const level = match[1].length
    const text = match[2].trim()
    headings.push({
      id: slugify(text),
      text,
      level,
    })
  }

  return headings
}

function sortEntriesWithOrder(entries: WikiSidebarEntry[], order: string[]) {
  const orderMap = new Map<string, number>()
  order.forEach((key, index) => orderMap.set(key, index))

  return entries.sort((a, b) => {
    const aPos = orderMap.get(a.key) ?? Infinity
    const bPos = orderMap.get(b.key) ?? Infinity

    if (aPos !== bPos) return aPos - bPos
    return a.title.localeCompare(b.title)
  })
}

function getCategoryPageFile(parentDir: string, categoryName: string) {
  const folderIndex = path.join(parentDir, categoryName, "index.mdx")
  const siblingFile = path.join(parentDir, `${categoryName}.mdx`)

  if (exists(folderIndex)) return folderIndex
  if (exists(siblingFile)) return siblingFile
  return null
}

async function readTitleForPath(baseDir: string, relativePath: string) {
  const directFile = path.join(baseDir, `${relativePath}.mdx`)
  const directIndex = path.join(baseDir, relativePath, "index.mdx")

  if (exists(directFile)) {
    const frontmatter = await readFrontmatter(directFile)
    return frontmatter?.title
  }

  if (exists(directIndex)) {
    const frontmatter = await readFrontmatter(directIndex)
    return frontmatter?.title
  }

  return undefined
}

async function buildCategoryEntry(
  parentDir: string,
  categoryName: string,
  pathSegments: string[],
  instance: WikiInstance,
  version: string | null,
  order: string[]
): Promise<WikiSidebarCategory | null> {
  const dirPath = path.join(parentDir, categoryName)
  if (!exists(dirPath)) return null

  const categoryPageFile = getCategoryPageFile(parentDir, categoryName)
  const categoryFrontmatter = categoryPageFile
    ? await readFrontmatter(categoryPageFile)
    : undefined

  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true })
  const dirNames = new Set(entries.filter((e) => e.isDirectory()).map((e) => e.name))
  const items: WikiSidebarEntry[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const childCategory = await buildCategoryEntry(
        dirPath,
        entry.name,
        [...pathSegments, entry.name],
        instance,
        version,
        order
      )
      if (childCategory) items.push(childCategory)
      continue
    }

    if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue

    const basename = entry.name.replace(/\.mdx$/, "")

    if (basename === "index") continue
    if (dirNames.has(basename)) continue

    const relPath = [...pathSegments, basename].join("/")
    const frontmatter = await readFrontmatter(path.join(dirPath, entry.name))

    items.push({
      kind: "page",
      key: relPath,
      title: frontmatter?.title ?? humanizeSegment(basename),
      href: buildDocHref(instance, version, relPath),
    } satisfies WikiSidebarPage)
  }

  const sortedItems = sortEntriesWithOrder(items, order)

  if (!categoryPageFile && sortedItems.length === 0) return null

  const relPath = pathSegments.join("/")

  return {
    kind: "category",
    key: relPath,
    title: categoryFrontmatter?.title ?? humanizeSegment(categoryName),
    href: categoryPageFile ? buildDocHref(instance, version, relPath) : undefined,
    items: sortedItems,
  }
}

export async function getSidebarTree(
  instance: WikiInstance,
  version: string | null
): Promise<WikiSidebarTree> {
  const dir = getInstanceContentDir(instance, version)
  if (!exists(dir)) return { entries: [] }

  const order = getSidebarOrder(instance, version)
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })
  const dirNames = new Set(entries.filter((e) => e.isDirectory()).map((e) => e.name))
  const treeEntries: WikiSidebarEntry[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const category = await buildCategoryEntry(
        dir,
        entry.name,
        [entry.name],
        instance,
        version,
        order
      )
      if (category) treeEntries.push(category)
      continue
    }

    if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue

    const basename = entry.name.replace(/\.mdx$/, "")

    if (dirNames.has(basename)) continue

    const frontmatter = await readFrontmatter(path.join(dir, entry.name))

    // index.mdx at root is the home page - register it with the "home" doc slug
    const docPath = basename === "index" ? "home" : basename
    const key = basename === "index" ? "home" : basename

    treeEntries.push({
      kind: "page",
      key,
      title: frontmatter?.title ?? humanizeSegment(basename),
      href: buildDocHref(instance, version, docPath),
    } satisfies WikiSidebarPage)
  }

  return {
    entries: sortEntriesWithOrder(treeEntries, order),
  }
}

export async function resolveWikiDocFilePath(slug?: string[]) {
  const resolved = resolveWikiRoute(slug)
  if (!resolved) return null

  const dir = getInstanceContentDir(resolved.instance, resolved.version)
  if (!resolved.docSlug) return null

  const directFile = path.join(dir, `${resolved.docSlug}.mdx`)
  const categoryIndex = path.join(dir, resolved.docSlug, "index.mdx")

  if (exists(directFile)) return directFile
  if (exists(categoryIndex)) return categoryIndex

  // For "home" slug, also check for root index.mdx
  if (resolved.docSlug === "home") {
    const rootIndex = path.join(dir, "index.mdx")
    if (exists(rootIndex)) return rootIndex
  }

  return null
}

export async function getWikiBreadcrumbs(slug?: string[]): Promise<WikiBreadcrumbItem[]> {
  const resolved = resolveWikiRoute(slug)
  if (!resolved) return [{ label: "Wiki", href: "/wiki" }]

  const items: WikiBreadcrumbItem[] = [{ label: "Wiki", href: "/wiki" }]

  const isHomePage = resolved.docSlug === "home"

  items.push({
    label: resolved.instance.label,
    href: isHomePage
      ? undefined
      : buildBaseHomeHref(resolved.instance, resolved.version),
  })

  if (!resolved.docSlug || isHomePage) return items

  const dir = getInstanceContentDir(resolved.instance, resolved.version)
  const segments = resolved.docSlug.split("/").filter(Boolean)

  for (let i = 0; i < segments.length; i++) {
    const prefix = segments.slice(0, i + 1).join("/")
    const title = (await readTitleForPath(dir, prefix)) ?? humanizeSegment(segments[i])

    items.push({
      label: title,
      href:
        i === segments.length - 1
          ? undefined
          : buildDocHref(resolved.instance, resolved.version, prefix),
    })
  }

  return items
}

export async function getWikiDocTitle(slug?: string[]) {
  const filePath = await resolveWikiDocFilePath(slug)
  if (!filePath) return null

  const frontmatter = await readFrontmatter(filePath)
  return frontmatter?.title ?? null
}

export async function getAllWikiDocSlugs(): Promise<string[][]> {
  const allSlugs: string[][] = []

  async function collectMdxPaths(dir: string, prefix: string[] = []) {
    if (!exists(dir)) return

    const entries = await fs.promises.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        await collectMdxPaths(fullPath, [...prefix, entry.name])
        continue
      }

      if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue

      const basename = entry.name.replace(/\.mdx$/, "")

      if (basename === "index") {
        if (prefix.length > 0) {
          allSlugs.push(prefix)
        }
      } else {
        allSlugs.push([...prefix, basename])
      }
    }
  }

  for (const instance of WIKI_INSTANCES) {
    if (instance.versioned) {
      for (const version of instance.versions ?? []) {
        const baseDir = path.join(CONTENT_ROOT, instance.id, version.value)
        await collectMdxPaths(baseDir, [instance.id, version.value])
      }
    } else {
      const baseDir = path.join(CONTENT_ROOT, instance.id)
      await collectMdxPaths(baseDir, [instance.id])
    }
  }

  return allSlugs
}
