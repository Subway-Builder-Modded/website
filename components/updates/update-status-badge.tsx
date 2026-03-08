import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { UpdateTag } from "@/lib/updates-config"

type UpdateStatusBadgeProps = {
  tag: UpdateTag | "latest"
  className?: string
}

const STYLE_BY_TAG = {
  latest: "bg-blue-600 text-white dark:bg-blue-500",
  release: "bg-emerald-600 text-white dark:bg-emerald-500",
  beta: "bg-amber-400 text-black dark:bg-amber-300",
} satisfies Record<UpdateStatusBadgeProps["tag"], string>

export function UpdateStatusBadge({ tag, className }: UpdateStatusBadgeProps) {
  return (
    <Badge className={cn("uppercase tracking-wide", STYLE_BY_TAG[tag], className)}>
      {tag}
    </Badge>
  )
}
