'use client';

import { useI18n } from '@/lib/i18n';

const WORDS: Record<'en' | 'fr', string[]> = {
  en: ['Tandoor Fired', 'Slow Cooked', 'Hand Ground Spices', 'Family Recipes', 'Warm Hospitality', 'Punjab to Montréal'],
  fr: ['Cuit au tandoor', 'Mijoté lentement', 'Épices moulues à la main', 'Recettes familiales', 'Accueil chaleureux', 'Du Punjab à Montréal'],
};

/** Seamless infinite gold ticker — a quiet editorial flourish between sections. */
export function Marquee() {
  const { lang } = useI18n();
  const row = [...WORDS[lang], ...WORDS[lang]];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-ink-800 py-5">
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-10 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-xl italic text-cream/70 md:text-2xl">{w}</span>
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
