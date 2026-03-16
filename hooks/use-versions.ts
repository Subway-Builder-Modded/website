"use client"

import { useState, useEffect } from "react"
import type { UpdateConfig, VersionInfo } from "@/types/registry"

interface GithubAsset {
  name: string
  browser_download_url: string
  download_count: number
}

interface GithubRelease {
  tag_name: string
  name: string
  body: string
  published_at: string
  prerelease: boolean
  assets: GithubAsset[]
}

interface UseVersionsResult {
  versions: VersionInfo[]
  loading: boolean
  error: string | null
}

export function useVersions(update?: UpdateConfig): UseVersionsResult {
  const [versions, setVersions] = useState<VersionInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const currentUpdate = update

    if (!currentUpdate) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      if (!currentUpdate) {
        if (!cancelled) setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        if (currentUpdate.type === "github" && currentUpdate.repo) {
          const res = await fetch(
            `https://api.github.com/repos/${currentUpdate.repo}/releases`
          )
          if (!res.ok) throw new Error("Failed to fetch GitHub releases")
          const releases: GithubRelease[] = await res.json()

          const mapped: VersionInfo[] = releases.map((release) => {
            const manifestAsset = release.assets.find((a) =>
              a.name === "manifest.json"
            )
            const zipAsset = release.assets.find((a) =>
              a.name.endsWith(".zip")
            )
            const totalDownloads = release.assets.reduce(
              (sum, a) => sum + a.download_count,
              0
            )

            return {
              version: release.tag_name,
              name: release.name || release.tag_name,
              changelog: release.body || "",
              date: release.published_at,
              download_url: zipAsset?.browser_download_url ?? "",
              game_version: "",
              sha256: "",
              downloads: totalDownloads,
              manifest: manifestAsset?.browser_download_url,
              prerelease: release.prerelease,
            }
          })

          if (!cancelled) setVersions(mapped)
        } else if (currentUpdate.url) {
          const res = await fetch(currentUpdate.url)
          if (!res.ok) throw new Error("Failed to fetch version info")
          const data = await res.json()

          const rawVersions = Array.isArray(data)
            ? data
            : Array.isArray((data as { versions?: unknown[] })?.versions)
              ? (data as { versions: unknown[] }).versions
              : []

          const parsed: VersionInfo[] = rawVersions
            .map((entry) => (entry ?? {}) as Record<string, unknown>)
            .map((entry: Record<string, unknown>) => ({
                version: (entry.version as string) ?? "",
                name: (entry.name as string) ?? (entry.version as string) ?? "",
                changelog: (entry.changelog as string) ?? "",
                date: (entry.date as string) ?? "",
                download_url: (entry.download_url as string) ?? "",
                game_version: (entry.game_version as string) ?? "",
                sha256: (entry.sha256 as string) ?? "",
                downloads: (entry.downloads as number) ?? 0,
                manifest: entry.manifest as string | undefined,
                prerelease: (entry.prerelease as boolean) ?? false,
              }))

          if (!cancelled) setVersions(parsed)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load versions")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [update])

  return { versions, loading, error }
}
