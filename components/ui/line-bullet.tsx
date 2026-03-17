import * as React from "react"
import { cn } from "@/lib/utils"

export type LineBulletShape = "circle" | "diamond" | "triangle"
export type LineBulletSize = "sm" | "md" | "lg" | "xl"

export interface LineBulletProps extends React.HTMLAttributes<HTMLDivElement> {
  bullet: React.ReactNode
  color: string
  textColor: string
  darkColor?: string
  darkTextColor?: string
  hoverColor?: string
  darkHoverColor?: string
  invertOnHover?: boolean
  shape?: LineBulletShape
  size?: LineBulletSize
}

const sizeMap = {
  sm: { box: "2rem", text: "1rem" },
  md: { box: "2.5rem", text: "1.25rem" },
  lg: { box: "3rem", text: "1.5rem" },
  xl: { box: "3.5rem", text: "1.75rem" },
} as const

function isBlackColor(value: string) {
  const normalized = value.replace(/\s+/g, "").toLowerCase()
  return normalized === "#000" || normalized === "#000000" || normalized === "black" || normalized === "rgb(0,0,0)"
}

function isWhiteColor(value: string) {
  const normalized = value.replace(/\s+/g, "").toLowerCase()
  return normalized === "#fff" || normalized === "#ffffff" || normalized === "white" || normalized === "rgb(255,255,255)"
}

export function LineBullet({
  bullet,
  color,
  textColor,
  darkColor,
  darkTextColor,
  hoverColor,
  darkHoverColor,
  invertOnHover = false,
  shape = "circle",
  size = "sm",
  className,
  style,
  ...props
}: LineBulletProps) {
  const s = sizeMap[size]
  const resolvedHoverColor = hoverColor ?? color
  const resolvedDarkColor = darkColor ?? (!invertOnHover && isBlackColor(color) ? "#FFFFFF" : color)
  const resolvedDarkHoverColor = darkHoverColor ?? darkColor ?? (!invertOnHover && isBlackColor(resolvedHoverColor) ? "#FFFFFF" : resolvedHoverColor)
  const baseBulletBg = invertOnHover ? "#FFFFFF" : color
  const baseBulletFg = invertOnHover ? "#000000" : textColor
  const hoverBulletBg = invertOnHover ? resolvedHoverColor : color
  const hoverBulletFg = invertOnHover ? "#FFFFFF" : textColor
  const darkBaseBulletBg = invertOnHover ? "#FFFFFF" : resolvedDarkColor
  const darkBaseBulletFg = invertOnHover
    ? "#000000"
    : darkTextColor ?? (isWhiteColor(darkBaseBulletBg) ? "#000000" : baseBulletFg)
  const darkHoverBulletBg = invertOnHover ? resolvedDarkHoverColor : resolvedDarkHoverColor
  const darkHoverBulletFg = invertOnHover
    ? "#FFFFFF"
    : darkTextColor ?? (isWhiteColor(darkHoverBulletBg) ? "#000000" : hoverBulletFg)
  const bulletLabel =
    typeof bullet === "string" || typeof bullet === "number"
      ? String(bullet)
      : "symbol"

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
          "cursor-pointer transition-colors duration-300 ease-out",
          shape === "circle" && "rounded-full",
          shape === "triangle" && "[clip-path:polygon(50%_0%,0%_100%,100%_100%)]",
          "bg-[var(--line-bullet-bg)] text-[var(--line-bullet-fg)]",
          "dark:bg-[var(--line-bullet-bg-dark)] dark:text-[var(--line-bullet-fg-dark)]",
          "hover:bg-[var(--line-bullet-bg-hover)] hover:text-[var(--line-bullet-fg-hover)]",
          "dark:hover:bg-[var(--line-bullet-bg-hover-dark)] dark:hover:text-[var(--line-bullet-fg-hover-dark)]",
        )}
        style={{
          ["--line-bullet-bg" as string]: baseBulletBg,
          ["--line-bullet-fg" as string]: isWhiteColor(baseBulletBg) ? "#000000" : baseBulletFg,
          ["--line-bullet-bg-hover" as string]: hoverBulletBg,
          ["--line-bullet-fg-hover" as string]: isWhiteColor(hoverBulletBg) ? "#000000" : hoverBulletFg,
          ["--line-bullet-bg-dark" as string]: darkBaseBulletBg,
          ["--line-bullet-fg-dark" as string]: darkBaseBulletFg,
          ["--line-bullet-bg-hover-dark" as string]: darkHoverBulletBg,
          ["--line-bullet-fg-hover-dark" as string]: darkHoverBulletFg,
          minWidth: s.box,
          height: s.box,
          fontSize: s.text,
          padding: shape === "triangle" ? "0" : "0 0.25rem",
          transform: shape === "diamond" ? "rotate(45deg) scale(0.707107)" : undefined,
        }}
        aria-label={`Route ${bulletLabel}`}
      >
        <span
          style={{
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
