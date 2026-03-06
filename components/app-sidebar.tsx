"use client"

import * as React from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import {
  Archive,
  ChevronDown,
  PanelLeftCloseIcon,
  Search,
  Tag,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInput,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {
  buildBaseHomeHref,
  buildVersionHref,
  getActiveInstanceFromPathname,
  getActiveVersionFromPathname,
  isLatestVersion,
  type WikiSidebarCategory,
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

function useSidebarToggleOutside() {
  const { state } = useSidebar()

  return (
    <SidebarTrigger
      className={cn(
        "fixed top-24 left-3 z-40 hidden h-10 w-10 items-center justify-center rounded-r-xl rounded-l-md border border-border bg-card/95 text-muted-foreground shadow-md backdrop-blur transition-all duration-200 hover:scale-[1.03] hover:bg-card hover:text-foreground md:flex",
        state === "expanded" && "hidden"
      )}
    >
      <PanelLeftCloseIcon className="size-4 rotate-180" />
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
                isActive ? "bg-card" : cn("hover:text-foreground", instance.accentSurfaceHoverClassName)
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

function VersionSwitcher({
  activeInstance,
  activeVersion,
  open,
  setOpen,
}: {
  activeInstance: WikiInstance
  activeVersion: NonNullable<ReturnType<typeof getActiveVersionFromPathname>>
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
              href={buildVersionHref(activeInstance, version.value)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 transition-all duration-150",
                isActive
                  ? "bg-card"
                  : latest
                    ? activeInstance.accentSurfaceHoverClassName
                    : "hover:bg-muted"
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

function ExpandedCollapseButton() {
  return (
    <SidebarTrigger className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all duration-200 hover:scale-[1.03] hover:bg-muted hover:text-foreground">
      <PanelLeftCloseIcon className="size-4" />
    </SidebarTrigger>
  )
}

function filterTree(entries: WikiSidebarEntry[], query: string): WikiSidebarEntry[] {
  if (!query.trim()) return entries

  const q = query.toLowerCase()

  return entries
    .map((entry) => {
      if (entry.kind === "page") {
        return entry.title.toLowerCase().includes(q) ? entry : null
      }

      const categoryMatches = entry.title.toLowerCase().includes(q)
      const filteredChildren = categoryMatches ? entry.items : filterTree(entry.items, query)

      if (!categoryMatches && filteredChildren.length === 0) return null

      return {
        ...entry,
        items: filteredChildren,
      } satisfies WikiSidebarCategory
    })
    .filter(Boolean) as WikiSidebarEntry[]
}

function collectActiveCategoryKeys(entries: WikiSidebarEntry[], pathname: string, out = new Set<string>()) {
  for (const entry of entries) {
    if (entry.kind !== "category") continue

    const selfActive = !!entry.href && (pathname === entry.href || pathname.startsWith(`${entry.href}/`))
    const childActive = entry.items.some((child) =>
      child.kind === "page"
        ? pathname === child.href
        : !!child.href && (pathname === child.href || pathname.startsWith(`${child.href}/`))
    )

    if (selfActive || childActive) out.add(entry.key)
    collectActiveCategoryKeys(entry.items, pathname, out)
  }

  return out
}

function NavIndicator({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full transition-all duration-150",
        active ? "bg-primary opacity-100" : "bg-primary opacity-0"
      )}
    />
  )
}

function SidebarNavEntry({
  entry,
  pathname,
  openKeys,
  setOpenKeys,
  depth = 0,
}: {
  entry: WikiSidebarEntry
  pathname: string
  openKeys: Set<string>
  setOpenKeys: React.Dispatch<React.SetStateAction<Set<string>>>
  depth?: number
}) {
  if (entry.kind === "page") {
    const isActive = pathname === entry.href

    return (
      <li className="relative">
        <NavIndicator active={isActive} />
        <NextLink
          href={entry.href}
          className={cn(
            "block rounded-md px-3 py-1.5 text-[15px] transition-colors",
            depth > 0 && "ml-4",
            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {entry.title}
        </NextLink>
      </li>
    )
  }

  const isOpen = openKeys.has(entry.key)
  const isActive =
    (!!entry.href && (pathname === entry.href || pathname.startsWith(`${entry.href}/`))) ||
    entry.items.some((child) =>
      child.kind === "page"
        ? pathname === child.href
        : !!child.href && (pathname === child.href || pathname.startsWith(`${child.href}/`))
    )

  const toggle = () => {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(entry.key)) next.delete(entry.key)
      else next.add(entry.key)
      return next
    })
  }

  const MainComp = entry.href ? NextLink : "div"
  const mainProps =
    entry.href
      ? {
          href: entry.href,
          onClick: () => {
            setOpenKeys((prev) => {
              const next = new Set(prev)
              next.add(entry.key)
              return next
            })
          },
        }
      : {}

  return (
    <li className="relative">
      <NavIndicator active={isActive} />
      <div className={cn("group flex items-center", depth > 0 && "ml-4")}>
        <MainComp
          className={cn(
            "min-w-0 flex-1 rounded-md px-3 py-1.5 text-[15px] transition-colors",
            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
          {...mainProps}
        >
          <span className="truncate">{entry.title}</span>
        </MainComp>

        <button
          type="button"
          aria-label={isOpen ? `Collapse ${entry.title}` : `Expand ${entry.title}`}
          onClick={toggle}
          className="mr-1 flex size-7 items-center justify-center rounded-full text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground group-hover:bg-muted"
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
  const { state } = useSidebar()

  const activeInstance = React.useMemo(
    () => getActiveInstanceFromPathname(pathname),
    [pathname]
  )

  const activeVersion = React.useMemo(
    () => getActiveVersionFromPathname(activeInstance, pathname),
    [activeInstance, pathname]
  )

  const [openDropdown, setOpenDropdown] = React.useState<OpenDropdown>(null)
  const [search, setSearch] = React.useState("")
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

  const filteredEntries = React.useMemo(
    () => filterTree(tree?.entries ?? [], search),
    [tree?.entries, search]
  )

  React.useEffect(() => {
    const activeKeys = collectActiveCategoryKeys(tree?.entries ?? [], pathname)
    setOpenKeys((prev) => {
      const next = new Set(prev)
      activeKeys.forEach((key) => next.add(key))
      return next
    })
  }, [pathname, tree?.entries])

  return (
    <>
      {useSidebarToggleOutside()}

      <Sidebar
        collapsible="offcanvas"
        variant="sidebar"
        className="border-r border-border bg-sidebar"
      >
        <SidebarHeader className="sticky top-0 z-10 gap-4 border-b border-border bg-sidebar px-4 pt-6 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold text-foreground">Documentation</div>
            {state === "expanded" ? <ExpandedCollapseButton /> : null}
          </div>

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
                open={openDropdown === "version"}
                setOpen={(value) => setOpenDropdown(value ? "version" : null)}
              />
            ) : null}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4 py-4">
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <SidebarInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the docs..."
              className="h-8 rounded-xl border-border bg-card pl-9 text-sm"
            />
          </div>

          <nav aria-label="Wiki navigation">
            <ul className="space-y-1">
              {filteredEntries.map((entry) => (
                <SidebarNavEntry
                  key={entry.key}
                  entry={entry}
                  pathname={pathname}
                  openKeys={openKeys}
                  setOpenKeys={setOpenKeys}
                />
              ))}
            </ul>
          </nav>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
