"use client"

import * as React from "react"
import NextLink from "next/link"
import { useTheme } from "next-themes"
import { getNavbarThemeColors } from "@/lib/navbar-colors"
import { cn } from "@/lib/utils"
import { isExternalHref } from "@/lib/url"
import type { NavbarItem } from "@/config/navigation/navbar"
import { Link } from "@/components/ui/link"
import { AppIcon } from "@/components/common/app-icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NavigationDropdownMenuProps = {
  item: NavbarItem
  className: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NavigationDropdownMenu({ item, className, open, onOpenChange }: NavigationDropdownMenuProps) {
  const { resolvedTheme } = useTheme()
  const [isTriggerHovered, setIsTriggerHovered] = React.useState(false)
  const [hoveredDropdownItemId, setHoveredDropdownItemId] = React.useState<string | null>(null)
  const hoverCloseTimeoutRef = React.useRef<number | null>(null)
  const closeLockTimeoutRef = React.useRef<number | null>(null)
  const isClosingMenuRef = React.useRef(false)
  const isTriggerHoveredRef = React.useRef(false)
  const isContentHoveredRef = React.useRef(false)

  const isDark = resolvedTheme === "dark"

  const clearHoverClose = React.useCallback(() => {
    if (hoverCloseTimeoutRef.current) {
      window.clearTimeout(hoverCloseTimeoutRef.current)
      hoverCloseTimeoutRef.current = null
    }
  }, [])

  const clearCloseLock = React.useCallback(() => {
    if (closeLockTimeoutRef.current) {
      window.clearTimeout(closeLockTimeoutRef.current)
      closeLockTimeoutRef.current = null
    }
    isClosingMenuRef.current = false
  }, [])

  const beginCloseLock = React.useCallback(() => {
    clearCloseLock()
    isClosingMenuRef.current = true
    closeLockTimeoutRef.current = window.setTimeout(() => {
      isClosingMenuRef.current = false
      closeLockTimeoutRef.current = null
    }, 210)
  }, [clearCloseLock])

  const closeMenu = React.useCallback(() => {
    beginCloseLock()
    onOpenChange(false)
  }, [beginCloseLock, onOpenChange])

  const scheduleHoverClose = React.useCallback(() => {
    clearHoverClose()
    hoverCloseTimeoutRef.current = window.setTimeout(() => {
      if (!isTriggerHoveredRef.current && !isContentHoveredRef.current) {
        closeMenu()
      }
      hoverCloseTimeoutRef.current = null
    }, 180)
  }, [clearHoverClose, closeMenu])

  const openMenu = React.useCallback(() => {
    clearHoverClose()
    clearCloseLock()
    onOpenChange(true)
  }, [clearCloseLock, clearHoverClose, onOpenChange])

  React.useEffect(() => {
    return () => {
      if (hoverCloseTimeoutRef.current) {
        window.clearTimeout(hoverCloseTimeoutRef.current)
      }
      if (closeLockTimeoutRef.current) {
        window.clearTimeout(closeLockTimeoutRef.current)
      }
    }
  }, [])

  const dropdownItems = item.dropdown ?? []
  const triggerHoverColors = getNavbarThemeColors(item, isDark)

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          clearCloseLock()
          onOpenChange(true)
        }
      }}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Link
          href={item.href ?? "#"}
          aria-label={item.title ?? item.id}
          target="_blank"
          rel="noreferrer"
          className={cn("outline-none", className, !triggerHoverColors && "hover:bg-secondary/60 hover:text-primary")}
          style={
            isTriggerHovered && triggerHoverColors
              ? {
                  color: triggerHoverColors.text,
                  backgroundColor: triggerHoverColors.background,
                }
              : undefined
          }
          onPointerEnter={() => {
            isTriggerHoveredRef.current = true
            setIsTriggerHovered(true)
            openMenu()
          }}
          onPointerLeave={() => {
            isTriggerHoveredRef.current = false
            setIsTriggerHovered(false)
            scheduleHoverClose()
          }}
          onFocus={() => setIsTriggerHovered(true)}
          onBlur={() => setIsTriggerHovered(false)}
        >
          <AppIcon icon={item.icon} />
        </Link>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={0}
        onPointerDownOutside={() => {
          clearHoverClose()
          closeMenu()
        }}
        onEscapeKeyDown={() => {
          clearHoverClose()
          closeMenu()
        }}
        onPointerEnter={() => {
          isContentHoveredRef.current = true
          openMenu()
        }}
        onPointerLeave={() => {
          isContentHoveredRef.current = false
          setHoveredDropdownItemId(null)
          scheduleHoverClose()
        }}
        className="min-w-56 !bg-background ring-1 ring-border rounded-xl shadow-lg duration-200 ease-[cubic-bezier(.22,.9,.35,1)] data-open:duration-220 data-open:ease-[cubic-bezier(.22,.9,.35,1)] data-closed:duration-190 data-closed:ease-[cubic-bezier(.3,.0,.2,1)]"
      >
        {dropdownItems.map((dropdownItem) => {
          const hoverColors = getNavbarThemeColors(dropdownItem, isDark)
          const isHovered = hoveredDropdownItemId === dropdownItem.id
          const hoveredIconStyle =
            isHovered && hoverColors
              ? {
                  color: hoverColors.text,
                  stroke: hoverColors.text,
                } satisfies React.CSSProperties
              : undefined
          const isExternal = isExternalHref(dropdownItem.href)

          return (
            <DropdownMenuItem
              asChild
              key={dropdownItem.id}
              style={
                hoverColors
                  ? {
                      "--navbar-hover-text": hoverColors.text,
                      "--navbar-hover-bg": hoverColors.background,
                    } as React.CSSProperties
                  : undefined
              }
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-fg transition-colors duration-250 ease-[cubic-bezier(.22,.9,.35,1)]",
                hoverColors &&
                  "hover:!text-[var(--navbar-hover-text)] hover:!bg-[var(--navbar-hover-bg)] data-[highlighted]:!text-[var(--navbar-hover-text)] data-[highlighted]:!bg-[var(--navbar-hover-bg)]",
              )}
            >
              {isExternal ? (
                <a
                  href={dropdownItem.href ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center gap-2 no-underline"
                  style={
                    isHovered && hoverColors
                      ? {
                          color: hoverColors.text,
                          backgroundColor: hoverColors.background,
                        }
                      : undefined
                  }
                  onPointerEnter={() => setHoveredDropdownItemId(dropdownItem.id)}
                  onPointerLeave={() => setHoveredDropdownItemId((current) => (current === dropdownItem.id ? null : current))}
                  onMouseEnter={() => setHoveredDropdownItemId(dropdownItem.id)}
                  onMouseLeave={() => setHoveredDropdownItemId((current) => (current === dropdownItem.id ? null : current))}
                >
                  <AppIcon icon={dropdownItem.icon} className="size-4 shrink-0" style={hoveredIconStyle} />
                  <span style={isHovered && hoverColors ? { color: hoverColors.text } : undefined}>{dropdownItem.title}</span>
                </a>
              ) : (
                <NextLink
                  href={dropdownItem.href ?? "#"}
                  className="flex w-full items-center gap-2 no-underline"
                  style={
                    isHovered && hoverColors
                      ? {
                          color: hoverColors.text,
                          backgroundColor: hoverColors.background,
                        }
                      : undefined
                  }
                  onPointerEnter={() => setHoveredDropdownItemId(dropdownItem.id)}
                  onPointerLeave={() => setHoveredDropdownItemId((current) => (current === dropdownItem.id ? null : current))}
                  onMouseEnter={() => setHoveredDropdownItemId(dropdownItem.id)}
                  onMouseLeave={() => setHoveredDropdownItemId((current) => (current === dropdownItem.id ? null : current))}
                >
                  <AppIcon icon={dropdownItem.icon} className="size-4 shrink-0" style={hoveredIconStyle} />
                  <span style={isHovered && hoverColors ? { color: hoverColors.text } : undefined}>{dropdownItem.title}</span>
                </NextLink>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
