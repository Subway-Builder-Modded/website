"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useFooterOffset } from "@/hooks/use-footer-offset"

export type TocHeading = {
  id: string
  text: string
  level: number
}

export function WikiOnThisPage({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = React.useState<string>("")
  const footerOffset = useFooterOffset()

  React.useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean) as HTMLElement[]

    if (!elements.length) return

    function update() {
      let current = ""
      for (const el of elements) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 100) {
          current = el.id
        } else {
          break
        }
      }
      if (!current && elements[0]) {
        current = elements[0].id
      }
      setActiveId(current)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [headings])

  if (!headings.length) return null

  const singleHeading = headings.length === 1

  return (
    <aside
      className="sticky hidden xl:block xl:w-64"
      style={{
        top: "3.5rem",
        maxHeight: `calc(100vh - 3.5rem - ${footerOffset}px)`,
        alignSelf: "start",
      }}
    >
      <div className="relative pl-4 pt-2">
        {/* Gray track line - only show if more than one heading */}
        {!singleHeading && (
          <div
            className="absolute left-0 top-2 w-[1px] bg-border/70"
            style={{
              bottom: 0,
            }}
          />
        )}

        <ul className="space-y-1">
          {headings.map((heading) => {
            const active = activeId === heading.id

            return (
              <li key={heading.id} className="relative">
                {/* Active indicator line - centered on the gray track */}
                <span
                  className={cn(
                    "absolute top-1.5 bottom-1.5 w-[2px] rounded-full bg-primary transition-all duration-150",
                    active ? "opacity-100" : "opacity-0"
                  )}
                  style={{ left: "-16.5px" }}
                />
                <Link
                  href={`#${heading.id}`}
                  className={cn(
                    "relative block rounded-md py-1.5 pr-2 text-sm transition-colors",
                    heading.level <= 2 && "pl-0",
                    heading.level === 3 && "pl-4",
                    heading.level >= 4 && "pl-7",
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
