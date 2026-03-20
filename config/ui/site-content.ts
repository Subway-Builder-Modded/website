import {
  Bug,
  Globe,
  Heart,
  Info,
  Plus,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import type { UpdateSectionType, UpdateTag } from "@/config/content/updates"
import { PROJECT_COLOR_SCHEMES } from "@/config/theme/colors"

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
  emptyProjectText: "No updates published yet.",
} as const

export const RAILYARD_CARD_CONTENT = {
  mapLabel: "Map",
  modLabel: "Mod",
  accentColor: PROJECT_COLOR_SCHEMES.railyard.accentColor,
} as const
