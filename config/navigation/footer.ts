import { BookText, Download, Home, Scale, TrainTrack, Users, FileSearchCorner, MapPin, Megaphone, Package, Globe } from "lucide-react"
import { PROJECT_COLOR_SCHEMES, SHARED_MUTED_TEXT_COLOR, SHARED_TEXT_COLOR, type ModeHex } from "@/config/theme/colors"
import type { NavbarIcon } from "@/config/navigation/navbar"

type FooterNavLink = {
  id: string
  label: string
  href: string
  icon: NavbarIcon
}

type FooterNavColorScheme = {
  accentColor: ModeHex
  mutedColor: ModeHex
}

const FOOTER_NAV_COLOR_SCHEMES = {
  navigation: {
    accentColor: SHARED_TEXT_COLOR,
    mutedColor: SHARED_MUTED_TEXT_COLOR,
  },
  railyard: {
    accentColor: PROJECT_COLOR_SCHEMES.railyard.accentColor,
    mutedColor: PROJECT_COLOR_SCHEMES.railyard.mutedColor,
  },
  registry: {
    accentColor: PROJECT_COLOR_SCHEMES.registry.accentColor,
    mutedColor: PROJECT_COLOR_SCHEMES.registry.mutedColor,
  },
  "template-mod": {
    accentColor: PROJECT_COLOR_SCHEMES["template-mod"].accentColor,
    mutedColor: PROJECT_COLOR_SCHEMES["template-mod"].mutedColor,
  },
  website: {
    accentColor: PROJECT_COLOR_SCHEMES.website.accentColor,
    mutedColor: PROJECT_COLOR_SCHEMES.website.mutedColor,
  },
} as const satisfies Record<string, FooterNavColorScheme>

export type FooterNavColorSchemeId = keyof typeof FOOTER_NAV_COLOR_SCHEMES

export type FooterNavSection = {
  id: string
  title: string
  icon: NavbarIcon
  colorScheme: FooterNavColorSchemeId
  links: FooterNavLink[]
}

type FooterSocialLink = {
  id: string
  label: string
  href: string
  icon: NavbarIcon
}

export const FOOTER_NAV_SECTIONS: FooterNavSection[] = [
  {
    id: "navigation",
    title: "Navigation",
    icon: MapPin,
    colorScheme: "navigation",
    links: [
      {
        id: "home",
        label: "Home",
        href: "/",
        icon: Home,
      },
      {
        id: "credits",
        label: "Credits",
        href: "/credits",
        icon: Users,
      },
      {
        id: "license",
        label: "License",
        href: "/license",
        icon: Scale,
      },
      {
        id: "github",
        label: "GitHub",
        href: "https://github.com/Subway-Builder-Modded",
        icon: {
          type: "mask",
          src: "/assets/github.svg",
        },
      },
    ],
  },
  {
    id: "railyard",
    title: "Railyard",
    icon: TrainTrack,
    colorScheme: "railyard",
    links: [
      {
        id: "railyard-download",
        label: "Download",
        href: "/railyard",
        icon: Download
      },
      {
        id: "railyard-browse",
        label: "Browse",
        href: "/railyard/browse",
        icon: FileSearchCorner
      },
      {
        id: "railyard-world-map",
        label: "World Map",
        href: "/railyard/world-map",
        icon: Globe
      },
      {
        id: "railyard-docs",
        label: "Docs",
        href: "/railyard/docs",
        icon: BookText
      },
      {
        id: "railyard-updates",
        label: "Updates",
        href: "/railyard/updates",
        icon: Megaphone
      },
    ],
  },
  {
    id: "template-mod",
    title: "Template Mod",
    icon: Package,
    colorScheme: "template-mod",
    links: [
      {
        id: "template-mod-download",
        label: "Home",
        href: "/template-mod",
        icon: Home
      },
      {
        id: "template-mod-docs",
        label: "Docs",
        href: "/template-mod/docs",
        icon: BookText
      },
      {
        id: "template-mod-updates",
        label: "Updates",
        href: "/template-mod/updates",
        icon: Megaphone
      },
    ],
  },
]

export function getFooterNavColorScheme(scheme: FooterNavColorSchemeId): FooterNavColorScheme {
  return FOOTER_NAV_COLOR_SCHEMES[scheme]
}

export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  {
    id: "discord",
    label: "Discord",
    href: "https://discord.gg/syG9YHMyeG",
    icon: { type: "mask", src: "/assets/discord.svg" },
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Subway-Builder-Modded",
    icon: { type: "mask", src: "/assets/github.svg" },
  },
]
