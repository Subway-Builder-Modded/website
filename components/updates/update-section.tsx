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
 * MDX component for structured changelog sections.
 *
 * Usage in a `.mdx` update file:
 * ```mdx
 * <UpdateSection type="features">
 * - Initial release
 * - Another new feature
 * </UpdateSection>
 * ```
 *
 * Supported `type` values: `features` | `bugfixes` | `upgrades` | `other`
 */
export function UpdateSection({ type, children, className }: UpdateSectionProps) {
  const config = UPDATE_SECTION_CONFIG[type]
  if (!config) return null

  return (
    <div className={cn("mb-8 last:mb-0", className)}>
      <div className="mb-3 flex items-center gap-2.5">
        <LineBullet
          bullet={config.letter}
          color={config.bulletColor}
          textColor="#ffffff"
          shape="circle"
          size="sm"
        />
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          {config.label}
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/*
        Children: typically a <ul> produced by MDX from list syntax.
        Override the global MDX ul/li margins so they sit flush inside the section.
      */}
      <div
        className={cn(
          "[&_ul]:my-0 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1.5",
          "[&_li]:leading-7 [&_li]:text-foreground",
          "[&_p]:my-0 [&_p]:leading-7",
        )}
      >
        {children}
      </div>
    </div>
  )
}
