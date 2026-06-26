'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useI18n } from '@/lib/i18n';

/**
 * Oversized-numeral band — the Zimmerl "23 Gänge / 5 Tische" device adapted to
 * the dark/gold system. Each figure is a giant editorial numeral on its own
 * hairline-divided row, counting up as it enters view.
 */
const FIGURES = [
  { value: 28, prefix: '', suffix: '', decimals: 0, labelKey: 'stats.years', noteKey: 'stats.years.note' },
  { value: 480, prefix: '', suffix: '°C', decimals: 0, labelKey: 'stats.tandoor', noteKey: 'stats.tandoor.note' },
  { value: 60, prefix: '', suffix: '+', decimals: 0, labelKey: 'stats.dishes', noteKey: 'stats.dishes.note' },
  { value: 4.9, prefix: '', suffix: '', decimals: 1, labelKey: 'stats.rating', noteKey: 'stats.rating.note' },
];

function BigNumber({
  value,
  prefix,
  suffix,
  decimals,
  active,
}: {
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
  active: boolean;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1700;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 4);
      setN(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  return (
    <span className="tabular-nums">
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-ink-800 py-24 md:py-36">
      <div ref={ref} className="container-editorial">
        <p className="eyebrow mb-16 md:mb-20">{t('stats.eyebrow')}</p>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {FIGURES.map((f, i) => (
            <div
              key={f.labelKey}
              className="group grid grid-cols-1 items-baseline gap-2 py-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10 md:py-10"
            >
              <span
                className="font-display font-medium leading-[0.85] tracking-[-0.03em] text-cream transition-colors duration-500 group-hover:text-gold"
                style={{ fontSize: 'clamp(4.5rem, 14vw, 13rem)' }}
              >
                <BigNumber {...f} active={inView} />
              </span>
              <span className="flex flex-col pb-3 md:items-end md:pb-6 md:text-right">
                <span className="font-display text-xl text-gold md:text-2xl">{t(f.labelKey)}</span>
                <span className="mt-1 max-w-xs text-sm text-cream/50 md:text-right">{t(f.noteKey)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
