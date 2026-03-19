"use client"

import * as React from "react"
import { Moon, Sun, SunMoon, type LucideIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { getNavbarConfiguredColors, getNavbarThemeColors } from "@/lib/navbar-colors"
import type { NavbarDropdownItem } from "@/config/navigation/navbar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const themes = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: SunMoon },
] as const

type ThemeValue = (typeof themes)[number]["value"]

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> }
}

export function ThemeMenu({
  className,
  open,
  onOpenChange,
  items,
}: {
  className: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  items?: NavbarDropdownItem[]
}) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const [hoveredThemeValue, setHoveredThemeValue] = React.useState<ThemeValue | null>(null)
  const transitionTimeoutRef = React.useRef<number | null>(null)
  const closeLockTimeoutRef = React.useRef<number | null>(null)
  const isTriggerHoveredRef = React.useRef(false)
  const isContentHoveredRef = React.useRef(false)
  const isClosingMenuRef = React.useRef(false)

  const isControlled = typeof open === "boolean"
  const menuOpen = isControlled ? open : uncontrolledOpen
  const setMenuOpen = React.useCallback((nextOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }, [isControlled, onOpenChange])

  React.useEffect(() => {
    if (!menuOpen) {
      setHoveredThemeValue(null)
    }
  }, [menuOpen])

  React.useEffect(() => {
    setMounted(true)

    return () => {
      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current)
      if (closeLockTimeoutRef.current) window.clearTimeout(closeLockTimeoutRef.current)

      const root = document.documentElement
      root.classList.remove("theme-transitioning", "theme-switching-menu", "theme-switching-menu-lock")
      root.style.removeProperty("--theme-menu-lock-bg")
      root.style.removeProperty("--theme-menu-lock-fg")
      root.style.removeProperty("--theme-menu-lock-border")
    }
  }, [])

  const currentTheme: ThemeValue =
    mounted && (theme === "light" || theme === "dark" || theme === "system") ? theme : "system"
  const isDark = resolvedTheme === "dark"

  const themeOptions = React.useMemo(() => {
    return themes.map((entry) => {
      const configured = items?.find((item) => item.id === `theme-${entry.value}`)
      const configuredColors = getNavbarConfiguredColors(configured)
      const configuredIcon = configured?.icon
      const Icon =
        configuredIcon && !(typeof configuredIcon === "object" && "type" in configuredIcon)
          ? (configuredIcon as LucideIcon)
          : entry.Icon

      const optionIsDark = isDark

      return {
        value: entry.value,
        label: configured?.title ?? entry.label,
        Icon,
        configuredColors,
        hoverColors: getNavbarThemeColors(configured, optionIsDark),
      }
    })
  }, [isDark, items])

  const CurrentIcon = currentTheme === "light" ? Sun : currentTheme === "dark" ? Moon : SunMoon

  const endSwitch = React.useCallback(() => {
    const root = document.documentElement
    root.classList.remove("theme-transitioning", "theme-switching-menu", "theme-switching-menu-lock")
    root.style.removeProperty("--theme-menu-lock-bg")
    root.style.removeProperty("--theme-menu-lock-fg")
    root.style.removeProperty("--theme-menu-lock-border")
    transitionTimeoutRef.current = null
  }, [])

  const lockMenuColors = React.useCallback(() => {
    const menuSurface = document.querySelector<HTMLElement>("[data-theme-menu-surface]")
    if (!menuSurface) return

    const styles = window.getComputedStyle(menuSurface)
    const root = document.documentElement
    root.style.setProperty("--theme-menu-lock-bg", styles.backgroundColor)
    root.style.setProperty("--theme-menu-lock-fg", styles.color)
    root.style.setProperty("--theme-menu-lock-border", styles.borderColor)
    root.classList.add("theme-switching-menu-lock")
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
    }, 220)
  }, [clearCloseLock])

  const openMenu = React.useCallback(() => {
    clearCloseLock()
    setMenuOpen(true)
  }, [clearCloseLock, setMenuOpen])

  const handleThemeChange = React.useCallback(
    (nextTheme: ThemeValue) => {
      if (nextTheme === currentTheme) {
        setMenuOpen(true)
        return
      }

      const resolved = resolvedTheme === "dark" ? "dark" : "light"
      const currentVisual = currentTheme === "system" ? resolved : currentTheme
      const nextVisual = nextTheme === "system" ? resolved : nextTheme

      if (currentVisual === nextVisual) {
        setTheme(nextTheme)
        setMenuOpen(true)
        return
      }

      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current)
      }

      const applyTheme = () => setTheme(nextTheme)
      const doc = document as DocumentWithViewTransition
      const root = document.documentElement

      lockMenuColors()
      root.classList.add("theme-switching-menu")

      if (typeof doc.startViewTransition === "function") {
        beginCloseLock()
        setMenuOpen(false)
        const transition = doc.startViewTransition(applyTheme)
        transition.finished.finally(endSwitch)
        return
      }

      root.classList.add("theme-transitioning")
      beginCloseLock()
      setMenuOpen(false)
      applyTheme()
      transitionTimeoutRef.current = window.setTimeout(endSwitch, 220)
    },
    [beginCloseLock, currentTheme, endSwitch, lockMenuColors, resolvedTheme, setMenuOpen, setTheme],
  )

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      clearCloseLock()
      setMenuOpen(true)
    }
  }, [clearCloseLock, setMenuOpen])

  return (
    <DropdownMenu open={menuOpen} onOpenChange={handleOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Theme"
          onPointerEnter={() => {
            isTriggerHoveredRef.current = true
            openMenu()
          }}
          onPointerLeave={() => {
            isTriggerHoveredRef.current = false
          }}
          className={cn(
            "relative [view-transition-name:none] outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none",
            className,
          )}
        >
          {mounted ? (
            <CurrentIcon className="size-5 transform-gpu transition-transform duration-250 ease-[cubic-bezier(.22,.9,.35,1)]" />
          ) : (
            <span aria-hidden className="block size-5" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={0}
        data-theme-menu
        data-theme-menu-surface
        onPointerDownOutside={() => {
          beginCloseLock()
          setMenuOpen(false)
        }}
        onEscapeKeyDown={() => {
          beginCloseLock()
          setMenuOpen(false)
        }}
        onPointerEnter={() => {
          isContentHoveredRef.current = true
          openMenu()
        }}
        onPointerLeave={() => {
          isContentHoveredRef.current = false
        }}
        className="min-w-56 !bg-background ring-1 ring-border rounded-xl shadow-lg duration-200 ease-[cubic-bezier(.22,.9,.35,1)] data-open:duration-220 data-open:ease-[cubic-bezier(.22,.9,.35,1)] data-closed:duration-190 data-closed:ease-[cubic-bezier(.3,.0,.2,1)]"
      >
        {themeOptions.map(({ value, label, Icon, hoverColors, configuredColors }) => {
          const isHovered = hoveredThemeValue === value
          const isSystemGradient =
            value === "system" &&
            configuredColors &&
            typeof configuredColors.light.background === "string" &&
            typeof configuredColors.dark.background === "string"

          return (
            <DropdownMenuItem
              key={value}
              data-theme-menu
              onSelect={(event) => {
                event.preventDefault()
              }}
              onClick={() => handleThemeChange(value)}
              onPointerEnter={() => setHoveredThemeValue(value)}
              onPointerLeave={() => setHoveredThemeValue((current) => (current === value ? null : current))}
              onMouseEnter={() => setHoveredThemeValue(value)}
              onMouseLeave={() => setHoveredThemeValue((current) => (current === value ? null : current))}
              onFocus={() => setHoveredThemeValue(value)}
              onBlur={() => setHoveredThemeValue((current) => (current === value ? null : current))}
              style={
                isSystemGradient && isHovered
                  ? {
                      backgroundImage: `linear-gradient(to right, ${configuredColors.light.background}, ${configuredColors.dark.background})`,
                      color: "var(--foreground)",
                    } as React.CSSProperties
                  : isHovered && hoverColors
                  ? {
                      "--navbar-hover-text": hoverColors.text,
                      "--navbar-hover-bg": hoverColors.background,
                      color: hoverColors.text,
                      backgroundColor: hoverColors.background,
                    } as React.CSSProperties
                  : hoverColors
                    ? ({
                        "--navbar-hover-text": hoverColors.text,
                        "--navbar-hover-bg": hoverColors.background,
                      } as React.CSSProperties)
                    : undefined
              }
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-fg transition-colors duration-250 ease-[cubic-bezier(.22,.9,.35,1)] hover:bg-secondary/60 hover:text-primary",
                !isSystemGradient &&
                  hoverColors &&
                  "hover:!text-[var(--navbar-hover-text)] hover:!bg-[var(--navbar-hover-bg)] data-[highlighted]:!text-[var(--navbar-hover-text)] data-[highlighted]:!bg-[var(--navbar-hover-bg)]",
                isSystemGradient && "hover:!text-foreground data-[highlighted]:!text-foreground",
              )}
            >
              <Icon
                className="size-4 shrink-0"
                style={
                  isSystemGradient
                    ? isHovered
                      ? { color: "var(--foreground)", stroke: "var(--foreground)" }
                      : undefined
                    : isHovered && hoverColors
                      ? { color: hoverColors.text, stroke: hoverColors.text }
                      : undefined
                }
              />
              <span
                style={
                  isSystemGradient
                    ? isHovered
                      ? { color: "var(--foreground)" }
                      : undefined
                    : isHovered && hoverColors
                      ? { color: hoverColors.text }
                      : undefined
                }
              >
                {label}
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
