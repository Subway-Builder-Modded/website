"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Link } from "@/components/ui/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GITHUB_DROPDOWN_ITEMS, GITHUB_ORG_URL } from "@/lib/github-dropdown-config"

function isMaskIcon(icon: unknown): icon is { type: "mask"; src: string } {
  return typeof icon === "object" && icon !== null && "type" in icon && (icon as { type?: string }).type === "mask"
}

export function GitHubDropdownMenu({ className }: { className: string }) {
  const { resolvedTheme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(null)
  const hoverCloseTimeoutRef = React.useRef<number | null>(null)
  const isTriggerHoveredRef = React.useRef(false)
  const isContentHoveredRef = React.useRef(false)

  const isDark = resolvedTheme === "dark"

  const clearHoverClose = React.useCallback(() => {
    if (hoverCloseTimeoutRef.current) {
      window.clearTimeout(hoverCloseTimeoutRef.current)
      hoverCloseTimeoutRef.current = null
    }
  }, [])

  const scheduleHoverClose = React.useCallback(() => {
    clearHoverClose()
    hoverCloseTimeoutRef.current = window.setTimeout(() => {
      if (!isTriggerHoveredRef.current && !isContentHoveredRef.current) {
        setOpen(false)
      }
      hoverCloseTimeoutRef.current = null
    }, 120)
  }, [clearHoverClose])

  const openMenu = React.useCallback(() => {
    clearHoverClose()
    setOpen(true)
  }, [clearHoverClose])

  React.useEffect(() => {
    return () => {
      if (hoverCloseTimeoutRef.current) {
        window.clearTimeout(hoverCloseTimeoutRef.current)
      }
    }
  }, [])

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && (isTriggerHoveredRef.current || isContentHoveredRef.current)) return
        setOpen(nextOpen)
      }}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Link
          href={GITHUB_ORG_URL}
          aria-label="GitHub"
          target="_blank"
          rel="noreferrer"
          className={cn("outline-none", className)}
          onPointerEnter={() => {
            isTriggerHoveredRef.current = true
            openMenu()
          }}
          onPointerLeave={() => {
            isTriggerHoveredRef.current = false
            scheduleHoverClose()
          }}
        >
          <span
            className="block size-5 bg-current"
            style={{
              WebkitMask: "url(/assets/github.svg) center / contain no-repeat",
              mask: "url(/assets/github.svg) center / contain no-repeat",
            }}
          />
        </Link>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        onPointerEnter={() => {
          isContentHoveredRef.current = true
          openMenu()
        }}
        onPointerLeave={() => {
          isContentHoveredRef.current = false
          setHoveredItemId(null)
          scheduleHoverClose()
        }}
        className="min-w-56 !bg-background ring-1 ring-border rounded-xl shadow-lg duration-200 ease-[cubic-bezier(.22,.9,.35,1)] data-open:duration-220 data-open:ease-[cubic-bezier(.22,.9,.35,1)] data-closed:duration-190 data-closed:ease-[cubic-bezier(.3,.0,.2,1)]"
      >
        {GITHUB_DROPDOWN_ITEMS.map((item) => {
          const Icon = item.icon && !isMaskIcon(item.icon) ? (item.icon as LucideIcon) : undefined
          const hoverColors = item.colors ? (isDark ? item.colors.dark : item.colors.light) : null
          const isItemHovered = hoveredItemId === item.id

          return (
            <DropdownMenuItem
              asChild
              key={item.id}
              onPointerEnter={() => setHoveredItemId(item.id)}
              onPointerLeave={() => setHoveredItemId((current) => (current === item.id ? null : current))}
              onFocus={() => setHoveredItemId(item.id)}
              onBlur={() => setHoveredItemId((current) => (current === item.id ? null : current))}
              style={
                isItemHovered && hoverColors
                  ? {
                      color: hoverColors.text,
                      backgroundColor: hoverColors.background,
                    }
                  : undefined
              }
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-fg transition-colors duration-250 ease-[cubic-bezier(.22,.9,.35,1)]"
            >
              <Link
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 no-underline text-inherit"
              >
                {Icon ? <Icon className="size-4 shrink-0" /> : null}
                <span>{item.title}</span>
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
