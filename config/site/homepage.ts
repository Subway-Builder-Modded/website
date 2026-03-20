import {
  BookText,
  Package,
  Download,
  Github,
  Rocket,
  TrainTrack,
  Users,
  Globe,
  FolderGit2,
  Send,
  ExternalLink,
  type LucideIcon,
} from "lucide-react"

import type { NavbarIcon } from "@/config/navigation/navbar"
import type { ProjectColorId } from "@/config/theme/colors"

export type HomeButtonScheme = "default" | ProjectColorId
export type HomeButtonSize = "xs" | "sm" | "md" | "lg" | "xl"

export type HomeLink = {
  label: string
  href: string
  external?: boolean
  icon?: NavbarIcon
  variant: "solid" | "outline"
  scheme: HomeButtonScheme
  size: HomeButtonSize
}

export type HomeProjectCard = {
  id: string
  title: string
  description: string
  scheme: ProjectColorId
  icon: LucideIcon
  image: {
    light: string
    dark: string
    alt: string
  }
  buttons: HomeLink[]
}

export const HOME_THEME = {
  accent: {
    light: "#0A0A0A",
    dark: "#FFFFFF",
  },
  textOnAccent: {
    light: "#FFFFFF",
    dark: "#0A0A0A",
  },
  accentSoft: {
    light: "rgba(10, 10, 10, 0.1)",
    dark: "rgba(255, 255, 255, 0.14)",
  },
} as const

export const HOME_SUBWAY_BARS = ["#0039A6", "#FF6319", "#00933C", "#FCCC0A", "#752F82"] as const

export const HOME_HERO = {
  title: "Subway Builder Modded",
  description:
    "The complete hub for everything modded in Subway Builder, made by players, for players.",
  backgroundImage: {
    light: "/images/home/light.png",
    dark: "/images/home/dark.png",
    alt: "Subway Builder Modded hero background",
  },
  primaryActions: [
    {
      label: "GitHub",
      href: "https://github.com/Subway-Builder-Modded",
      external: true,
      variant: "solid",
      icon: Github,
      scheme: "default",
      size: "xl",
    },
    {
      label: "Discord",
      href: "https://discord.gg/syG9YHMyeG",
      external: true,
      variant: "outline",
      icon: {
        type: "mask",
        src: "/assets/discord.svg",
      },
      scheme: "default",
      size: "xl",
    },
  ] satisfies HomeLink[],
} as const

export const HOME_PROJECT_SECTION = {
  title: "Projects",
  description:
    "Explore projects in the Subway Builder Modded ecosystem.",
  cards: [
    {
      id: "railyard",
      title: "Railyard",
      description: "All-in-one Map and Mod Manager for Subway Builder.",
      scheme: "railyard",
      icon: TrainTrack,
      image: {
        light: "/images/shared/railyard-light.png",
        dark: "/images/shared/railyard-dark.png",
        alt: "Railyard preview",
      },
      buttons: [
        {
          label: "Download",
          href: "/railyard",
          variant: "solid",
          icon: Download,
          scheme: "railyard",
          size: "md",
        },
        {
          label: "Browse Content",
          href: "/railyard/browse",
          variant: "outline",
          icon: Rocket,
          scheme: "railyard",
          size: "md",
        },
      ],
    },
    {
      id: "registry",
      title: "Registry",
      description: "The registry that powers Railyard. It serves as Railyard's database for user-submitted content.",
      scheme: "registry",
      icon: FolderGit2,
      image: {
        light: "/images/shared/registry-light.png",
        dark: "/images/shared/registry-dark.png",
        alt: "Registry preview",
      },
      buttons: [
        {
          label: "Visit",
          href: "https://github.com/Subway-Builder-Modded/The-Railyard",
          external: true,
          variant: "solid",
          icon: ExternalLink,
          scheme: "registry",
          size: "md",
        },
        {
          label: "Submit Content",
          href: "https://github.com/Subway-Builder-Modded/The-Railyard/issues",
          external: true,
          variant: "outline",
          icon: Send,
          scheme: "registry",
          size: "md",
        },
      ],
    },
    {
      id: "template-mod",
      title: "Template Mod",
      description: "Documented TypeScript template to create your own mods for Subway Builder.",
      scheme: "template-mod",
      icon: Package,
      image: {
        light: "/images/shared/template-mod-light.png",
        dark: "/images/shared/template-mod-dark.png",
        alt: "Template Mod preview",
      },
      buttons: [
        {
          label: "Download",
          href: "https://github.com/Subway-Builder-Modded/template-mod",
          external: true,
          variant: "solid",
          icon: Download,
          scheme: "template-mod",
          size: "md",
        },
        {
          label: "Documentation",
          href: "/template-mod/docs/latest/home",
          variant: "outline",
          icon: BookText,
          scheme: "template-mod",
          size: "md",
        },
      ],
    },
    {
      id: "website",
      title: "Website",
      description: "Central place for docs, updates, and community resources across all Subway Builder Modded projects.",
      scheme: "website",
      icon: Globe,
      image: {
        light: "/images/shared/website-light.png",
        dark: "/images/shared/website-dark.png",
        alt: "Website preview",
      },
      buttons: [
        {
          label: "Contribute",
          href: "https://github.com/Subway-Builder-Modded/website",
          external: true,
          variant: "solid",
          icon: Github,
          scheme: "website",
          size: "md",
        },
        {
          label: "Credits",
          href: "/credits",
          variant: "outline",
          icon: Users,
          scheme: "website",
          size: "md",
        },
      ],
    },
  ] satisfies HomeProjectCard[],
} as const

export const HOME_OPEN_SOURCE_SECTION = {
  title: "Open Source",
  description:
    "Subway Builder Modded is and always will be completely open-source. Contributions, bug reports, docs improvements, and new ideas are all welcome.",
  points: [
    "Public codebases with transparent development.",
    "Community-maintained and updated docs and changelogs.",
    "Built for stability, extensibility, and clear contributor workflows.",
  ],
  links: [
    {
      label: "GitHub",
      href: "https://github.com/Subway-Builder-Modded",
      external: true,
      variant: "solid",
      icon: Github,
      scheme: "default",
      size: "md",
    },
    {
      label: "Credits",
      href: "/credits",
      variant: "outline",
      icon: Users,
      scheme: "default",
      size: "md",
    },
  ] satisfies HomeLink[],
} as const

export const HOME_COMMUNITY_SECTION = {
  title: "Join The Community",
  description:
    "Get support, share feedback, show your creations, and help shape the roadmap with other builders and modders.",
  links: [
    {
      label: "Join the Discord",
      href: "https://discord.gg/syG9YHMyeG",
      external: true,
      variant: "solid",
      icon: {
        type: "mask",
        src: "/assets/discord.svg",
      },
      scheme: "default",
      size: "md",
    },
  ] satisfies HomeLink[],
} as const
