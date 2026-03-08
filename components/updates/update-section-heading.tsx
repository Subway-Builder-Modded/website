import type { ReactNode } from "react"
import { LineBullet } from "@/components/ui/line-bullet"
import { cn } from "@/lib/utils"

type UpdateSectionHeadingProps = {
  bullet: string
  color?: string
  textColor?: string
  children: ReactNode
  className?: string
}

export function UpdateSectionHeading({
  bullet,
  color = "#0C493B",
  textColor = "#E3E3E3",
  children,
  className,
}: UpdateSectionHeadingProps) {
  return (
    <div className={cn("mt-10 flex items-center gap-3", className)}>
      <LineBullet bullet={bullet} color={color} textColor={textColor} shape="circle" size="sm" />
      <h2 className="m-0 text-xl font-extrabold tracking-wide uppercase">{children}</h2>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
