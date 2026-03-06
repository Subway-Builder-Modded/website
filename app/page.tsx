"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { motion, useScroll, useTransform } from "motion/react"

import { Card, CardTitle } from "@/components/ui/card"
import { LineBullet } from "@/components/ui/line-bullet"
import { cn } from "@/lib/utils"

type HomeItem = {
  id: string
  letter: string
  bullet: string
  title: string
  description: string
  href: string
}

const HOMEPAGE_ITEMS: HomeItem[] = [
  {
    id: "directory",
    letter: "M",
    bullet: "#9A662F",
    title: "Map Directory",
    description: "Browse community-made maps from cities around the world.",
    href: "/wiki/maps/map-directory",
  },
  {
    id: "install",
    letter: "I",
    bullet: "#000000",
    title: "Installing Maps",
    description: "Step-by-step guide to installing custom maps using Kronifer's Map Patcher.",
    href: "/wiki/maps/map-installation-guide",
  },
  {
    id: "create",
    letter: "C",
    bullet: "#0036A7",
    title: "Making Custom Maps",
    description: "The complete guide to creating, packaging, and distributing custom Subway Builder maps.",
    href: "/modding-docs/creating-maps/making-custom-maps",
  },
  {
    id: "updates",
    letter: "U",
    bullet: "#0C493B",
    title: "Updates & Changelogs",
    description: "Stay up to date with new releases from the Subway Builder Modded Team.",
    href: "/updates",
  },
  {
    id: "modding",
    letter: "D",
    bullet: "#FF6312",
    title: "Modding Documentation",
    description: "Build your own mods using our Mod Template.",
    href: "/modding-docs/template-mod/getting-started",
  },
]

const SUBWAY_BARS = ["#0039A6", "#FF6319", "#00933C", "#FCCC0A", "#752F82"]

export default function Page() {
  const { resolvedTheme } = useTheme()
  const heroSrc = resolvedTheme === "dark" ? "/images/home/dark.png" : "/images/home/light.png"

  const heroRef = useRef<HTMLElement | null>(null)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { scrollY } = useScroll()

  const heroScale = useTransform(scrollY, [0, 900], [1, 1.32])
  const heroY = useTransform(scrollY, [0, 900], [0, -140])

  const { scrollYProgress: heroExitProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroContentOpacity = useTransform(heroExitProgress, [0.22, 0.42], [1, 0])
  const heroContentX = useTransform(heroExitProgress, [0.22, 0.42], [0, -28])

  const items = useMemo(() => HOMEPAGE_ITEMS, [])
  const rows = useMemo(() => chunkRows(items, 3), [items])

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <section ref={heroRef} className="relative h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: heroScale, y: heroY }} aria-hidden="true">
          {mounted && <Image src={heroSrc} alt="Subway Builder Modded hero" fill priority className="object-cover" />}
        </motion.div>

        <div className="absolute inset-0 bg-white/12 dark:bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-7 pb-[28vh] sm:px-7 sm:pb-[26vh]">
          <motion.div style={{ opacity: heroContentOpacity, x: heroContentX }} className="max-w-3xl">
            <h1 className="text-balance text-5xl font-black sm:text-6xl lg:text-7xl">Subway Builder Modded</h1>

            <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              The complete hub for everything modded in Subway Builder.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {SUBWAY_BARS.map((c) => (
                <span key={c} className="h-1.5 w-10 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-7 pt-16 pb-4 sm:px-7 sm:pt-24 sm:pb-12">
        <div className="mt-10 space-y-7">
          {rows.map((row, rowIdx) => (
            <AnimatedRow key={rowIdx}>
              <div className="grid items-stretch gap-7 justify-center [grid-template-columns:repeat(auto-fit,minmax(280px,340px))]">
                {row.map((item) => (
                  <HomepageCard key={item.id} item={item} />
                ))}
              </div>
            </AnimatedRow>
          ))}
        </div>
      </section>
    </main>
  )
}

function chunkRows<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function AnimatedRow({ children }: { children: React.ReactNode }) {
  const rowRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress: inProgressRaw } = useScroll({
    target: rowRef,
    offset: ["start 100%", "start 72%"],
  })

  const { scrollYProgress: outProgress } = useScroll({
    target: rowRef,
    offset: ["end 10%", "end 0%"],
  })

  const inProgress = useTransform(inProgressRaw, [0.14, 1], [0, 1])

  const inOpacity = useTransform(inProgress, [0, 1], [0, 1])
  const inX = useTransform(inProgress, [0, 1], [28, 0])

  const outOpacity = useTransform(outProgress, [0, 1], [1, 0])
  const outX = useTransform(outProgress, [0, 1], [0, -28])

  const opacity = useTransform([inOpacity, outOpacity], ([a, b]) => Math.min(a, b))
  const x = useTransform([inX, outX], ([a, b]) => (b < 0 ? b : a))

  return (
    <motion.div ref={rowRef} style={{ opacity, x }}>
      {children}
    </motion.div>
  )
}

function HomepageCard({ item }: { item: HomeItem }) {
  return (
    <Link href={item.href} className="block h-full outline-none">
      <Card
        className={cn(
          "group h-full overflow-hidden border border-border bg-card will-change-transform",
          "transition-transform duration-300",
          "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/5",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
        )}
      >
        <div className="flex h-full flex-col px-6 pb-2 pt-5">
          <div className="min-h-[90px]">
            <div className="flex items-start gap-3">
              <div className="mt-1 shrink-0">
                <LineBullet
                  bullet={(item.letter || "").slice(0, 2).toUpperCase()}
                  color={item.bullet}
                  textColor={pickTextColor(item.bullet)}
                  shape="circle"
                  size="sm"
                />
              </div>

              <div className="min-w-0">
                <CardTitle className="text-xl font-semibold leading-[1.18] pb-[2px] sm:text-2xl">
                  <span className="line-clamp-2">{item.title}</span>
                </CardTitle>

                <div className="mt-3 h-[2px] w-16 rounded-full opacity-70" style={{ backgroundColor: item.bullet }} />
              </div>
            </div>
          </div>

          <div className="mt-1 flex-1">
            <p className="text-lg font-medium leading-relaxed text-muted-foreground">
              <span className="line-clamp-3">{item.description}</span>
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

function pickTextColor(hex: string) {
  const rgb = hexToRgb(hex)
  if (!rgb) return "#FFFFFF"
  const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255
  return luminance > 0.72 ? "#000000" : "#FFFFFF"
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = (hex || "").trim().replace("#", "")
  if (raw.length !== 6) return null
  const r = parseInt(raw.slice(0, 2), 16)
  const g = parseInt(raw.slice(2, 4), 16)
  const b = parseInt(raw.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return { r, g, b }
}
