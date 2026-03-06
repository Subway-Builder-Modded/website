"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export type TocHeading = {
  id: string
  text: string
  level: number
}

export function WikiOnThisPage({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = React.useState<string>("")

  React.useEffect(() => {
    const ids = headings.map((h) => h.id)
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: [0.1, 0.5, 1],
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <aside className="sticky top-24 hidden xl:block xl:w-64">
      <div className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-foreground">On this page</div>
        <ul className="space-y-1">
          {headings.map((heading) => {
            const active = activeId === heading.id

            return (
              <li key={heading.id} className="relative">
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full transition-all duration-150",
                    active ? "bg-primary opacity-100" : "bg-primary opacity-0"
                  )}
                />
                <Link
                  href={`#${heading.id}`}
                  className={cn(
                    "block rounded-md py-1.5 pr-2 text-sm transition-colors",
                    heading.level === 3 && "pl-4",
                    heading.level >= 4 && "pl-7",
                    heading.level <= 2 && "pl-3",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {heading.text}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
