import { describe, expect, it } from 'vitest';
import { getCurrentSuiteModeHex } from '@/config/theme/css-vars';

describe('getCurrentSuiteModeHex', () => {
  it('returns suite CSS variable references for color roles', () => {
    expect(getCurrentSuiteModeHex('accentColor')).toEqual({
      light: 'var(--suite-accent-light)',
      dark: 'var(--suite-accent-dark)',
    });
    expect(getCurrentSuiteModeHex('textColorInverted')).toEqual({
      light: 'var(--suite-text-inverted-light)',
      dark: 'var(--suite-text-inverted-dark)',
    });
  });
});

