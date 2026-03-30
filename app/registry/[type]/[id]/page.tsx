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
import type { ListingType } from '@/types/registry-analytics';

export function generateStaticParams() {
  const data = loadRegistryAnalytics();
  return data.allTime.map((r) => ({
    type: r.listing_type,
    id: r.id,
  }));
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
  return (
    <RegistryListingPage
      data={data}
      type={type as ListingType}
      id={id}
      dailyData={dailyData}
    />
  );
}
