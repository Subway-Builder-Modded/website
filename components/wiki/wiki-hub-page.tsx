"use client"

import Link from "next/link"

import { Card } from "@/components/ui/card"
import { LineBullet } from "@/components/ui/line-bullet"
import { WIKI_INSTANCES, type WikiInstance } from "@/lib/wiki-config"
import { buildBaseHomeHref } from "@/lib/wiki-shared"
import { cn } from "@/lib/utils"

type WikiExtra = {
  bulletColor: string
  bulletTextColor: string
  imageBorderColor: string
  description: string
}

const WIKI_EXTRA: Record<string, WikiExtra> = {
  railyard: {
    bulletColor: "#34d399",
    bulletTextColor: "#ffffff",
    imageBorderColor: "#34d399",
    description:
      "The official map distribution platform for Subway Builder. Browse and publish community-made custom maps.",
  },
  "template-mod": {
    bulletColor: "#a78bfa",
    bulletTextColor: "#ffffff",
    imageBorderColor: "#a78bfa",
    description:
      "TypeScript template and framework documentation for building your own Subway Builder mods.",
  },
  "creating-custom-maps": {
    bulletColor: "#60a5fa",
    bulletTextColor: "#ffffff",
    imageBorderColor: "#60a5fa",
    description:
      "A complete guide to creating, packaging, and distributing your own custom Subway Builder maps.",
  },
  contributing: {
    bulletColor: "#fbbf24",
    bulletTextColor: "#000000",
    imageBorderColor: "#fbbf24",
    description:
      "Learn how to contribute to Subway Builder Modded — from documentation and guides to translations.",
  },
  legacy: {
    bulletColor: "#fb7185",
    bulletTextColor: "#ffffff",
    imageBorderColor: "#fb7185",
    description:
      "Legacy documentation covering older installation methods and compatibility guides for previous releases.",
  },
}

function chunkRows<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function WikiCardImagePlaceholder({
  instance,
  imageBorderColor,
}: {
  instance: WikiInstance
  imageBorderColor: string
}) {
  const Icon = instance.icon

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg",
        "flex aspect-video flex-col items-center justify-center gap-2",
        "border-2",
        "bg-black/5 dark:bg-white/5",
      )}
      style={{ borderColor: imageBorderColor }}
    >
      <Icon className={cn("size-8 opacity-40", instance.accentClassName)} />
      <span className={cn("text-xs font-medium opacity-30", instance.accentClassName)}>
        Preview coming soon
      </span>
    </div>
  )
}

function WikiCardRow({ items }: { items: WikiInstance[] }) {
  return (
    <div className="grid items-stretch justify-center gap-7 [grid-template-columns:repeat(auto-fit,minmax(280px,340px))]">
      {items.map((instance) => {
        const extra = WIKI_EXTRA[instance.id]
        return <WikiHubCard key={instance.id} instance={instance} extra={extra} />
      })}
    </div>
  )
}

function WikiHubCard({ instance, extra }: { instance: WikiInstance; extra: WikiExtra }) {
  return (
    <Link href={buildBaseHomeHref(instance)} className="block h-full outline-none">
      <Card
        className={cn(
          "group h-full overflow-hidden will-change-transform",
          "border ring-0 transition-transform duration-300",
          "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/5",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
          instance.accentSurfaceClassName,
        )}
      >
        <div className="flex h-full flex-col px-6 pb-5 pt-4">
          {/* Line bullet with instance label as text */}
          <div className="mb-4">
            <LineBullet
              bullet={instance.label}
              color={extra.bulletColor}
              textColor={extra.bulletTextColor}
              shape="circle"
              size="md"
            />
          </div>

          {/* Placeholder image */}
          <div className="mb-4">
            <WikiCardImagePlaceholder
              instance={instance}
              imageBorderColor={extra.imageBorderColor}
            />
          </div>

          {/* Description */}
          <p className={cn("text-sm leading-relaxed opacity-80", instance.accentClassName)}>
            {extra.description}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export function WikiHubPage() {
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
          <WikiCardRow key={idx} items={row} />
        ))}
      </div>
    </section>
  )
}
