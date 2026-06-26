'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface DishImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Fill parent (parent must be relative). */
  fill?: boolean;
  width?: number;
  height?: number;
}

/**
 * next/image with a graceful warm gradient placeholder — covers the window
 * before fal.ai renders land and any future load errors, so the layout never
 * shows a broken image.
 */
export function DishImage({
  src,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, 33vw',
  priority,
  fill = true,
  width,
  height,
}: DishImageProps) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={cn('relative block h-full w-full overflow-hidden bg-ink-700', className)}>
      {/* Placeholder shimmer */}
      <span
        className={cn(
          'absolute inset-0 bg-[linear-gradient(110deg,#1c1a17,45%,#272320,55%,#1c1a17)] bg-[length:200%_100%] transition-opacity duration-700',
          loaded && !errored ? 'opacity-0' : 'animate-shimmer opacity-100'
        )}
        aria-hidden
      />
      {!errored && (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          sizes={sizes}
          priority={priority}
          onError={() => setErrored(true)}
          onLoad={() => setLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-[transform,opacity] duration-700',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </span>
  );
}
