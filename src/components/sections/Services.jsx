'use client';

import { useRef, useState } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { setFormation } from '@/lib/store';
import { services } from '@/lib/content';
import SectionBar from '@/components/ui/SectionBar';
import Reveal from '@/components/ui/Reveal';

const PLACEMENT = { fx: 0.3, fy: 0.02, fs: 0.62, mfx: 0.3, mfy: 0.36, mfs: 0.26 };

// Deck slide 06. The active service (by scroll, or by hover) morphs the voxels
// into its own object: a browser, a software stack, a shopping bag, the submark.
export default function Services() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);

  const activate = (i) => {
    setActive(i);
    setFormation(services[i].formation, PLACEMENT);
  };

  useGSAP(
    () => {
      ref.current.querySelectorAll('.svc').forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: 'top 62%',
          end: 'bottom 62%',
          onToggle: (self) => self.isActive && activate(i),
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="services" className="section services" data-theme="ink" data-label="Our services" data-index="04">
      <SectionBar index="04" label="Our services" />
      <div className="services__head">
        <Reveal as="h2" className="display-2">
          One team. Design, development and marketing.
        </Reveal>
        <Reveal as="p" className="body-text is-muted-text services__intro">
          Great ideas get lost when they change hands. At Zerror, the people who design your product are the people who
          build and grow it.
        </Reveal>
      </div>

      <ol className="services__list">
        {services.map((s, i) => (
          <li
            key={s.id}
            className={`svc ${active === i ? 'is-active' : ''}`}
            onPointerEnter={() => activate(i)}
            onFocus={() => activate(i)}
            tabIndex={0}
          >
            <span className="svc__num" aria-hidden="true">
              0{i + 1}
            </span>
            <div className="svc__main">
              <h3 className="svc__title">{s.title}</h3>
              <div className="svc__more">
                <div>
                  <p className="svc__text">{s.text}</p>
                  <ul className="svc__items">
                    {s.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
