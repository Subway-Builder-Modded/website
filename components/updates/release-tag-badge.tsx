import { Badge } from "@/components/ui/badge"
import type { UpdateTag } from "@/lib/updates-config"

type ReleaseTagKind = UpdateTag | "latest"

const TAG_STYLE: Record<ReleaseTagKind, { label: string; color: string }> = {
  latest: { label: "Latest", color: "#3fb950" },
  release: { label: "Release", color: "#2f81f7" },
  beta: { label: "Beta", color: "#d29922" },
  alpha: { label: "Alpha", color: "#f85149" },
}

interface ReleaseTagBadgeProps {
  kind: ReleaseTagKind
  size?: "sm" | "md"
}

export function ReleaseTagBadge({ kind, size = "md" }: ReleaseTagBadgeProps) {
  const { label, color } = TAG_STYLE[kind]
  const compact = size === "sm"

  return (
    <Badge
      className="shrink-0 rounded-full border bg-transparent font-medium tracking-normal"
      style={{
        borderColor: color,
        color,
        height: "auto",
        padding: compact ? "0.125rem 0.625rem" : "0.2rem 0.75rem",
        fontSize: compact ? "0.875rem" : "0.9375rem",
        lineHeight: compact ? "1.25rem" : "1.375rem",
      }}
    >
      {label}
    </Badge>
  )
}

