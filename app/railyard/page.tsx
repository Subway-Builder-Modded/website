"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import type { LucideIcon } from "lucide-react"
import { ChevronDown, ArrowRight, Map as MapIcon, MapPlus, Settings, BrushCleaning, Package, CheckCircle, TrainTrack } from "lucide-react"

import { Card } from "@/components/ui/card"
import { LineBullet } from "@/components/ui/line-bullet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PROJECT_COLOR_SCHEMES } from "@/lib/color-schemes"
import { getGithubReleases } from "@/lib/railyard/github-releases"
import { cn } from "@/lib/utils"

// ─── Data ──────────────────────────────────────────────────────────────────


interface DownloadEntry {
  os: string
  arch: string
  label: string
  type: string
  size: string
  link: string
  assetName: string
}

type PlatformInfo = {
  os: DownloadEntry["os"]
  arch: DownloadEntry["arch"]
}

type FeatureItemBase = {
  id: string
  title: string
  desc: string
  bullets: string[]
}

type FeatureItem = FeatureItemBase & (
  | { letter: string; icon?: never }
  | { icon: LucideIcon; letter?: never }
)

const DOWNLOAD_TEMPLATE: DownloadEntry[] = [
  { os: "Windows", arch: "x64",       label: "Windows (x64) - Installer (beta)",   type: ".exe",      size: "—", link: "#", assetName: "windows-amd64-installer.exe" },
  { os: "Windows", arch: "x64",       label: "Windows (x64) - Portable (beta)",    type: ".zip",      size: "—", link: "#", assetName: "windows-amd64-portable.zip" },
  { os: "Windows", arch: "arm64",     label: "Windows (ARM64) - Installer (beta)", type: ".exe",      size: "—", link: "#", assetName: "windows-arm64-installer.exe" },
  { os: "Windows", arch: "arm64",     label: "Windows (ARM64) - Portable (beta)",  type: ".zip",      size: "—", link: "#", assetName: "windows-arm64-portable.zip" },
  { os: "macOS",   arch: "universal", label: "macOS - Universal (beta)",           type: ".dmg",      size: "—", link: "#", assetName: "macos-universal.dmg" },
  { os: "macOS",   arch: "universal", label: "macOS (ZIP) - Universal (beta)",     type: ".zip",      size: "—", link: "#", assetName: "macos-universal.zip" },
  { os: "Linux",   arch: "x64",       label: "Linux (x64) - (beta)",               type: ".flatpak",  size: "—", link: "#", assetName: "current-linux-amd64.flatpak" },
]

function formatBytes(bytes: number): string {
  if (bytes === 0) return "—"
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`
  return `${bytes} B`
}

function buildDownloads(releaseAssets: { name: string; browser_download_url: string; size: number }[]): DownloadEntry[] {
  return DOWNLOAD_TEMPLATE.map((entry) => {
    const asset = releaseAssets.find((a) => a.name.endsWith(entry.assetName))
    if (!asset) return entry
    return { ...entry, link: asset.browser_download_url, size: formatBytes(asset.size) }
  })
}

function getDownloadCatalog(downloads: DownloadEntry[]) {
  const byOS = new Map<string, DownloadEntry[]>()
  downloads.forEach((d) => {
    if (!byOS.has(d.os)) byOS.set(d.os, [])
    byOS.get(d.os)!.push(d)
  })
  return Array.from(byOS.entries()).map(([os, items]) => ({ os, downloads: items }))
}

function detectPlatform(): PlatformInfo {
  if (typeof navigator === "undefined") return { os: "Windows", arch: "x64" }

  const ua = navigator.userAgent.toLowerCase()
  const platform = navigator.platform.toLowerCase()
  const isArm = /arm|aarch64/.test(ua) || /arm|aarch64/.test(platform)

  if (ua.includes("mac")) return { os: "macOS", arch: "universal" }
  if (ua.includes("linux")) return { os: "Linux", arch: "x64" }
  return { os: "Windows", arch: isArm ? "arm64" : "x64" }
}

async function detectPlatformWithHints() {
  const fallback = detectPlatform()
  if (typeof navigator === "undefined") return fallback

  const navWithUAData = navigator as Navigator & {
    userAgentData?: {
      platform?: string
      architecture?: string
      getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string; platform?: string }>
    }
  }

  const uaData = navWithUAData.userAgentData
  if (!uaData) return fallback

  try {
    const highEntropy = uaData.getHighEntropyValues
      ? await uaData.getHighEntropyValues(["architecture", "platform"])
      : undefined

    const platform = (highEntropy?.platform ?? uaData.platform ?? "").toLowerCase()
    const architecture = (highEntropy?.architecture ?? uaData.architecture ?? "").toLowerCase()
    const isArm = /arm|aarch64/.test(architecture)

    if (platform.includes("mac")) return { os: "macOS", arch: "universal" as const }
    if (platform.includes("linux")) return { os: "Linux", arch: "x64" as const }
    if (platform.includes("win") || fallback.os === "Windows") {
      return { os: "Windows", arch: isArm ? "arm64" : fallback.arch }
    }
  } catch {
    return fallback
  }

  return fallback
}

function pickNativeDownload(downloads: DownloadEntry[], platform: PlatformInfo): DownloadEntry {
  return downloads.find((d) => d.os === platform.os && d.arch === platform.arch)
    ?? downloads.find((d) => d.os === platform.os)
    ?? downloads[0]
}

const FEATURES: FeatureItem[] = [
  {
    id: "maps",
    icon: MapPlus,
    title: "Custom Cities",
    desc: "Browse community-made maps of cities from around the world and install them at the press of a button.",
    bullets: [
      "Search and filter maps to find what you want.",
      "One-click installation — no manual file management.",
      "Stay up to date with the latest community creations.",
    ],
  },
  {
    id: "mods",
    icon: Package,
    title: "Mod Browser",
    desc: "Discover and install gameplay mods to enhance your Subway Builder experience.",
    bullets: [
      "Search and browse community-made mods.",
      "Install mods instantly with a single click.",
      "Spend more time playing, less time configuring.",
    ],
  },
  {
    id: "interface",
    icon: BrushCleaning,
    title: "Intuitive Interface",
    desc: "A clean, friendly UI designed to make managing your Subway Builder content effortless.",
    bullets: [
      "A clean, sleek UI that doesn't get in the way.",
      "Completely configurable, with extensive customization.",
      "Designed with accessibility and ease of use in mind.",
    ],
  },
  {
    id: "manage",
    icon: Settings,
    title: "Content Management",
    desc: "Manage your installed content and keep everything organized.",
    bullets: [
      "Easily track and manage your installed maps and mods.",
      "Keep your content organized with one-click uninstallation and updates.",
      "Never lose track of what you have installed or what's new in the community.",
    ],
  },
]

const WORKFLOW_STOPS = [
  { id: "find",    title: "Find",    desc: "Browse curated maps and mods from the community." },
  { id: "install", title: "Install", desc: "Choose what you want and install it quickly." },
  { id: "manage",  title: "Manage",  desc: "Enable or disable content anytime for each playthrough." },
]

const INDEX_BASE = "https://raw.githubusercontent.com/Subway-Builder-Modded/The-Railyard/refs/heads/main"
const RAILYARD_COLORS = PROJECT_COLOR_SCHEMES.railyard

// ─── Page ─────────────────────────────────────────────────────────────────

export default function RailyardPage() {
  const { scrollY } = useScroll()
  const heroScale = useTransform(scrollY, [0, 900], [1, 1.32])
  const heroY = useTransform(scrollY, [0, 900], [0, -140])

  const [menuOpen, setMenuOpen] = useState(false)
  const [downloads, setDownloads] = useState<DownloadEntry[]>(DOWNLOAD_TEMPLATE)
  const [mapCount, setMapCount] = useState<number | null>(null)
  const [modCount, setModCount] = useState<number | null>(null)
  const [activeFeature, setActiveFeature] = useState(FEATURES[0].id)
  const [activeStop, setActiveStop] = useState(WORKFLOW_STOPS[0].id)
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformInfo>(() => detectPlatform())
  const [selectedOS, setSelectedOS] = useState("Windows")
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const nativeDownload = useMemo(() => {
    if (!hasMounted) return downloads[0]
    return pickNativeDownload(downloads, detectedPlatform)
  }, [detectedPlatform, downloads, hasMounted])
  const downloadCatalog = useMemo(() => getDownloadCatalog(downloads), [downloads])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true
    void detectPlatformWithHints().then((platform) => {
      if (!isMounted) return
      setDetectedPlatform(platform)
      setSelectedOS(platform.os)
    })

    // Fetch latest release assets from cache-first GitHub source
    getGithubReleases("subway-builder-modded/railyard")
      .then((releases) => {
        const latest = releases[0]
        const assets = Array.isArray(latest?.assets) ? latest.assets : []
        setDownloads(buildDownloads(assets))
      })
      .catch(() => { /* keep template with # links */ })

    async function fetchCount(url: string, key: string, setValue: (n: number) => void) {
      try {
        const res = await fetch(url)
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data[key])) setValue(data[key].length)
        else if (Array.isArray(data)) setValue(data.length)
      } catch { /* ignore */ }
    }

    fetchCount(`${INDEX_BASE}/maps/index.json`, "maps", setMapCount)
    fetchCount(`${INDEX_BASE}/mods/index.json`, "mods", setModCount)

    const closeMenu = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", closeMenu)
    return () => {
      isMounted = false
      document.removeEventListener("mousedown", closeMenu)
    }
  }, [])

  const selectedDownloads = useMemo(
    () => downloads.filter((d) => d.os === selectedOS),
    [downloads, selectedOS]
  )

  const mapCountLabel = mapCount == null ? "—" : mapCount.toLocaleString()
  const modCountLabel = modCount == null ? "—" : modCount.toLocaleString()

  return (
    <main className="railyard-accent relative min-h-screen text-foreground">

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale, y: heroY }}
        >
          <Image
            src="/images/railyard/main-light.png"
            alt=""
            fill
            priority
            className="object-cover brightness-[1] saturate-[1] contrast-[1.08] dark:hidden"
          />
          <Image
            src="/images/railyard/main-dark.png"
            alt=""
            fill
            priority
            className="hidden object-cover brightness-[1] saturate-[1] contrast-[1.2] dark:block"
          />
        </motion.div>
        <div className="absolute inset-0 bg-white/45 dark:bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/50 via-white/20 to-transparent dark:from-black/55 dark:via-black/18 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/28 via-transparent to-background/22 dark:from-black/28 dark:to-background/65" />
      </div>

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 h-svh">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 flex h-full items-end px-[clamp(1.5rem,5vw,4rem)] pb-[max(env(safe-area-inset-bottom),clamp(3rem,12svh,8rem))]">
          <div className="w-full max-w-[min(92vw,48rem)]">
            {/* Title */}
            <h1 className="inline-flex items-center gap-4 -translate-y-1 text-[clamp(2.6rem,min(8vw,9svh),4.8rem)] font-black leading-[1] tracking-[-0.03em]">
              <TrainTrack aria-hidden="true" className="size-[0.72em]" />
              <span>Railyard</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px solid #d29922",
                  color: "#d29922",
                  borderRadius: "9999px",
                  padding: "0.18em 0.52em 0.28em",
                  fontSize: "0.42em",
                  fontWeight: 500,
                  lineHeight: "1",
                  letterSpacing: "normal",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Beta
              </span>
            </h1>

            <p className="mt-4 max-w-[27rem] text-pretty text-[clamp(1rem,min(2.2vw,2.4svh),1.2rem)] leading-[1.45] text-foreground">
              The easiest way to discover, install, and manage Subway Builder community content.
            </p>

            {/* Download button group */}
            <div ref={dropdownRef} className="relative mt-6 inline-flex z-[120]">
              <div className="inline-flex overflow-hidden rounded-lg shadow-md ring-1 ring-primary/35">
                <a
                  href={nativeDownload.link}
                  className={cn(
                    "inline-flex items-center px-5 py-2.5 text-sm font-semibold transition-colors",
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  Download for {nativeDownload.label}
                </a>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="More download options"
                  aria-expanded={menuOpen}
                  className={cn(
                    "flex w-9 items-center justify-center border-l border-primary/40 transition-colors",
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <ChevronDown
                    className={cn("h-4 w-4 transition-transform", menuOpen && "rotate-180")}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {menuOpen && (
                <div className="absolute left-0 top-full z-[130] mt-1.5 min-w-[320px] rounded-lg border border-border bg-popover py-1 shadow-lg ring-1 ring-foreground/10">
                  {downloads.map((dl) => (
                    <a
                      key={dl.label}
                      href={dl.link}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between gap-4 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <span>{dl.label}</span>
                      <span className="text-xs text-muted-foreground">{dl.type}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Stats strip */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/railyard/browse?type=maps"
                className="flex items-center gap-2.5 px-4 py-2 rounded-lg border border-border/70 bg-background/60 backdrop-blur-sm hover:bg-accent/60 transition-colors group"
              >
                <MapIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                <span>
                  <span className="text-base font-bold tabular-nums">{mapCountLabel}</span>
                  <span className="ml-1.5 text-sm text-muted-foreground">Maps Available</span>
                </span>
              </Link>
              <Link
                href="/railyard/browse?type=mods"
                className="flex items-center gap-2.5 px-4 py-2 rounded-lg border border-border/70 bg-background/60 backdrop-blur-sm hover:bg-accent/60 transition-colors group"
              >
                <Package className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                <span>
                  <span className="text-base font-bold tabular-nums">{modCountLabel}</span>
                  <span className="ml-1.5 text-sm text-muted-foreground">Mods Available</span>
                </span>
              </Link>
              <a
                href="https://discord.gg/syG9YHMyeG"
                target="_blank"
                rel="noreferrer"
                aria-label="Join the Subway Builder Modded Discord"
                className="flex size-10 items-center justify-center rounded-lg border border-border/70 bg-background/60 backdrop-blur-sm hover:bg-accent/60 transition-colors group"
              >
                <Image
                  src="/assets/discord.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-5 dark:invert"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────── */}
      <section className="relative z-10 px-[clamp(1.5rem,5vw,4rem)]">
        <div className="mx-auto max-w-screen-xl rounded-2xl border border-border/80 bg-background/88 px-[clamp(1.25rem,4vw,2.5rem)] py-20 shadow-sm backdrop-blur-md">
        <div className="max-w-screen-lg mx-auto">
          <SectionHeader title="Features" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => {
              const active = activeFeature === feature.id
              return (
                <Card
                  key={feature.id}
                  className={cn(
                    "relative overflow-hidden cursor-pointer transition-all duration-200 outline-none p-6",
                    "border border-border hover:border-border/70",
                    active && "border-primary/50 shadow-md ring-1 ring-primary/25"
                  )}
                  onMouseEnter={() => setActiveFeature(feature.id)}
                  onFocus={() => setActiveFeature(feature.id)}
                  tabIndex={0}
                  role="article"
                >
                  <div className="flex items-start gap-4">
                    <LineBullet
                      bullet={feature.icon ? <feature.icon className="size-4" aria-hidden="true" /> : feature.letter}
                      color={RAILYARD_COLORS.primaryHex.light}
                      darkColor={RAILYARD_COLORS.primaryHex.dark}
                      textColor={RAILYARD_COLORS.textHex.light}
                      darkTextColor={RAILYARD_COLORS.textHex.dark}
                      shape="circle"
                      size="md"
                      className="shrink-0 mt-0.5"
                    />
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                      <ul className="mt-3 space-y-1.5">
                        {feature.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── Workflow ──────────────────────────────────────────────────── */}
      <section className="relative z-10 px-[clamp(1.5rem,5vw,4rem)]">
        <div className="mx-auto max-w-screen-xl rounded-2xl border border-border/80 bg-background/88 px-[clamp(1.25rem,4vw,2.5rem)] py-20 shadow-sm backdrop-blur-md">
        <div className="max-w-screen-lg mx-auto">
          <SectionHeader title="From Download to Play in Three Stops" />
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {WORKFLOW_STOPS.map((stop, idx) => {
              const active = activeStop === stop.id
              return (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => setActiveStop(stop.id)}
                  onMouseEnter={() => setActiveStop(stop.id)}
                  onFocus={() => setActiveStop(stop.id)}
                  className={cn(
                    "flex h-full flex-col text-left p-5 rounded-xl border transition-all duration-200 outline-none",
                    active
                      ? "border-primary/50 bg-primary/5 shadow-md ring-1 ring-primary/25"
                      : "border-border hover:border-border/80 hover:bg-accent/40"
                  )}
                >
                  <div className="mb-2 flex min-h-7 items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold transition-colors",
                        "bg-[var(--railyard-bullet-bg-light)] text-[var(--railyard-bullet-fg-light)]",
                        "dark:bg-[var(--railyard-bullet-bg-dark)] dark:text-[var(--railyard-bullet-fg-dark)]",
                        active
                          ? "ring-1 ring-primary/35"
                          : "opacity-85"
                      )}
                      style={{
                        ["--railyard-bullet-bg-light" as string]: RAILYARD_COLORS.primaryHex.light,
                        ["--railyard-bullet-bg-dark" as string]: RAILYARD_COLORS.primaryHex.dark,
                        ["--railyard-bullet-fg-light" as string]: RAILYARD_COLORS.textHex.light,
                        ["--railyard-bullet-fg-dark" as string]: RAILYARD_COLORS.textHex.dark,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <h3 className="font-semibold text-foreground">{stop.title}</h3>
                  </div>
                  <p className="pt-0.5 text-sm text-muted-foreground leading-relaxed">{stop.desc}</p>
                </button>
              )
            })}
          </div>
        </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── Community ─────────────────────────────────────────────────── */}
      <section className="relative z-10 px-[clamp(1.5rem,5vw,4rem)]">
        <div className="mx-auto max-w-screen-xl rounded-2xl border border-border/80 bg-background/88 px-[clamp(1.25rem,4vw,2.5rem)] py-20 shadow-sm backdrop-blur-md">
          <div className="max-w-screen-lg mx-auto">
            <SectionHeader title="Join the Community" />
            <div className="mt-8 max-w-2xl">
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Talk with other players, get support, and stay up to date on new Railyard sneak peeks and updates from the dev team.
              </p>
              <a
                href="https://discord.gg/syG9YHMyeG"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-md ring-1 ring-primary/35 transition-colors",
                  "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Image src="/assets/discord.svg" alt="" width={18} height={18} className="size-[18px] invert dark:invert-0" aria-hidden="true" />
                <span>Join the Discord</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── All Downloads ─────────────────────────────────────────────── */}
      <section className="relative z-10 px-[clamp(1.5rem,5vw,4rem)] pb-24" id="all-downloads">
        <div className="mx-auto max-w-screen-xl rounded-2xl border border-border/80 bg-background/88 px-[clamp(1.25rem,4vw,2.5rem)] py-20 shadow-sm backdrop-blur-md">
        <div className="max-w-screen-lg mx-auto">
          <SectionHeader title="All Downloads" />

          <div className="mt-10 rounded-xl border border-border overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* OS tabs (left) */}
              <div className="sm:w-44 shrink-0 border-b sm:border-b-0 sm:border-r border-border bg-muted/30">
                {downloadCatalog.map((group) => (
                  <button
                    key={group.os}
                    type="button"
                    onClick={() => setSelectedOS(group.os)}
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm font-medium transition-colors",
                      selectedOS === group.os
                        ? "bg-background text-foreground border-r-2 border-primary sm:border-r-2 -mr-px"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    {group.os}
                  </button>
                ))}
              </div>

              {/* Download buttons (right) */}
              <div className="flex-1 p-4 space-y-2 bg-background">
                {selectedDownloads.map((dl) => {
                  const isNative = dl.label === nativeDownload.label
                  return (
                    <a
                      key={dl.label}
                      href={dl.link}
                      className={cn(
                        "flex items-center justify-between gap-4 px-4 py-3 rounded-lg border transition-all group",
                        isNative
                          ? "border-primary/50 bg-primary/5 hover:bg-primary/10"
                          : "border-border hover:border-border/80 hover:bg-accent/40"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-medium text-sm text-foreground">{dl.label}</span>
                        {isNative && (
                          <Badge variant="secondary" className="text-xs h-auto px-1.5 py-0">
                            Detected
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {dl.type} · {dl.size}
                        </span>
                      </div>
                      <ArrowRight
                        className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-foreground transition-all shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        </div>

      </section>
    </main>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

function SectionDivider() {
  return (
    <div className="relative z-10 px-[clamp(1.5rem,5vw,4rem)] py-10" aria-hidden="true">
      <div className="mx-auto max-w-screen-xl">
        <Separator className="bg-border/90" />
      </div>
    </div>
  )
}
