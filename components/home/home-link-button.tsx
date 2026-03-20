import type { CSSProperties } from "react"
import Link from "next/link"

import { AppIcon } from "@/components/common/app-icon"
import { MarkdownText } from "@/components/ui/markdown-text"
import { cn } from "@/lib/utils"
import { HOME_THEME, type HomeLink } from "@/config/site/homepage"
import type { NavbarIcon } from "@/config/navigation/navbar"
import { PROJECT_COLOR_SCHEMES } from "@/config/theme/colors"
import { hexAlpha } from "@/lib/color"

type HomeLinkButtonProps = {
  link: HomeLink
  className?: string
}

const HOME_BUTTON_SIZE_STYLES = {
  xs: {
    button: "h-7 gap-1.5 rounded-md px-2.5 text-xs",
    icon: "size-3.5",
  },
  sm: {
    button: "h-8 gap-1.5 rounded-md px-3 text-xs",
    icon: "size-3.5",
  },
  md: {
    button: "h-10 gap-2 rounded-lg px-4 text-sm",
    icon: "size-4",
  },
  lg: {
    button: "h-11 gap-2.5 rounded-lg px-5 text-base",
    icon: "size-[18px]",
  },
  xl: {
    button: "h-12 gap-3 rounded-xl px-6 text-base",
    icon: "size-5",
  },
} as const

function ButtonContent({
  icon,
  label,
  iconClassName,
}: {
  icon?: NavbarIcon
  label: string
  iconClassName: string
}) {
  return (
    <>
      {icon ? <AppIcon icon={icon} className={cn(iconClassName, "text-current")} /> : null}
      <MarkdownText content={label} />
    </>
  )
}

export function HomeLinkButton({
  link,
  className,
}: HomeLinkButtonProps) {
  const sizeStyle = HOME_BUTTON_SIZE_STYLES[link.size]
  const scheme =
    link.scheme === "default"
      ? {
          accentColor: HOME_THEME.accent,
          textColorInverted: HOME_THEME.textOnAccent,
        }
      : PROJECT_COLOR_SCHEMES[link.scheme]

  const style: CSSProperties = {
    ["--button-accent-light" as string]: scheme.accentColor.light,
    ["--button-accent-dark" as string]: scheme.accentColor.dark,
    ["--button-soft-light" as string]:
      link.scheme === "default" ? HOME_THEME.accentSoft.light : hexAlpha(scheme.accentColor.light, 0.14),
    ["--button-soft-dark" as string]:
      link.scheme === "default" ? HOME_THEME.accentSoft.dark : hexAlpha(scheme.accentColor.dark, 0.2),
    ["--button-text-light" as string]: scheme.textColorInverted.light,
    ["--button-text-dark" as string]: scheme.textColorInverted.dark,
  }

  const baseClassName = cn(
    "inline-flex items-center border font-semibold transition-all duration-200",
    sizeStyle.button,
    link.variant === "solid"
      ? "border-[var(--button-accent-light)] bg-[var(--button-accent-light)] text-[var(--button-text-light)] hover:opacity-92 dark:border-[var(--button-accent-dark)] dark:bg-[var(--button-accent-dark)] dark:text-[var(--button-text-dark)]"
      : "border-[var(--button-accent-light)] text-[var(--button-accent-light)] hover:bg-[var(--button-soft-light)] dark:border-[var(--button-accent-dark)] dark:text-[var(--button-accent-dark)] dark:hover:bg-[var(--button-soft-dark)]",
    className
  )

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer"
        className={baseClassName}
        style={style}
      >
        <ButtonContent icon={link.icon} label={link.label} iconClassName={sizeStyle.icon} />
      </a>
    )
  }

  return (
    <Link
      href={link.href}
      className={baseClassName}
      style={style}
    >
      <ButtonContent icon={link.icon} label={link.label} iconClassName={sizeStyle.icon} />
    </Link>
  )
}
