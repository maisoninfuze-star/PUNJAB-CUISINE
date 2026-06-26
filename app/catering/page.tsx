'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Check,
  Users,
  UtensilsCrossed,
  Calendar,
  MapPin,
  Loader2,
  Star,
} from 'lucide-react';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { Logo } from '@/components/brand/Logo';
import { Reveal } from '@/components/ui/Reveal';
import { SITE } from '@/lib/site';
import { useI18n } from '@/lib/i18n';

/* ─── SEO metadata (set from layout — static export via generateMetadata in a
       companion server file) ─── */

const HALL_BULLETS = [
  'Private events',
  'Family celebrations',
  'Birthday parties',
  'Corporate dinners',
  'Community gatherings',
  'Custom food packages',
  'Friendly restaurant service',
];

const CATERING_BULLETS = [
  'Catering for parties and events',
  'Office lunches',
  'Family gatherings',
  'Weddings and receptions',
  'Custom menu options',
  'Vegetarian and non-vegetarian dishes',
  'Pickup catering available',
];

const HALL_BULLETS_FR = [
  'Événements privés',
  'Célébrations familiales',
  'Fêtes d\'anniversaire',
  'Dîners corporatifs',
  'Rassemblements communautaires',
  'Forfaits repas personnalisés',
  'Service restaurant attentionné',
];

const CATERING_BULLETS_FR = [
  'Traiteur pour fêtes et événements',
  'Dîners au bureau',
  'Rassemblements familiaux',
  'Mariages et réceptions',
  'Menus personnalisés',
  'Plats végétariens et non végétariens',
  'Service traiteur à emporter disponible',
];

const EVENT_TYPES_EN = [
  'Birthday Party',
  'Family Gathering',
  'Wedding / Reception',
  'Corporate Dinner',
  'Community Event',
  'Office Lunch',
  'Other',
];
const EVENT_TYPES_FR = [
  'Fête d\'anniversaire',
  'Rassemblement familial',
  'Mariage / Réception',
  'Dîner corporatif',
  'Événement communautaire',
  'Dîner au bureau',
  'Autre',
];

const SERVICE_OPTIONS_EN = ['Reception Hall', 'Catering', 'Both'];
const SERVICE_OPTIONS_FR = ['Salle de réception', 'Traiteur', 'Les deux'];

export default function CateringPage() {
  const { t, lang } = useI18n();

  return (
    <div className="min-h-screen bg-ink">
      {/* Slim top nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
        <div className="container-editorial flex items-center justify-between py-4">
          <TransitionLink
            href="/"
            className="flex items-center gap-2 text-sm text-cream/70 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> {t('order.back')}
          </TransitionLink>
          <Logo variant="full" />
          <a
            href={`tel:${SITE.phoneHref}`}
            className="hidden text-sm text-cream/70 hover:text-gold sm:block"
          >
            {SITE.phoneDisplay}
          </a>
        </div>
      </header>

      <main>
        <HeroSection />
        <ServicesSection />
        <TestimonialsStrip />
        <QuoteForm />
        <CtaBand />
      </main>

      <CateringFooter />
    </div>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function HeroSection() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-ink py-28 md:py-40">
      {/* Background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)',
          backgroundSize: '12px 12px',
        }}
      />
      {/* Warm radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(139,26,26,0.18),transparent)]" />

      <div className="container-editorial relative text-center">
        <Reveal>
          <p className="eyebrow mb-8">{t('catering.eyebrow')}</p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-cream md:text-7xl">
            {t('catering.hero.h1')}{' '}
            <span className="font-accent italic capitalize text-gold">
              {t('catering.hero.h1accent')}
            </span>
            <br />
            {t('catering.hero.h1end')}
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-cream/65 md:text-lg">
            {t('catering.hero.sub')}
          </p>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href={`tel:${SITE.phoneHref}`} className="btn-gold">
              <Phone className="h-4 w-4" /> {t('catering.hero.cta1')}
            </a>
            <a href="#quote" className="btn-ghost">
              {t('catering.hero.cta2')}
            </a>
          </div>
        </Reveal>

        {/* Address chip */}
        <Reveal delay={280}>
          <p className="mt-10 flex items-center justify-center gap-2 text-sm text-cream/40">
            <MapPin className="h-4 w-4 text-gold/60" />
            {SITE.address.street}, {SITE.address.city}, {SITE.address.region}{' '}
            {SITE.address.postalCode}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────── Service cards ─────────────────────── */

function ServicesSection() {
  const { t, lang } = useI18n();
  const hallBullets = lang === 'fr' ? HALL_BULLETS_FR : HALL_BULLETS;
  const cateringBullets = lang === 'fr' ? CATERING_BULLETS_FR : CATERING_BULLETS;

  return (
    <section className="relative bg-ink-800 py-24 md:py-32">
      <div className="container-editorial grid gap-8 lg:grid-cols-2">
        {/* Reception Hall */}
        <ServiceCard
          icon={<Users className="h-7 w-7" />}
          eyebrow={t('catering.hall.eyebrow')}
          heading={t('catering.hall.h')}
          body={t('catering.hall.body')}
          bullets={hallBullets}
          ctaLabel={t('catering.hall.cta')}
          ctaHref={`tel:${SITE.phoneHref}`}
          accent="ember"
          delay={0}
        />
        {/* Catering */}
        <ServiceCard
          icon={<UtensilsCrossed className="h-7 w-7" />}
          eyebrow={t('catering.service.eyebrow')}
          heading={t('catering.service.h')}
          body={t('catering.service.body')}
          bullets={cateringBullets}
          ctaLabel={t('catering.service.cta')}
          ctaHref="#quote"
          accent="gold"
          delay={120}
        />
      </div>
    </section>
  );
}

function ServiceCard({
  icon,
  eyebrow,
  heading,
  body,
  bullets,
  ctaLabel,
  ctaHref,
  accent,
  delay,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  heading: string;
  body: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  accent: 'gold' | 'ember';
  delay: number;
}) {
  const isPhone = ctaHref.startsWith('tel:');
  const accentText = accent === 'gold' ? 'text-gold' : 'text-ember';
  const accentBorder = accent === 'gold' ? 'border-gold/30' : 'border-ember/30';
  const accentBg = accent === 'gold' ? 'bg-gold/10' : 'bg-ember/10';
  const accentIcon = accent === 'gold' ? 'text-gold' : 'text-ember';
  const accentCheck = accent === 'gold' ? 'text-gold' : 'text-ember';

  return (
    <Reveal delay={delay}>
      <div
        className={`flex h-full flex-col rounded-3xl border ${accentBorder} bg-ink p-8 md:p-10`}
      >
        {/* Icon */}
        <div
          className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${accentBg} ${accentIcon}`}
        >
          {icon}
        </div>

        <p className={`eyebrow mb-3 ${accentText}`}>{eyebrow}</p>
        <h2 className="font-display text-3xl font-semibold uppercase leading-[0.95] tracking-tight text-cream md:text-4xl">
          {heading}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-cream/65">{body}</p>

        {/* Bullet list */}
        <ul className="mt-7 space-y-2.5">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-3 text-sm text-cream/75">
              <Check className={`h-4 w-4 shrink-0 ${accentCheck}`} strokeWidth={2.5} />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          {isPhone ? (
            <a
              href={ctaHref}
              className={`inline-flex items-center gap-2 ${accent === 'gold' ? 'btn-gold' : 'btn-ghost border-ember/50 text-cream hover:border-ember hover:text-ember'}`}
            >
              <Phone className="h-4 w-4" /> {ctaLabel}
            </a>
          ) : (
            <a href={ctaHref} className="btn-gold">
              {ctaLabel}
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}

/* ─────────────────────── Social proof strip ─────────────────────── */

function TestimonialsStrip() {
  const { lang } = useI18n();
  const items =
    lang === 'fr'
      ? [
          { quote: 'Parfait pour notre dîner corporatif — tout le monde a adoré !', author: 'Sophie M.' },
          { quote: 'La salle était magnifique et la nourriture était exceptionnelle.', author: 'Karim B.' },
          { quote: 'Nous avons commandé le traiteur pour un mariage de 80 personnes. Impeccable.', author: 'Priya & David' },
        ]
      : [
          { quote: 'Perfect for our corporate dinner — everyone loved it!', author: 'Sophie M.' },
          { quote: 'The hall was beautiful and the food was outstanding.', author: 'Karim B.' },
          { quote: 'We had catering for an 80-person wedding. Absolutely impeccable.', author: 'Priya & David' },
        ];

  return (
    <section className="relative overflow-hidden bg-ink py-20 md:py-24">
      <div className="container-editorial">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.author} delay={i * 100}>
              <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
                <div className="mb-4 flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="font-accent text-lg italic leading-relaxed text-cream/85">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm font-medium text-cream/50">— {item.author}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Quote form ─────────────────────── */

function QuoteForm() {
  const { t, lang } = useI18n();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    date: '',
    guests: '',
    service: '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const eventTypes = lang === 'fr' ? EVENT_TYPES_FR : EVENT_TYPES_EN;
  const serviceOptions = lang === 'fr' ? SERVICE_OPTIONS_FR : SERVICE_OPTIONS_EN;

  const canSubmit =
    !!form.name && !!form.phone && !!form.service && !busy;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    // Simulate a small delay then show confirmation (wire to a real backend/email service as needed).
    await new Promise((r) => setTimeout(r, 900));
    setSent(true);
    setBusy(false);
  }

  return (
    <section id="quote" className="relative bg-ink-800 py-24 md:py-32">
      {/* Warm ember glow top-right */}
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-ember/10 blur-3xl" />

      <div className="container-editorial">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow mb-4">{t('catering.form.eyebrow')}</p>
          <h2 className="font-display text-3xl font-semibold uppercase leading-[0.95] tracking-tight text-cream md:text-5xl">
            {t('catering.form.h')}
          </h2>
        </Reveal>

        <div className="mx-auto max-w-2xl">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-gold/30 bg-ink p-12 text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
                <Check className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-display text-2xl text-cream">{t('catering.form.sent')}</h3>
              <p className="mt-3 text-cream/55">{t('catering.form.note')}</p>
              <a href={`tel:${SITE.phoneHref}`} className="btn-gold mt-8 inline-flex items-center gap-2">
                <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
              </a>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-ink p-8 md:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label={t('catering.form.name')} required>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-catering"
                    placeholder="Your name"
                  />
                </FormField>

                <FormField label={t('catering.form.phone')} required>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-catering"
                    placeholder="(514) 000-0000"
                  />
                </FormField>

                <FormField label={t('catering.form.email')}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-catering"
                    placeholder="you@email.com"
                  />
                </FormField>

                <FormField label={t('catering.form.eventType')}>
                  <select
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    className="input-catering appearance-none"
                  >
                    <option value="">{t('catering.form.eventType.ph')}</option>
                    {eventTypes.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label={t('catering.form.date')}>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" />
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="input-catering pl-10"
                    />
                  </div>
                </FormField>

                <FormField label={t('catering.form.guests')}>
                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" />
                    <input
                      type="number"
                      min="1"
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: e.target.value })}
                      className="input-catering pl-10"
                      placeholder="e.g. 50"
                    />
                  </div>
                </FormField>

                <FormField label={t('catering.form.service')} required className="sm:col-span-2">
                  <div className="flex flex-wrap gap-3">
                    {serviceOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm({ ...form, service: opt })}
                        className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                          form.service === opt
                            ? 'border-gold bg-gold/15 text-gold'
                            : 'border-white/15 text-cream/60 hover:border-gold/40 hover:text-cream'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label={t('catering.form.message')} className="sm:col-span-2">
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-catering resize-none"
                    placeholder={t('catering.form.message.ph')}
                  />
                </FormField>
              </div>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="btn-gold flex-1 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t('catering.form.submit')
                  )}
                </button>
                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="btn-ghost flex-1 text-center"
                >
                  <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
                </a>
              </div>
              <p className="mt-4 text-center text-xs text-cream/40">{t('catering.form.note')}</p>
            </form>
          )}
        </div>
      </div>

      <style jsx global>{`
        .input-catering {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(28, 26, 23, 0.6);
          padding: 0.7rem 0.9rem;
          font-size: 0.9rem;
          color: #f5f2ec;
        }
        .input-catering::placeholder { color: rgba(245, 242, 236, 0.3); }
        .input-catering:focus { outline: none; border-color: rgba(201, 168, 76, 0.5); }
        .input-catering option { background: #1c1a17; }
      `}</style>
    </section>
  );
}

function FormField({
  label,
  required,
  children,
  className = '',
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs uppercase tracking-wide text-cream/50">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {children}
    </label>
  );
}

/* ─────────────────────── CTA band ─────────────────────── */

function CtaBand() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_100%,rgba(139,26,26,0.14),transparent)]" />
      <div className="container-editorial relative text-center">
        <Reveal>
          <p className="eyebrow mb-6">{t('catering.cta.eyebrow')}</p>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-cream md:text-6xl">
            {t('catering.cta.h')}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href={`tel:${SITE.phoneHref}`} className="btn-gold">
              <Phone className="h-4 w-4" /> {t('catering.cta.call')} — {SITE.phoneDisplay}
            </a>
            <a href="#quote" className="btn-ghost">
              {t('catering.cta.quote')}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────── Slim footer ─────────────────────── */

function CateringFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-white/10 bg-ink py-10">
      <div className="container-editorial flex flex-col items-center gap-4 text-center text-sm text-cream/40 md:flex-row md:justify-between md:text-left">
        <p>© {new Date().getFullYear()} {SITE.name} — {SITE.address.city}</p>
        <p>
          {SITE.address.street}, {SITE.address.city}, {SITE.address.region}{' '}
          {SITE.address.postalCode}
        </p>
        <a href={`tel:${SITE.phoneHref}`} className="hover:text-gold">
          {SITE.phoneDisplay}
        </a>
      </div>
    </footer>
  );
}
