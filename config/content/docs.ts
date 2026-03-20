import {
  Bug,
  CodeXml,
  Users,
  Package,
  Tag,
  TrainTrack,
  Plus,
  Folder,
  Link2,
  Atom,
  SearchCode,
  BookText,
  type LucideIcon,
} from "lucide-react"

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
  sidebarHeader?: {
    icon: LucideIcon
  }
  versioned: boolean
  latestVersion?: string
  versions?: DocsVersion[]
  sidebarOrder?: DocsSidebarOrderItem[]
  hub: {
    description: string
    cards: {
      title: string
      description: string
      icon: LucideIcon
      docPath: string
    }[]
  }
}

export const DOCS_INSTANCES: DocsInstance[] = [
  {
    id: "railyard",
    label: "Railyard",
    basePath: "/railyard/docs",
    icon: TrainTrack,
    sidebarHeader: {
      icon: BookText,
    },
    versioned: true,
    latestVersion: "v0.1",
    versions: [
      {
        value: "v0.1",
        label: "v0.1",
        icon: Tag,
        sidebarOrder: [
          {
            key: "players",
            children: [
              "install-guide-windows",
              "install-guide-macos",
              "install-guide-linux",
              "github-token"
            ],
          },
          {
            key: "developers",
            children: [
              "publishing-projects",
              "using-custom-url",
              "data-quality"
            ],
          },
        ],
      },
    ],
    hub: {
      description: "All-in-one Map and Mod Manager for Subway Builder.",
      cards: [
        {
          title: "Players",
          description: "The ultimate guide for players to get started with Railyard, including installation and configuration.",
          icon: Users,
          docPath: "players",
        },
        {
          title: "Developers",
          description: "Learn exactly how to make your project compatible with Railyard and how to submit it to the registry.",
          icon: CodeXml,
          docPath: "developers",
        },
      ],
    },
  },
  {
    id: "template-mod",
    label: "Template Mod",
    basePath: "/template-mod/docs",
    icon: Package,
    sidebarHeader: {
      icon: BookText,
    },
    versioned: true,
    latestVersion: "v1.0",
    versions: [
      {
        value: "v1.0",
        label: "v1.0",
        icon: Tag,
        sidebarOrder: [
          "getting-started",
          "project-structure",
          "common-patterns",
          "react-components",
          "debugging",
          "type-reference",
        ],
      },
    ],
    hub: {
      description: "Find setup steps, project structure guidance, and API references for building Template Mod projects.",
      cards: [
        {
          title: "Getting Started",
          description: "Get started with the Subway Builder Modded Template Mod.",
          icon: Plus,
          docPath: "getting-started",
        },
        {
          title: "Project Structure",
          description: "Learn how to organize your project when creating a custom mod.",
          icon: Folder,
          docPath: "project-structure",
        },
        {
          title: "Common Patterns",
          description: "Learn about common patterns that may be useful.",
          icon: Link2,
          docPath: "common-patterns",
        },
        {
          title: "React Components",
          description: "Learn about the various React components that are available for you to use.",
          icon: Atom,
          docPath: "react-components",
        },
        {
          title: "Debugging",
          description: "Learn how to properly debug and test your mod.",
          icon: Bug,
          docPath: "debugging",
        },
        {
          title: "Type Reference",
          description: "Organization of the template's full TypeScript type definitions for the Subway Builder Modding API.",
          icon: SearchCode,
          docPath: "type-reference",
        },
      ],
    },
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
