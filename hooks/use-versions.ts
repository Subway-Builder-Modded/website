"use client"

import { useState, useEffect } from "react"
import { getCustomVersions, getGithubReleases } from "@/lib/railyard/github-releases"
import type { UpdateConfig, VersionInfo } from "@/types/registry"

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
          const releases = await getGithubReleases(currentUpdate.repo)

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
          const parsed: VersionInfo[] = await getCustomVersions(currentUpdate.url)

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
