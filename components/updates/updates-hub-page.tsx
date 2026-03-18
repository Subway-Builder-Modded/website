"use client"

import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { Megaphone } from "lucide-react"
import { Card } from "@/components/ui/card"
import { LineBullet } from "@/components/ui/line-bullet"
import { PROJECT_COLOR_SCHEMES } from "@/config/theme/colors"
import { UPDATE_PROJECTS, type UpdateProject } from "@/config/content/updates"
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

const UPDATE_CARD_IMAGES: Record<UpdateProject["id"], { light: string; dark: string }> = {
  railyard: {
    light: "/images/shared/railyard-light.png",
    dark: "/images/shared/railyard-dark.png",
  },
  "template-mod": {
    light: "/images/shared/template-mod-light.png",
    dark: "/images/shared/template-mod-dark.png",
  },
}

function getColors(project: UpdateProject): CardThemeColors {
  const cardBgLight = project.secondaryHex.light
  const cardBgDark = project.secondaryHex.dark
  const titleTextLight = project.textHex.light
  const titleTextDark = project.textHex.dark
  const bulletBgLight = project.tertiaryHex.light
  const bulletBgDark = project.tertiaryHex.dark
  const imageBorderLight = project.tertiaryHex.light
  const imageBorderDark = project.tertiaryHex.dark
  const borderColorLight = project.tertiaryHex.light
  const borderColorDark = project.tertiaryHex.dark

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

function UpdateCardImage({
  projectId,
  borderColor,
}: {
  projectId: UpdateProject["id"]
  borderColor: string
}) {
  const image = UPDATE_CARD_IMAGES[projectId]

  return (
    <div
      className="relative flex w-full aspect-video items-center justify-center overflow-hidden rounded-lg border-2"
      style={{ borderColor }}
    >
      <Image src={image.light} alt={`${projectId} preview`} fill className="scale-[1.15] object-cover dark:hidden" />
      <Image src={image.dark} alt={`${projectId} preview`} fill className="hidden scale-[1.15] object-cover dark:block" />
    </div>
  )
}

function UpdateHubCard({
  project,
}: {
  project: UpdateProject
}) {
  const theme = PROJECT_COLOR_SCHEMES[project.id]
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
  } = getColors(project)

  return (
    <Link href={project.basePath} className="block h-full outline-none">
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
            ["--hub-card-text-light" as string]: theme.textHex.light,
            ["--hub-card-text-dark" as string]: theme.textHex.dark,
          } as CSSProperties
        }
      >
        <div className="flex h-full flex-col px-6 pb-5 pt-4">
          <div className="mb-4">
            <LineBullet
              theme={project.id}
              text={project.label}
              colorRole="tertiaryHex"
              textRole="textHex"
              colorOverride={{ light: "var(--hub-card-bullet)", dark: "var(--hub-card-bullet)" }}
              textOverride={{ light: "var(--hub-card-text)", dark: "var(--hub-card-text)" }}
              shape="circle"
              size="md"
            />
          </div>

          <div className="mb-4">
            <UpdateCardImage
              projectId={project.id}
              borderColor="var(--hub-card-image-border)"
            />
          </div>

          <p className="text-center text-sm leading-relaxed opacity-80" style={{ color: "var(--hub-card-text)" }}>
            {project.description}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export function UpdatesHubPage() {
  return (
    <section className="px-7 pb-8 pt-8 sm:pb-8 sm:pt-8">
      <div className="mb-12 text-center">
        <div className="flex justify-center">
          <h1 className="inline-flex items-center gap-4 text-4xl font-black tracking-tight sm:text-5xl">
            <Megaphone aria-hidden="true" className="size-[1.02em]" />
            <span>Updates &amp; Changelogs</span>
          </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground">
          Stay up to date with the latest releases from Subway Builder Modded.
        </p>
      </div>

      <div className="grid items-stretch justify-center gap-7 [grid-template-columns:repeat(auto-fit,minmax(280px,340px))]">
        {UPDATE_PROJECTS.map((project) => (
          <UpdateHubCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}

