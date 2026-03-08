"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getActiveInstanceFromPathname } from "@/lib/wiki-shared"
import type { WikiInstance } from "@/lib/wiki-config"

export type TocHeading = {
  id: string
  text: string
  level: number
}

const ACTIVE_HEADING_TOP_OFFSET = 100

const INSTANCE_INDICATOR_BG_CLASS: Record<WikiInstance["id"], string> = {
  railyard: "bg-emerald-400",
  "template-mod": "bg-violet-400",
  "creating-custom-maps": "bg-blue-400",
  contributing: "bg-amber-400",
  legacy: "bg-rose-400",
}

function getActiveHeadingId(elements: HTMLElement[]) {
  const viewportHeight = window.innerHeight
  const visibleHeadings = elements
    .map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .filter(
      ({ rect }) =>
        rect.bottom > ACTIVE_HEADING_TOP_OFFSET && rect.top < viewportHeight
    )

  if (visibleHeadings.length > 0) {
    const topmostVisibleHeading = visibleHeadings.reduce((current, next) =>
      next.rect.top < current.rect.top ? next : current
    )

    return topmostVisibleHeading.element.id
  }

  const lastHeadingAboveOffset = [...elements]
    .reverse()
    .find(
      (element) =>
        element.getBoundingClientRect().top <= ACTIVE_HEADING_TOP_OFFSET
    )

  return lastHeadingAboveOffset?.id ?? elements[0]?.id ?? ""
}

export function WikiOnThisPage({ headings }: { headings: TocHeading[] }) {
  const pathname = usePathname()
  const activeInstance = React.useMemo(
    () => getActiveInstanceFromPathname(pathname),
    [pathname]
  )
  const [activeId, setActiveId] = React.useState<string>("")

  React.useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean) as HTMLElement[]

    if (!elements.length) return

    let rafId: number | null = null

    function update() {
      if (rafId !== null) return

      rafId = window.requestAnimationFrame(() => {
        rafId = null
        setActiveId(getActiveHeadingId(elements))
      })
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }

      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [headings])

  if (!headings.length) return null

  const singleHeading = headings.length === 1
  const activeIndicatorClassName = INSTANCE_INDICATOR_BG_CLASS[activeInstance.id]

  return (
    <nav aria-label="On this page" className="xl:w-[19rem] xl:pl-10 2xl:pl-14">
      <div className="relative pl-4 pt-2">
        {!singleHeading ? (
          <div className="pointer-events-none absolute top-2 bottom-3 left-0 w-px bg-border/70" />
        ) : null}

        <ul className="space-y-1 pb-4">
          {headings.map((heading) => {
            const active = activeId === heading.id

            return (
              <li key={heading.id} className="relative">
                <span
                  className={cn(
                    "absolute top-1.5 bottom-1.5 w-[2px] rounded-full transition-all duration-150",
                    activeIndicatorClassName,
                    active ? "opacity-100" : "opacity-0"
                  )}
                  style={{ left: "-16.5px" }}
                />
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "relative block rounded-md py-1.5 pr-2 text-sm transition-colors",
                    heading.level <= 2 && "pl-0",
                    heading.level === 3 && "pl-4",
                    heading.level >= 4 && "pl-7",
                    active
                      ? cn("font-medium", activeInstance.accentClassName)
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {heading.text}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
