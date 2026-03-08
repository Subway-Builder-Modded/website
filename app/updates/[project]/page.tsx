import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getUpdateProjectById, UPDATE_PROJECTS, type UpdateTag } from "@/lib/updates-config"
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

// ── GitHub-style tag badge ────────────────────────────────────────────────────
//
// Colours from GitHub's Primer design system:
//   Latest  → green  #1f883d  (GitHub "Latest release" chip)
//   Release → blue   #0969da  (GitHub default/stable)
//   Beta    → amber  #9a6700  (GitHub "Pre-release" chip)
//   Alpha   → red    #cf222e  (GitHub danger/experimental)

const TAG_COLORS: Record<UpdateTag | "latest", string> = {
  latest:  "#1f883d",
  release: "#0969da",
  beta:    "#9a6700",
  alpha:   "#cf222e",
}

const TAG_LABELS: Record<UpdateTag | "latest", string> = {
  latest:  "Latest",
  release: "Release",
  beta:    "Beta",
  alpha:   "Alpha",
}

function TagBadge({ kind }: { kind: UpdateTag | "latest" }) {
  return (
    <Badge
      className="shrink-0 border-0 font-semibold"
      style={{
        backgroundColor: TAG_COLORS[kind],
        color: "#ffffff",
        height: "auto",
        padding: "0.35rem 0.85rem",
        fontSize: "0.9375rem",
        lineHeight: "1.4",
      }}
    >
      {TAG_LABELS[kind]}
    </Badge>
  )
}

// ── version card ─────────────────────────────────────────────────────────────

function VersionCard({
  update,
  isLatest,
  primaryHex,
}: {
  update: UpdateMeta
  isLatest: boolean
  primaryHex: string
}) {
  return (
    <Link href={update.href} className="block outline-none">
      <Card
        className={cn(
          // Stacks vertically on small screens, side-by-side on sm+
          "group flex flex-col gap-3 px-6 py-5",
          "sm:flex-row sm:items-center sm:justify-between sm:gap-6",
          "border border-border/60 bg-card/60",
          "transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out",
          "hover:-translate-y-0.5 hover:border-border hover:bg-card",
          "hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.04)]",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
        )}
        style={{ borderLeftColor: primaryHex, borderLeftWidth: "3px" }}
      >
        {/* Left — title (large) + date, always left-aligned */}
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xl font-bold leading-tight text-foreground">
            {update.title}
          </span>
          {update.date ? (
            <span className="text-sm text-muted-foreground">{update.date}</span>
          ) : null}
        </div>

        {/* Right — badges inline, right-aligned on sm+ */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {isLatest && <TagBadge kind="latest" />}
          <TagBadge kind={update.tag} />
          <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground sm:ml-1" />
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

      {/* Header — coloured pill is the title; redundant h1 removed */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 max-w-xs">
          <div
            className="flex min-h-10 w-full items-center justify-center rounded-2xl px-4 py-2 font-mta text-xl font-bold"
            style={{ backgroundColor: project.midHex, color: "#E3E3E3" }}
          >
            {project.label}
          </div>
        </div>
        <p className="text-base text-muted-foreground">{project.description}</p>
      </div>

      {/* Version list — max-w-4xl for wider cards across the viewport */}
      {updates.length === 0 ? (
        <p className="text-center text-muted-foreground">No updates published yet.</p>
      ) : (
        <div className="mx-auto flex max-w-4xl flex-col gap-3">
          {updates.map((update, idx) => (
            <VersionCard
              key={update.version}
              update={update}
              isLatest={idx === 0}
              primaryHex={project.primaryHex}
            />
          ))}
        </div>
      )}
    </section>
  )
}
