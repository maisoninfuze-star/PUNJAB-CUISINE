import type { Metadata } from 'next';
import { MenuHubView } from '@/components/menu/MenuHubView';

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'Browse the full Punjabi Cuisine menu — tandoor classics, slow-cooked curries, biryani, street food, breads and desserts. Order pickup in Dollard-des-Ormeaux.',
  alternates: { canonical: '/menu' },
};

export default function MenuHubPage() {
  return <MenuHubView />;
}
