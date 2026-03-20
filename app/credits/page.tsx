import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, type LucideIcon } from "lucide-react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { PageHeader } from "@/components/page/page-header"
import { CREDIT_SECTIONS, type CreditSection } from "@/config/content/credits"
import { CREDITS_PAGE_CONTENT } from "@/config/ui/site-content"
import { hexAlpha } from "@/lib/color"

export const metadata: Metadata = {
  title: "Credits | Subway Builder Modded",
  description: "Subway Builder Modded is a community-driven project made possible by dedicated contributors.",
}

const SECTION_ICON_MAP = CREDITS_PAGE_CONTENT.sectionIcons
const CREDITS_ACCENT = CREDITS_PAGE_CONTENT.accentHex

function CreditRoleMarkdown({ content }: { content: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <>{children}</>,
        a: ({ href, children }) => {
          if (!href) return <>{children}</>

          const className =
            "underline decoration-muted-foreground/55 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"

          if (href.startsWith("/")) {
            return (
              <Link href={href} className={className}>
                {children}
              </Link>
            )
          }

          return (
            <a href={href} target="_blank" rel="noreferrer" className={className}>
              {children}
            </a>
          )
        },
        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
      }}
    >
      {content}
    </Markdown>
  )
}

function CreditsSectionHeader({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span
        className="inline-flex size-8 items-center justify-center rounded-md border"
        style={{
          borderColor: hexAlpha(CREDITS_ACCENT, 0.5),
          backgroundColor: hexAlpha(CREDITS_ACCENT, 0.12),
          color: CREDITS_ACCENT,
        }}
      >
        <Icon className="size-4" />
      </span>
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">{title}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

function CreditPersonCard({ section, person }: { section: CreditSection; person: CreditSection["people"][number] }) {
  const Icon = SECTION_ICON_MAP[section.icon]

  return (
    <article
      className="group relative flex h-full items-start gap-3 overflow-hidden rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30"
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-[color:var(--credits-ring)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ ["--credits-ring" as string]: hexAlpha(CREDITS_ACCENT, 0.45) }}
      />
      <span
        className="pointer-events-none absolute -right-14 -top-14 size-28 rounded-full blur-2xl"
        style={{ backgroundColor: hexAlpha(CREDITS_ACCENT, 0.2) }}
      />

      <div
        className="mt-0.5 rounded-md border p-2"
        style={{
          borderColor: hexAlpha(CREDITS_ACCENT, 0.5),
          backgroundColor: hexAlpha(CREDITS_ACCENT, 0.14),
          color: CREDITS_ACCENT,
        }}
      >
        <Icon className="size-4" />
      </div>

      <div className="relative min-w-0">
        {person.link ? (
          <Link
            href={person.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-base font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {person.name}
            <ExternalLink className="size-3.5 opacity-70" />
          </Link>
        ) : (
          <p className="text-base font-semibold text-foreground">{person.name}</p>
        )}

        {person.role ? (
          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
            <CreditRoleMarkdown content={person.role} />
          </div>
        ) : null}
      </div>
    </article>
  )
}

function CreditsSection({ section }: { section: CreditSection }) {
  const Icon = SECTION_ICON_MAP[section.icon]

  return (
    <section>
      <CreditsSectionHeader title={section.title} icon={Icon} />
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{section.description}</p>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {section.people.map((person) => (
          <li key={`${section.id}-${person.name}`}>
            <CreditPersonCard section={section} person={person} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function CreditsPage() {
  return (
    <section className="relative px-5 pb-14 pt-8 sm:px-8 sm:pt-10">
      <div className="mx-auto w-full max-w-screen-xl">
        <PageHeader
          icon={CREDITS_PAGE_CONTENT.icon}
          title={CREDITS_PAGE_CONTENT.title}
          description={CREDITS_PAGE_CONTENT.description}
        />

        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          {CREDIT_SECTIONS.map((section) => (
            <CreditsSection key={section.id} section={section} />
          ))}
        </div>
      </div>
    </section>
  )
}
