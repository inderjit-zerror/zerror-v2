'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from '@/lib/gsap';
import { store, on } from '@/lib/store';
import { nav, projects, studio } from '@/lib/content';
import TLink from '@/components/ui/TLink';
import RollText from '@/components/ui/RollText';
import Magnetic from '@/components/ui/Magnetic';
import LocalTime from '@/components/ui/LocalTime';
import { Wordmark, Submark } from '@/components/ui/Logo';
import { PixelArrow } from '@/components/ui/Pixel';

export default function Nav() {
  const pathname = usePathname();
  const header = useRef(null);
  const menu = useRef(null);
  const [open, setOpen] = useState(false);

  // Hide on scroll down, reveal on scroll up (always visible while the menu is open).
  useEffect(() => {
    let hidden = false;
    let lastY = 0;
    const tick = () => {
      const y = window.scrollY;
      const menuOpen = menu.current?.classList.contains('is-open');
      const shouldHide = y > lastY + 4 && y > 160 && !menuOpen;
      const shouldShow = y < lastY - 4 || y < 160 || menuOpen;
      if (shouldHide && !hidden) {
        hidden = true;
        gsap.to(header.current, { yPercent: -110, duration: 0.6, ease: 'zr.inOut' });
      } else if (shouldShow && hidden) {
        hidden = false;
        gsap.to(header.current, { yPercent: 0, duration: 0.6, ease: 'zr.out' });
      }
      lastY = y;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  // Entrance after the preloader.
  useEffect(() => {
    gsap.set(header.current.querySelectorAll('.nav__item'), { yPercent: -120, opacity: 0 });
    return on('ready', () => {
      gsap.to(header.current.querySelectorAll('.nav__item'), { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.06, delay: 0.35 });
    });
  }, []);

  // Full-screen menu.
  useEffect(() => {
    const el = menu.current;
    if (open) {
      store.lenis?.stop();
      el.classList.add('is-open');
      gsap.timeline()
        .set(el, { visibility: 'visible' })
        .fromTo(el.querySelectorAll('.menu__cell'), { scaleY: 0 }, { scaleY: 1, duration: 0.6, stagger: 0.04, ease: 'zr.inOut' })
        .fromTo(el.querySelectorAll('.menu__link span'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06 }, '-=0.25')
        .fromTo(el.querySelectorAll('.menu__foot > *'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.05 }, '-=0.7');
      const esc = (e) => e.key === 'Escape' && setOpen(false);
      window.addEventListener('keydown', esc);
      return () => window.removeEventListener('keydown', esc);
    }
    if (el.classList.contains('is-open')) {
      gsap.timeline({
        onComplete: () => {
          el.classList.remove('is-open');
          gsap.set(el, { visibility: 'hidden' });
          if (!store.transitioning) store.lenis?.start();
        },
      })
        .to(el.querySelectorAll('.menu__link span'), { yPercent: -110, duration: 0.5, stagger: 0.03, ease: 'zr.inOut' })
        .to(el.querySelectorAll('.menu__foot > *'), { opacity: 0, duration: 0.3 }, 0)
        .to(el.querySelectorAll('.menu__cell'), { scaleY: 0, transformOrigin: 'top', duration: 0.5, stagger: 0.03, ease: 'zr.inOut' }, 0.2);
    }
  }, [open]);

  useEffect(() => on('navigate', () => setOpen(false)), []);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href) && !href.includes('#'));

  return (
    <>
      <header ref={header} className={`nav ${open ? 'is-menu-open' : ''}`}>
        <TLink href="/" className="nav__logo nav__item" aria-label="Zerror Studios — home">
          <Wordmark className="nav__wordmark" />
          <Submark className="nav__submark" />
        </TLink>

        <nav className="nav__links nav__item" aria-label="Primary">
          {nav.map((item) => (
            <TLink key={item.href} href={item.href} className={`nav__link ${isActive(item.href) ? 'is-active' : ''}`}>
              <RollText text={item.label} />
              {item.label === 'Work' && <sup>{projects.length}</sup>}
            </TLink>
          ))}
        </nav>

        <div className="nav__right">
          <LocalTime className="nav__time nav__item" />
          <span className="nav__item nav__cta">
            <Magnetic strength={0.3}>
              <TLink href="/contact" className="btn btn--solid btn--small">
                <RollText text="Start a project" />
                <span className="btn__icon">
                  <PixelArrow />
                </span>
              </TLink>
            </Magnetic>
          </span>
          <button
            type="button"
            className="nav__burger nav__item"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav__burger-label">{open ? 'Close' : 'Menu'}</span>
            <span className="nav__burger-icon" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div ref={menu} id="site-menu" className="menu" aria-hidden={!open}>
        <div className="menu__cells" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="menu__cell" />
          ))}
        </div>
        <nav className="menu__nav" aria-label="Menu">
          {[{ label: 'Home', href: '/' }, ...nav].map((item, i) => (
            <TLink key={item.href} href={item.href} className="menu__link" tabIndex={open ? 0 : -1}>
              <span>
                <em>0{i + 1}</em>
                {item.label}
              </span>
            </TLink>
          ))}
        </nav>
        <div className="menu__foot">
          <a href={`mailto:${studio.email}`} tabIndex={open ? 0 : -1}>
            {studio.email}
          </a>
          <a href={studio.phoneHref} tabIndex={open ? 0 : -1}>
            {studio.phone}
          </a>
          <LocalTime />
        </div>
      </div>
    </>
  );
}
