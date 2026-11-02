'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { caseStudies, projects, synthesis } from '@/lib/content';
import SectionBar from '@/components/ui/SectionBar';
import Reveal from '@/components/ui/Reveal';
import ScrubText from '@/components/ui/ScrubText';
import CaseCard from '@/components/ui/CaseCard';
import Button from '@/components/ui/Button';
import TLink from '@/components/ui/TLink';
import { PixelArrow } from '@/components/ui/Pixel';

// Deck slides 08–17: four case studies on a pinned horizontal track, then the synthesis.
export default function Work() {
  const ref = useRef(null);
  const pin = useRef(null);
  const track = useRef(null);
  const synth = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const distance = () => track.current.scrollWidth - window.innerWidth;
        gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              ref.current.style.setProperty('--track', self.progress.toFixed(4));
            },
          },
        });
      });

      gsap.fromTo(
        synth.current.querySelectorAll('.w'),
        { opacity: 0.14 },
        {
          opacity: (_, el) => (el.hasAttribute('data-key') ? 1 : 0.55),
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: synth.current, start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <>
      <section ref={ref} className="section work" data-theme="light" data-formation="none" data-label="Case studies" data-index="05">
        <SectionBar index="05" label="Case studies" />
        <div className="work__head">
          <Reveal as="h2" className="display-1">
            Selected work
          </Reveal>
          <div className="work__aside">
            <Reveal as="p" className="body-text">
              Custom-built infrastructure, not template projects. Publishers, film houses, fashion labels and founders
              launching for the first time.
            </Reveal>
            <Button href="/work" variant="ghost">
              All {projects.length} projects
            </Button>
          </div>
        </div>

        <div ref={pin} className="work__pin">
          <div className="work__progress" aria-hidden="true">
            <i />
          </div>
          <div ref={track} className="work__track">
            {caseStudies.map((study) => (
              <CaseCard key={study.slug} study={study} />
            ))}
            <TLink href="/work" className="work__end" data-cursor="Explore">
              <span className="meta">Index</span>
              <span className="work__end-count">{projects.length}+</span>
              <span className="work__end-label">
                Projects since 2022 <PixelArrow />
              </span>
            </TLink>
          </div>
        </div>
      </section>

      <section
        ref={synth}
        className="synthesis"
        data-theme="light"
        data-formation="pixels"
        data-label="Synthesis"
        data-index="05"
      >
        <p className="meta synthesis__label">Synthesis — why this matters</p>
        <ScrubText as="h2" className="synthesis__title display-2" segments={synthesis.title} />
        <Reveal as="p" className="body-text synthesis__body">
          {synthesis.body}
        </Reveal>
      </section>
    </>
  );
}
