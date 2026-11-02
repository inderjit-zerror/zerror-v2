'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

// Problem / Solution / Outcome, as the deck's grey cards. Each card rises in and its
// oversized numeral slides up from the card's edge.
export default function StoryCards({ story }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      ref.current.querySelectorAll('.story__card').forEach((card) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 85%', once: true } });
        tl.from(card, { y: 60, opacity: 0, duration: 1.1 })
          .from(card.querySelector('.story__num span'), { yPercent: 100, duration: 1.2 }, 0.1)
          .from(card.querySelectorAll('.story__body p'), { opacity: 0, y: 14, stagger: 0.08, duration: 0.9 }, 0.3);
      });
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className="story">
      {story.map(([title, paragraphs], i) => (
        <li key={title} className="story__card">
          <span className="story__num" aria-hidden="true">
            <span>{i + 1}</span>
          </span>
          <h2 className="story__title">{title}</h2>
          <div className="story__body">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
