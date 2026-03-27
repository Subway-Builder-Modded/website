import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { NavbarIcon } from '@/config/navigation/navbar';

type AppIconProps = {
  icon?: NavbarIcon;
  className?: string;
  style?: CSSProperties;
};

function isMaskIcon(
  icon: NavbarIcon,
): icon is Extract<NavbarIcon, { type: 'mask' }> {
  return (
    typeof icon === 'object' &&
    icon !== null &&
    'type' in icon &&
    icon.type === 'mask'
  );
}

function isImageIcon(
  icon: NavbarIcon,
): icon is Extract<NavbarIcon, { type: 'image' }> {
  return (
    typeof icon === 'object' &&
    icon !== null &&
    'type' in icon &&
    icon.type === 'image'
  );
}

export function AppIcon({ icon, className, style }: AppIconProps) {
  if (!icon) return null;

  if (isMaskIcon(icon)) {
    return (
      <span
        className={cn('block size-5 bg-current', className)}
        style={{
          WebkitMask: `url(${icon.src}) center / contain no-repeat`,
          mask: `url(${icon.src}) center / contain no-repeat`,
          ...style,
        }}
      />
    );
  }

  if (isImageIcon(icon)) {
    return (
      <Image
        src={icon.src}
        alt=""
        aria-hidden={true}
        width={20}
        height={20}
        className={cn('block size-5 object-contain', className)}
        style={style}
      />
    );
  }

  const Icon = icon as LucideIcon;
  return <Icon className={cn('size-5', className)} style={style} />;
}
