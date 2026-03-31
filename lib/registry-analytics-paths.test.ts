import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveRegistryAnalyticsDir } from '@/lib/registry-analytics-paths';

describe('resolveRegistryAnalyticsDir', () => {
  const cwd = '/repo/website';

  it('prefers explicit env path when sentinel exists', () => {
    const envPath = '/custom/analytics';
    const resolved = resolveRegistryAnalyticsDir({
      cwd,
      envDir: envPath,
      hasSentinelFile: (dir) => dir === envPath,
    });

    expect(resolved).toBe(envPath);
  });

  it('falls back to public railyard cache before legacy locations', () => {
    const cachePath = path.join(
      cwd,
      'public',
      'railyard',
      'registry-analytics',
    );
    const legacyPath = path.join(cwd, 'The-Railyard', 'analytics');
    const resolved = resolveRegistryAnalyticsDir({
      cwd,
      hasSentinelFile: (dir) => dir === cachePath || dir === legacyPath,
    });

    expect(resolved).toBe(cachePath);
  });

  it('returns stable default when no candidates exist', () => {
    const resolved = resolveRegistryAnalyticsDir({
      cwd,
      hasSentinelFile: () => false,
    });

    expect(resolved).toBe(path.join(cwd, 'analytics'));
  });
});
