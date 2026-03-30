'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { Map, Package, Users } from 'lucide-react';

import {
  SearchField,
  formatCount,
  getAuthorDisplayName,
  MAP_COLOR,
  MOD_COLOR,
  RankBadge,
  SafeChartContainer,
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
  RegistryAnalyticsData,
  RegistryAuthorRow,
} from '@/types/registry-analytics';

// ---------------------------------------------------------------------------
// Downloads bar chart (top 10 by total downloads)
// ---------------------------------------------------------------------------

function DownloadsBarChart({ authors }: { authors: RegistryAuthorRow[] }) {
  const isClientReady = useClientReady();
  const chartData = authors.slice(0, 10).map((a) => ({
    name: truncateName(getAuthorDisplayName(a), 18),
    fullName: getAuthorDisplayName(a),
    downloads: a.total_downloads,
  }));

  if (!isClientReady) {
    return <div style={{ height: 320, width: '100%' }} />;
  }

  return (
    <SafeChartContainer height={320}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 24, bottom: 4, left: 0 }}
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
            tickFormatter={(v: number) => formatCount(v)}
            tickMargin={6}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            width={132}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-lg bg-overlay/75 p-2.5 text-xs text-overlay-fg ring ring-current/10 backdrop-blur-lg">
                  <span className="font-semibold">
                    {(payload[0]?.payload as { fullName?: string } | undefined)
                      ?.fullName ?? (label as string)}
                  </span>
                  <div className="mt-1">
                    {(payload[0]!.value as number).toLocaleString()} downloads
                  </div>
                </div>
              );
            }}
            cursor={{ fill: 'var(--muted)', fillOpacity: 0.4 }}
            wrapperStyle={{ outline: 'none' }}
          />
          <Bar dataKey="downloads" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {chartData.map((_, i) => (
              <Cell
                key={`cell-${i}`}
                fill={MOD_COLOR}
                fillOpacity={0.9 - i * 0.055}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </SafeChartContainer>
  );
}

// ---------------------------------------------------------------------------
// Authors table
// ---------------------------------------------------------------------------

const MAX_AUTHORS = 20;

function AuthorRow({ row }: { row: RegistryAuthorRow }) {
  return (
    <tr key={row.author} className={TABLE_ROW_CLS}>
      <td className={TABLE_CELL_CLS}>
        <RankBadge rank={row.rank} />
      </td>
      <td className={TABLE_CELL_CLS}>
        <Link
          href={`/registry/author/${encodeURIComponent(row.author)}`}
          className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          {getAuthorDisplayName(row)}
        </Link>
      </td>
      <td className={`${TABLE_CELL_NUMERIC_CLS} font-semibold text-foreground`}>
        {row.total_downloads.toLocaleString()}
      </td>
      <td
        className={`hidden ${TABLE_CELL_NUMERIC_CLS} sm:table-cell`}
        style={{ color: MAP_COLOR }}
      >
        {row.map_count}
      </td>
      <td
        className={`hidden ${TABLE_CELL_NUMERIC_CLS} sm:table-cell`}
        style={{ color: MOD_COLOR }}
      >
        {row.mod_count}
      </td>
      <td
        className={`hidden ${TABLE_CELL_NUMERIC_CLS} text-muted-foreground md:table-cell`}
      >
        {row.asset_count}
      </td>
    </tr>
  );
}

function AuthorsTable({ authors }: { authors: RegistryAuthorRow[] }) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? authors.filter((a) =>
        [a.author, a.author_alias ?? '']
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
    : authors;
  const visible = filtered.slice(0, MAX_AUTHORS);

  return (
    <div>
      <SearchField
        placeholder="Search authors..."
        value={query}
        onChange={setQuery}
        className="mb-3"
      />

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className={TABLE_HEADER_CLS}>#</th>
              <th className={TABLE_HEADER_CLS}>Author</th>
              <th className={TABLE_HEADER_RIGHT_CLS}>Downloads</th>
              <th className={`hidden ${TABLE_HEADER_RIGHT_CLS} sm:table-cell`}>
                <span className="inline-flex items-center gap-1">
                  <Map className="size-3" style={{ color: MAP_COLOR }} />
                  Maps
                </span>
              </th>
              <th className={`hidden ${TABLE_HEADER_RIGHT_CLS} sm:table-cell`}>
                <span className="inline-flex items-center gap-1">
                  <Package className="size-3" style={{ color: MOD_COLOR }} />
                  Mods
                </span>
              </th>
              <th className={`hidden ${TABLE_HEADER_RIGHT_CLS} md:table-cell`}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-sm text-muted-foreground"
                >
                  No authors match your search.
                </td>
              </tr>
            ) : (
              visible.map((a) => <AuthorRow key={a.author} row={a} />)
            )}
          </tbody>
        </table>
      </div>

      {!query.trim() && filtered.length > MAX_AUTHORS && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Showing {MAX_AUTHORS} of {filtered.length} authors. Use search to find
          more.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export function RegistryAuthorsSection({
  data,
}: {
  data: RegistryAnalyticsData;
}) {
  return (
    <section className="mb-12">
      <SectionHeader icon={Users} title="Authors" />

      <div className="mb-8 rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Top 10 by Downloads
        </p>
        <DownloadsBarChart authors={data.authors} />
      </div>

      {/* Table */}
      <AuthorsTable authors={data.authors} />
    </section>
  );
}
