import { existsSync, readFileSync } from 'fs';
import path from 'path';
import {
  createRegistryAuthorDirectory,
  type RegistryAuthorDirectoryEntry,
} from '@/lib/authors';
import type { RegistryAuthorsIndex } from '@/types/registry';

let authorDirectoryCache: Map<string, RegistryAuthorDirectoryEntry> | null =
  null;

function getAuthorIndexCandidates(cwd: string): string[] {
  return [
    path.resolve(cwd, 'authors', 'index.json'),
    path.resolve(cwd, 'The-Railyard', 'authors', 'index.json'),
    path.resolve(cwd, '..', 'The-Railyard', 'authors', 'index.json'),
    path.resolve(cwd, '..', '..', 'The-Railyard', 'authors', 'index.json'),
  ];
}

export function loadRegistryAuthorDirectoryFromWorkspace(): Map<
  string,
  RegistryAuthorDirectoryEntry
> {
  if (authorDirectoryCache) return authorDirectoryCache;

  for (const candidate of getAuthorIndexCandidates(process.cwd())) {
    if (!existsSync(candidate)) continue;

    try {
      const payload = JSON.parse(
        readFileSync(candidate, 'utf-8'),
      ) as RegistryAuthorsIndex;
      authorDirectoryCache = createRegistryAuthorDirectory(payload);
      return authorDirectoryCache;
    } catch {
      continue;
    }
  }

  authorDirectoryCache = new Map<string, RegistryAuthorDirectoryEntry>();
  return authorDirectoryCache;
}
