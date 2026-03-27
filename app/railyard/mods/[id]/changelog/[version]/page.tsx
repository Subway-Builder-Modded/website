import { Suspense } from 'react';
import { ChangelogPage } from '@/components/railyard/changelog-page';

const BASE_URL =
  'https://raw.githubusercontent.com/Subway-Builder-Modded/The-Railyard/main';

export async function generateStaticParams(): Promise<
  { id: string; version: string }[]
> {
  const res = await fetch(`${BASE_URL}/mods/integrity.json`, {
    cache: 'no-store',
  });
  const data = await res.json();
  const listings = data?.listings ?? {};
  const params: { id: string; version: string }[] = [];
  for (const [id, entry] of Object.entries(listings)) {
    const versions: string[] =
      (entry as { complete_versions?: string[] }).complete_versions ?? [];
    for (const version of versions) {
      params.push({ id, version });
    }
  }
  return params;
}

export default async function ModChangelogPage({
  params,
}: {
  params: Promise<{ id: string; version: string }>;
}) {
  const { id, version } = await params;
  return (
    <Suspense fallback={null}>
      <ChangelogPage
        type="mods"
        id={id}
        version={decodeURIComponent(version)}
      />
    </Suspense>
  );
}
