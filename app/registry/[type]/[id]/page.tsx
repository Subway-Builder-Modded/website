import type { Metadata } from 'next';
import {
  loadListingDailyData,
  loadRegistryAnalytics,
} from '@/lib/registry-analytics';
import { RegistryListingPage } from '@/features/registry/components/registry-listing-page';
import {
  buildEmbedMetadata,
  buildNoEmbedMetadata,
} from '@/config/site/metadata';
import { getRegistryManifest } from '@/lib/railyard/registry.server';
import type { MapManifest } from '@/types/registry';
import type { ListingType } from '@/types/registry-analytics';

export const dynamicParams = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const data = loadRegistryAnalytics();
  const params = data.allTime.map((r) => ({
    type: r.listing_type,
    id: r.id,
  }));
  if (params.length > 0) return params;
  // Static export fallback when analytics files are unavailable in CI.
  return [
    { type: 'mod', id: '__registry-data-unavailable__' },
    { type: 'map', id: '__registry-data-unavailable__' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}): Promise<Metadata> {
  const { type, id } = await params;
  const data = loadRegistryAnalytics();
  const listing = data.allTime.find(
    (r) => r.id === id && r.listing_type === type,
  );

  if (!listing) {
    return buildNoEmbedMetadata({
      title: 'Not Found | Registry',
      description: 'This registry listing could not be found.',
    });
  }

  const typeName = type === 'mod' ? 'Mod' : 'Map';
  const authorDisplay = listing.author_alias?.trim() || listing.author;
  return buildEmbedMetadata({
    title: `${listing.name} | Registry`,
    description: `Stats for ${listing.name} — a Subway Builder Modded ${typeName.toLowerCase()} by ${authorDisplay}. ${listing.total_downloads.toLocaleString()} total downloads.`,
  });
}

export default async function RegistryListingRoute({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const data = loadRegistryAnalytics();
  const dailyData = loadListingDailyData(id);
  const manifest =
    type === 'map'
      ? await getRegistryManifest('maps', id)
      : type === 'mod'
        ? await getRegistryManifest('mods', id)
        : null;
  const mapManifest = type === 'map' ? (manifest as MapManifest | null) : null;
  const mapMetadata = mapManifest
    ? {
        sourceQuality: mapManifest.source_quality ?? null,
        levelOfDetail: mapManifest.level_of_detail ?? null,
      }
    : null;
  return (
    <RegistryListingPage
      data={data}
      type={type as ListingType}
      id={id}
      dailyData={dailyData}
      mapMetadata={mapMetadata}
    />
  );
}
