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
      "h-auto gap-x-2 rounded-lg border px-2 py-2 text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-[1.03] !bg-[#51BD8E55] !border-[#28E6AA55] !text-[#232323] dark:!bg-[#42AD7F55] dark:!border-[#19D89C55] dark:!text-[#F2F2F2] hover:!bg-[#51BD8E55] hover:!text-[#232323] hover:!border-[#28E6AA55] dark:hover:!bg-[#42AD7F55] dark:hover:!text-[#F2F2F2] dark:hover:!border-[#19D89C55] focus:!bg-[#51BD8E55] focus:!text-[#232323] focus:!border-[#28E6AA55] dark:focus:!bg-[#42AD7F55] dark:focus:!text-[#F2F2F2] dark:focus:!border-[#19D89C55] data-open:!bg-[#51BD8E55] data-open:!text-[#232323] data-open:!border-[#28E6AA55] dark:data-open:!bg-[#42AD7F55] dark:data-open:!text-[#F2F2F2] dark:data-open:!border-[#19D89C55] data-popup-open:!bg-[#51BD8E55] data-popup-open:!text-[#232323] data-popup-open:!border-[#28E6AA55] dark:data-popup-open:!bg-[#42AD7F55] dark:data-popup-open:!text-[#F2F2F2] dark:data-popup-open:!border-[#19D89C55] shadow-[0_0_14px_hsl(var(--primary)/0.35)] ring-1 ring-[#28E6AA55] dark:ring-[#19D89C55] hover:shadow-[0_0_16px_hsl(var(--primary)/0.45)] focus-visible:outline-none focus-visible:ring-2",
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
        colors: getGithubHoverColors("railyard"),
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
