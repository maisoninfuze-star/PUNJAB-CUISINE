'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { useCart, selectCount, selectSubtotal } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

/**
 * Floating pickup-basket bar. Mobile-first, thumb-reachable; appears the moment
 * the first dish is added and links into the ordering flow.
 */
export function StickyCart() {
  const [mounted, setMounted] = useState(false);
  const count = useCart(selectCount);
  const subtotal = useCart(selectSubtotal);
  const lastAddedId = useCart((s) => s.lastAddedId);
  const [pulse, setPulse] = useState(false);
  const { lang } = useI18n();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!lastAddedId) return;
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(timer);
  }, [lastAddedId]);

  const itemWord = lang === 'fr' ? (count === 1 ? 'article' : 'articles') : count === 1 ? 'item' : 'items';
  const basketLabel = lang === 'fr' ? `${count} ${itemWord} dans votre panier` : `${count} ${itemWord} in your basket`;
  const payLabel = lang === 'fr' ? 'payer à la cueillette' : 'pay at pickup';
  const viewLabel = lang === 'fr' ? 'Voir la commande' : 'View order';

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6"
        >
          <TransitionLink
            href="/order"
            className="mx-auto flex max-w-editorial items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-ink-800/95 p-3 pl-5 shadow-[0_-10px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-colors hover:border-gold/60"
          >
            <span className="flex items-center gap-3">
              <motion.span
                animate={pulse ? { scale: [1, 1.25, 1] } : {}}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.7rem] font-semibold text-ink">
                  {count}
                </span>
              </motion.span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm text-cream">{basketLabel}</span>
                <span className="text-xs text-cream/55">
                  {formatPrice(subtotal)} · {payLabel}
                </span>
              </span>
            </span>
            <span className="btn-gold !px-5 !py-2.5">
              {viewLabel} <ArrowRight className="h-4 w-4" />
            </span>
          </TransitionLink>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
