'use client';

import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

import {
  getAuthorDisplayName,
  RegistryFilterControls,
  SafeChartContainer,
  formatCount,
  getListingColor,
  MAP_COLOR,
  MOD_COLOR,
  type PeriodKey,
  RegistryTooltip,
  RankBadge,
  SectionHeader,
  TABLE_CELL_CLS,
  TABLE_CELL_NUMERIC_CLS,
  TABLE_HEADER_CLS,
  TABLE_HEADER_RIGHT_CLS,
  TABLE_ROW_CLS,
  truncateName,
  useClientReady,
} from '@/features/registry/components/registry-shared';
import type {
  ListingType,
  RegistryAnalyticsData,
  RegistryListingRow,
  RegistryTrendingRow,
} from '@/types/registry-analytics';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PeriodData =
  | { kind: 'alltime'; rows: RegistryListingRow[] }
  | { kind: 'trending'; rows: RegistryTrendingRow[] };

type ChartEntry = {
  name: string;
  fullName: string;
  downloads: number;
  type: ListingType;
  author: string;
  id: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TOP_N = 10;

function allTimeToChart(rows: RegistryListingRow[]): ChartEntry[] {
  return rows.slice(0, TOP_N).map((r) => ({
    name: truncateName(r.name, 20),
    fullName: r.name,
    downloads: r.total_downloads,
    type: r.listing_type,
    author: getAuthorDisplayName(r),
    id: r.id,
  }));
}

function trendingToChart(rows: RegistryTrendingRow[]): ChartEntry[] {
  return rows.slice(0, TOP_N).map((r) => ({
    name: truncateName(r.name, 20),
    fullName: r.name,
    downloads: r.download_change,
    type: r.listing_type,
    author: getAuthorDisplayName(r),
    id: r.id,
  }));
}

// ---------------------------------------------------------------------------
// Listing search results — shows per-type rank
// ---------------------------------------------------------------------------

function ListingSearchResults({
  results,
  data,
}: {
  results: RegistryListingRow[];
  data: RegistryAnalyticsData;
}) {
  const mapResults = results.filter((row) => row.listing_type === 'map');
  const modResults = results.filter((row) => row.listing_type === 'mod');

  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/20 py-10 text-center text-sm text-muted-foreground">
        No listings match your search.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <SearchGroup title="Mods" rows={modResults} data={data} type="mod" />
      <SearchGroup title="Maps" rows={mapResults} data={data} type="map" />
    </div>
  );
}

function SearchGroup({
  title,
  rows,
  data,
  type,
}: {
  title: string;
  rows: RegistryListingRow[];
  data: RegistryAnalyticsData;
  type: ListingType;
}) {
  const accent = getListingColor(type);
  if (rows.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card ring-1 ring-foreground/5">
      <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
        <span
          className="size-2 rounded-sm"
          style={{ backgroundColor: accent }}
        />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title} ({rows.length})
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/35">
              <th className={TABLE_HEADER_CLS}>Name</th>
              <th className={`hidden ${TABLE_HEADER_CLS} sm:table-cell`}>
                Author
              </th>
              <th className={TABLE_HEADER_RIGHT_CLS}>Downloads</th>
              <th className={TABLE_HEADER_RIGHT_CLS}>+24h</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const trend1d = data.trending1d.find((t) => t.id === row.id);
              return (
                <tr key={row.id} className={TABLE_ROW_CLS}>
                  <td className={TABLE_CELL_CLS}>
                    <span className="inline-flex items-center gap-2">
                      <RankBadge rank={row.rank} />
                      <Link
                        href={`/registry/${row.listing_type}/${row.id}`}
                        className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
                      >
                        {row.name}
                      </Link>
                    </span>
                  </td>
                  <td
                    className={`hidden ${TABLE_CELL_CLS} text-muted-foreground sm:table-cell`}
                  >
                    <Link
                      href={`/registry/author/${encodeURIComponent(row.author)}`}
                      className="transition-colors hover:text-foreground"
                    >
                      {getAuthorDisplayName(row)}
                    </Link>
                  </td>
                  <td
                    className={`${TABLE_CELL_NUMERIC_CLS} font-semibold`}
                    style={{ color: accent }}
                  >
                    {row.total_downloads.toLocaleString()}
                  </td>
                  <td
                    className={`${TABLE_CELL_NUMERIC_CLS} text-muted-foreground`}
                  >
                    {trend1d
                      ? `+${trend1d.download_change.toLocaleString()}`
                      : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bar chart for a single type
// ---------------------------------------------------------------------------

function TypeBarChart({
  data,
  type,
  isAllTime,
}: {
  data: ChartEntry[];
  type: ListingType;
  isAllTime: boolean;
}) {
  const isClientReady = useClientReady();
  const color = getListingColor(type);
  const chartHeight = 396;

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground"
        style={{ height: 120 }}
      >
        No data for this period
      </div>
    );
  }
  if (!isClientReady) {
    return <div style={{ height: chartHeight, width: '100%' }} />;
  }

  return (
    <SafeChartContainer height={chartHeight}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            horizontal={false}
            vertical
            stroke="var(--border)"
            strokeOpacity={0.6}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              isAllTime ? formatCount(v) : `+${formatCount(v)}`
            }
            tickMargin={6}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={136}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => (
              <RegistryTooltip
                active={active}
                payload={payload as unknown[]}
                label={label}
                valuePrefix={isAllTime ? '' : '+'}
              />
            )}
            cursor={{ fill: 'var(--muted)', fillOpacity: 0.4 }}
            wrapperStyle={{ outline: 'none' }}
          />
          <Bar dataKey="downloads" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((_, i) => (
              <Cell
                key={`cell-${i}`}
                fill={color}
                fillOpacity={0.85 - i * 0.03}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </SafeChartContainer>
  );
}

// ---------------------------------------------------------------------------
// Table for a single type — per-type index rank (1-based)
// ---------------------------------------------------------------------------

function TypeTable({
  data,
  type,
  isAllTime,
}: {
  data: RegistryListingRow[] | RegistryTrendingRow[];
  type: ListingType;
  isAllTime: boolean;
}) {
  const rows = data.filter((r) => r.listing_type === type).slice(0, 20);
  const color = getListingColor(type);

  if (rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className={TABLE_HEADER_CLS}>#</th>
            <th className={TABLE_HEADER_CLS}>Name</th>
            <th className={`hidden ${TABLE_HEADER_CLS} sm:table-cell`}>
              Author
            </th>
            <th className={TABLE_HEADER_RIGHT_CLS}>Downloads</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isTrending = !isAllTime && 'download_change' in row;
            return (
              <tr key={row.id} className={TABLE_ROW_CLS}>
                <td className={TABLE_CELL_CLS}>
                  <RankBadge rank={i + 1} />
                </td>
                <td className={TABLE_CELL_CLS}>
                  <Link
                    href={`/registry/${type}/${row.id}`}
                    className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
                  >
                    {row.name}
                  </Link>
                </td>
                <td
                  className={`hidden ${TABLE_CELL_CLS} text-muted-foreground sm:table-cell`}
                >
                  <Link
                    href={`/registry/author/${encodeURIComponent(row.author)}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {getAuthorDisplayName(row)}
                  </Link>
                </td>
                <td
                  className={`${TABLE_CELL_NUMERIC_CLS} font-semibold`}
                  style={{ color }}
                >
                  {isTrending
                    ? `+${(row as RegistryTrendingRow).download_change.toLocaleString()}`
                    : (
                        row as RegistryListingRow
                      ).total_downloads.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Split panel — mods + maps side by side
// ---------------------------------------------------------------------------

function SplitPanel({
  periodData,
  isAllTime,
}: {
  periodData: PeriodData;
  isAllTime: boolean;
}) {
  const allRows = periodData.rows;

  const modsChart =
    periodData.kind === 'alltime'
      ? allTimeToChart(
          (allRows as RegistryListingRow[]).filter(
            (r) => r.listing_type === 'mod',
          ),
        )
      : trendingToChart(
          (allRows as RegistryTrendingRow[]).filter(
            (r) => r.listing_type === 'mod',
          ),
        );

  const mapsChart =
    periodData.kind === 'alltime'
      ? allTimeToChart(
          (allRows as RegistryListingRow[]).filter(
            (r) => r.listing_type === 'map',
          ),
        )
      : trendingToChart(
          (allRows as RegistryTrendingRow[]).filter(
            (r) => r.listing_type === 'map',
          ),
        );

  return (
    <div className="grid gap-8 xl:grid-cols-2">
      {/* Mods */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span
            className="inline-block size-2.5 rounded-sm"
            style={{ backgroundColor: MOD_COLOR, opacity: 0.88 }}
          />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Mods
          </h3>
        </div>
        <TypeBarChart data={modsChart} type="mod" isAllTime={isAllTime} />
        <div className="mt-4">
          <TypeTable data={allRows} type="mod" isAllTime={isAllTime} />
        </div>
      </div>

      {/* Maps */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span
            className="inline-block size-2.5 rounded-sm"
            style={{ backgroundColor: MAP_COLOR, opacity: 0.88 }}
          />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Maps
          </h3>
        </div>
        <TypeBarChart data={mapsChart} type="map" isAllTime={isAllTime} />
        <div className="mt-4">
          <TypeTable data={allRows} type="map" isAllTime={isAllTime} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export function RegistryTrendingSection({
  data,
}: {
  data: RegistryAnalyticsData;
}) {
  const [period, setPeriod] = useState<PeriodKey>('all');
  const [query, setQuery] = useState('');

  const isSearching = query.trim().length > 0;

  const searchResults = isSearching
    ? data.allTime
        .filter(
          (r) =>
            r.name.toLowerCase().includes(query.toLowerCase()) ||
            r.author.toLowerCase().includes(query.toLowerCase()) ||
            (r.author_alias ?? '')
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            r.id.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 30)
    : [];

  const periodData: PeriodData =
    period === 'all'
      ? { kind: 'alltime', rows: data.allTime }
      : period === '1d'
        ? { kind: 'trending', rows: data.trending1d }
        : period === '3d'
          ? { kind: 'trending', rows: data.trending3d }
          : { kind: 'trending', rows: data.trending7d };

  return (
    <section className="mb-12">
      <SectionHeader icon={TrendingUp} title="Rankings" />

      <RegistryFilterControls
        period={!isSearching ? period : undefined}
        onPeriodChange={setPeriod}
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search listings by name, author, or ID..."
      />

      {isSearching ? (
        <ListingSearchResults results={searchResults} data={data} />
      ) : (
        <SplitPanel periodData={periodData} isAllTime={period === 'all'} />
      )}
    </section>
  );
}
