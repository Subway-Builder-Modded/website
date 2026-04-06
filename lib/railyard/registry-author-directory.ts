import {
  createRegistryAuthorDirectory,
  type RegistryAuthorDirectoryEntry,
} from '@/lib/authors';
import { fetchRegistryJsonWithFallback } from '@/lib/railyard/registry-source';
import type { RegistryAuthorsIndex } from '@/types/registry';

let authorDirectoryPromise: Promise<
  Map<string, RegistryAuthorDirectoryEntry>
> | null = null;

async function readRegistryAuthorDirectory(): Promise<
  Map<string, RegistryAuthorDirectoryEntry>
> {
  try {
    const payload =
      await fetchRegistryJsonWithFallback<RegistryAuthorsIndex>(
        'authors/index.json',
      );
    return createRegistryAuthorDirectory(payload);
  } catch {
    return new Map<string, RegistryAuthorDirectoryEntry>();
  }
}

export async function getRegistryAuthorDirectory(): Promise<
  Map<string, RegistryAuthorDirectoryEntry>
> {
  if (!authorDirectoryPromise) {
    authorDirectoryPromise = readRegistryAuthorDirectory();
  }

  return authorDirectoryPromise;
}
