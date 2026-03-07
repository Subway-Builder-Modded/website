import * as React from "react"
import Link from "next/link"
import {
  CodeXml,
  CirclePlus,
  PackagePlus,
  type LucideIcon,
} from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const ICONS = {
  CodeXml,
  CirclePlus,
  PackagePlus
} satisfies Record<string, LucideIcon>

type WikiCardIconName = keyof typeof ICONS

export function WikiCardGrid({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "my-8 grid grid-cols-1 gap-4 md:grid-cols-2",
        className
      )}
    >
      {children}
    </div>
  )
}

export function WikiCard({
  title,
  href,
  icon,
  className,
  children,
}: {
  title: string
  href: string
  icon?: WikiCardIconName
  className?: string
  children: React.ReactNode
}) {
  const Icon = icon ? ICONS[icon] : undefined

  return (
    <Link href={href} className="block h-full outline-none">
      <Card
        className={cn(
          "h-full border border-border/60 bg-card/60",
          "transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out",
          "hover:-translate-y-0.5 hover:border-border hover:bg-card",
          "hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.04)]",
          "focus-visible:ring-2 focus-visible:ring-ring/40",
          className
        )}
      >
        <CardHeader className="gap-2 px-5 py-2">
          <CardTitle className="text-base font-semibold leading-tight text-foreground">
            <span className="flex items-center gap-2">
              {Icon ? (
                <Icon
                  className="mt-px size-4 shrink-0 text-foreground"
                  aria-hidden="true"
                />
              ) : null}
              <span>{title}</span>
            </span>
          </CardTitle>

          <CardDescription
            className={cn(
              "text-sm text-muted-foreground",
              "[&_p]:m-0",
              "[&_p]:text-sm",
              "[&_p]:leading-5",
              "[&_p]:text-muted-foreground"
            )}
          >
            {children}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
