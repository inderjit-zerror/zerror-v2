'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { process, values } from '@/lib/content';
import SectionBar from '@/components/ui/SectionBar';
import Reveal from '@/components/ui/Reveal';
import Marquee from '@/components/ui/Marquee';
import { PixelMark } from '@/components/ui/Pixel';

export default function Process() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const steps = ref.current.querySelector('.process__steps');
      gsap.fromTo(
        steps,
        { '--progress': 0 },
        { '--progress': 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 } },
      );
      gsap.from(ref.current.querySelectorAll('.step'), {
        opacity: 0,
        y: 40,
        duration: 1.1,
        stagger: 0.12,
        scrollTrigger: { trigger: steps, start: 'top 82%', once: true },
      });
    },
    { scope: ref },
  );

  return (
    <>
      <section
        ref={ref}
        className="section process"
        data-theme="ink"
        data-formation="unified"
        data-fx="0.28"
        data-fy="0.14"
        data-fs="0.56"
        data-mfx="0.26"
        data-mfy="0.34"
        data-mfs="0.34"
        data-label="How we work"
        data-index="07"
      >
        <SectionBar index="07" label="How we work" />
        <div className="process__head">
          <Reveal as="h2" className="display-1">
            What gets imagined is what goes live.
          </Reveal>
          <Reveal as="p" className="body-text is-muted-text">
            Zerror. Zero error. Naming a studio after perfection is a risk: every launch has to keep the promise. That is
            the point.
          </Reveal>
        </div>
        <ol className="process__steps">
          {process.map((step, i) => (
            <li key={step.title} className="step">
              <div className="step__top">
                <span className="step__num">0{i + 1}</span>
                <PixelMark seed={step.title} size={5} className="step__mark" />
              </div>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__text">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="values" data-theme="ink" data-formation="none" data-label="Values" data-index="07" aria-label="Our values">
        <Marquee speed={70}>
          {values.map((v) => (
            <span key={v} className="values__item">
              {v}
              <i aria-hidden="true" />
            </span>
          ))}
        </Marquee>
      </section>
    </>
  );
}
