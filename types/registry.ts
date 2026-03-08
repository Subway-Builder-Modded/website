export interface UpdateConfig {
  type?: string
  repo?: string
  url?: string
}

export interface ModManifest {
  schema_version?: number
  id: string
  name: string
  author: string
  github_id?: number
  description: string
  tags?: string[]
  gallery?: string[]
  source?: string
  update?: UpdateConfig
}

export interface MapManifest extends ModManifest {
  city_code?: string
  country?: string
  population?: number
}

export type RegistryItemType = "mods" | "maps"

export type TaggedItem =
  | { type: "mods"; item: ModManifest }
  | { type: "maps"; item: MapManifest }
