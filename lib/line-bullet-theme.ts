const DEFAULT_BULLET_THEME = {
  bulletColor: "#FFFFFF",
  textColor: "#000000",
} as const

const THEMED_BULLET_COLORS: Record<string, { bulletColor: string; textColor: string }> = {
  railyard: {
    bulletColor: "#00A97A",
    textColor: "#032D23",
  },
  "template-mod": {
    bulletColor: "#7D52E8",
    textColor: "#311362",
  },
  "creating-custom-maps": {
    bulletColor: "#2E6FCC",
    textColor: "#192754",
  },
  contributing: {
    bulletColor: "#C98600",
    textColor: "#471F07",
  },
  legacy: {
    bulletColor: "#C93A57",
    textColor: "#4D091C",
  },
} as const

export function getLineBulletTheme(themeId?: string | null) {
  if (!themeId) return DEFAULT_BULLET_THEME
  return THEMED_BULLET_COLORS[themeId] ?? DEFAULT_BULLET_THEME
}

export const NON_THEMED_LINE_BULLET = DEFAULT_BULLET_THEME
