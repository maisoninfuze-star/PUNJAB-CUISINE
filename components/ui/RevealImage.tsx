'use client';

import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';
import { DishImage } from './DishImage';

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Direction the clip wipes from. */
  from?: 'left' | 'bottom';
  delay?: number;
}

/**
 * Editorial image reveal: the frame wipes open via clip-path while the photo
 * inside settles from a slight scale — the cinematic "curtain" reveal.
 *
 * NB: the observed wrapper is never clipped. The clip-path lives on an inner
 * layer, because an element clipped to zero area never satisfies an
 * IntersectionObserver threshold (it would deadlock closed).
 */
export function RevealImage({
  src,
  alt,
  className,
  sizes,
  priority,
  from = 'bottom',
  delay = 0,
}: RevealImageProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px',
  });

  const closed = from === 'left' ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)';

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <div
        className="h-full w-full"
        style={{
          clipPath: inView ? 'inset(0 0 0 0)' : closed,
          transition: `clip-path 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }}
      >
        <div
          className="h-full w-full"
          style={{
            transform: inView ? 'scale(1)' : 'scale(1.18)',
            transition: `transform 1.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
          }}
        >
          <DishImage src={src} alt={alt} sizes={sizes} priority={priority} />
        </div>
      </div>
    </div>
  );
}
