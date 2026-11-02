'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

// Counts up when scrolled into view. `plain` skips thousands separators (years).
export default function Counter({ value, suffix = '', plain = false, className = '' }) {
  const ref = useRef(null);
  const format = (v) => (plain ? String(Math.round(v)) : Math.round(v).toLocaleString('en-IN'));

  useGSAP(() => {
    const el = ref.current;
    const from = plain ? value - 22 : 0;
    const state = { v: from };
    el.firstChild.textContent = format(from);
    gsap.to(state, {
      v: value,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        el.firstChild.textContent = format(state.v);
      },
    });
  });

  return (
    <span ref={ref} className={`counter ${className}`} aria-label={`${format(value)}${suffix}`}>
      <span aria-hidden="true">{format(value)}</span>
      {suffix && <span className="counter__suffix" aria-hidden="true">{suffix}</span>}
    </span>
  );
}
