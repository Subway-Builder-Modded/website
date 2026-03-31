import { existsSync, readFileSync, statSync } from 'fs';
import path from 'path';
import type {
  DailyDataPoint,
  ListingType,
  RegistryAnalyticsData,
  RegistryAuthorDailyRow,
  RegistryAuthorRow,
  RegistryListingDailyRow,
  RegistryListingProjectRow,
  RegistryListingRow,
  RegistryMapPopulationRow,
  RegistryProjectRow,
  RegistryProjectTrendingRow,
  RegistryTrendingRow,
} from '@/types/registry-analytics';

export type {
  DailyDataPoint,
  ListingType,
  RegistryAnalyticsData,
  RegistryAuthorDailyRow,
  RegistryAuthorRow,
  RegistryListingDailyRow,
  RegistryListingProjectRow,
  RegistryListingRow,
  RegistryMapPopulationRow,
  RegistryProjectRow,
  RegistryProjectTrendingRow,
  RegistryTrendingRow,
} from '@/types/registry-analytics';

// ---------------------------------------------------------------------------
// CSV parser
// ---------------------------------------------------------------------------

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i]!;
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text
    .trim()
    .split('\n')
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]!);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    return Object.fromEntries(
      headers.map((h, i) => [h.trim(), (values[i] ?? '').trim()]),
    );
  });
}

function resolveAnalyticsDir(): string {
  const envDir = process.env['REGISTRY_ANALYTICS_DIR']?.trim();
  const candidates = [
    envDir || '',
    path.join(process.cwd(), '..', 'The-Railyard', 'analytics'),
    path.join(process.cwd(), 'The-Railyard', 'analytics'),
    path.join(process.cwd(), 'analytics'),
    path.join(process.cwd(), 'public', 'analytics'),
  ].filter(Boolean);

  for (const dir of candidates) {
    if (existsSync(path.join(dir, 'most_popular_all_time.csv'))) {
      return dir;
    }
  }

  // Keep a stable fallback path for callers; readFile() handles missing files safely.
  return path.join(process.cwd(), 'analytics');
}

const ANALYTICS_DIR = resolveAnalyticsDir();
let warnedMissingAnalytics = false;

function readFile(filename: string): Record<string, string>[] {
  const fullPath = path.join(ANALYTICS_DIR, filename);
  try {
    const text = readFileSync(fullPath, 'utf-8');
    return parseCSV(text);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      if (!warnedMissingAnalytics) {
        warnedMissingAnalytics = true;
        console.warn(
          `[registry] Analytics directory not found or incomplete at "${ANALYTICS_DIR}". Building with empty registry data.`,
        );
      }
      return [];
    }
    throw error;
  }
}

function readAuthorAlias(row: Record<string, string>): string {
  const alias = (row['author_alias'] ?? '').trim();
  if (alias.length > 0) return alias;
  return (row['author'] ?? '').trim();
}

function readAttributionLink(row: Record<string, string>): string {
  const link = (row['attribution_link'] ?? '').trim();
  if (link.length > 0) return link;
  const authorId = (row['author'] ?? '').trim();
  return authorId ? `https://github.com/${authorId}` : '';
}

// ---------------------------------------------------------------------------
// Test/dev content to exclude
// ---------------------------------------------------------------------------

const TEST_IDS = new Set([
  'dep-test-mod',
  'dep-test-mod-nested',
  'test-mod-vulnscan',
]);

const TEST_PROJECT_KEYS = new Set([
  'subway-builder-modded/dependency-test-mod',
  'subway-builder-modded/test-mod-vulnerabilityscanning',
  'pswbsf/wilmington-nc',
]);

// ---------------------------------------------------------------------------
// Per-file parsers
// ---------------------------------------------------------------------------

function parseAllTime(): RegistryListingRow[] {
  const rows = readFile('most_popular_all_time.csv')
    .filter((r) => !TEST_IDS.has(r['id'] ?? ''))
    .map((r) => ({
      rank: 0, // assigned per-type below
      listing_type: r['listing_type'] as ListingType,
      id: r['id'] ?? '',
      name: r['name'] ?? '',
      author: r['author'] ?? '',
      author_alias: readAuthorAlias(r),
      attribution_link: readAttributionLink(r),
      total_downloads: Number(r['total_downloads']),
    }));

  // Assign rank per type so maps and mods are ranked independently
  let modRank = 1;
  let mapRank = 1;
  for (const row of rows) {
    row.rank = row.listing_type === 'mod' ? modRank++ : mapRank++;
  }
  return rows;
}

function parseTrending(filename: string): RegistryTrendingRow[] {
  return readFile(filename)
    .filter(
      (r) => !TEST_IDS.has(r['id'] ?? '') && Number(r['download_change']) > 0,
    )
    .map((r, i) => ({
      rank: i + 1,
      listing_type: r['listing_type'] as ListingType,
      id: r['id'] ?? '',
      name: r['name'] ?? '',
      author: r['author'] ?? '',
      author_alias: readAuthorAlias(r),
      attribution_link: readAttributionLink(r),
      download_change: Number(r['download_change']),
      current_total: Number(r['current_total']),
      baseline_total: Number(r['baseline_total']),
    }));
}

function parseAuthors(): RegistryAuthorRow[] {
  return readFile('authors_by_total_downloads.csv').map((r, i) => ({
    rank: i + 1,
    author: r['author'] ?? '',
    author_alias: readAuthorAlias(r),
    attribution_link: readAttributionLink(r),
    total_downloads: Number(r['total_downloads']),
    asset_count: Number(r['asset_count']),
    map_count: Number(r['map_count']),
    mod_count: Number(r['mod_count']),
  }));
}

function parseProjects(): RegistryProjectRow[] {
  return readFile('projects_most_popular_all_time.csv')
    .filter(
      (r) =>
        !TEST_PROJECT_KEYS.has(r['project_key'] ?? '') &&
        Number(r['total_downloads']) > 0,
    )
    .map((r, i) => ({
      rank: i + 1,
      project_key: r['project_key'] ?? '',
      project_name: r['project_name'] ?? '',
      listing_count: Number(r['listing_count']),
      total_downloads: Number(r['total_downloads']),
    }));
}

function parseProjectsTrending(filename: string): RegistryProjectTrendingRow[] {
  return readFile(filename)
    .filter(
      (r) =>
        !TEST_PROJECT_KEYS.has(r['project_key'] ?? '') &&
        Number(r['download_change']) > 0,
    )
    .map((r, i) => ({
      rank: i + 1,
      project_key: r['project_key'] ?? '',
      project_name: r['project_name'] ?? '',
      listing_count: Number(r['listing_count']),
      download_change: Number(r['download_change']),
      current_total: Number(r['current_total']),
      baseline_total: Number(r['baseline_total']),
    }));
}

function parseListingProjects(): RegistryListingProjectRow[] {
  return readFile('listing_projects.csv')
    .filter((r) => !TEST_IDS.has(r['id'] ?? ''))
    .map((r) => ({
      listing_type: r['listing_type'] as ListingType,
      id: r['id'] ?? '',
      name: r['name'] ?? '',
      project_key: r['project_key'] ?? '',
      project_name: r['project_name'] ?? '',
    }));
}

function parseMapPopulations(): RegistryMapPopulationRow[] {
  return readFile('maps_by_population.csv').map((r, i) => ({
    rank: i + 1,
    id: r['id'] ?? '',
    name: r['name'] ?? '',
    author: r['author'] ?? '',
    author_alias: readAuthorAlias(r),
    attribution_link: readAttributionLink(r),
    city_code: r['city_code'] ?? '',
    country: r['country'] ?? '',
    population: Number(r['population']),
    population_count: Number(r['population_count']),
    points_count: Number(r['points_count']),
  }));
}

// ---------------------------------------------------------------------------
// Daily data helpers (parse wide-format date columns into DailyDataPoint[])
// ---------------------------------------------------------------------------

function extractDailyPoints(row: Record<string, string>): DailyDataPoint[] {
  const points = Object.entries(row)
    .filter(([key]) => /^\d{4}_\d{2}_\d{2}$/.test(key))
    .map(([key, val]) => ({
      date: key.replace(/_/g, '-'),
      downloads: Number(val) || 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // The first snapshot is a baseline and not a true 1-day delta sample.
  // Start timeline series from the second snapshot onward.
  return points.length > 1 ? points.slice(1) : [];
}

export function loadListingDailyData(id: string): DailyDataPoint[] {
  const rows = readFile('most_popular_by_day.csv');
  const row = rows.find((r) => r['id'] === id);
  return row ? extractDailyPoints(row) : [];
}

export function loadAuthorDailyData(author: string): DailyDataPoint[] {
  const rows = readFile('authors_by_day.csv');
  const row = rows.find(
    (r) => (r['author'] ?? '').toLowerCase() === author.toLowerCase(),
  );
  return row ? extractDailyPoints(row) : [];
}

export function loadAllListingDailyData(): RegistryListingDailyRow[] {
  return readFile('most_popular_by_day.csv')
    .filter((r) => !TEST_IDS.has(r['id'] ?? ''))
    .map((r) => ({
      listing_type: r['listing_type'] as ListingType,
      id: r['id'] ?? '',
      dailyData: extractDailyPoints(r),
    }));
}

export function loadAllAuthorDailyData(): RegistryAuthorDailyRow[] {
  return readFile('authors_by_day.csv').map((r) => ({
    author: r['author'] ?? '',
    dailyData: extractDailyPoints(r),
  }));
}

// ---------------------------------------------------------------------------
// Snapshot label (date + time from file mtime)
// ---------------------------------------------------------------------------

function buildSnapshotLabel(): string {
  try {
    const mtime = statSync(
      path.join(ANALYTICS_DIR, 'most_popular_all_time.csv'),
    ).mtime;
    const y = mtime.getUTCFullYear();
    const mo = String(mtime.getUTCMonth() + 1).padStart(2, '0');
    const d = String(mtime.getUTCDate()).padStart(2, '0');
    const h = String(mtime.getUTCHours()).padStart(2, '0');
    const mi = String(mtime.getUTCMinutes()).padStart(2, '0');
    return `${y}-${mo}-${d} ${h}:${mi} UTC`;
  } catch {
    return 'Unknown';
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function loadRegistryAnalytics(): RegistryAnalyticsData {
  const allTime = parseAllTime();
  const trending1d = parseTrending('most_popular_last_1d.csv');
  const trending3d = parseTrending('most_popular_last_3d.csv');
  const trending7d = parseTrending('most_popular_last_7d.csv');
  const authors = parseAuthors();
  const projects = parseProjects();
  const projectsTrending1d = parseProjectsTrending(
    'projects_most_popular_last_1d.csv',
  );
  const projectsTrending3d = parseProjectsTrending(
    'projects_most_popular_last_3d.csv',
  );
  const projectsTrending7d = parseProjectsTrending(
    'projects_most_popular_last_7d.csv',
  );
  const listingProjects = parseListingProjects();
  const mapPopulations = parseMapPopulations();

  const totalDownloads = allTime.reduce((s, r) => s + r.total_downloads, 0);
  const mapRows = allTime.filter((r) => r.listing_type === 'map');
  const modRows = allTime.filter((r) => r.listing_type === 'mod');

  return {
    allTime,
    trending1d,
    trending3d,
    trending7d,
    authors,
    projects,
    projectsTrending1d,
    projectsTrending3d,
    projectsTrending7d,
    listingProjects,
    mapPopulations,
    snapshotLabel: buildSnapshotLabel(),
    totalDownloads,
    totalListings: allTime.length,
    totalAuthors: authors.length,
    mapCount: mapRows.length,
    modCount: modRows.length,
    mapDownloads: mapRows.reduce((s, r) => s + r.total_downloads, 0),
    modDownloads: modRows.reduce((s, r) => s + r.total_downloads, 0),
  };
}

// Pure data-processing helpers are in lib/registry-analytics-helpers.ts
// (safe to import from client components — no fs/path dependency)
export type {
  ListingAnalytics,
  AuthorAnalytics,
} from './registry-analytics-helpers';
export {
  getListingAnalytics,
  getAuthorAnalytics,
} from './registry-analytics-helpers';
