'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

// The deck's frame: index · label · studio, on a hairline that draws in.
export default function SectionBar({ index, label, aside = 'Zerror Studios ©2026' }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true } });
      tl.from(ref.current, { '--draw': 0, duration: 1.4, ease: 'zr.inOut' }).from(
        ref.current.querySelectorAll('span'),
        { yPercent: 100, opacity: 0, duration: 0.8, stagger: 0.08 },
        0.2,
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="section-bar">
      <span>{index}</span>
      <span>{label}</span>
      <span>{aside}</span>
    </div>
  );
}
