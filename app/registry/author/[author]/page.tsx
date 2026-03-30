import type { Metadata } from 'next';
import {
  loadAuthorDailyData,
  loadRegistryAnalytics,
} from '@/lib/registry-analytics';
import { RegistryAuthorPage } from '@/features/registry/components/registry-author-page';
import {
  buildEmbedMetadata,
  buildNoEmbedMetadata,
} from '@/config/site/metadata';

export const dynamicParams = false;
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const data = loadRegistryAnalytics();
  return data.authors.map((a) => ({
    author: a.author,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ author: string }>;
}): Promise<Metadata> {
  const { author } = await params;
  const data = loadRegistryAnalytics();
  const authorRow = data.authors.find(
    (a) => a.author.toLowerCase() === author.toLowerCase(),
  );

  if (!authorRow) {
    return buildNoEmbedMetadata({
      title: 'Not Found | Registry',
      description: 'This author could not be found.',
    });
  }

  return buildEmbedMetadata({
    title: `${authorRow.author_alias?.trim() || authorRow.author} | Registry`,
    description: `Registry stats for ${authorRow.author_alias?.trim() || authorRow.author} — ${authorRow.asset_count} listing${authorRow.asset_count !== 1 ? 's' : ''} with ${authorRow.total_downloads.toLocaleString()} total downloads.`,
  });
}

export default async function RegistryAuthorRoute({
  params,
}: {
  params: Promise<{ author: string }>;
}) {
  const { author } = await params;
  const data = loadRegistryAnalytics();
  const dailyData = loadAuthorDailyData(author);
  return (
    <RegistryAuthorPage data={data} author={author} dailyData={dailyData} />
  );
}
