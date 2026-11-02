'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

// A single pixel that follows the pointer: grows into a frame over links and
// into a labelled block over anything with data-cursor="Label".
export default function Cursor() {
  const ref = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    document.documentElement.classList.add('has-cursor');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.classList.add('is-visible');
    };
    const over = (e) => {
      const target = e.target.closest('[data-cursor], a, button, input, textarea, select, label, [role="button"]');
      if (!target) {
        el.dataset.state = '';
        return;
      }
      if (target.dataset.cursor) {
        el.dataset.state = 'label';
        label.current.textContent = target.dataset.cursor;
      } else if (target.matches('input, textarea, select')) {
        el.dataset.state = 'text';
      } else {
        el.dataset.state = 'link';
      }
    };
    const down = () => el.classList.add('is-down');
    const up = () => el.classList.remove('is-down');
    const leave = () => el.classList.remove('is-visible');

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="cursor__box" />
      <span ref={label} className="cursor__label" />
    </div>
  );
}
