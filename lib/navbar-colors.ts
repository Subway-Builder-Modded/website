import type { NavbarItemColors } from "@/config/navigation/navbar"

export type NavbarColorConfig = {
  colors?: NavbarItemColors
  color?: NavbarItemColors
}

export function getNavbarConfiguredColors(config?: NavbarColorConfig): NavbarItemColors | undefined {
  if (!config) return undefined
  return config.colors ?? config.color
}

export function getNavbarThemeColors(config: NavbarColorConfig | undefined, isDark: boolean) {
  const colors = getNavbarConfiguredColors(config)
  if (!colors) return undefined
  return isDark ? colors.dark : colors.light
}
