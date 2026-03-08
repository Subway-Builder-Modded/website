import { FolderCode, TrainTrack, type LucideIcon } from "lucide-react"

export type UpdateProjectId = "railyard" | "template-mod"

export type UpdateTag = "release" | "beta"

export type UpdateProject = {
  id: UpdateProjectId
  label: string
  description: string
  href: string
  repositoryUrl: string
  icon: LucideIcon
  bullet: string
  accent: string
  base: string
  mid: string
}

export const UPDATE_PROJECTS: UpdateProject[] = [
  {
    id: "railyard",
    label: "Railyard",
    description:
      "Release notes for the official Subway Builder custom map platform.",
    href: "/updates/railyard",
    repositoryUrl: "https://github.com/Subway-Builder-Modded/Railyard",
    icon: TrainTrack,
    bullet: "R",
    accent: "#00D492",
    base: "#032D23",
    mid: "#00A97A",
  },
  {
    id: "template-mod",
    label: "Template Mod",
    description:
      "Changelogs for the documented TypeScript template used to build Subway Builder mods.",
    href: "/updates/template-mod",
    repositoryUrl: "https://github.com/Subway-Builder-Modded/SubwayBuilderTemplateMod",
    icon: FolderCode,
    bullet: "T",
    accent: "#A684FF",
    base: "#311362",
    mid: "#7D52E8",
  },
]

export function getUpdateProjectById(id: string) {
  return UPDATE_PROJECTS.find((project) => project.id === id)
}
