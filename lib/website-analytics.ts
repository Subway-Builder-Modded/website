import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import type {
  WebsiteAnalyticsData,
  WebsiteAnalyticsPeriod,
  WebsiteBrowserRow,
  WebsiteCountryRow,
  WebsiteDeviceRow,
  WebsiteOperatingSystemRow,
  WebsitePageRow,
  WebsiteScreenSizeRow,
  WebsiteSummaryStats,
  WebsiteTimeseriesRow,
} from '@/types/website-analytics';

export type {
  WebsiteAnalyticsData,
  WebsiteAnalyticsPeriod,
  WebsiteBrowserRow,
  WebsiteCountryRow,
  WebsiteDeviceRow,
  WebsiteOperatingSystemRow,
  WebsitePageRow,
  WebsiteScreenSizeRow,
  WebsiteSummaryStats,
  WebsiteTimeseriesRow,
} from '@/types/website-analytics';

type SnapshotMetadata = {
  snapshotLabel?: string;
  generatedAt?: string;
};

const PERIOD_KEYS: WebsiteAnalyticsPeriod[] = ['1d', '7d', '30d', 'all'];

function toNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function emptyPeriodMetrics(): Record<WebsiteAnalyticsPeriod, number> {
  return { '1d': 0, '7d': 0, '30d': 0, all: 0 };
}

function createZeroPageRow(pathname: string): WebsitePageRow {
  return {
    path: pathname,
    pageviews: emptyPeriodMetrics(),
    visitors: emptyPeriodMetrics(),
    entrances: emptyPeriodMetrics(),
  };
}

function parsePeriodMetrics(
  value: unknown,
): Record<WebsiteAnalyticsPeriod, number> {
  const input = (value ?? {}) as Record<string, unknown>;
  const metrics = emptyPeriodMetrics();

  for (const key of PERIOD_KEYS) {
    metrics[key] = toNumber(input[key]);
  }

  return metrics;
}

function normalizePath(pathname: string): string {
  const trimmed = pathname.trim();
  if (!trimmed) return '/';

  const pathWithoutHash = trimmed.split('#')[0] ?? trimmed;
  const pathWithoutQuery = pathWithoutHash.split('?')[0] ?? pathWithoutHash;
  const withLeadingSlash = pathWithoutQuery.startsWith('/')
    ? pathWithoutQuery
    : `/${pathWithoutQuery}`;

  if (withLeadingSlash === '/') return '/';
  return withLeadingSlash.replace(/\/+$/, '') || '/';
}

function isLikely404Path(pathname: string): boolean {
  const normalized = normalizePath(pathname).toLowerCase();
  return (
    normalized === '/404' ||
    normalized.startsWith('/404/') ||
    normalized.includes('/not-found') ||
    normalized.includes('/_not-found')
  );
}

function normalizeLabel(value: unknown, fallback: string): string {
  const label = String(value ?? '').trim();
  return label.length > 0 ? label : fallback;
}

function mergePageRows(rows: WebsitePageRow[]): WebsitePageRow[] {
  const map = new Map<string, WebsitePageRow>();

  for (const row of rows) {
    const key = normalizePath(row.path);
    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        path: key,
        pageviews: { ...row.pageviews },
        visitors: { ...row.visitors },
        entrances: row.entrances ? { ...row.entrances } : undefined,
      });
      continue;
    }

    for (const period of PERIOD_KEYS) {
      existing.pageviews[period] += row.pageviews[period];
      existing.visitors[period] += row.visitors[period];
      if (existing.entrances || row.entrances) {
        existing.entrances = existing.entrances ?? emptyPeriodMetrics();
        existing.entrances[period] += row.entrances?.[period] ?? 0;
      }
    }
  }

  return [...map.values()].sort((a, b) => b.pageviews.all - a.pageviews.all);
}

function parseSummary(value: unknown): WebsiteSummaryStats | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;

  return {
    pageviews: toNumber(row['pageviews']),
    visitors: toNumber(row['visitors']),
    topPage: normalizePath(String(row['topPage'] ?? '/')),
    topPageViews: toNumber(row['topPageViews']),
    topCountry: normalizeLabel(row['topCountry'], 'Unknown'),
    topCountryVisitors: toNumber(row['topCountryVisitors']),
    topDevice: normalizeLabel(row['topDevice'], 'Unknown'),
    topDeviceVisitors: toNumber(row['topDeviceVisitors']),
  };
}

function parseTimeseries(value: unknown): WebsiteTimeseriesRow[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((row) => {
      const item = (row ?? {}) as Record<string, unknown>;
      return {
        date: String(item['date'] ?? ''),
        pageviews: toNumber(item['pageviews']),
        visitors: toNumber(item['visitors']),
      };
    })
    .filter((row) => /^\d{4}-\d{2}-\d{2}$/.test(row.date))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function parsePages(
  value: unknown,
  validPaths?: Set<string>,
): WebsitePageRow[] {
  if (!Array.isArray(value)) return [];

  const rows = value.map((row) => {
    const item = (row ?? {}) as Record<string, unknown>;

    return {
      path: normalizePath(String(item['path'] ?? '/')),
      pageviews: parsePeriodMetrics(item['pageviews']),
      visitors: parsePeriodMetrics(item['visitors']),
      entrances: item['entrances']
        ? parsePeriodMetrics(item['entrances'])
        : undefined,
    };
  });

  const merged = mergePageRows(rows).filter((row) => {
    if (isLikely404Path(row.path)) return false;
    if (!validPaths) return true;
    return validPaths.has(row.path);
  });

  if (!validPaths || validPaths.size === 0) {
    return merged;
  }

  const pageMap = new Map(merged.map((row) => [row.path, row] as const));
  for (const validPath of validPaths) {
    if (!pageMap.has(validPath)) {
      pageMap.set(validPath, createZeroPageRow(validPath));
    }
  }

  return [...pageMap.values()].sort(
    (a, b) => b.pageviews.all - a.pageviews.all,
  );
}

function parseCountries(value: unknown): WebsiteCountryRow[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((row) => {
      const item = (row ?? {}) as Record<string, unknown>;
      const code = normalizeLabel(item['countryCode'] ?? item['code'], '');
      return {
        country: normalizeLabel(item['country'], 'Unknown'),
        countryCode: /^[A-Za-z]{2}$/.test(code)
          ? code.toUpperCase()
          : undefined,
        pageviews: parsePeriodMetrics(item['pageviews']),
        visitors: parsePeriodMetrics(item['visitors']),
      };
    })
    .sort((a, b) => b.visitors.all - a.visitors.all);
}

function parseTechnologyRows<T extends string>(
  value: unknown,
  key: T,
): Array<
  Record<T, string> & { visits: Record<WebsiteAnalyticsPeriod, number> }
> {
  if (!Array.isArray(value)) return [];

  return value
    .map((row) => {
      const item = (row ?? {}) as Record<string, unknown>;
      const metricSource =
        item['visits'] ?? item['visitors'] ?? item['pageviews'] ?? 0;
      const periodMetrics =
        typeof metricSource === 'number'
          ? {
              '1d': 0,
              '7d': 0,
              '30d': 0,
              all: toNumber(metricSource),
            }
          : parsePeriodMetrics(metricSource);
      return {
        [key]: normalizeLabel(item[key], 'Unknown'),
        visits: periodMetrics,
      } as Record<T, string> & {
        visits: Record<WebsiteAnalyticsPeriod, number>;
      };
    })
    .sort((a, b) => b.visits.all - a.visits.all);
}

function computeSummaryFallback(args: {
  pages: WebsitePageRow[];
  countries: WebsiteCountryRow[];
  devices: WebsiteDeviceRow[];
}): WebsiteSummaryStats {
  const topPage = args.pages[0];
  const topCountry = args.countries[0];
  const topDevice = args.devices[0];

  return {
    pageviews: args.pages.reduce((sum, row) => sum + row.pageviews.all, 0),
    visitors: args.pages.reduce((sum, row) => sum + row.visitors.all, 0),
    topPage: topPage?.path ?? '/',
    topPageViews: topPage?.pageviews.all ?? 0,
    topCountry: topCountry?.country ?? 'Unknown',
    topCountryVisitors: topCountry?.visitors.all ?? 0,
    topDevice: topDevice?.device ?? 'Unknown',
    topDeviceVisitors: topDevice?.visits.all ?? 0,
  };
}

function resolveWebsiteAnalyticsDir(): string {
  const envDir = process.env['WEBSITE_ANALYTICS_DIR']?.trim();
  const candidates = [
    envDir || '',
    path.join(process.cwd(), 'public', 'website-analytics'),
    path.join(process.cwd(), 'website-analytics'),
  ].filter(Boolean);

  for (const dir of candidates) {
    if (existsSync(path.join(dir, 'summary.json'))) {
      return dir;
    }
  }

  return path.join(process.cwd(), 'public', 'website-analytics');
}

const WEBSITE_ANALYTICS_DIR = resolveWebsiteAnalyticsDir();
let warnedMissingDirectory = false;

function readJsonFile<T>(filename: string, fallback: T): T {
  const fullPath = path.join(WEBSITE_ANALYTICS_DIR, filename);
  try {
    const text = readFileSync(fullPath, 'utf-8');
    return JSON.parse(text) as T;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      if (!warnedMissingDirectory) {
        warnedMissingDirectory = true;
        console.warn(
          `[website] Analytics snapshots missing at "${WEBSITE_ANALYTICS_DIR}". Building with empty website analytics data.`,
        );
      }
      return fallback;
    }
    if (error instanceof SyntaxError) {
      console.warn(
        `[website] Invalid JSON in ${filename}; using fallback dataset.`,
      );
      return fallback;
    }
    throw error;
  }
}

function readValidPathSet(): Set<string> | undefined {
  const values = readJsonFile<unknown[]>('valid-paths.json', []);
  if (!Array.isArray(values) || values.length === 0) return undefined;

  const normalized = values
    .map((value) => normalizePath(String(value ?? '')))
    .filter((value) => value.length > 0 && !isLikely404Path(value));

  return normalized.length > 0 ? new Set(normalized) : undefined;
}

function formatUtcSnapshot(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute} UTC`;
}

function buildSnapshotLabel(meta: SnapshotMetadata | null): string {
  if (meta?.snapshotLabel && meta.snapshotLabel.trim().length > 0) {
    return meta.snapshotLabel.trim();
  }

  if (meta?.generatedAt) {
    const parsed = new Date(meta.generatedAt);
    if (!Number.isNaN(parsed.getTime())) {
      return formatUtcSnapshot(parsed);
    }
  }

  try {
    const files = readdirSync(WEBSITE_ANALYTICS_DIR).filter((file) =>
      file.endsWith('.json'),
    );
    const latestTime = files.reduce<number>((latest, file) => {
      const mtime = statSync(path.join(WEBSITE_ANALYTICS_DIR, file)).mtimeMs;
      return Math.max(latest, mtime);
    }, 0);

    if (latestTime > 0) {
      return formatUtcSnapshot(new Date(latestTime));
    }
  } catch {
    return 'Unknown';
  }

  return 'Unknown';
}

export function loadWebsiteAnalytics(): WebsiteAnalyticsData {
  const metadata = readJsonFile<SnapshotMetadata | null>(
    'snapshot-meta.json',
    null,
  );
  const validPathSet = readValidPathSet();

  const pages = parsePages(
    readJsonFile<unknown[]>('pages.json', []),
    validPathSet,
  );
  const countries = parseCountries(
    readJsonFile<unknown[]>('countries.json', []),
  );
  const browsers = parseTechnologyRows(
    readJsonFile<unknown[]>('browsers.json', []),
    'browser',
  );
  const operatingSystems = parseTechnologyRows(
    readJsonFile<unknown[]>('operating-systems.json', []),
    'os',
  );
  const devices = parseTechnologyRows(
    readJsonFile<unknown[]>('devices.json', []),
    'device',
  );
  const screenSizes = parseTechnologyRows(
    readJsonFile<unknown[]>('screen-sizes.json', []),
    'size',
  );

  const summaryFallback = computeSummaryFallback({
    pages,
    countries,
    devices,
  });

  const summary =
    parseSummary(readJsonFile<unknown>('summary.json', {})) ?? summaryFallback;

  return {
    snapshotLabel: buildSnapshotLabel(metadata),
    summary,
    timeseries: parseTimeseries(readJsonFile<unknown[]>('timeseries.json', [])),
    pages,
    countries,
    browsers: browsers as WebsiteBrowserRow[],
    operatingSystems: operatingSystems as WebsiteOperatingSystemRow[],
    devices: devices as WebsiteDeviceRow[],
    screenSizes: screenSizes as WebsiteScreenSizeRow[],
  };
}
