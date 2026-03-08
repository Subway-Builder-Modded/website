"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Card } from "@/components/ui/card"
import { UPDATE_PROJECTS, type UpdateProject } from "@/lib/updates-config"
import { cn } from "@/lib/utils"

// ── colour helpers (identical to wiki-hub-page.tsx) ─────────────────────────

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

/**
 * Dark:  text = primaryHex (bright), bg = secondaryHex (deep)
 * Light: text = secondaryHex (deep), bg = primaryHex (bright)
 * mid stays constant – used for the title banner background
 */
function getColors(project: UpdateProject, isDark: boolean) {
  const cardBg    = isDark ? project.secondaryHex : project.primaryHex
  const cardText  = isDark ? project.primaryHex   : project.secondaryHex
  const bulletBg  = project.midHex
  const bulletText = isDark ? project.secondaryHex : project.primaryHex
  const borderColor = hexAlpha(cardText, 0.3)

  return { cardBg, cardText, bulletBg, bulletText, borderColor }
}

// ── image placeholder (same as wiki) ────────────────────────────────────────

function UpdateCardImagePlaceholder({
  project,
  borderColor,
  iconColor,
}: {
  project: UpdateProject
  borderColor: string
  iconColor: string
}) {
  const Icon = project.icon

  return (
    <div
      className="relative flex w-full aspect-video flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 bg-black/5 dark:bg-white/5"
      style={{ borderColor }}
    >
      <Icon className="size-8 opacity-40" style={{ color: iconColor }} />
      <span className="text-xs font-medium opacity-30" style={{ color: iconColor }}>
        Preview coming soon
      </span>
    </div>
  )
}

// ── individual hub card ──────────────────────────────────────────────────────

function UpdateHubCard({
  project,
  isDark,
}: {
  project: UpdateProject
  isDark: boolean
}) {
  const { cardBg, cardText, bulletBg, bulletText, borderColor } = getColors(project, isDark)

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
        <div className="flex h-full flex-col px-6 pb-5 pt-4">
          {/*
            Title banner — spans the full card width with rounded-2xl pill,
            mirrors the LineBullet font and colour treatment from the wiki hub.
          */}
          <div className="mb-4">
            <div
              className="flex min-h-10 w-full items-center justify-center rounded-2xl px-4 py-2 font-mta text-xl font-bold"
              style={{ backgroundColor: bulletBg, color: bulletText }}
            >
              {project.label}
            </div>
          </div>

          {/* Image placeholder */}
          <div className="mb-4">
            <UpdateCardImagePlaceholder
              project={project}
              borderColor={cardText}
              iconColor={cardText}
            />
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed opacity-80" style={{ color: cardText }}>
            {project.description}
          </p>
        </div>
      </Card>
    </Link>
  )
}

// ── page ─────────────────────────────────────────────────────────────────────

export function UpdatesHubPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"

  return (
    <section className="px-7 pb-8 pt-8 sm:pb-8 sm:pt-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Updates &amp; Changelogs
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Stay up to date with the latest releases from Subway Builder Modded.
        </p>
      </div>

      {/* Same auto-fit grid as wiki hub rows */}
      <div className="grid items-stretch justify-center gap-7 [grid-template-columns:repeat(auto-fit,minmax(280px,340px))]">
        {UPDATE_PROJECTS.map((project) => (
          <UpdateHubCard key={project.id} project={project} isDark={isDark} />
        ))}
      </div>
    </section>
  )
}
