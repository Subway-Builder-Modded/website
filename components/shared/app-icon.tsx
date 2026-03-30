import type { CSSProperties } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  isImageIcon,
  isMaskIcon,
  resolveAppIcon,
  type AppIconInput,
} from '@/lib/icons';

type AppIconProps = {
  icon?: AppIconInput;
  className?: string;
  style?: CSSProperties;
  size?: number | string;
};

export function AppIcon({ icon, className, style, size }: AppIconProps) {
  const resolvedIcon = resolveAppIcon(icon);
  if (!resolvedIcon) return null;
  const sizeStyle =
    size !== undefined
      ? {
          width: size,
          height: size,
        }
      : undefined;

  if (isMaskIcon(resolvedIcon)) {
    return (
      <span
        className={cn('block size-5 bg-current', className)}
        style={{
          WebkitMask: `url(${resolvedIcon.src}) center / contain no-repeat`,
          mask: `url(${resolvedIcon.src}) center / contain no-repeat`,
          ...sizeStyle,
          ...style,
        }}
      />
    );
  }

  if (isImageIcon(resolvedIcon)) {
    return (
      <Image
        src={resolvedIcon.src}
        alt=""
        aria-hidden={true}
        width={20}
        height={20}
        className={cn('block size-5 object-contain', className)}
        style={{
          ...sizeStyle,
          ...style,
        }}
      />
    );
  }

  const Icon = resolvedIcon;
  return (
    <Icon
      className={cn('size-5', className)}
      style={{
        ...sizeStyle,
        ...style,
      }}
    />
  );
}
