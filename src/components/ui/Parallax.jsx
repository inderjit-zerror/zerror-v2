'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

// Drifts its content against the scroll. `speed` is the travel in % of its own height.
export default function Parallax({ children, speed = 12, className = '' }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { yPercent: speed },
        {
          yPercent: -speed,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`parallax ${className}`}>
      {children}
    </div>
  );
}
