'use client';

import * as React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Archive, ChevronDown, PanelLeftCloseIcon, Tag } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  buildDocsHubHref,
  buildVersionedDocHref,
  getActiveInstanceFromPathname,
  getActiveVersionFromPathname,
  getDocSlugFromPathname,
  isLatestVersion,
  type DocsSidebarEntry,
  type DocsSidebarTree,
} from '@/lib/docs/shared';
import { type DocsInstance, type DocsVersion } from '@/config/content/docs';
import { normalizePath } from '@/lib/url';
import { PROJECT_COLOR_SCHEMES, getModeHex } from '@/config/theme/colors';
import { PageHeader } from '@/components/page/page-header';

type AppDocsSidebarProps = {
  tree?: DocsSidebarTree;
  versionDocSlugs?: Record<string, string[]>;
  open: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  isMobileResolved: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

const SWITCHER_ROW_HIGHLIGHT_ALPHA = 0.12;
const SWITCHER_ICON_CONTRAST_ALPHA = 0.08;
const SIDEBAR_WIDTH_REM = 15.5;

function withAlpha(color: string, alpha: number) {
  const normalized = color.trim();

  if (!normalized.startsWith('#')) {
    return color;
  }

  const hex = normalized.slice(1);
  const fullHex =
    hex.length === 3
      ? hex
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : hex.length === 6
        ? hex
        : null;

  if (!fullHex) {
    return color;
  }

  const r = Number.parseInt(fullHex.slice(0, 2), 16);
  const g = Number.parseInt(fullHex.slice(2, 4), 16);
  const b = Number.parseInt(fullHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getInstanceAccent(instance: DocsInstance, isDark: boolean) {
  return getModeHex(PROJECT_COLOR_SCHEMES[instance.id].accentColor, isDark);
}

function getInstanceBadgeScheme(instance: DocsInstance) {
  const accent = PROJECT_COLOR_SCHEMES[instance.id].accentColor;

  return {
    border: {
      light: withAlpha(accent.light, 0.45),
      dark: withAlpha(accent.dark, 0.5),
    },
    background: {
      light: withAlpha(accent.light, 0.12),
      dark: withAlpha(accent.dark, 0.2),
    },
    text: accent,
  };
}

function getSwitcherRowBackground(accent: string, highlighted: boolean) {
  return highlighted
    ? withAlpha(accent, SWITCHER_ROW_HIGHLIGHT_ALPHA)
    : undefined;
}

function getSwitcherIconBackground(
  accent: string,
  isDark: boolean,
  highlighted: boolean,
) {
  if (highlighted) {
    return withAlpha(
      accent,
      SWITCHER_ROW_HIGHLIGHT_ALPHA + SWITCHER_ICON_CONTRAST_ALPHA,
    );
  }

  return isDark
    ? `rgba(255, 255, 255, ${SWITCHER_ICON_CONTRAST_ALPHA})`
    : `rgba(0, 0, 0, ${SWITCHER_ICON_CONTRAST_ALPHA})`;
}

function useOnClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
) {
  React.useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (!ref.current || ref.current.contains(target)) return;
      handler();
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [ref, handler]);
}

function VersionIcon({
  instance,
  version,
  accent,
  isDark,
  active,
}: {
  instance: DocsInstance;
  version: DocsVersion;
  accent: string;
  isDark: boolean;
  active?: boolean;
}) {
  const Icon =
    version.icon ?? (isLatestVersion(instance, version.value) ? Tag : Archive);

  return (
    <span
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground',
        active && 'text-foreground',
      )}
      style={{
        backgroundColor: getSwitcherIconBackground(accent, isDark, !!active),
        borderColor: active ? withAlpha(accent, 0.5) : undefined,
        color: active ? accent : undefined,
      }}
    >
      <Icon className="size-3.5" />
    </span>
  );
}

function StatusBadge({
  kind,
  accent,
}: {
  kind: 'latest' | 'deprecated';
  accent: string;
}) {
  if (kind === 'latest') {
    return (
      <span
        className="inline-flex h-4.5 items-center rounded-full border px-1.5 text-[9px] font-semibold normal-case tracking-[0.08em]"
        style={{
          borderColor: withAlpha(accent, 0.45),
          backgroundColor: withAlpha(accent, 0.1),
          color: accent,
        }}
      >
        Latest
      </span>
    );
  }

  return (
    <span className="inline-flex h-4.5 items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-1.5 text-[9px] font-semibold normal-case tracking-[0.08em] text-amber-500">
      Deprecated
    </span>
  );
}

function DropdownTrigger({
  open,
  accent,
  onToggle,
  children,
}: {
  open: boolean;
  accent: string;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (
          event.key === 'ArrowDown' ||
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
          onToggle();
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
          'ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-150',
          open && 'rotate-180',
        )}
        style={open ? { color: accent } : undefined}
      />
    </button>
  );
}

function DropdownPanel({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'grid transition-all duration-200 ease-out',
        open
          ? 'mt-1.5 grid-rows-[1fr] opacity-100'
          : 'mt-0 grid-rows-[0fr] opacity-0',
      )}
    >
      <div className="min-h-0 overflow-x-visible overflow-y-hidden">
        <div className="overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-md ring-1 ring-foreground/8">
          {children}
        </div>
      </div>
    </div>
  );
}

function VersionDropdownRow({
  instance,
  version,
  isActive,
  href,
  isDark,
}: {
  instance: DocsInstance;
  version: DocsVersion;
  isActive: boolean;
  href: string;
  isDark: boolean;
}) {
  const accent = getInstanceAccent(instance, isDark);
  const latest = isLatestVersion(instance, version.value);
  const [hovered, setHovered] = React.useState(false);
  const highlighted = isActive || hovered;

  return (
    <NextLink
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className="flex min-h-9 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
      style={
        highlighted
          ? {
              backgroundColor: getSwitcherRowBackground(accent, highlighted),
              color: accent,
            }
          : undefined
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <VersionIcon
        instance={instance}
        version={version}
        accent={accent}
        isDark={isDark}
        active={highlighted}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate font-medium">{version.label}</span>
          {latest ? <StatusBadge kind="latest" accent={accent} /> : null}
          {version.deprecated ? (
            <StatusBadge kind="deprecated" accent={accent} />
          ) : null}
        </div>
      </div>
    </NextLink>
  );
}

function entryIsSelfActive(entry: DocsSidebarEntry, pathname: string): boolean {
  if (entry.kind === 'page') {
    return normalizePath(pathname) === normalizePath(entry.href);
  }

  return !!entry.href && normalizePath(pathname) === normalizePath(entry.href);
}

function entryHasActiveDescendant(
  entry: DocsSidebarEntry,
  pathname: string,
): boolean {
  if (entry.kind === 'page') {
    return normalizePath(pathname) === normalizePath(entry.href);
  }

  return entry.items.some((child) => {
    if (child.kind === 'page') {
      return normalizePath(pathname) === normalizePath(child.href);
    }

    return (
      entryIsSelfActive(child, pathname) ||
      entryHasActiveDescendant(child, pathname)
    );
  });
}

function collectCategoryKeys(entry: DocsSidebarEntry, out = new Set<string>()) {
  if (entry.kind !== 'category') return out;

  out.add(entry.key);

  for (const child of entry.items) {
    collectCategoryKeys(child, out);
  }

  return out;
}

function removeCategoryBranch(entry: DocsSidebarEntry, openKeys: Set<string>) {
  const next = new Set(openKeys);
  const keysToRemove = collectCategoryKeys(entry);

  keysToRemove.forEach((key) => next.delete(key));
  return next;
}

function collectActiveCategoryKeys(
  entries: DocsSidebarEntry[],
  pathname: string,
  out = new Set<string>(),
) {
  for (const entry of entries) {
    if (entry.kind !== 'category') continue;

    const selfActive = entryIsSelfActive(entry, pathname);
    const childActive = entry.items.some((child) =>
      child.kind === 'page'
        ? normalizePath(pathname) === normalizePath(child.href)
        : entryIsSelfActive(child, pathname) ||
          entryHasActiveDescendant(child, pathname),
    );

    if (selfActive || childActive) out.add(entry.key);

    collectActiveCategoryKeys(entry.items, pathname, out);
  }

  return out;
}

function findActiveEntry(
  entries: DocsSidebarEntry[],
  pathname: string,
  openKeys: Set<string>,
): DocsSidebarEntry | null {
  const normalizedPathname = normalizePath(pathname);

  for (const entry of entries) {
    if (entry.kind === 'page') {
      if (normalizedPathname === normalizePath(entry.href)) return entry;
      continue;
    }

    const selfActive = entryIsSelfActive(entry, normalizedPathname);
    const descendantActive = entry.items.some((child) =>
      child.kind === 'page'
        ? normalizedPathname === normalizePath(child.href)
        : entryIsSelfActive(child, normalizedPathname) ||
          entryHasActiveDescendant(child, normalizedPathname),
    );

    if (!selfActive && !descendantActive) continue;

    if (openKeys.has(entry.key)) {
      const deeper = findActiveEntry(entry.items, normalizedPathname, openKeys);
      return deeper ?? entry;
    }

    return entry;
  }

  return null;
}

function SidebarActiveIndicator({
  active,
  accent,
}: {
  active: boolean;
  accent: string;
}) {
  return (
    <span
      className={cn(
        'absolute top-1.5 bottom-1.5 right-0 w-[2px] rounded-full transition-opacity duration-200',
        active ? 'opacity-100' : 'opacity-0',
      )}
      style={{ backgroundColor: accent }}
    />
  );
}

function getSidebarDepthClassName(depth: number) {
  if (depth <= 0) return '';
  if (depth === 1) return 'pl-5';
  if (depth === 2) return 'pl-8';
  if (depth === 3) return 'pl-11';
  return 'pl-13';
}

function SidebarDocsHeader({
  activeInstance,
}: {
  activeInstance: DocsInstance;
}) {
  const headerTitle = 'Docs';
  const HeaderIcon = activeInstance.sidebarHeader?.icon ?? activeInstance.icon;
  const instanceBadgeScheme = getInstanceBadgeScheme(activeInstance);

  return (
    <PageHeader
      icon={HeaderIcon}
      title={headerTitle}
      colorScheme={{
        accent: PROJECT_COLOR_SCHEMES[activeInstance.id].accentColor,
        spotlight: {
          light: withAlpha(
            PROJECT_COLOR_SCHEMES[activeInstance.id].accentColor.light,
            0.18,
          ),
          dark: withAlpha(
            PROJECT_COLOR_SCHEMES[activeInstance.id].accentColor.dark,
            0.23,
          ),
        },
      }}
      badges={[
        {
          text: activeInstance.label,
          icon: activeInstance.icon,
          colorScheme: instanceBadgeScheme,
        },
      ]}
      size="sidebar"
      className="mb-4 w-full"
    />
  );
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
  activeInstance: DocsInstance;
  activeVersion: NonNullable<ReturnType<typeof getActiveVersionFromPathname>>;
  pathname: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  versionDocSlugs?: Record<string, string[]>;
  isDark: boolean;
}) {
  const currentDocSlug = getDocSlugFromPathname(activeInstance, pathname);
  if (!activeInstance.versioned || !activeInstance.versions?.length)
    return null;

  const accent = getInstanceAccent(activeInstance, isDark);

  return (
    <div>
      <DropdownTrigger
        open={open}
        accent={accent}
        onToggle={() => setOpen(!open)}
      >
        <VersionIcon
          instance={activeInstance}
          version={activeVersion}
          accent={accent}
          isDark={isDark}
          active
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-sm font-medium">
              {activeVersion.label}
            </span>
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
            const targetDocSlugs = versionDocSlugs?.[version.value] ?? [];
            const targetHref =
              currentDocSlug && targetDocSlugs.includes(currentDocSlug)
                ? buildVersionedDocHref(activeInstance, version.value, pathname)
                : buildDocsHubHref(activeInstance);

            return (
              <VersionDropdownRow
                key={version.value}
                instance={activeInstance}
                version={version}
                isActive={version.value === activeVersion.value}
                href={targetHref}
                isDark={isDark}
              />
            );
          })}
        </div>
      </DropdownPanel>
    </div>
  );
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
  entry: DocsSidebarEntry;
  pathname: string;
  openKeys: Set<string>;
  setOpenKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  accent: string;
  depth?: number;
  activeIndicatorKey: string | null;
}) {
  if (entry.kind === 'page') {
    const showIndicator = activeIndicatorKey === entry.key;
    const hoverBackground = withAlpha(accent, 0.1);
    const activeStyle = showIndicator
      ? {
          backgroundColor: hoverBackground,
          color: accent,
        }
      : undefined;

    return (
      <li className="relative">
        <SidebarActiveIndicator active={showIndicator} accent={accent} />
        <div
          className={cn(
            'relative flex w-full items-center rounded-md transition-colors',
            showIndicator
              ? 'text-foreground'
              : 'text-muted-foreground hover:bg-[var(--docs-sidebar-hover-bg)] hover:text-[var(--docs-sidebar-hover-fg)]',
          )}
          style={{
            ...(activeStyle ?? {}),
            ['--docs-sidebar-hover-bg' as string]: hoverBackground,
            ['--docs-sidebar-hover-fg' as string]: accent,
          }}
        >
          <NextLink
            href={entry.href}
            className={cn(
              'min-w-0 flex-1 px-2.5 py-1.5 pr-3 text-sm',
              getSidebarDepthClassName(depth),
            )}
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
    );
  }

  const isOpen = openKeys.has(entry.key);
  const showIndicator = activeIndicatorKey === entry.key;

  const toggle = () => {
    setOpenKeys((prev) => {
      if (prev.has(entry.key)) {
        return removeCategoryBranch(entry, prev);
      }

      const next = new Set(prev);
      next.add(entry.key);
      return next;
    });
  };

  const onMainClick = () => {
    setOpenKeys((prev) => {
      if (!entry.href) {
        if (prev.has(entry.key)) {
          return removeCategoryBranch(entry, prev);
        }

        const next = new Set(prev);
        next.add(entry.key);
        return next;
      }

      if (prev.has(entry.key)) {
        return prev;
      }

      const next = new Set(prev);
      next.add(entry.key);
      return next;
    });
  };

  const rowClassName = cn(
    'group relative flex w-full items-center rounded-md transition-colors',
    showIndicator
      ? 'text-foreground'
      : 'text-muted-foreground hover:bg-[var(--docs-sidebar-hover-bg)] hover:text-[var(--docs-sidebar-hover-fg)]',
  );

  const labelClassName = cn(
    'min-w-0 flex-1 px-2.5 py-1.5 pr-3 text-left text-sm',
    getSidebarDepthClassName(depth),
    showIndicator ? 'font-medium' : '',
  );

  const hoverBackground = withAlpha(accent, 0.1);
  const activeStyle = showIndicator
    ? {
        backgroundColor: hoverBackground,
        color: accent,
      }
    : undefined;

  return (
    <li>
      <div
        className={rowClassName}
        style={{
          ...(activeStyle ?? {}),
          ['--docs-sidebar-hover-bg' as string]: hoverBackground,
          ['--docs-sidebar-hover-fg' as string]: accent,
        }}
      >
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
          aria-label={
            isOpen ? `Collapse ${entry.title}` : `Expand ${entry.title}`
          }
          onClick={toggle}
          className="mr-1 flex size-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown
            className={cn(
              'size-3.5 transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
            style={showIndicator ? { color: accent } : undefined}
          />
        </button>
      </div>

      <div
        className={cn(
          'grid transition-all duration-200 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
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
  );
}

function SidebarPanelContent({
  tree,
  versionDocSlugs,
  scrollRef,
  onCollapse,
}: {
  tree?: DocsSidebarTree;
  versionDocSlugs?: Record<string, string[]>;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onCollapse?: () => void;
}) {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== 'light' : false;

  const activeInstance = React.useMemo(
    () => getActiveInstanceFromPathname(pathname),
    [pathname],
  );
  const activeVersion = React.useMemo(
    () => getActiveVersionFromPathname(activeInstance, pathname),
    [activeInstance, pathname],
  );

  const [isVersionDropdownOpen, setIsVersionDropdownOpen] =
    React.useState(false);
  const [openKeys, setOpenKeys] = React.useState<Set<string>>(() =>
    collectActiveCategoryKeys(tree?.entries ?? [], pathname),
  );

  const versionSwitcherRef = React.useRef<HTMLDivElement | null>(null);
  useOnClickOutside(versionSwitcherRef, () => setIsVersionDropdownOpen(false));

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsVersionDropdownOpen(false);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  React.useEffect(() => {
    setIsVersionDropdownOpen(false);
  }, [pathname]);

  React.useLayoutEffect(() => {
    setOpenKeys(collectActiveCategoryKeys(tree?.entries ?? [], pathname));
  }, [tree?.entries, pathname]);

  const activeIndicatorKey = React.useMemo(() => {
    const entry = findActiveEntry(tree?.entries ?? [], pathname, openKeys);
    return entry?.key ?? null;
  }, [tree?.entries, pathname, openKeys]);

  const accent = getInstanceAccent(activeInstance, isDark);

  return (
    <>
      <div className="shrink-0 border-b border-border/60 px-[clamp(0.65rem,1.4vw,1rem)] pt-[clamp(0.65rem,1.4vw,1rem)] pb-[clamp(0.42rem,0.88vw,0.6rem)]">
        <div className={cn('space-y-3', !mounted && 'invisible')}>
          <div className="relative flex items-start justify-center">
            <SidebarDocsHeader activeInstance={activeInstance} />
            {onCollapse && (
              <button
                type="button"
                onClick={onCollapse}
                aria-label="Collapse docs sidebar"
                className="pointer-events-auto absolute right-0 top-0 z-20 mt-0.5 shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent/45 hover:text-primary"
              >
                <PanelLeftCloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          {activeInstance.versioned && activeVersion ? (
            <div ref={versionSwitcherRef}>
              <VersionSwitcher
                activeInstance={activeInstance}
                activeVersion={activeVersion}
                pathname={pathname}
                open={isVersionDropdownOpen}
                setOpen={setIsVersionDropdownOpen}
                versionDocSlugs={versionDocSlugs}
                isDark={isDark}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overflow-x-clip px-[clamp(0.65rem,1.4vw,1rem)] py-2.5"
        onWheelCapture={(e) => e.stopPropagation()}
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
                accent={accent}
              />
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

const EDGE_GAP_PX = 24;

export function AppDocsSidebar({
  tree,
  versionDocSlugs,
  open,
  onToggle,
  mobileOpen,
  onMobileOpenChange,
  isMobileResolved,
  containerRef,
}: AppDocsSidebarProps) {
  const panelRef = React.useRef<HTMLElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showScrollThumb, setShowScrollThumb] = React.useState(false);
  const [thumbHeight, setThumbHeight] = React.useState(0);
  const [thumbTop, setThumbTop] = React.useState(0);
  const [sidebarTop, setSidebarTop] = React.useState(88);
  const [sidebarLeft, setSidebarLeft] = React.useState(0);
  const [sidebarMaxHeight, setSidebarMaxHeight] = React.useState(500);

  const updateLayout = React.useCallback(() => {
    const navbarOffset =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--app-navbar-offset',
        ),
      ) || 88;
    const idealTop = navbarOffset;

    const containerLeft = containerRef?.current
      ? containerRef.current.getBoundingClientRect().left
      : 0;
    setSidebarLeft(containerLeft + EDGE_GAP_PX);

    if (!open) {
      setSidebarTop(idealTop);
      setSidebarMaxHeight(window.innerHeight - idealTop - EDGE_GAP_PX);
      return;
    }

    const footer = document.getElementById('site-footer');
    const panelEl = panelRef.current;
    const panelH = panelEl?.getBoundingClientRect().height ?? 0;

    if (footer) {
      const footerTop = footer.getBoundingClientRect().top;
      const nextTop = Math.min(idealTop, footerTop - panelH - EDGE_GAP_PX);
      setSidebarTop(nextTop);
      setSidebarMaxHeight(window.innerHeight - nextTop - EDGE_GAP_PX);
    } else {
      setSidebarTop(idealTop);
      setSidebarMaxHeight(window.innerHeight - idealTop - EDGE_GAP_PX);
    }
  }, [containerRef, open]);

  React.useLayoutEffect(() => {
    updateLayout();
  }, [updateLayout]);

  React.useEffect(() => {
    if (open) {
      window.addEventListener('scroll', updateLayout, { passive: true });
    }
    window.addEventListener('resize', updateLayout, { passive: true });
    const ro = new ResizeObserver(updateLayout);
    if (containerRef?.current) ro.observe(containerRef.current);
    if (panelRef.current) ro.observe(panelRef.current);
    return () => {
      window.removeEventListener('scroll', updateLayout);
      window.removeEventListener('resize', updateLayout);
      ro.disconnect();
    };
  }, [updateLayout, containerRef, open]);

  React.useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl || !open) {
      setShowScrollThumb(false);
      return;
    }

    const updateThumb = () => {
      const { clientHeight, scrollHeight, scrollTop } = scrollEl;
      const overflow = scrollHeight - clientHeight;
      if (overflow <= 1) {
        setShowScrollThumb(false);
        setThumbHeight(0);
        setThumbTop(0);
        return;
      }
      const nextH = Math.max(24, (clientHeight * clientHeight) / scrollHeight);
      const maxTop = clientHeight - nextH;
      setShowScrollThumb(true);
      setThumbHeight(nextH);
      setThumbTop((scrollTop / overflow) * maxTop);
    };

    updateThumb();
    scrollEl.addEventListener('scroll', updateThumb, { passive: true });
    window.addEventListener('resize', updateThumb);

    const ro = new ResizeObserver(updateThumb);
    ro.observe(scrollEl);
    const contentEl = scrollEl.firstElementChild as HTMLElement | null;
    if (contentEl) ro.observe(contentEl);

    return () => {
      scrollEl.removeEventListener('scroll', updateThumb);
      window.removeEventListener('resize', updateThumb);
      ro.disconnect();
    };
  }, [open]);

  if (isMobileResolved) {
    return (
      <Sheet isOpen={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent
          side="left"
          closeButton={false}
          className="w-[15.5rem] bg-background/95 p-0 backdrop-blur-md"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Docs navigation</SheetTitle>
            <SheetDescription>Browse the documentation.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full flex-col overflow-hidden">
            <SidebarPanelContent
              tree={tree}
              versionDocSlugs={versionDocSlugs}
              scrollRef={scrollRef}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    left: sidebarLeft,
    top: sidebarTop,
    width: `${SIDEBAR_WIDTH_REM}rem`,
    maxHeight: sidebarMaxHeight,
  };

  const toggleStyle: React.CSSProperties = {
    position: 'fixed',
    left: sidebarLeft,
    top: sidebarTop,
    width: '2.5rem',
  };

  return (
    <>
      <aside
        ref={panelRef}
        aria-label="Docs navigation"
        className={cn(
          'z-40 flex flex-col overflow-hidden',
          'rounded-2xl border border-border/70 bg-background/90 backdrop-blur-md shadow-sm',
          'transition-[opacity,transform] duration-200 ease-out',
          open
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 -translate-x-3 pointer-events-none',
        )}
        style={panelStyle}
      >
        <div className="group/sidebar relative flex min-h-0 flex-1 flex-col">
          <SidebarPanelContent
            tree={tree}
            versionDocSlugs={versionDocSlugs}
            scrollRef={scrollRef}
            onCollapse={onToggle}
          />

          {showScrollThumb && (
            <div className="pointer-events-none absolute bottom-3 right-1 top-3 w-1 opacity-0 transition-opacity duration-150 group-hover/sidebar:opacity-100">
              <div
                className="absolute left-0 w-full rounded-full bg-[color-mix(in_srgb,var(--foreground)_28%,transparent)]"
                style={{
                  height: thumbHeight,
                  transform: `translateY(${thumbTop}px)`,
                }}
              />
            </div>
          )}
        </div>
      </aside>

      <div
        className={cn(
          'z-40 flex flex-col items-stretch overflow-hidden',
          'rounded-xl border border-border/70 bg-background/90 backdrop-blur-md shadow-sm',
          'text-muted-foreground transition-all duration-200 ease-out',
          open
            ? 'opacity-0 pointer-events-none scale-90'
            : 'opacity-100 scale-100 pointer-events-auto',
        )}
        style={toggleStyle}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-label="Expand docs sidebar"
          className="flex h-10 w-full items-center justify-center transition-colors hover:bg-accent/45 hover:text-primary"
        >
          <PanelLeftCloseIcon className="h-4 w-4 rotate-180" />
        </button>
      </div>
    </>
  );
}

const SIDEBAR_TOTAL_OFFSET_REM = SIDEBAR_WIDTH_REM + 1.5;
const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function DocsSidebarShell({
  children,
  tree,
  versionDocSlugs,
}: {
  children: React.ReactNode;
  tree?: DocsSidebarTree;
  versionDocSlugs?: Record<string, string[]>;
}) {
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobileResolved = useIsMobile();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    try {
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    } catch {}
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <AppDocsSidebar
        tree={tree}
        versionDocSlugs={versionDocSlugs}
        open={open}
        onToggle={toggle}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        isMobileResolved={isMobileResolved}
        containerRef={containerRef}
      />
      <div
        className="min-w-0 w-full transition-[padding-left] duration-200 ease-out"
        style={{
          paddingLeft:
            !isMobileResolved && open
              ? `${SIDEBAR_TOTAL_OFFSET_REM}rem`
              : undefined,
        }}
      >
        {isMobileResolved && (
          <div className="sticky top-[var(--app-navbar-offset,5.5rem)] z-20 px-5 pt-4 pb-0 md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/90 px-3 py-2 text-sm font-semibold text-muted-foreground shadow-sm backdrop-blur-md hover:bg-accent/45 hover:text-primary"
            >
              <PanelLeftCloseIcon className="size-4 rotate-180" />
              Docs menu
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
