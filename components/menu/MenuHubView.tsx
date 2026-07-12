'use client';

import { ArrowRight } from 'lucide-react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { DishImage } from '@/components/ui/DishImage';
import { Reveal } from '@/components/ui/Reveal';
import { categoriesWithCounts } from '@/lib/menu';
import { useI18n, categoryLabel } from '@/lib/i18n';

export function MenuHubView() {
  const { t, lang } = useI18n();
  const categories = categoriesWithCounts();

  return (
    <div className="container-editorial py-14 md:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-wide text-cream/40">
        <TransitionLink href="/" className="transition-colors hover:text-gold">{t('menu.home')}</TransitionLink>
        <span>/</span>
        <span className="text-cream/70">{t('menu.breadcrumbMenu')}</span>
      </nav>

      {/* Header */}
      <Reveal>
        <p className="eyebrow mb-4">{t('menu.hub.eyebrow')}</p>
        <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.05] text-cream md:text-6xl">
          {t('menu.hub.title')}{' '}
          <span className="font-accent italic text-gold">{t('menu.hub.titleAccent')}</span>
        </h1>
        <p className="mt-5 max-w-xl text-cream/60">{t('menu.hub.sub')}</p>
      </Reveal>

      {/* Category grid */}
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <Reveal key={c.id} delay={Math.min(i * 0.04, 0.3)}>
            <TransitionLink
              href={`/menu/${c.id}`}
              className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl border border-white/10"
            >
              <DishImage
                src={c.image}
                alt={categoryLabel(c.id, c.label, lang)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="transition-transform duration-700 ease-expo group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="relative p-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl text-cream">
                      {categoryLabel(c.id, c.label, lang)}
                    </h2>
                    <p className="mt-1 text-xs uppercase tracking-wide text-gold/90">
                      {c.count} {t('menu.dishesWord')}
                    </p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 translate-x-1 items-center justify-center rounded-full border border-white/25 text-cream opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:border-gold group-hover:bg-gold group-hover:text-ink group-hover:opacity-100">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-cream/60">
                  {t(`menu.cat.${c.id}.desc`)}
                </p>
              </div>
            </TransitionLink>
          </Reveal>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-ink-800 px-6 py-12 text-center">
        <h2 className="font-display text-2xl text-cream md:text-3xl">{t('menu.startOrder')}</h2>
        <TransitionLink href="/order" className="btn-gold mt-2">
          {t('nav.order')} <ArrowRight className="h-4 w-4" />
        </TransitionLink>
      </div>
    </div>
  );
}
