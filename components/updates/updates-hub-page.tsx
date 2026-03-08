"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Card } from "@/components/ui/card"
import { LineBullet } from "@/components/ui/line-bullet"
import { UPDATE_PROJECTS, type UpdateProject } from "@/lib/updates-config"
import { cn } from "@/lib/utils"

function hexToRgb(hex: string) {
  const h = hex.replace("#", "")
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function hexAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function getColors(project: UpdateProject, isDark: boolean) {
  const cardBg = isDark ? project.secondaryHex : project.primaryHex
  const cardText = isDark ? project.primaryHex : project.secondaryHex
  const bulletBg = project.midHex
  const bulletText = isDark ? project.secondaryHex : project.primaryHex
  const borderColor = hexAlpha(cardText, 0.3)

  return { cardBg, cardText, bulletBg, bulletText, borderColor }
}

function UpdateProjectCard({
  project,
  isDark,
}: {
  project: UpdateProject
  isDark: boolean
}) {
  const { cardBg, cardText, bulletBg, bulletText, borderColor } = getColors(project, isDark)
  const Icon = project.icon

  return (
    <Link href={project.basePath} className="block h-full outline-none">
      <Card
        className={cn(
          "group h-full overflow-hidden will-change-transform",
          "border ring-0 transition-transform duration-300",
          "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/5",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
        )}
        style={{ backgroundColor: cardBg, borderColor }}
      >
        <div className="flex h-full flex-col px-6 pb-8 pt-6">
          {/* Header with bullet + title */}
          <div className="mb-5 flex items-center gap-3">
            <LineBullet
              bullet={project.label}
              color={bulletBg}
              textColor={bulletText}
              shape="circle"
              size="md"
            />
          </div>

          {/* Icon placeholder area */}
          <div
            className="relative mb-5 flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border-2 bg-black/5"
            style={{ borderColor: hexAlpha(cardText, 0.2) }}
          >
            <Icon className="size-10 opacity-35" style={{ color: cardText }} />
            <span
              className="text-sm font-medium opacity-25"
              style={{ color: cardText }}
            >
              {project.label}
            </span>
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed opacity-80"
            style={{ color: cardText }}
          >
            {project.description}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export function UpdatesHubPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"

  return (
    <section className="px-7 pb-8 pt-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Updates &amp; Changelogs
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Stay up to date with the latest releases from Subway Builder Modded.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-7 sm:grid-cols-2">
        {UPDATE_PROJECTS.map((project) => (
          <UpdateProjectCard key={project.id} project={project} isDark={isDark} />
        ))}
      </div>
    </section>
  )
}
