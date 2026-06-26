'use client';

import { Star } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { useI18n } from '@/lib/i18n';

const REVIEWS = [
  { quoteKey: 'reviews.q1', name: 'Priya S.', detail: 'Google · Local Guide' },
  { quoteKey: 'reviews.q2', name: 'Marc-André L.', detail: 'OpenTable' },
  { quoteKey: 'reviews.q3', name: 'Anita & James', detail: 'Google Review' },
];

export function Testimonials() {
  const { t } = useI18n();
  return (
    <section className="relative bg-ink py-28 md:py-36">
      <div className="container-editorial">
        <Reveal className="text-center">
          <p className="eyebrow mb-5">{t('reviews.eyebrow')}</p>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium text-cream md:text-5xl">
            {t('reviews.h1')}{' '}
            <span className="font-accent italic text-gold">{t('reviews.h1accent')}</span>
          </h2>
          <div className="mt-5 flex items-center justify-center gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
            <span className="ml-2 text-sm text-cream/60">{t('reviews.avg')}</span>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal
              key={r.name}
              delay={i * 120}
              className="flex flex-col rounded-2xl border border-white/10 bg-ink-800 p-8 transition-colors duration-500 hover:border-gold/30"
            >
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-6 flex-1 font-accent text-xl italic leading-relaxed text-cream/85">
                “{t(r.quoteKey)}”
              </p>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="font-display text-lg text-cream">{r.name}</p>
                <p className="text-xs text-cream/50">{r.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
