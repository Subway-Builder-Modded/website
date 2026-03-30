import { Plus } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import {
  isImageIcon,
  isMaskIcon,
  resolveAppIcon,
  resolveNamedLucideIcon,
} from '@/lib/icons';

describe('resolveAppIcon', () => {
  it('resolves icons from the shared registry', () => {
    const icon = resolveAppIcon('github');
    expect(icon).not.toBeNull();
    expect(icon && isMaskIcon(icon) ? icon.src : '').toBe('/assets/github.svg');
  });

  it('resolves registry aliases', () => {
    const icon = resolveAppIcon('sbm-logo');
    expect(icon).not.toBeNull();
    expect(icon && isImageIcon(icon) ? icon.src : '').toBe('/logo.png');
  });

  it('resolves lucide icon names', () => {
    expect(resolveAppIcon('Plus')).toBe(Plus);
    expect(resolveNamedLucideIcon('Plus')).toBe(Plus);
  });

  it('returns null for unknown string names', () => {
    expect(resolveAppIcon('does-not-exist')).toBeNull();
  });
});
