'use client';

import { useState } from 'react';
import { Minus, Plus, Check, Leaf, Flame, ArrowRight } from 'lucide-react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { DishImage } from '@/components/ui/DishImage';
import { Reveal } from '@/components/ui/Reveal';
import { DishCard, dishHref } from './DishCard';
import { getItem, relatedItems, CATEGORIES } from '@/lib/menu';
import { formatPrice, cn } from '@/lib/utils';
import { useCart } from '@/lib/store/cart';
import { useI18n, localizeItem, categoryLabel } from '@/lib/i18n';

export function DishView({ itemId }: { itemId: string }) {
  const { t, lang } = useI18n();
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const item = getItem(itemId);
  if (!item) return null;
  const l = localizeItem(item, lang);
  const cat = CATEGORIES.find((c) => c.id === item.category)!;
  const related = relatedItems(item);

  function handleAdd() {
    if (!item) return;
    add(item, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div className="container-editorial py-14 md:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-cream/40">
        <TransitionLink href="/" className="transition-colors hover:text-gold">{t('menu.home')}</TransitionLink>
        <span>/</span>
        <TransitionLink href="/menu" className="transition-colors hover:text-gold">{t('menu.breadcrumbMenu')}</TransitionLink>
        <span>/</span>
        <TransitionLink href={`/menu/${item.category}`} className="transition-colors hover:text-gold">
          {categoryLabel(cat.id, cat.label, lang)}
        </TransitionLink>
        <span>/</span>
        <span className="line-clamp-1 text-cream/70">{l.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <Reveal>
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10">
            <DishImage src={item.image} alt={l.name} priority sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute left-4 top-4 flex gap-2">
              {item.vegetarian && (
                <span className="flex items-center gap-1 rounded-full bg-ink/70 px-3 py-1 text-xs text-emerald-300 backdrop-blur-sm">
                  <Leaf className="h-3.5 w-3.5" /> {t('menu.veg')}
                </span>
              )}
              {item.signature && (
                <span className="rounded-full bg-gold/90 px-3 py-1 text-xs font-medium text-ink">
                  {t('menu.signature')}
                </span>
              )}
            </div>
          </div>
        </Reveal>

        {/* Details */}
        <div className="flex flex-col lg:py-4">
          <p className="eyebrow mb-3">{categoryLabel(cat.id, cat.label, lang)}</p>
          <h1 className="font-display text-4xl font-medium leading-tight text-cream md:text-5xl">{l.name}</h1>

          <div className="mt-4 flex items-center gap-4">
            <span className="font-display text-3xl text-gold">{formatPrice(item.price)}</span>
            {!!item.spice && (
              <span className="flex items-center gap-0.5" title={`Spice ${item.spice}/3`}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Flame
                    key={i}
                    className={cn('h-4 w-4', i < item.spice! ? 'text-ember' : 'text-cream/20')}
                    fill={i < item.spice! ? 'currentColor' : 'none'}
                  />
                ))}
              </span>
            )}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs uppercase tracking-wide text-cream/40">{t('menu.aboutDish')}</p>
            <p className="mt-2 leading-relaxed text-cream/75">{l.description}</p>
          </div>

          {/* Quantity + add */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 rounded-full border border-white/15">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-cream/70 transition-colors hover:text-gold"
                aria-label={t('menu.qty')}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-display text-lg text-cream">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center text-cream/70 transition-colors hover:text-gold"
                aria-label={t('menu.qty')}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 font-medium transition-colors',
                added ? 'bg-emerald-500 text-white' : 'bg-gold text-ink hover:bg-gold-light'
              )}
            >
              {added ? <><Check className="h-5 w-5" /> {t('menu.added')}</> : <><Plus className="h-5 w-5" /> {t('menu.addToOrder')}</>}
            </button>
          </div>

          <TransitionLink href="/order" className="mt-4 inline-flex items-center gap-1.5 text-sm text-cream/55 transition-colors hover:text-gold">
            {t('menu.startOrder')} <ArrowRight className="h-4 w-4" />
          </TransitionLink>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl text-cream md:text-3xl">{t('menu.related')}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <DishCard key={r.id} item={r} href={dishHref(r)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
