import { NAVBAR_ITEMS, type NavbarDropdownItem, type NavbarItemColors } from "@/lib/navbar-config"

export type GitHubDropdownItemColors = NavbarItemColors

export type GitHubDropdownItem = NavbarDropdownItem & {
  title: string
  href: string
}

const githubItem = NAVBAR_ITEMS.find((item) => item.id === "github")

export const GITHUB_ORG_URL = githubItem?.href ?? "https://github.com/Subway-Builder-Modded"

export const GITHUB_DROPDOWN_ITEMS: GitHubDropdownItem[] = (githubItem?.dropdown ?? []).filter(
  (item): item is GitHubDropdownItem => Boolean(item.title && item.href),
)
