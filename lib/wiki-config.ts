import {
  TrainTrack,
  FolderCode,
  MapPinPlus,
  GitPullRequestArrow,
  History,
  Tag,
  type LucideIcon,
} from "lucide-react"

export type WikiInstanceId =
  | "railyard"
  | "template-mod"
  | "creating-custom-maps"
  | "contributing"
  | "legacy"

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
  /** Vibrant/bright color — dark mode text, light mode background */
  primaryHex: string
  /** Deep/dark color — dark mode background, light mode text */
  secondaryHex: string
  accentClassName: string
  accentSurfaceClassName: string
  accentSurfaceHoverClassName: string
  accentIconSurfaceClassName: string
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
    primaryHex: "#00D492",
    secondaryHex: "#032D23",
    accentClassName: "text-emerald-400",
    accentSurfaceClassName: "bg-emerald-500/14 border-emerald-500/30",
    accentSurfaceHoverClassName: "hover:bg-emerald-500/18",
    accentIconSurfaceClassName: "bg-emerald-950/80 border-emerald-700/50",
    versioned: true,
    latestVersion: "v0.1",
    versions: [
      {
        value: "v0.1",
        label: "v0.1",
        icon: Tag,
        sidebarOrder: [
          "home",
          "players",
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
    primaryHex: "#A684FF",
    secondaryHex: "#311362",
    accentClassName: "text-violet-400",
    accentSurfaceClassName: "bg-violet-500/14 border-violet-500/30",
    accentSurfaceHoverClassName: "hover:bg-violet-500/18",
    accentIconSurfaceClassName: "bg-violet-950/80 border-violet-700/50",
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
    primaryHex: "#51A2FF",
    secondaryHex: "#192754",
    accentClassName: "text-blue-400",
    accentSurfaceClassName: "bg-blue-500/14 border-blue-500/30",
    accentSurfaceHoverClassName: "hover:bg-blue-500/18",
    accentIconSurfaceClassName: "bg-blue-950/80 border-blue-700/50",
    versioned: false,
    sidebarOrder: [
      "home",
      "creating-custom-maps-us",
      "custom-map-optional-features",
    ],
  },
  {
    id: "contributing",
    label: "Contributing",
    basePath: "/wiki/contributing",
    icon: GitPullRequestArrow,
    primaryHex: "#FFB900",
    secondaryHex: "#471F07",
    accentClassName: "text-amber-400",
    accentSurfaceClassName: "bg-amber-500/14 border-amber-500/30",
    accentSurfaceHoverClassName: "hover:bg-amber-500/18",
    accentIconSurfaceClassName: "bg-amber-950/80 border-amber-700/50",
    versioned: false,
    sidebarOrder: [
      "home",
    ],
  },
  {
    id: "legacy",
    label: "Legacy",
    basePath: "/wiki/legacy",
    icon: History,
    primaryHex: "#FF637E",
    secondaryHex: "#4D091C",
    accentClassName: "text-rose-400",
    accentSurfaceClassName: "bg-rose-500/14 border-rose-500/30",
    accentSurfaceHoverClassName: "hover:bg-rose-500/18",
    accentIconSurfaceClassName: "bg-rose-950/80 border-rose-700/50",
    versioned: false,
    sidebarOrder: [
      "home",
      "map-installation-guide",
      "legacy-map-installation-guide",
      "troubleshooting",
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
