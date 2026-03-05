"use client"

import { ChevronDownIcon, MagnifyingGlassIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"
import { usePathname } from "next/navigation"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import {
  Navbar,
  NavbarGap,
  NavbarItem,
  NavbarMobile,
  type NavbarProps,
  NavbarProvider,
  NavbarSection,
  NavbarSeparator,
  NavbarSpacer,
  NavbarStart,
  NavbarTrigger,
} from "@/components/ui/navbar"
import { Separator } from "@/components/ui/separator"
import { UserMenu } from "@/components/user-menu"

const categories = [
  { id: 1, label: "Electronics", url: "#" },
  { id: 2, label: "Fashion", url: "#" },
  { id: 3, label: "Home & Kitchen", url: "#" },
  { id: 4, label: "Sports", url: "#" },
  { id: 5, label: "Books", url: "#" },
  { id: 6, label: "Beauty & Personal Care", url: "#" },
  { id: 7, label: "Grocery", url: "#" },
  { id: 8, label: "Toys & Games", url: "#" },
  { id: 9, label: "Automotive", url: "#" },
  { id: 10, label: "Health & Wellness", url: "#" },
]

const nav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Offers", href: "/offers" },
  { label: "Orders", href: "/orders" },
]

export default function AppNavbar(props: NavbarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <NavbarProvider>
      <Navbar intent="float" isSticky placement="top" {...props}>
        <NavbarStart>
          <Link className="flex items-center gap-x-2 font-medium" aria-label="Home" href="/">
            <Avatar
              isSquare
              size="sm"
              className="outline-hidden"
              src="https://design.intentui.com/logo?color=155DFC"
            />
            <span>
              Intent <span className="text-muted-fg">UI</span>
            </span>
          </Link>
        </NavbarStart>

        <NavbarGap />

        <NavbarSection>
          {nav.map((item) => (
            <NavbarItem key={item.href} href={item.href} isCurrent={isActive(item.href)}>
              {item.label}
            </NavbarItem>
          ))}

          <Menu>
            <NavbarItem>
              Categories
              <ChevronDownIcon className="col-start-3" />
            </NavbarItem>
            <MenuContent className="min-w-(--trigger-width) sm:min-w-56" items={categories}>
              {(item) => (
                <MenuItem id={item.id} textValue={item.label} href={item.url}>
                  {item.label}
                </MenuItem>
              )}
            </MenuContent>
          </Menu>
        </NavbarSection>

        <NavbarSpacer />

        <NavbarSection className="max-md:hidden">
          <Button intent="plain" size="sq-sm" aria-label="Search">
            <MagnifyingGlassIcon />
          </Button>
          <Button intent="plain" size="sq-sm" aria-label="Your Bag">
            <ShoppingBagIcon />
          </Button>
          <Separator orientation="vertical" className="mr-3 ml-1 h-5" />
          <UserMenu />
        </NavbarSection>
      </Navbar>

      <NavbarMobile>
        <NavbarTrigger />
        <NavbarSpacer />
        <Button intent="plain" size="sq-sm" aria-label="Search">
          <MagnifyingGlassIcon />
        </Button>
        <Button intent="plain" size="sq-sm" aria-label="Your Bag">
          <ShoppingBagIcon />
        </Button>
        <NavbarSeparator className="mr-2.5" />
        <UserMenu />
      </NavbarMobile>
    </NavbarProvider>
  )
}