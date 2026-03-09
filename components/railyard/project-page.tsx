"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ExternalLink, Download, Users, ChevronLeft, ChevronRight, X, ArrowDownToLine } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { GalleryImage } from "@/components/railyard/gallery-image"
import { useRegistryItem } from "@/hooks/use-registry-item"
import { useVersions } from "@/hooks/use-versions"
import type { MapManifest, ModManifest } from "@/types/registry"

interface ProjectPageProps {
  type: "mods" | "maps"
  id: string
}

function isMapManifest(item: ModManifest | MapManifest): item is MapManifest {
  return "city_code" in item
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return dateString
  }
}

function formatDownloads(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return count.toLocaleString()
}

export function ProjectPage({ type, id }: ProjectPageProps) {
  const { item, loading: itemLoading, error: itemError } = useRegistryItem(type, id)
  const { versions, loading: versionsLoading, error: versionsError } = useVersions(item?.update)

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  const searchParams = useSearchParams()
  const from = searchParams.get("from")
  const browseHref = useMemo(() => {
    if (!from) return "/railyard/browse"
    const decoded = decodeURIComponent(from)
    return decoded.startsWith("/railyard/browse") ? decoded : "/railyard/browse"
  }, [from])
  const browseLabel = "Browse"
  const isMap = item ? isMapManifest(item) : false
  const mapItem = item as MapManifest | null

  const galleryImages = item?.gallery ?? []
  const hasGameVersion = versions.some((v) => v.game_version)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null
    )
  }, [galleryImages.length])

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % galleryImages.length : null
    )
  }, [galleryImages.length])

  // Loading state
  if (itemLoading) {
    return (
      <main className="px-6 py-8 max-w-screen-xl mx-auto">
        <Skeleton className="h-5 w-64 mb-6" />
        <Skeleton className="h-48 w-full rounded-lg mb-8" />
        <Skeleton className="h-8 w-72 mb-3" />
        <Skeleton className="h-4 w-48 mb-6" />
        <Skeleton className="h-24 w-full mb-8" />
        <Separator />
        <Skeleton className="h-6 w-32 mt-8 mb-4" />
        <Skeleton className="h-40 w-full" />
      </main>
    )
  }

  // Error state
  if (itemError || !item) {
    return (
      <main className="px-6 py-8 max-w-screen-xl mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/railyard">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={browseHref}>{browseLabel}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-foreground">
            {itemError ?? "Item not found"}
          </p>
          <Link
            href={browseHref}
            className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to {browseLabel}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="px-6 py-8 max-w-screen-xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/railyard">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={browseHref}>{browseLabel}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{item.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Gallery hero */}
      {galleryImages.length > 0 && (
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
            {galleryImages.map((imagePath, index) => (
              <button
                key={imagePath}
                type="button"
                onClick={() => openLightbox(index)}
                className={cn(
                  "shrink-0 rounded-lg overflow-hidden border border-border hover:border-foreground/20 transition-all cursor-pointer",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  galleryImages.length === 1 ? "w-full max-h-80" : "w-64 h-40 sm:w-80 sm:h-48"
                )}
              >
                <GalleryImage
                  type={type}
                  id={id}
                  imagePath={imagePath}
                  className={cn(
                    "object-cover",
                    galleryImages.length === 1
                      ? "w-full max-h-80"
                      : "w-64 h-40 sm:w-80 sm:h-48"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Project info */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{item.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">by {item.author}</p>
          </div>

          {isMap && mapItem && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {mapItem.city_code && (
                <span className="font-mono font-bold text-foreground text-base">
                  {mapItem.city_code}
                </span>
              )}
              {mapItem.country && <span>{mapItem.country}</span>}
              {(mapItem.population ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  Pop. {mapItem.population!.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-prose prose prose-sm dark:prose-invert prose-p:my-2 prose-a:text-foreground prose-a:underline">
          <Markdown
            rehypePlugins={[rehypeRaw]}
            components={{
              a: ({ href, children, ...props }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              ),
            }}
          >
            {item.description}
          </Markdown>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Source link */}
        {item.source && (
          <a
            href={item.source}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            )}
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            View Source
          </a>
        )}
      </div>

      <Separator />

      {/* Versions table */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Versions</h2>

        {versionsLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : versionsError ? (
          <p className="text-sm text-muted-foreground">{versionsError}</p>
        ) : versions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No versions available.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Date</TableHead>
                {hasGameVersion && <TableHead>Game Version</TableHead>}
                <TableHead className="hidden sm:table-cell">Changelog</TableHead>
                <TableHead className="text-right">Downloads</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.map((version) => (
                <TableRow key={version.version}>
                  <TableCell>
                    <span className="font-medium text-foreground">
                      {version.version}
                    </span>
                    {version.prerelease && (
                      <Badge
                        className="ml-2 shrink-0 rounded-full border bg-transparent font-medium tracking-normal text-xs h-auto px-1.5 py-0"
                        style={{ borderColor: "#d29922", color: "#d29922" }}
                      >
                        Beta
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(version.date)}
                  </TableCell>
                  {hasGameVersion && (
                    <TableCell className="text-muted-foreground">
                      {version.game_version || "\u2014"}
                    </TableCell>
                  )}
                  <TableCell className="hidden sm:table-cell text-muted-foreground max-w-xs truncate">
                    {version.changelog
                      ? version.changelog.split("\n")[0].slice(0, 120)
                      : "\u2014"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground tabular-nums">
                    {formatDownloads(version.downloads)}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowInstallPrompt(true)}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label={`Install ${version.version}`}
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Install prompt modal */}
      {showInstallPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowInstallPrompt(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Download Railyard"
        >
          <div
            className="bg-card border border-border rounded-xl p-6 max-w-sm mx-4 text-center shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <ArrowDownToLine className="h-10 w-10 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Download Railyard to install this {type === "mods" ? "mod" : "map"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Railyard is a free desktop app that lets you browse, install, and manage Subway Builder content.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowInstallPrompt(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg border border-border"
              >
                Cancel
              </button>
              <Link
                href="/railyard#all-downloads"
                className="px-4 py-2 text-sm bg-foreground text-background font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Railyard
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox overlay */}
      {lightboxIndex !== null && galleryImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Previous button */}
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <GalleryImage
              type={type}
              id={id}
              imagePath={galleryImages[lightboxIndex]}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>

          {/* Next button */}
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Image counter */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70 bg-black/50 px-3 py-1 rounded-full">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
