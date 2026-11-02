'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { store, setReady, setEntered, emit } from '@/lib/store';
import { WORDMARK } from '@/lib/logo-paths';
import { caseStudies } from '@/lib/content';

const NavigateContext = createContext(() => {});
export const useNavigate = () => useContext(NavigateContext);

const LABELS = { '/': 'Home', '/work': 'Work', '/about': 'About', '/contact': 'Contact' };

function labelFor(pathname) {
  if (LABELS[pathname]) return LABELS[pathname];
  const slug = pathname.split('/').filter(Boolean).pop();
  return caseStudies.find((c) => c.slug === slug)?.client ?? 'Zerror';
}

const cellsOf = (root) => root.querySelectorAll('.tr__cell');

// Animate the grid in or out, then hand the resting state back to CSS (data-covered),
// so cells re-rendered later (e.g. after a resize) always match it.
function animateCells(root, covered, opts = {}) {
  const cells = cellsOf(root);
  return gsap.fromTo(
    cells,
    { scale: covered ? 0 : 1.02 },
    {
      scale: covered ? 1.02 : 0,
      duration: covered ? 0.55 : 0.65,
      ease: 'zr.inOut',
      stagger: { each: cells.length > 60 ? 0.006 : 0.012, from: 'random' },
      ...opts,
      onComplete: () => {
        root.dataset.covered = String(covered);
        gsap.set(cellsOf(root), { clearProps: 'transform' });
        opts.onComplete?.();
      },
    },
  );
}

// One pixel grid does both jobs: it is the preloader on first visit and the
// page transition afterwards (cells fill in at random, the route swaps, cells clear).
export function TransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef(null);
  const busy = useRef(true);
  const pendingHash = useRef('');
  const prevPath = useRef(pathname);
  const [grid, setGrid] = useState({ cols: 12, rows: 7 });
  const [label, setLabel] = useState('');

  useEffect(() => {
    const measure = () => {
      const { innerWidth: w, innerHeight: h } = window;
      if (!w || !h) return;
      const cols = w < 700 ? 6 : 12;
      setGrid({ cols, rows: Math.max(1, Math.ceil(h / (w / cols))) });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Preloader. A context + revert keeps the intro safe under StrictMode's double effects.
  useEffect(() => {
    let cancelled = false;
    const el = root.current;
    const ctx = gsap.context(() => {
      const count = el.querySelector('.loader__count');
      const counter = { v: 0 };
      const intro = gsap.timeline();
      intro
        .from('.loader__mark path', { yPercent: 60, opacity: 0, duration: 0.9, stagger: 0.07 })
        .from('.loader__meta > *', { opacity: 0, y: 10, duration: 0.6, stagger: 0.08 }, 0.2)
        .to(counter, {
          v: 100,
          duration: 1.7,
          ease: 'power2.inOut',
          onUpdate: () => {
            count.textContent = String(Math.round(counter.v)).padStart(3, '0');
          },
        }, 0);

      const introDone = new Promise((resolve) => intro.eventCallback('onComplete', resolve));
      Promise.all([document.fonts?.ready ?? Promise.resolve(), introDone]).then(() => {
        if (cancelled) return;
        // Outside the context on purpose: the exit must finish even if React re-runs effects.
        gsap.to(el.querySelector('.loader'), {
          opacity: 0,
          y: -24,
          duration: 0.5,
          ease: 'zr.inOut',
          onComplete: () => {
            el.querySelector('.loader').style.display = 'none';
            setReady();
            gsap.delayedCall(0.15, setEntered);
            animateCells(el, false, {
              onComplete: () => {
                el.style.pointerEvents = 'none';
                busy.current = false;
              },
            });
          },
        });
      });
    }, root);
    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  const navigate = useCallback(
    (href, customLabel) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        store.lenis?.scrollTo(url.hash || 0, { duration: 1.4 });
        return;
      }
      if (busy.current) return;
      busy.current = true;
      store.transitioning = true;
      pendingHash.current = url.hash;
      setLabel(customLabel || labelFor(url.pathname));
      store.lenis?.stop();
      emit('navigate', url.pathname);
      const el = root.current;
      el.style.pointerEvents = 'auto';
      animateCells(el, true, {
        onComplete: () => {
          gsap.fromTo(
            el.querySelector('.tr__label span'),
            { yPercent: 110, y: 0, autoAlpha: 1 },
            { yPercent: 0, duration: 0.55, onComplete: () => router.push(url.pathname, { scroll: false }) },
          );
        },
      });
    },
    [router],
  );

  // Route changed: reset scroll, then uncover.
  useEffect(() => {
    // Compare against the last path (not a first-run flag) so StrictMode's re-run is a no-op.
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    window.scrollTo(0, 0);
    store.lenis?.scrollTo(0, { immediate: true, force: true });
    if (!busy.current) {
      // Browser back/forward: no cover animation.
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }
    const el = root.current;
    const labelEl = el.querySelector('.tr__label span');
    const tween = gsap.to(labelEl, {
      yPercent: -110,
      y: 0,
      duration: 0.5,
      delay: 0.2,
      ease: 'zr.inOut',
      onComplete: () => {
        gsap.set(labelEl, { autoAlpha: 0 });
        ScrollTrigger.refresh();
        if (pendingHash.current) store.lenis?.scrollTo(pendingHash.current, { immediate: true, force: true });
        store.lenis?.start();
        setEntered();
        animateCells(el, false, {
          onComplete: () => {
            el.style.pointerEvents = 'none';
            busy.current = false;
          },
        });
      },
    });
    return () => tween.kill();
  }, [pathname]);

  return (
    <NavigateContext.Provider value={navigate}>
      {children}
      <div
        ref={root}
        className="tr"
        data-covered="true"
        aria-hidden="true"
        style={{ '--cols': grid.cols, '--rows': grid.rows }}
      >
        <div className="tr__grid">
          {Array.from({ length: grid.cols * grid.rows }, (_, i) => (
            <span key={i} className="tr__cell" />
          ))}
        </div>
        <div className="tr__label">
          <div className="tr__label-mask">
            <span>{label}</span>
          </div>
        </div>
        <div className="loader">
          <svg className="loader__mark" viewBox={`0 0 ${WORDMARK.width} ${WORDMARK.height}`} role="img" aria-label="Zerror">
            {WORDMARK.letters.map((d, i) => (
              <path key={i} d={d} fillRule="evenodd" />
            ))}
          </svg>
          <div className="loader__meta">
            <span>Systems. Structure. Precision.</span>
            <span className="loader__count">000</span>
          </div>
        </div>
      </div>
    </NavigateContext.Provider>
  );
}
