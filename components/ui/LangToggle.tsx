'use client';

import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** Compact EN / FR switch. */
export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-white/15 p-0.5 text-[0.7rem] font-medium uppercase tracking-wide',
        className
      )}
      role="group"
      aria-label="Language"
    >
      {(['en', 'fr'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            'rounded-full px-2.5 py-1 transition-colors',
            lang === l ? 'bg-gold text-ink' : 'text-cream/60 hover:text-cream'
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
