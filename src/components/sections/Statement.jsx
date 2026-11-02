'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { setFormation, setSection } from '@/lib/store';
import { problem, solution } from '@/lib/content';
import ScrubText from '@/components/ui/ScrubText';

const PHASES = [
  { formation: 'split', index: '01', label: 'The problem' },
  { formation: 'unified', index: '02', label: 'The solution' },
];
const PLACEMENT = { fy: 0.17, fs: 0.86, mfy: 0.2, mfs: 1.15 };

// Deck slides 01–02, pinned: the words light up with scroll while the voxels
// split into design vs development, then merge into one system.
export default function Statement() {
  const ref = useRef(null);
  const pin = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      let phase = -1;
      const setPhase = (p) => {
        const next = p < 0.5 ? 0 : 1;
        if (next === phase) return;
        phase = next;
        setFormation(PHASES[next].formation, PLACEMENT);
        setSection(PHASES[next].index, PHASES[next].label);
        ref.current.dataset.phase = String(next);
      };

      const finalOpacity = (_, el) => (el.hasAttribute('data-key') ? 1 : 0.5);
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: '+=280%',
          pin: pin.current,
          scrub: 0.6,
          onUpdate: (self) => setPhase(self.progress),
          onEnter: (self) => setPhase(self.progress),
          onEnterBack: (self) => {
            phase = -1;
            setPhase(self.progress);
          },
        },
      });

      tl.fromTo(q('.statement__a .w'), { opacity: 0.12 }, { opacity: finalOpacity, stagger: 0.05, duration: 0.3 })
        .fromTo(q('.statement__tags--a span'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.2 }, 0.1)
        .to({}, { duration: 0.35 })
        .to(q('.statement__a, .statement__tags--a'), { opacity: 0, yPercent: -12, duration: 0.25 })
        .fromTo(q('.statement__b'), { opacity: 0, yPercent: 12 }, { opacity: 1, yPercent: 0, duration: 0.25 })
        .fromTo(q('.statement__b .w'), { opacity: 0.12 }, { opacity: finalOpacity, stagger: 0.05, duration: 0.3 })
        .fromTo(q('.statement__tags--b span'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2 }, '<0.1')
        .to({}, { duration: 0.4 });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="statement" data-theme="blue">
      <div ref={pin} className="statement__pin">
        <div className="statement__tags statement__tags--a" aria-hidden="true">
          <span className="chip">[ Design ]</span>
          <span className="chip">[ Development ]</span>
        </div>
        <div className="statement__tags statement__tags--b" aria-hidden="true">
          <span className="chip">[ Zero error ]</span>
        </div>

        <div className="statement__copy">
          <div className="statement__block statement__a">
            <p className="meta statement__label">01 — The problem</p>
            <ScrubText className="statement__text" segments={problem} />
          </div>
          <div className="statement__block statement__b">
            <p className="meta statement__label">02 — The solution</p>
            <ScrubText className="statement__text" segments={solution} />
          </div>
        </div>
      </div>
    </section>
  );
}
