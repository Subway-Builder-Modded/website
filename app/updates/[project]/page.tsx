import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ReleaseTagBadge } from "@/components/updates/release-tag-badge"
import { cn } from "@/lib/utils"
import { getUpdateProjectById, UPDATE_PROJECTS } from "@/lib/updates-config"
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
  tertiaryHex,
}: {
  update: UpdateMeta
  isLatest: boolean
  tertiaryHex: { light: string; dark: string }
}) {
  return (
    <Link href={update.href} className="block outline-none">
      <Card
        className={cn(
          "group flex flex-col gap-3 px-6 py-5",
          "sm:flex-row sm:items-center sm:justify-between sm:gap-6",
          "border border-border/60 border-l-[3px] border-l-[var(--version-card-border-left-light)] dark:border-l-[var(--version-card-border-left-dark)] bg-card/60",
          "transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out",
          "hover:-translate-y-0.5 hover:border-border hover:bg-card",
          "hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.04)]",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
        )}
        style={{
          ["--version-card-border-left-light" as string]: tertiaryHex.light,
          ["--version-card-border-left-dark" as string]: tertiaryHex.dark,
        }}
      >
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xl font-bold leading-tight text-foreground">
            {update.title}
          </span>
          {update.date ? (
            <span className="text-sm text-muted-foreground">{update.date}</span>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {isLatest && <ReleaseTagBadge kind="latest" />}
          <ReleaseTagBadge kind={update.tag} />
          <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground sm:ml-1" />
        </div>
      </Card>
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
    <section className="px-7 pb-8 pt-8">
      <div className="mb-8">
        <Link
          href="/updates"
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
      <div className="mb-10 -mt-10 text-center">
        <div className="mx-auto mb-4 max-w-xs">
          <div
            className="flex min-h-12 w-full items-center justify-center rounded-2xl px-6 py-3 font-mta text-2xl font-bold bg-[var(--project-secondary-light)] text-[var(--project-text-light)] dark:bg-[var(--project-secondary-dark)] dark:text-[var(--project-text-dark)]"
            style={{
              ["--project-secondary-light" as string]: project.secondaryHex.light,
              ["--project-secondary-dark" as string]: project.secondaryHex.dark,
              ["--project-text-light" as string]: project.textHex.light,
              ["--project-text-dark" as string]: project.textHex.dark,
            }}
          >
            {project.label}
          </div>
        </div>
        <p className="text-base text-muted-foreground">{project.description}</p>
      </div>

      {updates.length === 0 ? (
        <p className="text-center text-muted-foreground">No updates published yet.</p>
      ) : (
        <div className="mx-auto flex max-w-4xl flex-col gap-3">
          {updates.map((update, idx) => (
            <VersionCard
              key={update.version}
              update={update}
              isLatest={idx === 0}
              tertiaryHex={project.tertiaryHex}
            />
          ))}
        </div>
      )}
    </section>
  )
}
