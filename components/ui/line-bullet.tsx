import * as React from "react"
import { cn } from "@/lib/utils"

type LineBulletSize = "sm" | "md" | "lg"

export interface LineBulletProps extends React.HTMLAttributes<HTMLDivElement> {
  letter: string
  color: string
  size?: LineBulletSize
}

const sizeMap: Record<LineBulletSize, { box: string; text: string }> = {
  sm: { box: "w-[34px] h-[34px]", text: "text-[15px]" },
  md: { box: "w-[38px] h-[38px]", text: "text-[19px]" },
  lg: { box: "w-[44px] h-[44px]", text: "text-[23px]" },
}

const opticalOffset: Record<string, { x: number; y: number }> = {
  D: { x: 0, y: 1.5 },
  O: { x: 0, y: 1.0 },
  Q: { x: 0, y: 1.0 },
  C: { x: 0, y: 1.25 },
  G: { x: 0, y: 1.25 },
  U: { x: 0, y: 1.25 },
  M: { x: 0, y: 1.0 },
  I: { x: 0, y: 1.0 },
}

export function LineBullet({ letter, color, size = "md", className, ...props }: LineBulletProps) {
  const s = sizeMap[size]
  const glyph = (letter || "").slice(0, 2).toUpperCase()
  const off = opticalOffset[glyph] ?? { x: 0, y: 1.2 }

  return (
    <div
      {...props}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-white select-none",
        s.box,
        className,
      )}
      style={{
        backgroundColor: color,
        fontFamily: "HelveticaNeueBullet, Helvetica, Arial, system-ui, sans-serif",
        fontWeight: 700,
      }}
      aria-label={`Line ${glyph}`}
      title={`Line ${glyph}`}
    >
      <span
        className={cn(s.text)}
      >
        {glyph}
      </span>
    </div>
  )
}
