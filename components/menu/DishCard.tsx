'use client';

import { useState } from 'react';
import { Plus, Check, Leaf, Flame } from 'lucide-react';
import type { MenuItem } from '@/lib/menu';
import { DishImage } from '@/components/ui/DishImage';
import { useCart } from '@/lib/store/cart';
import { formatPrice, cn } from '@/lib/utils';
import { useI18n, localizeItem } from '@/lib/i18n';

function SpiceLevel({ level }: { level: number }) {
  if (!level) return null;
  return (
    <span className="flex items-center gap-0.5" title={`Spice level ${level}/3`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Flame
          key={i}
          className={cn('h-3 w-3', i < level ? 'text-ember' : 'text-cream/20')}
          fill={i < level ? 'currentColor' : 'none'}
        />
      ))}
    </span>
  );
}

export function DishCard({ item, priority }: { item: MenuItem; priority?: boolean }) {
  const add = useCart((s) => s.add);
  const { t, lang } = useI18n();
  const l = localizeItem(item, lang);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-800 transition-colors duration-500 hover:border-gold/30">
      <div className="relative aspect-[4/3] overflow-hidden">
        <DishImage
          src={item.image}
          alt={l.name}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="transition-transform duration-700 ease-expo group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          {item.vegetarian && (
            <span className="flex items-center gap-1 rounded-full bg-ink/70 px-2.5 py-1 text-[0.65rem] text-emerald-300 backdrop-blur-sm">
              <Leaf className="h-3 w-3" /> {t('menu.veg')}
            </span>
          )}
          {item.signature && (
            <span className="rounded-full bg-gold/90 px-2.5 py-1 text-[0.65rem] font-medium text-ink">
              {t('menu.signature')}
            </span>
          )}
        </div>

        {/* Quick add */}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`${t('menu.quickAdd')} — ${l.name}`}
          className={cn(
            'absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-300',
            added
              ? 'bg-emerald-500 text-white'
              : 'bg-gold text-ink hover:scale-110 hover:bg-gold-light'
          )}
        >
          {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight text-cream">{l.name}</h3>
          <span className="shrink-0 font-sans text-sm font-medium text-gold">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-cream/60">
          {l.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <SpiceLevel level={item.spice ?? 0} />
          <button
            type="button"
            onClick={handleAdd}
            className="text-xs font-medium uppercase tracking-wide text-cream/50 transition-colors hover:text-gold"
          >
            {added ? `${t('menu.added')} ✓` : t('menu.quickAdd')}
          </button>
        </div>
      </div>
    </article>
  );
}
