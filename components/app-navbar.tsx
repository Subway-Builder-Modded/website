"use client"
import { usePathname } from "next/navigation"
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
import {
  BookText,
  Megaphone,
  Trophy,
  RailSymbol,
  Download,
  Map,
  Unplug
} from "lucide-react"

const railyard = [
  { id: 1, label: "Download App", url: "/railyard" },
  { id: 2, label: "Browse Maps", url: "/railyard/maps" },
  { id: 3, label: "Browse Mods", url: "/railyard/mods" },
]

const socialLinkClassName =
  "group rounded-lg p-2 text-muted-fg no-underline transition-all duration-200 ease-[cubic-bezier(.22,.9,.35,1)] hover:bg-secondary/60 hover:text-primary hover:scale-[1.08] active:scale-[0.94]"

export default function AppNavbar(props: NavbarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
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

        <NavbarSection>
          <NavbarItem isCurrent={isActive("/wiki")} href="/wiki">
            <BookText data-slot="icon" className="size-5 md:size-4" />
            Wiki
          </NavbarItem>

          <NavbarItem isCurrent={isActive("/updates")} href="/updates">
            <Megaphone data-slot="icon" className="size-5 md:size-4" />
            Updates
          </NavbarItem>

          <NavbarItem isCurrent={isActive("/credits")} href="/credits">
            <Trophy data-slot="icon" className="size-5 md:size-4" />
            Credits
          </NavbarItem>

          <div className="relative">
            <NavigationMenu viewport={false} className="max-w-none flex-none">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="
                      h-auto gap-x-2 rounded-lg px-2 py-2 text-sm font-semibold
                      transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)]
                        hover:scale-[1.03]
                      bg-gradient-to-b from-emerald-400/30 via-emerald-500/20 to-emerald-600/30
                      text-primary
                      shadow-[0_0_14px_hsl(var(--primary)/0.35)]
                      ring-1 ring-primary/60
                      hover:shadow-[0_0_16px_rgba(16,185,129,0.6)]
                      hover:ring-emerald-300
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60
                      data-[state=open]:bg-emerald-500/20
                      data-[state=open]:ring-emerald-300
                    "
                  >
                    <RailSymbol className="size-5 md:size-4 text-primary" />
                    <span className="font-semibold tracking-wide">Railyard</span>
                  </NavigationMenuTrigger>

                  <NavigationMenuContent className="min-w-56 !bg-background ring-1 ring-border rounded-xl shadow-lg">
                    <ul className="grid gap-y-1 p-1">
                      {railyard.map((item) => {
                        const Icon =
                          item.id === 1 ? Download :
                          item.id === 2 ? Map :
                          Unplug

                        return (
                          <li key={item.id}>
                            <NavigationMenuLink
                              href={item.url}
                              className="
                                flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-fg
                                transition-all duration-200 ease-[cubic-bezier(.22,.9,.35,1)]
                                hover:bg-secondary/60 hover:text-primary
                              "
                            >
                              <Icon className="size-4 shrink-0" />
                              <span>{item.label}</span>
                            </NavigationMenuLink>
                          </li>
                        )
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            {isActive("/railyard") && (
              <span className="absolute left-2 right-2 -bottom-[calc(var(--navbar-gutter)+1px)] h-(--gutter) rounded-full bg-primary [--gutter:--spacing(0.5)]" />
            )}
          </div>
        </NavbarSection>

        <NavbarSpacer />

        <NavbarSection className="max-md:hidden">
          <Link
            href="https://discord.gg/jrNQpbytUQ"
            aria-label="Discord"
            target="_blank"
            rel="noreferrer"
            className={socialLinkClassName}
          >
            <span
              className="block size-5 bg-current"
              style={{
                WebkitMask: "url(/assets/discord.svg) center / contain no-repeat",
                mask: "url(/assets/discord.svg) center / contain no-repeat",
              }}
            />
          </Link>

          <Link
            href="https://github.com/Subway-Builder-Modded"
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
            className={socialLinkClassName}
          >
            <span
              className="block size-5 bg-current"
              style={{
                WebkitMask: "url(/assets/github.svg) center / contain no-repeat",
                mask: "url(/assets/github.svg) center / contain no-repeat",
              }}
            />
          </Link>
        </NavbarSection>
      </Navbar>

      <NavbarMobile>
        <NavbarTrigger />
        <NavbarSpacer />

        <a
          href="https://discord.gg/jrNQpbytUQ"
          aria-label="Discord"
          target="_blank"
          rel="noreferrer"
          className={socialLinkClassName}
        >
          <span
            className="block size-5 bg-current"
            style={{
              WebkitMask: "url(/assets/discord.svg) center / contain no-repeat",
              mask: "url(/assets/discord.svg) center / contain no-repeat",
            }}
          />
        </a>

        <a
          href="https://github.com/Subway-Builder-Modded"
          aria-label="GitHub"
          target="_blank"
          rel="noreferrer"
          className={socialLinkClassName}
        >
          <span
            className="block size-5 bg-current"
            style={{
              WebkitMask: "url(/assets/github.svg) center / contain no-repeat",
              mask: "url(/assets/github.svg) center / contain no-repeat",
            }}
          />
        </a>
      </NavbarMobile>
    </NavbarProvider>
  )
}
