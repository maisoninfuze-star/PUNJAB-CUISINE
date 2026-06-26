import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoEmblemProps {
  className?: string;
  /** Rendered pixel size (square). */
  size?: number;
  priority?: boolean;
}

/**
 * The real Punjabi Cuisine emblem — a gold gurdwara crest with the wordmark
 * built in. Self-contained, so it never needs an extra text wordmark beside it.
 * The artwork sits on near-black, which blends into the site's ink surfaces.
 */
export function LogoEmblem({ className, size = 40, priority }: LogoEmblemProps) {
  return (
    <Image
      src="/brand/logo.png"
      alt="Punjabi Cuisine"
      width={size}
      height={size}
      priority={priority}
      className={cn('select-none', className)}
    />
  );
}

interface LogoProps {
  className?: string;
  /** Visual scale. 'full' = nav size, 'mark' = compact, 'stacked' = large centred. */
  variant?: 'full' | 'mark';
  stacked?: boolean;
  priority?: boolean;
}

export function Logo({ className, variant = 'full', stacked = false, priority }: LogoProps) {
  const size = stacked ? 132 : variant === 'mark' ? 36 : 52;
  return (
    <span
      className={cn('inline-flex items-center', stacked && 'flex-col', className)}
      aria-label="Punjabi Cuisine"
    >
      <LogoEmblem size={size} priority={priority} />
    </span>
  );
}
