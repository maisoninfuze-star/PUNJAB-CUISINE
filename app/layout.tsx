import type { Metadata, Viewport } from 'next';
import { display, accent, sans } from '@/lib/fonts';
import { SITE } from '@/lib/site';
import { RestaurantJsonLd } from '@/components/seo/JsonLd';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { I18nProvider } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'Punjabi restaurant Montreal',
    'authentic Punjabi cuisine',
    'butter chicken Montreal',
    'tandoori',
    'Indian fine dining',
    'pickup order',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ['/og.jpg'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE.url },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${accent.variable} ${sans.variable}`}
    >
      <body>
        <RestaurantJsonLd />
        <I18nProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </I18nProvider>
      </body>
    </html>
  );
}
