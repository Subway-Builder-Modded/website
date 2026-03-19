import Image from "next/image"
import type { CSSProperties } from "react"

import { HomeLinkButton } from "@/components/home/home-link-button"
import type { HomeProjectCard } from "@/config/site/homepage"
import { PROJECT_COLOR_SCHEMES } from "@/config/theme/colors"
import { hexAlpha } from "@/lib/color"
import { cn } from "@/lib/utils"

type HomeProjectCardProps = {
  card: HomeProjectCard
  className?: string
}

export function HomeProjectCardView({ card, className }: HomeProjectCardProps) {
  const scheme = PROJECT_COLOR_SCHEMES[card.scheme]

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-black/12 dark:hover:shadow-black/35",
        className
      )}
      style={
        {
          ["--project-accent-light" as string]: scheme.accentColor.light,
          ["--project-accent-dark" as string]: scheme.accentColor.dark,
          ["--project-soft-light" as string]: hexAlpha(scheme.accentColor.light, 0.2),
          ["--project-soft-dark" as string]: hexAlpha(scheme.accentColor.dark, 0.24),
          ["--project-ring-light" as string]: hexAlpha(scheme.accentColor.light, 0.38),
          ["--project-ring-dark" as string]: hexAlpha(scheme.accentColor.dark, 0.45),
          ["--project-text-inv-light" as string]: scheme.textColorInverted.light,
          ["--project-text-inv-dark" as string]: scheme.textColorInverted.dark,
        } as CSSProperties
      }
    >
      <span className="absolute inset-x-0 top-0 h-0.5 bg-[var(--project-accent-light)] dark:bg-[var(--project-accent-dark)]" />
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[var(--project-ring-light)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:ring-[var(--project-ring-dark)]" />
      <span className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-[var(--project-soft-light)] opacity-80 blur-3xl transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 dark:bg-[var(--project-soft-dark)]" />

      <div className="relative z-10 grid h-full grid-rows-[auto_auto_1fr_auto] p-4 sm:p-5">
        <header className="flex min-h-14 items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-2xl font-black leading-tight tracking-tight">{card.title}</h3>
          </div>
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-[var(--project-accent-light)]/45 bg-[var(--project-soft-light)] text-[var(--project-accent-light)] dark:border-[var(--project-accent-dark)]/45 dark:bg-[var(--project-soft-dark)] dark:text-[var(--project-accent-dark)]">
            <card.icon className="size-4" aria-hidden="true" />
          </span>
        </header>

        <div className="relative mt-4 overflow-hidden rounded-xl border border-border/70 bg-background/50">
          <div className="relative aspect-[16/9]">
            <Image src={card.image.light} alt={card.image.alt} fill className="object-cover dark:hidden" />
            <Image src={card.image.dark} alt={card.image.alt} fill className="hidden object-cover dark:block" />
          </div>
        </div>

        <div className="mt-4 flex min-h-16 items-center justify-center">
          <p className="line-clamp-2 text-center text-sm leading-relaxed text-muted-foreground">{card.description}</p>
        </div>

        <div className="mt-4 flex min-h-10 flex-wrap items-center justify-center gap-2">
          {card.buttons.slice(0, 2).map((button) => (
            <HomeLinkButton
              key={`${card.id}-${button.label}`}
              link={button}
            />
          ))}
        </div>
      </div>
    </article>
  )
}
