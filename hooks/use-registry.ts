"use client"

import { useState, useEffect } from "react"
import { toCumulativeDownloadTotals } from "@/lib/railyard/download-totals"
import type {
  AssetDownloadCountsByVersion,
  ModManifest,
  MapManifest,
  RegistryIntegrityReport,
} from "@/types/registry"

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

async function fetchIntegrity(type: "mods" | "maps"): Promise<RegistryIntegrityReport> {
  const res = await fetch(`${BASE_URL}/${type}/integrity.json`)
  if (!res.ok) throw new Error(`Failed to fetch ${type} integrity`)
  return res.json()
}

async function fetchDownloadCounts(type: "mods" | "maps"): Promise<AssetDownloadCountsByVersion> {
  const res = await fetch(`${BASE_URL}/${type}/downloads.json`)
  if (!res.ok) throw new Error(`Failed to fetch ${type} download counts`)
  return res.json()
}

interface RegistryState {
  mods: ModManifest[]
  maps: MapManifest[]
  modIntegrity: RegistryIntegrityReport | null
  mapIntegrity: RegistryIntegrityReport | null
  modDownloadTotals: Record<string, number>
  mapDownloadTotals: Record<string, number>
  loading: boolean
  error: string | null
}

export function useRegistry(): RegistryState {
  const [mods, setMods] = useState<ModManifest[]>([])
  const [maps, setMaps] = useState<MapManifest[]>([])
  const [modIntegrity, setModIntegrity] = useState<RegistryIntegrityReport | null>(null)
  const [mapIntegrity, setMapIntegrity] = useState<RegistryIntegrityReport | null>(null)
  const [modDownloadTotals, setModDownloadTotals] = useState<Record<string, number>>({})
  const [mapDownloadTotals, setMapDownloadTotals] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const [modIds, mapIds, modsIntegrity, mapsIntegrity, modCounts, mapCounts] = await Promise.all([
          fetchIndex("mods"),
          fetchIndex("maps"),
          fetchIntegrity("mods"),
          fetchIntegrity("maps"),
          fetchDownloadCounts("mods").catch(() => ({})),
          fetchDownloadCounts("maps").catch(() => ({})),
        ])

        const [fetchedMods, fetchedMaps] = await Promise.all([
          Promise.all(modIds.map((id) => fetchManifest<ModManifest>("mods", id))),
          Promise.all(mapIds.map((id) => fetchManifest<MapManifest>("maps", id))),
        ])

        const filteredMods = fetchedMods.filter(
          (manifest) => modsIntegrity.listings?.[manifest.id]?.has_complete_version
        )
        const filteredMaps = fetchedMaps.filter(
          (manifest) => mapsIntegrity.listings?.[manifest.id]?.has_complete_version
        )

        if (!cancelled) {
          setMods(filteredMods)
          setMaps(filteredMaps)
          setModIntegrity(modsIntegrity)
          setMapIntegrity(mapsIntegrity)
          setModDownloadTotals(toCumulativeDownloadTotals(modCounts))
          setMapDownloadTotals(toCumulativeDownloadTotals(mapCounts))
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

  return {
    mods,
    maps,
    modIntegrity,
    mapIntegrity,
    modDownloadTotals,
    mapDownloadTotals,
    loading,
    error,
  }
}

export function buildGalleryUrl(type: "mods" | "maps", id: string, imagePath: string): string {
  return `${BASE_URL}/${type}/${id}/${imagePath}`
}

export function buildGalleryCdnUrl(type: "mods" | "maps", id: string, imagePath: string): string {
  return `https://cdn.jsdelivr.net/gh/Subway-Builder-Modded/The-Railyard@main/${type}/${id}/${imagePath}`
}
