import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  InfoIcon,
  LightbulbIcon,
  StarIcon,
  TriangleAlertIcon,
  FlameIcon,
  ShieldAlertIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

const admonitionVariants = cva(
  "my-6 flex gap-3 rounded-lg border-l-[3px] px-4 py-3 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        note: "border-l-blue-500 bg-blue-500/5 text-blue-900 dark:bg-blue-500/10 dark:text-blue-200 [&>svg]:text-blue-500",
        tip: "border-l-emerald-500 bg-emerald-500/5 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200 [&>svg]:text-emerald-500",
        important:
          "border-l-purple-500 bg-purple-500/5 text-purple-900 dark:bg-purple-500/10 dark:text-purple-200 [&>svg]:text-purple-500",
        warning:
          "border-l-yellow-500 bg-yellow-500/5 text-yellow-900 dark:bg-yellow-500/10 dark:text-yellow-200 [&>svg]:text-yellow-500",
        caution:
          "border-l-orange-500 bg-orange-500/5 text-orange-900 dark:bg-orange-500/10 dark:text-orange-200 [&>svg]:text-orange-500",
        danger:
          "border-l-red-500 bg-red-500/5 text-red-900 dark:bg-red-500/10 dark:text-red-200 [&>svg]:text-red-500",
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
      note: "text-blue-700 dark:text-blue-300",
      tip: "text-emerald-700 dark:text-emerald-300",
      important: "text-purple-700 dark:text-purple-300",
      warning: "text-yellow-700 dark:text-yellow-300",
      caution: "text-orange-700 dark:text-orange-300",
      danger: "text-red-700 dark:text-red-300",
    },
  },
  defaultVariants: {
    variant: "note",
  },
})

const icons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> =
  {
    note: InfoIcon,
    tip: LightbulbIcon,
    important: StarIcon,
    warning: TriangleAlertIcon,
    caution: FlameIcon,
    danger: ShieldAlertIcon,
  }

const labels: Record<string, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
  danger: "Danger",
}

interface AdmonitionProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof admonitionVariants> {
  title?: string
}

function Admonition({
  className,
  variant = "note",
  title,
  children,
  ...props
}: AdmonitionProps) {
  const Icon = icons[variant ?? "note"]
  const defaultTitle = labels[variant ?? "note"]

  return (
    <div
      data-slot="admonition"
      data-variant={variant}
      className={cn(admonitionVariants({ variant }), className)}
      {...props}
    >
      <Icon />
      <div className="flex-1 space-y-1.5">
        <p className={cn("leading-none", admonitionTitleVariants({ variant }))}>
          {title ?? defaultTitle}
        </p>
        <div className="text-current/80 [&>p]:leading-relaxed [&>p:first-child]:mt-0">
          {children}
        </div>
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

export { Admonition, Note, Tip, Important, Warning, Caution, Danger }
