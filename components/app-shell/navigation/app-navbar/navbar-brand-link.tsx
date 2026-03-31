import NextLink from 'next/link';
import { AppIcon } from '@/components/shared/app-icon';
import type { AppNavbarBrand } from '@/config/navigation/navbar';
import { cn } from '@/lib/utils';

type NavbarBrandLinkProps = {
  brand: AppNavbarBrand;
  onNavigate: () => void;
  mobile?: boolean;
  compact?: boolean;
};

export function NavbarBrandLink({
  brand,
  onNavigate,
  mobile = false,
  compact = false,
}: NavbarBrandLinkProps) {
  return (
    <NextLink
      href={brand.href}
      className={cn(
        'group flex min-w-0 items-center text-muted-fg no-underline transition-colors duration-150 ease-out',
        'gap-[var(--app-navbar-brand-gap)] rounded-[var(--app-navbar-item-radius)] px-[var(--app-navbar-item-px)] py-[var(--app-navbar-item-py)]',
        'hover:bg-accent/45 hover:text-primary',
      )}
      aria-label="Home"
      onClick={onNavigate}
    >
      <AppIcon
        icon={brand.icon}
        className="shrink-0 text-current size-[var(--app-navbar-brand-icon)]"
      />
      {compact ? null : (
        <span
          className={cn(
            'overflow-hidden text-clip whitespace-nowrap text-[var(--app-navbar-brand-title)]',
            mobile
              ? 'max-w-[min(54vw,36rem)]'
              : 'max-w-[min(54vw,36rem)] md:max-w-[min(58vw,44rem)]',
          )}
          style={{ fontWeight: 'var(--app-navbar-brand-weight)' }}
        >
          {brand.title}
        </span>
      )}
    </NextLink>
  );
}
