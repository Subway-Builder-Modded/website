import { describe, expect, it } from 'vitest';
import { useMDXComponents } from '@/components/mdx/platform/registry';

describe('mdx component registry', () => {
  it('exposes core and ergonomic icon components', () => {
    const registry = useMDXComponents();
    expect(typeof registry.a).toBe('function');
    expect(typeof registry.Icon).toBe('function');
    expect(typeof registry.IconList).toBe('function');
    expect(typeof registry.Tabs).toBe('function');
  });
});

