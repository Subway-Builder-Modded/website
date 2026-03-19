import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type HubPageHeaderProps = {
  icon: LucideIcon
  title: string
  description: string
  className?: string
}

export function HubPageHeader({
  icon: Icon,
  title,
  description,
  className,
}: HubPageHeaderProps) {
  return (
    <header className={cn("relative mb-10 text-center", className)}>
      <div className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-36 max-w-2xl rounded-full bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-3xl" />
      <h1 className="relative mt-1 inline-flex items-center justify-center gap-3 text-4xl font-black tracking-tight sm:text-5xl">
        <Icon className="size-[0.95em] text-primary" aria-hidden="true" />
        <span>{title}</span>
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
        {description}
      </p>
    </header>
  )
}
