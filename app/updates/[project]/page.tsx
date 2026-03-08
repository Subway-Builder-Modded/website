import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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

// ── version card ─────────────────────────────────────────────────────────────

function VersionCard({
  update,
  isLatest,
  primaryHex,
  secondaryHex,
}: {
  update: UpdateMeta
  isLatest: boolean
  primaryHex: string
  secondaryHex: string
}) {
  return (
    <Link href={update.href} className="block outline-none">
      <Card
        className={cn(
          "group flex items-center justify-between gap-4 px-5 py-4",
          "border border-border/60 bg-card/60",
          "transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out",
          "hover:-translate-y-0.5 hover:border-border hover:bg-card",
          "hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.04)]",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
        )}
        // Subtle left accent strip using the project primary colour
        style={{
          borderLeftColor: primaryHex,
          borderLeftWidth: "3px",
        }}
      >
        {/* Left: title + date */}
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-base font-bold text-foreground">
            {update.title}
          </span>
          {update.date ? (
            <span className="text-sm text-muted-foreground">{update.date}</span>
          ) : null}
        </div>

        {/* Right: badges + chevron */}
        <div className="flex shrink-0 items-center gap-2">
          {isLatest && (
            <Badge
              className="border-0 font-semibold"
              style={{ backgroundColor: "#1335A1", color: "#E3E3E3" }}
            >
              latest
            </Badge>
          )}

          {update.tag === "beta" ? (
            <Badge
              className="border-0 font-semibold"
              style={{ backgroundColor: "#F5CF46", color: "#000000" }}
            >
              beta
            </Badge>
          ) : (
            <Badge
              className="border-0 font-semibold"
              style={{ backgroundColor: primaryHex, color: secondaryHex }}
            >
              release
            </Badge>
          )}

          <ChevronRight className="size-4 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
        </div>
      </Card>
    </Link>
  )
}

// ── page ─────────────────────────────────────────────────────────────────────

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
      {/* Back button */}
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

      {/* Header — mirrors wiki hub section header style */}
      <div className="mb-10 text-center">
        {/* Full-width title banner, same treatment as hub card */}
        <div className="mx-auto mb-4 max-w-xs">
          <div
            className="flex min-h-10 w-full items-center justify-center rounded-2xl px-4 py-2 font-mta text-xl font-bold"
            style={{ backgroundColor: project.midHex, color: "#E3E3E3" }}
          >
            {project.label}
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          {project.label} Changelogs
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{project.description}</p>
      </div>

      {/* Version list */}
      {updates.length === 0 ? (
        <p className="text-center text-muted-foreground">No updates published yet.</p>
      ) : (
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {updates.map((update, idx) => (
            <VersionCard
              key={update.version}
              update={update}
              isLatest={idx === 0}
              primaryHex={project.primaryHex}
              secondaryHex={project.secondaryHex}
            />
          ))}
        </div>
      )}
    </section>
  )
}
