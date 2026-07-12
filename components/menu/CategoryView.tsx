'use client';

import { ArrowRight } from 'lucide-react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { Reveal } from '@/components/ui/Reveal';
import { DishCard, dishHref } from './DishCard';
import { CATEGORIES, itemsByCategory, type Category } from '@/lib/menu';
import { cn } from '@/lib/utils';
import { useI18n, categoryLabel } from '@/lib/i18n';

export function CategoryView({ category }: { category: Category }) {
  const { t, lang } = useI18n();
  const items = itemsByCategory(category);
  const current = CATEGORIES.find((c) => c.id === category)!;

  return (
    <div className="container-editorial py-14 md:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-cream/40">
        <TransitionLink href="/" className="transition-colors hover:text-gold">{t('menu.home')}</TransitionLink>
        <span>/</span>
        <TransitionLink href="/menu" className="transition-colors hover:text-gold">{t('menu.breadcrumbMenu')}</TransitionLink>
        <span>/</span>
        <span className="text-cream/70">{categoryLabel(current.id, current.label, lang)}</span>
      </nav>

      {/* Header */}
      <Reveal>
        <h1 className="font-display text-4xl font-medium text-cream md:text-6xl">
          {categoryLabel(current.id, current.label, lang)}
        </h1>
        <p className="mt-4 max-w-xl text-cream/60">{t(`menu.cat.${category}.desc`)}</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-gold/90">
          {items.length} {t('menu.dishesWord')}
        </p>
      </Reveal>

      {/* Category switcher */}
      <div className="mt-8 -mx-1 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TransitionLink
          href="/menu"
          className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-sm text-cream/70 transition-colors hover:border-gold hover:text-gold"
        >
          {t('menu.allCategories')}
        </TransitionLink>
        {CATEGORIES.map((c) => (
          <TransitionLink
            key={c.id}
            href={`/menu/${c.id}`}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm transition-colors',
              c.id === category
                ? 'bg-gold text-ink'
                : 'border border-white/15 text-cream/70 hover:border-gold hover:text-gold'
            )}
          >
            {categoryLabel(c.id, c.label, lang)}
          </TransitionLink>
        ))}
      </div>

      {/* Dishes */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={Math.min(i * 0.03, 0.24)}>
            <DishCard item={item} href={dishHref(item)} priority={i < 3} />
          </Reveal>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 flex justify-center">
        <TransitionLink href="/order" className="btn-gold">
          {t('menu.startOrder')} <ArrowRight className="h-4 w-4" />
        </TransitionLink>
      </div>
    </div>
  );
}
