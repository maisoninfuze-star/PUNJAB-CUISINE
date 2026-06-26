'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { LangToggle } from '@/components/ui/LangToggle';
import { Logo } from '@/components/brand/Logo';
import { NAV_LINKS, SITE } from '@/lib/site';
import { useLenis } from '@/components/providers/SmoothScroll';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollTo } = useLenis();
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleAnchor(e: React.MouseEvent, href: string) {
    if (href.startsWith('/#')) {
      e.preventDefault();
      setOpen(false);
      scrollTo(href.replace('/', ''));
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled
            ? 'border-b border-white/10 bg-ink/80 py-3 backdrop-blur-xl'
            : 'border-b border-transparent py-5'
        )}
      >
        <nav className="container-editorial flex items-center justify-between">
          <Link href="/" aria-label={SITE.name}>
            <Logo variant="full" className={cn('transition-transform', scrolled && 'scale-95')} />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const isCatering = link.key === 'nav.catering';
              if (isCatering) {
                return (
                  <TransitionLink
                    key={link.href}
                    href={link.href}
                    className="group relative rounded-full border border-gold/40 px-4 py-1.5 font-sans text-xs uppercase tracking-label text-gold transition-colors hover:border-gold hover:bg-gold/10"
                  >
                    {t(link.key)}
                  </TransitionLink>
                );
              }
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleAnchor(e, link.href)}
                  className="group relative font-sans text-xs uppercase tracking-label text-cream/80 transition-colors hover:text-cream"
                >
                  {t(link.key)}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 ease-expo group-hover:w-full" />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <LangToggle className="hidden md:inline-flex" />
            <a
              href={`tel:${SITE.phoneHref}`}
              className="hidden items-center gap-2 text-sm text-cream/70 transition-colors hover:text-gold xl:flex"
            >
              <Phone className="h-4 w-4" />
              {SITE.phoneDisplay}
            </a>
            <TransitionLink href="/order" className="btn-gold hidden sm:inline-flex">
              {t('nav.order')}
            </TransitionLink>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-cream lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="container-editorial flex items-center justify-between py-5">
              <Logo variant="full" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-cream"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="container-editorial mt-16 flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => {
                const isCatering = link.key === 'nav.catering';
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { handleAnchor(e, link.href); if (!link.href.startsWith('/#')) setOpen(false); }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className={`border-b border-white/10 py-5 font-display text-4xl ${isCatering ? 'text-gold' : 'text-cream'}`}
                  >
                    {t(link.key)}
                  </motion.a>
                );
              })}
              <div className="mt-10 flex flex-col gap-4">
                <TransitionLink href="/order" className="btn-gold w-full" onClick={() => setOpen(false)}>
                  {t('nav.order')}
                </TransitionLink>
                <a href={`tel:${SITE.phoneHref}`} className="btn-ghost w-full">
                  <Phone className="h-4 w-4" /> {t('visit.call')}
                </a>
                <LangToggle className="self-start" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
