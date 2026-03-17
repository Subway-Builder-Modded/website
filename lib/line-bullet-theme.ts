import { PROJECT_COLOR_SCHEMES } from "@/lib/color-schemes"

const DEFAULT_BULLET_THEME = {
  bulletColor: "#000000",
  textColor: "#FFFFFF",
} as const

const THEMED_BULLET_COLORS: Record<string, { bulletColor: string; textColor: string }> = {
  railyard: {
    bulletColor: PROJECT_COLOR_SCHEMES.railyard.primaryHex.light,
    textColor: PROJECT_COLOR_SCHEMES.railyard.textHex.light,
  },
  "template-mod": {
    bulletColor: PROJECT_COLOR_SCHEMES["template-mod"].secondaryHex.light,
    textColor: PROJECT_COLOR_SCHEMES["template-mod"].textHex.light,
  },
  "creating-custom-maps": {
    bulletColor: PROJECT_COLOR_SCHEMES["creating-custom-maps"].secondaryHex.light,
    textColor: PROJECT_COLOR_SCHEMES["creating-custom-maps"].textHex.light,
  },
} as const

export function getLineBulletTheme(themeId?: string | null) {
  if (!themeId) return DEFAULT_BULLET_THEME
  return THEMED_BULLET_COLORS[themeId] ?? DEFAULT_BULLET_THEME
}

export const NON_THEMED_LINE_BULLET = DEFAULT_BULLET_THEME

