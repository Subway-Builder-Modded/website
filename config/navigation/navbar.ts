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
} from "lucide-react"
import { PROJECT_COLOR_SCHEMES } from "@/config/theme/colors"

function getGithubHoverColors(project: keyof typeof PROJECT_COLOR_SCHEMES): NavbarItemColors {
  const scheme = PROJECT_COLOR_SCHEMES[project]
  return {
    light: {
      text: scheme.accentColor.light,
      background: scheme.primaryColor.light,
    },
    dark: {
      text: scheme.accentColor.dark,
      background: scheme.primaryColor.dark,
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
  color?: NavbarItemColors
}

export type NavbarItem = {
  id: string
  title?: string
  href?: string
  icon?: NavbarIcon
  position: NavbarPosition
  colors?: NavbarItemColors
  color?: NavbarItemColors
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
      "relative isolate overflow-hidden h-auto gap-x-2 rounded-lg border border-border/80 px-2 py-2 text-sm font-semibold !text-foreground bg-card shadow-sm transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-0.5 hover:border-transparent hover:shadow-xl hover:shadow-black/12 dark:hover:shadow-black/35 data-open:-translate-y-0.5 data-popup-open:-translate-y-0.5 data-open:border-transparent data-popup-open:border-transparent data-open:shadow-xl data-popup-open:shadow-xl data-open:shadow-black/12 data-popup-open:shadow-black/12 dark:data-open:shadow-black/35 dark:data-popup-open:shadow-black/35 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-[#28E6AA] dark:before:bg-[#19D89C] after:pointer-events-none after:absolute after:-right-8 after:-top-8 after:size-20 after:rounded-full after:bg-[#28E6AA]/20 dark:after:bg-[#19D89C]/24 after:blur-2xl after:opacity-80 after:transition-opacity after:duration-300 hover:after:opacity-100 data-open:after:opacity-100 data-popup-open:after:opacity-100 hover:ring-1 hover:ring-[#28E6AA66] dark:hover:ring-[#19D89C66] data-open:ring-1 data-popup-open:ring-1 data-open:ring-[#28E6AA66] data-popup-open:ring-[#28E6AA66] dark:data-open:ring-[#19D89C66] dark:data-popup-open:ring-[#19D89C66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#28E6AA88] dark:focus-visible:ring-[#19D89C88]",
    activeUnderlineClassName:
      "absolute left-2 right-2 z-0 -bottom-[calc(var(--navbar-gutter)+1px)] h-(--gutter) rounded-full bg-primary [--gutter:--spacing(0.5)]",
  },
}

export const NAVBAR_ITEMS: NavbarItem[] = [
  {
    id: "Docs",
    title: "Docs",
    href: "/docs",
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
        colors: getGithubHoverColors("railyard"),
      },
      {
        id: "registry",
        title: "Registry",
        href: "https://github.com/Subway-Builder-Modded/The-Railyard",
        icon: FolderGit2,
        colors: getGithubHoverColors("registry"),
      },
      {
        id: "template-mod",
        title: "Template Mod",
        href: "https://github.com/Subway-Builder-Modded/template-mod",
        icon: Package,
        colors: getGithubHoverColors("template-mod"),
      },
      {
        id: "website",
        title: "Website",
        href: "https://github.com/Subway-Builder-Modded/website",
        icon: Globe,
        colors: getGithubHoverColors("website"),
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
        colors: {
          light: {
            text: "#B06710",
            background: "#FFD26055",
          },
          dark: {
            text: "#FFD260",
            background: "#B0671055",
          },
        },
      },
      {
        id: "theme-dark",
        title: "Dark",
        icon: Moon,
        colors: {
          light: {
            text: "#4776CC",
            background: "#2DB7E055",
          },
          dark: {
            text: "#2DB7E0",
            background: "#4776CC55",
          },
        },
      },
      {
        id: "theme-system",
        title: "System",
        icon: SunMoon,
        colors: {
          light: {
            text: "#B06710",
            background: "#FFD26055",
          },
          dark: {
            text: "#2DB7E0",
            background: "#4776CC55",
          },
        },
      },
    ],
  },
]
