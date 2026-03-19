import { ArrowRight, type LucideIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"

import type { ThemedColorSet } from "@/config/theme/colors"
import { hexAlpha } from "@/lib/color"
import { cn } from "@/lib/utils"

type ProjectHubCardProps = {
  href: string
  label: string
  description: string
  icon: LucideIcon
  image: {
    light: string
    dark: string
    alt: string
  }
  colors: ThemedColorSet
  eyebrow?: string
  className?: string
}

function getCardVars(colors: ThemedColorSet): CSSProperties {
  return {
    ["--hub-accent-light" as string]: colors.accentColor.light,
    ["--hub-accent-dark" as string]: colors.accentColor.dark,
    ["--hub-primary-light" as string]: colors.primaryColor.light,
    ["--hub-primary-dark" as string]: colors.primaryColor.dark,
    ["--hub-secondary-light" as string]: colors.secondaryColor.light,
    ["--hub-secondary-dark" as string]: colors.secondaryColor.dark,
    ["--hub-text-light" as string]: colors.textColor.light,
    ["--hub-text-dark" as string]: colors.textColor.dark,
    ["--hub-soft-light" as string]: hexAlpha(colors.accentColor.light, 0.2),
    ["--hub-soft-dark" as string]: hexAlpha(colors.accentColor.dark, 0.24),
    ["--hub-ring-light" as string]: hexAlpha(colors.accentColor.light, 0.38),
    ["--hub-ring-dark" as string]: hexAlpha(colors.accentColor.dark, 0.45),
  }
}

export function ProjectHubCard({
  href,
  label,
  description,
  icon: Icon,
  image,
  colors,
  eyebrow,
  className,
}: ProjectHubCardProps) {
  return (
    <Link href={href} className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
      <article
        style={getCardVars(colors)}
        className={cn(
          "relative flex h-full min-h-[21rem] flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300",
          "hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-black/12 dark:hover:shadow-black/35",
          className
        )}
      >
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-[var(--hub-ring-light)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:ring-[var(--hub-ring-dark)]" />
        <span className="absolute inset-x-0 top-0 h-0.5 bg-[var(--hub-accent-light)] dark:bg-[var(--hub-accent-dark)]" />
        <span className="pointer-events-none absolute -inset-x-8 -bottom-10 h-28 bg-gradient-to-t from-[var(--hub-soft-light)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-[var(--hub-soft-dark)]" />
        <div className="pointer-events-none absolute -top-16 right-[-4.75rem] size-44 rounded-full bg-[var(--hub-soft-light)] opacity-80 blur-3xl transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 dark:bg-[var(--hub-soft-dark)]" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-[var(--hub-soft-light)] opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-80 dark:bg-[var(--hub-soft-dark)]" />

        <div className="relative z-10 flex flex-1 flex-col p-4 sm:p-5">
          <header className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              {eyebrow ? (
                <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
              ) : null}
              <h2 className="truncate text-2xl font-black tracking-tight text-[var(--hub-text-light)] dark:text-[var(--hub-text-dark)]">
                {label}
              </h2>
            </div>

            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-[var(--hub-secondary-light)] bg-[var(--hub-primary-light)] text-[var(--hub-text-light)] transition-transform duration-300 group-hover:scale-105 dark:border-[var(--hub-secondary-dark)] dark:bg-[var(--hub-primary-dark)] dark:text-[var(--hub-text-dark)]">
              <Icon className="size-4" aria-hidden="true" />
            </span>
          </header>

          <div className="relative mb-4 overflow-hidden rounded-xl border border-[var(--hub-secondary-light)]/80 bg-background/50 dark:border-[var(--hub-secondary-dark)]/80">
            <div className="relative aspect-[16/9]">
              <Image src={image.light} alt={image.alt} fill className="object-cover dark:hidden" />
              <Image src={image.dark} alt={image.alt} fill className="hidden object-cover dark:block" />
            </div>
          </div>

          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-auto pt-4">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--hub-accent-light)] transition-transform duration-300 group-hover:translate-x-1 dark:text-[var(--hub-accent-dark)]">
              Explore
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
