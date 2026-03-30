'use client';

import { createContext } from 'react';
import { usePathname } from 'next/navigation';
import type { SiteColorSchemeId } from '@/config/theme/contracts';
import { resolveSiteColorScheme } from '@/config/theme/route-schemes';

const PageColorSchemeContext = createContext<SiteColorSchemeId>('default');

export function PageColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const scheme = resolveSiteColorScheme(pathname ?? '/');

  return (
    <PageColorSchemeContext value={scheme}>
      <div data-color-scheme={scheme} className="min-h-screen">
        {children}
      </div>
    </PageColorSchemeContext>
  );
}
