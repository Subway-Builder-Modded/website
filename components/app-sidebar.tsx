"use client"

import * as React from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import {
  Archive,
  ChevronDown,
  PanelLeftCloseIcon,
  Tag,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useFooterOffset } from "@/hooks/use-footer-offset"
import {
  buildBaseHomeHref,
  buildVersionedDocHref,
  getActiveInstanceFromPathname,
  getActiveVersionFromPathname,
  isLatestVersion,
  type WikiSidebarEntry,
  type WikiSidebarTree,
} from "@/lib/wiki-shared"
import { WIKI_INSTANCES, type WikiInstance, type WikiVersion } from "@/lib/wiki-config"

type AppWikiSidebarProps = {
  tree?: WikiSidebarTree
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

function SidebarRailTrigger() {
  return (
    <SidebarTrigger
      className={cn(
        "absolute top-6 -right-10 z-[-1] flex h-14 w-10 items-center justify-center rounded-r-xl border border-l-0 border-border bg-card/95 text-muted-foreground shadow-md backdrop-blur transition-colors duration-200 hover:bg-card hover:text-foreground"
      )}
    >
      <PanelLeftCloseIcon
        className="size-4 transition-transform duration-200 group-data-[state=collapsed]:rotate-180"
      />
    </SidebarTrigger>
  )
}

function InstanceIcon({ instance }: { instance: WikiInstance }) {
  const Icon = instance.icon

  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-150",
        instance.accentIconSurfaceClassName
      )}
    >
      <Icon className={cn("size-4", instance.accentClassName)} />
    </div>
  )
}

function VersionIcon({
  instance,
  version,
}: {
  instance: WikiInstance
  version: WikiVersion
}) {
  const Icon = version.icon ?? (isLatestVersion(instance, version.value) ? Tag : Archive)
  const latest = isLatestVersion(instance, version.value)

  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-150",
        latest ? instance.accentIconSurfaceClassName : "border-border/80 bg-muted"
      )}
    >
      <Icon
        className={cn(
          "size-4",
          latest ? instance.accentClassName : "text-muted-foreground"
        )}
      />
    </div>
  )
}

function StatusBadge({
  kind,
  instance,
}: {
  kind: "latest" | "deprecated"
  instance: WikiInstance
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full border px-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
        kind === "latest"
          ? cn(instance.accentSurfaceClassName, instance.accentClassName)
          : "border-zinc-400/25 bg-zinc-500/12 text-zinc-300"
      )}
    >
      {kind === "latest" ? "Latest" : "Deprecated"}
    </span>
  )
}

function DropdownTrigger({
  open,
  onToggle,
  className,
  children,
}: {
  open: boolean
  onToggle: () => void
  className?: string
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
      <div className="min-h-0 overflow-hidden">
        <div className="overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
          {children}
        </div>
      </div>
    </div>
  )
}

function InstanceSwitcher({
  activeInstance,
  open,
  setOpen,
}: {
  activeInstance: WikiInstance
  open: boolean
  setOpen: (value: boolean) => void
}) {
  return (
    <div>
      <DropdownTrigger
        open={open}
        onToggle={() => setOpen(!open)}
        className={cn(
          "border-transparent text-white",
          activeInstance.accentSurfaceClassName,
          activeInstance.accentSurfaceHoverClassName
        )}
      >
        <InstanceIcon instance={activeInstance} />
        <div className="pr-1">
          <div className="text-[15px] font-semibold leading-tight text-white">
            {activeInstance.label}
          </div>
        </div>
      </DropdownTrigger>

      <DropdownPanel open={open}>
        {WIKI_INSTANCES.map((instance) => {
          const isActive = instance.id === activeInstance.id

          return (
            <NextLink
              key={instance.id}
              href={buildBaseHomeHref(instance)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 transition-all duration-150",
                isActive
                  ? cn(instance.accentSurfaceClassName)
                  : instance.accentSurfaceHoverClassName
              )}
            >
              <InstanceIcon instance={instance} />
              <div className="min-w-0 flex-1 pr-1">
                <div className="text-[15px] font-semibold leading-tight text-foreground">
                  {instance.label}
                </div>
              </div>
            </NextLink>
          )
        })}
      </DropdownPanel>
    </div>
  )
}

function getVersionHoverClassName(instance: WikiInstance, version: WikiVersion) {
  const latest = isLatestVersion(instance, version.value)
  if (latest) {
    return instance.accentSurfaceHoverClassName
  }
  // Non-latest: use a lighter version of the deprecated surface color in dark mode
  return cn(
    "hover:bg-zinc-500/12",
    "dark:hover:bg-zinc-400/18"
  )
}

function VersionSwitcher({
  activeInstance,
  activeVersion,
  pathname,
  open,
  setOpen,
}: {
  activeInstance: WikiInstance
  activeVersion: NonNullable<ReturnType<typeof getActiveVersionFromPathname>>
  pathname: string
  open: boolean
  setOpen: (value: boolean) => void
}) {
  if (!activeInstance.versioned || !activeInstance.versions?.length) return null

  return (
    <div>
      <DropdownTrigger
        open={open}
        onToggle={() => setOpen(!open)}
        className="border-transparent bg-card text-foreground hover:bg-card/90"
      >
        <VersionIcon instance={activeInstance} version={activeVersion} />
        <div className="pr-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-semibold leading-tight text-foreground">
              {activeVersion.label}
            </span>
            {isLatestVersion(activeInstance, activeVersion.value) ? (
              <StatusBadge kind="latest" instance={activeInstance} />
            ) : null}
            {activeVersion.deprecated ? (
              <StatusBadge kind="deprecated" instance={activeInstance} />
            ) : null}
          </div>
        </div>
      </DropdownTrigger>

      <DropdownPanel open={open}>
        {activeInstance.versions.map((version) => {
          const isActive = version.value === activeVersion.value
          const latest = isLatestVersion(activeInstance, version.value)

          return (
            <NextLink
              key={version.value}
              href={buildVersionedDocHref(activeInstance, version.value, pathname)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 transition-all duration-150",
                isActive
                  ? cn(
                      latest
                        ? activeInstance.accentSurfaceClassName.replace("/14", "/10")
                        : "bg-zinc-500/12 dark:bg-zinc-400/14"
                    )
                  : getVersionHoverClassName(activeInstance, version)
              )}
            >
              <VersionIcon instance={activeInstance} version={version} />
              <div className="min-w-0 flex-1 pr-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-semibold leading-tight text-foreground">
                    {version.label}
                  </span>
                  {latest ? <StatusBadge kind="latest" instance={activeInstance} /> : null}
                  {version.deprecated ? (
                    <StatusBadge kind="deprecated" instance={activeInstance} />
                  ) : null}
                </div>
              </div>
            </NextLink>
          )
        })}
      </DropdownPanel>
    </div>
  )
}

function entryHasActiveDescendant(entry: WikiSidebarEntry, pathname: string): boolean {
  if (entry.kind === "page") {
    return pathname === entry.href
  }

  return entry.items.some((child) => entryHasActiveDescendant(child, pathname))
}

function collectActiveCategoryKeys(
  entries: WikiSidebarEntry[],
  pathname: string,
  out = new Set<string>()
) {
  for (const entry of entries) {
    if (entry.kind !== "category") continue

    const childActive = entry.items.some((child) => entryHasActiveDescendant(child, pathname))
    if (childActive) out.add(entry.key)

    collectActiveCategoryKeys(entry.items, pathname, out)
  }

  return out
}

function findActiveEntry(
  entries: WikiSidebarEntry[],
  pathname: string,
  openKeys: Set<string>
): WikiSidebarEntry | null {
  for (const entry of entries) {
    if (entry.kind === "page") {
      if (pathname === entry.href) return entry
    } else {
      const selfActive = !!entry.href && pathname === entry.href
      const descendantActive = entry.items.some((child) => entryHasActiveDescendant(child, pathname))

      if (selfActive || descendantActive) {
        if (openKeys.has(entry.key)) {
          const deeper = findActiveEntry(entry.items, pathname, openKeys)
          if (deeper) return deeper
        }
        if (selfActive || descendantActive) return entry
      }
    }
  }
  return null
}

function SidebarNavEntry({
  entry,
  pathname,
  openKeys,
  setOpenKeys,
  depth = 0,
  activeIndicatorKey,
}: {
  entry: WikiSidebarEntry
  pathname: string
  openKeys: Set<string>
  setOpenKeys: React.Dispatch<React.SetStateAction<Set<string>>>
  depth?: number
  activeIndicatorKey: string | null
}) {
  if (entry.kind === "page") {
    const showIndicator = activeIndicatorKey === entry.key

    return (
      <li className="relative">
        <NextLink
          href={entry.href}
          className={cn(
            "relative block rounded-md px-3 py-1.5 text-[15px] transition-colors",
            depth > 0 && "ml-4",
            showIndicator ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span
            className={cn(
              "absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-primary transition-all duration-300",
              showIndicator ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
            )}
          />
          <span className="block truncate">{entry.title}</span>
        </NextLink>
      </li>
    )
  }

  const isOpen = openKeys.has(entry.key)
  const showIndicator = activeIndicatorKey === entry.key

  const toggle = () => {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(entry.key)) next.delete(entry.key)
      else next.add(entry.key)
      return next
    })
  }

  const onMainClick = (event: React.MouseEvent) => {
    setOpenKeys((prev) => {
      const next = new Set(prev)

      if (!entry.href) {
        if (next.has(entry.key)) next.delete(entry.key)
        else next.add(entry.key)
        return next
      }

      if (pathname === entry.href) {
        event.preventDefault()
        if (next.has(entry.key)) next.delete(entry.key)
        else next.add(entry.key)
        return next
      }

      next.add(entry.key)
      return next
    })
  }

  const labelClassName = cn(
    "min-w-0 flex-1 rounded-md px-3 py-1.5 text-left text-[15px] transition-colors",
    showIndicator ? "text-primary" : "text-muted-foreground hover:text-foreground"
  )

  return (
    <li className="relative">
      <div className={cn("group relative flex items-center", depth > 0 && "ml-4")}>
        <span
          className={cn(
            "absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-primary transition-all duration-300",
            showIndicator ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
          )}
        />
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
          className="mr-1 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground group-hover:bg-muted group-hover:text-foreground"
        >
          <ChevronDown
            className={cn("size-4 transition-transform duration-200", isOpen && "rotate-180")}
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
              />
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}

export function AppWikiSidebar({ tree }: AppWikiSidebarProps) {
  const pathname = usePathname()
  const activeInstance = React.useMemo(
    () => getActiveInstanceFromPathname(pathname),
    [pathname]
  )
  const activeVersion = React.useMemo(
    () => getActiveVersionFromPathname(activeInstance, pathname),
    [activeInstance, pathname]
  )

  const [openDropdown, setOpenDropdown] = React.useState<OpenDropdown>(null)
  const [openKeys, setOpenKeys] = React.useState<Set<string>>(new Set())

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

  React.useEffect(() => {
    const activeKeys = collectActiveCategoryKeys(tree?.entries ?? [], pathname)
    setOpenKeys((prev) => {
      const next = new Set(prev)
      activeKeys.forEach((key) => next.add(key))
      return next
    })
  }, [pathname, tree?.entries])

  const activeIndicatorKey = React.useMemo(() => {
    const entry = findActiveEntry(tree?.entries ?? [], pathname, openKeys)
    return entry?.key ?? null
  }, [tree?.entries, pathname, openKeys])

  const footerOffset = useFooterOffset()

  return (
    <>
      <Sidebar
        collapsible="offcanvas"
        variant="sidebar"
        className="overflow-visible border-r border-border bg-sidebar"
        trigger={<SidebarRailTrigger />}
        style={{ "--footer-offset": `${footerOffset}px` } as React.CSSProperties}
      >
        <SidebarHeader className="gap-3 border-b border-border bg-sidebar px-6 pt-3 pb-3">
          <div ref={switcherAreaRef} className="space-y-3">
            <InstanceSwitcher
              activeInstance={activeInstance}
              open={openDropdown === "instance"}
              setOpen={(value) => setOpenDropdown(value ? "instance" : null)}
            />

            {activeInstance.versioned && activeVersion ? (
              <VersionSwitcher
                activeInstance={activeInstance}
                activeVersion={activeVersion}
                pathname={pathname}
                open={openDropdown === "version"}
                setOpen={(value) => setOpenDropdown(value ? "version" : null)}
              />
            ) : null}
          </div>
        </SidebarHeader>

        <SidebarContent className="min-h-0 px-4 py-4">
          <nav aria-label="Wiki navigation">
            <ul className="space-y-0.5">
              {(tree?.entries ?? []).map((entry) => (
                <SidebarNavEntry
                  key={entry.key}
                  entry={entry}
                  pathname={pathname}
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                  activeIndicatorKey={activeIndicatorKey}
                />
              ))}
            </ul>
          </nav>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
