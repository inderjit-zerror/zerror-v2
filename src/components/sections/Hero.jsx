'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { onEnter } from '@/lib/store';
import { hero, studio } from '@/lib/content';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

// The voxel wordmark assembles in the WebGL layer behind this section (data-formation="logo").
export default function Hero() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap.set(q('.hero__fade'), { opacity: 0, y: 18 });
      const off = onEnter(() => {
        gsap.to(q('.hero__fade'), { opacity: 1, y: 0, duration: 1.2, stagger: 0.08, delay: 0.55 });
      });
      gsap.to(q('.hero__content'), {
        yPercent: -18,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom 20%', scrub: true },
      });
      return off;
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="hero"
      data-theme="blue"
      data-formation="logo"
      data-fy="0.13"
      data-fs="0.84"
      data-mfy="0.16"
      data-mfs="1.1"
      data-label=""
    >
      <div className="hero__content">
        <div className="hero__top">
          <span className="meta hero__fade">[ {studio.tagline} ]</span>
          <span className="meta hero__fade">
            {studio.city}, India — Est. {studio.founded}
          </span>
        </div>

        <div className="hero__bottom">
          <Reveal as="h1" className="hero__title" trigger="enter" delay={0.35}>
            <span className="sr-only">Zerror Studios. </span>
            {hero.title}
          </Reveal>
          <div className="hero__aside">
            <p className="hero__intro hero__fade">{hero.intro}</p>
            <div className="hero__actions hero__fade">
              <Button href="/contact">Start a project</Button>
              <Button href="/work" variant="ghost">
                See our work
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__scroll hero__fade" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
