'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { store, on } from '@/lib/store';

// Fixed frame detail from the deck: current section and page progress.
export default function Hud() {
  const ref = useRef(null);
  const label = useRef(null);
  const bar = useRef(null);
  const pct = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const off = on('section', ({ index, label: text }) => {
      const show = Boolean(text);
      gsap.to(el, { autoAlpha: show ? 1 : 0, duration: 0.5 });
      if (!show) return;
      gsap.to(label.current, {
        yPercent: -100,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          label.current.textContent = index ? `[${index}] ${text}` : text;
          gsap.fromTo(label.current, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: 'zr.out' });
        },
      });
    });
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.current.style.transform = `scaleX(${p})`;
      pct.current.textContent = String(Math.round(p * 100)).padStart(3, '0');
    };
    gsap.ticker.add(tick);
    return () => {
      off();
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div ref={ref} className="hud" aria-hidden="true">
      <div className="hud__label">
        <span ref={label} />
      </div>
      <div className="hud__progress">
        <span className="hud__track">
          <i ref={bar} />
        </span>
        <span ref={pct}>000</span>
      </div>
    </div>
  );
}
