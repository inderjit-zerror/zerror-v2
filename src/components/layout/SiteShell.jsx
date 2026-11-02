'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { store, on, onReady, setTheme, setFormation, setSection, THEMES } from '@/lib/store';
import { TransitionProvider } from './Transition';
import Nav from './Nav';
import Footer from './Footer';
import Hud from './Hud';
import Cursor from './Cursor';
import { useWebGLSupport } from '@/lib/webgl';

const Scene = dynamic(() => import('@/components/gl/Scene'), { ssr: false });

// Sections describe themselves with data attributes; this applies them as they cross the
// middle of the viewport: data-theme, data-formation (+ data-fx/fy/fs, data-mfx/mfy/mfs),
// data-label and data-index (for the HUD).
function activate(el) {
  const d = el.dataset;
  if (d.theme) setTheme(d.theme);
  if (d.formation) {
    setFormation(d.formation, { fx: d.fx, fy: d.fy, fs: d.fs, mfx: d.mfx, mfy: d.mfy, mfs: d.mfs });
  }
  if (d.label !== undefined) setSection(d.index || '', d.label);
}

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const gl = useWebGLSupport(false);

  useEffect(() => {
    // Every visit starts at the top, behind the preloader.
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  // Smooth scroll, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: !reduce });
    store.lenis = lenis;
    lenis.on('scroll', (e) => {
      store.scroll.velocity = e.velocity;
      ScrollTrigger.update();
    });
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (!store.ready) lenis.stop();
    const offReady = onReady(() => lenis.start());
    return () => {
      offReady();
      gsap.ticker.remove(tick);
      lenis.destroy();
      store.lenis = null;
    };
  }, []);

  // Pointer (shared with WebGL) and the click shockwave.
  useEffect(() => {
    const p = store.pointer;
    const move = (e) => {
      p.px = e.clientX;
      p.py = e.clientY;
      p.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.y = -((e.clientY / window.innerHeight) * 2 - 1);
      p.last = performance.now();
    };
    const down = (e) => {
      move(e);
      if (e.target.closest('a, button, input, textarea, select, label, [data-no-shock]')) return;
      store.shock = { x: p.x, y: p.y, time: performance.now() / 1000 };
    };
    const leave = () => {
      p.last = 0;
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  // Theme → CSS custom properties (the WebGL layer listens to the same event).
  useEffect(() => {
    const root = document.documentElement;
    return on('theme', (name) => {
      const vars = Object.fromEntries(Object.entries(THEMES[name]).filter(([k]) => k.startsWith('--')));
      root.dataset.theme = name;
      gsap.to(root, { ...vars, duration: store.transitioning ? 0 : 0.9, ease: 'zr.inOut', overwrite: 'auto' });
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEMES[name]['--bg']);
    });
  }, []);

  // Section observer, rebuilt per route after the page's own ScrollTriggers (pins) exist.
  useEffect(() => {
    const triggers = [];
    const raf = requestAnimationFrame(() => {
      const els = [...document.querySelectorAll('[data-theme], [data-formation], [data-label]')].filter(
        (el) => el !== document.documentElement,
      );
      els.forEach((el) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: 'top 50%',
            end: 'bottom 50%',
            onToggle: (self) => self.isActive && activate(el),
          }),
        );
      });
      ScrollTrigger.refresh();
      const mid = window.innerHeight / 2;
      const current = els.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      });
      (current.length ? current : els.slice(0, 1)).forEach(activate);
    });
    return () => {
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
    };
  }, [pathname]);

  return (
    <TransitionProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {gl && <Scene />}
      <Nav />
      <main id="main" className="main">
        {children}
      </main>
      <Footer />
      <Hud />
      <Cursor />
    </TransitionProvider>
  );
}
