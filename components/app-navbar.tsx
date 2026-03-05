// app-navbar.tsx
"use client"

import {
  BuildingStorefrontIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  TagIcon,
} from "@heroicons/react/24/outline"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu"
import {
  Navbar,
  NavbarGap,
  NavbarItem,
  NavbarLabel,
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

export default function AppNavbar(props: NavbarProps) {
  return (
    <NavbarProvider>
      <Navbar isSticky placement="top" intent="default" {...props}>
        <NavbarStart>
          <Link
            className="flex items-center gap-x-2 font-black tracking-tight no-underline transition-colors duration-150 ease-out hover:text-primary"
            aria-label="Goto Subway Builder Modded home"
            href="/"
          >
            <Avatar
              isSquare
              size="sm"
              className="outline-hidden"
              src="https://design.intentui.com/logo?color=155DFC"
            />
            <span>
              Subway <span className="text-muted-fg">Builder</span>{" "}
              <span className="text-muted-fg">Modded</span>
            </span>
          </Link>
        </NavbarStart>

        <NavbarGap />

        <NavbarSection>
          <NavbarItem href="#" isCurrent>
            <HomeIcon data-slot="icon" className="inline-block align-middle" />
            <NavbarLabel>Home</NavbarLabel>
          </NavbarItem>

          <NavbarItem href="#">
            <BuildingStorefrontIcon data-slot="icon" className="inline-block align-middle" />
            <NavbarLabel>Shop</NavbarLabel>
          </NavbarItem>

          <NavbarItem href="#">
            <TagIcon data-slot="icon" className="inline-block align-middle" />
            <NavbarLabel>Offers</NavbarLabel>
          </NavbarItem>

          <NavbarItem href="#">
            <ClipboardDocumentListIcon data-slot="icon" className="inline-block align-middle" />
            <NavbarLabel>Orders</NavbarLabel>
          </NavbarItem>

          <Menu>
            <NavbarItem
              className={[
                "relative",
                "bg-primary/10 text-fg",
                "border border-primary/25",
                "hover:bg-primary/15 hover:border-primary/45",
                "shadow-xs hover:shadow-md",
                "transition-[background-color,border-color,box-shadow,transform,color] duration-150 ease-out",
                "hover:-translate-y-[1px] active:translate-y-0",
                "after:absolute after:inset-0 after:rounded-lg after:ring-1 after:ring-primary/35 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-150",
                "focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:inset-ring-0",
              ].join(" ")}
            >
              <Squares2X2Icon data-slot="icon" className="inline-block align-middle" />
              <NavbarLabel className="font-semibold">Categories</NavbarLabel>
              <ChevronDownIcon data-slot="icon" className="col-start-3 inline-block align-middle" />
            </NavbarItem>

            <MenuContent
              className={[
                "min-w-(--trigger-width) sm:min-w-56",
                "mt-3",
                "!p-0 !shadow-none !ring-0 !outline-none !border-0",
                "bg-muted text-foreground",
                "rounded-xl border border-border shadow-xl",
                "overflow-hidden",
                "focus:outline-none focus-visible:outline-none",
                "[&:before]:hidden [&:after]:hidden",
                "[&_*]:outline-none [&_*]:ring-0 [&_*]:shadow-none",
              ].join(" ")}
              items={categories}
            >
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
          <Button
            intent="plain"
            size="sq-sm"
            aria-label="Search for products"
            className="transition-[color,transform] duration-150 ease-out hover:text-primary hover:-translate-y-[1px] active:translate-y-0 hover:[&>svg]:text-primary"
          >
            <MagnifyingGlassIcon />
          </Button>
          <Button
            intent="plain"
            size="sq-sm"
            aria-label="Your Bag"
            className="transition-[color,transform] duration-150 ease-out hover:text-primary hover:-translate-y-[1px] active:translate-y-0 hover:[&>svg]:text-primary"
          >
            <ShoppingBagIcon />
          </Button>
          <Separator orientation="vertical" className="mr-3 ml-1 h-5" />
          <div className="transition-[color,transform] duration-150 ease-out hover:text-primary hover:-translate-y-[1px] active:translate-y-0 [&_svg]:transition-colors [&_svg]:duration-150 [&_svg]:ease-out hover:[&_svg]:text-primary">
            <UserMenu />
          </div>
        </NavbarSection>
      </Navbar>

      <NavbarMobile>
        <NavbarTrigger />
        <NavbarSpacer />
        <Button
          intent="plain"
          size="sq-sm"
          aria-label="Search for products"
          className="transition-[color,transform] duration-150 ease-out hover:text-primary hover:-translate-y-[1px] active:translate-y-0 hover:[&>svg]:text-primary"
        >
          <MagnifyingGlassIcon />
        </Button>
        <Button
          intent="plain"
          size="sq-sm"
          aria-label="Your Bag"
          className="transition-[color,transform] duration-150 ease-out hover:text-primary hover:-translate-y-[1px] active:translate-y-0 hover:[&>svg]:text-primary"
        >
          <ShoppingBagIcon />
        </Button>
        <NavbarSeparator className="mr-2.5" />
        <div className="transition-[color,transform] duration-150 ease-out hover:text-primary hover:-translate-y-[1px] active:translate-y-0 [&_svg]:transition-colors [&_svg]:duration-150 [&_svg]:ease-out hover:[&_svg]:text-primary">
          <UserMenu />
        </div>
      </NavbarMobile>
    </NavbarProvider>
  )
}
