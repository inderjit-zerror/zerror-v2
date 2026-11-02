import Hero from '@/components/sections/Hero';
import Statement from '@/components/sections/Statement';
import Audience from '@/components/sections/Audience';
import Services from '@/components/sections/Services';
import Work from '@/components/sections/Work';
import Clients from '@/components/sections/Clients';
import Process from '@/components/sections/Process';
import Cta from '@/components/sections/Cta';

export default function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <Audience />
      <Services />
      <Work />
      <Clients />
      <Process />
      <Cta />
    </>
  );
}
