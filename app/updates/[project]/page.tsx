import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight } from "lucide-react"
import type { CSSProperties } from "react"

import { HubPageHeader } from "@/components/hub/hub-page-header"
import { ReleaseTagBadge } from "@/components/updates/release-tag-badge"
import { getUpdateProjectById, UPDATE_PROJECTS } from "@/config/content/updates"
import { UPDATES_PAGE_COPY } from "@/config/ui/site-content"
import { hexAlpha } from "@/lib/color"
import { getAllUpdatesForProject, type UpdateMeta } from "@/lib/updates.server"

export const dynamicParams = false

export async function generateStaticParams() {
  return UPDATE_PROJECTS.map((p) => ({ project: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ project: string }>
}): Promise<Metadata> {
  const { project: projectId } = await params
  const project = getUpdateProjectById(projectId)

  if (!project) return { title: "Updates | Subway Builder Modded" }

  return {
    title: `${project.label} Changelogs | Subway Builder Modded`,
    description: `Changelogs and release notes for ${project.label}.`,
  }
}

function VersionCard({
  update,
  isLatest,
  accent,
}: {
  update: UpdateMeta
  isLatest: boolean
  accent: { light: string; dark: string }
}) {
  return (
    <Link href={update.href} className="group block outline-none">
      <article
        className="relative overflow-hidden rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 sm:px-5 sm:py-4"
        style={
          {
            ["--update-accent-light" as string]: accent.light,
            ["--update-accent-dark" as string]: accent.dark,
            ["--update-ring-light" as string]: hexAlpha(accent.light, 0.38),
            ["--update-ring-dark" as string]: hexAlpha(accent.dark, 0.44),
            ["--update-soft-light" as string]: hexAlpha(accent.light, 0.2),
            ["--update-soft-dark" as string]: hexAlpha(accent.dark, 0.24),
          } as CSSProperties
        }
      >
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-[var(--update-ring-light)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:ring-[var(--update-ring-dark)]" />
        <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-[var(--update-accent-light)] dark:bg-[var(--update-accent-dark)]" />
        <span className="pointer-events-none absolute -right-16 -top-20 size-40 rounded-full bg-[var(--update-soft-light)] opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100 dark:bg-[var(--update-soft-dark)]" />

        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold leading-tight text-foreground">{update.title}</h2>
            {update.date ? <p className="mt-0.5 text-sm text-muted-foreground">{update.date}</p> : null}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:justify-end">
            {isLatest ? <ReleaseTagBadge kind="latest" /> : null}
            <ReleaseTagBadge kind={update.tag} />
            <ChevronRight className="size-4 text-muted-foreground/60 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  )
}

export default async function ProjectHubPage({
  params,
}: {
  params: Promise<{ project: string }>
}) {
  const { project: projectId } = await params
  const project = getUpdateProjectById(projectId)
  if (!project) notFound()

  const updates = await getAllUpdatesForProject(projectId)

  return (
    <section className="relative px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="mb-7">
          <Link
            href="/updates"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/70 bg-card px-3 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-sm"
          >
            <ArrowLeft className="size-4" />
            {UPDATES_PAGE_COPY.backLabel}
          </Link>
        </div>

        <HubPageHeader
          icon={project.icon}
          title={project.label}
          description={project.description}
          className="mb-8"
        />

        {updates.length === 0 ? (
          <div className="rounded-xl border border-border/70 bg-card p-8 text-center text-muted-foreground">
            {UPDATES_PAGE_COPY.emptyProjectText}
          </div>
        ) : (
          <div className="mx-auto flex max-w-4xl flex-col gap-3">
            {updates.map((update, idx) => (
              <VersionCard
                key={update.version}
                update={update}
                isLatest={idx === 0}
                accent={project.accentColor}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
