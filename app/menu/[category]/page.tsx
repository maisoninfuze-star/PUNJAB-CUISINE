import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, itemsByCategory, type Category } from '@/lib/menu';
import { CategoryView } from '@/components/menu/CategoryView';

const isCategory = (v: string): v is Category => CATEGORIES.some((c) => c.id === v);

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const cat = CATEGORIES.find((c) => c.id === params.category);
  if (!cat) return {};
  const count = itemsByCategory(cat.id).length;
  return {
    title: `${cat.label} Menu`,
    description: `${cat.label} at Punjabi Cuisine — ${count} dishes available for pickup in Dollard-des-Ormeaux. Order online.`,
    alternates: { canonical: `/menu/${cat.id}` },
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  if (!isCategory(params.category)) notFound();
  return <CategoryView category={params.category} />;
}
