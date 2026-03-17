import {
  TrainTrack,
  FolderCode,
  type LucideIcon,
} from "lucide-react"
import { PROJECT_COLOR_SCHEMES, type ModeHex } from "@/lib/color-schemes"

export type UpdateProjectId = "railyard" | "template-mod"

export type UpdateProject = {
  id: UpdateProjectId
  label: string
  description: string
  basePath: string
  icon: LucideIcon
  primaryHex: ModeHex
  secondaryHex: ModeHex
  tertiaryHex: ModeHex
  textHex: ModeHex
}

export const UPDATE_PROJECTS: UpdateProject[] = [
  {
    id: "railyard",
    label: "Railyard",
    description:
      "All-in-one Map and Mod Manager for Subway Builder.",
    basePath: "/updates/railyard",
    icon: TrainTrack,
    primaryHex: PROJECT_COLOR_SCHEMES.railyard.primaryHex,
    secondaryHex: PROJECT_COLOR_SCHEMES.railyard.secondaryHex,
    tertiaryHex: PROJECT_COLOR_SCHEMES.railyard.tertiaryHex,
    textHex: PROJECT_COLOR_SCHEMES.railyard.textHex,
  },
  {
    id: "template-mod",
    label: "Template Mod",
    description:
      "Documented TypeScript template to create your own mods for Subway Builder.",
    basePath: "/updates/template-mod",
    icon: FolderCode,
    primaryHex: PROJECT_COLOR_SCHEMES["template-mod"].primaryHex,
    secondaryHex: PROJECT_COLOR_SCHEMES["template-mod"].secondaryHex,
    tertiaryHex: PROJECT_COLOR_SCHEMES["template-mod"].tertiaryHex,
    textHex: PROJECT_COLOR_SCHEMES["template-mod"].textHex,
  },
]

export function getUpdateProjectById(id: string): UpdateProject | undefined {
  return UPDATE_PROJECTS.find((p) => p.id === id)
}

export type UpdateTag = "release" | "beta" | "alpha"

export type UpdateSectionType = "features" | "bugfixes" | "upgrades" | "other"

export const UPDATE_SECTION_CONFIG: Record<
  UpdateSectionType,
  { letter: string; label: string }
> = {
  features: {
    letter: "F",
    label: "Features"
  },
  bugfixes: {
    letter: "B",
    label: "Bugfixes"
  },
  upgrades: {
    letter: "U",
    label: "Upgrades / Changes"
  },
  other: {
    letter: "O",
    label: "Other Notes"
  },
}
