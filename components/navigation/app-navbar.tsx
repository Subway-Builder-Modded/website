'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEventHandler,
  type PointerEventHandler,
  type ReactElement,
} from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { AppIcon } from '@/components/common/app-icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Navbar,
  NavbarGap,
  NavbarMobile,
  type NavbarProps,
  NavbarProvider,
  NavbarSection,
  NavbarSpacer,
  NavbarStart,
  NavbarTrigger,
  useNavbar,
} from '@/components/ui/navbar';
import type {
  AppNavbarDropdownItem,
  AppNavbarItem,
  NavbarColorScheme,
  NavbarColorSchemeId,
  NavbarThemeId,
} from '@/config/navigation/navbar';
import {
  APP_NAVBAR_COLOR_SCHEMES,
  APP_NAVBAR_CONFIG,
} from '@/config/navigation/navbar';
import { isExternalHref } from '@/lib/url';
import { cn } from '@/lib/utils';
import styles from './app-navbar.module.css';

const itemSchemeVariableClassName =
  '[--nav-hover-fg:var(--nav-hover-fg-light)] [--nav-hover-bg:var(--nav-hover-bg-light)] dark:[--nav-hover-fg:var(--nav-hover-fg-dark)] dark:[--nav-hover-bg:var(--nav-hover-bg-dark)] [--nav-active-fg:var(--nav-active-fg-light)] [--nav-active-bg:var(--nav-active-bg-light)] dark:[--nav-active-fg:var(--nav-active-fg-dark)] dark:[--nav-active-bg:var(--nav-active-bg-dark)] [--nav-indicator:var(--nav-indicator-light)] dark:[--nav-indicator:var(--nav-indicator-dark)]';

const NAVBAR_DEFAULT_COLOR_SCHEME_ID = 'default';

function resolveScheme(schemeId?: NavbarColorSchemeId): NavbarColorScheme | null {
  if (!schemeId) return null;
  return APP_NAVBAR_COLOR_SCHEMES[schemeId] ?? null;
}

function toSchemeStyle(scheme: NavbarColorScheme | null): CSSProperties | undefined {
  if (!scheme) return undefined;
  const hover = scheme.hover;
  const active = scheme.active ?? scheme.hover;
  const indicator = scheme.indicator;

  const style: Record<string, string> = {};

  if (hover) {
    style['--nav-hover-fg-light'] = hover.light.text;
    style['--nav-hover-bg-light'] = hover.light.background;
    style['--nav-hover-fg-dark'] = hover.dark.text;
    style['--nav-hover-bg-dark'] = hover.dark.background;
  }

  if (active) {
    style['--nav-active-fg-light'] = active.light.text;
    style['--nav-active-bg-light'] = active.light.background;
    style['--nav-active-fg-dark'] = active.dark.text;
    style['--nav-active-bg-dark'] = active.dark.background;
  }

  if (indicator) {
    style['--nav-indicator-light'] = indicator.light;
    style['--nav-indicator-dark'] = indicator.dark;
  } else if (active) {
    style['--nav-indicator-light'] = active.light.text;
    style['--nav-indicator-dark'] = active.dark.text;
  }

  return style as CSSProperties;
}

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function defaultItemHref(item: AppNavbarItem) {
  return item.href ?? (item.id ? `/${item.id}` : undefined);
}

export default function AppNavbar(props: NavbarProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const { sizes, brand } = APP_NAVBAR_CONFIG;

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => {
      const offset = Math.ceil(el.getBoundingClientRect().height + 12 + 12);
      document.documentElement.style.setProperty(
        '--app-navbar-offset',
        `${offset}px`,
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      document.documentElement.style.removeProperty('--app-navbar-offset');
    };
  }, []);

  const configStyleVars: CSSProperties = {
    '--app-navbar-brand-gap-mobile': sizes.mobile.brand.gap,
    '--app-navbar-brand-gap-desktop': sizes.desktop.brand.gap,
    '--app-navbar-brand-icon-mobile': sizes.mobile.brand.iconSize,
    '--app-navbar-brand-icon-desktop': sizes.desktop.brand.iconSize,
    '--app-navbar-brand-title-mobile': sizes.mobile.brand.titleSize,
    '--app-navbar-brand-title-desktop': sizes.desktop.brand.titleSize,
    '--app-navbar-brand-weight-mobile': String(sizes.mobile.brand.titleWeight),
    '--app-navbar-brand-weight-desktop': String(sizes.desktop.brand.titleWeight),

    '--app-navbar-item-gap-mobile': sizes.mobile.item.gap,
    '--app-navbar-item-gap-desktop': sizes.desktop.item.gap,
    '--app-navbar-item-icon-mobile': sizes.mobile.item.iconSize,
    '--app-navbar-item-icon-desktop': sizes.desktop.item.iconSize,
    '--app-navbar-item-title-mobile': sizes.mobile.item.titleSize,
    '--app-navbar-item-title-desktop': sizes.desktop.item.titleSize,
    '--app-navbar-item-radius-mobile': sizes.mobile.item.radius,
    '--app-navbar-item-radius-desktop': sizes.desktop.item.radius,
    '--app-navbar-item-px-mobile': sizes.mobile.item.paddingX,
    '--app-navbar-item-px-desktop': sizes.desktop.item.paddingX,
    '--app-navbar-item-py-mobile': sizes.mobile.item.paddingY,
    '--app-navbar-item-py-desktop': sizes.desktop.item.paddingY,

    '--app-navbar-dd-minw-mobile': sizes.mobile.dropdown.minWidth,
    '--app-navbar-dd-minw-desktop': sizes.desktop.dropdown.minWidth,
    '--app-navbar-dd-item-gap-mobile': sizes.mobile.dropdown.itemGap,
    '--app-navbar-dd-item-gap-desktop': sizes.desktop.dropdown.itemGap,
    '--app-navbar-dd-item-icon-mobile': sizes.mobile.dropdown.itemIconSize,
    '--app-navbar-dd-item-icon-desktop': sizes.desktop.dropdown.itemIconSize,
    '--app-navbar-dd-item-title-mobile': sizes.mobile.dropdown.itemTitleSize,
    '--app-navbar-dd-item-title-desktop': sizes.desktop.dropdown.itemTitleSize,
    '--app-navbar-dd-item-radius-mobile': sizes.mobile.dropdown.itemRadius,
    '--app-navbar-dd-item-radius-desktop': sizes.desktop.dropdown.itemRadius,
    '--app-navbar-dd-item-px-mobile': sizes.mobile.dropdown.itemPaddingX,
    '--app-navbar-dd-item-px-desktop': sizes.desktop.dropdown.itemPaddingX,
    '--app-navbar-dd-item-py-mobile': sizes.mobile.dropdown.itemPaddingY,
    '--app-navbar-dd-item-py-desktop': sizes.desktop.dropdown.itemPaddingY,
  } as unknown as CSSProperties;

  return (
    <NavbarProvider>
      <AppNavbarInner
        {...props}
        headerRef={headerRef}
        brand={brand}
        configStyleVars={configStyleVars}
      />
    </NavbarProvider>
  );
}

function AppNavbarInner({
  brand,
  configStyleVars,
  headerRef,
  ...props
}: NavbarProps & {
  brand: typeof APP_NAVBAR_CONFIG.brand;
  configStyleVars: CSSProperties;
  headerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const pathname = usePathname() ?? '/';
  const { setTheme } = useTheme();
  const { open, setOpen } = useNavbar();

  const items = APP_NAVBAR_CONFIG.items;
  const leftItems = useMemo(
    () => items.filter((item) => item.position === 'left'),
    [items],
  );
  const rightItems = useMemo(
    () => items.filter((item) => item.position === 'right'),
    [items],
  );

  const mobileQuickItems = useMemo(() => {
    const idSet = new Set(APP_NAVBAR_CONFIG.layout.mobileQuickItemIds);
    return rightItems.filter((item) => idSet.has(item.id));
  }, [rightItems]);

  const onNavigate = () => {
    if (open) setOpen(false);
  };

  const renderNavItem = (item: AppNavbarItem, opts?: { compact?: boolean }) => {
    const compact = opts?.compact ?? false;
    const itemScheme = resolveScheme(item.schemeId);
    const schemeStyle = toSchemeStyle(itemScheme);
    const iconScale =
      item.position === 'right' ? APP_NAVBAR_CONFIG.layout.rightItemIconScale : 1;
    const itemStyle =
      iconScale !== 1
        ? ({
            ...(schemeStyle ?? {}),
            ['--app-navbar-item-icon-scale' as string]: String(iconScale),
          } as CSSProperties)
        : schemeStyle;
    const itemLabel = item.title ?? item.id;

    const itemHref = defaultItemHref(item);
    const isItemActive =
      typeof itemHref === 'string' ? isActivePath(pathname, itemHref) : false;

    const anyDropdownActive =
      item.dropdown?.some((dd) =>
        dd.href ? isActivePath(pathname, dd.href) : false,
      ) ?? false;

    const isActive = isItemActive || anyDropdownActive;

    const showChevron = Boolean(item.dropdown?.length);
    const isAlwaysOnHover = item.presentation?.restingState === 'hover';
    const hoverExpand = Boolean(item.presentation?.hoverExpand);

    const baseClassName = cn(
      'group relative inline-flex min-w-0 items-center justify-center text-start font-semibold text-muted-fg no-underline outline-none transition-all duration-200 ease-[cubic-bezier(.22,.9,.35,1)]',
      'gap-[var(--app-navbar-item-gap)] rounded-[var(--app-navbar-item-radius)] px-[var(--app-navbar-item-px)] py-[var(--app-navbar-item-py)] text-[var(--app-navbar-item-title)]',
      'hover:bg-accent/45 hover:text-primary active:bg-accent/55',
      'focus-visible:ring-2 focus-visible:ring-ring/30',
      'data-[active=true]:bg-accent/45 data-[active=true]:text-primary',
      itemScheme && itemSchemeVariableClassName,
      itemScheme &&
        'hover:!bg-[var(--nav-active-bg)] hover:!text-[var(--nav-active-fg)] data-[state=open]:!bg-[var(--nav-active-bg)] data-[state=open]:!text-[var(--nav-active-fg)] data-[active=true]:!bg-[var(--nav-active-bg)] data-[active=true]:!text-[var(--nav-active-fg)]',
      itemScheme &&
        isAlwaysOnHover &&
        '!bg-[var(--nav-hover-bg)] !text-[var(--nav-hover-fg)]',
      hoverExpand &&
        'will-change-transform motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(.22,.9,.35,1)] hover:scale-[1.04] data-[state=open]:scale-[1.04]',
    );

    const icon = item.icon ? (
      <AppIcon
        icon={item.icon}
        className="shrink-0 text-current size-[calc(var(--app-navbar-item-icon)*var(--app-navbar-item-icon-scale,1))]"
      />
    ) : null;

    const chevron = showChevron ? (
      <ChevronDownIcon
        aria-hidden
        className={cn(
          'shrink-0 text-current opacity-70 transition-transform duration-200 ease-[cubic-bezier(.22,.9,.35,1)]',
          'size-[calc(var(--app-navbar-item-icon)*var(--app-navbar-item-icon-scale,1)*0.92)]',
          'group-data-[state=open]:rotate-180',
        )}
      />
    ) : null;

    const label =
      compact || !item.title ? null : <span className="truncate">{item.title}</span>;

    const indicator = isActive ? (
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute rounded-full',
          itemScheme ? 'bg-[var(--nav-indicator)]' : 'bg-primary',
          'inset-y-[calc(var(--app-navbar-item-py)/2)] -start-3 w-1 md:inset-x-2 md:inset-y-auto md:-bottom-[0.38rem] md:h-1 md:w-auto',
        )}
      />
    ) : null;

    if (item.dropdown?.length) {
      return (
        <NavbarDropdown
          key={item.id}
          item={item}
          pathname={pathname}
          onNavigate={onNavigate}
          setTheme={setTheme}
          configStyleVars={configStyleVars}
        >
          <button
            type="button"
            data-active={isActive ? 'true' : 'false'}
            className={baseClassName}
            style={itemStyle}
            aria-label={compact || !item.title ? itemLabel : undefined}
          >
            {icon}
            {label}
            {chevron}
            {indicator}
          </button>
        </NavbarDropdown>
      );
    }

    if (!itemHref) {
      return (
        <button
          key={item.id}
          type="button"
          data-active={isActive ? 'true' : 'false'}
          className={baseClassName}
          style={itemStyle}
          aria-label={compact || !item.title ? itemLabel : undefined}
        >
          {icon}
          {label}
          {chevron}
          {indicator}
        </button>
      );
    }

    const commonLinkProps = {
      key: item.id,
      'data-active': isActive ? 'true' : 'false',
      className: baseClassName,
      style: itemStyle,
      'aria-label': compact || !item.title ? itemLabel : undefined,
      onClick: onNavigate,
    } as const;

    if (isExternalHref(itemHref)) {
      return (
        <a
          href={itemHref}
          target="_blank"
          rel="noreferrer"
          {...commonLinkProps}
        >
          {icon}
          {label}
          {chevron}
          {indicator}
        </a>
      );
    }

    return (
      <NextLink href={itemHref} {...commonLinkProps}>
        {icon}
        {label}
        {chevron}
        {indicator}
      </NextLink>
    );
  };

  return (
    <>
      <Navbar
        isSticky
        {...props}
        ref={headerRef}
        className={cn(styles.root, 'flex-nowrap')}
        style={configStyleVars}
        data-color-scheme={NAVBAR_DEFAULT_COLOR_SCHEME_ID}
      >
        <NavbarStart>
          <NextLink
            href={brand.href}
            className={cn(
              'group flex min-w-0 items-center text-muted-fg no-underline transition-colors duration-150 ease-out',
              'gap-[var(--app-navbar-brand-gap)] rounded-[var(--app-navbar-item-radius)] px-[var(--app-navbar-item-px)] py-[var(--app-navbar-item-py)]',
              'hover:bg-accent/45 hover:text-primary',
            )}
            aria-label="Home"
            onClick={onNavigate}
          >
            <AppIcon
              icon={brand.icon}
              className="shrink-0 text-current size-[var(--app-navbar-brand-icon)]"
            />
            <span
              className="overflow-hidden text-clip whitespace-nowrap max-w-[min(54vw,36rem)] md:max-w-[min(58vw,44rem)] text-[var(--app-navbar-brand-title)]"
              style={{ fontWeight: 'var(--app-navbar-brand-weight)' }}
            >
              {brand.title}
            </span>
          </NextLink>
        </NavbarStart>

        <NavbarGap />

        <NavbarSection className="gap-1.5 md:gap-1.5">
          {leftItems.map((item) => renderNavItem(item))}
        </NavbarSection>

        <NavbarSpacer />

        <NavbarSection className="max-md:hidden gap-1.5 md:gap-1.5">
          {rightItems.map((item) => renderNavItem(item))}
        </NavbarSection>
      </Navbar>

      <NavbarMobile
        className={cn(styles.root)}
        style={configStyleVars}
        data-color-scheme={NAVBAR_DEFAULT_COLOR_SCHEME_ID}
      >
        <NavbarTrigger />
        <NextLink
          href={brand.href}
          className={cn(
            'flex min-w-0 items-center text-muted-fg no-underline',
            'gap-[var(--app-navbar-brand-gap)] rounded-[var(--app-navbar-item-radius)] px-[var(--app-navbar-item-px)] py-[var(--app-navbar-item-py)]',
            'hover:bg-accent/45 hover:text-primary',
          )}
          aria-label="Home"
          onClick={onNavigate}
        >
        <AppIcon
          icon={brand.icon}
          className="shrink-0 text-current size-[var(--app-navbar-brand-icon)]"
        />
        <span
          className="overflow-hidden text-clip whitespace-nowrap max-w-[min(54vw,36rem)] text-[var(--app-navbar-brand-title)]"
          style={{ fontWeight: 'var(--app-navbar-brand-weight)' }}
        >
          {brand.title}
        </span>
      </NextLink>
        <NavbarSpacer />
        {mobileQuickItems.map((item) => renderNavItem(item, { compact: true }))}
      </NavbarMobile>
    </>
  );
}

function NavbarDropdown({
  item,
  pathname,
  onNavigate,
  setTheme,
  configStyleVars,
  children,
}: {
  item: AppNavbarItem;
  pathname: string;
  onNavigate: () => void;
  setTheme: (theme: string) => void;
  configStyleVars: CSSProperties;
  children: ReactElement;
}) {
  const dropdownItems = item.dropdown ?? [];
  const [open, setOpen] = useState(false);
  const triggerHoveredRef = useRef(false);
  const contentHoveredRef = useRef(false);
  const hoverCloseTimeoutRef = useRef<number | null>(null);
  const closeLockTimeoutRef = useRef<number | null>(null);

  const clearHoverClose = () => {
    if (hoverCloseTimeoutRef.current) {
      window.clearTimeout(hoverCloseTimeoutRef.current);
      hoverCloseTimeoutRef.current = null;
    }
  };

  const clearCloseLock = () => {
    if (closeLockTimeoutRef.current) {
      window.clearTimeout(closeLockTimeoutRef.current);
      closeLockTimeoutRef.current = null;
    }
  };

  const beginCloseLock = () => {
    clearCloseLock();
    closeLockTimeoutRef.current = window.setTimeout(() => {
      closeLockTimeoutRef.current = null;
    }, 210);
  };

  const openMenu = () => {
    clearHoverClose();
    clearCloseLock();
    setOpen(true);
  };

  const closeMenu = () => {
    beginCloseLock();
    setOpen(false);
  };

  const scheduleHoverClose = () => {
    clearHoverClose();
    hoverCloseTimeoutRef.current = window.setTimeout(() => {
      if (!triggerHoveredRef.current && !contentHoveredRef.current) {
        closeMenu();
      }
      hoverCloseTimeoutRef.current = null;
    }, 180);
  };

  useEffect(() => {
    return () => {
      clearHoverClose();
      clearCloseLock();
    };
  }, []);

  const onThemeAction = (theme: NavbarThemeId) => {
    setTheme(theme);
    onNavigate();
  };

  const onTriggerPointerEnter: PointerEventHandler = () => {
    triggerHoveredRef.current = true;
    openMenu();
  };

  const onTriggerPointerLeave: PointerEventHandler = () => {
    triggerHoveredRef.current = false;
    scheduleHoverClose();
  };

  const onTriggerMouseEnter: MouseEventHandler = () => {
    triggerHoveredRef.current = true;
    openMenu();
  };

  const onTriggerMouseLeave: MouseEventHandler = () => {
    triggerHoveredRef.current = false;
    scheduleHoverClose();
  };

  const onContentPointerEnter: PointerEventHandler = () => {
    contentHoveredRef.current = true;
    openMenu();
  };

  const onContentPointerLeave: PointerEventHandler = () => {
    contentHoveredRef.current = false;
    scheduleHoverClose();
  };

  const renderDropdownItem = (dropdownItem: AppNavbarDropdownItem) => {
    const scheme = resolveScheme(dropdownItem.schemeId ?? item.schemeId);
    const style = toSchemeStyle(scheme);
    const href = dropdownItem.href;
    const isActive = href ? isActivePath(pathname, href) : false;
    const dropdownLabel = dropdownItem.title ?? dropdownItem.id;
    const icon = (
      <AppIcon
        icon={dropdownItem.icon}
        className="shrink-0 text-current size-[var(--app-navbar-dd-item-icon)]"
      />
    );

    const className = cn(
      'gap-[var(--app-navbar-dd-item-gap)] rounded-[var(--app-navbar-dd-item-radius)] px-[var(--app-navbar-dd-item-px)] py-[var(--app-navbar-dd-item-py)] text-[var(--app-navbar-dd-item-title)] text-muted-fg',
      scheme && itemSchemeVariableClassName,
      scheme &&
        'hover:!bg-[var(--nav-hover-bg)] hover:!text-[var(--nav-hover-fg)] hover:[&_*]:!text-[var(--nav-hover-fg)] focus:!bg-[var(--nav-hover-bg)] focus:!text-[var(--nav-hover-fg)] focus:[&_*]:!text-[var(--nav-hover-fg)] data-[highlighted]:!bg-[var(--nav-hover-bg)] data-[highlighted]:!text-[var(--nav-hover-fg)] data-[highlighted]:[&_*]:!text-[var(--nav-hover-fg)] data-[active=true]:!bg-[var(--nav-active-bg)] data-[active=true]:!text-[var(--nav-active-fg)] data-[active=true]:[&_*]:!text-[var(--nav-active-fg)]',
    );

    if (dropdownItem.action?.type === 'theme') {
      const theme = dropdownItem.action.theme;
      return (
        <DropdownMenuItem
          key={dropdownItem.id}
          onSelect={() => onThemeAction(theme)}
          data-active={isActive ? 'true' : 'false'}
          className={className}
          style={style}
          aria-label={dropdownItem.title ? undefined : dropdownLabel}
        >
          {icon}
          {dropdownItem.title ? (
            <span className="truncate">{dropdownItem.title}</span>
          ) : null}
        </DropdownMenuItem>
      );
    }

    if (!href) {
      return (
        <DropdownMenuItem
          key={dropdownItem.id}
          onSelect={onNavigate}
          data-active={isActive ? 'true' : 'false'}
          className={className}
          style={style}
          aria-label={dropdownItem.title ? undefined : dropdownLabel}
        >
          {icon}
          {dropdownItem.title ? (
            <span className="truncate">{dropdownItem.title}</span>
          ) : null}
        </DropdownMenuItem>
      );
    }

    if (isExternalHref(href)) {
      return (
        <DropdownMenuItem
          key={dropdownItem.id}
          asChild
          data-active={isActive ? 'true' : 'false'}
          className={className}
          style={style}
        >
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-2 no-underline"
            onClick={onNavigate}
            aria-label={dropdownItem.title ? undefined : dropdownLabel}
          >
            {icon}
            {dropdownItem.title ? (
              <span className="truncate">{dropdownItem.title}</span>
            ) : null}
          </a>
        </DropdownMenuItem>
      );
    }

    return (
      <DropdownMenuItem
        key={dropdownItem.id}
        asChild
        data-active={isActive ? 'true' : 'false'}
        className={className}
        style={style}
      >
        <NextLink
          href={href}
          className="flex w-full items-center gap-2 no-underline"
          onClick={onNavigate}
          aria-label={dropdownItem.title ? undefined : dropdownLabel}
        >
          {icon}
          {dropdownItem.title ? (
            <span className="truncate">{dropdownItem.title}</span>
          ) : null}
        </NextLink>
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu
      modal={false}
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          openMenu();
          return;
        }
        closeMenu();
      }}
    >
      <DropdownMenuTrigger
        asChild
        onPointerEnter={onTriggerPointerEnter}
        onPointerLeave={onTriggerPointerLeave}
        onMouseEnter={onTriggerMouseEnter}
        onMouseLeave={onTriggerMouseLeave}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={item.position === 'right' ? 'end' : 'start'}
        sideOffset={8}
        className={cn(styles.root, 'w-auto min-w-[var(--app-navbar-dd-minw)]')}
        style={configStyleVars}
        data-color-scheme={NAVBAR_DEFAULT_COLOR_SCHEME_ID}
        onPointerEnter={onContentPointerEnter}
        onPointerLeave={onContentPointerLeave}
      >
        {dropdownItems.map(renderDropdownItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
