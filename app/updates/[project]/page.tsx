import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { LineBullet } from "@/components/ui/line-bullet"
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

function hexAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function UpdateVersionCard({
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
  const borderColor = hexAlpha(primaryHex, 0.3)
  const hoverBorderColor = hexAlpha(primaryHex, 0.55)

  return (
    <Link href={update.href} className="block outline-none">
      <Card
        className={cn(
          "group flex items-center justify-between px-5 py-4",
          "border bg-card/60 transition-all duration-200",
          "hover:-translate-y-0.5 hover:bg-card hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.04)]",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
        )}
        style={{ borderColor, ["--hover-border" as string]: hoverBorderColor }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-bold text-foreground">{update.title}</span>
          {update.date ? (
            <span className="text-sm text-muted-foreground">{update.date}</span>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isLatest && (
            <Badge
              className="font-semibold"
              style={{
                backgroundColor: "#1335A1",
                color: "#E3E3E3",
                border: "none",
              }}
            >
              latest
            </Badge>
          )}
          {update.tag === "beta" ? (
            <Badge
              className="font-semibold"
              style={{
                backgroundColor: "#F5CF46",
                color: "#000000",
                border: "none",
              }}
            >
              beta
            </Badge>
          ) : (
            <Badge
              className="font-semibold"
              style={{
                backgroundColor: primaryHex,
                color: secondaryHex,
                border: "none",
              }}
            >
              release
            </Badge>
          )}
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
    <div className="px-7 pb-8 pt-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/updates"
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
      <div className="mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <div
            className="inline-flex items-center rounded-[20px] px-6 py-3 transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: project.midHex }}
          >
            <span
              className="text-2xl font-bold sm:text-3xl"
              style={{ color: "#E3E3E3" }}
            >
              {project.label}
            </span>
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          {project.label} Changelogs
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{project.description}</p>
      </div>

      {/* Version list */}
      {updates.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No updates published yet.
        </p>
      ) : (
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {updates.map((update, idx) => (
            <UpdateVersionCard
              key={update.version}
              update={update}
              isLatest={idx === 0}
              primaryHex={project.primaryHex}
              secondaryHex={project.secondaryHex}
            />
          ))}
        </div>
      )}
    </div>
  )
}
