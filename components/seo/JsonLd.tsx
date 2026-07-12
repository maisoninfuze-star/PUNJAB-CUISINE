import { SITE } from '@/lib/site';
import { MENU, CATEGORIES } from '@/lib/menu';

/**
 * Schema.org Restaurant + Menu structured data (JSON-LD).
 * Rendered server-side in the document head region.
 */
export function RestaurantJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE.url}/#restaurant`,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    telephone: SITE.phoneHref,
    email: SITE.email,
    servesCuisine: ['Punjabi', 'Indian', 'North Indian'],
    priceRange: SITE.priceRange,
    acceptsReservations: 'True',
    image: [`${SITE.url}/og.jpg`],
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '11:00',
        closes: '23:00',
      },
    ],
    hasMenu: {
      '@type': 'Menu',
      hasMenuSection: CATEGORIES.map((c) => ({
        '@type': 'MenuSection',
        name: c.label,
        hasMenuItem: MENU.filter((m) => m.category === c.id).map((m) => ({
          '@type': 'MenuItem',
          name: m.name,
          description: m.description,
          offers: {
            '@type': 'Offer',
            price: m.price.toFixed(2),
            priceCurrency: 'CAD',
          },
        })),
      })),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '328',
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
