import { PROJECT_COLOR_SCHEMES } from "@/lib/color-schemes"

const DEFAULT_BULLET_THEME = {
  bulletColor: "#000000",
  textColor: "#FFFFFF",
  darkBulletColor: "#FFFFFF",
  darkTextColor: "#000000",
} as const

const THEMED_BULLET_COLORS: Record<
  string,
  {
    bulletColor: string
    textColor: string
    darkBulletColor: string
    darkTextColor: string
  }
> = {
  railyard: {
    bulletColor: PROJECT_COLOR_SCHEMES.railyard.secondaryHex.light,
    textColor: PROJECT_COLOR_SCHEMES.railyard.textHex.light,
    darkBulletColor: PROJECT_COLOR_SCHEMES.railyard.secondaryHex.dark,
    darkTextColor: PROJECT_COLOR_SCHEMES.railyard.textHex.dark,
  },
  "template-mod": {
    bulletColor: PROJECT_COLOR_SCHEMES["template-mod"].secondaryHex.light,
    textColor: PROJECT_COLOR_SCHEMES["template-mod"].textHex.light,
    darkBulletColor: PROJECT_COLOR_SCHEMES["template-mod"].secondaryHex.dark,
    darkTextColor: PROJECT_COLOR_SCHEMES["template-mod"].textHex.dark,
  },
} as const

export function getLineBulletTheme(themeId?: string | null) {
  if (!themeId) return DEFAULT_BULLET_THEME
  return THEMED_BULLET_COLORS[themeId] ?? DEFAULT_BULLET_THEME
}

export const NON_THEMED_LINE_BULLET = DEFAULT_BULLET_THEME

