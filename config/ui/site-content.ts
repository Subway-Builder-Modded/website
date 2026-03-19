import {
  BookText,
  Bug,
  Globe,
  Heart,
  Info,
  Megaphone,
  Plus,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import type { DocsInstance } from "@/config/content/docs"
import type { UpdateProject, UpdateSectionType, UpdateTag } from "@/config/content/updates"
import { PROJECT_COLOR_SCHEMES } from "@/config/theme/colors"

type PreviewImage = {
  light: string
  dark: string
  alt: string
}

type ProjectPreviewImageConfig = Record<DocsInstance["id"] | UpdateProject["id"], PreviewImage>

type HubPageContent = {
  title: string
  description: string
  eyebrow: string
  icon: LucideIcon
}

export const PROJECT_PREVIEW_IMAGES: ProjectPreviewImageConfig = {
  railyard: {
    light: "/images/shared/railyard-light.png",
    dark: "/images/shared/railyard-dark.png",
    alt: "Railyard preview",
  },
  "template-mod": {
    light: "/images/shared/template-mod-light.png",
    dark: "/images/shared/template-mod-dark.png",
    alt: "Template Mod preview",
  },
}

export const DOCS_HUB_CONTENT: HubPageContent = {
  title: "Docs",
  description: "Pick a project to browse documentation, setup guides, references, and best practices.",
  eyebrow: "Documentation",
  icon: BookText,
}

export const DOCS_PROJECT_DESCRIPTIONS: Record<DocsInstance["id"], string> = {
  railyard: "All-in-one Map and Mod Manager for Subway Builder.",
  "template-mod": "Documented TypeScript template to create your own mods for Subway Builder.",
}

export const UPDATES_HUB_CONTENT: HubPageContent = {
  title: "Updates & Changelogs",
  description: "Stay current with release notes, improvements, and breaking changes across Subway Builder Modded projects.",
  eyebrow: "Changelogs",
  icon: Megaphone,
}

export const CREDITS_PAGE_CONTENT = {
  title: "Credits",
  description: "The people and contributors helping Subway Builder Modded move forward.",
  icon: Sparkles,
  accentHex: "#FFFFFF",
  sectionIcons: {
    maintainers: Users,
    translators: Globe,
    contributors: Heart,
  } satisfies Record<string, LucideIcon>,
} as const

export const UPDATE_SECTION_ICON_MAP: Record<UpdateSectionType, LucideIcon> = {
  features: Plus,
  upgrades: Wrench,
  bugfixes: Bug,
  other: Info,
}

export const UPDATE_TAG_STYLES: Record<UpdateTag | "latest", { label: string; color: string }> = {
  latest: { label: "Latest", color: "#3fb950" },
  release: { label: "Release", color: "#2f81f7" },
  beta: { label: "Beta", color: "#d29922" },
  alpha: { label: "Alpha", color: "#f85149" },
}

export const UPDATES_PAGE_COPY = {
  backLabel: "Back",
  emptyProjectText: "No updates published yet.",
} as const

export const RAILYARD_CARD_CONTENT = {
  mapLabel: "Map",
  modLabel: "Mod",
  accentColor: PROJECT_COLOR_SCHEMES.railyard.accentColor,
} as const
