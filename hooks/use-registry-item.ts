'use client';

import { useState, useEffect } from 'react';
import type { ModManifest, MapManifest } from '@/types/registry';

const BASE_URL =
  'https://raw.githubusercontent.com/Subway-Builder-Modded/The-Railyard/main/';

interface UseRegistryItemResult {
  item: ModManifest | MapManifest | null;
  loading: boolean;
  error: string | null;
}

export function useRegistryItem(
  type: 'mods' | 'maps',
  id: string,
): UseRegistryItemResult {
  const [item, setItem] = useState<ModManifest | MapManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${BASE_URL}/${type}/${id}/manifest.json`);
        if (!res.ok) throw new Error(`Failed to fetch ${type}/${id} manifest`);

        const data = await res.json();
        if (!cancelled) setItem(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load item');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [type, id]);

  return { item, loading, error };
}
