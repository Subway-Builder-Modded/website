"use client"

import Link from "next/link"
import { useTheme } from "next-themes"

import { Card } from "@/components/ui/card"
import { LineBullet } from "@/components/ui/line-bullet"
import { WIKI_INSTANCES, type WikiInstance } from "@/lib/wiki-config"
import { buildBaseHomeHref } from "@/lib/wiki-shared"
import { cn } from "@/lib/utils"

// ─── Color helpers ────────────────────────────────────────────────────────────

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

/** Returns #000000 or #ffffff, whichever is more readable on the given background. */
function pickTextColor(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.72 ? "#000000" : "#ffffff"
}

/**
 * Derives all card/bullet colors for a wiki instance.
 *
 * Dark mode:  card bg = secondary, card text = primary
 * Light mode: card bg = primary,   card text = secondary
 *
 * The bullet is always the inverse of the card (so it stands out on both
 * backgrounds): dark bg → primary bullet; light bg → secondary bullet.
 */
function getColors(instance: WikiInstance, isDark: boolean) {
  const { primaryHex, secondaryHex } = instance

  const cardBg = isDark ? secondaryHex : primaryHex
  const cardText = isDark ? primaryHex : secondaryHex
  const bulletBg = isDark ? primaryHex : secondaryHex
  const bulletText = pickTextColor(bulletBg)
  const borderColor = hexAlpha(cardText, 0.3)

  return { cardBg, cardText, bulletBg, bulletText, borderColor }
}

// ─── Components ───────────────────────────────────────────────────────────────

function chunkRows<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function WikiCardImagePlaceholder({
  instance,
  borderColor,
  iconColor,
}: {
  instance: WikiInstance
  borderColor: string
  iconColor: string
}) {
  const Icon = instance.icon

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

function WikiCardRow({ items, isDark }: { items: WikiInstance[]; isDark: boolean }) {
  return (
    <div className="grid items-stretch justify-center gap-7 [grid-template-columns:repeat(auto-fit,minmax(280px,340px))]">
      {items.map((instance) => (
        <WikiHubCard key={instance.id} instance={instance} isDark={isDark} />
      ))}
    </div>
  )
}

function WikiHubCard({ instance, isDark }: { instance: WikiInstance; isDark: boolean }) {
  const { cardBg, cardText, bulletBg, bulletText, borderColor } = getColors(instance, isDark)

  return (
    <Link href={buildBaseHomeHref(instance)} className="block h-full outline-none">
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
          {/* Line bullet with instance label — always inverse of card for contrast */}
          <div className="mb-4">
            <LineBullet
              bullet={instance.label}
              color={bulletBg}
              textColor={bulletText}
              shape="circle"
              size="md"
            />
          </div>

          {/* Placeholder image — border matches card text color */}
          <div className="mb-4">
            <WikiCardImagePlaceholder
              instance={instance}
              borderColor={cardText}
              iconColor={cardText}
            />
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed opacity-80" style={{ color: cardText }}>
            {WIKI_DESCRIPTIONS[instance.id]}
          </p>
        </div>
      </Card>
    </Link>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const WIKI_DESCRIPTIONS: Record<string, string> = {
  railyard:
    "The official map distribution platform for Subway Builder. Browse and publish community-made custom maps.",
  "template-mod":
    "TypeScript template and framework documentation for building your own Subway Builder mods.",
  "creating-custom-maps":
    "A complete guide to creating, packaging, and distributing your own custom Subway Builder maps.",
  contributing:
    "Learn how to contribute to Subway Builder Modded — from documentation and guides to translations.",
  legacy:
    "Legacy documentation covering older installation methods and compatibility guides for previous releases.",
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function WikiHubPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"
  const rows = chunkRows(WIKI_INSTANCES, 3)

  return (
    <section className="px-7 pb-12 pt-16 sm:pb-16 sm:pt-24">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Wiki</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Browse documentation for Subway Builder Modded projects.
        </p>
      </div>

      <div className="space-y-7">
        {rows.map((row, idx) => (
          <WikiCardRow key={idx} items={row} isDark={isDark} />
        ))}
      </div>
    </section>
  )
}
