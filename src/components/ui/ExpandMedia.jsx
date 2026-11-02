'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

// Widens from an inset frame to full bleed as it scrolls into view. It animates layout
// (not clip-path) on purpose: WebGL images track this element's rect, so they grow with it.
export default function ExpandMedia({ children, className = '' }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { '--inset': 1 },
        {
          '--inset': 0,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'top 15%', scrub: 0.6 },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`expand-media ${className}`}>
      {children}
    </div>
  );
}
