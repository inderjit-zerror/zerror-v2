'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { onEnter } from '@/lib/store';
import Reveal from './Reveal';

// The opening frame shared by every inner page: deck-style meta row, a masked title,
// an intro and a row of facts. Formation/theme attributes pass straight through.
export default function PageHero({ index, label, aside, title, count, intro, facts = [], className = '', children, ...data }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      gsap.set(q('.page-hero__fade'), { opacity: 0, y: 16 });
      const off = onEnter(() => {
        gsap.to(q('.page-hero__fade'), { opacity: 1, y: 0, duration: 1.1, stagger: 0.07, delay: 0.45 });
      });
      gsap.to(q('.page-hero__inner'), {
        yPercent: -10,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      return off;
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className={`page-hero ${className}`} {...data}>
      <div className="page-hero__inner">
        <div className="page-hero__top">
          <span className="meta page-hero__fade">
            [{index}] {label}
          </span>
          <span className="meta page-hero__fade">{aside}</span>
        </div>

        <h1 className={`display-1 page-hero__title ${count ? 'page-hero__title--count' : ''}`}>
          <Reveal as="span" trigger="enter">
            {title}
          </Reveal>
          {count && <sup className="page-hero__count page-hero__fade">({count})</sup>}
        </h1>

        <div className="page-hero__foot">
          {intro && (
            <Reveal as="p" className="lead page-hero__intro" trigger="enter" delay={0.15}>
              {intro}
            </Reveal>
          )}
          {facts.length > 0 && (
            <dl className="page-hero__facts">
              {facts.map((f) => (
                <div key={f.label} className="page-hero__fade">
                  <dt>{f.value}</dt>
                  <dd>{f.label}</dd>
                </div>
              ))}
            </dl>
          )}
          {children}
        </div>
      </div>

      <div className="page-hero__scroll page-hero__fade" aria-hidden="true">
        <i />
        <span>Scroll</span>
      </div>
    </section>
  );
}
