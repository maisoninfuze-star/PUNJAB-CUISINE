'use client';

import { TransitionLink } from '@/components/ui/TransitionLink';
import { ArrowUpRight } from 'lucide-react';
import { SIGNATURES } from '@/lib/menu';
import { RevealImage } from '@/components/ui/RevealImage';
import { Reveal } from '@/components/ui/Reveal';
import { formatPrice } from '@/lib/utils';
import { useI18n, localizeItem } from '@/lib/i18n';

/**
 * Chef's signatures as an indexed editorial grid (balky-style "Selected Work").
 * Each dish is numbered 01–06 with a large index numeral; the image reveals via
 * clip-wipe and lifts on hover. No boxed cards — hairlines and numbers carry it.
 */
export function Signatures() {
  const { t, lang } = useI18n();
  const items = SIGNATURES.slice(0, 6);

  return (
    <section className="relative bg-ink py-24 md:py-32">
      <div className="container-editorial">
        {/* Header */}
        <div className="mb-14 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="eyebrow mb-3">
              {t('sig.eyebrow')} <span className="text-cream/40">(0{items.length})</span>
            </p>
            <h2 className="font-display text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-cream md:text-6xl">
              {t('sig.h1')}
              <br />
              <span className="font-accent italic capitalize text-gold">{t('sig.h2')}</span>
            </h2>
          </Reveal>
          <TransitionLink
            href="/menu"
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-label text-cream/70 transition-colors hover:text-gold"
          >
            {t('sig.viewAll')}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </TransitionLink>
        </div>

        {/* Indexed grid */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 md:gap-y-20">
          {items.map((dish, i) => {
            const l = localizeItem(dish, lang);
            return (
            <article key={dish.id} className="group">
              <div className="mb-5 flex items-baseline justify-between">
                <span className="font-display text-2xl text-gold/50 transition-colors duration-500 group-hover:text-gold">
                  0{i + 1}
                </span>
                <span className="font-sans text-sm text-cream/50">{formatPrice(dish.price)}</span>
              </div>

              <RevealImage
                src={dish.image}
                alt={l.name}
                from={i % 2 === 0 ? 'left' : 'bottom'}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="aspect-[16/10] w-full overflow-hidden rounded-lg"
              />

              <div className="mt-5 flex items-start justify-between gap-6">
                <h3 className="font-display text-2xl uppercase tracking-tight text-cream transition-colors duration-300 group-hover:text-gold md:text-3xl">
                  {l.name}
                </h3>
              </div>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/55">
                {l.description}
              </p>
              <span className="mt-5 block h-px w-full origin-left scale-x-0 bg-gold/60 transition-transform duration-700 ease-expo group-hover:scale-x-100" />
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
