import { PROJECT_COLOR_SCHEMES, type ModeHex } from "@/config/theme/colors"

export type LineBulletThemeId = "default" | "railyard" | "template-mod"
export type LineBulletColorRole = "primaryHex" | "secondaryHex" | "tertiaryHex"
export type LineBulletTextRole = "textHex" | "textHexInverted"
export type LineBulletShape = "circle" | "diamond" | "triangle"
export type LineBulletSize = "sm" | "md" | "lg" | "xl"

export type LineBulletThemePalette = {
  primaryHex: ModeHex
  secondaryHex: ModeHex
  tertiaryHex: ModeHex
  textHex: ModeHex
  textHexInverted: ModeHex
}

export type LineBulletPreset = {
  shape?: LineBulletShape
  size?: LineBulletSize
  colorRole?: LineBulletColorRole
  textRole?: LineBulletTextRole
  hoverColorRole?: LineBulletColorRole
  invertOnHover?: boolean
}

export const LINE_BULLET_THEMES: Record<LineBulletThemeId, LineBulletThemePalette> = {
  default: {
    primaryHex: { light: "#000000", dark: "#FFFFFF" },
    secondaryHex: { light: "#1F2937", dark: "#E5E7EB" },
    tertiaryHex: { light: "#111827", dark: "#F3F4F6" },
    textHex: { light: "#232323", dark: "#F2F2F2" },
    textHexInverted: { light: "#FFFFFF", dark: "#232323" },
  },
  railyard: PROJECT_COLOR_SCHEMES.railyard,
  "template-mod": PROJECT_COLOR_SCHEMES["template-mod"],
}

export const LINE_BULLET_PRESETS: Record<string, LineBulletPreset> = {
  title: {
    shape: "circle",
    size: "sm",
    colorRole: "primaryHex",
    textRole: "textHexInverted",
  },
  "hub-title": {
    shape: "circle",
    size: "md",
    colorRole: "tertiaryHex",
    textRole: "textHex",
  },
  "railyard-feature": {
    shape: "circle",
    size: "md",
    colorRole: "primaryHex",
    textRole: "textHexInverted",
    hoverColorRole: "primaryHex",
  },
  "railyard-workflow": {
    shape: "circle",
    size: "sm",
    colorRole: "primaryHex",
    textRole: "textHexInverted",
    hoverColorRole: "primaryHex",
  },
  "route-chip": {
    shape: "circle",
    size: "sm",
    invertOnHover: true,
    textRole: "textHexInverted",
  },
}

function modeHexOrFallback(value: ModeHex | undefined, fallback: ModeHex): ModeHex {
  return value ?? fallback
}

export function getLineBulletTheme(themeId?: string | null): LineBulletThemePalette {
  if (!themeId) return LINE_BULLET_THEMES.default
  if (themeId in LINE_BULLET_THEMES) {
    return LINE_BULLET_THEMES[themeId as LineBulletThemeId]
  }
  return LINE_BULLET_THEMES.default
}

export function getLineBulletPreset(preset?: string | null): LineBulletPreset {
  if (!preset) return {}
  return LINE_BULLET_PRESETS[preset] ?? {}
}

export function resolveLineBulletModeHex(
  themeId: string | null | undefined,
  colorRole: LineBulletColorRole,
  override?: Partial<ModeHex>
) {
  const theme = getLineBulletTheme(themeId)
  const base = theme[colorRole]
  return {
    light: override?.light ?? base.light,
    dark: override?.dark ?? base.dark,
  }
}

export function resolveLineBulletTextModeHex(
  themeId: string | null | undefined,
  textRole: LineBulletTextRole,
  override?: Partial<ModeHex>
) {
  const theme = getLineBulletTheme(themeId)
  const base = theme[textRole]
  return {
    light: override?.light ?? base.light,
    dark: override?.dark ?? base.dark,
  }
}

export function resolveLineBulletHoverModeHex(
  themeId: string | null | undefined,
  colorRole: LineBulletColorRole,
  hoverColorRole?: LineBulletColorRole,
  override?: Partial<ModeHex>
) {
  const theme = getLineBulletTheme(themeId)
  const base = theme[hoverColorRole ?? colorRole]
  const fallback = modeHexOrFallback(base, theme[colorRole])
  return {
    light: override?.light ?? fallback.light,
    dark: override?.dark ?? fallback.dark,
  }
}

