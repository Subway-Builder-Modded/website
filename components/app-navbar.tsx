"use client"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import { ThemeToggleMenu } from "@/components/theme-toggle-menu"
import { NavbarHoverDropdown } from "@/components/navbar-hover-dropdown"
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
import type { NavbarIcon, NavbarItem } from "@/lib/navbar-config"
import { NAVBAR_ITEMS, NAVBAR_SPECIAL_STYLES } from "@/lib/navbar-config"
import { cn } from "@/lib/utils"

const socialLinkClassName =
  "group rounded-lg p-2 text-muted-fg no-underline transform-gpu transition-transform duration-180 ease-out hover:scale-[1.04] active:scale-[0.97]"

function NavbarItemIcon({ icon, className }: { icon?: NavbarIcon; className?: string }) {
  if (!icon) return null

  if (typeof icon === "object" && "type" in icon && icon.type === "mask") {
    return (
      <span
        className={cn("block size-5 bg-current", className)}
        style={{
          WebkitMask: `url(${icon.src}) center / contain no-repeat`,
          mask: `url(${icon.src}) center / contain no-repeat`,
        }}
      />
    )
  }

  const Icon = icon
  return <Icon className={cn("size-5 md:size-4", className)} />
}

export default function AppNavbar(props: NavbarProps) {
  const pathname = usePathname()
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)

  const leftItems = useMemo(
    () => NAVBAR_ITEMS.filter((item) => item.position === "left"),
    [],
  )

  const rightItems = useMemo(
    () => NAVBAR_ITEMS.filter((item) => item.position === "right"),
    [],
  )

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const isExternalHref = (href?: string) => Boolean(href?.startsWith("http://") || href?.startsWith("https://"))

  const renderLeftItem = (item: NavbarItem) => {
    if (item.dropdown?.length) {
      const style = NAVBAR_SPECIAL_STYLES[item.id]

      return (
        <div key={item.id} className="relative">
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
                <NavigationMenuTrigger className={style?.triggerClassName}>
                  <NavbarItemIcon icon={item.icon} className="text-primary" />
                  {item.title ? <span className="font-semibold tracking-wide">{item.title}</span> : null}
                </NavigationMenuTrigger>

                <NavigationMenuContent className={cn("min-w-56 !bg-background ring-1 ring-border rounded-xl shadow-lg", style?.dropdownContentClassName)}>
                  <ul className="grid gap-y-1 p-1">
                    {item.dropdown.map((dropdownItem) => (
                      <li key={dropdownItem.id}>
                        <NavigationMenuLink
                          href={dropdownItem.href ?? "#"}
                          target={isExternalHref(dropdownItem.href) ? "_blank" : undefined}
                          rel={isExternalHref(dropdownItem.href) ? "noreferrer" : undefined}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-fg transition-all duration-200 ease-[cubic-bezier(.22,.9,.35,1)] hover:bg-secondary/60 hover:text-primary",
                            style?.dropdownItemClassName,
                          )}
                        >
                          <NavbarItemIcon icon={dropdownItem.icon} className="size-4 shrink-0" />
                          <span>{dropdownItem.title}</span>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {item.href && isActive(item.href) && (
            <span className={style?.activeUnderlineClassName} />
          )}
        </div>
      )
    }

    return (
      <NavbarItem key={item.id} isCurrent={item.href ? isActive(item.href) : false} href={item.href ?? "#"}>
        <NavbarItemIcon icon={item.icon} />
        {item.title}
      </NavbarItem>
    )
  }

  const renderRightItem = (item: NavbarItem) => {
    const handleRightItemOpenChange = (nextOpen: boolean) => {
      if (nextOpen) {
        setActiveDropdownId(item.id)
        return
      }

      setActiveDropdownId((current) => (current === item.id ? null : current))
    }

    if (item.id === "theme") {
      return (
        <ThemeToggleMenu
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
        <NavbarHoverDropdown
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
        className={cn(socialLinkClassName, "hover:bg-secondary/60 hover:text-primary")}
      >
        <NavbarItemIcon icon={item.icon} />
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

        <NavbarSection className="gap-1.5">
          {leftItems.map(renderLeftItem)}
        </NavbarSection>

        <NavbarSpacer />

        <NavbarSection className="max-md:hidden gap-1.5">
          {rightItems.map(renderRightItem)}
        </NavbarSection>
      </Navbar>

      <NavbarMobile>
        <NavbarTrigger />
        <NavbarSpacer />
        {rightItems.map((item) => {
          if (item.id === "theme") {
            return (
              <ThemeToggleMenu
                key={item.id}
                className={cn(socialLinkClassName, "hover:bg-secondary/60 hover:text-primary")}
                items={item.dropdown}
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
              className={cn(socialLinkClassName, "hover:bg-secondary/60 hover:text-primary")}
            >
              <NavbarItemIcon icon={item.icon} />
            </Link>
          )
        })}
      </NavbarMobile>
    </NavbarProvider>
  )
}
