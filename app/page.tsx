import { Loader } from '@/components/loader/Loader';
import { Nav } from '@/components/nav/Nav';
import { HeroVideo } from '@/components/hero/HeroVideo';
import { Marquee } from '@/components/sections/Marquee';
import { Experience } from '@/components/sections/Experience';
import { Story } from '@/components/sections/Story';
import { Signatures } from '@/components/sections/Signatures';
import { Manifesto } from '@/components/sections/Manifesto';
import { Stats } from '@/components/sections/Stats';
import { Gallery } from '@/components/sections/Gallery';
import { MenuSection } from '@/components/menu/MenuSection';
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
        <HeroVideo />
        <Marquee />
        <Experience />
        <Story />
        <Signatures />
        <Manifesto />
        <Stats />
        <Gallery />
        <MenuSection />
        <Testimonials />
        <Visit />
      </main>
      <Footer />
      <StickyCart />
    </>
  );
}
