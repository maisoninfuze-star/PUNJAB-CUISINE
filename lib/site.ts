/** Restaurant brand + business constants. Single source of truth. */
export const SITE = {
  name: 'Punjabi Cuisine',
  tagline: 'Authentic Punjabi Cuisine, Crafted with Passion',
  description:
    'A cinematic Punjabi dining experience in Montreal — tandoor-fired classics, slow-cooked curries and warm Punjabi hospitality. Reserve a table or order pickup.',
  url: 'https://punjabicuisine.ca',
  phoneDisplay: '(514) 685-8585',
  phoneHref: '+15146858585',
  email: 'info@punjabicuisine.ca',
  address: {
    street: '4847 Bd des Sources',
    city: 'Dollard-des-Ormeaux',
    region: 'QC',
    postalCode: 'H8Y 3C6',
    country: 'CA',
  },
  geo: { lat: 45.4967, lng: -73.8196 },
  hours: [
    { days: 'Monday – Thursday', daysFr: 'Lundi – Jeudi', time: '5:00 PM – 10:30 PM', timeFr: '17 h – 22 h 30' },
    { days: 'Friday – Saturday', daysFr: 'Vendredi – Samedi', time: '5:00 PM – 11:30 PM', timeFr: '17 h – 23 h 30' },
    { days: 'Sunday', daysFr: 'Dimanche', time: '5:00 PM – 10:00 PM', timeFr: '17 h – 22 h' },
  ],
  priceRange: '$$',
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
} as const;

export const NAV_LINKS = [
  { label: 'Experience', href: '/#experience', key: 'nav.experience' },
  { label: 'Menu', href: '/#menu', key: 'nav.menu' },
  { label: 'Story', href: '/#story', key: 'nav.story' },
  { label: 'Visit', href: '/#visit', key: 'nav.visit' },
  { label: 'Reception & Catering', href: '/catering', key: 'nav.catering' },
] as const;
