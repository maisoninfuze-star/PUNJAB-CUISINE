import { Loader } from '@/components/loader/Loader';
import { Nav } from '@/components/nav/Nav';
import { HeroMorph } from '@/components/hero/HeroMorph';
import { Experience } from '@/components/sections/Experience';
import { Story } from '@/components/sections/Story';
import { Signatures } from '@/components/sections/Signatures';
import { MenuPreview } from '@/components/menu/MenuPreview';
import { Testimonials } from '@/components/sections/Testimonials';
import { Visit } from '@/components/sections/Visit';
import { Footer } from '@/components/sections/Footer';
import { StickyCart } from '@/components/cart/StickyCart';

export default function HomePage() {
  return (
    <>
      <Loader />
      <Nav />
      <main>
        <HeroMorph />
        <Experience />
        <Story />
        <Signatures />
        <MenuPreview />
        <Testimonials />
        <Visit />
      </main>
      <Footer />
      <StickyCart />
    </>
  );
}
