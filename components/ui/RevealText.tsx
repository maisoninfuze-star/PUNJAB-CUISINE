'use client';

import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';

interface RevealTextProps {
  /** Each entry becomes one masked line, rising from behind a clip. */
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  /** Per-line stagger in ms. */
  stagger?: number;
}

/**
 * Signature editorial move: headings reveal line-by-line, each rising from
 * behind an overflow mask on an expo easing.
 */
export function RevealText({
  lines,
  className,
  lineClassName,
  as: Tag = 'h2',
  stagger = 90,
}: RevealTextProps) {
  const { ref, inView } = useInView<HTMLHeadingElement>();

  return (
    <Tag ref={ref as never} className={cn(inView && 'is-revealed', className)}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span
            className={cn('line-inner', lineClassName)}
            style={{ transitionDelay: `${i * stagger}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
