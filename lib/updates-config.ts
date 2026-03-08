import {
  TrainTrack,
  FolderCode,
  type LucideIcon,
} from "lucide-react"

export type UpdateProjectId = "railyard" | "template-mod"

export type UpdateProject = {
  id: UpdateProjectId
  label: string
  description: string
  basePath: string
  icon: LucideIcon
  primaryHex: string
  secondaryHex: string
  midHex: string
  accentClassName: string
}

export const UPDATE_PROJECTS: UpdateProject[] = [
  {
    id: "railyard",
    label: "Railyard",
    description:
      "The custom map and mod distribution platform for Subway Builder. Browse and publish community-made custom maps and mods.",
    basePath: "/updates/railyard",
    icon: TrainTrack,
    primaryHex: "#00D492",
    secondaryHex: "#032D23",
    midHex: "#00A97A",
    accentClassName: "text-emerald-400",
  },
  {
    id: "template-mod",
    label: "Template Mod",
    description:
      "Documented TypeScript template to create your own mods for Subway Builder.",
    basePath: "/updates/template-mod",
    icon: FolderCode,
    primaryHex: "#A684FF",
    secondaryHex: "#311362",
    midHex: "#7D52E8",
    accentClassName: "text-violet-400",
  },
]

export function getUpdateProjectById(id: string): UpdateProject | undefined {
  return UPDATE_PROJECTS.find((p) => p.id === id)
}

export type UpdateTag = "release" | "beta" | "alpha"

/** Section types available in individual update MDX pages */
export type UpdateSectionType = "features" | "bugfixes" | "upgrades" | "other"

export const UPDATE_SECTION_CONFIG: Record<
  UpdateSectionType,
  { letter: string; label: string; bulletColor: string }
> = {
  features: {
    letter: "F",
    label: "Features",
    bulletColor: "#F97316",
  },
  bugfixes: {
    letter: "B",
    label: "Bugfixes",
    bulletColor: "#EF4444",
  },
  upgrades: {
    letter: "U",
    label: "Upgrades / Changes",
    bulletColor: "#22C55E",
  },
  other: {
    letter: "O",
    label: "Other Notes",
    bulletColor: "#6B7280",
  },
}
