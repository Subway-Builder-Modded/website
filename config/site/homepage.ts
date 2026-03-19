import { Megaphone, Package, TrainTrack, Users } from "lucide-react"
import type { NavbarIcon } from "@/config/navigation/navbar"
import type { LineBulletThemeId } from "@/lib/line-bullet-theme"

export type HomeItemBase = {
  id: string
  title: string
  description: string
  href: string
  lineBulletTheme: LineBulletThemeId
}

export type HomeItem = HomeItemBase &
  ({ letter: string; icon?: never } | { icon: NavbarIcon; letter?: never })

export const HOMEPAGE_ITEMS: HomeItem[] = [
  {
    id: "railyard",
    icon: TrainTrack,
    title: "Railyard",
    description: "All-in-one Map and Mod Manager for Subway Builder.",
    href: "/railyard",
    lineBulletTheme: "railyard",
  },
  {
    id: "template-mod-docs",
    icon: Package,
    title: "Template Mod Documentation",
    description: "View the docs for the Subway Builder Modded Template Mod.",
    href: "/docs/template-mod/latest/home",
    lineBulletTheme: "default",
  },
  {
    id: "updates",
    icon: Megaphone,
    title: "Updates & Changelogs",
    description: "Stay up to date with the latest releases from Subway Builder Modded.",
    href: "/updates",
    lineBulletTheme: "default",
  },
  {
    id: "credits",
    icon: Users,
    title: "Credits",
    description: "Subway Builder Modded is a community-driven project made possible by dedicated contributors.",
    href: "/credits",
    lineBulletTheme: "default",
  },
  {
    id: "discord",
    icon: {
      type: "mask",
      src: "/assets/discord.svg",
    },
    title: "Join the Community",
    description: "Join our Discord server to connect with the community and get support.",
    href: "https://discord.gg/syG9YHMyeG",
    lineBulletTheme: "default",
  },
]

export const HOME_SUBWAY_BARS = ["#0039A6", "#FF6319", "#00933C", "#FCCC0A", "#752F82"]
