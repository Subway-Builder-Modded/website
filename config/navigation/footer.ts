import { BookText, Download, Map, Megaphone, Trophy, TrainTrack, Unplug, type LucideIcon } from "lucide-react"

type FooterNavLink = {
  id: string
  label: string
  href: string
  icon: LucideIcon
}

type FooterNavSection = {
  id: string
  title: string
  icon: LucideIcon
  links: FooterNavLink[]
}

type FooterSocialLink = {
  id: string
  label: string
  href: string
  iconSrc: string
}

export const FOOTER_NAV_SECTIONS: FooterNavSection[] = [
  {
    id: "navigation",
    title: "Navigation",
    icon: BookText,
    links: [
      { id: "docs", label: "Railyard Docs", href: "/railyard/docs/latest/home", icon: BookText },
      { id: "updates", label: "Railyard Updates", href: "/railyard/updates", icon: Megaphone },
      { id: "credits", label: "Credits", href: "/credits", icon: Trophy },
    ],
  },
  {
    id: "railyard",
    title: "Railyard",
    icon: TrainTrack,
    links: [
      { id: "download", label: "Download App", href: "/railyard", icon: Download },
      { id: "maps", label: "Browse Maps", href: "/railyard/browse?type=maps", icon: Map },
      { id: "mods", label: "Browse Mods", href: "/railyard/browse?type=mods", icon: Unplug },
    ],
  },
]

export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  {
    id: "discord",
    label: "Discord",
    href: "https://discord.gg/syG9YHMyeG",
    iconSrc: "/assets/discord.svg",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Subway-Builder-Modded",
    iconSrc: "/assets/github.svg",
  },
]
