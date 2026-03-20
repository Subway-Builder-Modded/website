import Link from "next/link"
import { ArrowRight, BookText, Tag } from "lucide-react"
import type { CSSProperties } from "react"

import { PageHeader } from "@/components/page/page-header"
import { getUpdateProjectById } from "@/config/content/updates"
import { PROJECT_COLOR_SCHEMES } from "@/config/theme/colors"
import type { DocsInstance } from "@/config/content/docs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { hexAlpha } from "@/lib/color"
import { buildDocHref } from "@/lib/docs/shared"
import { cn } from "@/lib/utils"

function getHubTheme(instance: DocsInstance) {
  const colors = PROJECT_COLOR_SCHEMES[instance.id]
  const accent = colors.accentColor
  const primary = colors.primaryColor

  return {
    accent,
    primary,
    ring: {
      light: hexAlpha(accent.light, 0.38),
      dark: hexAlpha(accent.dark, 0.46),
    },
    soft: {
      light: hexAlpha(accent.light, 0.17),
      dark: hexAlpha(accent.dark, 0.24),
    },
    cardVars: {
      ["--docs-hub-accent-light" as string]: accent.light,
      ["--docs-hub-accent-dark" as string]: accent.dark,
      ["--docs-hub-primary-light" as string]: primary.light,
      ["--docs-hub-primary-dark" as string]: primary.dark,
      ["--docs-hub-ring-light" as string]: hexAlpha(accent.light, 0.38),
      ["--docs-hub-ring-dark" as string]: hexAlpha(accent.dark, 0.46),
      ["--docs-hub-soft-light" as string]: hexAlpha(accent.light, 0.17),
      ["--docs-hub-soft-dark" as string]: hexAlpha(accent.dark, 0.24),
    } as CSSProperties,
  }
}

function getInstanceBadgeScheme(instance: DocsInstance) {
  const project = getUpdateProjectById(instance.id)
  if (!project) return null

  return {
    border: {
      light: hexAlpha(project.accentColor.light, 0.44),
      dark: hexAlpha(project.accentColor.dark, 0.5),
    },
    background: {
      light: hexAlpha(project.accentColor.light, 0.12),
      dark: hexAlpha(project.accentColor.dark, 0.2),
    },
    text: project.accentColor,
  }
}

export function InstanceDocsHubPage({ instance }: { instance: DocsInstance }) {
  const Icon = instance.icon
  const docsVersion = instance.versioned ? instance.latestVersion ?? null : null
  const versionLabel = docsVersion ?? "Current"
  const hubTheme = getHubTheme(instance)
  const instanceBadgeScheme = getInstanceBadgeScheme(instance)

  return (
    <section className="relative px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
      <div className="mx-auto w-full max-w-screen-xl">
        <PageHeader
          icon={BookText}
          title="Docs"
          description={instance.hub.description}
          colorScheme={{
            accent: PROJECT_COLOR_SCHEMES[instance.id].accentColor,
            spotlight: hubTheme.soft,
          }}
          badges={[
            ...(instanceBadgeScheme
              ? [
                  {
                    text: instance.label,
                    icon: Icon,
                    colorScheme: instanceBadgeScheme,
                  },
                ]
              : []),
            {
              text: `Version: \`${versionLabel}\``,
              icon: Tag,
              colorScheme: instanceBadgeScheme ?? {
                border: hubTheme.ring,
                background: {
                  light: "rgba(0,0,0,0.03)",
                  dark: "rgba(255,255,255,0.06)",
                },
                text: hubTheme.accent,
              },
              uppercase: false,
            },
          ]}
        />

        <div
          className="relative mx-auto mb-8 max-w-4xl overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-wrap justify-center gap-5 md:gap-6">
            {instance.hub.cards.map((card) => {
              const CardIcon = card.icon
              const href = buildDocHref(instance, docsVersion, card.docPath)

              return (
                <Link
                  key={card.docPath}
                  href={href}
                  className="group block h-full w-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50 md:w-[calc(50%-0.75rem)]"
                >
                  <Card
                    style={hubTheme.cardVars}
                    className={cn(
                      "relative h-full overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-sm transition-all duration-300",
                      "hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30"
                    )}
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-[var(--docs-hub-ring-light)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:ring-[var(--docs-hub-ring-dark)]" />
                    <span className="absolute inset-x-0 top-0 h-0.5 bg-[var(--docs-hub-accent-light)] dark:bg-[var(--docs-hub-accent-dark)]" />
                    <span className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-[var(--docs-hub-soft-light)] blur-2xl dark:bg-[var(--docs-hub-soft-dark)]" />

                    <CardHeader className="gap-3 p-5">
                      <CardTitle className="text-base font-semibold leading-tight text-foreground">
                        <span className="flex items-center gap-2">
                          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-[var(--docs-hub-primary-light)] bg-[var(--docs-hub-primary-light)]/55 text-[var(--docs-hub-accent-light)] dark:border-[var(--docs-hub-primary-dark)] dark:bg-[var(--docs-hub-primary-dark)]/55 dark:text-[var(--docs-hub-accent-dark)]">
                            <CardIcon className="size-4" aria-hidden="true" />
                          </span>
                          <span>{card.title}</span>
                        </span>
                      </CardTitle>
                      <CardDescription className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                        {card.description}
                      </CardDescription>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--docs-hub-accent-light)] transition-transform duration-300 group-hover:translate-x-0.5 dark:text-[var(--docs-hub-accent-dark)]">
                        View
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </span>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
