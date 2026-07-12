import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MENU, getItem } from '@/lib/menu';
import { DishView } from '@/components/menu/DishView';
import { SITE } from '@/lib/site';

export function generateStaticParams() {
  return MENU.map((m) => ({ category: m.category, dish: m.id }));
}

export function generateMetadata({ params }: { params: { category: string; dish: string } }): Metadata {
  const item = getItem(params.dish);
  if (!item || item.category !== params.category) return {};
  return {
    title: item.name,
    description: item.description,
    alternates: { canonical: `/menu/${item.category}/${item.id}` },
    openGraph: {
      title: `${item.name} — ${SITE.name}`,
      description: item.description,
      images: [{ url: item.image, width: 1024, height: 1024, alt: item.name }],
    },
  };
}

export default function DishPage({ params }: { params: { category: string; dish: string } }) {
  const item = getItem(params.dish);
  if (!item || item.category !== params.category) notFound();
  return <DishView itemId={item.id} />;
}
