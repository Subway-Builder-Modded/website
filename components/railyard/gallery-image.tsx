'use client';

import { Package, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useGalleryImage } from '@/hooks/use-gallery-image';

interface GalleryImageProps {
  type: 'mods' | 'maps';
  id: string;
  imagePath?: string;
  className?: string;
}

export function GalleryImage({
  type,
  id,
  imagePath,
  className,
}: GalleryImageProps) {
  const { imageUrl, loading, error } = useGalleryImage(type, id, imagePath);
  const FallbackIcon = type === 'mods' ? Package : MapPin;

  if (loading) {
    return <Skeleton className={cn('w-full', className)} />;
  }

  if (!imageUrl || error) {
    return (
      <div
        className={cn(
          'flex w-full items-center justify-center bg-muted',
          className,
        )}
      >
        <FallbackIcon
          className="h-12 w-12 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt=""
      className={cn('w-full object-cover', className)}
      loading="lazy"
      decoding="async"
    />
  );
}
