import {
  BookText,
  Download,
  FolderGit2,
  Package,
  Globe,
  Map,
  Megaphone,
  Moon,
  Sun,
  SunMoon,
  TrainTrack,
  Unplug,
  Users,
  type LucideIcon,
  Folder,
} from "lucide-react"
import { PROJECT_COLOR_SCHEMES } from "@/lib/color-schemes"

function getGithubColors(project: keyof typeof PROJECT_COLOR_SCHEMES): NavbarItemColors {
  const scheme = PROJECT_COLOR_SCHEMES[project]
  return {
    light: {
      text: scheme.tertiaryHex.light,
      background: scheme.primaryHex.light,
    },
    dark: {
      text: scheme.tertiaryHex.dark,
      background: scheme.primaryHex.dark,
    },
  }
}

export type NavbarPosition = "left" | "right"

export type NavbarItemColors = {
  light: {
    text: string
    background: string
  }
  dark: {
    text: string
    background: string
  }
}

export type NavbarMaskIcon = {
  type: "mask"
  src: string
}

export type NavbarImageIcon = {
  type: "image"
  src: string
}

export type NavbarIcon = LucideIcon | NavbarMaskIcon | NavbarImageIcon

export type NavbarDropdownItem = {
  id: string
  title?: string
  href?: string
  icon?: NavbarIcon
  colors?: NavbarItemColors
}

export type NavbarItem = {
  id: string
  title?: string
  href?: string
  icon?: NavbarIcon
  position: NavbarPosition
  colors?: NavbarItemColors
  dropdown?: NavbarDropdownItem[]
}

export type NavbarSpecialStyle = {
  triggerClassName?: string
  dropdownContentClassName?: string
  dropdownItemClassName?: string
  activeUnderlineClassName?: string
}

export const NAVBAR_SPECIAL_STYLES: Record<string, NavbarSpecialStyle> = {
  railyard: {
    triggerClassName:
      "h-auto gap-x-2 rounded-lg px-2 py-2 text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.03] bg-gradient-to-b from-emerald-400/30 via-emerald-500/20 to-emerald-600/30 text-primary shadow-[0_0_14px_hsl(var(--primary)/0.35)] ring-1 ring-primary/60 hover:shadow-[0_0_16px_rgba(16,185,129,0.6)] hover:ring-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 data-[state=open]:bg-emerald-500/20 data-[state=open]:ring-emerald-300",
    activeUnderlineClassName:
      "absolute left-2 right-2 z-0 -bottom-[calc(var(--navbar-gutter)+1px)] h-(--gutter) rounded-full bg-primary [--gutter:--spacing(0.5)]",
  },
}

export const NAVBAR_ITEMS: NavbarItem[] = [
  {
    id: "wiki",
    title: "Wiki",
    href: "/wiki",
    icon: BookText,
    position: "left",
  },
  {
    id: "updates",
    title: "Updates",
    href: "/updates",
    icon: Megaphone,
    position: "left",
  },
  {
    id: "credits",
    title: "Credits",
    href: "/credits",
    icon: Users,
    position: "left",
  },
  {
    id: "railyard",
    title: "Railyard",
    href: "/railyard",
    icon: TrainTrack,
    position: "left",
    dropdown: [
      {
        id: "railyard-download",
        title: "Download App",
        href: "/railyard",
        icon: Download,
      },
      {
        id: "railyard-maps",
        title: "Browse Maps",
        href: "/railyard/browse?type=maps",
        icon: Map,
      },
      {
        id: "railyard-mods",
        title: "Browse Mods",
        href: "/railyard/browse?type=mods",
        icon: Unplug,
      },
    ],
  },
  {
    id: "discord",
    href: "https://discord.gg/syG9YHMyeG",
    icon: {
      type: "mask",
      src: "/assets/discord.svg",
    },
    position: "right",
    dropdown: [
      {
        id: "subway-builder",
        title: "Subway Builder",
        href: "https://discord.gg/jrNQpbytUQ",
        icon: {
            type: "image",
            src: "/assets/subway-builder.svg",
        },
      },
      {
        id: "subway-builder-modded",
        title: "Subway Builder Modded",
        href: "https://discord.gg/syG9YHMyeG",
        icon: TrainTrack,
      },
    ],
  },
  {
    id: "github",
    href: "https://github.com/Subway-Builder-Modded",
    icon: {
      type: "mask",
      src: "/assets/github.svg",
    },
    position: "right",
    dropdown: [
      {
        id: "railyard",
        title: "Railyard",
        href: "https://github.com/Subway-Builder-Modded/railyard",
        icon: TrainTrack,
        colors: getGithubColors("railyard"),
      },
      {
        id: "template-mod",
        title: "Template Mod",
        href: "https://github.com/Subway-Builder-Modded/template-mod",
        icon: Package,
        colors: getGithubColors("template-mod"),
      },
      {
        id: "website",
        title: "Website",
        href: "https://github.com/Subway-Builder-Modded/website",
        icon: Globe,
        colors: getGithubColors("website"),
      },
    ],
  },
  {
    id: "theme",
    title: "Theme",
    position: "right",
    icon: SunMoon,
    dropdown: [
      {
        id: "theme-light",
        title: "Light",
        icon: Sun,
      },
      {
        id: "theme-dark",
        title: "Dark",
        icon: Moon,
      },
      {
        id: "theme-system",
        title: "System",
        icon: SunMoon,
      },
    ],
  },
]
