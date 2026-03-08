"use client"

import * as React from "react"
import { Moon, Sun, SunMoon } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
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

export function ThemeToggleMenu({ className }: { className: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const transitionTimeoutRef = React.useRef<number | null>(null)
  const hoverCloseTimeoutRef = React.useRef<number | null>(null)
  const isTriggerHoveredRef = React.useRef(false)
  const isContentHoveredRef = React.useRef(false)
  const isSwitchingThemeRef = React.useRef(false)

  React.useEffect(() => {
    setMounted(true)

    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current)
      }
      if (hoverCloseTimeoutRef.current) {
        window.clearTimeout(hoverCloseTimeoutRef.current)
      }

      const root = document.documentElement
      root.classList.remove("theme-transitioning", "theme-switching-menu", "theme-switching-menu-lock")
      root.style.removeProperty("--theme-menu-lock-bg")
      root.style.removeProperty("--theme-menu-lock-fg")
      root.style.removeProperty("--theme-menu-lock-border")
    }
  }, [])

  const currentTheme: ThemeValue =
    mounted && (theme === "light" || theme === "dark" || theme === "system") ? theme : "system"

  const CurrentIcon = currentTheme === "light" ? Sun : currentTheme === "dark" ? Moon : SunMoon

  const endSwitch = React.useCallback(() => {
    isSwitchingThemeRef.current = false
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

  const handleThemeChange = React.useCallback(
    (nextTheme: ThemeValue) => {
      if (nextTheme === currentTheme) {
        setOpen(true)
        return
      }

      const resolved = resolvedTheme === "dark" ? "dark" : "light"
      const currentVisual = currentTheme === "system" ? resolved : currentTheme
      const nextVisual = nextTheme === "system" ? resolved : nextTheme

      if (currentVisual === nextVisual) {
        setTheme(nextTheme)
        setOpen(true)
        return
      }

      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current)
      }

      isSwitchingThemeRef.current = true
      const applyTheme = () => setTheme(nextTheme)
      const doc = document as DocumentWithViewTransition
      const root = document.documentElement

      lockMenuColors()
      root.classList.add("theme-switching-menu")

      if (typeof doc.startViewTransition === "function") {
        const transition = doc.startViewTransition(applyTheme)
        transition.finished.finally(endSwitch)
        setOpen(true)
        return
      }

      root.classList.add("theme-transitioning")
      applyTheme()
      transitionTimeoutRef.current = window.setTimeout(endSwitch, 220)
      setOpen(true)
    },
    [currentTheme, endSwitch, lockMenuColors, resolvedTheme, setTheme],
  )

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    if (!nextOpen && (isTriggerHoveredRef.current || isContentHoveredRef.current || isSwitchingThemeRef.current)) {
      return
    }
    setOpen(nextOpen)
  }, [])

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange} modal={false}>
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
            scheduleHoverClose()
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
        sideOffset={8}
        data-theme-menu
        data-theme-menu-surface
        onPointerEnter={() => {
          isContentHoveredRef.current = true
          openMenu()
        }}
        onPointerLeave={() => {
          isContentHoveredRef.current = false
          scheduleHoverClose()
        }}
        className="min-w-56 !bg-background ring-1 ring-border rounded-xl shadow-lg duration-200 ease-[cubic-bezier(.22,.9,.35,1)] data-open:duration-220 data-open:ease-[cubic-bezier(.22,.9,.35,1)] data-closed:duration-190 data-closed:ease-[cubic-bezier(.3,.0,.2,1)]"
      >
        {themes.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            data-theme-menu
            onSelect={(event) => {
              event.preventDefault()
            }}
            onClick={() => handleThemeChange(value)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-fg transition-colors duration-250 ease-[cubic-bezier(.22,.9,.35,1)] hover:bg-secondary/60 hover:text-primary"
          >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}



