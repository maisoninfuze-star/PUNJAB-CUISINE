'use client';

import { ArrowRight } from 'lucide-react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { DishImage } from '@/components/ui/DishImage';
import { Reveal } from '@/components/ui/Reveal';
import { DishCard, dishHref } from './DishCard';
import { SIGNATURES, categoriesWithCounts, MENU, type Category } from '@/lib/menu';
import { useI18n, categoryLabel } from '@/lib/i18n';

/** Homepage menu section — a curated teaser that links into the full /menu pages. */
const FEATURED: Category[] = ['chicken', 'tandoori', 'vegetarian', 'biryani', 'lamb', 'appetizers'];

export function MenuPreview() {
  const { t, lang } = useI18n();
  const cats = categoriesWithCounts().filter((c) => FEATURED.includes(c.id));
  const signatures = SIGNATURES.slice(0, 3);

  return (
    <section id="menu" className="relative bg-ink py-24 md:py-32">
      <div className="container-editorial">
        <Reveal className="text-center">
          <p className="eyebrow mb-5">{t('menu.eyebrow')}</p>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium text-cream md:text-5xl">
            {t('menu.h1')}{' '}
            <span className="font-accent italic text-gold">{t('menu.h1accent')}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-cream/55">{t('menu.sub')}</p>
        </Reveal>

        {/* Signature dishes */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {signatures.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <DishCard item={item} href={dishHref(item)} priority={i < 3} />
            </Reveal>
          ))}
        </div>

        {/* Browse by category */}
        <Reveal className="mt-20 mb-6 flex items-end justify-between">
          <h3 className="font-display text-2xl text-cream md:text-3xl">{t('menu.browse')}</h3>
          <TransitionLink
            href="/menu"
            className="hidden items-center gap-1.5 text-sm text-cream/60 transition-colors hover:text-gold sm:flex"
          >
            {t('menu.allCategories')} <ArrowRight className="h-4 w-4" />
          </TransitionLink>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {cats.map((c, i) => (
            <Reveal key={c.id} delay={Math.min(i * 0.04, 0.24)}>
              <TransitionLink
                href={`/menu/${c.id}`}
                className="group relative flex h-40 items-end overflow-hidden rounded-2xl border border-white/10 md:h-52"
              >
                <DishImage
                  src={c.image}
                  alt={categoryLabel(c.id, c.label, lang)}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="transition-transform duration-700 ease-expo group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="relative flex w-full items-center justify-between p-4">
                  <div>
                    <h4 className="font-display text-lg text-cream md:text-xl">
                      {categoryLabel(c.id, c.label, lang)}
                    </h4>
                    <p className="text-[0.7rem] uppercase tracking-wide text-gold/90">
                      {c.count} {t('menu.dishesWord')}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 -translate-x-1 text-cream/60 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-gold group-hover:opacity-100" />
                </div>
              </TransitionLink>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <TransitionLink href="/menu" className="btn-gold">
            {t('menu.viewFull')} ({MENU.length}+) <ArrowRight className="h-4 w-4" />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
