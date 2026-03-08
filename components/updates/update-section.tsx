import * as React from "react"
import { cn } from "@/lib/utils"
import { LineBullet } from "@/components/ui/line-bullet"
import { UPDATE_SECTION_CONFIG, type UpdateSectionType } from "@/lib/updates-config"

export interface UpdateSectionProps {
  type: UpdateSectionType
  children?: React.ReactNode
  className?: string
}

/**
 * MDX component for changelog section headings.
 *
 * Usage in MDX:
 * ```mdx
 * <UpdateSection type="features">
 * - Initial release
 * - New feature added
 * </UpdateSection>
 * ```
 */
export function UpdateSection({ type, children, className }: UpdateSectionProps) {
  const config = UPDATE_SECTION_CONFIG[type]

  if (!config) return null

  return (
    <div className={cn("mb-8", className)}>
      <div className="mb-3 flex items-center gap-3">
        <LineBullet
          bullet={config.letter}
          color={config.bulletColor}
          textColor="#ffffff"
          shape="circle"
          size="sm"
        />
        <h2 className="text-xl font-bold uppercase tracking-wide text-muted-foreground">
          {config.label}
        </h2>
        <div className="h-0.5 flex-1 rounded-full bg-muted-foreground/25" />
      </div>

      {/* Render children (typically a <ul> from MDX list items) */}
      <div className="[&_ul]:my-0 [&_ul]:ml-6 [&_ul]:list-disc [&_li]:mt-1.5 [&_li]:leading-7">
        {children}
      </div>
    </div>
  )
}
