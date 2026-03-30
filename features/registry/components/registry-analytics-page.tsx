'use client';

import { LineChart, LayoutGrid, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { cn } from '@/lib/utils';
import type { RegistryAnalyticsData } from '@/types/registry-analytics';

import { RegistrySummaryStats } from './registry-summary-stats';
import { RegistryTrendingSection } from './registry-trending-section';
import { RegistryAuthorsSection } from './registry-authors-section';
import { RegistryBreakdownSection } from './registry-breakdown-section';

const PAGE_HEADER_SCHEME = {
  accent: { light: '#9d4edd', dark: '#c77dff' },
};

type TabKey = 'overview' | 'content' | 'authors';

const TABS: {
  key: TabKey;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'content', label: 'Content', icon: TrendingUp },
  { key: 'authors', label: 'Authors', icon: Users },
];

export function RegistryAnalyticsPage({
  data,
}: {
  data: RegistryAnalyticsData;
}) {
  const [active, setActive] = useState<TabKey>('overview');

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        icon={LineChart}
        title="Registry"
        description="In-depth analytics and insights for Railyard-hosted content."
        colorScheme={PAGE_HEADER_SCHEME}
        badges={[{ text: `Updated: \`${data.snapshotLabel}\`` }]}
      />

      {/* Tab bar */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                'flex min-w-32 items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'border-primary/40 bg-primary/8 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground',
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {active === 'overview' && (
        <>
          <RegistrySummaryStats data={data} />
          <RegistryBreakdownSection data={data} />
        </>
      )}
      {active === 'content' && <RegistryTrendingSection data={data} />}
      {active === 'authors' && <RegistryAuthorsSection data={data} />}
    </div>
  );
}
