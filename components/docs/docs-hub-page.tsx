"use client"

import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { BookText } from "lucide-react"

import { Card } from "@/components/ui/card"
import { LineBullet } from "@/components/ui/line-bullet"
import { PROJECT_COLOR_SCHEMES } from "@/config/theme/colors"
import { DOCS_INSTANCES, type DocsInstance } from "@/config/content/docs"
import { buildBaseHomeHref } from "@/lib/docs/shared"
import { cn } from "@/lib/utils"

type CardThemeColors = {
  cardBgLight: string
  cardBgDark: string
  titleTextLight: string
  titleTextDark: string
  bulletBgLight: string
  bulletBgDark: string
  borderColorLight: string
  borderColorDark: string
  imageBorderLight: string
  imageBorderDark: string
}

const DOCS_CARD_IMAGES: Record<DocsInstance["id"], { light: string; dark: string }> = {
  railyard: {
    light: "/images/shared/railyard-light.png",
    dark: "/images/shared/railyard-dark.png",
  },
  "template-mod": {
    light: "/images/shared/template-mod-light.png",
    dark: "/images/shared/template-mod-dark.png",
  },
}

function getColors(instance: DocsInstance): CardThemeColors {
  const theme = PROJECT_COLOR_SCHEMES[instance.id]

  const cardBgLight = theme.primaryColor.light
  const cardBgDark = theme.primaryColor.dark
  const titleTextLight = theme.textColor.light
  const titleTextDark = theme.textColor.dark
  const bulletBgLight = theme.secondaryColor.light
  const bulletBgDark = theme.secondaryColor.dark
  const imageBorderLight = theme.secondaryColor.light
  const imageBorderDark = theme.secondaryColor.dark
  const borderColorLight = theme.secondaryColor.light
  const borderColorDark = theme.secondaryColor.dark

  return {
    cardBgLight,
    cardBgDark,
    titleTextLight,
    titleTextDark,
    bulletBgLight,
    bulletBgDark,
    borderColorLight,
    borderColorDark,
    imageBorderLight,
    imageBorderDark,
  }
}

function chunkRows<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function DocsCardImage({
  instanceId,
  borderColor,
}: {
  instanceId: DocsInstance["id"]
  borderColor: string
}) {
  const image = DOCS_CARD_IMAGES[instanceId]

  return (
    <div
      className="relative flex w-full aspect-video items-center justify-center overflow-hidden rounded-lg border-2"
      style={{ borderColor }}
    >
      <Image src={image.light} alt={`${instanceId} preview`} fill className="scale-[1.15] object-cover dark:hidden" />
      <Image src={image.dark} alt={`${instanceId} preview`} fill className="hidden scale-[1.15] object-cover dark:block" />
    </div>
  )
}

function DocsCardRow({ items }: { items: DocsInstance[] }) {
  return (
    <div className="grid items-stretch justify-center gap-7 [grid-template-columns:repeat(auto-fit,minmax(280px,340px))]">
      {items.map((instance) => (
        <DocsHubCard key={instance.id} instance={instance} />
      ))}
    </div>
  )
}

function DocsHubCard({ instance }: { instance: DocsInstance }) {
  const theme = PROJECT_COLOR_SCHEMES[instance.id]
  const {
    cardBgLight,
    cardBgDark,
    titleTextLight,
    titleTextDark,
    bulletBgLight,
    bulletBgDark,
    borderColorLight,
    borderColorDark,
    imageBorderLight,
    imageBorderDark,
  } = getColors(instance)

  return (
    <Link href={buildBaseHomeHref(instance)} className="block h-full outline-none">
      <Card
        className={cn(
          "group h-full overflow-hidden will-change-transform",
          "border ring-0 transition-transform duration-300",
          "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/5",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
          "hub-theme-card",
        )}
        style={
          {
            ["--hub-card-bg-light" as string]: cardBgLight,
            ["--hub-card-bg-dark" as string]: cardBgDark,
            ["--hub-card-title-light" as string]: titleTextLight,
            ["--hub-card-title-dark" as string]: titleTextDark,
            ["--hub-card-bullet-light" as string]: bulletBgLight,
            ["--hub-card-bullet-dark" as string]: bulletBgDark,
            ["--hub-card-border-light" as string]: borderColorLight,
            ["--hub-card-border-dark" as string]: borderColorDark,
            ["--hub-card-image-border-light" as string]: imageBorderLight,
            ["--hub-card-image-border-dark" as string]: imageBorderDark,
            ["--hub-card-text-light" as string]: theme.textColor.light,
            ["--hub-card-text-dark" as string]: theme.textColor.dark,
          } as CSSProperties
        }
      >
        <div className="flex h-full flex-col px-6 pb-5 pt-4">
          <div className="mb-4">
            <LineBullet
              theme={instance.id}
              text={instance.label}
              colorRole="secondaryColor"
              textRole="textColor"
              colorOverride={{ light: "var(--hub-card-bullet)", dark: "var(--hub-card-bullet)" }}
              textOverride={{ light: "var(--hub-card-text)", dark: "var(--hub-card-text)" }}
              shape="circle"
              size="md"
            />
          </div>

          <div className="mb-4">
            <DocsCardImage
              instanceId={instance.id}
              borderColor="var(--hub-card-image-border)"
            />
          </div>

          <p className="text-center text-sm leading-relaxed opacity-80" style={{ color: "var(--hub-card-text)" }}>
            {Docs_DESCRIPTIONS[instance.id]}
          </p>
        </div>
      </Card>
    </Link>
  )
}

const Docs_DESCRIPTIONS: Record<DocsInstance["id"], string> = {
  railyard:
    "The map and mod distribution platform for Subway Builder. Browse and publish community-made custom maps and mods.",
  "template-mod":
    "TypeScript template and framework documentation for building your own Subway Builder mods.",
}

export function DocsHubPage() {
  const rows = chunkRows(DOCS_INSTANCES, 3)

  return (
    <section className="px-7 pb-8 pt-8 sm:pb-8 sm:pt-8">
      <div className="mb-12 text-center">
        <div className="flex justify-center">
          <h1 className="inline-flex items-center gap-4 text-4xl font-black tracking-tight sm:text-5xl">
            <BookText aria-hidden="true" className="size-[1.02em]" />
            <span>Docs</span>
          </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground">
          Browse documentation for Subway Builder Modded projects.
        </p>
      </div>

      <div className="space-y-7">
        {rows.map((row, idx) => (
          <DocsCardRow key={idx} items={row} />
        ))}
      </div>
    </section>
  )
}



