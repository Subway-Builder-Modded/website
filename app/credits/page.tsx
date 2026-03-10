import type { Metadata } from "next"
import Link from "next/link"
import { Globe, Sparkles, Users, Heart } from "lucide-react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Card } from "@/components/ui/card"
import { LineBullet } from "@/components/ui/line-bullet"
import { CREDIT_SECTIONS, type CreditSection } from "@/lib/credits-config"
import { NON_THEMED_LINE_BULLET } from "@/lib/line-bullet-theme"

export const metadata: Metadata = {
  title: "Credits | Subway Builder Modded",
  description: "Subway Builder Modded is a community-driven project made possible by dedicated contributors.",
}

const SECTION_ICON_MAP = {
  maintainers: Users,
  translators: Globe,
  contributors: Heart,
} as const

function CreditRoleMarkdown({ content }: { content: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <>{children}</>,
        a: ({ href, children }) => {
          if (!href) {
            return <>{children}</>
          }

          const isInternal = href.startsWith("/")

          if (isInternal) {
            return (
              <Link
                href={href}
                className="underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
              >
                {children}
              </Link>
            )
          }

          return (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-muted-foreground/50 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
            >
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

function CreditsSectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <LineBullet
        bullet={title.slice(0, 1).toUpperCase()}
        color={NON_THEMED_LINE_BULLET.bulletColor}
        textColor={NON_THEMED_LINE_BULLET.textColor}
        shape="circle"
        size="sm"
      />
      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

function CreditPersonCard({ section, person }: { section: CreditSection; person: CreditSection["people"][number] }) {
  const Icon = SECTION_ICON_MAP[section.icon]

  return (
    <Card
      className="flex h-full items-start gap-3 border border-border/70 bg-card/70 p-4 will-change-transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/5"
    >
      <div className="mt-0.5 rounded-full border border-border/60 bg-muted/60 p-2">
        <Icon className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        {person.link ? (
          <Link
            href={person.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-base font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {person.name}
            <Sparkles className="size-3.5 opacity-70" />
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
    </Card>
  )
}

function CreditsSection({ section }: { section: CreditSection }) {
  return (
    <section>
      <CreditsSectionHeader title={section.title} />
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
    <section className="px-7 pb-16 pt-8 sm:pb-20 sm:pt-8">
      <div className="mb-12 text-center">
        <div className="flex justify-center">
          <h1 className="inline-flex items-center gap-4 text-4xl font-black tracking-tight sm:text-5xl">
            <Users aria-hidden="true" className="size-[1.02em]" />
            <span>Credits</span>
          </h1>
        </div>
        <p className="mt-3 text-lg text-muted-foreground">
          The people and contributors helping Subway Builder Modded move forward.
        </p>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        {CREDIT_SECTIONS.map((section) => (
          <CreditsSection key={section.id} section={section} />
        ))}
      </div>
    </section>
  )
}

