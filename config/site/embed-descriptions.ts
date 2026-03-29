type EmbedDescriptionOverrideMap = Record<string, string>;

// Define per-page embed descriptions here.
// Keys are absolute pathname values (for example: "/railyard/docs/v0.2/players").
export const EMBED_DESCRIPTION_OVERRIDES: EmbedDescriptionOverrideMap = {};

export function resolveEmbedDescription(
  pathname: string,
  fallback: string,
): string {
  const override = EMBED_DESCRIPTION_OVERRIDES[pathname]?.trim();
  return override && override.length > 0 ? override : fallback;
}
