import {
  TrainTrack,
  FolderCode,
  MapPinPlus,
  Tag,
  type LucideIcon,
} from "lucide-react"

export type WikiInstanceId =
  | "railyard"
  | "template-mod"
  | "creating-custom-maps"

export type WikiSidebarOrderItem =
  | string
  | {
      key: string
      children?: WikiSidebarOrderItem[]
    }

export type WikiVersion = {
  value: string
  label: string
  icon?: LucideIcon
  deprecated?: boolean
  sidebarOrder?: WikiSidebarOrderItem[]
}

export type WikiInstance = {
  id: WikiInstanceId
  label: string
  basePath: string
  icon: LucideIcon
  versioned: boolean
  latestVersion?: string
  versions?: WikiVersion[]
  sidebarOrder?: WikiSidebarOrderItem[]
}

export const WIKI_INSTANCES: WikiInstance[] = [
  {
    id: "railyard",
    label: "Railyard",
    basePath: "/wiki/railyard",
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
            children: [
              "install-guide-windows",
              "install-guide-macos",
              "install-guide-linux",
              "github-token",
            ],
          },
          {
            key: "developers",
            children: [
              "publishing-projects",
              "using-custom-url",
              "data-quality",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "template-mod",
    label: "Template Mod",
    basePath: "/wiki/template-mod",
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
  {
    id: "creating-custom-maps",
    label: "Creating Custom Maps",
    basePath: "/wiki/creating-custom-maps",
    icon: MapPinPlus,
    versioned: false,
    sidebarOrder: [
      "home",
      "creating-custom-maps-us",
      "custom-map-optional-features",
    ],
  },
]

export function getWikiInstanceById(id: string) {
  return WIKI_INSTANCES.find((instance) => instance.id === id)
}

export function getSidebarOrder(
  instance: WikiInstance,
  version: string | null
): WikiSidebarOrderItem[] {
  if (instance.versioned && version && instance.versions) {
    const v = instance.versions.find((ver) => ver.value === version)
    return v?.sidebarOrder ?? instance.sidebarOrder ?? []
  }

  return instance.sidebarOrder ?? []
}
