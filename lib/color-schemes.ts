export type ProjectColorId =
  | "railyard"
  | "template-mod"
  | "creating-custom-maps"
  | "website"

export type ModeHex = {
  light: string
  dark: string
}

export type ThemedColorSet = {
    primaryHex: ModeHex
    secondaryHex: ModeHex
    tertiaryHex: ModeHex
  textHex: ModeHex
}

export function getModeHex(value: ModeHex, isDark: boolean) {
  return isDark ? value.dark : value.light
}

export const PROJECT_COLOR_SCHEMES: Record<ProjectColorId, ThemedColorSet> = {
  railyard: {
    primaryHex: {
        light: "#16775455",
        dark: "#42AD7F55",
    },
    secondaryHex: {
        light:"#04292055",
        dark: "#19D89C55",
    },
    tertiaryHex: {
        light: "#042920",
        dark: "#19D89C",
    },
    textHex: {
        light: "#232323",
        dark: "#F2F2F2",
    },
  },
  "template-mod": {
    primaryHex: {
        light: "#452A7155",
        dark: "#9678E655",
    },
    secondaryHex: {
        light: "#2D125955",
        dark: "#AE90FE55",
    },
    tertiaryHex: {
        light: "#2D1259",
        dark: "#AE90FE",
    },
    textHex: { 
        light: "#232323",
        dark: "#F2F2F2",
    },
  },
  "creating-custom-maps": {
    primaryHex: {
        light: "#C7375555",
        dark: "#D85D7855",
    },
    secondaryHex: {
        light: "#4A0B1A55",
        dark: "#FF8FA355",
    },
    tertiaryHex: {
        light: "#4A0B1A",
        dark: "#FF8FA3",
    },
    textHex: {
        light: "#232323",
        dark: "#F2F2F2",
    },
  },
  website: {
    primaryHex: {
        light: "#D8780055",
        dark: "#F2992E55",
    },
    secondaryHex: {
        light: "#5C260055",
        dark: "#FFBE7355",
    },
    
    tertiaryHex: {
        light: "#5C2600",
        dark: "#FFBE73",
    },
    textHex: {
        light: "#232323",
        dark: "#F2F2F2",
    },
  },
}
