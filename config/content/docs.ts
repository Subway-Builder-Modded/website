import { FolderCode, Tag, TrainTrack, type LucideIcon } from "lucide-react"

export type DocsInstanceId = "railyard" | "template-mod"

export type DocsSidebarOrderItem =
  | string
  | {
      key: string
      children?: DocsSidebarOrderItem[]
    }

export type DocsVersion = {
  value: string
  label: string
  icon?: LucideIcon
  deprecated?: boolean
  sidebarOrder?: DocsSidebarOrderItem[]
}

export type DocsInstance = {
  id: DocsInstanceId
  label: string
  basePath: string
  icon: LucideIcon
  versioned: boolean
  latestVersion?: string
  versions?: DocsVersion[]
  sidebarOrder?: DocsSidebarOrderItem[]
}

export const DOCS_INSTANCES: DocsInstance[] = [
  {
    id: "railyard",
    label: "Railyard",
    basePath: "/docs/railyard",
    icon: TrainTrack,
    versioned: true,
    latestVersion: "v0.1",
    versions: [
      {
        value: "v0.1",
        label: "v0.1",
        icon: Tag,
        sidebarOrder: [
          "home",
          {
            key: "players",
            children: ["install-guide-windows", "install-guide-macos", "install-guide-linux", "github-token"],
          },
          {
            key: "developers",
            children: ["publishing-projects", "using-custom-url", "data-quality"],
          },
          {
            key: "creating-custom-maps",
            children: ["home", "creating-custom-maps-us", "custom-map-optional-features"],
          },
        ],
      },
    ],
  },
  {
    id: "template-mod",
    label: "Template Mod",
    basePath: "/docs/template-mod",
    icon: FolderCode,
    versioned: true,
    latestVersion: "v1.0",
    versions: [
      {
        value: "v1.0",
        label: "v1.0",
        icon: Tag,
        sidebarOrder: [
          "home",
          "getting-started",
          "project-structure",
          "common-patterns",
          "react-components",
          "debugging",
          "type-reference",
        ],
      },
    ],
  },
]

export function getDocsInstanceById(id: string) {
  return DOCS_INSTANCES.find((instance) => instance.id === id)
}

export function getSidebarOrder(instance: DocsInstance, version: string | null): DocsSidebarOrderItem[] {
  if (instance.versioned && version && instance.versions) {
    const matchedVersion = instance.versions.find((v) => v.value === version)
    return matchedVersion?.sidebarOrder ?? instance.sidebarOrder ?? []
  }

  return instance.sidebarOrder ?? []
}
