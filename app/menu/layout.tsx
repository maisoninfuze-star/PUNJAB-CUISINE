import { MenuHeader } from '@/components/menu/MenuHeader';
import { Footer } from '@/components/sections/Footer';
import { StickyCart } from '@/components/cart/StickyCart';

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] bg-ink">
      <MenuHeader />
      <main>{children}</main>
      <Footer />
      <StickyCart />
    </div>
  );
}
