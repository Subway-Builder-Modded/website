'use client';

import Link from 'next/link';
import { Download, ExternalLink, Map, Package, TrendingUp } from 'lucide-react';
import {
  Stat,
  StatDescription,
  StatIndicator,
  StatLabel,
  StatValue,
} from '@/components/ui/stat';
import type {
  DailyDataPoint,
  RegistryAnalyticsData,
} from '@/types/registry-analytics';
import { getAuthorAnalytics } from '@/lib/registry-analytics-helpers';
import {
  DailyDownloadChart,
  getAuthorDisplayName,
  MAP_COLOR,
  MOD_COLOR,
  RankBadge,
  RegistryDetailShell,
  SectionHeader,
  TABLE_HEADER_CLS,
  TABLE_HEADER_RIGHT_CLS,
  TABLE_CELL_CLS,
  TABLE_CELL_NUMERIC_CLS,
  TABLE_ROW_CLS,
} from './registry-shared';

const STAT_HEADER_CLS =
  'text-xs font-semibold uppercase tracking-wider text-muted-foreground';

// ---------------------------------------------------------------------------
// Listings table
// ---------------------------------------------------------------------------

function ListingsTable({
  listings,
  type,
  color,
}: {
  listings: {
    id: string;
    name: string;
    rank: number;
    total_downloads: number;
  }[];
  type: 'map' | 'mod';
  color: string;
}) {
  if (listings.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <colgroup>
          <col className="w-12" />
          <col />
          <col className="w-[34%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className={TABLE_HEADER_CLS}>#</th>
            <th className={TABLE_HEADER_CLS}>Name</th>
            <th className={TABLE_HEADER_RIGHT_CLS}>Downloads</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((r) => (
            <tr key={r.id} className={TABLE_ROW_CLS}>
              <td className={TABLE_CELL_CLS}>
                <RankBadge rank={r.rank} />
              </td>
              <td className={TABLE_CELL_CLS}>
                <Link
                  href={`/registry/${type}/${r.id}`}
                  className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
                >
                  {r.name}
                </Link>
              </td>
              <td
                className={`${TABLE_CELL_NUMERIC_CLS} font-semibold`}
                style={{ color }}
              >
                {r.total_downloads.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function RegistryAuthorPage({
  data,
  author,
  dailyData,
}: {
  data: RegistryAnalyticsData;
  author: string;
  dailyData: DailyDataPoint[];
}) {
  const analytics = getAuthorAnalytics(data, author, dailyData);
  const authorRow = analytics.author;
  const displayName = authorRow ? getAuthorDisplayName(authorRow) : author;

  const totalDownloads =
    authorRow?.total_downloads ??
    [...analytics.maps, ...analytics.mods].reduce(
      (s, r) => s + r.total_downloads,
      0,
    );

  const mapDownloads = analytics.maps.reduce(
    (s, r) => s + r.total_downloads,
    0,
  );
  const modDownloads = analytics.mods.reduce(
    (s, r) => s + r.total_downloads,
    0,
  );
  const attributionHref =
    authorRow?.attribution_link?.trim() ||
    (analytics.githubUsername
      ? `https://github.com/${analytics.githubUsername}`
      : '');
  const attributionLabel = `Open ${displayName} attribution link`;
  const purpleIconStyle = {
    borderColor: 'color-mix(in srgb, var(--primary) 35%, transparent)',
    backgroundColor: 'color-mix(in srgb, var(--primary) 12%, transparent)',
    color: 'var(--primary)',
  };
  const modIconStyle = {
    borderColor: `${MOD_COLOR}59`,
    backgroundColor: `${MOD_COLOR}1a`,
    color: MOD_COLOR,
  };
  const mapIconStyle = {
    borderColor: `${MAP_COLOR}59`,
    backgroundColor: `${MAP_COLOR}1a`,
    color: MAP_COLOR,
  };

  return (
    <RegistryDetailShell
      title={displayName}
      subtitle="Registry stats for this author."
      snapshotLabel={data.snapshotLabel}
      actions={
        attributionHref ? (
          <a
            href={attributionHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/45 hover:text-foreground"
            aria-label={attributionLabel}
          >
            <ExternalLink className="size-4" />
          </a>
        ) : null
      }
    >
      {/* Summary stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat>
          <StatIndicator variant="icon" style={purpleIconStyle}>
            <Download />
          </StatIndicator>
          <StatLabel className={STAT_HEADER_CLS}>Total Downloads</StatLabel>
          <StatValue>{totalDownloads.toLocaleString()}</StatValue>
          <StatDescription>across all listings</StatDescription>
        </Stat>

        <Stat>
          <StatIndicator variant="icon" style={purpleIconStyle}>
            <TrendingUp />
          </StatIndicator>
          <StatLabel className={STAT_HEADER_CLS}>Author Rank</StatLabel>
          <StatValue>{authorRow ? `#${authorRow.rank}` : '—'}</StatValue>
          <StatDescription>by total downloads</StatDescription>
        </Stat>

        <Stat>
          <StatIndicator variant="icon" style={modIconStyle}>
            <Package />
          </StatIndicator>
          <StatLabel className={STAT_HEADER_CLS}>Mods Published</StatLabel>
          <StatValue>{analytics.mods.length}</StatValue>
          <StatDescription>
            {modDownloads.toLocaleString()} downloads
          </StatDescription>
        </Stat>

        <Stat>
          <StatIndicator variant="icon" style={mapIconStyle}>
            <Map />
          </StatIndicator>
          <StatLabel className={STAT_HEADER_CLS}>Maps Published</StatLabel>
          <StatValue>{analytics.maps.length}</StatValue>
          <StatDescription>
            {mapDownloads.toLocaleString()} downloads
          </StatDescription>
        </Stat>
      </div>

      {/* Daily download history */}
      {analytics.dailyData.length > 0 && (
        <section className="mb-12">
          <SectionHeader icon={TrendingUp} title="Download History" />
          <div className="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
            <DailyDownloadChart
              data={analytics.dailyData}
              color="var(--primary)"
              height={200}
            />
          </div>
        </section>
      )}

      {/* Mods */}
      {analytics.mods.length > 0 && (
        <section className="mb-12">
          <SectionHeader icon={Package} title="Mods" accent={MOD_COLOR} />
          <ListingsTable
            listings={analytics.mods}
            type="mod"
            color={MOD_COLOR}
          />
        </section>
      )}

      {/* Maps */}
      {analytics.maps.length > 0 && (
        <section className="mb-12">
          <SectionHeader icon={Map} title="Maps" accent={MAP_COLOR} />
          <ListingsTable
            listings={analytics.maps}
            type="map"
            color={MAP_COLOR}
          />
        </section>
      )}
    </RegistryDetailShell>
  );
}
