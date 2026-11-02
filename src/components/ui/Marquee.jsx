'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { store } from '@/lib/store';

// Endless strip whose speed follows scroll velocity and flips with scroll direction.
export default function Marquee({ children, speed = 60, className = '', reverse = false }) {
  const track = useRef(null);

  useEffect(() => {
    const el = track.current;
    let x = 0;
    let dir = reverse ? 1 : -1;
    let boost = 0;
    const tick = (_, delta) => {
      const v = store.scroll.velocity;
      if (Math.abs(v) > 0.5) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
      boost += (Math.min(Math.abs(v), 40) * 0.12 - boost) * 0.08;
      const half = el.scrollWidth / 2;
      x += dir * (speed + speed * boost) * (delta / 1000);
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [speed, reverse]);

  return (
    <div className={`marquee ${className}`}>
      <div ref={track} className="marquee__track">
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
