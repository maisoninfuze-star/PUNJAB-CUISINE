'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { MENU, CATEGORIES, type Category } from '@/lib/menu';
import { DishCard } from './DishCard';
import { cn } from '@/lib/utils';
import { useI18n, categoryLabel } from '@/lib/i18n';
import { MENU_FR } from '@/lib/menu-fr';

type Filter = Category | 'all';

export function MenuExplorer() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t('menu.all') },
    ...CATEGORIES.map((c) => ({ id: c.id, label: categoryLabel(c.id, c.label, lang) })),
  ];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU.filter((m) => {
      const matchesCat = filter === 'all' || m.category === filter;
      const fr = MENU_FR[m.id];
      const haystack = `${m.name} ${m.description} ${fr ? fr.name + ' ' + fr.description : ''}`.toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      return matchesCat && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div>
      {/* Controls */}
      <div className="sticky top-[68px] z-30 -mx-6 mb-12 bg-ink/80 px-6 py-4 backdrop-blur-xl md:top-[76px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Filter pills */}
          <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  'relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors',
                  filter === f.id ? 'text-ink' : 'text-cream/70 hover:text-cream'
                )}
              >
                {filter === f.id && (
                  <motion.span
                    layoutId="menu-filter-pill"
                    className="absolute inset-0 rounded-full bg-gold"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('menu.search')}
              className="w-full rounded-full border border-white/10 bg-ink-800 py-2.5 pl-10 pr-9 text-sm text-cream placeholder:text-cream/40 focus:border-gold/50 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      {results.length === 0 ? (
        <p className="py-20 text-center text-cream/50">
          {t('menu.empty')} “{query}”.
        </p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {results.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <DishCard item={item} priority={i < 3} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
