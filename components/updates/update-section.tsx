import * as React from "react"

import { LineBullet } from "@/components/ui/line-bullet"
import { getLineBulletTheme } from "@/lib/line-bullet-theme"
import { UPDATE_SECTION_CONFIG, type UpdateSectionType } from "@/lib/updates-config"
import { cn } from "@/lib/utils"

export interface UpdateSectionProps {
  type: UpdateSectionType
  children?: React.ReactNode
  className?: string
  themeId?: string
}

export function UpdateSection({ type, children, className, themeId }: UpdateSectionProps) {
  const config = UPDATE_SECTION_CONFIG[type]
  if (!config) return null

  const bulletTheme = getLineBulletTheme(themeId)

  return (
    <div className={cn("mb-8 last:mb-0", className)}>
      <div className="mb-3 flex items-center gap-2.5">
        <LineBullet
          bullet={config.letter}
          color={bulletTheme.bulletColor}
          textColor={bulletTheme.textColor}
          shape="circle"
          size="sm"
        />
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          {config.label}
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>

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
