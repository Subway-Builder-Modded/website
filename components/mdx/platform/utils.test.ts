import { describe, expect, it } from 'vitest';
import { slugify, toDimension } from '@/components/mdx/platform/utils';

describe('mdx platform utils', () => {
  it('slugifies heading text consistently', () => {
    expect(slugify('  Hello, World!  ')).toBe('hello-world');
    expect(slugify('A   B   C')).toBe('a-b-c');
  });

  it('normalizes numeric dimensions', () => {
    expect(toDimension(128)).toBe(128);
    expect(toDimension(' 42 ')).toBe(42);
    expect(toDimension('')).toBeUndefined();
    expect(toDimension('abc')).toBeUndefined();
  });
});

