"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useRef, useState, useLayoutEffect, useCallback } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { TrainTrack, Package, Megaphone, Users, type LucideIcon } from "lucide-react"

import { Card, CardTitle } from "@/components/ui/card"
import { LineBullet } from "@/components/ui/line-bullet"
import type { NavbarIcon } from "@/lib/navbar-config"
import { NON_THEMED_LINE_BULLET } from "@/lib/line-bullet-theme"
import { cn } from "@/lib/utils"

type HomeItemBase = {
  id: string
  title: string
  description: string
  href: string
}

type HomeItem = HomeItemBase & (
  | { letter: string; icon?: never }
  | { icon: NavbarIcon; letter?: never }
)

function isMaskIcon(icon: NavbarIcon): icon is Extract<NavbarIcon, { type: "mask" }> {
  return typeof icon === "object" && icon !== null && "type" in icon && icon.type === "mask"
}

function isImageIcon(icon: NavbarIcon): icon is Extract<NavbarIcon, { type: "image" }> {
  return typeof icon === "object" && icon !== null && "type" in icon && icon.type === "image"
}

function renderHomeItemIcon(icon: NavbarIcon) {
  if (isMaskIcon(icon)) {
    return (
      <span
        className="block size-3.5 bg-current"
        style={{
          WebkitMask: `url(${icon.src}) center / contain no-repeat`,
          mask: `url(${icon.src}) center / contain no-repeat`,
        }}
      />
    )
  }

  if (isImageIcon(icon)) {
    return <img src={icon.src} alt="" aria-hidden className="block size-3.5 object-contain" />
  }

  const Icon = icon as LucideIcon
  return <Icon className="size-3.5" aria-hidden="true" />
}

const HOMEPAGE_ITEMS: HomeItem[] = [
  {
    id: "railyard",
    icon: TrainTrack,
    title: "Railyard",
    description: "All-in-one Map and Mod Manager for Subway Builder.",
    href: "/railyard",
  },
  {
    id: "template-mod-docs",
    icon: Package,
    title: "Template Mod Documentation",
    description: "View the docs for the Subway Builder Modded Template Mod.",
    href: "/wiki/template-mod/latest/home",
  },
  {
    id: "updates",
    icon: Megaphone,
    title: "Updates & Changelogs",
    description: "Stay up to date with the latest releases from Subway Builder Modded.",
    href: "/updates",
  },
  {
    id: "credits",
    icon: Users,
    title: "Credits",
    description: "Subway Builder Modded is a community-driven project made possible by dedicated contributors.",
    href: "/credits",
  },
  {
    id: "discord",
    icon: {
      type: "mask",
      src: "/assets/discord.svg",
    },
    title: "Discord",
    description: "Join our Discord server to connect with the community and get support.",
    href: "https://discord.gg/syG9YHMyeG",
  },
]

const SUBWAY_BARS = ["#0039A6", "#FF6319", "#00933C", "#FCCC0A", "#752F82"]

export default function Page() {
  const heroRef = useRef<HTMLElement | null>(null)

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
          <Image
            src="/images/home/light.png"
            alt="Subway Builder Modded hero"
            fill
            priority
            className="object-cover dark:hidden"
          />
          <Image
            src="/images/home/dark.png"
            alt="Subway Builder Modded hero"
            fill
            priority
            className="hidden object-cover dark:block"
          />
        </motion.div>

        <div className="absolute inset-0 bg-white/12 dark:bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />

        <div className="relative z-10 flex h-full items-end px-[clamp(1rem,4vw,3rem)] pb-[max(env(safe-area-inset-bottom),clamp(3rem,12svh,8rem))] pt-[clamp(1rem,3svh,2rem)]">
          <motion.div
            style={{ opacity: heroContentOpacity, x: heroContentX }}
            className="w-full max-w-[min(92vw,40rem)]"
          >
            <h1 className="text-balance text-[clamp(2rem,min(7.4vw,8.5svh),5.2rem)] font-black leading-[0.92] tracking-[-0.03em]">
              Subway Builder Modded
            </h1>

            <p className="mt-[clamp(0.6rem,1.8svh,1rem)] max-w-[34rem] text-pretty text-[clamp(0.98rem,min(2.2vw,2.4svh),1.22rem)] leading-[1.45] text-muted-foreground">
              The complete hub for everything modded in Subway Builder.
            </p>

            <div className="mt-[clamp(0.75rem,2svh,1.1rem)] flex flex-wrap items-center gap-2">
              {SUBWAY_BARS.map((c) => (
                <span
                  key={c}
                  className="h-1.5 w-[clamp(1.9rem,4vw,2.5rem)] rounded-full"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-7 pt-16 pb-4 sm:px-7 sm:pt-24 sm:pb-12">
        <div className="mt-10 space-y-7">
          {rows.map((row, rowIdx) => (
            <AnimatedRow key={rowIdx}>
              <HomepageCardRow items={row} />
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

  const opacity = useTransform(() => Math.min(inOpacity.get(), outOpacity.get()))
  const x = useTransform(() => {
    const a = inX.get()
    const b = outX.get()
    return b < 0 ? b : a
  })

  return (
    <motion.div ref={rowRef} style={{ opacity, x }}>
      {children}
    </motion.div>
  )
}

function HomepageCardRow({ items }: { items: HomeItem[] }) {
  const [headingHeight, setHeadingHeight] = useState(0)
  const [titleHeight, setTitleHeight] = useState(0)

  const headingNodes = useRef<Record<string, HTMLDivElement | null>>({})
  const titleNodes = useRef<Record<string, HTMLDivElement | null>>({})

  const registerHeading = useCallback(
    (id: string) => (node: HTMLDivElement | null) => {
      headingNodes.current[id] = node
    },
    [],
  )

  const registerTitle = useCallback(
    (id: string) => (node: HTMLDivElement | null) => {
      titleNodes.current[id] = node
    },
    [],
  )

  useLayoutEffect(() => {
    const measure = () => {
      const headingHeights = items
        .map((item) => headingNodes.current[item.id]?.offsetHeight ?? 0)
        .filter(Boolean)

      const titleHeights = items
        .map((item) => titleNodes.current[item.id]?.offsetHeight ?? 0)
        .filter(Boolean)

      if (headingHeights.length) {
        setHeadingHeight(Math.max(...headingHeights))
      }

      if (titleHeights.length) {
        setTitleHeight(Math.max(...titleHeights))
      }
    }

    measure()

    const observer = new ResizeObserver(measure)

    items.forEach((item) => {
      const headingNode = headingNodes.current[item.id]
      const titleNode = titleNodes.current[item.id]

      if (headingNode) observer.observe(headingNode)
      if (titleNode) observer.observe(titleNode)
    })

    window.addEventListener("resize", measure)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [items])

  return (
    <div className="grid items-stretch justify-center gap-7 [grid-template-columns:repeat(auto-fit,minmax(280px,340px))]">
      {items.map((item) => (
        <HomepageCard
          key={item.id}
          item={item}
          headingHeight={headingHeight}
          titleHeight={titleHeight}
          registerHeading={registerHeading(item.id)}
          registerTitle={registerTitle(item.id)}
        />
      ))}
    </div>
  )
}

function HomepageCard({
  item,
  headingHeight,
  titleHeight,
  registerHeading,
  registerTitle,
}: {
  item: HomeItem
  headingHeight: number
  titleHeight: number
  registerHeading: (node: HTMLDivElement | null) => void
  registerTitle: (node: HTMLDivElement | null) => void
}) {
  const isRailyard = item.id === "railyard"
  const Icon = item.icon
  const bulletColor = isRailyard ? "#00A97A" : NON_THEMED_LINE_BULLET.bulletColor
  const bulletTextColor = isRailyard ? "#FFFFFF" : NON_THEMED_LINE_BULLET.textColor

  return (
    <Link href={item.href} className="block h-full outline-none">
      <Card
        className={cn(
          "group relative isolate h-full overflow-hidden border border-border bg-card will-change-transform",
          "transition-transform duration-300",
          !isRailyard && "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/5",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
          isRailyard && [
            "border-emerald-400/70 bg-gradient-to-b from-emerald-400/30 via-emerald-500/20 to-emerald-600/30",
            "ring-1 ring-emerald-400/70 shadow-[0_0_14px_hsl(var(--primary)/0.3)]",
            "hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/35 dark:hover:shadow-emerald-300/25",
            "hover:ring-emerald-300/80",
            "before:pointer-events-none before:absolute before:inset-x-5 before:top-1 before:h-10 before:rounded-full before:bg-gradient-to-b before:from-white/35 before:to-transparent before:blur-md",
            "after:pointer-events-none after:absolute after:inset-[1px] after:rounded-[inherit] after:border after:border-emerald-200/25",
            "focus-visible:ring-emerald-300/70",
          ],
        )}
      >
        <div className="relative z-10 flex h-full flex-col px-6 pb-2 pt-3">
          <div
            className="flex items-center"
            style={headingHeight > 0 ? { minHeight: `${headingHeight}px` } : undefined}
          >
            <div ref={registerHeading} className="w-full">
              <div className="flex gap-3">
                <div
                  className="flex shrink-0 items-center"
                  style={titleHeight > 0 ? { height: `${titleHeight}px` } : undefined}
                >
                  <LineBullet
                    bullet={
                      Icon ? renderHomeItemIcon(Icon) : item.letter.slice(0, 2).toUpperCase()
                    }
                    color={bulletColor}
                    textColor={bulletTextColor}
                    shape="circle"
                    size="sm"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className="flex items-center"
                    style={titleHeight > 0 ? { minHeight: `${titleHeight}px` } : undefined}
                  >
                    <CardTitle
                      ref={registerTitle}
                      className={cn(
                        "pb-[2px] text-xl font-semibold leading-[1.18] sm:text-2xl",
                        isRailyard && "text-foreground",
                      )}
                    >
                      {item.title}
                    </CardTitle>
                  </div>

                  <div
                    className="mt-3 h-[2px] w-16 rounded-full opacity-70"
                    style={{ backgroundColor: bulletColor }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex-1">
            <p className={cn("text-lg font-medium leading-relaxed", isRailyard ? "text-foreground" : "text-muted-foreground")}>
              <span className="line-clamp-3">{item.description}</span>
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

