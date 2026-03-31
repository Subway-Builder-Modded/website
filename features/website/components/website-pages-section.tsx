'use client';

import { useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import type {
  WebsiteAnalyticsData,
  WebsiteAnalyticsPeriod,
  WebsitePageRow,
} from '@/types/website-analytics';
import {
  EmptyState,
  WEBSITE_TABLE_CELL_CLS,
  WEBSITE_TABLE_HEADER_CLS,
  WEBSITE_TABLE_NUMERIC_CLS,
  WEBSITE_TABLE_ROW_CLS,
  WebsitePeriodToggle,
  WebsiteRankBadge,
  WebsiteSearchField,
  WebsiteSectionHeader,
} from './website-shared';

function PageTable({
  rows,
  period,
  title,
}: {
  rows: Array<WebsitePageRow & { rank: number }>;
  period: WebsiteAnalyticsPeriod;
  title: string;
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title={`No ${title.toLowerCase()} data`}
        description="This dataset will appear once snapshot rows are available."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card ring-1 ring-foreground/5">
      <table className="w-full table-fixed text-sm">
        <colgroup>
          <col className="w-14" />
          <col />
          <col className="w-28" />
        </colgroup>
        <thead>
          <tr className="border-b border-border bg-muted/35">
            <th className={WEBSITE_TABLE_HEADER_CLS}>#</th>
            <th className={WEBSITE_TABLE_HEADER_CLS}>Page</th>
            <th className={WEBSITE_TABLE_HEADER_CLS}>Visits</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.path} className={WEBSITE_TABLE_ROW_CLS}>
              <td className={WEBSITE_TABLE_CELL_CLS}>
                <WebsiteRankBadge rank={row.rank} />
              </td>
              <td className={WEBSITE_TABLE_CELL_CLS}>
                <span className="block truncate font-medium text-foreground">
                  {row.path}
                </span>
              </td>
              <td
                className={`${WEBSITE_TABLE_NUMERIC_CLS} font-semibold text-foreground`}
              >
                {row.pageviews[period].toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WebsitePagesSection({ data }: { data: WebsiteAnalyticsData }) {
  const [period, setPeriod] = useState<WebsiteAnalyticsPeriod>('7d');
  const [query, setQuery] = useState('');

  const filteredPages = useMemo<
    Array<WebsitePageRow & { rank: number }>
  >(() => {
    const globallyRankedRows = [...data.pages]
      .sort((a, b) => b.pageviews[period] - a.pageviews[period])
      .map((row, index) => ({ ...row, rank: index + 1 }));

    const trimmed = query.trim().toLowerCase();
    const rows =
      trimmed.length === 0
        ? globallyRankedRows
        : globallyRankedRows.filter((row) =>
            row.path.toLowerCase().includes(trimmed),
          );

    return trimmed.length === 0 ? rows.slice(0, 20) : rows;
  }, [data.pages, period, query]);

  return (
    <section className="mb-12">
      <WebsiteSectionHeader icon={FileText} title="Pages" />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <WebsitePeriodToggle value={period} onChange={setPeriod} includeAll />
        <WebsiteSearchField
          placeholder="Search paths..."
          value={query}
          onChange={setQuery}
          className="min-w-64 flex-1 sm:max-w-md"
        />
      </div>

      <PageTable rows={filteredPages} period={period} title="Pages" />
    </section>
  );
}
