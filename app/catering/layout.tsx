import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Reception Hall & Catering | Punjabi Cuisine Dollard-des-Ormeaux',
  description:
    'Book Punjabi Cuisine for reception hall services and authentic Indian/Punjabi catering in Dollard-des-Ormeaux, Montreal, and the West Island. Perfect for family events, parties, office lunches, and celebrations.',
  keywords: [
    'Indian catering Montreal',
    'Punjabi catering Dollard-des-Ormeaux',
    'Reception hall West Island',
    'Indian restaurant catering West Island',
    'Punjabi Cuisine catering',
    'Catering for events Montreal',
    'Private event restaurant Dollard-des-Ormeaux',
    'traiteur indien Montréal',
    'salle de réception Dollard-des-Ormeaux',
  ],
  openGraph: {
    title: 'Reception Hall & Catering | Punjabi Cuisine',
    description:
      'Authentic Indian/Punjabi catering and private reception hall in Dollard-des-Ormeaux, Montreal.',
    url: `${SITE.url}/catering`,
    siteName: SITE.name,
    images: [{ url: `${SITE.url}/og.jpg`, width: 1200, height: 630 }],
    locale: 'en_CA',
    type: 'website',
  },
  alternates: { canonical: `${SITE.url}/catering` },
};

export default function CateringLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
