import * as React from "react"
import { cn } from "@/lib/utils"

export type LineBulletShape = "circle" | "diamond" | "triangle"
export type LineBulletSize = "sm" | "md" | "lg" | "xl"

export interface LineBulletProps extends React.HTMLAttributes<HTMLDivElement> {
  bullet: string
  color: string
  textColor: string
  shape?: LineBulletShape
  size?: LineBulletSize
}

const sizeMap = {
  sm: { box: "2rem", text: "1rem" },
  md: { box: "2.5rem", text: "1.25rem" },
  lg: { box: "3rem", text: "1.5rem" },
  xl: { box: "3.5rem", text: "1.75rem" },
} as const

export function LineBullet({
  bullet,
  color,
  textColor,
  shape = "circle",
  size = "sm",
  className,
  style,
  ...props
}: LineBulletProps) {
  const s = sizeMap[size]

  return (
    <div
      {...props}
      className={cn("relative", className)}
      style={{
        height: s.box,
        ...style,
      }}
    >
      <div
        className={cn(
          "flex items-center justify-center font-bold",
          "select-none overflow-hidden",
          "font-mta",
          "cursor-pointer hover:opacity-80",
          shape === "circle" && "rounded-full",
          shape === "triangle" && "[clip-path:polygon(50%_0%,0%_100%,100%_100%)]",
        )}
        style={{
          backgroundColor: color,
          minWidth: s.box,
          height: s.box,
          fontSize: s.text,
          padding: shape === "triangle" ? "0" : "0 0.25rem",
          transform: shape === "diamond" ? "rotate(45deg) scale(0.707107)" : undefined,
        }}
        aria-label={`Route ${bullet}`}
        title={`Route ${bullet}`}
      >
        <span
          style={{
            color: textColor,
            lineHeight: "0",
            transform:
              shape === "diamond"
                ? "rotate(-45deg) translateY(0.02rem)"
                : shape === "triangle"
                ? "translateY(0.1rem)"
                : undefined,
          }}
        >
          {bullet}
        </span>
      </div>
    </div>
  )
}
