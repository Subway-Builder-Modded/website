"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  InfoIcon,
  LightbulbIcon,
  StarIcon,
  TriangleAlertIcon,
  FlameIcon,
  ShieldAlertIcon,
  CircleHelpIcon,
  CircleCheckBigIcon,
  BugIcon,
  FlaskConicalIcon,
  MegaphoneIcon,
  ArchiveX,
} from "lucide-react"

import { cn } from "@/lib/utils"

const admonitionVariants = cva(
  "my-6 flex gap-3 rounded-lg border-l-[3px] px-4 py-3 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        note: "border-l-blue-500 bg-blue-500/5 dark:bg-blue-500/10 text-foreground [&>svg]:text-blue-500",
        tip:
          "border-l-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 text-foreground [&>svg]:text-emerald-500",
        important:
          "border-l-purple-500 bg-purple-500/5 dark:bg-purple-500/10 text-foreground [&>svg]:text-purple-500",
        warning:
          "border-l-amber-500 bg-amber-500/5 dark:bg-amber-500/10 text-foreground [&>svg]:text-amber-500",
        caution:
          "border-l-orange-500 bg-orange-500/5 dark:bg-orange-500/10 text-foreground [&>svg]:text-orange-500",
        danger:
          "border-l-red-500 bg-red-500/5 dark:bg-red-500/10 text-foreground [&>svg]:text-red-500",
        info:
          "border-l-cyan-500 bg-cyan-500/5 dark:bg-cyan-500/10 text-foreground [&>svg]:text-cyan-500",
        success:
          "border-l-green-500 bg-green-500/5 dark:bg-green-500/10 text-foreground [&>svg]:text-green-500",
        deprecated:
          "border-l-zinc-500 bg-zinc-500/5 dark:bg-zinc-500/10 text-foreground [&>svg]:text-zinc-500",
        bug:
          "border-l-pink-500 bg-pink-500/5 dark:bg-pink-500/10 text-foreground [&>svg]:text-pink-500",
        example:
          "border-l-sky-500 bg-sky-500/5 dark:bg-sky-500/10 text-foreground [&>svg]:text-sky-500",
        announcement:
          "border-l-fuchsia-500 bg-fuchsia-500/5 dark:bg-fuchsia-500/10 text-foreground [&>svg]:text-fuchsia-500",
      },
    },
    defaultVariants: {
      variant: "note",
    },
  }
)

const admonitionTitleVariants = cva("font-semibold", {
  variants: {
    variant: {
      note: "text-foreground",
      tip: "text-foreground",
      important: "text-foreground",
      warning: "text-foreground",
      caution: "text-foreground",
      danger: "text-foreground",
      info: "text-foreground",
      success: "text-foreground",
      deprecated: "text-foreground",
      bug: "text-foreground",
      example: "text-foreground",
      announcement: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "note",
  },
})

type AdmonitionVariant = NonNullable<
  VariantProps<typeof admonitionVariants>["variant"]
>

const icons: Record<
  AdmonitionVariant,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  note: InfoIcon,
  tip: LightbulbIcon,
  important: StarIcon,
  warning: TriangleAlertIcon,
  caution: FlameIcon,
  danger: ShieldAlertIcon,
  info: InfoIcon,
  success: CircleCheckBigIcon,
  deprecated: ArchiveX,
  bug: BugIcon,
  example: FlaskConicalIcon,
  announcement: MegaphoneIcon,
}

const labels: Record<AdmonitionVariant, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
  danger: "Danger",
  info: "Info",
  success: "Success",
  deprecated: "Deprecated",
  bug: "Bug",
  example: "Example",
  announcement: "Announcement",
}

interface AdmonitionProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof admonitionVariants> {
  title?: string
  collapsible?: boolean
  defaultOpen?: boolean
}

function Admonition({
  className,
  variant = "note",
  title,
  children,
  collapsible = false,
  defaultOpen = true,
  ...props
}: AdmonitionProps) {
  const resolvedVariant = variant ?? "note"
  const Icon = icons[resolvedVariant]
  const defaultTitle = labels[resolvedVariant]
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <div
      data-slot="admonition"
      data-variant={resolvedVariant}
      data-open={open ? "true" : "false"}
      className={cn(admonitionVariants({ variant: resolvedVariant }), className)}
      {...props}
    >
      <Icon />
      <div className="flex-1">
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex w-full items-center gap-2 text-left"
            aria-expanded={open}
          >
            <p
              className={cn(
                "leading-none",
                admonitionTitleVariants({ variant: resolvedVariant })
              )}
            >
              {title ?? defaultTitle}
            </p>
            <span className="ml-auto text-current/70">{open ? "−" : "+"}</span>
          </button>
        ) : (
          <p
            className={cn(
              "leading-none",
              admonitionTitleVariants({ variant: resolvedVariant })
            )}
          >
            {title ?? defaultTitle}
          </p>
        )}

        {(!collapsible || open) ? (
          <div className="mt-1.5 text-current/80 [&>p]:leading-relaxed [&>p:first-child]:mt-0">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Note(props: Omit<AdmonitionProps, "variant">) {
  return <Admonition variant="note" {...props} />
}

function Tip(props: Omit<AdmonitionProps, "variant">) {
  return <Admonition variant="tip" {...props} />
}

function Important(props: Omit<AdmonitionProps, "variant">) {
  return <Admonition variant="important" {...props} />
}

function Warning(props: Omit<AdmonitionProps, "variant">) {
  return <Admonition variant="warning" {...props} />
}

function Caution(props: Omit<AdmonitionProps, "variant">) {
  return <Admonition variant="caution" {...props} />
}

function Danger(props: Omit<AdmonitionProps, "variant">) {
  return <Admonition variant="danger" {...props} />
}

function Info(props: Omit<AdmonitionProps, "variant">) {
  return <Admonition variant="info" {...props} />
}

function Success(props: Omit<AdmonitionProps, "variant">) {
  return <Admonition variant="success" {...props} />
}

function Deprecated(props: Omit<AdmonitionProps, "variant">) {
  return <Admonition variant="deprecated" {...props} />
}

function Bug(props: Omit<AdmonitionProps, "variant">) {
  return <Admonition variant="bug" {...props} />
}

function Example(props: Omit<AdmonitionProps, "variant">) {
  return <Admonition variant="example" {...props} />
}

function Announcement(props: Omit<AdmonitionProps, "variant">) {
  return <Admonition variant="announcement" {...props} />
}

export {
  Admonition,
  Note,
  Tip,
  Important,
  Warning,
  Caution,
  Danger,
  Info,
  Success,
  Deprecated,
  Bug,
  Example,
  Announcement,
}
