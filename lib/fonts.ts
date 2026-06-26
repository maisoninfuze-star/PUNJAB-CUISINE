import { Playfair_Display, Cormorant_Garamond, Inter } from 'next/font/google';

/** Editorial display serif — headings. */
export const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

/** Italic accent serif — pull-quotes and accent phrases. */
export const accent = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-accent',
  display: 'swap',
});

/** Workhorse sans — body, labels, UI. */
export const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});
