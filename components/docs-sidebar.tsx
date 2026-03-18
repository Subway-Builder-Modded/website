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
import { PROJECT_COLOR_SCHEMES, getModeHex } from "@/config/theme/colors"
import { DOCS_INSTANCES, type DocsInstance, type DocsVersion } from "@/config/content/docs"
import { normalizePath } from "@/lib/url"

type AppDocsSidebarProps = {
  tree?: DocsSidebarTree
  versionDocSlugs?: Record<string, string[]>
}

type OpenDropdown = "instance" | "version" | null

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
  isDark,
  variant = "trigger",
  transparentBackground = false,
}: {
  instance: DocsInstance
  isDark: boolean
  variant?: "trigger" | "dropdown"
  transparentBackground?: boolean
}) {
  const Icon = instance.icon
  const scheme = PROJECT_COLOR_SCHEMES[instance.id]

  const secondary = getModeHex(scheme.secondaryHex, isDark)
  const tertiary = getModeHex(scheme.tertiaryHex, isDark)
  const text = getModeHex(scheme.textHex, isDark)

  return (
    <div
      className="flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-150"
      style={{
        backgroundColor:
          variant === "dropdown" && !transparentBackground
            ? secondary
            : "transparent",
        borderColor: tertiary,
      }}
    >
      <Icon
        className="size-4 transition-colors duration-150"
        style={{ color: text }}
      />
    </div>
  )
}

function VersionIcon({
  instance,
  version,
  isDark,
  variant = "trigger",
  transparentBackground = false,
}: {
  instance: DocsInstance
  version: DocsVersion
  isDark: boolean
  variant?: "trigger" | "dropdown"
  transparentBackground?: boolean
}) {
  const Icon = version.icon ?? (isLatestVersion(instance, version.value) ? Tag : Archive)
  const scheme = PROJECT_COLOR_SCHEMES[instance.id]

  const secondary = getModeHex(scheme.secondaryHex, isDark)
  const tertiary = getModeHex(scheme.tertiaryHex, isDark)
  const text = getModeHex(scheme.textHex, isDark)

  return (
    <div
      className="flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-150"
      style={{
        backgroundColor:
          variant === "dropdown" && !transparentBackground
            ? secondary
            : "transparent",
        borderColor: tertiary,
      }}
    >
      <Icon
        className="size-4 transition-colors duration-150"
        style={{ color: text }}
      />
    </div>
  )
}

function StatusBadge({
  kind,
  instance,
  isDark,
}: {
  kind: "latest" | "deprecated"
  instance: DocsInstance
  isDark: boolean
}) {
  const scheme = PROJECT_COLOR_SCHEMES[instance.id]

  const secondary = getModeHex(scheme.secondaryHex, isDark)
  const tertiary = getModeHex(scheme.tertiaryHex, isDark)
  const text = getModeHex(scheme.textHex, isDark)

  if (kind === "latest") {
    return (
      <span
        className="inline-flex h-5 items-center rounded-full border px-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
        style={{
          backgroundColor: secondary,
          borderColor: tertiary,
          color: text,
        }}
      >
        Latest
      </span>
    )
  }

  return (
    <span
      className="inline-flex h-5 items-center rounded-full border px-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
      style={{
        backgroundColor: secondary,
        borderColor: tertiary,
        color: text,
      }}
    >
      Deprecated
    </span>
  )
}

function DropdownTrigger({
  open,
  onToggle,
  className,
  style,
  chevronColor,
  children,
}: {
  open: boolean
  onToggle: () => void
  className?: string
  style?: React.CSSProperties
  chevronColor?: string
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
      style={style}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all duration-150 hover:scale-[1.01]",
        open && "scale-[0.995]",
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          "ml-auto size-4 shrink-0 transition-transform duration-200",
          open && "rotate-180"
        )}
        style={{ color: chevronColor ?? "currentColor" }}
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
        open ? "mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="min-h-0 overflow-x-visible overflow-y-hidden">
        <div className="overflow-hidden rounded-xl border border-sidebar-border bg-popover shadow-xl">
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
  const [hovered, setHovered] = React.useState(false)
  const scheme = PROJECT_COLOR_SCHEMES[instance.id]
  
  const secondary = getModeHex(scheme.secondaryHex, isDark)
  const text = getModeHex(scheme.textHex, isDark)

  return (
    <NextLink
      href={href}
      aria-current={isActive ? "page" : undefined}
      className="group/dropdown-item flex items-center gap-3 px-3 py-2 transition-colors duration-150"
      style={
        hovered
          ? { backgroundColor: secondary, color: text }
          : { backgroundColor: "transparent", color: text }
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <InstanceIcon
        instance={instance}
        isDark={isDark}
        variant="dropdown"
        transparentBackground={hovered}
      />
      <div className="min-w-0 flex-1 pr-1">
        <div className="text-[15px] font-semibold leading-tight">{instance.label}</div>
      </div>
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
  const [hovered, setHovered] = React.useState(false)
  const scheme = PROJECT_COLOR_SCHEMES[instance.id]

  const secondary = getModeHex(scheme.secondaryHex, isDark)
  const text = getModeHex(scheme.textHex, isDark)
  const latest = isLatestVersion(instance, version.value)

  return (
    <NextLink
      href={href}
      aria-current={isActive ? "page" : undefined}
      className="group/dropdown-item flex items-center gap-3 px-3 py-2 transition-colors duration-150"
      style={
        hovered
          ? { backgroundColor: secondary, color: text }
          : { backgroundColor: "transparent", color: text }
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <VersionIcon
        instance={instance}
        version={version}
        isDark={isDark}
        variant="dropdown"
        transparentBackground={hovered}
      />
      <div className="min-w-0 flex-1 pr-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-semibold leading-tight">{version.label}</span>
          {latest ? <StatusBadge kind="latest" instance={instance} isDark={isDark} /> : null}
          {version.deprecated ? <StatusBadge kind="deprecated" instance={instance} isDark={isDark} /> : null}
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
  className,
}: {
  active: boolean
  className: string
}) {
  return (
    <span
      className={cn(
        "absolute top-1.5 right-0 bottom-1.5 w-[2px] rounded-full transition-all duration-200",
        className,
        active ? "opacity-100" : "opacity-0"
      )}
    />
  )
}

function getSidebarDepthClassName(depth: number) {
  if (depth <= 0) return ""
  if (depth === 1) return "pl-6"
  if (depth === 2) return "pl-9"
  if (depth === 3) return "pl-12"
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
  const scheme = PROJECT_COLOR_SCHEMES[activeInstance.id]

  const secondary = getModeHex(scheme.secondaryHex, isDark)
  const tertiary = getModeHex(scheme.tertiaryHex, isDark)
  const text = getModeHex(scheme.textHex, isDark)

  return (
    <div>
      <DropdownTrigger
        open={open}
        onToggle={() => setOpen(!open)}
        chevronColor={text}
        className="transition-opacity duration-150 hover:opacity-90"
        style={{ backgroundColor: secondary, color: text, borderColor: tertiary }}
      >
        <InstanceIcon instance={activeInstance} isDark={isDark} />
        <div className="pr-1">
          <div className="text-[15px] font-semibold leading-tight">{activeInstance.label}</div>
        </div>
      </DropdownTrigger>

      <DropdownPanel open={open}>
        {DOCS_INSTANCES.map((instance) => (
          <InstanceDropdownRow
            key={instance.id}
            instance={instance}
            isActive={instance.id === activeInstance.id}
            href={buildBaseHomeHref(instance)}
            isDark={isDark}
          />
        ))}
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

  const scheme = PROJECT_COLOR_SCHEMES[activeInstance.id]

  const secondary = getModeHex(scheme.secondaryHex, isDark)
  const tertiary = getModeHex(scheme.tertiaryHex, isDark)
  const text = getModeHex(scheme.textHex, isDark)

  return (
    <div>
      <DropdownTrigger
        open={open}
        onToggle={() => setOpen(!open)}
        chevronColor={text}
        className="transition-opacity duration-150 hover:opacity-90"
        style={{
          backgroundColor: secondary,
          color: text,
          borderColor: tertiary,
        }}
      >
        <VersionIcon instance={activeInstance} version={activeVersion} isDark={isDark} />
        <div className="pr-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-semibold leading-tight">
              {activeVersion.label}
            </span>
            {isLatestVersion(activeInstance, activeVersion.value) ? (
              <StatusBadge kind="latest" instance={activeInstance} isDark={isDark} />
            ) : null}
            {activeVersion.deprecated ? (
              <StatusBadge kind="deprecated" instance={activeInstance} isDark={isDark} />
            ) : null}
          </div>
        </div>
      </DropdownTrigger>

      <DropdownPanel open={open}>
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
      </DropdownPanel>
    </div>
  )
}

function SidebarNavEntry({
  entry,
  pathname,
  openKeys,
  setOpenKeys,
  depth = 0,
  activeIndicatorKey,
  activeTextClassName,
  activeIndicatorClassName,
  hoverTextClassName,
  isDark,
}: {
  entry: DocsSidebarEntry
  pathname: string
  openKeys: Set<string>
  setOpenKeys: React.Dispatch<React.SetStateAction<Set<string>>>
  depth?: number
  activeIndicatorKey: string | null
  activeTextClassName: string
  activeIndicatorClassName: string
  hoverTextClassName: string
  isDark: boolean
}) {
  if (entry.kind === "page") {
    const showIndicator = activeIndicatorKey === entry.key

    return (
      <li className="relative">
        <SidebarActiveIndicator active={showIndicator} className={activeIndicatorClassName} />
        <NextLink
          href={entry.href}
          className={cn(
            "relative block rounded-md px-3 py-1.5 pr-5 text-[15px] transition-colors",
            getSidebarDepthClassName(depth),
            showIndicator
              ? cn("font-medium", activeTextClassName)
              : cn(isDark ? "text-white" : "text-foreground", hoverTextClassName)
          )}
        >
          <span className="block truncate">{entry.title}</span>
        </NextLink>
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

  const labelClassName = cn(
    "min-w-0 flex-1 rounded-md px-3 py-1.5 pr-5 text-left text-[15px] transition-colors",
    getSidebarDepthClassName(depth),
    showIndicator
      ? cn("font-medium", activeTextClassName)
      : cn(isDark ? "text-white" : "text-foreground", hoverTextClassName)
  )

  return (
    <li>
      <div className="group relative flex w-full items-center">
        <SidebarActiveIndicator active={showIndicator} className={activeIndicatorClassName} />

        {entry.href ? (
          <NextLink href={entry.href} onClick={onMainClick} className={labelClassName}>
            <span className="truncate">{entry.title}</span>
          </NextLink>
        ) : (
          <button type="button" onClick={onMainClick} className={labelClassName}>
            <span className="truncate">{entry.title}</span>
          </button>
        )}

        <button
          type="button"
          aria-label={isOpen ? `Collapse ${entry.title}` : `Expand ${entry.title}`}
          onClick={toggle}
          className="mr-1 flex size-7 items-center justify-center"
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              showIndicator && "text-[var(--Docs-active-color)]",
              isOpen && "rotate-180"
            )}
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
          <ul className="space-y-0.5 py-1">
            {entry.items.map((child) => (
              <SidebarNavEntry
                key={child.key}
                entry={child}
                pathname={pathname}
                openKeys={openKeys}
                setOpenKeys={setOpenKeys}
                depth={depth + 1}
                activeIndicatorKey={activeIndicatorKey}
                activeTextClassName={activeTextClassName}
                activeIndicatorClassName={activeIndicatorClassName}
                hoverTextClassName={hoverTextClassName}
                isDark={isDark}
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
  const scheme = PROJECT_COLOR_SCHEMES[activeInstance.id]
  const color = getModeHex(scheme.primaryHex, isDark)

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
        <SidebarHeader className="gap-3 border-b border-sidebar-border bg-sidebar px-6 pt-3 pb-3">
          <div ref={switcherAreaRef} className={cn("space-y-3", !mounted && "invisible")}>
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

        <SidebarContent
          className="min-h-0 pl-4 pr-0 py-4"
          style={
            {
              ["--Docs-hover-color" as string]: color,
              ["--Docs-active-color" as string]: color,
              ["--Docs-indicator-color" as string]: color,
            } as React.CSSProperties
          }
        >
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
                  activeTextClassName="text-[var(--Docs-active-color)]"
                  activeIndicatorClassName="bg-[var(--Docs-indicator-color)]"
                  hoverTextClassName="hover:text-[var(--Docs-hover-color)]"
                  isDark={isDark}
                />
              ))}
            </ul>
          </nav>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border px-3 py-2">
          <button
            type="button"
            aria-label="Collapse sidebar"
            onClick={toggleSidebar}
            className="ml-auto hidden h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border bg-card/90 text-muted-foreground shadow-sm transition-colors hover:bg-card hover:text-foreground md:flex"
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
          className="fixed left-4 z-30 hidden h-10 w-10 items-center justify-center rounded-lg border border-sidebar-border bg-zinc-950/95 text-muted-foreground shadow-md backdrop-blur animate-in fade-in-0 zoom-in-95 duration-150 hover:bg-zinc-900 hover:text-foreground md:flex"
          style={{ bottom: `calc(${footerOffset}px + 1rem)` }}
        >
          <PanelLeftCloseIcon className="size-4 rotate-180" />
        </button>
      ) : null}
    </>
  )
}

