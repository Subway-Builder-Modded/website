import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  APP_ICON_ALIASES,
  APP_ICON_REGISTRY,
  type AppIconRegistryName,
} from '@/lib/icons/registry';
import type {
  AppIconDefinition,
  AppIconInput,
  AssetIconDefinition,
} from '@/lib/icons/types';

function isIconObject(value: unknown): value is AssetIconDefinition {
  return typeof value === 'object' && value !== null && 'type' in value;
}

export function isMaskIcon(
  icon: AppIconDefinition,
): icon is Extract<AppIconDefinition, { type: 'mask' }> {
  return isIconObject(icon) && icon.type === 'mask';
}

export function isImageIcon(
  icon: AppIconDefinition,
): icon is Extract<AppIconDefinition, { type: 'image' }> {
  return isIconObject(icon) && icon.type === 'image';
}

export function isLucideIcon(icon: AppIconDefinition): icon is LucideIcon {
  return (
    typeof icon === 'function' ||
    (typeof icon === 'object' && icon !== null)
  );
}

function resolveRegistryName(value: string): AppIconRegistryName | undefined {
  const normalized = value.trim();
  if (!normalized) return undefined;

  if (normalized in APP_ICON_REGISTRY) {
    return normalized as AppIconRegistryName;
  }

  const alias = APP_ICON_ALIASES[normalized.toLowerCase()];
  return alias;
}

export function resolveNamedLucideIcon(value: string): LucideIcon | undefined {
  const normalized = value.trim();
  if (!normalized) return undefined;

  const maybeIcon =
    LucideIcons[normalized as keyof typeof LucideIcons] ??
    LucideIcons[`${normalized}Icon` as keyof typeof LucideIcons];
  return typeof maybeIcon === 'function' ||
    (typeof maybeIcon === 'object' && maybeIcon !== null)
    ? (maybeIcon as LucideIcon)
    : undefined;
}

export function resolveAppIcon(icon: AppIconInput): AppIconDefinition | null {
  if (!icon) return null;

  if (typeof icon === 'string') {
    const registryName = resolveRegistryName(icon);
    if (registryName) return APP_ICON_REGISTRY[registryName];

    return resolveNamedLucideIcon(icon) ?? null;
  }

  return icon;
}
