import type { Metadata } from 'next';

export const SITE_NAME = 'Subway Builder Modded';
export const SITE_DESCRIPTION =
  'The complete hub for everything modded in Subway Builder.';
export const SITE_URL_FALLBACK = 'https://subwaybuildermodded.com';
export const SITE_LOGO_PATH = '/logo.png';
export const SITE_OG_IMAGE_PATH = SITE_LOGO_PATH;

export function resolveSiteMetadataBase(
  configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL,
) {
  const siteUrl =
    configuredSiteUrl && configuredSiteUrl.trim().length > 0
      ? configuredSiteUrl
      : SITE_URL_FALLBACK;

  try {
    return new URL(siteUrl);
  } catch {
    return new URL(SITE_URL_FALLBACK);
  }
}

export function buildEmbedMetadata({
  title,
  description,
  image = SITE_OG_IMAGE_PATH,
}: {
  title: string;
  description: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
