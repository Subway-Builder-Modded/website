"use client"

import { useState, useEffect } from "react"
import type { ModManifest, MapManifest } from "@/types/registry"

const BASE_URL = "https://raw.githubusercontent.com/Subway-Builder-Modded/The-Railyard/main"

async function fetchIndex(type: "mods" | "maps"): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/${type}/index.json`)
  if (!res.ok) throw new Error(`Failed to fetch ${type} index`)
  const data = await res.json()
  return Array.isArray(data[type]) ? data[type] : []
}

async function fetchManifest<T>(type: "mods" | "maps", id: string): Promise<T> {
  const res = await fetch(`${BASE_URL}/${type}/${id}/manifest.json`)
  if (!res.ok) throw new Error(`Failed to fetch manifest for ${type}/${id}`)
  return res.json()
}

interface RegistryState {
  mods: ModManifest[]
  maps: MapManifest[]
  loading: boolean
  error: string | null
}

export function useRegistry(): RegistryState {
  const [mods, setMods] = useState<ModManifest[]>([])
  const [maps, setMaps] = useState<MapManifest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const [modIds, mapIds] = await Promise.all([
          fetchIndex("mods"),
          fetchIndex("maps"),
        ])

        const [fetchedMods, fetchedMaps] = await Promise.all([
          Promise.all(modIds.map((id) => fetchManifest<ModManifest>("mods", id))),
          Promise.all(mapIds.map((id) => fetchManifest<MapManifest>("maps", id))),
        ])

        if (!cancelled) {
          setMods(fetchedMods)
          setMaps(fetchedMaps)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load registry")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { mods, maps, loading, error }
}

export function buildGalleryUrl(type: "mods" | "maps", id: string, imagePath: string): string {
  return `${BASE_URL}/${type}/${id}/${imagePath}`
}

export function buildGalleryCdnUrl(type: "mods" | "maps", id: string, imagePath: string): string {
  return `https://cdn.jsdelivr.net/gh/Subway-Builder-Modded/The-Railyard@main/${type}/${id}/${imagePath}`
}
