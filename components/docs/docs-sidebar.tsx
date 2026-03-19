"use client"

import * as React from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Archive, ChevronDown, PanelLeftCloseIcon, Tag } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useFooterOffset } from "@/hooks/use-footer-offset"
import {
  buildBaseHomeHref,
  buildVersionedDocHref,
  getActiveInstanceFromPathname,
  getActiveVersionFromPathname,
  getDocSlugFromPathname,
  isLatestVersion,
  type DocsSidebarEntry,
  type DocsSidebarTree,
} from "@/lib/docs/shared"
import { DOCS_INSTANCES, type DocsInstance, type DocsVersion } from "@/config/content/docs"
import { normalizePath } from "@/lib/url"
import { PROJECT_COLOR_SCHEMES, getModeHex } from "@/config/theme/colors"

type AppDocsSidebarProps = {
  tree?: DocsSidebarTree
  versionDocSlugs?: Record<string, string[]>
}

type OpenDropdown = "instance" | "version" | null

function withAlpha(color: string, alpha: number) {
  const normalized = color.trim()

  if (!normalized.startsWith("#")) {
    return color
  }

  const hex = normalized.slice(1)
  const fullHex =
    hex.length === 3
      ? hex.split("").map((char) => `${char}${char}`).join("")
      : hex.length === 6
        ? hex
        : null

  if (!fullHex) {
    return color
  }

  const r = Number.parseInt(fullHex.slice(0, 2), 16)
  const g = Number.parseInt(fullHex.slice(2, 4), 16)
  const b = Number.parseInt(fullHex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function getInstanceAccent(instance: DocsInstance, isDark: boolean) {
  return getModeHex(PROJECT_COLOR_SCHEMES[instance.id].accentColor, isDark)
}

function useOnClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (!ref.current || ref.current.contains(target)) return
      handler()
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [ref, handler])
}

function InstanceIcon({
  instance,
  accent,
  active,
}: {
  instance: DocsInstance
  accent: string
  active?: boolean
}) {
  const Icon = instance.icon

  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground",
        active && "text-foreground"
      )}
      style={
        active
          ? {
              borderColor: withAlpha(accent, 0.5),
              backgroundColor: withAlpha(accent, 0.12),
              color: accent,
            }
          : undefined
      }
    >
      <Icon className="size-3.5" />
    </span>
  )
}

function VersionIcon({
  instance,
  version,
  accent,
  active,
}: {
  instance: DocsInstance
  version: DocsVersion
  accent: string
  active?: boolean
}) {
  const Icon = version.icon ?? (isLatestVersion(instance, version.value) ? Tag : Archive)

  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground",
        active && "text-foreground"
      )}
      style={
        active
          ? {
              borderColor: withAlpha(accent, 0.5),
              backgroundColor: withAlpha(accent, 0.12),
              color: accent,
            }
          : undefined
      }
    >
      <Icon className="size-3.5" />
    </span>
  )
}

function StatusBadge({
  kind,
  accent,
}: {
  kind: "latest" | "deprecated"
  accent: string
}) {
  if (kind === "latest") {
    return (
      <span
        className="inline-flex h-4.5 items-center rounded-full border px-1.5 text-[9px] font-semibold uppercase tracking-[0.08em]"
        style={{
          borderColor: withAlpha(accent, 0.45),
          backgroundColor: withAlpha(accent, 0.1),
          color: accent,
        }}
      >
        Latest
      </span>
    )
  }

  return (
    <span className="inline-flex h-4.5 items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-amber-500">
      Deprecated
    </span>
  )
}

function DropdownTrigger({
  open,
  accent,
  onToggle,
  children,
}: {
  open: boolean
  accent: string
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onToggle()
        }
      }}
      className="flex h-10 w-full items-center gap-2 rounded-lg border bg-card px-2.5 text-left text-sm shadow-xs transition-colors hover:bg-accent/45"
      style={{
        borderColor: open ? withAlpha(accent, 0.5) : undefined,
        backgroundColor: open ? withAlpha(accent, 0.08) : undefined,
      }}
    >
      {children}
      <ChevronDown
        className={cn(
          "ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-150",
          open && "rotate-180"
        )}
        style={open ? { color: accent } : undefined}
      />
    </button>
  )
}

function DropdownPanel({
  open,
  children,
}: {
  open: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "grid transition-all duration-200 ease-out",
        open ? "mt-1.5 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="min-h-0 overflow-x-visible overflow-y-hidden">
        <div className="overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-md ring-1 ring-foreground/8">
          {children}
        </div>
      </div>
    </div>
  )
}

function InstanceDropdownRow({
  instance,
  isActive,
  href,
  isDark,
}: {
  instance: DocsInstance
  isActive: boolean
  href: string
  isDark: boolean
}) {
  const accent = getInstanceAccent(instance, isDark)
  const [hovered, setHovered] = React.useState(false)
  const highlighted = isActive || hovered

  return (
    <NextLink
      href={href}
      aria-current={isActive ? "page" : undefined}
      className="flex h-9 items-center gap-2 rounded-md px-2 text-sm transition-colors"
      style={
        highlighted
          ? {
              backgroundColor: withAlpha(accent, 0.12),
              color: accent,
            }
          : undefined
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <InstanceIcon instance={instance} accent={accent} active={highlighted} />
      <span className="truncate font-medium">{instance.label}</span>
    </NextLink>
  )
}

function VersionDropdownRow({
  instance,
  version,
  isActive,
  href,
  isDark,
}: {
  instance: DocsInstance
  version: DocsVersion
  isActive: boolean
  href: string
  isDark: boolean
}) {
  const accent = getInstanceAccent(instance, isDark)
  const latest = isLatestVersion(instance, version.value)
  const [hovered, setHovered] = React.useState(false)
  const highlighted = isActive || hovered

  return (
    <NextLink
      href={href}
      aria-current={isActive ? "page" : undefined}
      className="flex min-h-9 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
      style={
        highlighted
          ? {
              backgroundColor: withAlpha(accent, 0.12),
              color: accent,
            }
          : undefined
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <VersionIcon instance={instance} version={version} accent={accent} active={highlighted} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate font-medium">{version.label}</span>
          {latest ? <StatusBadge kind="latest" accent={accent} /> : null}
          {version.deprecated ? <StatusBadge kind="deprecated" accent={accent} /> : null}
        </div>
      </div>
    </NextLink>
  )
}

function entryIsSelfActive(entry: DocsSidebarEntry, pathname: string): boolean {
  if (entry.kind === "page") {
    return normalizePath(pathname) === normalizePath(entry.href)
  }

  return !!entry.href && normalizePath(pathname) === normalizePath(entry.href)
}

function entryHasActiveDescendant(entry: DocsSidebarEntry, pathname: string): boolean {
  if (entry.kind === "page") {
    return normalizePath(pathname) === normalizePath(entry.href)
  }

  return entry.items.some((child) => {
    if (child.kind === "page") {
      return normalizePath(pathname) === normalizePath(child.href)
    }

    return entryIsSelfActive(child, pathname) || entryHasActiveDescendant(child, pathname)
  })
}

function collectCategoryKeys(entry: DocsSidebarEntry, out = new Set<string>()) {
  if (entry.kind !== "category") return out

  out.add(entry.key)

  for (const child of entry.items) {
    collectCategoryKeys(child, out)
  }

  return out
}

function removeCategoryBranch(entry: DocsSidebarEntry, openKeys: Set<string>) {
  const next = new Set(openKeys)
  const keysToRemove = collectCategoryKeys(entry)

  keysToRemove.forEach((key) => next.delete(key))
  return next
}

function collectActiveCategoryKeys(
  entries: DocsSidebarEntry[],
  pathname: string,
  out = new Set<string>()
) {
  for (const entry of entries) {
    if (entry.kind !== "category") continue

    const selfActive = entryIsSelfActive(entry, pathname)
    const childActive = entry.items.some((child) =>
      child.kind === "page"
        ? normalizePath(pathname) === normalizePath(child.href)
        : entryIsSelfActive(child, pathname) || entryHasActiveDescendant(child, pathname)
    )

    if (selfActive || childActive) out.add(entry.key)

    collectActiveCategoryKeys(entry.items, pathname, out)
  }

  return out
}

function findActiveEntry(
  entries: DocsSidebarEntry[],
  pathname: string,
  openKeys: Set<string>
): DocsSidebarEntry | null {
  const normalizedPathname = normalizePath(pathname)

  for (const entry of entries) {
    if (entry.kind === "page") {
      if (normalizedPathname === normalizePath(entry.href)) return entry
      continue
    }

    const selfActive = entryIsSelfActive(entry, normalizedPathname)
    const descendantActive = entry.items.some((child) =>
      child.kind === "page"
        ? normalizedPathname === normalizePath(child.href)
        : entryIsSelfActive(child, normalizedPathname) ||
          entryHasActiveDescendant(child, normalizedPathname)
    )

    if (!selfActive && !descendantActive) continue

    if (openKeys.has(entry.key)) {
      const deeper = findActiveEntry(entry.items, normalizedPathname, openKeys)
      return deeper ?? entry
    }

    return entry
  }

  return null
}

function SidebarActiveIndicator({
  active,
  accent,
}: {
  active: boolean
  accent: string
}) {
  return (
    <span
      className={cn(
        "absolute top-1.5 bottom-1.5 left-0 w-[2px] rounded-full transition-opacity duration-200",
        active ? "opacity-100" : "opacity-0"
      )}
      style={{ backgroundColor: accent }}
    />
  )
}

function getSidebarDepthClassName(depth: number) {
  if (depth <= 0) return ""
  if (depth === 1) return "pl-5"
  if (depth === 2) return "pl-8"
  if (depth === 3) return "pl-11"
  return "pl-13"
}

function InstanceSwitcher({
  activeInstance,
  open,
  setOpen,
  isDark,
}: {
  activeInstance: DocsInstance
  open: boolean
  setOpen: (value: boolean) => void
  isDark: boolean
}) {
  const accent = getInstanceAccent(activeInstance, isDark)

  return (
    <div>
      <DropdownTrigger open={open} accent={accent} onToggle={() => setOpen(!open)}>
        <InstanceIcon instance={activeInstance} accent={accent} active />
        <span className="truncate text-sm font-medium">{activeInstance.label}</span>
      </DropdownTrigger>

      <DropdownPanel open={open}>
        <div className="space-y-0.5">
          {DOCS_INSTANCES.map((instance) => (
            <InstanceDropdownRow
              key={instance.id}
              instance={instance}
              isActive={instance.id === activeInstance.id}
              href={buildBaseHomeHref(instance)}
              isDark={isDark}
            />
          ))}
        </div>
      </DropdownPanel>
    </div>
  )
}

function VersionSwitcher({
  activeInstance,
  activeVersion,
  pathname,
  open,
  setOpen,
  versionDocSlugs,
  isDark,
}: {
  activeInstance: DocsInstance
  activeVersion: NonNullable<ReturnType<typeof getActiveVersionFromPathname>>
  pathname: string
  open: boolean
  setOpen: (value: boolean) => void
  versionDocSlugs?: Record<string, string[]>
  isDark: boolean
}) {
  const currentDocSlug = getDocSlugFromPathname(activeInstance, pathname) ?? "home"
  if (!activeInstance.versioned || !activeInstance.versions?.length) return null

  const accent = getInstanceAccent(activeInstance, isDark)

  return (
    <div>
      <DropdownTrigger open={open} accent={accent} onToggle={() => setOpen(!open)}>
        <VersionIcon instance={activeInstance} version={activeVersion} accent={accent} active />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-sm font-medium">{activeVersion.label}</span>
            {isLatestVersion(activeInstance, activeVersion.value) ? (
              <StatusBadge kind="latest" accent={accent} />
            ) : null}
            {activeVersion.deprecated ? (
              <StatusBadge kind="deprecated" accent={accent} />
            ) : null}
          </div>
        </div>
      </DropdownTrigger>

      <DropdownPanel open={open}>
        <div className="space-y-0.5">
          {activeInstance.versions.map((version) => {
            const targetDocSlugs = versionDocSlugs?.[version.value] ?? []
            const targetHref = targetDocSlugs.includes(currentDocSlug)
              ? buildVersionedDocHref(activeInstance, version.value, pathname)
              : buildBaseHomeHref(activeInstance, version.value)

            return (
              <VersionDropdownRow
                key={version.value}
                instance={activeInstance}
                version={version}
                isActive={version.value === activeVersion.value}
                href={targetHref}
                isDark={isDark}
              />
            )
          })}
        </div>
      </DropdownPanel>
    </div>
  )
}

function SidebarNavEntry({
  entry,
  pathname,
  openKeys,
  setOpenKeys,
  accent,
  depth = 0,
  activeIndicatorKey,
}: {
  entry: DocsSidebarEntry
  pathname: string
  openKeys: Set<string>
  setOpenKeys: React.Dispatch<React.SetStateAction<Set<string>>>
  accent: string
  depth?: number
  activeIndicatorKey: string | null
}) {
  if (entry.kind === "page") {
    const showIndicator = activeIndicatorKey === entry.key
    const activeStyle = showIndicator
      ? {
          backgroundColor: withAlpha(accent, 0.1),
          color: accent,
        }
      : undefined

    return (
      <li className="relative">
        <SidebarActiveIndicator active={showIndicator} accent={accent} />
        <div
          className={cn(
            "relative flex w-full items-center rounded-md transition-colors",
            showIndicator ? "text-foreground" : "text-muted-foreground hover:bg-accent/45 hover:text-foreground"
          )}
          style={activeStyle}
        >
          <NextLink
            href={entry.href}
            className={cn("min-w-0 flex-1 px-2.5 py-1.5 pr-3 text-sm", getSidebarDepthClassName(depth))}
          >
            <span className="block truncate">{entry.title}</span>
          </NextLink>
          <span
            aria-hidden="true"
            className="mr-1 flex size-6 items-center justify-center rounded-sm text-transparent"
          >
            <ChevronDown className="size-3.5 opacity-0" />
          </span>
        </div>
      </li>
    )
  }

  const isOpen = openKeys.has(entry.key)
  const showIndicator = activeIndicatorKey === entry.key

  const toggle = () => {
    setOpenKeys((prev) => {
      if (prev.has(entry.key)) {
        return removeCategoryBranch(entry, prev)
      }

      const next = new Set(prev)
      next.add(entry.key)
      return next
    })
  }

  const onMainClick = () => {
    setOpenKeys((prev) => {
      if (!entry.href) {
        if (prev.has(entry.key)) {
          return removeCategoryBranch(entry, prev)
        }

        const next = new Set(prev)
        next.add(entry.key)
        return next
      }

      if (prev.has(entry.key)) {
        return prev
      }

      const next = new Set(prev)
      next.add(entry.key)
      return next
    })
  }

  const rowClassName = cn(
    "group relative flex w-full items-center rounded-md transition-colors",
    showIndicator ? "text-foreground" : "text-muted-foreground hover:bg-accent/45 hover:text-foreground"
  )

  const labelClassName = cn(
    "min-w-0 flex-1 px-2.5 py-1.5 pr-3 text-left text-sm",
    getSidebarDepthClassName(depth),
    showIndicator ? "font-medium" : ""
  )

  const activeStyle = showIndicator
    ? {
        backgroundColor: withAlpha(accent, 0.1),
        color: accent,
      }
    : undefined

  return (
    <li>
      <div className={rowClassName} style={activeStyle}>
        <SidebarActiveIndicator active={showIndicator} accent={accent} />

        {entry.href ? (
          <NextLink
            href={entry.href}
            onClick={onMainClick}
            className={labelClassName}
          >
            <span className="truncate">{entry.title}</span>
          </NextLink>
        ) : (
          <button
            type="button"
            onClick={onMainClick}
            className={labelClassName}
          >
            <span className="truncate">{entry.title}</span>
          </button>
        )}

        <button
          type="button"
          aria-label={isOpen ? `Collapse ${entry.title}` : `Expand ${entry.title}`}
          onClick={toggle}
          className="mr-1 flex size-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown
            className={cn("size-3.5 transition-transform duration-200", isOpen && "rotate-180")}
            style={showIndicator ? { color: accent } : undefined}
          />
        </button>
      </div>

      <div
        className={cn(
          "grid transition-all duration-200 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="space-y-0.5 py-0.5">
            {entry.items.map((child) => (
              <SidebarNavEntry
                key={child.key}
                entry={child}
                pathname={pathname}
                openKeys={openKeys}
                setOpenKeys={setOpenKeys}
                depth={depth + 1}
                activeIndicatorKey={activeIndicatorKey}
                accent={accent}
              />
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}

export function AppDocsSidebar({ tree, versionDocSlugs }: AppDocsSidebarProps) {
  const pathname = usePathname()
  const { isMobile, state, toggleSidebar } = useSidebar()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? resolvedTheme !== "light" : false

  const activeInstance = React.useMemo(
    () => getActiveInstanceFromPathname(pathname),
    [pathname]
  )
  const activeVersion = React.useMemo(
    () => getActiveVersionFromPathname(activeInstance, pathname),
    [activeInstance, pathname]
  )

  const [openDropdown, setOpenDropdown] = React.useState<OpenDropdown>(null)
  const [openKeys, setOpenKeys] = React.useState<Set<string>>(() =>
    collectActiveCategoryKeys(tree?.entries ?? [], pathname)
  )

  const switcherAreaRef = React.useRef<HTMLDivElement | null>(null)
  useOnClickOutside(switcherAreaRef, () => setOpenDropdown(null))

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenDropdown(null)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  React.useEffect(() => {
    setOpenDropdown(null)
  }, [pathname])

  React.useLayoutEffect(() => {
    setOpenKeys(collectActiveCategoryKeys(tree?.entries ?? [], pathname))
  }, [tree?.entries, pathname])

  const activeIndicatorKey = React.useMemo(() => {
    const entry = findActiveEntry(tree?.entries ?? [], pathname, openKeys)
    return entry?.key ?? null
  }, [tree?.entries, pathname, openKeys])

  const footerOffset = useFooterOffset()
  const isCollapsed = state === "collapsed"
  const accent = getInstanceAccent(activeInstance, isDark)

  const [showExpandButton, setShowExpandButton] = React.useState(false)

  React.useEffect(() => {
    if (!isMobile && isCollapsed) {
      const timeout = window.setTimeout(() => {
        setShowExpandButton(true)
      }, 200)

      return () => window.clearTimeout(timeout)
    }

    setShowExpandButton(false)
  }, [isCollapsed, isMobile])

  return (
    <>
      <Sidebar
        collapsible="offcanvas"
        variant="sidebar"
        className="overflow-visible border-r border-sidebar-border bg-sidebar"
      >
        <SidebarHeader className="gap-2 border-b border-sidebar-border bg-sidebar px-3 pt-2.5 pb-2.5">
          <div ref={switcherAreaRef} className={cn("space-y-2", !mounted && "invisible")}>
            <InstanceSwitcher
              activeInstance={activeInstance}
              open={openDropdown === "instance"}
              setOpen={(value) => setOpenDropdown(value ? "instance" : null)}
              isDark={isDark}
            />

            {activeInstance.versioned && activeVersion ? (
              <VersionSwitcher
                activeInstance={activeInstance}
                activeVersion={activeVersion}
                pathname={pathname}
                open={openDropdown === "version"}
                setOpen={(value) => setOpenDropdown(value ? "version" : null)}
                versionDocSlugs={versionDocSlugs}
                isDark={isDark}
              />
            ) : null}
          </div>
        </SidebarHeader>

        <SidebarContent className="min-h-0 pl-2.5 pr-1.5 py-2.5">
          <nav aria-label="Docs navigation">
            <ul className="space-y-0.5">
              {(tree?.entries ?? []).map((entry) => (
                <SidebarNavEntry
                  key={entry.key}
                  entry={entry}
                  pathname={pathname}
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  activeIndicatorKey={activeIndicatorKey}
                  accent={accent}
                />
              ))}
            </ul>
          </nav>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border px-2.5 py-2">
          <button
            type="button"
            aria-label="Collapse sidebar"
            onClick={toggleSidebar}
            className="ml-auto hidden h-8 w-8 items-center justify-center rounded-md border border-sidebar-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground md:flex"
          >
            <PanelLeftCloseIcon className="size-4" />
          </button>
        </SidebarFooter>
      </Sidebar>

      {!isMobile && showExpandButton ? (
        <button
          type="button"
          aria-label="Expand sidebar"
          onClick={toggleSidebar}
          className="fixed left-4 z-30 hidden h-9 w-9 items-center justify-center rounded-md border border-sidebar-border bg-sidebar text-muted-foreground shadow-md backdrop-blur animate-in fade-in-0 zoom-in-95 duration-150 hover:bg-accent hover:text-foreground md:flex"
          style={{ bottom: `calc(${footerOffset}px + 1rem)` }}
        >
          <PanelLeftCloseIcon className="size-4 rotate-180" style={{ color: accent }} />
        </button>
      ) : null}
    </>
  )
}
