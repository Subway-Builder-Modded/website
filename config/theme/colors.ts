export type ProjectColorId = "railyard" | "template-mod" | "website"

export type ModeHex = {
  light: string
  dark: string
}

export type ThemedColorSet = {
  primaryHex: ModeHex
  secondaryHex: ModeHex
  tertiaryHex: ModeHex
  textHex: ModeHex
  textHexInverted: ModeHex
}

export function getModeHex(value: ModeHex, isDark: boolean) {
  return isDark ? value.dark : value.light
}

export const PROJECT_COLOR_SCHEMES: Record<ProjectColorId, ThemedColorSet> = {
  railyard: {
    primaryHex: {
      light: "#0B6B52",
      dark: "#19D89C",
    },
    secondaryHex: {
      light: "#0FA67855",
      dark: "#42AD7F55",
    },
    tertiaryHex: {
      light: "#0B6B5255",
      dark: "#19D89C55",
    },
    textHex: {
      light: "#232323",
      dark: "#F2F2F2",
    },
    textHexInverted: {
      light: "#F2F2F2",
      dark: "#232323",
    },
  },
  "template-mod": {
    primaryHex: {
      light: "#1D4ED8",
      dark: "#93C5FD",
    },
    secondaryHex: {
      light: "#2563EB55",
      dark: "#60A5FA55",
    },
    tertiaryHex: {
      light: "#1D4ED855",
      dark: "#93C5FD55",
    },
    textHex: {
      light: "#232323",
      dark: "#F2F2F2",
    },
    textHexInverted: {
      light: "#F2F2F2",
      dark: "#232323",
    },
  },
  website: {
    primaryHex: {
      light: "#C2410C",
      dark: "#FFBE73",
    },
    secondaryHex: {
      light: "#F9731655",
      dark: "#F2992E55",
    },
    tertiaryHex: {
      light: "#C2410C55",
      dark: "#FFBE7355",
    },
    textHex: {
      light: "#232323",
      dark: "#F2F2F2",
    },
    textHexInverted: {
      light: "#F2F2F2",
      dark: "#232323",
    },
  },
}
