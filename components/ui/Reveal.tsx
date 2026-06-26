'use client';

import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}

/** Fades + lifts content into view once, on an expo easing. */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const Tag = as as 'div';

  return (
    <Tag
      ref={ref as never}
      className={cn('reveal', inView && 'is-revealed', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
