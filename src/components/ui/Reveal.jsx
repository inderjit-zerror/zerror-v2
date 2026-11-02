'use client';

import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { onEnter } from '@/lib/store';

// Masked line reveal. trigger="scroll" plays when the element enters the viewport,
// trigger="enter" plays when the page is uncovered (preloader / page transition).
export default function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  trigger = 'scroll',
  delay = 0,
  stagger = 0.09,
  ...rest
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      let off = () => {};
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'reveal-line',
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: 'visible' });
          const anim = gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.25,
            stagger,
            delay,
            ease: 'zr.out',
            paused: trigger === 'enter',
            scrollTrigger: trigger === 'scroll' ? { trigger: el, start: 'top 88%', once: true } : undefined,
          });
          if (trigger === 'enter') {
            off();
            off = onEnter(() => anim.play());
          }
          return anim;
        },
      });
      return () => off();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-reveal="" {...rest}>
      {children}
    </Tag>
  );
}
