import * as React from "react"
import * as LucideIcons from "lucide-react"
import type { LucideIcon, LucideProps } from "lucide-react"

import { cn } from "@/lib/utils"

type IconListProps = React.ComponentProps<"div">

type IconItemProps = Omit<React.ComponentProps<"div">, "color"> & {
  icon: LucideIcon | keyof typeof LucideIcons
  iconProps?: LucideProps
} & Pick<
    LucideProps,
    "color" | "size" | "strokeWidth" | "absoluteStrokeWidth" | "fill"
  >

function isRenderableComponent(value: unknown): value is LucideIcon {
  return (
    typeof value === "function" ||
    (typeof value === "object" && value !== null)
  )
}

function resolveLucideIcon(icon: IconItemProps["icon"]): LucideIcon | null {
  if (isRenderableComponent(icon)) {
    return icon as LucideIcon
  }

  const maybeIcon = LucideIcons[icon]
  return isRenderableComponent(maybeIcon) ? (maybeIcon as LucideIcon) : null
}

export function IconList({ className, ...props }: IconListProps) {
  return (
    <div
      role="list"
      data-slot="mdx-icon-list"
      className={cn("my-6 space-y-2", className)}
      {...props}
    />
  )
}

export function IconItem({
  icon,
  iconProps,
  color,
  size,
  strokeWidth,
  absoluteStrokeWidth,
  fill,
  children,
  className,
  ...props
}: IconItemProps) {
  const Icon = resolveLucideIcon(icon)
  const resolvedFill = iconProps?.fill ?? fill ?? "none"

  return (
    <div
      role="listitem"
      data-slot="mdx-icon-item"
      className={cn(
        "grid grid-cols-[1.125rem_minmax(0,1fr)] items-start gap-x-2",
        className
      )}
      {...props}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          size={size ?? "1em"}
          color={color}
          strokeWidth={strokeWidth}
          absoluteStrokeWidth={absoluteStrokeWidth}
          fill={resolvedFill}
          className="mt-[0.45em] inline-block align-[-0.125em]"
          {...iconProps}
        />
      ) : (
        <span aria-hidden="true" className="inline-block h-[1em] w-[1em]" />
      )}

      <div className="min-w-0 leading-7 [&>[data-slot=mdx-icon-list]]:mt-2">
        {children}
      </div>
    </div>
  )
}
