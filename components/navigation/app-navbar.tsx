"use client"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useMemo, useState, type CSSProperties } from "react"
import { useTheme } from "next-themes"
import { ThemeMenu } from "@/components/navigation/theme-menu"
import { NavigationDropdownMenu } from "@/components/navigation/icon-dropdown-menu"
import { AppIcon } from "@/components/common/app-icon"
import { Avatar } from "@/components/ui/avatar"
import { Link } from "@/components/ui/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Navbar,
  NavbarGap,
  NavbarItem,
  NavbarMobile,
  type NavbarProps,
  NavbarProvider,
  NavbarSection,
  NavbarSpacer,
  NavbarStart,
  NavbarTrigger,
} from "@/components/ui/navbar"
import type { NavbarItem as NavbarConfigItem } from "@/config/navigation/navbar"
import { NAVBAR_ITEMS } from "@/config/navigation/navbar"
import { getNavbarThemeColors } from "@/lib/navbar-colors"
import { isExternalHref } from "@/lib/url"
import { cn } from "@/lib/utils"

const socialLinkClassName =
  "group rounded-lg p-2 text-muted-fg no-underline transform-gpu transition-transform duration-180 ease-out hover:scale-[1.04] active:scale-[0.97]"

export default function AppNavbar(props: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)
  const [hoveredNavbarItemId, setHoveredNavbarItemId] = useState<string | null>(null)
  const [hoveredLeftDropdownItemId, setHoveredLeftDropdownItemId] = useState<string | null>(null)
  const isDark = resolvedTheme === "dark"

  const leftItems = useMemo(() => NAVBAR_ITEMS.filter((item) => item.position === "left"), [])

  const rightItems = useMemo(() => NAVBAR_ITEMS.filter((item) => item.position === "right"), [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const isCurrentNavbarItem = (item: NavbarConfigItem) => {
    if (item.href) return isActive(item.href)

    const inferredRoot = `/${item.id}`
    return pathname === inferredRoot || pathname.startsWith(`${inferredRoot}/`)
  }

  const toHoverStyle = (colors?: { text: string; background: string }): CSSProperties | undefined => {
    if (!colors) return undefined

    return {
      "--navbar-hover-text": colors.text,
      "--navbar-hover-bg": colors.background,
    } as CSSProperties
  }

  const renderLeftItem = (item: NavbarConfigItem) => {
    const itemHoverColors = getNavbarThemeColors(item, isDark)
    const isTopItemHovered = hoveredNavbarItemId === item.id
    const isCurrentItem = isCurrentNavbarItem(item)

    if (item.dropdown?.length) {
      const style = item.specialStyle
      const styleVars = item.styleVars

      return (
        <div
          key={item.id}
          className="relative"
          style={styleVars as CSSProperties | undefined}
        >
          <NavigationMenu
            viewport={false}
            value={activeDropdownId === item.id ? item.id : ""}
            onValueChange={(nextValue) => {
              setActiveDropdownId(nextValue ? item.id : null)
            }}
            className="relative z-20 max-w-none flex-none"
          >
            <NavigationMenuList>
              <NavigationMenuItem value={item.id}>
                <NavigationMenuTrigger
                  className={cn(
                    style?.triggerClassName,
                    itemHoverColors &&
                      "hover:!text-[var(--navbar-hover-text)] hover:!bg-[var(--navbar-hover-bg)] data-[state=open]:!text-[var(--navbar-hover-text)] data-[state=open]:!bg-[var(--navbar-hover-bg)]",
                  )}
                  style={isTopItemHovered && itemHoverColors ? { ...toHoverStyle(itemHoverColors), color: itemHoverColors.text } : toHoverStyle(itemHoverColors)}
                  onPointerEnter={() => setHoveredNavbarItemId(item.id)}
                  onPointerLeave={() => setHoveredNavbarItemId((current) => (current === item.id ? null : current))}
                  onClick={() => {
                    if (item.href) {
                      router.push(item.href)
                    }
                  }}
                >
                  <AppIcon
                    icon={item.icon}
                    className="size-4 shrink-0"
                    style={isTopItemHovered && itemHoverColors ? { color: itemHoverColors.text, stroke: itemHoverColors.text } : undefined}
                  />
                  {item.title ? (
                    <span
                      className="font-semibold tracking-wide"
                      style={isTopItemHovered && itemHoverColors ? { color: itemHoverColors.text } : undefined}
                    >
                      {item.title}
                    </span>
                  ) : null}
                </NavigationMenuTrigger>

                <NavigationMenuContent className={cn("min-w-56 !bg-background ring-1 ring-border rounded-xl shadow-lg", style?.dropdownContentClassName)}>
                  <ul className="grid gap-y-1 p-1">
                    {item.dropdown.map((dropdownItem) => {
                      const dropdownHoverColors = getNavbarThemeColors(dropdownItem, isDark)
                      const dropdownHoverKey = `${item.id}:${dropdownItem.id}`
                      const isDropdownItemHovered = hoveredLeftDropdownItemId === dropdownHoverKey

                      return (
                        <li key={dropdownItem.id}>
                          <NavigationMenuLink
                            href={dropdownItem.href ?? "#"}
                            target={isExternalHref(dropdownItem.href) ? "_blank" : undefined}
                            rel={isExternalHref(dropdownItem.href) ? "noreferrer" : undefined}
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-fg transition-all duration-200 ease-[cubic-bezier(.22,.9,.35,1)] hover:bg-secondary/60 hover:text-primary",
                              dropdownHoverColors &&
                                "hover:!text-[var(--navbar-hover-text)] hover:!bg-[var(--navbar-hover-bg)] data-[active]:!text-[var(--navbar-hover-text)] data-[active]:!bg-[var(--navbar-hover-bg)]",
                              style?.dropdownItemClassName,
                            )}
                            style={
                              isDropdownItemHovered && dropdownHoverColors
                                ? {
                                    ...toHoverStyle(dropdownHoverColors),
                                    color: dropdownHoverColors.text,
                                    backgroundColor: dropdownHoverColors.background,
                                  }
                                : toHoverStyle(dropdownHoverColors)
                            }
                            onPointerEnter={() => setHoveredLeftDropdownItemId(dropdownHoverKey)}
                            onPointerLeave={() =>
                              setHoveredLeftDropdownItemId((current) => (current === dropdownHoverKey ? null : current))
                            }
                            onMouseEnter={() => setHoveredLeftDropdownItemId(dropdownHoverKey)}
                            onMouseLeave={() =>
                              setHoveredLeftDropdownItemId((current) => (current === dropdownHoverKey ? null : current))
                            }
                          >
                            <AppIcon
                              icon={dropdownItem.icon}
                              className="size-4 shrink-0"
                              style={
                                isDropdownItemHovered && dropdownHoverColors
                                  ? { color: dropdownHoverColors.text, stroke: dropdownHoverColors.text }
                                  : undefined
                              }
                            />
                            <span style={isDropdownItemHovered && dropdownHoverColors ? { color: dropdownHoverColors.text } : undefined}>
                              {dropdownItem.title}
                            </span>
                          </NavigationMenuLink>
                        </li>
                      )
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {isCurrentItem && <span className={style?.activeUnderlineClassName} />}
        </div>
      )
    }

    return (
      <NavbarItem
        key={item.id}
        isCurrent={isCurrentItem}
        href={item.href ?? "#"}
        className={cn(
          itemHoverColors &&
            "hover:!text-[var(--navbar-hover-text)] hover:!bg-[var(--navbar-hover-bg)] hover:*:data-[slot=icon]:!text-[var(--navbar-hover-text)] active:!text-[var(--navbar-hover-text)] active:!bg-[var(--navbar-hover-bg)] active:*:data-[slot=icon]:!text-[var(--navbar-hover-text)]",
        )}
        style={hoveredNavbarItemId === item.id && itemHoverColors ? { ...toHoverStyle(itemHoverColors), color: itemHoverColors.text, backgroundColor: itemHoverColors.background } : toHoverStyle(itemHoverColors)}
        onPointerEnter={() => setHoveredNavbarItemId(item.id)}
        onPointerLeave={() => setHoveredNavbarItemId((current) => (current === item.id ? null : current))}
        onMouseEnter={() => setHoveredNavbarItemId(item.id)}
        onMouseLeave={() => setHoveredNavbarItemId((current) => (current === item.id ? null : current))}
      >
        <AppIcon
          icon={item.icon}
          style={
            hoveredNavbarItemId === item.id && itemHoverColors
              ? { color: itemHoverColors.text, stroke: itemHoverColors.text }
              : undefined
          }
        />
        <span style={hoveredNavbarItemId === item.id && itemHoverColors ? { color: itemHoverColors.text } : undefined}>{item.title}</span>
      </NavbarItem>
    )
  }

  const renderRightItem = (item: NavbarConfigItem) => {
    const itemHoverColors = getNavbarThemeColors(item, isDark)
    const isItemHovered = hoveredNavbarItemId === item.id

    const handleRightItemOpenChange = (nextOpen: boolean) => {
      if (nextOpen) {
        setActiveDropdownId(item.id)
        return
      }

      setActiveDropdownId((current) => (current === item.id ? null : current))
    }

    if (item.id === "theme") {
      return (
        <ThemeMenu
          key={item.id}
          className={cn(socialLinkClassName, "hover:bg-secondary/60 hover:text-primary")}
          items={item.dropdown}
          open={activeDropdownId === item.id}
          onOpenChange={handleRightItemOpenChange}
        />
      )
    }

    if (item.dropdown?.length) {
      return (
        <NavigationDropdownMenu
          key={item.id}
          item={item}
          className={socialLinkClassName}
          open={activeDropdownId === item.id}
          onOpenChange={handleRightItemOpenChange}
        />
      )
    }

    return (
      <Link
        key={item.id}
        href={item.href ?? "#"}
        aria-label={item.title ?? item.id}
        target={isExternalHref(item.href) ? "_blank" : undefined}
        rel={isExternalHref(item.href) ? "noreferrer" : undefined}
        className={cn(
          socialLinkClassName,
          !itemHoverColors && "hover:bg-secondary/60 hover:text-primary",
          itemHoverColors && "hover:!text-[var(--navbar-hover-text)] hover:!bg-[var(--navbar-hover-bg)]",
        )}
        style={
          isItemHovered && itemHoverColors
            ? {
                ...toHoverStyle(itemHoverColors),
                color: itemHoverColors.text,
                backgroundColor: itemHoverColors.background,
              }
            : toHoverStyle(itemHoverColors)
        }
        onPointerEnter={() => setHoveredNavbarItemId(item.id)}
        onPointerLeave={() => setHoveredNavbarItemId((current) => (current === item.id ? null : current))}
        onMouseEnter={() => setHoveredNavbarItemId(item.id)}
        onMouseLeave={() => setHoveredNavbarItemId((current) => (current === item.id ? null : current))}
      >
        <AppIcon
          icon={item.icon}
          style={isItemHovered && itemHoverColors ? { color: itemHoverColors.text, stroke: itemHoverColors.text } : undefined}
        />
      </Link>
    )
  }

  return (
    <NavbarProvider>
      <Navbar isSticky {...props}>
        <NavbarStart>
          <Link
            href="/"
            aria-label="Home"
            className="group flex items-center gap-x-2 font-medium no-underline transition-colors duration-150 ease-out"
          >
            <Avatar isSquare size="sm" className="outline-hidden" src="/logo.png" />
            <span className="font-bold text-muted-fg transition-colors duration-150 ease-out group-hover:text-primary">
              Subway Builder Modded
            </span>
          </Link>
        </NavbarStart>

        <NavbarGap />

        <NavbarSection className="gap-1.5">{leftItems.map(renderLeftItem)}</NavbarSection>

        <NavbarSpacer />

        <NavbarSection className="max-md:hidden gap-1.5">{rightItems.map(renderRightItem)}</NavbarSection>
      </Navbar>

      <NavbarMobile>
        <NavbarTrigger />
        <NavbarSpacer />
        {rightItems.map((item) => {
          const itemHoverColors = getNavbarThemeColors(item, isDark)
          const isItemHovered = hoveredNavbarItemId === item.id

          if (item.id === "theme") {
            return (
              <ThemeMenu
                key={item.id}
                className={cn(socialLinkClassName, "hover:bg-secondary/60 hover:text-primary")}
                items={item.dropdown}
              />
            )
          }

          if (item.dropdown?.length) {
            return (
              <NavigationDropdownMenu
                key={item.id}
                item={item}
                className={socialLinkClassName}
              />
            )
          }

          return (
            <Link
              key={item.id}
              href={item.href ?? "#"}
              aria-label={item.title ?? item.id}
              target={isExternalHref(item.href) ? "_blank" : undefined}
              rel={isExternalHref(item.href) ? "noreferrer" : undefined}
              className={cn(
                socialLinkClassName,
                !itemHoverColors && "hover:bg-secondary/60 hover:text-primary",
                itemHoverColors && "hover:!text-[var(--navbar-hover-text)] hover:!bg-[var(--navbar-hover-bg)]",
              )}
              style={
                isItemHovered && itemHoverColors
                  ? {
                      ...toHoverStyle(itemHoverColors),
                      color: itemHoverColors.text,
                      backgroundColor: itemHoverColors.background,
                    }
                  : toHoverStyle(itemHoverColors)
              }
              onPointerEnter={() => setHoveredNavbarItemId(item.id)}
              onPointerLeave={() => setHoveredNavbarItemId((current) => (current === item.id ? null : current))}
              onMouseEnter={() => setHoveredNavbarItemId(item.id)}
              onMouseLeave={() => setHoveredNavbarItemId((current) => (current === item.id ? null : current))}
            >
              <AppIcon
                icon={item.icon}
                style={isItemHovered && itemHoverColors ? { color: itemHoverColors.text, stroke: itemHoverColors.text } : undefined}
              />
            </Link>
          )
        })}
      </NavbarMobile>
    </NavbarProvider>
  )
}
