"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { ChevronDown, ArrowRight, Map as MapIcon, Package, CheckCircle } from "lucide-react"
import type { Metadata } from "next"

import { Card } from "@/components/ui/card"
import { LineBullet } from "@/components/ui/line-bullet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// ─── Data ──────────────────────────────────────────────────────────────────

const SUBWAY_BARS = ["#0039A6", "#FF6319", "#00933C", "#FCCC0A", "#752F82"]

const ALL_DOWNLOADS = [
  { os: "Windows", arch: "x64",   label: "Windows (x64)",           type: ".zip",      size: "—", link: "#" },
  { os: "Windows", arch: "arm64", label: "Windows (arm64)",          type: ".zip",      size: "—", link: "#" },
  { os: "macOS",   arch: "arm64", label: "macOS (Apple Silicon)",    type: ".dmg",      size: "—", link: "#" },
  { os: "macOS",   arch: "x64",   label: "macOS (Intel)",            type: ".dmg",      size: "—", link: "#" },
  { os: "Linux",   arch: "x64",   label: "Linux (x64)",              type: ".AppImage", size: "—", link: "#" },
  { os: "Linux",   arch: "arm64", label: "Linux (arm64)",            type: ".AppImage", size: "—", link: "#" },
]

function getDownloadCatalog() {
  const byOS = new Map<string, typeof ALL_DOWNLOADS>()
  ALL_DOWNLOADS.forEach((d) => {
    if (!byOS.has(d.os)) byOS.set(d.os, [])
    byOS.get(d.os)!.push(d)
  })
  return Array.from(byOS.entries()).map(([os, downloads]) => ({ os, downloads }))
}

async function detectNativeDownload() {
  if (typeof navigator === "undefined") return ALL_DOWNLOADS[0]
  const ua = navigator.userAgent.toLowerCase()
  let os = "Windows"
  let arch = "x64"
  if (ua.includes("mac")) os = "macOS"
  else if (ua.includes("linux")) os = "Linux"
  try {
    if ((navigator as any).userAgentData?.getHighEntropyValues) {
      const hints = await (navigator as any).userAgentData.getHighEntropyValues(["architecture"])
      if (hints.architecture === "arm") arch = "arm64"
    } else if (ua.includes("arm64") || ua.includes("aarch64")) {
      arch = "arm64"
    }
  } catch { /* ignore */ }
  return ALL_DOWNLOADS.find((d) => d.os === os && d.arch === arch)
    ?? ALL_DOWNLOADS.find((d) => d.os === os)
    ?? ALL_DOWNLOADS[0]
}

const FEATURES = [
  {
    id: "browse",
    letter: "C",
    color: "#1335A1",
    textColor: "#FFFFFF",
    title: "Custom Cities",
    desc: "Browse hundreds of community-made maps of cities from around the world.",
    bullets: [
      "Find maps by size, data, and region.",
      "Sort and toggle your maps easily.",
      "Install directly from one polished experience.",
    ],
  },
  {
    id: "install",
    letter: "M",
    color: "#93683A",
    textColor: "#FFFFFF",
    title: "Mod Browser",
    desc: "From adding 500+ new trains to seeing detailed demand data by region, there's a mod for anything you desire.",
    bullets: [
      "Browse and add gameplay mods quickly.",
      "Keep your favorites organized in one place.",
      "Spend more time playing, less time configuring.",
    ],
  },
  {
    id: "manage",
    letter: "S",
    color: "#F5CF46",
    textColor: "#000000",
    title: "Simple Installation",
    desc: "No more messing around with your file manager. Click download and let Railyard do the rest.",
    bullets: [
      "No manual folder juggling.",
      "Smooth onboarding for new players.",
      "Cleaner setup with fewer errors.",
    ],
  },
  {
    id: "updates",
    letter: "F",
    color: "#ED6D32",
    textColor: "#FFFFFF",
    title: "Fast and Easy Management",
    desc: "Want to test a mod or disable something for a specific playthrough? Toggle it on or off with one click.",
    bullets: [
      "Toggle content instantly for each run.",
      "Try new combinations without risk.",
      "Keep stable setups ready whenever you want.",
    ],
  },
]

const WORKFLOW_STOPS = [
  { id: "find",    title: "Find",    desc: "Browse curated maps and mods from the community." },
  { id: "install", title: "Install", desc: "Choose what you want and install it quickly." },
  { id: "manage",  title: "Manage",  desc: "Enable or disable content anytime for each playthrough." },
]

const INDEX_BASE = "https://raw.githubusercontent.com/Subway-Builder-Modded/The-Railyard/refs/heads/main"

// ─── Page ─────────────────────────────────────────────────────────────────

export default function RailyardPage() {
  const heroRef = useRef<HTMLElement | null>(null)
  const { scrollY } = useScroll()
  const heroScale = useTransform(scrollY, [0, 900], [1, 1.32])
  const heroY = useTransform(scrollY, [0, 900], [0, -140])
  const { scrollYProgress: heroExitProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroContentOpacity = useTransform(heroExitProgress, [0.22, 0.42], [1, 0])
  const heroContentY = useTransform(heroExitProgress, [0.22, 0.42], [0, 24])

  const [menuOpen, setMenuOpen] = useState(false)
  const [nativeDownload, setNativeDownload] = useState(ALL_DOWNLOADS[0])
  const [mapCount, setMapCount] = useState<number | null>(null)
  const [modCount, setModCount] = useState<number | null>(null)
  const [activeFeature, setActiveFeature] = useState(FEATURES[0].id)
  const [activeStop, setActiveStop] = useState(WORKFLOW_STOPS[0].id)
  const [selectedOS, setSelectedOS] = useState("Windows")

  const downloadCatalog = useMemo(() => getDownloadCatalog(), [])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    detectNativeDownload().then((d) => {
      setNativeDownload(d)
      setSelectedOS(d.os)
    })

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
    return () => document.removeEventListener("mousedown", closeMenu)
  }, [])

  const selectedDownloads = useMemo(
    () => ALL_DOWNLOADS.filter((d) => d.os === selectedOS),
    [selectedOS]
  )

  const mapCountLabel = mapCount == null ? "—" : mapCount.toLocaleString()
  const modCountLabel = modCount == null ? "—" : modCount.toLocaleString()

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-svh overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale, y: heroY }}
          aria-hidden="true"
        >
          <Image
            src="/images/home/light.png"
            alt=""
            fill
            priority
            className="object-cover dark:hidden"
          />
          <Image
            src="/images/home/dark.png"
            alt=""
            fill
            priority
            className="hidden object-cover dark:block"
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-white/12 dark:bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 flex h-full items-end px-[clamp(1.5rem,5vw,4rem)] pb-[max(env(safe-area-inset-bottom),clamp(3rem,12svh,8rem))]">
          <motion.div
            style={{ opacity: heroContentOpacity, y: heroContentY }}
            className="w-full max-w-[min(92vw,44rem)]"
          >
            {/* Title */}
            <h1 className="text-[clamp(3rem,min(10vw,12svh),7rem)] font-black leading-[0.9] tracking-[-0.04em]">
              Railyard
            </h1>

            <p className="mt-3 max-w-[30rem] text-pretty text-[clamp(1rem,min(2.2vw,2.4svh),1.2rem)] leading-[1.45] text-muted-foreground">
              The easiest way to discover, install, and manage Subway Builder community content.
            </p>

            {/* Download button group */}
            <div ref={dropdownRef} className="mt-6 relative flex items-center gap-0">
              <a
                href={nativeDownload.link}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-l-lg text-sm font-semibold transition-all",
                  "bg-emerald-500 text-white hover:bg-emerald-400",
                  "shadow-[0_0_16px_rgba(16,185,129,0.4)]"
                )}
              >
                Download for {nativeDownload.os === "macOS" ? nativeDownload.label.replace("macOS ", "") === "Apple Silicon" ? "macOS" : "macOS" : nativeDownload.os}
              </a>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="More download options"
                aria-expanded={menuOpen}
                className={cn(
                  "flex items-center justify-center w-9 h-full min-h-[2.625rem] rounded-r-lg border-l border-emerald-400/50 transition-all",
                  "bg-emerald-500 text-white hover:bg-emerald-400",
                  "shadow-[0_0_16px_rgba(16,185,129,0.4)]"
                )}
              >
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", menuOpen && "rotate-180")}
                  aria-hidden="true"
                />
              </button>

              {menuOpen && (
                <div className="absolute top-full left-0 mt-1.5 z-50 min-w-[220px] rounded-lg border border-border bg-popover shadow-lg py-1 ring-1 ring-foreground/10">
                  {ALL_DOWNLOADS.map((dl) => (
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
                href="/railyard/maps"
                className="flex items-center gap-2.5 px-4 py-2 rounded-lg border border-border/70 bg-background/60 backdrop-blur-sm hover:bg-accent/60 transition-colors group"
              >
                <MapIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                <span>
                  <span className="text-base font-bold tabular-nums">{mapCountLabel}</span>
                  <span className="ml-1.5 text-sm text-muted-foreground">Maps Available</span>
                </span>
              </Link>
              <Link
                href="/railyard/mods"
                className="flex items-center gap-2.5 px-4 py-2 rounded-lg border border-border/70 bg-background/60 backdrop-blur-sm hover:bg-accent/60 transition-colors group"
              >
                <Package className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                <span>
                  <span className="text-base font-bold tabular-nums">{modCountLabel}</span>
                  <span className="ml-1.5 text-sm text-muted-foreground">Mods Available</span>
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────── */}
      <section className="px-[clamp(1.5rem,5vw,4rem)] py-20">
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
                    active && "border-emerald-400/60 shadow-[0_0_18px_rgba(16,185,129,0.15)] ring-1 ring-emerald-400/40"
                  )}
                  onMouseEnter={() => setActiveFeature(feature.id)}
                  onFocus={() => setActiveFeature(feature.id)}
                  tabIndex={0}
                  role="article"
                >
                  <div className="flex items-start gap-4">
                    <LineBullet
                      bullet={feature.letter}
                      color={feature.color}
                      textColor={feature.textColor}
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
                            <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-500/70" aria-hidden="true" />
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
      </section>

      <Separator />

      {/* ─── Workflow ──────────────────────────────────────────────────── */}
      <section className="px-[clamp(1.5rem,5vw,4rem)] py-20">
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
                    "text-left p-5 rounded-xl border transition-all duration-200 outline-none",
                    active
                      ? "border-emerald-400/60 bg-emerald-500/5 shadow-[0_0_14px_rgba(16,185,129,0.12)] ring-1 ring-emerald-400/40"
                      : "border-border hover:border-border/80 hover:bg-accent/40"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold transition-colors",
                        active ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {idx + 1}
                    </span>
                    <h3 className="font-semibold text-foreground">{stop.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stop.desc}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <Separator />

      {/* ─── All Downloads ─────────────────────────────────────────────── */}
      <section className="px-[clamp(1.5rem,5vw,4rem)] py-20" id="all-downloads">
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
                        ? "bg-background text-foreground border-r-2 border-emerald-400 sm:border-r-2 -mr-px"
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
                          ? "border-emerald-400/60 bg-emerald-500/5 hover:bg-emerald-500/10"
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

        {/* Subway color bars footer */}
        <div className="mt-16 flex items-center justify-center gap-2.5">
          {SUBWAY_BARS.map((c) => (
            <span
              key={c}
              className="h-1.5 w-[clamp(1.75rem,3.5vw,2.5rem)] rounded-full"
              style={{ backgroundColor: c }}
            />
          ))}
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
