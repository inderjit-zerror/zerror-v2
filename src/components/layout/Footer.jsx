'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { store } from '@/lib/store';
import { nav, services, studio } from '@/lib/content';
import TLink from '@/components/ui/TLink';
import RollText from '@/components/ui/RollText';
import LocalTime from '@/components/ui/LocalTime';
import { Wordmark } from '@/components/ui/Logo';
import { PixelArrow } from '@/components/ui/Pixel';

export default function Footer() {
  const ref = useRef(null);

  useGSAP(
    () => {
      // The wordmark rises letter by letter as the footer comes in.
      gsap.from(ref.current.querySelectorAll('.footer__mark path'), {
        yPercent: 100,
        duration: 1.3,
        stagger: 0.07,
        ease: 'zr.out',
        scrollTrigger: { trigger: ref.current.querySelector('.footer__mark'), start: 'top 95%', once: true },
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="footer" data-theme="blue" data-formation="none" data-label="" data-index="">
      <div className="footer__grid">
        <div className="footer__col footer__col--lead">
          <p className="footer__lead">Have a project in mind?</p>
          <a className="footer__email" href={`mailto:${studio.email}`} data-cursor="Write us">
            <RollText text={studio.email} />
          </a>
        </div>
        <div className="footer__col">
          <p className="meta">Studio</p>
          <address>
            {studio.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <LocalTime className="footer__time" />
        </div>
        <div className="footer__col">
          <p className="meta">Services</p>
          <ul>
            {services.map((s) => (
              <li key={s.id}>
                <TLink href="/#services" className="footer__link">
                  <RollText text={s.short} />
                </TLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__col">
          <p className="meta">Sitemap</p>
          <ul>
            {[{ label: 'Home', href: '/' }, ...nav].map((item) => (
              <li key={item.href}>
                <TLink href={item.href} className="footer__link">
                  <RollText text={item.label} />
                </TLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer__col">
          <p className="meta">Connect</p>
          <ul>
            {studio.socials.map((s) => (
              <li key={s.label}>
                <TLink href={s.href} className="footer__link">
                  <RollText text={s.label} />
                </TLink>
              </li>
            ))}
            <li>
              <a href={studio.phoneHref} className="footer__link">
                <RollText text={studio.phone} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__mark">
        <Wordmark title="Zerror Studios" />
      </div>

      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Zerror Studios</span>
        <span className="footer__tagline">Systems. Structure. Precision.</span>
        <button type="button" className="footer__top" onClick={() => store.lenis?.scrollTo(0, { duration: 2 })}>
          Back to top
          <PixelArrow direction="up" />
        </button>
      </div>
    </footer>
  );
}
