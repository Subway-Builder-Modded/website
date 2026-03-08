import "server-only"

import fs from "node:fs"
import path from "node:path"
import { compileMDX } from "next-mdx-remote/rsc"
import type { UpdateProjectId, UpdateTag } from "@/lib/updates-config"

const CONTENT_ROOT = path.join(process.cwd(), "content", "updates")

export type UpdateFrontmatter = {
  title: string
  date: string
  summary?: string
  tag?: UpdateTag
}

export type UpdateEntry = {
  projectId: UpdateProjectId
  version: string
  slug: string
  filePath: string
  frontmatter: UpdateFrontmatter
}

function exists(filePath: string) {
  return fs.existsSync(filePath)
}

function normalizeVersion(version: string) {
  return version.toLowerCase().startsWith("v") ? version : `v${version}`
}

function parseSemver(version: string) {
  const clean = normalizeVersion(version).slice(1)
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(clean)
  if (!match) return null
  return match.slice(1).map(Number) as [number, number, number]
}

function compareVersionsDesc(a: string, b: string) {
  const aSemver = parseSemver(a)
  const bSemver = parseSemver(b)

  if (aSemver && bSemver) {
    for (let i = 0; i < 3; i += 1) {
      if (aSemver[i] !== bSemver[i]) return bSemver[i] - aSemver[i]
    }
    return 0
  }

  return b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" })
}

async function readFrontmatter(filePath: string) {
  const source = await fs.promises.readFile(filePath, "utf8")
  const { frontmatter } = await compileMDX<UpdateFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
    },
  })

  return frontmatter
}

export async function getUpdatesForProject(projectId: UpdateProjectId) {
  const projectDir = path.join(CONTENT_ROOT, projectId)
  if (!exists(projectDir)) return []

  const entries = await fs.promises.readdir(projectDir, { withFileTypes: true })
  const updates = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
      .map(async (entry) => {
        const slug = entry.name.replace(/\.mdx$/, "")
        const filePath = path.join(projectDir, entry.name)
        const frontmatter = await readFrontmatter(filePath)

        return {
          projectId,
          version: normalizeVersion(slug),
          slug,
          filePath,
          frontmatter,
        } satisfies UpdateEntry
      })
  )

  return updates.sort((a, b) => compareVersionsDesc(a.version, b.version))
}

export async function getAllUpdateParams() {
  const projects = await fs.promises.readdir(CONTENT_ROOT, { withFileTypes: true })
  const params: { project: string; version: string }[] = []

  for (const project of projects) {
    if (!project.isDirectory()) continue

    const projectId = project.name as UpdateProjectId
    const updates = await getUpdatesForProject(projectId)

    for (const update of updates) {
      params.push({ project: projectId, version: update.slug })
    }
  }

  return params
}

export async function getUpdateEntry(projectId: UpdateProjectId, version: string) {
  const slug = version.toLowerCase().endsWith(".mdx") ? version.replace(/\.mdx$/, "") : version
  const filePath = path.join(CONTENT_ROOT, projectId, `${slug}.mdx`)
  if (!exists(filePath)) return null

  const frontmatter = await readFrontmatter(filePath)

  return {
    projectId,
    slug,
    version: normalizeVersion(slug),
    filePath,
    frontmatter,
  } satisfies UpdateEntry
}
