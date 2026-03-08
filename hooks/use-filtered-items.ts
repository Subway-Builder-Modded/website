"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import type { ModManifest, MapManifest, TaggedItem } from "@/types/registry"

export type { TaggedItem }

export type TypeFilter = "all" | "mods" | "maps"
export type PerPage = 12 | 24 | 48
export type SortOption = "name-asc" | "name-desc" | "author-asc" | "population-desc"

export const PER_PAGE_OPTIONS: PerPage[] = [12, 24, 48]

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "author-asc", label: "Author A–Z" },
  { value: "population-desc", label: "Population" },
]

interface UseFilteredItemsParams {
  mods: ModManifest[]
  maps: MapManifest[]
  initialType?: TypeFilter
}

function matchesQuery(item: TaggedItem, query: string): boolean {
  const q = query.toLowerCase()
  const base = item.item
  if (base.name?.toLowerCase().includes(q)) return true
  if (base.author?.toLowerCase().includes(q)) return true
  if (base.description?.toLowerCase().includes(q)) return true
  if (base.tags?.some((t) => t.toLowerCase().includes(q))) return true
  if (item.type === "maps") {
    const map = item.item as MapManifest
    if (map.city_code?.toLowerCase().includes(q)) return true
    if (map.country?.toLowerCase().includes(q)) return true
  }
  return false
}

function matchesTags(item: TaggedItem, selectedTags: string[]): boolean {
  if (selectedTags.length === 0) return true
  const tags = item.item.tags
  if (!tags || tags.length === 0) return false
  return selectedTags.some((t) => tags.includes(t))
}

function compareItems(a: TaggedItem, b: TaggedItem, sort: SortOption): number {
  switch (sort) {
    case "name-asc":
      return (a.item.name ?? "").localeCompare(b.item.name ?? "")
    case "name-desc":
      return (b.item.name ?? "").localeCompare(a.item.name ?? "")
    case "author-asc":
      return (a.item.author ?? "").localeCompare(b.item.author ?? "")
    case "population-desc": {
      const popA = a.type === "maps" ? ((a.item as MapManifest).population ?? 0) : -1
      const popB = b.type === "maps" ? ((b.item as MapManifest).population ?? 0) : -1
      return popB - popA
    }
    default:
      return 0
  }
}

export function useFilteredItems({ mods, maps, initialType = "all" }: UseFilteredItemsParams) {
  const [query, setQuery] = useState("")
  const [type, setType] = useState<TypeFilter>(initialType)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>("name-asc")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState<PerPage>(12)

  const prevFiltersRef = useRef({ query, type, selectedTags, sort, perPage })
  useEffect(() => {
    const prev = prevFiltersRef.current
    if (
      prev.query !== query ||
      prev.type !== type ||
      prev.selectedTags !== selectedTags ||
      prev.sort !== sort ||
      prev.perPage !== perPage
    ) {
      setPage(1)
      prevFiltersRef.current = { query, type, selectedTags, sort, perPage }
    }
  }, [query, type, selectedTags, sort, perPage])

  const allItems = useMemo<TaggedItem[]>(() => {
    const modItems: TaggedItem[] = (mods || []).map((m) => ({ type: "mods" as const, item: m }))
    const mapItems: TaggedItem[] = (maps || []).map((m) => ({ type: "maps" as const, item: m }))
    return [...modItems, ...mapItems]
  }, [mods, maps])

  const filtered = useMemo(() => {
    let result = allItems
    if (type !== "all") {
      result = result.filter((i) => i.type === type)
    }
    if (query.trim()) {
      result = result.filter((i) => matchesQuery(i, query.trim()))
    }
    if (selectedTags.length > 0) {
      result = result.filter((i) => matchesTags(i, selectedTags))
    }
    result = [...result].sort((a, b) => compareItems(a, b, sort))
    return result
  }, [allItems, query, type, selectedTags, sort])

  const totalResults = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage))

  const items = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  const stableSetQuery = useCallback((v: string) => setQuery(v), [])
  const stableSetType = useCallback((v: TypeFilter) => setType(v), [])
  const stableSetSelectedTags = useCallback((v: string[]) => setSelectedTags(v), [])
  const stableSetSort = useCallback((v: SortOption) => setSort(v), [])
  const stableSetPage = useCallback((v: number) => setPage(v), [])
  const stableSetPerPage = useCallback((v: PerPage) => setPerPage(v), [])

  return {
    items,
    page,
    totalPages,
    totalResults,
    query,
    type,
    selectedTags,
    sort,
    perPage,
    setQuery: stableSetQuery,
    setType: stableSetType,
    setSelectedTags: stableSetSelectedTags,
    setSort: stableSetSort,
    setPage: stableSetPage,
    setPerPage: stableSetPerPage,
  }
}
