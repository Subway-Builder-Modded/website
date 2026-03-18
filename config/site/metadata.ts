export const SITE_NAME = "Subway Builder Modded"
export const SITE_DESCRIPTION = "The complete hub for everything modded in Subway Builder."
export const SITE_URL_FALLBACK = "https://subwaybuildermodded.com"
export const SITE_LOGO_PATH = "/logo.png"

export function resolveSiteMetadataBase(configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL) {
  const siteUrl = configuredSiteUrl && configuredSiteUrl.trim().length > 0 ? configuredSiteUrl : SITE_URL_FALLBACK

  try {
    return new URL(siteUrl)
  } catch {
    return new URL(SITE_URL_FALLBACK)
  }
}
