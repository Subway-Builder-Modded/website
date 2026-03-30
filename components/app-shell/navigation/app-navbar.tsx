'use client';

import { useCallback, useMemo, useState, type CSSProperties, type RefCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  NavbarProvider,
  useNavbar,
  type NavbarProps,
} from '@/components/ui/navbar';
import { APP_NAVBAR_CONFIG } from '@/config/navigation/navbar';
import { createNavbarConfigStyleVars } from './app-navbar/style-vars';
import { useNavbarOffset } from './app-navbar/use-navbar-offset';
import { DesktopNavbar } from './app-navbar/desktop-navbar';
import { MobileNavbar } from './app-navbar/mobile-navbar';

export default function AppNavbar(props: NavbarProps) {
  const [headerElement, setHeaderElement] = useState<HTMLDivElement | null>(null);
  const headerRef = useCallback((el: HTMLDivElement | null) => setHeaderElement(el), []);
  useNavbarOffset(headerElement);

  const configStyleVars = useMemo(
    () => createNavbarConfigStyleVars(APP_NAVBAR_CONFIG.sizes),
    [],
  );

  return (
    <NavbarProvider>
      <AppNavbarInner
        {...props}
        headerRef={headerRef}
        configStyleVars={configStyleVars}
      />
    </NavbarProvider>
  );
}

type AppNavbarInnerProps = NavbarProps & {
  headerRef: RefCallback<HTMLDivElement>;
  configStyleVars: CSSProperties;
};

function AppNavbarInner({
  headerRef,
  configStyleVars,
  ...props
}: AppNavbarInnerProps) {
  const pathname = usePathname() ?? '/';
  const { setTheme } = useTheme();
  const { open, setOpen } = useNavbar();

  const items = APP_NAVBAR_CONFIG.items;
  const leftItems = useMemo(
    () => items.filter((item) => item.position === 'left'),
    [items],
  );
  const rightItems = useMemo(
    () => items.filter((item) => item.position === 'right'),
    [items],
  );
  const mobileQuickItems = useMemo(() => {
    const idSet = new Set(APP_NAVBAR_CONFIG.layout.mobileQuickItemIds);
    return rightItems.filter((item) => idSet.has(item.id));
  }, [rightItems]);

  const onNavigate = () => {
    if (open) {
      setOpen(false);
    }
  };

  return (
    <>
      <DesktopNavbar
        {...props}
        headerRef={headerRef}
        brand={APP_NAVBAR_CONFIG.brand}
        leftItems={leftItems}
        rightItems={rightItems}
        pathname={pathname}
        onNavigate={onNavigate}
        setTheme={setTheme}
        configStyleVars={configStyleVars}
      />

      <MobileNavbar
        brand={APP_NAVBAR_CONFIG.brand}
        quickItems={mobileQuickItems}
        pathname={pathname}
        onNavigate={onNavigate}
        setTheme={setTheme}
        configStyleVars={configStyleVars}
      />
    </>
  );
}
