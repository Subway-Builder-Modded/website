import * as React from 'react';
import type { LucideProps } from 'lucide-react';
import { AppIcon } from '@/components/shared/app-icon';
import {
  isLucideIcon,
  resolveAppIcon,
  type AppIconInput,
} from '@/lib/icons';
import { cn } from '@/lib/utils';

type IconListProps = React.ComponentProps<'div'>;

type IconItemProps = Omit<React.ComponentProps<'div'>, 'color'> & {
  icon: AppIconInput;
  iconProps?: LucideProps;
} & Pick<
    LucideProps,
    'color' | 'size' | 'strokeWidth' | 'absoluteStrokeWidth' | 'fill'
  >;

function resolveIconSize(size: LucideProps['size']) {
  if (typeof size === 'number') return size;
  if (typeof size === 'string' && size.trim()) return size;
  return '1em';
}

export function IconList({ className, ...props }: IconListProps) {
  return (
    <div
      role="list"
      data-slot="mdx-icon-list"
      className={cn('my-6 space-y-2', className)}
      {...props}
    />
  );
}

export function IconItem({
  icon,
  iconProps,
  color,
  size,
  strokeWidth,
  absoluteStrokeWidth,
  fill,
  children,
  className,
  ...props
}: IconItemProps) {
  const resolvedIcon = resolveAppIcon(icon);
  const LucideResolvedIcon =
    resolvedIcon && isLucideIcon(resolvedIcon) ? resolvedIcon : null;
  const resolvedSize = resolveIconSize(size ?? iconProps?.size);
  const resolvedFill = iconProps?.fill ?? fill ?? 'none';

  return (
    <div
      role="listitem"
      data-slot="mdx-icon-item"
      className={cn(
        'grid grid-cols-[1.125rem_minmax(0,1fr)] items-start gap-x-2',
        className,
      )}
      {...props}
    >
      {resolvedIcon ? (
        LucideResolvedIcon ? (
          <LucideResolvedIcon
            aria-hidden="true"
            size={resolvedSize}
            color={color}
            strokeWidth={strokeWidth}
            absoluteStrokeWidth={absoluteStrokeWidth}
            fill={resolvedFill}
            className="mt-[0.45em] inline-block align-[-0.125em]"
            {...iconProps}
          />
        ) : (
          <AppIcon
            icon={resolvedIcon}
            className="mt-[0.45em] inline-block align-[-0.125em]"
            size={resolvedSize}
            style={{ color }}
          />
        )
      ) : (
        <span aria-hidden="true" className="inline-block h-[1em] w-[1em]" />
      )}

      <div className="min-w-0 break-words leading-7 [overflow-wrap:anywhere] [&>[data-slot=mdx-icon-list]]:mt-2 [&_a]:break-words [&_a]:[overflow-wrap:anywhere]">
        {children}
      </div>
    </div>
  );
}
