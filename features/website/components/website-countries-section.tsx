'use client';

import { useMemo, useState } from 'react';
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
import { Globe2 } from 'lucide-react';
import type {
  WebsiteAnalyticsData,
  WebsiteAnalyticsPeriod,
} from '@/types/website-analytics';
import { getCountryFlagIcon } from '@/lib/railyard/flags';
import {
  EmptyState,
  SafeChartContainer,
  WEBSITE_ACCENT_COLOR,
  WEBSITE_TABLE_CELL_CLS,
  WEBSITE_TABLE_HEADER_CLS,
  WEBSITE_TABLE_NUMERIC_CLS,
  WEBSITE_TABLE_ROW_CLS,
  WebsitePeriodToggle,
  WebsiteRankBadge,
  WebsiteSectionHeader,
  formatCompactNumber,
  useClientReady,
} from './website-shared';

type CountryChartRow = {
  label: string;
  fullName: string;
  visits: number;
};

function CountriesChart({ rows }: { rows: CountryChartRow[] }) {
  const isClientReady = useClientReady();

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No country chart data"
        description="Add countries in the snapshot to display this chart."
      />
    );
  }

  if (!isClientReady) {
    return <div style={{ height: 360, width: '100%' }} />;
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Top Countries by Visits
      </p>
      <SafeChartContainer height={360}>
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
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
              tickFormatter={(value: number) => formatCompactNumber(value)}
              tickMargin={6}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={132}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const entry = payload[0]?.payload as
                  | CountryChartRow
                  | undefined;
                const value = Number(payload[0]?.value ?? 0);
                return (
                  <div className="rounded-lg bg-overlay/75 p-2.5 text-xs text-overlay-fg ring ring-current/10 backdrop-blur-lg">
                    <span className="font-semibold">
                      {entry?.fullName ?? 'Unknown'}
                    </span>
                    <div className="mt-1">{value.toLocaleString()} visits</div>
                  </div>
                );
              }}
              cursor={{ fill: 'var(--muted)', fillOpacity: 0.4 }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Bar
              dataKey="visits"
              radius={[0, 4, 4, 0]}
              maxBarSize={18}
              activeBar={false}
            >
              {rows.map((_, index) => (
                <Cell
                  key={`country-cell-${index}`}
                  fill={WEBSITE_ACCENT_COLOR}
                  fillOpacity={0.9 - index * 0.05}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </SafeChartContainer>
    </div>
  );
}

export function WebsiteCountriesSection({
  data,
}: {
  data: WebsiteAnalyticsData;
}) {
  const [period, setPeriod] = useState<WebsiteAnalyticsPeriod>('7d');

  const topCountries = useMemo(
    () =>
      [...data.countries]
        .sort((a, b) => b.visitors[period] - a.visitors[period])
        .slice(0, 30),
    [data.countries, period],
  );

  const chartRows: CountryChartRow[] = topCountries.slice(0, 10).map((row) => ({
    label:
      row.country.length > 18 ? `${row.country.slice(0, 17)}…` : row.country,
    fullName: row.country,
    visits: row.visitors[period],
  }));

  return (
    <section className="mb-12">
      <WebsiteSectionHeader icon={Globe2} title="Countries" />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <WebsitePeriodToggle value={period} onChange={setPeriod} includeAll />
      </div>

      <CountriesChart rows={chartRows} />

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card ring-1 ring-foreground/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/35">
              <th className={WEBSITE_TABLE_HEADER_CLS}>#</th>
              <th className={WEBSITE_TABLE_HEADER_CLS}>Country</th>
              <th className={WEBSITE_TABLE_HEADER_CLS}>Visits</th>
            </tr>
          </thead>
          <tbody>
            {topCountries.map((row, index) => {
              const FlagIcon = getCountryFlagIcon(row.countryCode);
              return (
                <tr key={row.country} className={WEBSITE_TABLE_ROW_CLS}>
                  <td className={WEBSITE_TABLE_CELL_CLS}>
                    <WebsiteRankBadge rank={index + 1} />
                  </td>
                  <td className={WEBSITE_TABLE_CELL_CLS}>
                    <span className="inline-flex items-center gap-2 font-medium text-foreground">
                      {FlagIcon ? (
                        <FlagIcon className="h-3.5 w-auto rounded-[2px]" />
                      ) : null}
                      {row.country}
                    </span>
                  </td>
                  <td
                    className={`${WEBSITE_TABLE_NUMERIC_CLS} font-semibold text-foreground`}
                  >
                    {row.visitors[period].toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
