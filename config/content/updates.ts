import { Package, TrainTrack, type LucideIcon } from "lucide-react"
import { PROJECT_COLOR_SCHEMES, type ModeHex } from "@/config/theme/colors"

export type UpdateProjectId = "railyard" | "template-mod"

export type UpdateProject = {
  id: UpdateProjectId
  label: string
  description: string
  basePath: string
  icon: LucideIcon
  accentColor: ModeHex
  primaryColor: ModeHex
  secondaryColor: ModeHex
  textColor: ModeHex
  textColorInverted: ModeHex
}

export const UPDATE_PROJECTS: UpdateProject[] = [
  {
    id: "railyard",
    label: "Railyard",
    description: "All-in-one Map and Mod Manager for Subway Builder.",
    basePath: "/railyard/updates",
    icon: TrainTrack,
    accentColor: PROJECT_COLOR_SCHEMES.railyard.accentColor,
    primaryColor: PROJECT_COLOR_SCHEMES.railyard.primaryColor,
    secondaryColor: PROJECT_COLOR_SCHEMES.railyard.secondaryColor,
    textColor: PROJECT_COLOR_SCHEMES.railyard.textColor,
    textColorInverted: PROJECT_COLOR_SCHEMES["template-mod"].textColorInverted,
  },
  {
    id: "template-mod",
    label: "Template Mod",
    description: "Documented TypeScript template to create your own mods for Subway Builder.",
    basePath: "/template-mod/updates",
    icon: Package,
    accentColor: PROJECT_COLOR_SCHEMES["template-mod"].accentColor,
    primaryColor: PROJECT_COLOR_SCHEMES["template-mod"].primaryColor,
    secondaryColor: PROJECT_COLOR_SCHEMES["template-mod"].secondaryColor,
    textColor: PROJECT_COLOR_SCHEMES["template-mod"].textColor,
    textColorInverted: PROJECT_COLOR_SCHEMES["template-mod"].textColorInverted,
  },
]

export function getUpdateProjectById(id: string): UpdateProject | undefined {
  return UPDATE_PROJECTS.find((project) => project.id === id)
}

export type UpdateTag = "release" | "beta" | "alpha"
export type UpdateSectionType = "features" | "bugfixes" | "upgrades" | "other"

export const UPDATE_SECTION_CONFIG: Record<UpdateSectionType, { label: string }> = {
  features: {
    label: "Features",
  },
  bugfixes: {
    label: "Bugfixes",
  },
  upgrades: {
    label: "Upgrades & Changes",
  },
  other: {
    label: "Other Notes",
  },
}
